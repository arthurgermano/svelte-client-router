import cloneDeep from "lodash/cloneDeep";
import { isBefore, addMilliseconds } from "date-fns";
import localforage from "localforage";

const PREFIX_KEY = SCR_ROUTER_PREFIX || "SCR_ROUTER_";
const IDX_DB_NAME = PREFIX_KEY;
const IDX_DB_STORE = PREFIX_KEY;
const EXPIRE_KEYS = `${PREFIX_KEY}IDX_DB_P_EXPIRE_KEYS`;

localforage.config({
  driver: localforage.INDEXEDDB,
  name: IDX_DB_NAME,
  version: `${PREFIX_KEY}VERSION`,
  storeName: IDX_DB_STORE,
  description: `${PREFIX_KEY}DB_DESCRIPTOR`,
});

const LF = localforage;

export const getItem = async (key) => {
  try {
    await removeExpiredKeys();
    return fromJSON(await LF.getItem(key));
  } catch (error) {
    throw error;
  }
};

export const setItem = async (key, value, time) => {
  try {
    if (key === undefined || key === null || key.trim() === "") {
      return false;
    }
    if (value === undefined || value === null) {
      await clearKeyList([key]);
      return;
    }
    await removeExpiredKeys();
    if (
      time &&
      Number.isSafeInteger(time) &&
      Number.isInteger(time) &&
      time > 0
    ) {
      await addExpireKey(key, time);
    }
    await LF.setItem(key, toJSON(value));
  } catch (error) {
    throw error;
  }
};

export const removeItem = async (key) => {
  try {
    await removeExpiredKeys();
    const item = fromJSON(await LF.getItem(key));
    if (item !== null && item !== undefined) {
      await LF.removeItem(key);
      await removeExpireKey(key);
    }
    return item;
  } catch (error) {
    throw error;
  }
};

export const getAll = async () => {
  try {
    await removeExpiredKeys();
    const keys = await LF.keys();
    const items = [];
    let item;
    for (let key of keys) {
      items.push(await LF.getItem(key));
      await LF.removeItem(key);
    }
    return items;
  } catch (error) {
    throw error;
  }
};

// clear all the expiration list and the keys
export const clearExpireKeys = async () => {
  try {
    const expire = fromJSON(await LF.getItem(EXPIRE_KEYS));

    if (expire === null || expire === undefined) {
      return;
    }

    await expire.map(async (item) => await LF.removeItem(item.key));

    await LF.removeItem(EXPIRE_KEYS);
  } catch (error) {
    throw error;
  }
};

// clear a given array list of keys
// affects expiration key list and the keys
export const clearKeyList = async (keyList) => {
  try {
    if (!Array.isArray(keyList) || keyList.length === 0) {
      return;
    }

    await keyList.map(async (key) => {
      if (await LF.getItem(key)) {
        await LF.removeItem(key);
        await removeExpireKey(key);
      }
    });

    // updating the remaining list keychain if it has left any item
    let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));
    if (expire === null || expire === undefined) {
      return;
    }

    expire = expire.filter((item) => !keyList.includes(item.key));
    if (expire.length > 0) {
      await LF.setItem(EXPIRE_KEYS, toJSON(expire));
    } else {
      await LF.removeItem(EXPIRE_KEYS);
    }
  } catch (error) {
    throw error;
  }
};

// Function to check and remove a key if expired
// If so... remove the key from the expiration list and the key
export const removeExpiredKeys = async () => {
  try {
    let keyList = [];
    let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));

    if (expire && expire.length > 0) {
      expire = await expire.filter(async (item) => {
        if (
          isBefore(new Date(), new Date(item.liveUntil)) &&
          (await LF.getItem(item.key))
        ) {
          return true;
        }
        await LF.removeItem(item.key);
        keyList.push(item.key);
      });

      if (expire.length > 0) {
        await LF.setItem(EXPIRE_KEYS, toJSON(expire));
      } else {
        await LF.removeItem(EXPIRE_KEYS);
      }
    }
    return keyList;
  } catch (error) {
    throw error;
  }
};

export const setSvelteStoreInStorage = async (
  subscribe,
  key,
  timeout,
  ignoreKeys = []
) => {
  try {
    const unsubscribe = subscribe(async (store) => {
      for (let iKeys of ignoreKeys) {
        store[iKeys] = undefined;
      }
      await setItem(key, store, timeout);
    });
    unsubscribe();
  } catch (error) {
    throw error;
  }
};

export const getSvelteStoreInStorage = async (update, key) => {
  try {
    const storage = await getItem(key);
    if (!storage) {
      return;
    }
    update(() => {
      return Object.assign({}, cloneDeep(storage));
    });
  } catch (error) {
    throw error;
  }
};

// ------------------------------------------------- ## BELOW THIS LINE PRIVATE FUNCTIONS ONLY ## -------------------------------------------------
// add a key in the expiration key list
// key: String
// time: In milliseconds
async function addExpireKey(key, time) {
  try {
    if (!Number.isInteger(time) || !Number.isSafeInteger(time)) {
      throw new Error("Time to add an expire key is not a safe integer");
    }

    let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));
    const liveUntil = addMilliseconds(new Date(), time);

    if (expire !== null && expire !== undefined) {
      expire = expire.filter((item) => item.key !== key);
      expire.push({ key, liveUntil });
    } else {
      expire = [{ key, liveUntil }];
    }

    await LF.setItem(EXPIRE_KEYS, toJSON(expire));
  } catch (error) {
    throw error;
  }
}

// removes a specific key from expiration key list, may remove the key too
// key: String
// expireKeyOnly: Boolean -- only = true for only remove from expireKey OR the key itself too
async function removeExpireKey(key, expireKeyOnly = true) {
  try {
    let expire = fromJSON(await LF.getItem(EXPIRE_KEYS));
    if (expire === null || expire === undefined) {
      return;
    }

    expire = expire.filter((item) => item.key !== key);

    if (expire.length > 0) {
      await LF.setItem(EXPIRE_KEYS, toJSON(expire));
    } else {
      await LF.removeItem(EXPIRE_KEYS);
    }

    if (!expireKeyOnly && LF.getItem(key)) {
      await LF.removeItem(key);
    }
  } catch (error) {
    throw error;
  }
}

function toJSON(item) {
  if (typeof item === "object") {
    return JSON.stringify(item);
  }
  return item;
}

function fromJSON(item) {
  if (!item) {
    return item;
  }
  try {
    return JSON.parse(item);
  } catch (err) {
    return item;
  }
}

// setInterval(removeExpiredKeys, 5000);
