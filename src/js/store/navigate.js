import { writable } from "svelte/store";
import {
  assign,
  getStoreState,
  updateStoreKey,
  getStoreKey,
} from "../helpers/functions";

import * as lsPlugin from "../../plugins/lsplugin.js";
import * as lfPlugin from "../../plugins/lfplugin.js";

import configStore from "./config.js";
import routeStore from "./router.js";

import { getFindRouteFunc } from "../routerFunctions.js"

const storeTemplate = {
  pushRoute: false,
  params: {},
};

const store = writable(assign({}, storeTemplate));
let routeNavigation;
let backRouteNavigation;

// --------------  pushRoute Property  --------------------------------------------------

function pushRoute(route, params = {}, onError) {
  if (!route) {
    const error = new Error(`SCR_ROUTER - Route not defined - ${route}`);
    if (typeof onError === "function") {
      onError(error);
    } else {
      throw error;
    }
  }
  const routes = routeStore.getRoutes();
  
  let realParamPath = { path: false };
  routeNavigation = undefined;
  if (typeof route === "string") {
    routeNavigation = routes.find(getFindRouteFunc(route, realParamPath));
  } else if (route.path) {
    routeNavigation = routes.find(getFindRouteFunc(route.path, realParamPath));
  } else if (route.name) {
    routeNavigation = routes.find((rItem) => rItem.name === route.name);
  }

  if (!routeNavigation) {
    routeNavigation = {
      notFound: true,
      path: typeof route === "string" ? route : route.path || "",
    };
  } 
  if (realParamPath.path) {
    routeNavigation.realParamPath = realParamPath.path;
  } 

  if (onError && typeof onError === "function") {
    routeNavigation.onError = onError;
  }

  setParams(params);
  updateStoreKey(store, { pushRoute: true });
}

function consumeRoutePushed() {
  const copyRouteNavigation = assign({}, routeNavigation);
  routeNavigation = undefined;
  updateStoreKey(store, { pushRoute: false });
  copyRouteNavigation.params = {
    ...copyRouteNavigation.params,
    ...consumeParams(),
  };
  return copyRouteNavigation;
}

function backRoute() {
  const navigationHistory = getNavigationHistory();
  let popRoute;
  if (navigationHistory.length > 0) {
    popRoute = routeStore.popNavigationHistory();
  }
  window.history.back();
  return popRoute;
}

function getPushRoute() {
  return getStoreKey(store, "pushRoute");
}

// --------------------------------------------------------------------------------------
// --------------  params Property  -----------------------------------------------------

function setParams(params = {}) {
  updateStoreKey(store, { params });
}

function consumeParams() {
  const params = getStoreKey(store, "params");
  setParams();
  return params;
}

// --------------------------------------------------------------------------------------
// --------------  navigationHistory Property  ------------------------------------------

function getNavigationHistory() {
  return routeStore.getNavigationHistory();
}

// --------------------------------------------------------------------------------------
// --------------  config Property  -----------------------------------------------------

function getConfig() {
  return configStore.getConfig();
}

// --------------------------------------------------------------------------------------

export default {
  subscribe: store.subscribe,
  update: store.update,
  pushRoute,
  getPushRoute,
  consumeRoutePushed,
  backRoute,
  getNavigationHistory,
  getConfig,
  setParams,
  consumeParams,
};
