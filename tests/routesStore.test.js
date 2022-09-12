import { describe, it, beforeEach } from "vitest";
import { routesStore } from "./src/stores/index.js";

const validRoute = {
  name: "loadRoute",
  path: "/scr/load/route",
  fullPath: "/scr/load/route?test=123",
  queryParams: {
    test: 123,
  },
  pathParams: {},
  params: {
    inTheConfig: true,
  },
  host: "localhost:3030",
  protocol: "http",
  port: ":3030",
  origin: "http://localhost:3030",
  hash: "",
  routeObj: {},
  redirected: undefined,
};

// ------------------------------------------------------------------------------------------------

beforeEach(() => {
  routesStore.resetRoutes();
  routesStore.setNavigationHistory([])
});

// ------------------------------------------------------------------------------------------------
describe("routesStore", () => {
  describe("setRoutes() => getRoutes()", () => {
    it("setRoutes() => getRoutes() - get standard route property", () => {
      const result = routesStore.getRoutes();
      expect(result).toEqual([]);
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set a simple route and the store return it", () => {
      routesStore.setRoutes([
        {
          name: "r1",
          path: "/",
        },
      ]);
      const result = routesStore.getRoutes();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe("r1");
      expect(result[0].path).toBe("/");
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set routes as undefined", () => {
      const result = () => routesStore.setRoutes();
      expect(result).toThrow("SCR: Routes must be an array of objects.");
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set routes as an empty array", () => {
      const result = () => routesStore.setRoutes([]);
      expect(result).toThrow("SCR: Routes must be an array of objects.");
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set routes as an array with empty object", () => {
      const result = () => routesStore.setRoutes([{}]);
      expect(result).toThrow(
        "SCR: Routes must have at least (name and path) properties."
      );
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set routes with an object with only name", () => {
      const result = () => routesStore.setRoutes([{ name: "r1" }]);
      expect(result).toThrow(
        "SCR: Routes must have at least (name and path) properties."
      );
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set routes with an object with only path", () => {
      const result = () => routesStore.setRoutes([{ path: "/" }]);
      expect(result).toThrow(
        "SCR: Routes must have at least (name and path) properties."
      );
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set routes with an object with path as numeric", () => {
      const result = () => routesStore.setRoutes([{ name: "/", path: 123 }]);
      expect(result).toThrow(
        "SCR: Routes properties (name and path) must be a string."
      );
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set routes with an object with name as numeric", () => {
      const result = () => routesStore.setRoutes([{ name: 123, path: "/" }]);
      expect(result).toThrow(
        "SCR: Routes properties (name and path) must be a string."
      );
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set routes with an object with name as empty string", () => {
      const result = () => routesStore.setRoutes([{ name: "", path: "/" }]);
      expect(result).toThrow(
        "SCR: Routes must have at least (name and path) properties."
      );
    });

    // --------------------------------------------------------------------------------------------

    it("setRoutes() => getRoutes() - set routes with an object with name as empty string", () => {
      routesStore.setRoutes([
        { name: "r1", path: "/" },
        { name: "r2", path: "/" },
        { name: "r1", path: "/test" },
      ]);
      const result = routesStore.getRoutes();
      expect(result.length).toBe(3);
      expect(result[0].name).toBe("r1");
      expect(result[0].path).toBe("/");
      expect(result[1].name).toBe("r2");
      expect(result[1].path).toBe("/");
      expect(result[2].name).toBe("r1");
      expect(result[2].path).toBe("/test");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setCurrentRoute() => getCurrentRoute()", () => {
    it("setCurrentRoute() => getCurrentRoute() - set an empty current route", () => {
      routesStore.setCurrentRoute();
      const result = routesStore.getCurrentRoute();
      expect(result.name).toEqual(undefined);
      expect(result.path).toEqual(undefined);
      expect(result.params).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setCurrentRoute() => getCurrentRoute() - set an invalid current route", () => {
      routesStore.setCurrentRoute("invalid");
      const result = routesStore.getCurrentRoute();
      expect(result).toEqual("invalid");
    });

    // --------------------------------------------------------------------------------------------

    it("setCurrentRoute() => getCurrentRoute() - set an valid current route", () => {
      routesStore.setCurrentRoute(validRoute);
      const result = routesStore.getCurrentRoute();
      expect(result.name).toEqual("loadRoute");
      expect(result.path).toEqual("/scr/load/route");
      expect(result.params).toEqual({ inTheConfig: true });
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setLastRoute() => getLastRoute()", () => {
    it("setLastRoute() => getLastRoute() - set an empty last route", () => {
      routesStore.setLastRoute();
      const result = routesStore.getLastRoute();
      expect(result.name).toEqual(undefined);
      expect(result.path).toEqual(undefined);
      expect(result.params).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setLastRoute() => getLastRoute() - set an invalid last route", () => {
      routesStore.setLastRoute("invalid");
      const result = routesStore.getLastRoute();
      expect(result).toEqual("invalid");
    });

    // --------------------------------------------------------------------------------------------

    it("setLastRoute() => getLastRoute() - set an valid last route", () => {
      routesStore.setLastRoute(validRoute);
      const result = routesStore.getLastRoute();
      expect(result.name).toEqual("loadRoute");
      expect(result.path).toEqual("/scr/load/route");
      expect(result.params).toEqual({ inTheConfig: true });
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("pushNavigationHistory() => getNavigationHistory()", () => {
    it("pushNavigationHistory() => getNavigationHistory() - push an undefined value", () => {
      routesStore.pushNavigationHistory();
      const result = routesStore.getNavigationHistory();
      expect(result).toEqual([]);
    });

    // --------------------------------------------------------------------------------------------

    it("pushNavigationHistory() => getNavigationHistory() - push an invalid value", () => {
      routesStore.pushNavigationHistory("invalid");
      const result = routesStore.getNavigationHistory();
      expect(result).toEqual([]);
    });

    // --------------------------------------------------------------------------------------------

    it("pushNavigationHistory() => getNavigationHistory() - ", () => {
      routesStore.pushNavigationHistory({ a: 2 });
      const result = routesStore.getNavigationHistory();
      expect(result).toEqual([{ a: 2 }]);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe.skip("popNavigationHistory() => getNavigationHistory()", () => {
    it("popNavigationHistory() => getNavigationHistory() - pop with no values in the navigation history", () => {
      const result = routesStore.popNavigationHistory();
      expect(result).toEqual(false);
    });

    // --------------------------------------------------------------------------------------------

    it("pushNavigationHistory() => getNavigationHistory() - pop with one value in the navigation history", () => {
      routesStore.pushNavigationHistory({ a: 2 })
      const result = routesStore.popNavigationHistory();
      expect(result).toEqual({ a: 2 });
    });

    // --------------------------------------------------------------------------------------------

    it("pushNavigationHistory() => getNavigationHistory() - pop with two value in the navigation history", () => {
      routesStore.pushNavigationHistory({ a: 2 });
      routesStore.pushNavigationHistory({ b: 3 });
      const result = routesStore.popNavigationHistory();
      expect(result).toEqual({ b: 3 });
    });
  });
});
