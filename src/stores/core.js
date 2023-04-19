import { writable } from "svelte/store";
import { SF } from "./storage.js";
import { assign } from "../helpers/index.js";
import WaitPlugin from "../plugins/waitPlugin.js";

// this waiting controls when loading route
const waitPlugin = new WaitPlugin();
let waiting = false;

const storeTemplate = {
  isLoading: false,
  currentParams: {},
  routeParams: {},
  loadingParams: {},
  defaultLoadingParams: {},
};

const store = writable(assign({}, storeTemplate));

let loadingComponent;
let currentComponent;
let defaultLoadingComponent;
let defaultNotFoundComponent;

// ------------------------------------------------------------------------------------------------
// ---------------------------  isLoading Property  -----------------------------------------------

function setIsLoading(isLoading) {
  if (typeof isLoading !== "boolean") {
    return;
  }
  if (isLoading) {
    startWaiting();
  } else {
    stopWaiting();
  }
  SF.updateStoreKey(store, { isLoading });
}

function getIsLoading() {
  return SF.getStoreKey(store, "isLoading");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  currentParams Property  -------------------------------------------

function setCurrentParams(currentParams = {}) {
  if (typeof currentParams !== "object") {
    SF.updateStoreKey(store, { currentParams: {} });
    return;
  }
  SF.updateStoreKey(store, { currentParams });
}

function getCurrentParams() {
  return SF.getStoreKey(store, "currentParams");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  loadingParams Property  -------------------------------------------

function setLoadingParams(loadingParams = {}) {
  if (typeof loadingParams !== "object") {
    SF.updateStoreKey(store, { loadingParams: {} });
    return;
  }
  SF.updateStoreKey(store, { loadingParams });
}

function getLoadingParams() {
  return SF.getStoreKey(store, "loadingParams");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  defaultLoadingParams Property  ------------------------------------

function setDefaultLoadingParams(defaultLoadingParams = {}) {
  if (typeof defaultLoadingParams !== "object") {
    return false;
  }
  SF.updateStoreKey(store, { defaultLoadingParams });
}

function getDefaultLoadingParams() {
  return SF.getStoreKey(store, "defaultLoadingParams");
}


// ------------------------------------------------------------------------------------------------
// ---------------------------  waiting Plugin  ---------------------------------------------------

function startWaiting() {
  waiting = waitPlugin.startWait("SCR_LOADING");
}

function stopWaiting(accepted) {
  waitPlugin.finishWait("SCR_LOADING", accepted);
  waiting = false;
}

function getWaiting() {
  return waiting;
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  loadingComponent  -------------------------------------------------

function setLoadingComponent(loadingComponentParam) {
  loadingComponent = loadingComponentParam;
}

function getLoadingComponent() {
  return loadingComponent;
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  currentComponent  -------------------------------------------------

function setCurrentComponent(currentComponentParam) {
  currentComponent = currentComponentParam;
}

function getCurrentComponent() {
  return currentComponent;
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  defautLoadingComponent  -------------------------------------------

function setDefaultLoadingComponent(defaultLoadingComponentParam) {
  defaultLoadingComponent = defaultLoadingComponentParam;
}

function getDefaultLoadingComponent() {
  return defaultLoadingComponent;
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  defautNotFoundComponent  -------------------------------------------

function setDefaultNotFoundComponent(defaultNotFoundComponentParam) {
  defaultNotFoundComponent = defaultNotFoundComponentParam;
}

function getDefaultNotFoundComponent() {
  return defaultNotFoundComponent;
}

// ------------------------------------------------------------------------------------------------

export default {
  store,
  subscribe: store.subscribe,
  update: store.update,
  setIsLoading,
  getIsLoading,
  setCurrentParams,
  getCurrentParams,
  setLoadingParams,
  getLoadingParams,
  setDefaultLoadingParams,
  getDefaultLoadingParams,
  startWaiting,
  stopWaiting,
  getWaiting,
  setLoadingComponent,
  getLoadingComponent,
  setCurrentComponent,
  getCurrentComponent,
  setDefaultLoadingComponent,
  getDefaultLoadingComponent,
  setDefaultNotFoundComponent,
  getDefaultNotFoundComponent,
  waiting,
  loadingComponent,
  currentComponent,
};
