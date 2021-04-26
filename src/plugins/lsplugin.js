import cloneDeep from "lodash/cloneDeep";
import { isBefore, addMilliseconds } from "date-fns";

const LS = localStorage;
const PREFIX_KEY = SCR_ROUTER_PREFIX || "SCR_ROUTER_";
const EXPIRE_KEYS = `${PREFIX_KEY}EXPIRE_KEYS`;

export const getItem = (key) => {
  removeExpiredKeys();
  return fromJSON(LS.getItem(key));
};

export const setItem = (key, value, time) => {
  if (key === undefined || key === null || key.trim() === "") {
    return false;
  }
  if (value === undefined || value === null) {
    clearKeyList([key]);
    return;
  }
  removeExpiredKeys();
  if (
    time &&
    Number.isSafeInteger(time) &&
    Number.isInteger(time) &&
    time > 0
  ) {
    addExpireKey(key, time);
  }
  LS.setItem(key, toJSON(value));
};

export const removeItem = (key) => {
  removeExpiredKeys();
  const item = fromJSON(LS.getItem(key));
  if (item !== null && item !== undefined) {
    LS.removeItem(key);
    removeExpireKey(key);
  }
  return item;
};

export const getAll = () => {
  if (!LS || LS.length === 0) {
    return [];
  }
  removeExpiredKeys();
  let items = Object.assign({}, cloneDeep(LS));
  delete items[EXPIRE_KEYS];
  return items;
};

// clear all the expiration list and the keys
export const clearExpireKeys = () => {
  const expire = fromJSON(LS.getItem(EXPIRE_KEYS));

  if (expire === null || expire === undefined) {
    return;
  }

  expire.map((item) => LS.removeItem(item.key));

  LS.removeItem(EXPIRE_KEYS);
};

// clear a given array list of keys
// affects expiration key list and the keys
export const clearKeyList = (keyList) => {
  if (!Array.isArray(keyList) || keyList.length === 0) {
    return;
  }

  keyList.map((key) => {
    if (LS.getItem(key)) {
      LS.removeItem(key);
      removeExpireKey(key);
    }
  });

  // updating the remaining list keychain if it has left any item
  let expire = fromJSON(LS.getItem(EXPIRE_KEYS));
  if (expire === null || expire === undefined) {
    return;
  }

  expire = expire.filter((item) => !keyList.includes(item.key));
  if (expire.length > 0) {
    LS.setItem(EXPIRE_KEYS, toJSON(expire));
  } else {
    LS.removeItem(EXPIRE_KEYS);
  }
};

// Function to check and remove a key if expired
// If so... remove the key from the expiration list and the key
export const removeExpiredKeys = () => {
  let keyList = [];
  let expire = fromJSON(LS.getItem(EXPIRE_KEYS));

  if (expire && expire.length > 0) {
    expire = expire.filter((item) => {
      if (
        isBefore(new Date(), new Date(item.liveUntil)) &&
        LS.getItem(item.key)
      ) {
        return true;
      }
      LS.removeItem(item.key);
      keyList.push(item.key);
    });

    if (expire.length > 0) {
      LS.setItem(EXPIRE_KEYS, toJSON(expire));
    } else {
      LS.removeItem(EXPIRE_KEYS);
    }
  }
  return keyList;
};

export const setSvelteStoreInStorage = (
  subscribe,
  key,
  timeout,
  ignoreKeys = []
) => {
  const unsubscribe = subscribe((store) => {
    for (let iKeys of ignoreKeys) {
      store[iKeys] = undefined;
    }
    setItem(key, store, timeout);
  });
  unsubscribe();
};

export const getSvelteStoreInStorage = (update, key) => {
  const storage = getItem(key);
  if (!storage) {
    return;
  }
  update(() => {
    return Object.assign({}, cloneDeep(storage));
  });
};

// ------------------------------------------------- ## BELOW THIS LINE PRIVATE FUNCTIONS ONLY ## -------------------------------------------------
// add a key in the expiration key list
// key: String
// time: In milliseconds
function addExpireKey(key, time) {
  if (!Number.isInteger(time) || !Number.isSafeInteger(time)) {
    throw new Error("Time to add an expire key is not a safe integer");
  }

  let expire = fromJSON(LS.getItem(EXPIRE_KEYS));
  const liveUntil = addMilliseconds(new Date(), time);

  if (expire !== null && expire !== undefined) {
    expire = expire.filter((item) => item.key !== key);
    expire.push({ key, liveUntil });
  } else {
    expire = [{ key, liveUntil }];
  }

  LS.setItem(EXPIRE_KEYS, toJSON(expire));
}

// removes a specific key from expiration key list, may remove the key too
// key: String
// expireKeyOnly: Boolean -- only = true for only remove from expireKey OR the key itself too
function removeExpireKey(key, expireKeyOnly = true) {
  let expire = fromJSON(LS.getItem(EXPIRE_KEYS));
  if (expire === null || expire === undefined) {
    return;
  }

  expire = expire.filter((item) => item.key !== key);

  if (expire.length > 0) {
    LS.setItem(EXPIRE_KEYS, toJSON(expire));
  } else {
    LS.removeItem(EXPIRE_KEYS);
  }

  if (!expireKeyOnly && LS.getItem(key)) {
    LS.removeItem(key);
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
