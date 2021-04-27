import { writable } from "svelte/store";
import {
  assign,
  updateStoreKey,
  getStoreState,
  getStoreKey,
} from "../functions";
const storeTemplate = {
  hashMode: false,
  navigationHistoryLimit: 10,
  saveMode: "localstorage",
  notFoundRoute: "/notFound",
  errorRoute: "/error",
  consoleLogErrorMessages: true,
  consoleLogStores: true,
  usesRouteLayout: true,
  considerTrailingSlashOnMatchingRoute: true
};

const ENUM_SAVE_MODE = ["localstorage", "indexeddb", "none"];

const store = writable(assign({}, storeTemplate));
let onError;
let beforeEnter;

// --------------  config Property  -----------------------------------------------------

function setConfig(config) {
  setHashMode(config.hashMode);
  setNavigationHistoryLimit(config.navigationHistoryLimit);
  setSaveMode(config.saveMode);
  setNotFoundRoute(config.notFoundRoute);
  setErrorRoute(config.errorRoute);
  setConsoleLogErrorMessages(config.consoleLogErrorMessages);
  setConsoleLogStores(config.consoleLogStores);
  setUsesRouteLayout(config.usesRouteLayout);
  setConsiderTrailingSlashOnMatchingRoute(config.considerTrailingSlashOnMatchingRoute);
  setOnError(config.onError);
  setBeforeEnter(config.beforeEnter);
}

function getConfig() {
  return getStoreState(store);
}

// --------------------------------------------------------------------------------------
// --------------  hashmode Property  ---------------------------------------------------

function setHashMode(hashMode) {
  if (typeof hashMode == "boolean") {
    updateStoreKey(store, { hashMode });
  }
}

function getHashMode() {
  return getStoreKey(store, "hashMode");
}

// --------------------------------------------------------------------------------------
// --------------  navigationHistoryLimit Property  -------------------------------------

function setNavigationHistoryLimit(navigationHistoryLimit) {
  if (typeof navigationHistoryLimit == "number") {
    updateStoreKey(store, { navigationHistoryLimit });
  }
}

function getNavigationHistoryLimit() {
  return getStoreKey(store, "navigationHistoryLimit");
}

// --------------------------------------------------------------------------------------
// --------------  saveMode Property  ---------------------------------------------------

function setSaveMode(saveMode) {
  if (ENUM_SAVE_MODE.includes(saveMode)) {
    updateStoreKey(store, { saveMode });
  }
}

function getSaveMode() {
  return getStoreKey(store, "saveMode");
}

// --------------------------------------------------------------------------------------
// --------------  notFoundRoute Property  ----------------------------------------------

function setNotFoundRoute(notFoundRoute) {
  if (typeof notFoundRoute == "string" && notFoundRoute.includes("/")) {
    updateStoreKey(store, { notFoundRoute });
  }
}

function getNotFoundRoute() {
  return getStoreKey(store, "notFoundRoute");
}

// --------------------------------------------------------------------------------------
// --------------  errorRoute Property  -------------------------------------------------

function setErrorRoute(errorRoute) {
  if (typeof errorRoute == "string" && errorRoute.includes("/")) {
    updateStoreKey(store, { errorRoute });
  }
}

function getErrorRoute() {
  return getStoreKey(store, "errorRoute");
}

// --------------------------------------------------------------------------------------
// --------------  consoleLogErrorMessages Property  ------------------------------------

function setConsoleLogErrorMessages(consoleLogErrorMessages = false) {
  if (typeof consoleLogErrorMessages == "boolean") {
    updateStoreKey(store, { consoleLogErrorMessages });
  }
}

function getConsoleLogErrorMessages() {
  return getStoreKey(store, "consoleLogErrorMessages");
}

// --------------------------------------------------------------------------------------
// --------------  consoleLogStores Property  ------------------------------------

function setConsoleLogStores(consoleLogStores = false) {
  if (typeof consoleLogStores == "boolean") {
    updateStoreKey(store, { consoleLogStores });
  }
}

function getConsoleLogStores() {
  return getStoreKey(store, "consoleLogStores");
}

// --------------------------------------------------------------------------------------
// --------------  usesRouteLayout Property  --------------------------------------------

function setUsesRouteLayout(usesRouteLayout) {
  if (typeof usesRouteLayout == "boolean") {
    updateStoreKey(store, { usesRouteLayout });
  }
}

function getUsesRouteLayout() {
  return getStoreKey(store, "usesRouteLayout");
}

// --------------------------------------------------------------------------------------
// --------------  considerTrailingSlashOnMachingRoute Property  ------------------------

function setConsiderTrailingSlashOnMachingRoute(considerTrailingSlashOnMachingRoute) {
  if (typeof considerTrailingSlashOnMachingRoute == "boolean") {
    updateStoreKey(store, { considerTrailingSlashOnMachingRoute });
  }
}

function getConsiderTrailingSlashOnMachingRoute() {
  return getStoreKey(store, "considerTrailingSlashOnMachingRoute");
}

// --------------------------------------------------------------------------------------
// --------------  onError Function  ----------------------------------------------------

function setOnError(onErrorParam) {
  if (!onErrorParam || typeof onErrorParam !== "function") {
    return;
  }
  onError = onErrorParam;
}

function getOnError() {
  return onError;
}

// --------------------------------------------------------------------------------------
// --------------  beforeEnter Function  --------------------------------------------

function setBeforeEnter(beforeEnterParam) {
  if (
    !beforeEnterParam ||
    (typeof beforeEnterParam !== "function" && !Array.isArray(beforeEnterParam))
  ) {
    return;
  }
  if (Array.isArray(beforeEnterParam)) {
    for (let bFuncItem of beforeEnterParam) {
      if (typeof bFuncItem !== "function") {
        return;
      }
    }
  }
  // if is valid
  beforeEnter = beforeEnterParam;
}

function getBeforeEnter() {
  return beforeEnter;
}

// --------------------------------------------------------------------------------------

export default {
  subscribe: store.subscribe,
  update: store.update,
  setConfig,
  getConfig,
  setHashMode,
  getHashMode,
  setNavigationHistoryLimit,
  getNavigationHistoryLimit,
  setSaveMode,
  getSaveMode,
  setNotFoundRoute,
  getNotFoundRoute,
  setErrorRoute,
  getErrorRoute,
  setConsoleLogErrorMessages,
  getConsoleLogErrorMessages,
  setConsoleLogStores,
  getConsoleLogStores,
  setUsesRouteLayout,
  getUsesRouteLayout,
  setConsiderTrailingSlashOnMachingRoute,
  getConsiderTrailingSlashOnMachingRoute,
  setOnError,
  getOnError,
  setBeforeEnter,
  getBeforeEnter,
};
