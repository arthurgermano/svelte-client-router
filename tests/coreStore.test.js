import { describe, it, beforeEach } from "vitest";
import { coreStore } from "./src/stores/index.js";
import { expect } from "chai";

// ------------------------------------------------------------------------------------------------

beforeEach(() => {
  coreStore.setIsLoading(false);
});

// ------------------------------------------------------------------------------------------------
describe("coreStore", () => {
  describe("setIsLoading() => getIsLoading()", () => {
    it("setIsLoading() => getIsLoading() - get standard is loading property", () => {
      const result = coreStore.getIsLoading();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setIsLoading() => getIsLoading() - set is loading to true and store return the same", () => {
      coreStore.setIsLoading(true);
      const result = coreStore.getIsLoading();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setIsLoading() => getIsLoading() - set is loading with an invalid option", () => {
      coreStore.setIsLoading("true");
      const result = coreStore.getIsLoading();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setIsLoading() => getIsLoading() - set is loading with an undefined option after set it with true", () => {
      coreStore.setIsLoading(true);
      coreStore.setIsLoading();
      const result = coreStore.getIsLoading();
      expect(result).toBe(true);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("startWaiting() => getWaiting()", () => {
    it("startWaiting() => startWaiting() - get standard waiting property", () => {
      const result = coreStore.getWaiting();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("startWaiting() => startWaiting() - set waiting and return an object", () => {
      coreStore.startWaiting();
      const result = coreStore.getWaiting();
      expect(result).toBeTypeOf("object");
    });

    // --------------------------------------------------------------------------------------------

    it("startWaiting() => startWaiting() - start and stop waiting", () => {
      coreStore.startWaiting();
      coreStore.stopWaiting();
      const result = coreStore.getWaiting();
      expect(result).toBe(false);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("isLoading => waiting", () => {
    it("isLoading => waiting - set is loading to true an waiting to a an object promise", () => {
      coreStore.setIsLoading(true);
      const result = coreStore.getWaiting();
      expect(result).toBeTypeOf("object");
    });

    // --------------------------------------------------------------------------------------------

    it("isLoading => waiting - set is loading to true, then false an waiting to be false", () => {
      coreStore.setIsLoading(true);
      coreStore.setIsLoading(false);
      const result = coreStore.getWaiting();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("isLoading => waiting - checking flow with is loading and waiting", async () => {
      let result = ".StartTest_";
      coreStore.setIsLoading(true);
      result += "StartIsLoading_";
      setTimeout(() => {
        result += "EndIsLoading_";
        coreStore.setIsLoading(false);
      }, 100);
      result += "StartWaiting_";
      await coreStore.getWaiting();
      result += "EndTest.";
      expect(result).toBe(
        ".StartTest_StartIsLoading_StartWaiting_EndIsLoading_EndTest."
      );
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setCurrentParams() => getCurrentParams()", () => {
    it("setCurrentParams() => getCurrentParams() - set as undefined", () => {
      coreStore.setCurrentParams();
      const result = coreStore.getCurrentParams();
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setCurrentParams() => getCurrentParams() - set as invalid", () => {
      coreStore.setCurrentParams("invalid");
      const result = coreStore.getCurrentParams();
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setCurrentParams() => getCurrentParams() - set valid object", () => {
      coreStore.setCurrentParams({ a: 2 });
      const result = coreStore.getCurrentParams();
      expect(result).toEqual({ a: 2 });
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setLoadingParams() => getLoadingParams()", () => {
    it("setLoadingParams() => getLoadingParams() - set as undefined", () => {
      coreStore.setLoadingParams();
      const result = coreStore.getLoadingParams();
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setLoadingParams() => getLoadingParams() - set as invalid", () => {
      coreStore.setLoadingParams("invalid");
      const result = coreStore.getLoadingParams();
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setLoadingParams() => getLoadingParams() - set valid object", () => {
      coreStore.setLoadingParams({ a: 2 });
      const result = coreStore.getLoadingParams();
      expect(result).toEqual({ a: 2 });
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setDefaultLoadingParams() => getDefaultLoadingParams()", () => {
    it("setDefaultLoadingParams() => getDefaultLoadingParams() - set as undefined", () => {
      coreStore.setDefaultLoadingParams();
      const result = coreStore.getDefaultLoadingParams();
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setDefaultLoadingParams() => getDefaultLoadingParams() - set as invalid", () => {
      coreStore.setDefaultLoadingParams("invalid");
      const result = coreStore.getDefaultLoadingParams();
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------

    it("setDefaultLoadingParams() => getDefaultLoadingParams() - set valid object", () => {
      coreStore.setDefaultLoadingParams({ a: 2 });
      const result = coreStore.getDefaultLoadingParams();
      expect(result).toEqual({ a: 2 });
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setDefaultLoadingComponent() => getDefaultLoadingComponent()", () => {
    it("setDefaultLoadingComponent() => getDefaultLoadingComponent() - set as undefined", () => {
      coreStore.setDefaultLoadingComponent();
      const result = coreStore.getDefaultLoadingComponent();
      expect(result).toBeUndefined();
    });

    // --------------------------------------------------------------------------------------------

    it("setDefaultLoadingComponent() => getDefaultLoadingComponent() - set as invalid", () => {
      coreStore.setDefaultLoadingComponent("invalid");
      const result = coreStore.getDefaultLoadingComponent();
      expect(result).toEqual("invalid");
    });

    // --------------------------------------------------------------------------------------------

    it("setDefaultLoadingComponent() => getDefaultLoadingComponent() - set valid function", () => {
      coreStore.setDefaultLoadingComponent(async () => {
        return {
          default: () => {},
        };
      });
      const result = coreStore.getDefaultLoadingComponent();
      expect(result).toBeTypeOf("function");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setCurrentComponent() => getCurrentComponent()", () => {
    it("setCurrentComponent() => getCurrentComponent() - set as undefined", () => {
      coreStore.setCurrentComponent();
      const result = coreStore.getCurrentComponent();
      expect(result).toBeUndefined();
    });

    // --------------------------------------------------------------------------------------------

    it("setCurrentComponent() => getCurrentComponent() - set as invalid", () => {
      coreStore.setCurrentComponent("invalid");
      const result = coreStore.getCurrentComponent();
      expect(result).toEqual("invalid");
    });

    // --------------------------------------------------------------------------------------------

    it("setCurrentComponent() => getCurrentComponent() - set valid function", () => {
      coreStore.setCurrentComponent(async () => {
        return {
          default: () => {},
        };
      });
      const result = coreStore.getCurrentComponent();
      expect(result).toBeTypeOf("function");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setLoadingComponent() => getLoadingComponent()", () => {
    it("setLoadingComponent() => getLoadingComponent() - set as undefined", () => {
      coreStore.setLoadingComponent();
      const result = coreStore.getLoadingComponent();
      expect(result).toBeUndefined();
    });

    // --------------------------------------------------------------------------------------------

    it("setLoadingComponent() => getLoadingComponent() - set as invalid", () => {
      coreStore.setLoadingComponent("invalid");
      const result = coreStore.getLoadingComponent();
      expect(result).toEqual("invalid");
    });

    // --------------------------------------------------------------------------------------------

    it("setLoadingComponent() => getLoadingComponent() - set valid function", () => {
      coreStore.setLoadingComponent(async () => {
        return {
          default: () => {},
        };
      });
      const result = coreStore.getLoadingComponent();
      expect(result).toBeTypeOf("function");
    });
  });
});
