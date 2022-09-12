import { writable } from "svelte/store";
import { SF } from "./storage.js";
import { assign } from "../helpers/index.js";
import configStore from "./config.js";

const storeTemplate = {
  isConsuming: false,
  name: false,
  path: false,
  params: {},
};

const store = writable(assign({}, storeTemplate));
let onError = (error) => console.error(error);

// ------------------------------------------------------------------------------------------------
// ---------------------------  isConsuming Property  ---------------------------------------------

function setIsConsuming(isConsuming) {
  if (typeof isConsuming !== "boolean" && typeof isConsuming !== "string") {
    return;
  }
  if (!isConsuming) {
    setPath(false);
    setName(false);
    setParams({});
    setOnError((error) => console.error(error));
  }
  SF.updateStoreKey(store, { isConsuming });
}

function getIsConsuming() {
  return SF.getStoreKey(store, "isConsuming");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  name Property  ----------------------------------------------------

function setName(name) {
  if (name !== false && typeof name !== "string") {
    return;
  }
  SF.updateStoreKey(store, { name });
}

function getName() {
  return SF.getStoreKey(store, "name");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  path Property  ----------------------------------------------------

function setPath(path) {
  if (path !== false && typeof path !== "string") {
    return;
  }
  SF.updateStoreKey(store, { path });
}

function getPath() {
  return SF.getStoreKey(store, "path");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  onError Property  -------------------------------------------------

function setOnError(onErrorParam) {
  if (typeof onErrorParam !== "function") {
    return;
  }
  onError = onErrorParam;
}

function getOnError() {
  return onError;
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  params Property  --------------------------------------------------

function setParams(params) {
  if (typeof params !== "object") {
    return;
  }
  SF.updateStoreKey(store, { params });
}

function getParams() {
  return SF.getStoreKey(store, "params");
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  pushRoute function  -----------------------------------------------

function pushRoute(routePushObj) {
  try {
    if (!routePushObj) {
      if (configStore.getConsoleLogErrorMessages()) {
        console.error("SCR: Push Route didn't received any parameters");
      }
      return;
    }
    setParams(false);
    setOnError((error) => console.error(error));
    if (typeof routePushObj === "object") {
      setOnError(routePushObj.onError);
      setParams(routePushObj.params);
      if (routePushObj.name) {
        setName(routePushObj.name);
        setIsConsuming("NAME");
        return;
      } else if (routePushObj.path) {
        setPath(routePushObj.path);
        setIsConsuming("PATH");
        return;
      } else {
        if (configStore.getConsoleLogErrorMessages()) {
          console.error(
            "SCR: Push Route didn't received expected path ou name parameters"
          );
        }
      }
    } else if (typeof routePushObj === "string") {
      setPath(routePushObj);
      setIsConsuming("PATH");
    } else {
      if (configStore.getConsoleLogErrorMessages()) {
        console.error("SCR: Push Route didn't received any parameters");
      }
      return;
    }
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------
// ---------------------------  backRoute function  -----------------------------------------------

function backRoute(num) {
  if (typeof num !== "number" || num >= 0) {
    num = -1;
  } 
  window.history.go(num);
}

// ------------------------------------------------------------------------------------------------

export default {
  subscribe: store.subscribe,
  update: store.update,
  setIsConsuming,
  getIsConsuming,
  setName,
  getName,
  setPath,
  getPath,
  setOnError,
  getOnError,
  setParams,
  getParams,
  pushRoute,
  backRoute,
};
