import { svelteFunctions as SF } from "../storage.js";
import appStore from "./app.js";

export let IS_READY = false;
export async function loadStores() {
  if (IS_READY) return true;

  try {
    await SF.getSvelteStoreInStorage(appStore.store, appStore.STORAGE_KEY);
    IS_READY = true;
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { appStore };
