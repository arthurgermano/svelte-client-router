<script>
  // -----------------  Import Variables  ----------------------------------------------

  import { onMount } from "svelte";
  import { assign } from "../js/functions.js";
  import * as LS from "../plugins/lsplugin.js";
  import * as LF from "../plugins/lfplugin.js";
  import configStore from "../js/store/config.js";
  import routerStore from "../js/store/router.js";
  import navigateStore from "../js/store/navigate.js";
  import LoadingController from "../js/helpers/loadingController.js";
  import SCR_NotFound from "./SCR_NotFound.svelte";
  import SCR_Loading from "./SCR_Loading.svelte";
  import SCR_Error from "./SCR_Error.svelte";
  import SCR_Layout from "./SCR_Layout.svelte";
  import { document } from "lodash/_freeGlobal";

  // ------------------------------------------------------------------------------------
  // -----------------  Export Variables  -----------------------------------------------

  export let routes;
  export let notFoundComponent = SCR_NotFound;
  export let errorComponent = SCR_Error;
  export let defaultLayoutComponent = SCR_Layout;
  export let loadingComponent = SCR_Loading;
  export let allProps = {};
  export let allLoadingProps = {};

  // ------------------------------------------------------------------------------------
  // -----------------  Local Variables  ------------------------------------------------

  let props = {};
  let loadingProps = {};
  let currentComponent;
  let currentLocation;
  let loadingPromise;
  let layoutComponent = defaultLayoutComponent;
  let loadingController = new LoadingController();
  let isBacking = false;

  // -----------------------------------------------------------------------------------
  // -----------------  function getBeforeEnterAsArray  --------------------------------

  function getBeforeEnterAsArray(beforeEnterFuncOrArr) {
    if (!beforeEnterFuncOrArr) {
      return [];
    }
    if (Array.isArray(beforeEnterFuncOrArr)) {
      return beforeEnterFuncOrArr;
    }
    if (typeof beforeEnterFuncOrArr === "function") {
      return [beforeEnterFuncOrArr];
    }
    return [];
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function pushRoute  --------------------------------------------

  function pushRoute(route, popEvent = true) {
    const routePath = ($configStore.hashMode ? "#" : "") + route;
    if (history.pushState && !isBacking) {
      history.pushState(null, null, routePath);
    } else {
      location.hash = routePath;
    }
    isBacking = false;
    if (popEvent) {
      window.dispatchEvent(new Event("popstate"));
    }
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function getUrlParameter  --------------------------------------

  function getUrlParameter(url) {
    let getParams = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      getParams[key] = value;
    });
    return getParams;
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function getLocation  ------------------------------------------

  function getLocation() {
    let pathname = location.pathname;
    if ($configStore.hashMode && location.hash) {
      pathname = location.hash.slice(1);
    }
    currentLocation = {
      pathname,
      params: getUrlParameter(location.href),
      hostname: location.hostname,
      protocol: location.protocol,
      port: location.port,
      origin: location.origin,
      hash: location.hash,
    };
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function getRouteParams  ---------------------------------------

  function getRouteParams(routeObj, customParams) {
    props = {};
    if (routeObj && routeObj.params) {
      props = {
        payload: routeObj.payload,
        ...routeObj.params,
        ...assign({}, allProps),
      };
    }
    props = {
      ...props,
      ...customParams,
      currentRoute: {
        ...currentLocation,
        name: routeObj.name,
        pathname: routeObj.path,
      },
      fromRoute: $routerStore.fromRoute,
    };
    return props;
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function setErrorComponent  ------------------------------------

  function setErrorComponent(errorMessage, error, routeObj) {
    currentComponent = errorComponent;
    getRouteParams(routeObj, { errorMessage });
    if (error && $configStore.consoleLogErrorMessages) {
      console.error(error);
    }
    return pushRoute($configStore.errorRoute, false);
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function throwRouteError  --------------------------------------

  function throwRouteError(routeObj, error) {
    if (routeObj.onError && typeof routeObj.onError === "function") {
      routeObj.onError(error, getRouteParams(routeObj));
      return setErrorComponent(
        `SCR_ROUTER - Caught an error: ${error}!`,
        error,
        routeObj
      );
    }
    throw `Error on route (${routeObj.name} - ${routeObj.path}) - ${error}!`;
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function loadRoute  --------------------------------------------

  async function loadRoute(routeObj, isLoading = true) {
    try {
      getLocation();
      if (
        routeObj &&
        !routeObj.forceReload &&
        currentLocation.pathname === routeObj.path
      ) {
        return;
      }

      layoutComponent = false;

      if (currentLocation.pathname === $configStore.errorRoute) {
        currentComponent = errorComponent;
        return;
      }

      // searching route from routes definition if not defined
      if (!routeObj) {
        routeObj = $routerStore.routes.find(
          (routeItem) =>
            routeItem.path == currentLocation.pathname ||
            ($configStore.considerTrailingSlashOnMatchingRoute &&
              routeItem.path + "/" == currentLocation.pathname)
        );
      } else {
        if (routeObj.notFound) {
          await routerStore.setCurrentLocation(routeObj.path);
          return pushRoute($configStore.notFoundRoute);
        }
      }

      // route not found - must redirect to NOT FOUND
      if (!routeObj) {
        currentComponent = notFoundComponent;

        // if current pathname is different not found route definition
        if (currentLocation.pathname != $configStore.notFoundRoute) {
          await routerStore.setCurrentLocation(currentLocation.pathname);
          return pushRoute($configStore.notFoundRoute);
        }
        return false;
      }

      // setting loading property
      loadingPromise = loadingController.startLoading();
      loadingProps = {
        ...assign({}, allLoadingProps),
      };
      if (routeObj.loadingProps) {
        loadingProps = {
          ...loadingProps,
          ...routeObj.loadingProps,
          ...getRouteParams(routeObj)
        };
      }

      await routerStore.setCurrentLocation(currentLocation.pathname);

      const configBERs = configStore.getBeforeEnter();

      // checking if the this route has beforeEnter functions to execute
      if (
        !routeObj.beforeEnter &&
        (!configBERs || routeObj.ignoreGlobalBeforeFunction)
      ) {
        return await finalizeRoute(routeObj, isLoading);
      }

      const beforeEnterRoute = getBeforeEnterAsArray(routeObj.beforeEnter);

      // execute each beforeEnter function before finalizeRoute
      // if is set to ignore global before functions
      if (routeObj.ignoreGlobalBeforeFunction) {
        await executeBeforeEnterFunctions(
          routeObj,
          beforeEnterRoute,
          isLoading
        );
      } else {
        // if executeRouteBEFBeforeGlobalBEF is set then must run routeBeforeEnter
        // before globalBeforeEnter
        const beforeEnterGlobal = getBeforeEnterAsArray(configBERs);
        const beforeEnterArr = routeObj.executeRouteBEFBeforeGlobalBEF
          ? [...beforeEnterRoute, ...beforeEnterGlobal]
          : [...beforeEnterGlobal, ...beforeEnterRoute];

        await executeBeforeEnterFunctions(routeObj, beforeEnterArr, isLoading);
      }
    } catch (error) {
      loadingController.resolveLoading();
      if (configStore.getOnError()) {
        configStore.getOnError()(error, getRouteParams(routeObj));
      }
      setErrorComponent(`SCR_ROUTER - ${error}!`, error, routeObj);
    } finally {
      loadingController.resolveLoading();
    }
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function executeBeforeEnterFunctions  --------------------------

  async function executeBeforeEnterFunctions(
    routeObj,
    beforeEnterArr,
    isLoading
  ) {
    // params passed down to the components and before execute functions
    const routeFrom = assign({}, $routerStore.currentRoute);
    const routeTo = assign({ name: routeObj.name }, currentLocation);

    // response from beforeEnter function
    // true - go ahead
    // false - stop execution and remain where it is
    // { redirect: "" } - redirect to somewhere else -- local
    // { path: "" } - redirect to somewhere else -- local - base on route
    // { name: "" } - redirect to somewhere else -- local - base on name
    let resFunc;

    // object merge params with custom route params defined
    let routeObjParams;
    routeObj.payload = {};
    for (let bFunc of beforeEnterArr) {
      // beforeEnter Function is not a function throw an error
      if (!bFunc || typeof bFunc !== "function") {
        throw new Error(
          `SCR_ROUTER - Before Enter Function of route (${routeObj.name} - ${routeObj.path}) is not a function!`
        );
      }

      // promisify each beforeEnter
      resFunc = await new Promise(async (resolve, reject) => {
        try {
          // passing down the router params defined in the router object
          routeObjParams = undefined;
          if (routeObj.params) {
            routeObjParams = {
              ...routeObj.params,
            };
          }

          // executing beforeEnter Functions GLOBAL And Route Specific
          await bFunc(
            resolve,
            routeFrom,
            routeTo,
            routeObjParams,
            routeObj.payload
          );

          // reseting payload if destroyed
          if (!routeObj.payload) {
            routeObj.payload = {};
            if ($configStore.consoleLogErrorMessages) {
              console.warn("SCR_ROUTER - Payload property were redefined");
            }
          }

          // updating props and passing to all components!
          getRouteParams(routeObj);
        } catch (error) {
          resolve({ SCR_ROUTE_ERROR: true, error });
        }
      });

      // continue to the next beforeEnter Function
      if (resFunc === true) {
        continue;
      }

      // stop execution
      if (!resFunc) {
        return pushRoute($routerStore.currentRoute.pathname);
      }

      if (resFunc.SCR_ROUTE_ERROR) {
        // each route can define an error function and if it is defined... execute it
        return throwRouteError(routeObj, resFunc.error);
      }

      // redirection defined by redirect or path
      if (resFunc && (resFunc.redirect || resFunc.path)) {
        return pushRoute(resFunc.redirect || resFunc.path);
      }

      // redirection defined by name
      if (resFunc && resFunc.name) {
        const findRoute = $routerStore.routes.find(
          (rItem) => rItem.name === resFunc.name
        );

        // route name not found thrown error!
        if (!findRoute) {
          let notFoundRouteName = new Error(
            `Error not found route name (${resFunc.name})`
          );
          return throwRouteError(routeObj, notFoundRouteName);
        }
        return pushRoute(findRoute.path);
      }

      return throwRouteError(routeObj, new Error("The resolve option was not able to understand the parameters passed!"));
    }

    // finalizeRoute definitions
    return await finalizeRoute(routeObj, isLoading);
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function finalizeRoute  ----------------------------------------

  async function finalizeRoute(routeObj, isLoading = false) {
    // setting route title if defined
    if (routeObj.title) {
      document.title = routeObj.title;
    }

    // updating store info
    await routerStore.setFromRoute($routerStore.currentRoute);
    await routerStore.pushNavigationHistory($routerStore.currentRoute);
    if (!isLoading) {
      await routerStore.setCurrentRoute({
        pathname: routeObj.path,
        params: {
          ...routeObj.params,
        },
        hostname: currentLocation.hostname,
        protocol: currentLocation.protocol,
        port: currentLocation.port,
        origin: currentLocation.origin,
        hash: currentLocation.hash,
        name: routeObj.name,
      });
    } else {
      await routerStore.setCurrentRoute({
        ...currentLocation,
        name: routeObj.name,
      });
    }

    // setting component params
    const routeParams = getRouteParams(routeObj);

    // if user defined some action before finalizeRoute
    if (
      routeObj.afterBeforeEnter &&
      typeof routeObj.afterBeforeEnter === "function"
    ) {
      routeObj.afterBeforeEnter(routeParams);
    }

    if ($configStore.usesRouteLayout && !routeObj.ignoreLayout) {
      // if is lazy loading component layout component
      if (typeof routeObj.lazyLoadLayoutComponent === "function") {
        const loadedLayoutComponent = await routeObj.lazyLoadLayoutComponent();
        if (loadedLayoutComponent && loadedLayoutComponent.default) {
          layoutComponent = loadedLayoutComponent.default;
        } else {
          throw new Error(
            `Lazy Load Layout Component defined for (${routeObj.name} - ${routeObj.path}) could not be loaded`
          );
        }
      } else if (routeObj.layoutComponent) {
        layoutComponent = routeObj.layoutComponent;
      } else {
        layoutComponent = defaultLayoutComponent;
      }
    } else {
      layoutComponent = false;
    }

    // no component were defined by the user
    if (!routeObj.component && !routeObj.lazyLoadComponent) {
      throw new Error(
        `No component defined for (${routeObj.name} - ${routeObj.path})!`
      );
    }

    // if is lazy loading component now is the time to load
    if (typeof routeObj.lazyLoadComponent === "function") {
      const loadedComponent = await routeObj.lazyLoadComponent();
      if (loadedComponent && loadedComponent.default) {
        currentComponent = loadedComponent.default;
      } else {
        throw new Error(
          `Lazy Load Component defined for (${routeObj.name} - ${routeObj.path}) could not be loaded`
        );
      }
    }
    loadingController.resolveLoading();

    // scroll to position if enabled
    if ($configStore.useScroll && !routeObj.ignoreScroll) {
      let scrollProps = {
        top: $configStore.scrollProps.top || 0,
        left: $configStore.scrollProps.left || 0,
        behavior: $configStore.scrollProps.behavior || "smooth",
        timeout: $configStore.scrollProps.timeout || 10,
      };

      if (routeObj.scrollProps) {
        scrollProps.top = routeObj.scrollProps.top;
        scrollProps.left = routeObj.scrollProps.left;
        scrollProps.behavior = routeObj.scrollProps.behavior;
        scrollProps.timeout = routeObj.scrollProps.timeout;
      }

      setTimeout(() => window.scrollTo(scrollProps), scrollProps.timeout);
    }

    return pushRoute(routeObj.path, false);
  }

  // -----------------------------------------------------------------------------------
  // -----------------  function onMount  ----------------------------------------------

  onMount(async () => {
    // is to load from storages?
    if ($configStore.saveMode === "localstorage") {
      await LS.getSvelteStoreInStorage(
        routerStore.update,
        routerStore.STORAGE_KEY
      );
    } else if ($configStore.saveMode === "indexeddb") {
      await LF.getSvelteStoreInStorage(
        routerStore.update,
        routerStore.STORAGE_KEY
      );
    }

    // routes were set?
    if (routes) {
      await routerStore.setRoutes(routes);
    }

    // checking if any routes were set
    if (!$routerStore.routes || $routerStore.routes.length == 0) {
      const error = new Error("SCR_ROUTER - No routes were defined!");
      if (configStore.getOnError()) {
        configStore.getOnError()(error);
      } else {
        setErrorComponent(`SCR_ROUTER - ${error}!`, error);
      }
      currentComponent = errorComponent;

      return error;
    }

    // loading route
    isBacking = false;
    await loadRoute();
  });

  // -----------------------------------------------------------------------------------
  // -----------------  Window - eventListener popstate  -------------------------------

  window.addEventListener("popstate", async (event) => {
    isBacking = true;
    await loadRoute();
  });

  // -----------------------------------------------------------------------------------
  // -----------------  svelte_reactive - $configStore.consoleLogStores  ---------------

  $: if ($configStore.consoleLogStores && $routerStore) {
    console.log(" ----- SCR - Router Store ------------ ");
    console.log($routerStore);
    console.log(" ------------------------------------- ");
  }

  $: if ($configStore.consoleLogStores && $configStore) {
    console.log(" ----- SCR - Configuration Store ----- ");
    console.log($configStore);
    console.log(" ------------------------------------- ");
  }

  $: if ($configStore.consoleLogStores && $navigateStore) {
    console.log(" ----- SCR - Navigate Store ---------- ");
    console.log($navigateStore);
    console.log(" ------------------------------------- ");
  }

  // -----------------------------------------------------------------------------------
  // -----------------  svelte_reactive - $navigateStore.pushRoute  --------------------

  $: if ($navigateStore.pushRoute) {
    isBacking = false;
    loadRoute(navigateStore.consumeRoutePushed(), false);
  }

  // -----------------------------------------------------------------------------------
</script>

{#await loadingPromise}
  <svelte:component this={loadingComponent} {...loadingProps} {...props} />
{:then value}
  {#if $configStore.usesRouteLayout && typeof layoutComponent === "function"}
    <svelte:component this={layoutComponent} {...props}>
      <svelte:component this={currentComponent} {...props} />
    </svelte:component>
  {:else}
    <svelte:component this={currentComponent} {...props} />
  {/if}
{/await}
