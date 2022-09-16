import { configStore } from "../stores/index.js";

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - function to retrieve the query params of an URL or path
/ @Returns - All the params as object
*/
export function getQueryParameters(url) {
  try {
    if (!url || typeof url !== "string") {
      return {};
    }
    let getParams = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
      getParams[key] = value;
    });
    return getParams;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - function to set in the path all the query params informed
/ @Returns - A path with all the query params 
*/
export function setPathQueryParameters(path, queryParams) {
  try {
    if (!path || typeof path !== "string") {
      path = "/";
    }
    if (!queryParams || typeof queryParams !== "object") {
      queryParams = {};
    }
    if (Object.keys(queryParams).length == 0) {
      return path;
    }

    let queryParamArr = [];
    for (let key in queryParams) {
      queryParamArr.push(`${key}=${queryParams[key].toString().trim()}`);
    }
    if (queryParamArr.length > 0) {
      path += `?${queryParamArr.join("&")}`;
    }
    return path;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - To return or not a trailing slash depending of what is configured
/ @Returns - A string "" or "/"
*/
export function getTrailingSlash() {
  try {
    return configStore.getConsiderTrailingSlashOnMatchingRoute() ? "/" : "";
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Retrieve the real path part only, removing query params, origin, etc.
/ @Returns - A path as string
*/
export function getRealPath(path) {
  try {
    if (!path || typeof path != "string" || !path.includes("/")) {
      return path;
    }
    path = path.split("?");
    path = path[0];
    if (
      path.charAt(path.length - 1) !== "/" &&
      configStore.getConsiderTrailingSlashOnMatchingRoute()
    ) {
      path += "/";
    }
    return path;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Retrieve the hash part only
/ @Returns - A hash as string
*/
export function getHashFromPath(path) {
  try {
    if (!path || typeof path !== "string" || !path.includes("#")) {
      return "";
    }
    let hash = path.split("#");
    return "#" + hash[1];
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Retrieve the path part of a given path from origin or declared route inside routes object
/ @Returns - Returns a path part as string
*/
export function getPath(path) {
  try {
    if (!path || typeof path !== "string") {
      return "/";
    }

    // if it has http://xxxxx..
    if (path.includes(":/")) {
      path = path.split("/").slice(3);

      // else /just/path
    } else {
      path = path.split("/").slice(1);
    }

    if (path.length == 1) {
      if (path[0] == "") {
        return "/";
      }
      return `/${path[0]}`;
    }
    return `/${path.join("/")}`;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Retrieves all the location properties given a path
/ @Returns - Returns an object with location properties
*/
export function getLocationProperties(path) {
  try {
    let protocol = location.protocol.replace(":", "");
    let host = location.host;
    let port = location.port;
    let origin = location.origin;
    if (!path || typeof path !== "string" || !path.includes(":")) {
      return {
        protocol,
        host,
        port,
        origin,
      };
    }

    // protocol
    const splitDns = path.split(":");
    protocol = ["http", "https"].includes(splitDns[0]) ? splitDns[0] : protocol;

    // host
    const splitHostname = splitDns[1].split("/");
    host = splitHostname[2] ? splitHostname[2] : host;

    // port
    if (splitDns[2]) {
      const portAux = splitDns[2].split("/");
      port = `:${portAux[0]}`;
      host += port;
    }

    // origin
    if (protocol != "" && host != "") {
      origin = `${protocol}://${host}`;
    }

    return {
      protocol,
      host,
      port,
      origin,
    };
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Retrieves a path with injected path params in it
/ @Returns - Returns a path with all path params inside of it as string
*/
export function treatRoutePathParams(path, pathParams) {
  try {
    if (!pathParams || typeof pathParams != "object") {
      return path;
    }
    for (let key in pathParams) {
      path = path.replace(key, pathParams[key].toString().trim());
    }
    return path;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Retrieves a path with injected any route params in it
/ @Returns - Returns a path with all any route params inside of it as string
*/
export function treatRouteAnyRouteParams(path, anyRouteParams) {
  try {
    if (!anyRouteParams || !Array.isArray(anyRouteParams)) {
      return path;
    }
    for (let anyRouteParam of anyRouteParams) {
      if (!anyRouteParam.find || !anyRouteParam.replacement) {
        continue;
      }
      path = path.replace(
        anyRouteParam.find,
        anyRouteParam.replacement.toString().trim()
      );
    }
    return path;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------

/*
/ @Summary - Load the first component async of a list of components or else a default component
/ @Returns - Returns the component loaded or a default component to be loaded if any component was loaded
*/
export async function asyncLoadComponentsFunc(
  listComponents,
  defaultComponent
) {
  try {
    // not an array return default component
    if (!Array.isArray(listComponents)) {
      return defaultComponent;
    }

    for (let component of listComponents) {
      // skipping not async loading components or params
      if (typeof component !== "function") {
        continue;
      }
      
      // if is lazy loading component now is the time to load
      const loadedComponent = await component();
      if (loadedComponent && loadedComponent.default) {
        return loadedComponent.default;
      }
    }

    return defaultComponent;
  } catch (error) {
    throw error;
  }
}

// ------------------------------------------------------------------------------------------------
