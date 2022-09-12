import { describe, it } from "vitest";
import * as helpers from "./src/helpers/index.js";

// ------------------------------------------------------------------------------------------------
describe("helpers - index", () => {
  describe("assign()", () => {
    it("assign() - copy object assign", () => {
      const result = helpers.assign({ a: "a" }, { b: "b" });
      expect(Object.keys(result).length).toBe(2);
      expect(result.a).toBe("a");
      expect(result.b).toBe("b");
    });

    // --------------------------------------------------------------------------------------------

    it("assign() - clone object without reference", () => {
      const objA = { a: "a" };
      const objB = helpers.assign({}, objA);
      objA.a = "c";
      expect(objA.a).toBe("c");
      expect(objB.a).toBe("a");
    });

    // --------------------------------------------------------------------------------------------

    it("assign() - clone array without reference", () => {
      const objA = ["a"];
      const objB = helpers.assign([], objA);
      objA[0] = "c";
      expect(objA[0]).toBe("c");
      expect(objB[0]).toBe("a");
    });

    // --------------------------------------------------------------------------------------------

    it("assign() - copy invalid value", () => {
      const result = helpers.assign("{}", { a: 'a' });
      expect(result.a).toBe("a");
    });

    // --------------------------------------------------------------------------------------------

    it("assign() - copy two invalid values", () => {
      const result = helpers.assign("{}", "{ a: 'a' }");
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------
  });

  // ----------------------------------------------------------------------------------------------

  describe("enforceType()", () => {
    it("enforceType() - enforcing a object to return the same object", () => {
      const result = helpers.enforceType({ a: "a" });
      expect(Object.keys(result).length).toBe(1);
      expect(result.a).toBe("a");
    });

    // --------------------------------------------------------------------------------------------

    it("enforceType() - enforcing a array to return the same object", () => {
      const result = helpers.enforceType(["a"]);
      expect(result[0]).toBe("a");
    });

    // --------------------------------------------------------------------------------------------

    it("enforceType() - enforcing a invalid value to return an object", () => {
      const result = helpers.enforceType("{}");
      expect(result).toEqual({});
    });

    // --------------------------------------------------------------------------------------------
  });
});
