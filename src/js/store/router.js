import { writable } from "svelte/store";
import {
  assign,
  getStoreState,
  updateStoreKey,
  getStoreKey,
} from "../functions";
import * as lsPlugin from "../../plugins/lsplugin.js";
import * as lfPlugin from "../../plugins/lfplugin.js";

import configStore from "./config.js";

const STORAGE_KEY = SCR_ROUTER_STORAGE_KEY || "SRC_ROUTER_STORE";

const storeTemplate = {
  routes: [],
  currentLocation: undefined,
  currentRoute: {
    name: undefined,
    pathname: undefined,
    params: [],
    hostname: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
  },
  fromRoute: {
    name: undefined,
    pathname: undefined,
    params: [],
    hostname: undefined,
    protocol: undefined,
    port: undefined,
    origin: undefined,
    hash: undefined,
  },
  navigationHistory: [],
};

const store = writable(assign({}, storeTemplate));

// --------------  routes Property  ------------------------------------------------------

async function setRoutes(routes = []) {
  if (!Array.isArray(routes)) {
    return;
  }
  updateStoreKey(store, { routes });
  await saveMode();
}

function getRoutes() {
  return getStoreKey(store, "routes");
}

// --------------------------------------------------------------------------------------
// --------------  currentLocation Property  --------------------------------------------

async function setCurrentLocation(currentLocation) {
  if (typeof currentLocation == "string") {
    updateStoreKey(store, { currentLocation });
    await saveMode();
  }
}

function getCurrentLocation() {
  return getStoreKey(store, "currentLocation");
}

// --------------------------------------------------------------------------------------
// --------------  currentRoute Property  -----------------------------------------------

async function setCurrentRoute(currentRoute) {
  if (typeof currentRoute == "object") {
    updateStoreKey(store, { currentRoute });
    await saveMode();
  }
}

function getCurrentRoute() {
  return getStoreKey(store, "currentRoute");
}

// --------------------------------------------------------------------------------------
// --------------  fromRoute Property  --------------------------------------------------

async function setFromRoute(fromRoute) {
  if (typeof fromRoute == "object") {
    updateStoreKey(store, { fromRoute });
    await saveMode();
  }
}

function getFromRoute() {
  return getStoreKey(store, "fromRoute");
}

// --------------------------------------------------------------------------------------
// --------------  navigationHistory Property  ------------------------------------------

async function setNavigationHistory(navigationHistory) {
  if (typeof navigationHistory == "object") {
    const configs = getConfig();
    if (configs.navigationHistoryLimit > 0) {
      navigationHistory = navigationHistory.slice(
        0,
        configs.navigationHistoryLimit - 1
      );
    }
    console.log(navigationHistory);
    updateStoreKey(store, { navigationHistory });
    await saveMode();
  }
}

async function pushNavigationHistory(navObj) {
  let navigationHistory = getNavigationHistory() || [];
  navigationHistory = [navObj, ...navigationHistory];
  await setNavigationHistory(navigationHistory);
}

async function popNavigationHistory() {
  let navigationHistory = getNavigationHistory() || [];

  if (navigationHistory.length == 0) {
    return false;
  }
  console.log(navigationHistory);
  const navObj = { ...navigationHistory[0] };
  await setNavigationHistory(navigationHistory.slice(1));
  return navObj;
}

function getNavigationHistory() {
  return getStoreKey(store, "navigationHistory");
}

// --------------------------------------------------------------------------------------
// --------------  config Property  -----------------------------------------------------

function getConfig() {
  return configStore.getConfig();
}

// --------------------------------------------------------------------------------------
// --------------  saveMode Function  ---------------------------------------------------

async function saveMode() {
  const configs = getConfig();
  if (!configs || !configs.saveMode || configs.saveMode == "none") {
    return false;
  }
  if (configs.saveMode === "localstorage") {
    await lsPlugin.setSvelteStoreInStorage(store.subscribe, STORAGE_KEY);
  } else if (configs.saveMode === "indexeddb") {
    await lfPlugin.setSvelteStoreInStorage(store.subscribe, STORAGE_KEY);
  }
  return false;
}
// --------------------------------------------------------------------------------------

export default {
  subscribe: store.subscribe,
  update: store.update,
  STORAGE_KEY,
  setRoutes,
  getRoutes,
  setCurrentRoute,
  getCurrentRoute,
  setFromRoute,
  getFromRoute,
  setNavigationHistory,
  getNavigationHistory,
  pushNavigationHistory,
  popNavigationHistory,
  setCurrentLocation,
  getCurrentLocation,
  getConfig,
};
