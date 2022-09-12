import { writable } from "svelte/store";
import { SF } from "./storage.js";
import { assign } from "../helpers/index.js";
import configStore from "./config.js";

const routeSchema = {
  routeId: undefined,
  name: undefined,
  path: undefined,
  fullPath: undefined,
  queryParams: {},
  pathParams: {},
  params: {},
  host: undefined,
  protocol: undefined,
  port: undefined,
  origin: undefined,
  hash: undefined,
  routeObj: {},
  redirected: undefined,
};

const storeTemplate = {
  routes: [],
  currentRoute: assign({}, routeSchema),
  lastRoute: assign({}, routeSchema),
  navigationHistory: [],
};

const store = writable(assign({}, storeTemplate));

// ------------------------------------------------------------------------------------------------
// ---------------------------  routes Property  --------------------------------------------------

function setRoutes(routes) {
  if (
    !Array.isArray(routes) ||
    routes.length == 0 ||
    typeof routes[0] != "object"
  ) {
    throw new Error("SCR: Routes must be an array of objects.");
  }
  for (let route of routes) {
    if (!route.name || (!route.path && route.path !== "") || route.name == "") {
      throw new Error(
        `SCR: Routes must have at least (name and path) properties. Set name: (${route.name}) - path:(${route.path})`
      );
    }
    if (typeof route.name !== "string" || typeof route.path !== "string") {
      throw new Error(
        "SCR: Routes properties (name and path) must be a string."
      );
    }
  }
  SF.updateStoreKey(store, { routes });
}

function getRoutes() {
  return SF.getStoreKey(store, "routes");
}

function resetRoutes() {
  const routes = [];
  SF.updateStoreKey(store, { routes });
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  currentRoute Property  -----------------------------------------

function setCurrentRoute(currentRoute = assign({}, routeSchema)) {
  SF.updateStoreKey(store, { currentRoute });
}

function getCurrentRoute() {
  return SF.getStoreKey(store, "currentRoute");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  lastRoute Property  -----------------------------------------------

function setLastRoute(lastRoute = assign({}, routeSchema)) {
  SF.updateStoreKey(store, { lastRoute });
}

function getLastRoute() {
  return SF.getStoreKey(store, "lastRoute");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  getNotFoundRoute Property  ----------------------------------------

function getNotFoundRoute() {
  return {
    name: "SCR_NOT_FOUND_ROUTE",
    path: configStore.getNotFoundRoute(),
  };
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  navigationHistory Property  ---------------------------------------

function setNavigationHistory(navigationHistory) {
  if (!Array.isArray(navigationHistory)) {
    return false;
  }
  let length =
    configStore.getNavigationHistoryLimit() - navigationHistory.length;
  if (length < 0) {
    length *= -1;
    navigationHistory = navigationHistory.slice(length, 0);
  }
  SF.updateStoreKey(store, { navigationHistory });
}

function pushNavigationHistory(navObj) {
  if (typeof navObj != "object") {
    return false;
  }
  let navigationHistory = getNavigationHistory() || [];
  navigationHistory.push(navObj);
  SF.updateStoreKey(store, { navigationHistory });
}

// function hasNavigationHistoryRouteId(routeId) {
//   if (!routeId || typeof routeId !== "string") {
//     return false;
//   }
//   let navigationHistory = getNavigationHistory() || [];
//   if (navigationHistory.length == 0) {
//     return false;
//   }

//   const navObj = navigationHistory.find(nhItem => nhItem.routeId == routeId);
//   if (navObj) {
//     return navObj
//   }
//   return false;
// }

// function popRouteIdNavigationHistory(routeId) {
//   let navigationHistory = getNavigationHistory() || [];
//   if (navigationHistory.length == 0) {
//     return false;
//   }

//   let navObj = false;
//   navigationHistory = navigationHistory.filter(nh => {
//     if (nh.routeId != routeId) {
//       return true;
//     }
//     navObj = nh;
//     return false;
//   });

//   SF.updateStoreKey(store, { navigationHistory });
//   return navObj;
// }

function getNavigationHistory() {
  return SF.getStoreKey(store, "navigationHistory");
}

// ------------------------------------------------------------------------------------------------

export default {
  store,
  subscribe: store.subscribe,
  update: store.update,
  setRoutes,
  getRoutes,
  resetRoutes,
  setCurrentRoute,
  getCurrentRoute,
  setLastRoute,
  getLastRoute,
  getNotFoundRoute,
  pushNavigationHistory,
  setNavigationHistory,
  getNavigationHistory,
};
