import { writable } from "svelte/store";
import { assign } from "./helpers.js";
import { svelteFunctions as SF } from "../storage.js";

const STORAGE_KEY = "SCR_APP_STORE";

const storeTemplate = {
  themeDark: false,
  menuOpened: true,
  version: 0,
};

const store = writable(assign({}, storeTemplate));

// ------------------------------------------------------------------------------------------------
// --------------  darkTheme Property  ------------------------------------------------------------

async function setThemeDark(themeDark) {
  SF.updateStoreKey(store, { themeDark });
  await SF.setSvelteStoreInStorage(store, STORAGE_KEY);
}

function getThemeDark() {
  return SF.getStoreKey(store, "themeDark");
}

// ------------------------------------------------------------------------------------------------
// --------------  menuOpened Property  -----------------------------------------------------------

function setMenuOpened(menuOpened) {
  SF.updateStoreKey(store, { menuOpened });
}

function getMenuOpened() {
  return SF.getStoreKey(store, "menuOpened");
}

// ------------------------------------------------------------------------------------------------
// --------------  version Property  --------------------------------------------------------------

function setVersion(version) {
  SF.updateStoreKey(store, { version });
}

function getVersion() {
  return SF.getStoreKey(store, "version");
}

// ------------------------------------------------------------------------------------------------

export default {
  STORAGE_KEY,
  store,
  subscribe: store.subscribe,
  update: store.update,
  setThemeDark,
  getThemeDark,
  setMenuOpened,
  getMenuOpened,
  setVersion,
  getVersion
};
