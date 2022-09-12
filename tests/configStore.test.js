import { describe, it, beforeEach } from "vitest";
import { configStore } from "./src/stores/index.js";

// ------------------------------------------------------------------------------------------------

beforeEach(() => {
  configStore.setConfig({
    hashMode: false,
    navigationHistoryLimit: 200,
    notFoundRoute: "/notFound",
    consoleLogErrorMessages: true,
    consoleLogStores: false,
    considerTrailingSlashOnMatchingRoute: true,
    useScroll: false,
    maxRedirectBeforeEnter: 30,
    scrollProps: {
      top: 0,
      left: 0,
      behavior: "smooth",
      timeout: 10,
    },
  });
});

// ------------------------------------------------------------------------------------------------
describe("configStore", () => {
  describe("setHashMode() => getHashMode()", () => {
    it("setHashMode() => getHashMode() - get standard hash property", () => {
      const result = configStore.getHashMode();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setHashMode() => getHashMode() - set hash mode to true and store return the same", () => {
      configStore.setHashMode(true);
      const result = configStore.getHashMode();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setHashMode() => getHashMode() - set hash mode with an invalid option", () => {
      configStore.setHashMode("true");
      const result = configStore.getHashMode();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setHashMode() => getHashMode() - set hash mode with an undefined option after set it with true", () => {
      configStore.setHashMode(true);
      configStore.setHashMode();
      const result = configStore.getHashMode();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------
  });

  // ----------------------------------------------------------------------------------------------

  describe("setNavigationHistoryLimit() => getNavigationHistoryLimit()", () => {
    it("setNavigationHistoryLimit() => getNavigationHistoryLimit() - get standard navigation history limit property", () => {
      const result = configStore.getNavigationHistoryLimit();
      expect(result).toBe(200);
    });

    // --------------------------------------------------------------------------------------------

    it("setNavigationHistoryLimit() => getNavigationHistoryLimit() - set navigation history limit to 100 and store return the same", () => {
      configStore.setNavigationHistoryLimit(100);
      const result = configStore.getNavigationHistoryLimit();
      expect(result).toBe(100);
    });

    // --------------------------------------------------------------------------------------------

    it("setNavigationHistoryLimit() => getNavigationHistoryLimit() - set navigation history limit with an invalid option", () => {
      configStore.setNavigationHistoryLimit("true");
      const result = configStore.getNavigationHistoryLimit();
      expect(result).toBe(200);
    });

    // --------------------------------------------------------------------------------------------

    it("setNavigationHistoryLimit() => getNavigationHistoryLimit() - set navigation history limit with an undefined option after set it with 15", () => {
      configStore.setNavigationHistoryLimit(15);
      configStore.setNavigationHistoryLimit();
      const result = configStore.getNavigationHistoryLimit();
      expect(result).toBe(15);
    });

    // --------------------------------------------------------------------------------------------

    it("setNavigationHistoryLimit() => getNavigationHistoryLimit() - set navigation history limit with a negative number", () => {
      configStore.setNavigationHistoryLimit(-15);
      const result = configStore.getNavigationHistoryLimit();
      expect(result).toBe(1);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setNotFoundRoute() => getNotFoundRoute()", () => {
    it("setNotFoundRoute() => getNotFoundRoute() - get standard not found route property", () => {
      const result = configStore.getNotFoundRoute();
      expect(result).toBe("/notFound");
    });

    // --------------------------------------------------------------------------------------------

    it("setNotFoundRoute() => getNotFoundRoute() - set not found route to /custom/path/not/found and the store return the same", () => {
      configStore.setNotFoundRoute("/custom/path/not/found");
      const result = configStore.getNotFoundRoute();
      expect(result).toBe("/custom/path/not/found");
    });

    // --------------------------------------------------------------------------------------------

    it("setNotFoundRoute() => getNotFoundRoute() - set not found route with an invalid option", () => {
      configStore.setNotFoundRoute("true");
      const result = configStore.getNotFoundRoute();
      expect(result).toBe("/notFound");
    });

    // --------------------------------------------------------------------------------------------

    it("setNotFoundRoute() => getNotFoundRoute() - set not found route with an undefined option after set it with /custom/path", () => {
      configStore.setNotFoundRoute("/custom/path");
      configStore.setNotFoundRoute();
      const result = configStore.getNotFoundRoute();
      expect(result).toBe("/custom/path");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setConsoleLogErrorMessages() => getConsoleLogErrorMessages()", () => {
    it("setConsoleLogErrorMessages() => getConsoleLogErrorMessages() - get standard console log error messages property", () => {
      const result = configStore.getConsoleLogErrorMessages();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setConsoleLogErrorMessages() => getConsoleLogErrorMessages() - set console log error messages to true and store return the same", () => {
      configStore.setConsoleLogErrorMessages(true);
      const result = configStore.getConsoleLogErrorMessages();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setConsoleLogErrorMessages() => getConsoleLogErrorMessages() - set console log error messages with an invalid option", () => {
      configStore.setConsoleLogErrorMessages("true");
      const result = configStore.getConsoleLogErrorMessages();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setConsoleLogErrorMessages() => getConsoleLogErrorMessages() - set console log error messages with an undefined option after set it with true", () => {
      configStore.setConsoleLogErrorMessages(false);
      configStore.setConsoleLogErrorMessages();
      const result = configStore.getConsoleLogErrorMessages();
      expect(result).toBe(false);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setConsoleLogStores() => getConsoleLogStores()", () => {
    it("setConsoleLogStores() => getConsoleLogStores() - get standard console log stores property", () => {
      const result = configStore.getConsoleLogStores();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setConsoleLogStores() => getConsoleLogStores() - set console log stores to true and store return the same", () => {
      configStore.setConsoleLogStores(true);
      const result = configStore.getConsoleLogStores();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setConsoleLogStores() => getConsoleLogStores() - set console log stores with an invalid option", () => {
      configStore.setConsoleLogStores("true");
      const result = configStore.getConsoleLogStores();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setConsoleLogStores() => getConsoleLogStores() - set console log stores with an undefined option after set it with true", () => {
      configStore.setConsoleLogStores(true);
      configStore.setConsoleLogStores();
      const result = configStore.getConsoleLogStores();
      expect(result).toBe(true);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setConsiderTrailingSlashOnMatchingRoute() => getConsiderTrailingSlashOnMatchingRoute()", () => {
    it("setConsiderTrailingSlashOnMatchingRoute() => getConsiderTrailingSlashOnMatchingRoute() - get standard consider trailing slash on matching route property", () => {
      const result = configStore.getConsiderTrailingSlashOnMatchingRoute();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setConsiderTrailingSlashOnMatchingRoute() => getConsiderTrailingSlashOnMatchingRoute() - set consider trailing slash on matching route to false and store return the same", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      const result = configStore.getConsiderTrailingSlashOnMatchingRoute();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setConsiderTrailingSlashOnMatchingRoute() => getConsiderTrailingSlashOnMatchingRoute() - set consider trailing slash on matching route with an invalid option", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute("true");
      const result = configStore.getConsiderTrailingSlashOnMatchingRoute();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setConsiderTrailingSlashOnMatchingRoute() => getConsiderTrailingSlashOnMatchingRoute() - set consider trailing slash on matching route with an undefined option after set it with false", () => {
      configStore.setConsiderTrailingSlashOnMatchingRoute(false);
      configStore.setConsiderTrailingSlashOnMatchingRoute();
      const result = configStore.getConsiderTrailingSlashOnMatchingRoute();
      expect(result).toBe(false);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setUseScroll() => getUseScroll()", () => {
    it("setUseScroll() => getUseScroll() - get standard use scroll property", () => {
      const result = configStore.getUseScroll();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setUseScroll() => getUseScroll() - set use scroll to true and store return the same", () => {
      configStore.setUseScroll(true);
      const result = configStore.getUseScroll();
      expect(result).toBe(true);
    });

    // --------------------------------------------------------------------------------------------

    it("setUseScroll() => getUseScroll() - set use scroll with an invalid option", () => {
      configStore.setUseScroll("true");
      const result = configStore.getUseScroll();
      expect(result).toBe(false);
    });

    // --------------------------------------------------------------------------------------------

    it("setUseScroll() => getUseScroll() - set use scroll with an undefined option after set it with true", () => {
      configStore.setUseScroll(true);
      configStore.setUseScroll();
      const result = configStore.getUseScroll();
      expect(result).toBe(true);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setScrollProps() => getScrollProps()", () => {
    it("setScrollProps() => getScrollProps() - get standard scroll property", () => {
      const result = configStore.getScrollProps();
      expect(result.top).toBe(0);
      expect(result.left).toBe(0);
      expect(result.behavior).toBe("smooth");
      expect(result.timeout).toBe(10);
    });

    // --------------------------------------------------------------------------------------------

    it("setScrollProps() => getScrollProps() - update two properties of scroll", () => {
      configStore.setScrollProps({
        top: 1000,
        behavior: "standard",
      });

      const result = configStore.getScrollProps();
      expect(result.top).toBe(1000);
      expect(result.left).toBe(0);
      expect(result.behavior).toBe("standard");
      expect(result.timeout).toBe(10);
    });

    // --------------------------------------------------------------------------------------------

    it("setScrollProps() => getScrollProps() - update with an invalid value", () => {
      configStore.setScrollProps("test");
      const result = configStore.getScrollProps();
      expect(result.top).toBe(0);
      expect(result.left).toBe(0);
      expect(result.behavior).toBe("smooth");
      expect(result.timeout).toBe(10);
    });

    // --------------------------------------------------------------------------------------------

    it("setScrollProps() => getScrollProps() - update with an invalid value", () => {
      configStore.setScrollProps({
        left: 1000,
        behavior: "standard2",
        timeout: 20,
      });
      configStore.setScrollProps("test");
      const result = configStore.getScrollProps();
      expect(result.top).toBe(0);
      expect(result.left).toBe(1000);
      expect(result.behavior).toBe("standard2");
      expect(result.timeout).toBe(20);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setBeforeEnter() => getBeforeEnter()", () => {
    it("setBeforeEnter() => getBeforeEnter() - get standard global before enter", () => {
      const result = configStore.getBeforeEnter();
      expect(result).toEqual([]);
    });

    // --------------------------------------------------------------------------------------------

    it("setBeforeEnter() => getBeforeEnter() - set global before enter a function", () => {
      configStore.setBeforeEnter(() => {});
      const result = configStore.getBeforeEnter();
      expect(result[0]).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("setBeforeEnter() => getBeforeEnter() - set global before enter two functions", () => {
      configStore.setBeforeEnter([() => {}, () => {}]);
      const result = configStore.getBeforeEnter();
      expect(result[0]).toBeTypeOf("function");
      expect(result[1]).toBeTypeOf("function");
      expect(result.length).toBe(2);
    });

    // --------------------------------------------------------------------------------------------

    it("setBeforeEnter() => getBeforeEnter() - set global before enter with a function with an invalid value", () => {
      configStore.setBeforeEnter(() => {});
      const resultA = configStore.getBeforeEnter();

      configStore.setBeforeEnter("not a funcion");
      const resultB = configStore.getBeforeEnter();

      expect(resultA[0]).toBeTypeOf("function");
      expect(resultA.length).toBe(1);
      expect(resultB).toEqual([]);
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setOnError() => getOnError()", () => {
    it("setOnError() => getOnError() - get standard global on error", () => {
      const result = configStore.getOnError();
      expect(result).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("setOnError() => getOnError() - set global on error a function", () => {
      configStore.setOnError(() => {});
      const result = configStore.getOnError();
      expect(result).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("setOnError() => getOnError() - set global on error two functions", () => {
      configStore.setOnError([() => {}, () => {}]);
      const result = configStore.getOnError();
      expect(result).toBeTypeOf("function");
    });

    // --------------------------------------------------------------------------------------------

    it("setOnError() => getOnError() - set global on error with an invalid value", () => {
      configStore.setOnError("not a funcion");
      const result = configStore.getOnError();
      expect(result).toBeTypeOf("function");
    });
  });

  // ----------------------------------------------------------------------------------------------

  describe("setMaxRedirectBeforeEnter() => getMaxRedirectBeforeEnter()", () => {
    it("setMaxRedirectBeforeEnter() => getMaxRedirectBeforeEnter() - get standard max redirect before enter", () => {
      const result = configStore.getMaxRedirectBeforeEnter();
      expect(result).toBe(30);
    });

    // --------------------------------------------------------------------------------------------

    it("setMaxRedirectBeforeEnter() => getMaxRedirectBeforeEnter() - set as undefined", () => {
      configStore.setMaxRedirectBeforeEnter();
      const result = configStore.getMaxRedirectBeforeEnter();
      expect(result).toBe(30);
    });

    // --------------------------------------------------------------------------------------------

    it("setMaxRedirectBeforeEnter() => getMaxRedirectBeforeEnter() - set as invalid", () => {
      configStore.setMaxRedirectBeforeEnter("");
      const result = configStore.getMaxRedirectBeforeEnter();
      expect(result).toBe(30);
    });

    // --------------------------------------------------------------------------------------------

    it("setMaxRedirectBeforeEnter() => getMaxRedirectBeforeEnter() - set as string", () => {
      configStore.setMaxRedirectBeforeEnter("23");
      const result = configStore.getMaxRedirectBeforeEnter();
      expect(result).toBe(30);
    });

    // --------------------------------------------------------------------------------------------

    it("setMaxRedirectBeforeEnter() => getMaxRedirectBeforeEnter() - set as valid number", () => {
      configStore.setMaxRedirectBeforeEnter(123);
      const result = configStore.getMaxRedirectBeforeEnter();
      expect(result).toBe(123);
    });
  });
});
