import { writable } from "svelte/store";
import { assign } from "../helpers/index.js";
import { SF } from "./storage";

// ------------------------------------------------------------------------------------------------

const storeTemplate = {
  hashMode: false,
  navigationHistoryLimit: 200,
  notFoundRoute: "/notFound",
  consoleLogErrorMessages: true,
  consoleLogStores: false,
  considerTrailingSlashOnMatchingRoute: true,
  maxRedirectBeforeEnter: 30,
  useScroll: false,
  scrollProps: {
    target: false,
    top: 0,
    left: 0,
    behavior: "smooth",
    timeout: 10,
  },
};

const store = writable(assign({}, storeTemplate));
let onError = (error) => console.error(error);
let beforeEnter = [];

// ------------------------------------------------------------------------------------------------
// ---------------------------  config  -----------------------------------------------------------

function setConfig(config) {
  setHashMode(config.hashMode);
  setNavigationHistoryLimit(config.navigationHistoryLimit);
  setNotFoundRoute(config.notFoundRoute);
  setConsoleLogErrorMessages(config.consoleLogErrorMessages);
  setConsoleLogStores(config.consoleLogStores);
  setConsiderTrailingSlashOnMatchingRoute(
    config.considerTrailingSlashOnMatchingRoute
  );
  setOnError(config.onError);
  setBeforeEnter(config.beforeEnter);
  setScrollProps(config.scrollProps);
  setUseScroll(config.useScroll);
  setMaxRedirectBeforeEnter(config.maxRedirectBeforeEnter);
}

function getConfig() {
  return SF.getStoreState(store);
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  hashmode Property  ------------------------------------------------

function setHashMode(hashMode) {
  if (typeof hashMode === "boolean") {
    SF.updateStoreKey(store, { hashMode });
  }
}

function getHashMode() {
  return SF.getStoreKey(store, "hashMode");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  navigationHistoryLimit Property  ----------------------------------

function setNavigationHistoryLimit(navigationHistoryLimit) {
  if (typeof navigationHistoryLimit != "number") {
    return false;
  }
  if (navigationHistoryLimit <= 0) {
    navigationHistoryLimit = 1;
  }
  SF.updateStoreKey(store, { navigationHistoryLimit });
}

function getNavigationHistoryLimit() {
  return SF.getStoreKey(store, "navigationHistoryLimit");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  notFoundRoute Property  -------------------------------------------

function setNotFoundRoute(notFoundRoute) {
  if (typeof notFoundRoute == "string" && notFoundRoute.includes("/")) {
    SF.updateStoreKey(store, { notFoundRoute });
  }
}

function getNotFoundRoute() {
  return SF.getStoreKey(store, "notFoundRoute");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  consoleLogErrorMessages Property  ---------------------------------

function setConsoleLogErrorMessages(consoleLogErrorMessages) {
  if (typeof consoleLogErrorMessages == "boolean") {
    SF.updateStoreKey(store, { consoleLogErrorMessages });
  }
}

function getConsoleLogErrorMessages() {
  return SF.getStoreKey(store, "consoleLogErrorMessages");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  consoleLogStores Property  ----------------------------------------

function setConsoleLogStores(consoleLogStores) {
  if (typeof consoleLogStores == "boolean") {
    SF.updateStoreKey(store, { consoleLogStores });
  }
}

function getConsoleLogStores() {
  return SF.getStoreKey(store, "consoleLogStores");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  considerTrailingSlashOnMachingRoute Property  ---------------------

function setConsiderTrailingSlashOnMatchingRoute(
  considerTrailingSlashOnMachingRoute
) {
  if (typeof considerTrailingSlashOnMachingRoute == "boolean") {
    SF.updateStoreKey(store, { considerTrailingSlashOnMachingRoute });
  }
}

function getConsiderTrailingSlashOnMatchingRoute() {
  return SF.getStoreKey(store, "considerTrailingSlashOnMachingRoute");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  scrollProps Property  ---------------------------------------------

function setScrollProps(scrollProps) {
  const currentScrollProps = getScrollProps();
  if (typeof scrollProps == "object") {
    scrollProps.top =
      typeof scrollProps.top == "number"
        ? scrollProps.top
        : currentScrollProps.top;
    scrollProps.left =
      typeof scrollProps.left == "number"
        ? scrollProps.left
        : currentScrollProps.left;
    scrollProps.timeout =
      typeof scrollProps.timeout == "number"
        ? scrollProps.timeout
        : currentScrollProps.timeout;    
    scrollProps.behavior = scrollProps.behavior || currentScrollProps.behavior;
    scrollProps.target =
      typeof scrollProps.target 
        ? scrollProps.target
        : currentScrollProps.top;
    SF.updateStoreKey(store, { scrollProps });
  }
}

function getScrollProps() {
  return SF.getStoreKey(store, "scrollProps");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  useScroll Property  -----------------------------------------------

function setUseScroll(useScroll) {
  if (typeof useScroll == "boolean") {
    SF.updateStoreKey(store, { useScroll });
  }
}

function getUseScroll() {
  return SF.getStoreKey(store, "useScroll");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  onError Function  -------------------------------------------------

function setOnError(onErrorParam) {
  if (!onErrorParam || typeof onErrorParam !== "function") {
    return;
  }
  onError = onErrorParam;
}

function getOnError() {
  return onError;
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  beforeEnter Function  ---------------------------------------------

function setBeforeEnter(beforeEnterParam) {
  if (typeof beforeEnterParam === "function") {
    beforeEnter = [beforeEnterParam];
    return;
  }
  if (Array.isArray(beforeEnterParam)) {
    beforeEnter = beforeEnterParam.filter(
      (befItem) => typeof befItem === "function"
    );
    if (beforeEnter.length > 0) {
      return;
    }
  }
  beforeEnter = [];
}

function getBeforeEnter() {
  return beforeEnter;
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  maxRedirectBeforeEnter Function  ----------------------------------

function setMaxRedirectBeforeEnter(maxRedirectBeforeEnter = 30) {
  if (typeof maxRedirectBeforeEnter == "number") {
    maxRedirectBeforeEnter =
      maxRedirectBeforeEnter > -1 ? maxRedirectBeforeEnter : 0;
    SF.updateStoreKey(store, { maxRedirectBeforeEnter });
  }
}

function getMaxRedirectBeforeEnter() {
  return SF.getStoreKey(store, "maxRedirectBeforeEnter");
}

// ------------------------------------------------------------------------------------------------

export default {
  store,
  subscribe: store.subscribe,
  update: store.update,
  setConfig,
  getConfig,
  setHashMode,
  getHashMode,
  setNavigationHistoryLimit,
  getNavigationHistoryLimit,
  setNotFoundRoute,
  getNotFoundRoute,
  setConsoleLogErrorMessages,
  getConsoleLogErrorMessages,
  setConsoleLogStores,
  getConsoleLogStores,
  setConsiderTrailingSlashOnMatchingRoute,
  getConsiderTrailingSlashOnMatchingRoute,
  setScrollProps,
  getScrollProps,
  setUseScroll,
  getUseScroll,
  setOnError,
  getOnError,
  setBeforeEnter,
  getBeforeEnter,
  setMaxRedirectBeforeEnter,
  getMaxRedirectBeforeEnter,
};
