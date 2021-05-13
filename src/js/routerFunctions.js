import { assign } from "./helpers/functions.js";
import configStore from "./store/config.js";
import routerStore from "./store/router.js";
import * as LF from "../plugins/lfplugin.js";
import * as LS from "../plugins/lsplugin.js";

const PATH_PARAM_CHAR = "/:";

// -----------------  function hasPathParam  -----------------------------------------

export function hasPathParam(path) {
  return path && path.includes(PATH_PARAM_CHAR);
}

// -----------------------------------------------------------------------------------
// -----------------  function loadFromStorage  --------------------------------------

export async function loadFromStorage() {
  // is to load from storages?
  const saveMode = configStore.getSaveMode();
  if (saveMode === "localstorage") {
    await LS.getSvelteStoreInStorage(
      routerStore.update,
      routerStore.STORAGE_KEY
    );
  } else if (saveMode === "indexeddb") {
    await LF.getSvelteStoreInStorage(
      routerStore.update,
      routerStore.STORAGE_KEY
    );
  }
}

// -----------------------------------------------------------------------------------
// -----------------  function getBeforeEnterAsArray  --------------------------------

export function getBeforeEnterAsArray(beforeEnterFuncOrArr) {
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
// -----------------  function getFindRouteFunc  -------------------------------------

export function getFindRouteFunc(path, realParamPath = { path: false }) {
  // adding trailing slash to route or not
  const hasTrailingSlash = getTrailingSlash();

  let realPath = path.toString();
  if (configStore.getHashMode()) {
    realPath = realPath.split("?");
    realPath = realPath[0];
  }
  if (realPath.substring(realPath.length - 1) != "/") {
    realPath += "/";
  }

  return (routeItem) => {
    // get route path to search with trailing slash if included
    const routePath = routeItem.path + hasTrailingSlash;

    // if route has regex declared
    if (hasPathParam(routeItem.path)) {
      // splitting to compare path sections
      const routeDefArr = routePath.split("/");
      const pathDefArr = realPath.split("/");
      if (routeDefArr.length != pathDefArr.length) {
        return false;
      }

      for (let key in routeDefArr) {
        // if the section is different and it is not regex then it is not it
        if (
          routeDefArr[key] != pathDefArr[key] &&
          !routeDefArr[key].includes(":")
        ) {
          return false;
        }
      }

      // realParamPath when using navigation if not using path
      realParamPath.path = realPath;

      // if check all sections and not returned then we have our matching route
      return routeItem;

      // route with no regex declared
    } else if (
      routeItem.path == realPath ||
      (configStore.getConsiderTrailingSlashOnMatchingRoute() &&
        routePath == realPath)
    ) {
      return routeItem;
    }
    return false;
  };
}

// -----------------------------------------------------------------------------------
// -----------------  function getLocation  ------------------------------------------

export function getLocation(routeObj) {
  let pathname = location.pathname;
  let objHash;
  let params;

  if (routeObj) {
    // realParamPath when using navigation if not using path
    pathname = routeObj.realParamPath || routeObj.path;
    objHash = "#" + routeObj.path;
    params = routeObj.params;
  } else if (configStore.getHashMode() && location.hash) {
    pathname = location.hash.slice(1);
  }

  let currentLocation = {
    pathname,
    params: params || getUrlParameter(location.href),
    hostname: location.hostname,
    protocol: location.protocol,
    port: location.port,
    origin: location.origin,
    hash: objHash || location.hash,
  };

  return currentLocation;
}

// -----------------------------------------------------------------------------------
// -----------------  function getPathParams  ----------------------------------------

export function getPathParams(path, routePath) {
  if (!hasPathParam(routePath)) {
    return {};
  }

  let pathParams = {};
  const hasTrailingSlash = getTrailingSlash();

  routePath += hasTrailingSlash;
  const routeDefArr = routePath.split("/");
  const pathDefArr = path.split("/");

  for (let key in routeDefArr) {
    if (routeDefArr[key].includes(":")) {
      pathParams = {
        ...pathParams,
        [routeDefArr[key].replace(":", "")]: pathDefArr[key],
      };
    }
  }

  return pathParams;
}

// -----------------------------------------------------------------------------------
// -----------------  function getQueryParams  ---------------------------------------

export function getQueryParams(currentLocation) {
  if (!currentLocation || typeof currentLocation != "object") {
    return {};
  }
  let queryParams = currentLocation.params;
  if (configStore.getHashMode()) {
    queryParams = getQueryParamsFromPath(currentLocation.pathname);
  }

  return queryParams;
}

// -----------------------------------------------------------------------------------
// -----------------  function getQueryParamsFromPath  -------------------------------

export function getQueryParamsFromPath(path = "") {
  if (!path) {
    return {};
  }
  let queryArr = path.toString().split("?");
  if (!queryArr || !queryArr[1]) {
    return {};
  }
  queryArr = queryArr[1].split("&");
  let queryParams = {};
  let splitItem;
  for (let item of queryArr) {
    splitItem = item.split("=");
    if (splitItem && splitItem[0] && splitItem[1]) {
      queryParams = {
        ...queryParams,
        [splitItem[0]]: splitItem[1],
      };
    }
  }
  return queryParams;
}

// -----------------------------------------------------------------------------------
// -----------------  function getQueryParamsToPath  ---------------------------------

export function getQueryParamsToPath(currentLocation) {
  if (
    !currentLocation ||
    typeof currentLocation != "object" ||
    currentLocation.pathname.includes("?")
  ) {
    return "";
  }
  let queryToPath = "?";
  if (configStore.getHashMode()) {
    let queryArr = currentLocation.pathname.split("?");
    if (queryArr && queryArr[1]) {
      return "?" + queryArr[1];
    }
    return "";
  }
  for (let key in currentLocation.params) {
    queryToPath += `${key}=${currentLocation.params[key]}&`;
  }
  return queryToPath.slice(0, -1);
}

// -----------------------------------------------------------------------------------
// -----------------  function getTrailingSlash  -------------------------------------

export function getTrailingSlash() {
  return configStore.getConsiderTrailingSlashOnMatchingRoute() ? "/" : "";
}

// -----------------------------------------------------------------------------------
// -----------------  function getUrlParameter  --------------------------------------

export function getUrlParameter(url) {
  let getParams = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    getParams[key] = value;
  });
  return getParams;
}

// -----------------------------------------------------------------------------------
// -----------------  function replacePathParamWithParams  ---------------------------

export function replacePathParamWithParams(path, routePath) {
  if (!hasPathParam(routePath)) {
    return routePath;
  }
  routePath += getTrailingSlash();
  const routeDefArr = routePath.split("/");
  const pathDefArr = path.split("/");
  for (let key in routeDefArr) {
    if (routeDefArr[key].includes(":")) {
      routePath = routePath.replace(routeDefArr[key], pathDefArr[key]);
    }
  }
  return routePath;
}

// -----------------------------------------------------------------------------------
