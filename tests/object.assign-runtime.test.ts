import { describe, expect, test } from "bun:test";
import path from "node:path";

const objectAssignPath = path.join(process.cwd(), "snippets", "object.assign", "normalized.ts");

const objectAssignModule = await import(objectAssignPath);
const objectAssign = objectAssignModule.default;

describe("object.assign normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof objectAssign).toBe("function");
  });

  test("assigns representative enumerable properties", () => {
    expect(objectAssign({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({
      a: 1,
      b: 2,
      c: 3,
    });
  });

  test("copies enumerable symbol properties", () => {
    const symbol = Symbol("x");
    const source = {};
    source[symbol] = 42;

    const result = objectAssign({}, source);
    expect(result[symbol]).toBe(42);
  });

  test("preserves helper methods on the export", () => {
    expect(typeof objectAssign.getPolyfill).toBe("function");
    expect(typeof objectAssign.implementation).toBe("function");
    expect(typeof objectAssign.shim).toBe("function");
  });
});
