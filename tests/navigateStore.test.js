import { expect } from "chai";
import exp from "constants";
import { describe, it, beforeEach } from "vitest";
import { navigateStore } from "./src/stores/index.js";

// ------------------------------------------------------------------------------------------------

beforeEach(() => {
  navigateStore.setIsConsuming(false);
});

// ------------------------------------------------------------------------------------------------
describe("navigateStore", () => {
  describe("setIsConsuming() => getIsConsuming()", () => {
    it("setIsConsuming() => getIsConsuming() - get standard is consuming property", () => {
      const result = navigateStore.getIsConsuming();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setIsConsuming() => getIsConsuming() - set is consuming to true and receive the same", () => {
      navigateStore.setIsConsuming(true);
      const result = navigateStore.getIsConsuming();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setIsConsuming() => getIsConsuming() - set is consuming with an invalid option", () => {
      navigateStore.setIsConsuming("true");
      const result = navigateStore.getIsConsuming();
      expect(result).toBe("true");
    });

    // --------------------------------------------------------------------------------------------

    it("setIsConsuming() => getIsConsuming() - set is consuming with an undefined option after set it with true", () => {
      navigateStore.setIsConsuming(true);
      navigateStore.setIsConsuming();
      const result = navigateStore.getIsConsuming();
      expect(result).toBe(true);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setName() => getName()", () => {
    it("setName() => getName() - get standard name property", () => {
      const result = navigateStore.getName();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setName() => getName() - set name to true and receive the default option", () => {
      navigateStore.setName(true);
      const result = navigateStore.getName();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setName() => getName() - set name with a valid option", () => {
      navigateStore.setName("true");
      const result = navigateStore.getName();
      expect(result).toBe("true");
    });

    // --------------------------------------------------------------------------------------------

    it("setName() => getName() - set name with an invalid option after set it with a valid option", () => {
      navigateStore.setName("NAME");
      navigateStore.setName({});
      const result = navigateStore.getName();
      expect(result).toBe("NAME");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setPath() => getPath()", () => {
    it("setPath() => getPath() - get standard params property", () => {
      const result = navigateStore.getPath();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setPath() => getPath() - set params to true and receive the default option", () => {
      navigateStore.setPath(true);
      const result = navigateStore.getPath();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setPath() => getPath() - set path with a valid option", () => {
      navigateStore.setPath("true");
      const result = navigateStore.getPath();
      expect(result).toBe("true");
    });

    // --------------------------------------------------------------------------------------------

    it("setPath() => getPath() - set path with an invalid option after set it with a valid option", () => {
      navigateStore.setPath("PATH");
      navigateStore.setPath({});
      const result = navigateStore.getPath();
      expect(result).toBe("PATH");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setParams() => getParams()", () => {
    it("setParams() => getParams() - get standard params property", () => {
      const result = navigateStore.getParams();
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setParams() => getParams() - set params to true and receive the default option", () => {
      navigateStore.setParams(true);
      const result = navigateStore.getParams();
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setParams() => getParams() - set params with a valid option", () => {
      navigateStore.setParams({ a: "true" });
      const result = navigateStore.getParams();
      expect(result).toEqual({ a: "true" });
    });

    // --------------------------------------------------------------------------------------------

    it("setParams() => getParams() - set params with an invalid option after set it with a valid option", () => {
      navigateStore.setParams({ a: "true" });
      navigateStore.setParams("test");
      const result = navigateStore.getParams();
      expect(result).toEqual({ a: "true" });
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setOnError() => getOnError()", () => {
    it("setOnError() => getOnError() - get standard on error property", () => {
      const result = navigateStore.getOnError();
      expect(result).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("setOnError() => getOnError() - set on error to true and receive the default option", () => {
      navigateStore.setOnError(true);
      const result = navigateStore.getOnError();
      expect(result).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("setOnError() => getOnError() - set on error with a valid option", () => {
      navigateStore.setOnError(() => {
        return 123;
      });
      const result = navigateStore.getOnError()();
      expect(result).toBe(123);
    });

    // --------------------------------------------------------------------------------------------

    it("setOnError() => getOnError() - set on error with an invalid option after set it with a valid option", () => {
      navigateStore.setOnError(() => {
        return 123;
      });
      navigateStore.setOnError("test");
      const result = navigateStore.getOnError()();
      expect(result).toBe(123);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("pushRoute()", () => {
    it("pushRoute() - push as undefined", () => {
      navigateStore.pushRoute();
      const result = navigateStore.getIsConsuming();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("pushRoute() - push a valid path", () => {
      navigateStore.pushRoute("/scr/installation");
      const result = navigateStore.getIsConsuming();
      const path = navigateStore.getPath();
      const name = navigateStore.getName();
      expect(result).toBe("PATH");
      expect(name).toBe(false);
      expect(path).toBe("/scr/installation");
    });

    // --------------------------------------------------------------------------------------------

    it("pushRoute() - push a valid route name", () => {
      navigateStore.pushRoute({ name: "gettingStartedRoute" });
      const result = navigateStore.getIsConsuming();
      const path = navigateStore.getPath();
      const name = navigateStore.getName();
      expect(result).toBe("NAME");
      expect(name).toBe("gettingStartedRoute");
      expect(path).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("pushRoute() - push a valid route path", () => {
      navigateStore.pushRoute({ path: "/scr/installation" });
      const result = navigateStore.getIsConsuming();
      const path = navigateStore.getPath();
      const name = navigateStore.getName();
      expect(result).toBe("PATH");
      expect(name).toBe(false);
      expect(path).toBe("/scr/installation");
    });

    // --------------------------------------------------------------------------------------------

    it("pushRoute() - push a valid route path with invalid params", () => {
      navigateStore.pushRoute({ path: "/scr/installation", params: "test" });
      const result = navigateStore.getIsConsuming();
      const path = navigateStore.getPath();
      const name = navigateStore.getName();
      const params = navigateStore.getParams();
      expect(result).toBe("PATH");
      expect(name).toBe(false);
      expect(path).toBe("/scr/installation");
      expect(params).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("pushRoute() - push a valid route path with valid params", () => {
      navigateStore.pushRoute({
        path: "/scr/installation",
        params: { a: "OK" },
      });
      const result = navigateStore.getIsConsuming();
      const path = navigateStore.getPath();
      const name = navigateStore.getName();
      const params = navigateStore.getParams();
      expect(result).toBe("PATH");
      expect(name).toBe(false);
      expect(path).toBe("/scr/installation");
      expect(params).toEqual({ a: "OK" });
    });

    // --------------------------------------------------------------------------------------------

    it("pushRoute() - push a valid route name with invalid params", () => {
      navigateStore.pushRoute({ name: "gettingStartedRoute", params: "test" });
      const result = navigateStore.getIsConsuming();
      const path = navigateStore.getPath();
      const name = navigateStore.getName();
      const params = navigateStore.getParams();
      expect(result).toBe("NAME");
      expect(name).toBe("gettingStartedRoute");
      expect(path).toBe(false);
      expect(params).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("pushRoute() - push a valid route name with valid params", () => {
      navigateStore.pushRoute({
        name: "gettingStartedRoute",
        params: { a: "OK" },
      });
      const result = navigateStore.getIsConsuming();
      const path = navigateStore.getPath();
      const name = navigateStore.getName();
      const params = navigateStore.getParams();
      expect(result).toBe("NAME");
      expect(name).toBe("gettingStartedRoute");
      expect(path).toBe(false);
      expect(params).toEqual({ a: "OK" });
    });
  });
});
