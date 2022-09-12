import * as data from "./data.js";

import { describe, it, beforeEach } from "vitest";
import { Window } from "happy-dom";
import { configStore } from "./src/stores/index.js";
import * as routerFunctions from "./src/core/routerFunctions.js";

// ------------------------------------------------------------------------------------------------

const completeURL = "http://localhost:3030/path/to/method?v1=Test&v2=Unit";
const window = new Window();

// ------------------------------------------------------------------------------------------------

beforeEach(() => {
  global.window = window;
  window.location.href = completeURL;
  global.location = window.location;
  global.history = window.history;
  configStore.setConsiderTrailingSlashOnMatchingRoute(true);
  configStore.setBeforeEnter(() => {});
  routerFunctions.onMountComponent({ routes: data.routes });
});

// ------------------------------------------------------------------------------------------------
describe("core -> routerFunctions", () => {
  describe("findRoutePerPath()", () => {
    it("findRoutePerPath() - searching a not declared route", () => {
      const result = routerFunctions.findRoutePerPath("no valid route");
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - searching a simple declared route", () => {
      const result = routerFunctions.findRoutePerPath("/scr/installation");
      expect(result.name).toBe("installationRoute");
      expect(result.path).toBe("/scr/installation");
      expect(result.title).toBe("SCR - Installation");
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - searching a route with parameters and return path params", () => {
      const result = routerFunctions.findRoutePerPath(
        "/scr/2/testRegexPathParam"
      );
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/:teste/testRegexPathParam");
      expect(result.forceReload).toBe(true);
      expect(result.pathParams).toEqual({ teste: "2" });
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - searching a route with more path parameters and return path two params", () => {
      const result = routerFunctions.findRoutePerPath(
        "/scr/123/testRegexPathParam2/false"
      );
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe(
        "/scr/:firstParam/testRegexPathParam2/:secondParam"
      );
      expect(result.forceReload).toBe(true);
      expect(result.pathParams).toEqual({
        firstParam: "123",
        secondParam: "false",
      });
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - searching route with wildcard path in the middle", () => {
      const result = routerFunctions.findRoutePerPath(
        "/scr/anyRouteWildcard/anythinghehe/middle"
      );
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/*/middle");
      expect(result.forceReload).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - searching route with wildcard path in the end", () => {
      const result = routerFunctions.findRoutePerPath(
        "/scr/path/somethinghere"
      );
      expect(result.name).toBe("testAnyWildCardStringStarting");
      expect(result.path).toBe("/scr/path/some*");
      expect(result.forceReload).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - searching route similar but not maching with wildcard path in the end", () => {
      const result = routerFunctions.findRoutePerPath("/scr/path/somESimilar");
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - searching route with wildcard and path param", () => {
      const result = routerFunctions.findRoutePerPath(
        "/scr/anyRouteWildcard/anythinghere/123ABC"
      );
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/*/:somePathParam");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - searching route similar but with more path parts", () => {
      const result = routerFunctions.findRoutePerPath(
        "/scr/anyRouteWildcard/anythinghere/123ABC/noMatch"
      );
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - searching route with param route defined", () => {
      const result = routerFunctions.findRoutePerPath(
        "/scr/routerWithParamsDefined"
      );
      expect(result.name).toBe("routerWithParamsDefined");
      expect(result.path).toBe("/scr/routerWithParamsDefined");
      expect(result.title).toBe("SCR - Route With Params Defined");
      expect(result.params).toEqual({ p1: "Route", isDefined: true });
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching a not declared route", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath("no valid route");
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching a simple declared route", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath("/scr/installation");
      expect(result.name).toBe("installationRoute");
      expect(result.path).toBe("/scr/installation");
      expect(result.title).toBe("SCR - Installation");
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching a route with parameters and return path params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath(
        "/scr/2/testRegexPathParam"
      );
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/:teste/testRegexPathParam");
      expect(result.forceReload).toBe(true);
      expect(result.pathParams).toEqual({ teste: "2" });
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching a route with more path parameters and return path two params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath(
        "/scr/123/testRegexPathParam2/false"
      );
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe(
        "/scr/:firstParam/testRegexPathParam2/:secondParam"
      );
      expect(result.forceReload).toBe(true);
      expect(result.pathParams).toEqual({
        firstParam: "123",
        secondParam: "false",
      });
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching route with wildcard path in the middle", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath(
        "/scr/anyRouteWildcard/anythinghehe/middle"
      );
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/*/middle");
      expect(result.forceReload).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching route with wildcard path in the end", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath(
        "/scr/path/somethinghere"
      );
      expect(result.name).toBe("testAnyWildCardStringStarting");
      expect(result.path).toBe("/scr/path/some*");
      expect(result.forceReload).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching route similar but not maching with wildcard path in the end", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath("/scr/path/somESimilar");
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching route with wildcard and path param", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath(
        "/scr/anyRouteWildcard/anythinghere/123ABC"
      );
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/*/:somePathParam");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching route similar but with more path parts", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath(
        "/scr/anyRouteWildcard/anythinghere/123ABC/noMatch"
      );
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerPath() - with trailing slash OFF searching route with param route defined", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = routerFunctions.findRoutePerPath(
        "/scr/routerWithParamsDefined"
      );
      expect(result.name).toBe("routerWithParamsDefined");
      expect(result.path).toBe("/scr/routerWithParamsDefined");
      expect(result.title).toBe("SCR - Route With Params Defined");
      expect(result.params).toEqual({ p1: "Route", isDefined: true });
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("getRouteObjectFromPath()", () => {
    it("getRouteObjectFromPath() - get a current location without any route matching", () => {
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
      expect(result.queryParams).toEqual({ v1: "Test", v2: "Unit" });
      expect(result.origin).toBe("http://localhost:3030");
      expect(result.port).toBe(":3030");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a simple defined route", () => {
      window.location.href = "http://localhost:3030/scr/installation";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("installationRoute");
      expect(result.path).toBe("/scr/installation");
      expect(result.origin).toBe("http://localhost:3030");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a simple defined route and query params", () => {
      window.location.href =
        "http://localhost:3030/scr/installation?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("installationRoute");
      expect(result.path).toBe("/scr/installation");
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
      expect(result.origin).toBe("http://localhost:3030");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with path param", () => {
      window.location.href = "http://localhost:3030/scr/2/testRegexPathParam";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/2/testRegexPathParam");
      expect(result.origin).toBe("http://localhost:3030");
      expect(result.pathParams).toEqual({ teste: "2" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with path param and query params", () => {
      window.location.href =
        "http://localhost:3030/scr/2/testRegexPathParam?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/2/testRegexPathParam");
      expect(result.origin).toBe("http://localhost:3030");
      expect(result.pathParams).toEqual({ teste: "2" });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with two path params", () => {
      window.location.href =
        "http://localhost:3030/scr/false/testRegexPathParam2/123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe("/scr/false/testRegexPathParam2/123");
      expect(result.pathParams).toEqual({
        firstParam: "false",
        secondParam: "123",
      });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with two path params and query params", () => {
      window.location.href =
        "http://localhost:3030/scr/false/testRegexPathParam2/123?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe("/scr/false/testRegexPathParam2/123");
      expect(result.pathParams).toEqual({
        firstParam: "false",
        secondParam: "123",
      });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with wild route card definition", () => {
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghehe/middle";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghehe/middle");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with wild route card definition and query params", () => {
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghehe/middle?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghehe/middle");
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with wildcard path in the end", () => {
      window.location.href = "http://localhost:3030/scr/path/somethinghere";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardStringStarting");
      expect(result.path).toBe("/scr/path/somethinghere");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route similar but not maching with wildcard path in the end", () => {
      window.location.href = "http://localhost:3030/scr/path/somESimilar";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(
        "/scr/path/somESimilar"
      );
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with wildcard and path param", () => {
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghere/123ABC";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghere/123ABC");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with wildcard and path param and query params", () => {
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghere/123ABC?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghere/123ABC");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route similar but with more path parts", () => {
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghere/123ABC/noMatch";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - get a route with param route defined", () => {
      window.location.href =
        "http://localhost:3030/scr/routerWithParamsDefined";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("routerWithParamsDefined");
      expect(result.path).toBe("/scr/routerWithParamsDefined");
      expect(result.params).toEqual({ p1: "Route", isDefined: true });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a simple defined route", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href = "http://localhost:3030/scr/installation";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("installationRoute");
      expect(result.path).toBe("/scr/installation");
      expect(result.origin).toBe("http://localhost:3030");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a simple defined route and query params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/installation?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("installationRoute");
      expect(result.path).toBe("/scr/installation");
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
      expect(result.origin).toBe("http://localhost:3030");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with path param", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href = "http://localhost:3030/scr/2/testRegexPathParam";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/2/testRegexPathParam");
      expect(result.origin).toBe("http://localhost:3030");
      expect(result.pathParams).toEqual({ teste: "2" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with path param and query params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/2/testRegexPathParam?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/2/testRegexPathParam");
      expect(result.origin).toBe("http://localhost:3030");
      expect(result.pathParams).toEqual({ teste: "2" });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with two path params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/false/testRegexPathParam2/123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe("/scr/false/testRegexPathParam2/123");
      expect(result.pathParams).toEqual({
        firstParam: "false",
        secondParam: "123",
      });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with two path params and query params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/false/testRegexPathParam2/123?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe("/scr/false/testRegexPathParam2/123");
      expect(result.pathParams).toEqual({
        firstParam: "false",
        secondParam: "123",
      });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with wild route card definition", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghehe/middle";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghehe/middle");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with wild route card definition and query params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghehe/middle?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghehe/middle");
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with wildcard path in the end", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href = "http://localhost:3030/scr/path/somethinghere";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardStringStarting");
      expect(result.path).toBe("/scr/path/somethinghere");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route similar but not maching with wildcard path in the end", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href = "http://localhost:3030/scr/path/somESimilar";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(
        "/scr/path/somESimilar"
      );
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with wildcard and path param", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghere/123ABC";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghere/123ABC");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with wildcard and path param and query params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghere/123ABC?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghere/123ABC");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route similar but with more path parts", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/anyRouteWildcard/anythinghere/123ABC/noMatch";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF get a route with param route defined", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://localhost:3030/scr/routerWithParamsDefined";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("routerWithParamsDefined");
      expect(result.path).toBe("/scr/routerWithParamsDefined");
      expect(result.params).toEqual({ p1: "Route", isDefined: true });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a simple defined route and query params", () => {
      window.location.href =
        "http://mydomain/scr/installation?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("installationRoute");
      expect(result.path).toBe("/scr/installation");
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
      expect(result.origin).toBe("http://mydomain");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get root route", () => {
      window.location.href = "http://mydomain";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("root");
      expect(result.path).toBe("/");
      expect(result.origin).toBe("http://mydomain");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with path param", () => {
      window.location.href = "http://mydomain.com/scr/2/testRegexPathParam";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/2/testRegexPathParam");
      expect(result.origin).toBe("http://mydomain.com");
      expect(result.pathParams).toEqual({ teste: "2" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with path param and query params", () => {
      window.location.href =
        "http://mydomain.com/scr/2/testRegexPathParam?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/2/testRegexPathParam");
      expect(result.origin).toBe("http://mydomain.com");
      expect(result.pathParams).toEqual({ teste: "2" });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with two path params", () => {
      window.location.href =
        "http://mydomain.com/scr/false/testRegexPathParam2/123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe("/scr/false/testRegexPathParam2/123");
      expect(result.pathParams).toEqual({
        firstParam: "false",
        secondParam: "123",
      });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with two path params and query params", () => {
      window.location.href =
        "http://mydomain.com/scr/false/testRegexPathParam2/123?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe("/scr/false/testRegexPathParam2/123");
      expect(result.pathParams).toEqual({
        firstParam: "false",
        secondParam: "123",
      });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with wild route card definition", () => {
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghehe/middle";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghehe/middle");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with wild route card definition and query params", () => {
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghehe/middle?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghehe/middle");
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with wildcard path in the end", () => {
      window.location.href = "http://mydomain.com/scr/path/somethinghere";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardStringStarting");
      expect(result.path).toBe("/scr/path/somethinghere");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route similar but not maching with wildcard path in the end", () => {
      window.location.href = "http://mydomain.com/scr/path/somESimilar";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(
        "/scr/path/somESimilar"
      );
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with wildcard and path param", () => {
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghere/123ABC";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghere/123ABC");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with wildcard and path param and query params", () => {
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghere/123ABC?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghere/123ABC");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route similar but with more path parts", () => {
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghere/123ABC/noMatch";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - not local route get a route with param route defined", () => {
      window.location.href = "http://mydomain.com/scr/routerWithParamsDefined";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("routerWithParamsDefined");
      expect(result.path).toBe("/scr/routerWithParamsDefined");
      expect(result.params).toEqual({ p1: "Route", isDefined: true });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with path param", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href = "http://mydomain.com/scr/2/testRegexPathParam";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/2/testRegexPathParam");
      expect(result.origin).toBe("http://mydomain.com");
      expect(result.pathParams).toEqual({ teste: "2" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with path param and query params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://mydomain.com/scr/2/testRegexPathParam?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPathRoute");
      expect(result.path).toBe("/scr/2/testRegexPathParam");
      expect(result.origin).toBe("http://mydomain.com");
      expect(result.pathParams).toEqual({ teste: "2" });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with two path params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://mydomain.com/scr/false/testRegexPathParam2/123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe("/scr/false/testRegexPathParam2/123");
      expect(result.pathParams).toEqual({
        firstParam: "false",
        secondParam: "123",
      });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with two path params and query params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://mydomain.com/scr/false/testRegexPathParam2/123?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testRegexPath2Route");
      expect(result.path).toBe("/scr/false/testRegexPathParam2/123");
      expect(result.pathParams).toEqual({
        firstParam: "false",
        secondParam: "123",
      });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with wild route card definition", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghehe/middle";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghehe/middle");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with wild route card definition and query params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghehe/middle?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardMiddle");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghehe/middle");
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with wildcard path in the end", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href = "http://mydomain.com/scr/path/somethinghere";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildCardStringStarting");
      expect(result.path).toBe("/scr/path/somethinghere");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route similar but not maching with wildcard path in the end", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href = "http://mydomain.com/scr/path/somESimilar";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(
        "/scr/path/somESimilar"
      );
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with wildcard and path param", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghere/123ABC";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghere/123ABC");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with wildcard and path param and query params", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghere/123ABC?q1=AAA&someVar=123";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("testAnyWildcardRouteWithPathParam");
      expect(result.path).toBe("/scr/anyRouteWildcard/anythinghere/123ABC");
      expect(result.pathParams).toEqual({ somePathParam: "123ABC" });
      expect(result.queryParams).toEqual({ q1: "AAA", someVar: "123" });
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route similar but with more path parts", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href =
        "http://mydomain.com/scr/anyRouteWildcard/anythinghere/123ABC/noMatch";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromPath() - with trailing slash OFF not local route get a route with param route defined", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      window.location.href = "http://mydomain.com/scr/routerWithParamsDefined";
      global.location = window.location;
      const result = routerFunctions.getRouteObjectFromPath(location.href);
      expect(result.name).toBe("routerWithParamsDefined");
      expect(result.path).toBe("/scr/routerWithParamsDefined");
      expect(result.params).toEqual({ p1: "Route", isDefined: true });
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("checkRouteRelevance()", () => {
    it("checkRouteRelevance() - pass undefined as route realPath param", () => {
      const result = routerFunctions.checkRouteRelevance(
        undefined,
        "routePath",
        {}
      );
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("checkRouteRelevance() - pass undefined as route routePath param", () => {
      const result = routerFunctions.checkRouteRelevance(
        "realPath",
        undefined,
        {}
      );
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("checkRouteRelevance() - pass a simple realRoute and routePath", () => {
      const result = routerFunctions.checkRouteRelevance(
        "/scr/size",
        "/scr/size",
        {}
      );
      expect(result).toBe(16);
    });

    // --------------------------------------------------------------------------------------------

    it("checkRouteRelevance() - pass a simple realRoute and routePath but not maching", () => {
      const result = routerFunctions.checkRouteRelevance(
        "/scr/size",
        "/scr/sizE",
        {}
      );
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("checkRouteRelevance() - pass a path param realRoute and routePath", () => {
      const result = routerFunctions.checkRouteRelevance(
        "/scr/2",
        "/scr/:t",
        {}
      );
      expect(result).toBe(11);
    });

    // --------------------------------------------------------------------------------------------

    it("checkRouteRelevance() - pass a path param realRoute and routePath and any wildcard", () => {
      const result = routerFunctions.checkRouteRelevance(
        "/scr/2/anythinghere",
        "/scr/:t/*",
        {}
      );
      expect(result).toBe(12);
    });

    // --------------------------------------------------------------------------------------------

    it("checkRouteRelevance() - pass a path param realRoute and routePath and any wildcard ending a string", () => {
      const result = routerFunctions.checkRouteRelevance(
        "/scr/2/anythinghere",
        "/scr/:t/anyth*",
        {}
      );
      expect(result).toBe(12);
    });

    // --------------------------------------------------------------------------------------------

    it("checkRouteRelevance() - pass a complex route with path params wild cards", () => {
      let pathParams = {};
      const result = routerFunctions.checkRouteRelevance(
        "/scr/2/anythinghere/3/moreinfo/end",
        "/scr/:t/anyth*/:t2/*/end",
        pathParams
      );
      expect(result).toBe(18);
      expect(pathParams.t).toBe("2");
      expect(pathParams.t2).toBe("3");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("findRoutePerName()", () => {
    it("findRoutePerName() - passing a route name as undefined", () => {
      const result = routerFunctions.findRoutePerName();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerName() - passing a route name undeclared", () => {
      const result = routerFunctions.findRoutePerName(
        "not a declared name route"
      );
      expect(result.name).toBe("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toBe(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("findRoutePerName() - passing a route name declared", () => {
      const result = routerFunctions.findRoutePerName("navigationStoreRoute");
      expect(result.name).toBe("navigationStoreRoute");
      expect(result.path).toBe("/scr/navigationStore");
      expect(result.title).toBe("SCR - Navigation - Store");
    });

    // --------------------------------------------------------------------------------------------
  });

  // ----------------------------------------------------------------------------------------------

  describe("getBeforeEnterAsArray()", () => {
    it("getBeforeEnterAsArray() - passing a before function as undefined", () => {
      const result = routerFunctions.getBeforeEnterAsArray();
      expect(result).toEqual([]);
    });

    // --------------------------------------------------------------------------------------------

    it("getBeforeEnterAsArray() - passing an invalid function", () => {
      const result = routerFunctions.getBeforeEnterAsArray("not a function");
      expect(result).toEqual([]);
    });

    // --------------------------------------------------------------------------------------------

    it("getBeforeEnterAsArray() - passing a valid function", () => {
      const result = routerFunctions.getBeforeEnterAsArray(() => {});
      expect(result[0]).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("getBeforeEnterAsArray() - passing an array of valid functions", () => {
      const result = routerFunctions.getBeforeEnterAsArray([
        () => {},
        () => {},
        () => {},
      ]);
      expect(result[0]).toBeTypeOf("function");
      expect(result[1]).toBeTypeOf("function");
      expect(result[2]).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("getBeforeEnterAsArray() - passing an array with valid and invalid functions", () => {
      const result = routerFunctions.getBeforeEnterAsArray([
        () => {},
        "Test",
        () => {},
        123,
        false,
      ]);
      expect(result[0]).toBeTypeOf("function");
      expect(result[1]).toBeTypeOf("function");
      expect(result.length).toBe(2);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("getOrderedBeforeEnterFunctionList()", () => {
    it("getOrderedBeforeEnterFunctionList() - no route BEF defined", () => {
      const result = routerFunctions.getOrderedBeforeEnterFunctionList();
      expect(result.first.length).toEqual(1);
      expect(result.first[0]).toBeTypeOf("function");
      expect(result.then.length).toEqual(0);
    });

    // --------------------------------------------------------------------------------------------

    it("getOrderedBeforeEnterFunctionList() - a route with one BEF defined", () => {
      const result = routerFunctions.getOrderedBeforeEnterFunctionList({
        definition: data.route,
      });
      expect(result.first.length).toEqual(1);
      expect(result.first[0]).toBeTypeOf("function");
      expect(result.then.length).toEqual(1);
      expect(result.then[0]).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("getOrderedBeforeEnterFunctionList() - a route with two BEF defined", () => {
      const result = routerFunctions.getOrderedBeforeEnterFunctionList({
        definition: {
          beforeEnter: [() => {}, () => {}],
        },
      });
      expect(result.first.length).toEqual(1);
      expect(result.first[0]).toBeTypeOf("function");
      expect(result.then.length).toEqual(2);
      expect(result.then[0]).toBeTypeOf("function");
      expect(result.then[1]).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("getOrderedBeforeEnterFunctionList() - a route with two BEF defined, ignoring global BEF", () => {
      const result = routerFunctions.getOrderedBeforeEnterFunctionList({
        definition: {
          ignoreGlobalBeforeFunction: true,
          beforeEnter: [() => {}, () => {}],
        },
      });
      expect(result.first.length).toEqual(0);
      expect(result.then.length).toEqual(2);
      expect(result.then[0]).toBeTypeOf("function");
      expect(result.then[1]).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("getOrderedBeforeEnterFunctionList() - a route with two BEF defined, executing route BEF before global BEF", () => {
      const result = routerFunctions.getOrderedBeforeEnterFunctionList({
        definition: {
          executeRouteBEFBeforeGlobalBEF: true,
          beforeEnter: [() => {}, () => {}],
        },
      });
      expect(result.first.length).toEqual(2);
      expect(result.first[0]).toBeTypeOf("function");
      expect(result.first[1]).toBeTypeOf("function");
      expect(result.then.length).toEqual(1);
      expect(result.then[0]).toBeTypeOf("function");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("getRouteObjectFromName()", () => {
    it("getRouteObjectFromName() - get a route with a undefined", () => {
      const result = routerFunctions.getRouteObjectFromName();
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toEqual(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route with a invalid", () => {
      const result = routerFunctions.getRouteObjectFromName("invalid");
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("SCR_NOT_FOUND_ROUTE");
      expect(result.path).toEqual(configStore.getNotFoundRoute());
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route valid", () => {
      const result = routerFunctions.getRouteObjectFromName({
        name: "installationRoute",
      });
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("installationRoute");
      expect(result.path).toEqual("/scr/installation");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route valid with path param", () => {
      const result = routerFunctions.getRouteObjectFromName({
        name: "testRegexPathRoute",
        pathParams: {
          ":teste": "abc123",
        },
      });
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("testRegexPathRoute");
      expect(result.path).toEqual("/scr/abc123/testRegexPathParam");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route valid with valid path params", () => {
      const result = routerFunctions.getRouteObjectFromName({
        name: "testRegexPath2Route",
        pathParams: {
          ":firstParam": "123",
          ":secondParam": "abc",
        },
      });
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("testRegexPath2Route");
      expect(result.path).toEqual("/scr/123/testRegexPathParam2/abc");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route valid with invalid path params", () => {
      const result = routerFunctions.getRouteObjectFromName({
        name: "testRegexPath2Route",
        pathParams: {
          ":invalidParam": "123",
          ":invalidParam2": "abc",
        },
      });
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("testRegexPath2Route");
      expect(result.path).toEqual(
        "/scr/:firstParam/testRegexPathParam2/:secondParam"
      );
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route valid with any route path", () => {
      const result = routerFunctions.getRouteObjectFromName({
        name: "testAnyWildCardMiddle",
      });
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("testAnyWildCardMiddle");
      expect(result.path).toEqual("/scr/anyRouteWildcard/*/middle");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route valid with invalid any route path", () => {
      const result = routerFunctions.getRouteObjectFromName({
        name: "testAnyWildCardMiddle",
        anyRouteParams: [
          {
            find: "*A",
            replacement: "testAny",
          },
        ],
      });
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("testAnyWildCardMiddle");
      expect(result.path).toEqual("/scr/anyRouteWildcard/*/middle");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route valid with any route path", () => {
      const result = routerFunctions.getRouteObjectFromName({
        name: "testAnyWildCardMiddle",
        anyRouteParams: [
          {
            find: "*",
            replacement: "testAny",
          },
        ],
      });
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("testAnyWildCardMiddle");
      expect(result.path).toEqual("/scr/anyRouteWildcard/testAny/middle");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route valid with any route path and path params", () => {
      const result = routerFunctions.getRouteObjectFromName({
        name: "testAnyWildcardRouteWithPathParam",
        pathParams: {
          ":somePathParam": "123",
        },
        anyRouteParams: [
          {
            find: "*",
            replacement: "testAny",
          },
        ],
      });
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("testAnyWildcardRouteWithPathParam");
      expect(result.path).toEqual("/scr/anyRouteWildcard/testAny/123");
    });

    // --------------------------------------------------------------------------------------------

    it("getRouteObjectFromName() - get a route valid with any route path regex", () => {
      const result = routerFunctions.getRouteObjectFromName({
        name: "testAnyWildCardStringStarting",
        anyRouteParams: [
          {
            find: "some*",
            replacement: "NEWsomeSTART",
          },
        ],
      });
      expect(result.host).toEqual("localhost:3030");
      expect(result.name).toEqual("testAnyWildCardStringStarting");
      expect(result.path).toEqual("/scr/path/NEWsomeSTART");
    });
  });
});
