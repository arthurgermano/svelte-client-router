// @ts-nocheck
import { assign } from "../helpers/index.js";
import { routesStore, configStore, coreStore } from "../stores/index.js";
import {
  getLocationProperties,
  getPath,
  getHashFromPath,
  getRealPath,
  treatRoutePathParams,
  treatRouteAnyRouteParams,
  getQueryParameters,
  asyncLoadComponentsFunc,
  setPathQueryParameters,
} from "./baseFunctions.js";

// ------------------------------------------------------------------------------------------------

// constants
const HASH_PARAM_CHAR = "#/";
const PATH_PARAM_CHAR = "/:";
const ANY_ROUTE_PARAM_CHAR = "*";

// ------------------------------------------------------------------------------------------------

// properties
let BEF_PAYLOAD = {}; // controls the BEFORE_ENTER payload property
let NOT_FOUND;
let MODE = "NEW"; // this variable helps to define history in the browser

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Mounts Svelte Component - Router.svelte
/          - Sets object routes
/          - Loads Default Loading Components
/          - Loads Location Route          
*/
export async function onMountComponent(params = {}) {
  try {
    // loading routes
    routesStore.setRoutes(params.routes);

    // loading Default Loading Component
    if (
      params.defaultLoadingComponent &&
      typeof params.defaultLoadingComponent === "function"
    ) {
      coreStore.setDefaultLoadingComponent(params.defaultLoadingComponent);
      coreStore.setDefaultLoadingParams(params.defaultLoadingParams);
    }
    if (params.defaultNotFoundComponent) {
      coreStore.setDefaultNotFoundComponent(params.defaultNotFoundComponent);
    }
    await loadRoute(getRouteObjectFromPath(location.href));
  } catch (error) {
    await throwError(error);
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Receives a route to be load and a mode 
/          - Loads a route if found or loads a not found route
/          - Executes Before Enter Array and Redirects
/          - Sets history of browser depending of the mode
*/
export async function loadRoute(routeObj, mode = "NEW") {
  try {
    MODE = mode;
    if (checkSameRoute(routeObj)) {
      return;
    }
    const fromRoute = getRouteFrom();
    const loadComponent = await asyncLoadComponentsFunc(
      [
        routeObj.definition.lazyLoadLoadingComponent,
        routeObj.definition.loadingComponent,
      ],
      coreStore.getDefaultLoadingComponent()
    );
    coreStore.setLoadingComponent(loadComponent);
    coreStore.setLoadingParams(
      assign(
        {},
        {
          ...coreStore.getDefaultLoadingParams(),
          toRoute: routeObj,
          fromRoute,
          queryParams: routeObj.queryParams,
          pathParams: routeObj.pathParams,
          params: routeObj.params,
          loadingParams: routeObj.definition.loadingParams,
        }
      )
    );

    // this keeping loading component waiting for the frontend
    // renders the component and pass the variables
    coreStore.setIsLoading(true);

    routeObj = await verifyRouteBEF(routeObj, fromRoute);
    await finishLoadingRoute(routeObj, fromRoute);
  } catch (error) {
    if (
      routeObj &&
      routeObj.definition &&
      routeObj.definition.onError &&
      typeof routeObj.definition.onError == "function"
    ) {
      return routeObj.definition.onError(error);
    }
    throw error;
  } finally {
    MODE = "NEW";
    coreStore.setIsLoading(false);
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Verify Before Enter - Executing all BEF defined and checking for redirects 
/ @Returns - Route Object
*/
export async function verifyRouteBEF(routeObj, fromRoute) {
  try {
    let checkingBEF = true;
    let checkingSafetyCount = configStore.getMaxRedirectBeforeEnter();
    BEF_PAYLOAD = {};
    while (checkingBEF) {
      if (routeObj.name == "SCR_NOT_FOUND_ROUTE") {
        break;
      }
      if (checkingSafetyCount-- < 0) {
        checkingBEF = false;
        throw new Error(
          `SCR: Max redirects achieved ${configStore.getMaxRedirectBeforeEnter()} - too many redirects on before enter function. See configuration MaxRedirectBeforeEnter for more info.`
        );
      }
      const retCheck = await checkBEFList(routeObj, fromRoute);
      if (!retCheck.isToContinue) {
        // it just stops should finish loading
        return false;
      }

      // user redirected to some other route
      if (retCheck.isToRedirect) {
        const oldRoute = routeObj;
        if (retCheck.name) {
          routeObj = getRouteObjectFromName(retCheck);
        } else if (retCheck.path || retCheck.redirect) {
          routeObj = getRouteObjectFromPath(retCheck.path || retCheck.redirect);
        }
        routeObj.redirected = oldRoute;
        continue;
      }
      checkingBEF = false;
    }

    return routeObj;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Finishes loading a route - setting route history - changing it in the browser
*/
export async function finishLoadingRoute(routeObj, fromRoute) {
  try {
    // resolved as false - do not continue to load route!
    if (!routeObj) {
      return false;
    }
    // if user defined some action before finalizeRoute
    if (
      routeObj.definition.afterEnter &&
      typeof routeObj.definition.afterEnter === "function"
    ) {
      await routeObj.definition.afterEnter(
        assign(
          {},
          {
            toRoute: routeObj,
            fromRoute,
            payload: BEF_PAYLOAD,
          }
        )
      );
    }

    const routeId = generateRouteId(routeObj.name);
    routeObj.routeId = routeId;
    routesStore.setCurrentRoute(routeObj);
    routesStore.setLastRoute(fromRoute);

    // getting component if defined
    let component;
    if (routeObj.name !== "SCR_NOT_FOUND_ROUTE") {
      component = await asyncLoadComponentsFunc(
        [routeObj.definition.lazyLoadComponent, routeObj.definition.component],
        false
      );
    } else {
      const defaultNotFoundComponent = coreStore.getDefaultNotFoundComponent();
      if (defaultNotFoundComponent) {
        component = defaultNotFoundComponent;
      } else {
        component = await asyncLoadComponentsFunc(
          [() => import("../components/SCR_NotFound.svelte")],
          false
        );
      }
    }
    coreStore.setCurrentParams({
      toRoute: routeObj,
      fromRoute,
      queryParams: routeObj.queryParams,
      pathParams: routeObj.pathParams,
      params: { ...routeObj.params, payload: { ...BEF_PAYLOAD } },
      notFound: NOT_FOUND ? NOT_FOUND : undefined,
    });
    coreStore.setCurrentComponent(component);

    // the component is loaded all is done we must show the component loaded
    coreStore.setIsLoading(false);

    // setting route title if defined
    if (routeObj.definition.title) {
      document.title = routeObj.definition.title;
    }

    // scroll to position if enabled
    if (configStore.getUseScroll() && !routeObj.definition.ignoreScroll) {
      let scrollProps = configStore.getScrollProps();
      if (routeObj.definition.scrollProps) {
        scrollProps.top = routeObj.definition.scrollProps.top;
        scrollProps.left = routeObj.definition.scrollProps.left;
        scrollProps.behavior = routeObj.definition.scrollProps.behavior;
        scrollProps.timeout = routeObj.definition.scrollProps.timeout;
      }

      setTimeout(() => {
        let element;
        if (scrollProps.target) {
          element = document.getElementById(scrollProps.target);
        }
        if (element) {
          element.scrollTo(scrollProps);
        } else {
          window.scrollTo(scrollProps);
        }
      }, scrollProps.timeout);
    }

    routesStore.pushNavigationHistory(routeObj);
    setHistory(routeObj, fromRoute);
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Checking the route relevance against the route being searched
/ @Returns - Returns a value indicating how strong the relevance of the route - the greater more relevant
*/
export function checkRouteRelevance(realPath, routePath, pathParams) {
  try {
    if (!realPath || typeof realPath !== "string" || realPath === "") {
      return false;
    }
    if (!routePath || typeof routePath !== "string" || routePath === "") {
      return false;
    }
    const realPathSplitted = realPath.split("/");
    const routePathSplitted = routePath.split("/");
    if (realPathSplitted.length !== routePathSplitted.length) {
      return false;
    }

    let relevance = 1;
    for (let i = 0; i < realPathSplitted.length; i++) {
      // it is path param - just skip
      // we can't say with path params if it is correct or not
      if (routePathSplitted[i].charAt(0) === ":") {
        pathParams[routePathSplitted[i].slice(1)] = realPathSplitted[i];
        continue;
      }

      // if includes any route char - must match all the string before it
      // different from path params anything can be here so it is more likely to match
      if (routePathSplitted[i].includes(ANY_ROUTE_PARAM_CHAR)) {
        if (routePathSplitted[i] === ANY_ROUTE_PARAM_CHAR) {
          relevance += 1;
          continue;
        }

        // if it has a prefix like somePrefix* - checking if it matches the prefix part
        const partLength = routePathSplitted[i].length - 1;
        if (
          realPathSplitted[i].substring(0, partLength) !==
          routePathSplitted[i].substring(0, partLength)
        ) {
          return false;
        }

        // any route param is matching ok, but it can match a path
        // param too by mistake for that the relevance pump is low
        relevance += 1;
        continue;
      }
      if (realPathSplitted[i] !== routePathSplitted[i]) {
        return false;
      }

      // it is matching so far so good so we should pump a little more
      relevance += 5;
    }
    return relevance;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Find a route declared by name
/ @Returns - Returns a route found object or not found route as object
*/
export function findRoutePerName(routeName) {
  try {
    if (!routeName || typeof routeName !== "string" || routeName === "") {
      return false;
    }
    const routes = routesStore.getRoutes();
    let routeMatched;
    for (let route of routes) {
      if (routeName === route.name) {
        return route;
      }

      // any routes defined - always match this route
      // but continue searching for a best match route
      if (route.path === ANY_ROUTE_PARAM_CHAR) {
        routeMatched = route;
        continue;
      }
    }
    if (routeMatched) {
      return routeMatched;
    }
    return routesStore.getNotFoundRoute();
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Find a route declared by path
/ @Returns - Returns a route found object or not found route as object
*/
export function findRoutePerPath(path) {
  try {
    const realPath = getRealPath(path);
    const routes = routesStore.getRoutes();
    let routesMatched = [];
    let pathParams;
    for (let route of routes) {
      // any routes defined - always match this route
      if (route.path === ANY_ROUTE_PARAM_CHAR) {
        routesMatched.push({ route, relevance: 0 });
        continue;
      }

      const realRoutePath = getRealPath(route.path);
      // Are the routes the same string ?
      if (realPath === realRoutePath) {
        return route;
      }

      // if realRoutePath has path param char must search in a special way
      // defined in checkRouteRelevance
      pathParams = {};
      const routeRelevance = checkRouteRelevance(
        realPath,
        realRoutePath,
        pathParams
      );
      if (routeRelevance !== false) {
        routesMatched.push({
          route: { ...route, pathParams },
          relevance: routeRelevance,
        });
      }
    }
    if (routesMatched.length == 0) {
      return routesStore.getNotFoundRoute();
    }
    if (routesMatched.length == 1) {
      return routesMatched[0].route;
    }

    // checking route with the greater relevance
    let bestRouteMatch = routesMatched[0];
    for (let routeMatch of routesMatched.slice(1)) {
      if (bestRouteMatch.relevance <= routeMatch.relevance) {
        bestRouteMatch = routeMatch;
      }
    }
    return bestRouteMatch.route;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Set and execute global and route before enter functions
/ @Returns - Returns a object specifying if we must finish executing, redirect or just ignore route
*/
export async function checkBEFList(routeObj, routeFrom) {
  try {
    const befExecList = getOrderedBeforeEnterFunctionList(routeObj);
    let retCode = {
      isToContinue: true,
    };
    if (befExecList.first.length > 0) {
      retCode = await executeBEFunctionList(
        routeObj,
        befExecList.first,
        routeFrom
      );
    }
    if (retCode.isToRedirect || !retCode.isToContinue) {
      return retCode;
    }
    if (befExecList.then.length > 0) {
      retCode = await executeBEFunctionList(
        routeObj,
        befExecList.then,
        routeFrom
      );
    }
    return retCode;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Executes all Before Functions defined
/ @Returns - Returns a object specifying if we must finish executing, redirect or just ignore route
*/
export async function executeBEFunctionList(routeObj, BEFList, routeFrom) {
  try {
    for (let func of BEFList) {
      // checking if BEF_PAYLOAD was redefined - if so it will lose its main function
      // to pass variables between before enter functions
      if (!BEF_PAYLOAD || typeof BEF_PAYLOAD !== "object") {
        BEF_PAYLOAD = {};
        if (configStore.getConsoleLogErrorMessages()) {
          console.error(
            "SCR_ROUTER: Payload property was redefined in before enter function."
          );
        }
      }

      // executing before enter function
      const funcRet = await new Promise(async function (resolve, reject) {
        try {
          await func(
            {
              resolve,
              reject,
              routeTo: assign({}, routeObj),
              routeFrom: assign({}, routeFrom),
            },
            BEF_PAYLOAD
          );
        } catch (error) {
          resolve({ SCR_ROUTE_ERROR: true, error });
        }
      });

      // continue to the next beforeEnter Function
      if (funcRet === true) {
        continue;
      }

      // must stop execution
      if (!funcRet) {
        return {
          isToContinue: false,
        };
      }

      // some error has occurred
      if (funcRet.SCR_ROUTE_ERROR) {
        throw (
          funcRet.error ||
          new Error(
            "SCR_ROUTER: An error has occurred on before function execution."
          )
        );
      }

      // redirection defined by redirect or path
      if (funcRet && (funcRet.path || funcRet.redirect)) {
        return {
          isToContinue: true,
          isToRedirect: true,
          path: funcRet.path || funcRet.redirect,
        };
      }

      // redirection defined by name
      if (funcRet && funcRet.name) {
        return {
          isToContinue: true,
          isToRedirect: true,
          name: funcRet.name,
          pathParams: assign({}, funcRet.pathParams || {}),
          queryParams: assign({}, funcRet.queryParams || {}),
          anyRouteParam: assign({}, funcRet.anyRouteParam || []),
        };
      }
    }

    // all have run fine finish loading route
    return {
      isToContinue: true,
    };
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Checks if there is just one before function or is an array filtering to only executable functions
/ @Returns - Returns an array of valid before functions to be executed
*/
export function getBeforeEnterAsArray(beforeEnterFuncs) {
  try {
    if (Array.isArray(beforeEnterFuncs)) {
      return beforeEnterFuncs.filter(
        (befItem) => typeof befItem === "function"
      );
    }
    if (typeof beforeEnterFuncs === "function") {
      return [beforeEnterFuncs];
    }
    return [];
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Order the before enter execution of a given route
/ @Returns - Returns an ordered array of before functions to be executed
*/
export function getOrderedBeforeEnterFunctionList(routeObj) {
  try {
    let routeBEFList = [];
    let globalBEFList = configStore.getBeforeEnter();
    let isToExecuteGlobalThenRoute = true;

    // checking if route has before enter functions defined
    // and if it should execute it before global before functions
    if (routeObj && typeof routeObj === "object" && routeObj.definition) {
      routeBEFList = getBeforeEnterAsArray(routeObj.definition.beforeEnter);
      if (routeObj.definition.ignoreGlobalBeforeFunction) {
        globalBEFList = [];
      }
      if (routeObj.definition.executeRouteBEFBeforeGlobalBEF) {
        isToExecuteGlobalThenRoute = false;
      }
    }

    // return ordering of execution
    if (isToExecuteGlobalThenRoute) {
      return assign(
        {},
        {
          first: globalBEFList,
          then: routeBEFList,
        }
      );
    }
    return assign(
      {},
      {
        first: routeBEFList,
        then: globalBEFList,
      }
    );
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Mounts a route object of a given path
/ @Returns - Returns a route object of a given path
*/
export function getRouteObjectFromPath(path) {
  try {
    if (!path || typeof path !== "string") {
      path = "/";
    }

    // hash part of the path
    const hash = getHashFromPath(path);

    // checking if is hash mode - if so we must consider the hash part the path
    // but we must not forget that the locations pathname property must be included as well
    // when setting the history this is set or not!
    if (configStore.getHashMode() && path.includes(HASH_PARAM_CHAR) && hash) {
      path = hash.replace("/#", "");
      path = path.replace("#", "");
    }

    let queryParams = {};
    if (path.includes("?")) {
      queryParams = getQueryParameters(path);
      path = path.split("?");
      path = path[0];
    }

    path = getPath(path);
    const routeObj = findRoutePerPath(path);
    NOT_FOUND = undefined;
    if (routeObj.name === "SCR_NOT_FOUND_ROUTE") {
      NOT_FOUND = { path };
      path = routeObj.path;
    }

    const { protocol, host, port, origin } = getLocationProperties(path);
    return {
      fullPath: setPathQueryParameters(path, queryParams),
      path,
      pathname: location.pathname,
      queryParams,
      host,
      protocol,
      port,
      origin,
      hash,
      name: routeObj.name,
      pathParams: assign({}, routeObj.pathParams),
      params: assign({}, routeObj.params),
      definition: assign({}, routeObj),
    };
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Mounts a route object of a given object with name property set
/ @Returns - Returns a route object of a given object with name property set
*/
export function getRouteObjectFromName(obj) {
  try {
    let path = "/";
    if (!obj || typeof obj !== "object") {
      obj = {};
    }
    const { protocol, host, port, origin } = getLocationProperties(path);
    const routeObj = findRoutePerName(obj.name || "SCR_NOT_FOUND_ROUTE");

    NOT_FOUND = undefined;
    if (routeObj.name == "SCR_NOT_FOUND_ROUTE") {
      NOT_FOUND = { name: obj.name || "Route name not informed" };
      return {
        fullPath: configStore.getNotFoundRoute(),
        path: configStore.getNotFoundRoute(),
        pathname: location.pathname,
        queryParams: obj.queryParams || {},
        host,
        protocol,
        port,
        origin,
        hash: "",
        name: routeObj.name,
        pathParams: obj.pathParams || {},
        params: routeObj.params || {},
        definition: routeObj,
      };
    }

    // filling the path params in the route path
    path = routeObj.path;
    if (routeObj.path.includes(PATH_PARAM_CHAR)) {
      path = treatRoutePathParams(path, obj.pathParams);
    }

    // filling the any route params in the route path
    if (routeObj.path.includes(ANY_ROUTE_PARAM_CHAR)) {
      path = treatRouteAnyRouteParams(path, obj.anyRouteParams);
    }

    return {
      fullPath: setPathQueryParameters(path, obj.queryParams || {}),
      path,
      pathname: location.pathname,
      queryParams: obj.queryParams || {},
      host,
      protocol,
      port,
      origin,
      hash: "",
      name: routeObj.name,
      pathParams: assign({}, routeObj.pathParams),
      params: assign({}, routeObj.params),
      definition: assign({}, routeObj),
    };
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Throws a Global Error inside this component - all errors are funneled to this method if
/          - route error or navigation errors weren't defined
/ @Throws  - Errors of entire SCR
*/
export async function throwError(error) {
  try {
    await configStore.getOnError()(error);
  } catch (err) {
    if (configStore.getConsoleLogErrorMessages()) {
      console.error(error);
      console.error(err);
    }
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Generates a route id with time stamp and a ramdom number
/ @Returns - Generated id as string
*/
export function generateRouteId(routeId = "scr") {
  return `${new Date().getTime()}_${routeId}_${
    Math.pow(10, 17) * Math.random()
  }`;
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Sets browser history and changes route to it as location as well
*/
export function setHistory(routeObj, fromRoute) {
  try {
    const isHashMode = configStore.getHashMode();

    // retrieving full path - considering if is hash mode or not
    // if is hash mode we have to consider the following
    // - pathname and then the path to route with hash
    // - for example http://example.com/test/#/some/path/to
    // - we have to redirect always to the same point
    // - http://example.com/test/ and NOT http://example.com
    const fullPath =
      (isHashMode ? `${location.pathname}#/` : "/") +
      routeObj.fullPath.slice(1);

    // if mode is new the user is pushing or navigating using the router
    // the event that generated this routing came from SCR so we should push
    // the state inside the history object
    if (MODE == "NEW") {
      history.pushState(
        {
          currentRoute: {
            fullPath: routeObj.fullPath,
            routeId: routeObj.routeId,
          },
          fromRoute: {
            fullPath: fromRoute.fullPath,
            routeId: fromRoute.routeId,
          },
        },
        null,
        fullPath
      );

      // the event came from browser so we should replace only
      // and with that not creating a new history state
    } else {
      history.replaceState(
        {
          currentRoute: {
            fullPath: routeObj.fullPath,
            routeId: routeObj.routeId,
          },
          fromRoute: {
            fullPath: fromRoute.fullPath,
            routeId: fromRoute.routeId,
          },
        },
        null,
        fullPath
      );
    }
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

// listening events from browser navigation buttons back and forward!
window.addEventListener("popstate", async (event) => {
  const state =
    event && event.state && event.state.currentRoute ? event.state : false;

  // we don't know if the route of this event were pushed by SCR or user coming from somewhere else
  let navigateRoute = location.href;

  // if state is defined it is route pushed by SCR and we can safely return to it
  // by doing this we have all the information with path and query params
  if (state) {
    navigateRoute = event.state.currentRoute.fullPath;
  }

  try {
    await loadRoute(getRouteObjectFromPath(navigateRoute), "POPEVENT");
  } catch (error) {
    throwError(error);
  }
});

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Checking the last route known object
/ @Returns - Returns the last route known object or false
*/
function getRouteFrom() {
  try {
    let currentRoute = routesStore.getCurrentRoute();
    if (currentRoute.name) {
      return currentRoute;
    }
    currentRoute = routesStore.getLastRoute();
    if (currentRoute.name) {
      return currentRoute;
    }
    return false;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Checking if the route being pushed is already pushed - checks by full path
/ @Returns - Returns if this route being pushed to should be pushed or not
/          - false - Identifies as not the same route - different route
/          - true  - The same route should NOT continue routing 
*/
function checkSameRoute(routeTo) {
  try {
    if (!routeTo || !routeTo.definition) {
      return false;
    }
    if (routeTo.definition.forceReload) {
      return false;
    }

    let currentRoute = routesStore.getCurrentRoute();
    if (!currentRoute || !currentRoute.fullPath) {
      return false;
    }
    if (currentRoute.fullPath != routeTo.fullPath) {
      return false;
    }
    return true;
  } catch (error) {
    throw error;
  }
}
