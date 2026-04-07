import { describe, expect, test } from "bun:test";
import path from "node:path";

const objectIsPath = path.join(process.cwd(), "snippets", "object-is", "normalized.ts");

const objectIsModule = await import(objectIsPath);
const objectIs = objectIsModule.default;

describe("object-is normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof objectIs).toBe("function");
  });

  test("matches representative SameValue cases", () => {
    expect(objectIs(NaN, NaN)).toBe(true);
    expect(objectIs(0, -0)).toBe(false);
    expect(objectIs(-0, -0)).toBe(true);
    expect(objectIs(1, 1)).toBe(true);
  });

  test("preserves helper methods on the export", () => {
    expect(typeof objectIs.getPolyfill).toBe("function");
    expect(typeof objectIs.implementation).toBe("function");
    expect(typeof objectIs.shim).toBe("function");
  });
});
