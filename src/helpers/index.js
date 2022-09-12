import cloneDeep from "lodash.clonedeep";

// ------------------------------------------------------------------------------------------------

export function assign(target, source) {
  return Object.assign(
    cloneDeep(enforceType(target)),
    cloneDeep(enforceType(source))
  );
}

// ------------------------------------------------------------------------------------------------

export function enforceType(value) {
  if (typeof value == "object" || Array.isArray(value)) {
    return value;
  }
  return {};
}
