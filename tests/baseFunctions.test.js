import { describe, it, beforeEach } from "vitest";
import { Window } from "happy-dom";
import { configStore } from "./src/stores/index.js";
import { onMountComponent } from "./src/core/routerFunctions.js";
import * as baseFunctions from "./src/core/baseFunctions.js";
import * as data from "./data.js";
import SCR_GettingStarted from "./SCR_GettingStarted.svelte";
import SCR_Installation from "./SCR_Installation.svelte";

// ------------------------------------------------------------------------------------------------

const completeURL = "http://localhost:3030/path/to/method?v1=Test&v2=Unit";
const completePath = "/path/to/method?v1=Test&v2=Unit";
const window = new Window();

// ------------------------------------------------------------------------------------------------
global.window = window;


beforeEach(() => {
  window.location.href = completeURL;
  global.location = window.location;
  global.history = window.history;
  configStore.setConsiderTrailingSlashOnMatchingRoute(true);
  configStore.setBeforeEnter(() => {});
  onMountComponent({ routes: data.routes });
});

// ------------------------------------------------------------------------------------------------
describe("core -> baseFunctions", () => {
  describe("getQueryParams()", () => {
    it("getQueryParams() - given an URL retrieve all the query params", () => {
      const queryParams = baseFunctions.getQueryParameters(completeURL);
      expect(Object.keys(queryParams).length).toBe(2);
      expect(queryParams).toHaveProperty("v1", "Test");
      expect(queryParams).toHaveProperty("v2", "Unit");
    });

    // --------------------------------------------------------------------------------------------

    it("getQueryParams() - given an empty URL retrieve no query params", () => {
      const queryParams = baseFunctions.getQueryParameters();
      expect(Object.keys(queryParams).length).toBe(0);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("getTrailingSlash()", () => {
    it("getTrailingSlash() - with config store to consider get trailing slash on matching route", () => {
      const result = baseFunctions.getTrailingSlash();
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getTrailingSlash() - with config store to NOT consider trailing slash on matching route", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = baseFunctions.getTrailingSlash();
      expect(result).toBe("");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("getRealPath()", () => {
    it("getRealPath() - with config store to consider trailing slash getting real path", () => {
      const result = baseFunctions.getRealPath(completePath);
      expect(result).toBe("/path/to/method/");
    });

    // --------------------------------------------------------------------------------------------

    it("getRealPath() - with config store to NOT consider trailing slash getting real path", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = baseFunctions.getRealPath(completePath);
      expect(result).toBe("/path/to/method");
    });

    // --------------------------------------------------------------------------------------------

    it("getRealPath() - with config store to consider trailing slash passing an undefined path", () => {
      const result = baseFunctions.getRealPath();
      expect(result).toBeUndefined();
    });

    // --------------------------------------------------------------------------------------------

    it("getRealPath() - with config store to consider trailing slash passing an invalid path", () => {
      const result = baseFunctions.getRealPath("an invalid path");
      expect(result).toBe("an invalid path");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("getHashFromPath()", () => {
    it("getHashFromPath() - get hash from path", () => {
      const result = baseFunctions.getHashFromPath("/path/to/function#123");
      expect(result).toBe("#123");
    });

    // --------------------------------------------------------------------------------------------

    it("getHashFromPath() - get hash from path without hash", () => {
      const result = baseFunctions.getHashFromPath("/path/to/function");
      expect(result).toBe("");
    });

    // --------------------------------------------------------------------------------------------

    it("getHashFromPath() - get hash from path undefined", () => {
      const result = baseFunctions.getHashFromPath();
      expect(result).toBe("");
    });

    // --------------------------------------------------------------------------------------------

    it("getHashFromPath() - get hash from path invalid", () => {
      const result = baseFunctions.getHashFromPath({ a: "123" });
      expect(result).toBe("");
    });

    // --------------------------------------------------------------------------------------------

    it("getHashFromPath() - get hash from url", () => {
      const result = baseFunctions.getHashFromPath(
        "http://mydomain.com/path/to/function#123"
      );
      expect(result).toBe("#123");
    });

    // --------------------------------------------------------------------------------------------

    it("getHashFromPath() - get hash from localhost", () => {
      const result = baseFunctions.getHashFromPath(
        "http://localhost:3030/path/to/function#123"
      );
      expect(result).toBe("#123");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("getLocationProperties()", () => {
    it("getLocationProperties() - get location from localhost", () => {
      const result = baseFunctions.getLocationProperties(
        "http://localhost:3030/path/to/function#123"
      );
      expect(result.protocol).toBe("http");
      expect(result.host).toBe("localhost:3030");
      expect(result.port).toBe(":3030");
      expect(result.origin).toBe("http://localhost:3030");
    });

    // --------------------------------------------------------------------------------------------

    it("getLocationProperties() - get location from path", () => {
      const result = baseFunctions.getLocationProperties(
        "/path/to/function#123"
      );
      expect(result.protocol).toBe("http");
      expect(result.host).toBe("localhost:3030");
      expect(result.port).toBe(":3030");
      expect(result.origin).toBe("http://localhost:3030");
    });

    // --------------------------------------------------------------------------------------------

    it("getLocationProperties() - get location from undefined value", () => {
      const result = baseFunctions.getLocationProperties();
      expect(result.protocol).toBe("http");
      expect(result.host).toBe("localhost:3030");
      expect(result.port).toBe(":3030");
      expect(result.origin).toBe("http://localhost:3030");
    });

    // --------------------------------------------------------------------------------------------

    it("getLocationProperties() - get location from invalid value", () => {
      const result = baseFunctions.getLocationProperties({});
      expect(result.protocol).toBe("http");
      expect(result.host).toBe("localhost:3030");
      expect(result.port).toBe(":3030");
      expect(result.origin).toBe("http://localhost:3030");
    });

    // --------------------------------------------------------------------------------------------

    it("getLocationProperties() - get location from normal url", () => {
      const result = baseFunctions.getLocationProperties(
        "https://mydomain.com/path/to/function#123"
      );
      expect(result.protocol).toBe("https");
      expect(result.host).toBe("mydomain.com");
      expect(result.port).toBe(":3030");
      expect(result.origin).toBe("https://mydomain.com");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("getPath()", () => {
    it("getPath() - get path from localhost", () => {
      const result = baseFunctions.getPath(
        "http://localhost:3030/path/to/function#123"
      );
      expect(result).toBe("/path/to/function#123");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from domain", () => {
      const result = baseFunctions.getPath(
        "https://mydomain.com/path/to/function#123"
      );
      expect(result).toBe("/path/to/function#123");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from domain with hashtag", () => {
      const result = baseFunctions.getPath(
        "https://mydomain.com/#/path/to/function"
      );
      expect(result).toBe("/#/path/to/function");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from path", () => {
      const result = baseFunctions.getPath("/#/path/to/function");
      expect(result).toBe("/#/path/to/function");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from undefined", () => {
      const result = baseFunctions.getPath();
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from invalid value", () => {
      const result = baseFunctions.getPath({});
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from domain without protocol", () => {
      const result = baseFunctions.getPath("mydomain.com/path/to/function");
      expect(result).toBe("/path/to/function");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from localhost without protocol", () => {
      const result = baseFunctions.getPath("localhost:3030/path/to/function");
      expect(result).toBe("/path/to/function");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from localhost without protocol with hash tag", () => {
      const result = baseFunctions.getPath("localhost:3030/#/path/to/function");
      expect(result).toBe("/#/path/to/function");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from localhost with no protocol and no path", () => {
      const result = baseFunctions.getPath("localhost:3030");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from domain with no protocol and no path", () => {
      const result = baseFunctions.getPath("mydomain.com:3030");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from localhost and no path", () => {
      const result = baseFunctions.getPath("http://localhost:3030");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from domain and no path", () => {
      const result = baseFunctions.getPath("https://mydomain.com:3030");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from localhost with no protocol and no path with trailing slash", () => {
      const result = baseFunctions.getPath("localhost:3030/");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from domain with no protocol and no path with trailing slash", () => {
      const result = baseFunctions.getPath("mydomain.com:3030/");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from localhost and no path with trailing slash", () => {
      const result = baseFunctions.getPath("http://localhost:3030/");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("getPath() - get path from domain and no path with trailing slash", () => {
      const result = baseFunctions.getPath("https://mydomain.com:3030/");
      expect(result).toBe("/");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("treatRoutePathParams()", () => {
    it("treatRoutePathParams() - no path params object", () => {
      const result = baseFunctions.treatRoutePathParams("/");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRoutePathParams() - path params object one path param", () => {
      const result = baseFunctions.treatRoutePathParams("/path/:p/test", {
        ":p": 123,
      });
      expect(result).toBe("/path/123/test");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRoutePathParams() - path params object two path param", () => {
      const result = baseFunctions.treatRoutePathParams(
        "/path/:p/test/p/*/:p2/a",
        {
          ":p": 123,
          ":p2": "abc",
        }
      );
      expect(result).toBe("/path/123/test/p/*/abc/a");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRoutePathParams() - path params object two path param and one wrong in the second param", () => {
      const result = baseFunctions.treatRoutePathParams(
        "/path/:p/test/p/*/:pa2/a",
        {
          ":p": 123,
          ":p2": "abc",
        }
      );
      expect(result).toBe("/path/123/test/p/*/:pa2/a");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRoutePathParams() - path params object two path param and one wrong in the first param", () => {
      const result = baseFunctions.treatRoutePathParams(
        "/path/:p/test/p/*/:p2/a",
        {
          ":p": 123,
          ":pa2": "abc",
        }
      );
      expect(result).toBe("/path/123/test/p/*/:p2/a");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRoutePathParams() - no path passed", () => {
      const result = () =>
        baseFunctions.treatRoutePathParams(undefined, {
          ":p": 123,
          ":pa2": "abc",
        });
      expect(result).toThrow(
        "Cannot read properties of undefined (reading 'replace')"
      );
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("treatRouteAnyRouteParams()", () => {
    it("treatRouteAnyRouteParams() - no any route params object", () => {
      const result = baseFunctions.treatRouteAnyRouteParams("/");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRouteAnyRouteParams() - any route params object one path param", () => {
      const result = baseFunctions.treatRouteAnyRouteParams("/path/*/test", [
        { find: "*", replacement: "123" },
      ]);
      expect(result).toBe("/path/123/test");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRouteAnyRouteParams() - any route params object two path param", () => {
      const result = baseFunctions.treatRouteAnyRouteParams(
        "/path/:p/test/p/*/*/a",
        [
          { find: "*", replacement: "abc" },
          { find: "*", replacement: "abcd" },
        ]
      );
      expect(result).toBe("/path/:p/test/p/abc/abcd/a");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRouteAnyRouteParams() - any route params object two path param and one wrong in the second param", () => {
      const result = baseFunctions.treatRouteAnyRouteParams(
        "/path/:p/test/p/*/a*/a",
        [
          { find: "*", replacement: "abc" },
          { find: "c*", replacement: "abcd" },
        ]
      );
      expect(result).toBe("/path/:p/test/p/abc/a*/a");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRouteAnyRouteParams() - any route params object two path param and one wrong in the first param", () => {
      const result = baseFunctions.treatRouteAnyRouteParams(
        "/path/:p/test/p/a*/c*/a",
        [
          { find: "a*", replacement: "abc" },
          { find: "b*", replacement: "abcd" },
        ]
      );
      expect(result).toBe("/path/:p/test/p/abc/c*/a");
    });

    // --------------------------------------------------------------------------------------------

    it("treatRouteAnyRouteParams() - no path passed", () => {
      const result = () =>
        baseFunctions.treatRouteAnyRouteParams(undefined, [
          { find: "a*", replacement: "abc" },
          { find: "b*", replacement: "abcd" },
        ]);
      expect(result).toThrow(
        "Cannot read properties of undefined (reading 'replace')"
      );
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setPathQueryParameters()", () => {
    it("setPathQueryParameters() - given undefined path mount query parameters without any query params", () => {
      const result = baseFunctions.setPathQueryParameters();
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("setPathQueryParameters() - given a path mount query parameters without any query params", () => {
      const result = baseFunctions.setPathQueryParameters("/");
      expect(result).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("setPathQueryParameters() - given a undefined path mount query parameters", () => {
      const result = baseFunctions.setPathQueryParameters(undefined, {
        a: 2,
        c: 3,
        d: "test",
      });
      expect(result).toBe("/?a=2&c=3&d=test");
    });

    // --------------------------------------------------------------------------------------------

    it("setPathQueryParameters() - given a invalid path mount query parameters", () => {
      const result = baseFunctions.setPathQueryParameters(
        { a: 5 },
        {
          a: 2,
          c: 3,
          d: "test",
        }
      );
      expect(result).toBe("/?a=2&c=3&d=test");
    });

    // --------------------------------------------------------------------------------------------

    it("setPathQueryParameters() - given a path with invalid query parameters", () => {
      const result = baseFunctions.setPathQueryParameters(
        { a: 5 },
        "invalid params"
      );
      expect(result).toBe("/");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("asyncLoadComponentsFunc()", () => {
    it("asyncLoadComponentsFunc() - pass no components or default", async () => {
      const result = await baseFunctions.asyncLoadComponentsFunc();
      expect(result).toBeUndefined();
    });

    // --------------------------------------------------------------------------------------------

    it("asyncLoadComponentsFunc() - pass just a default component", async () => {
      const result = await baseFunctions.asyncLoadComponentsFunc(
        undefined,
        SCR_GettingStarted
      );
      expect(result).toEqual(SCR_GettingStarted);
    });

    // --------------------------------------------------------------------------------------------

    it("asyncLoadComponentsFunc() - pass just a component without be an array and false as default", async () => {
      const result = await baseFunctions.asyncLoadComponentsFunc(
        SCR_GettingStarted,
        false
      );
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("asyncLoadComponentsFunc() - pass just a component without be an array and SCR_Installation as default", async () => {
      const result = await baseFunctions.asyncLoadComponentsFunc(
        SCR_GettingStarted,
        SCR_Installation
      );
      expect(result).toBe(SCR_Installation);
    });

    // --------------------------------------------------------------------------------------------

    it("asyncLoadComponentsFunc() - pass just a function as component in an array and SCR_Installation as default", async () => {
      const result = await baseFunctions.asyncLoadComponentsFunc(
        [
          async () => {
            return { default: () => {} };
          },
        ],
        SCR_Installation
      );
      expect(result).toBeTypeOf("function");
      expect(result).not.toBe(SCR_Installation);
    });

    // --------------------------------------------------------------------------------------------

    it("asyncLoadComponentsFunc() - pass a invalid value and a function as component in an array and SCR_Installation as default", async () => {
      const result = await baseFunctions.asyncLoadComponentsFunc(
        [
          false,
          async () => {
            return { default: () => {} };
          },
        ],
        SCR_Installation
      );
      expect(result).toBeTypeOf("function");
      expect(result).not.toBe(SCR_Installation);
    });

    // --------------------------------------------------------------------------------------------

    it("asyncLoadComponentsFunc() - pass a only invalid values in an array and SCR_Installation as default", async () => {
      const result = await baseFunctions.asyncLoadComponentsFunc(
        [false, () => {}],
        SCR_Installation
      );
      expect(result).toBe(SCR_Installation);
    });
  });
});
