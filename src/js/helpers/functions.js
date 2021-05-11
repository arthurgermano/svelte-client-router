import cloneDeep from "lodash/cloneDeep";

export const assign = (target, source) => {
  return Object.assign(cloneDeep(target), cloneDeep(source));
};

export const getStoreKey = (store, key) => {
  const storeState = getStoreState(store);
  return storeState[key];
};

export const getStoreState = (store) => {
  let storeStateObj;
  const unsubscribe = store.subscribe((storeState) => {
    if (!Array.isArray(storeState)) {
      storeStateObj = assign({}, storeState);
    } else {
      storeStateObj = [...storeState];
    }
  });
  unsubscribe();
  return storeStateObj;
};

export const updateStoreKey = (store, objValue) => {
  store.update((storeState) => {
    return assign(storeState, objValue);
  });
};
