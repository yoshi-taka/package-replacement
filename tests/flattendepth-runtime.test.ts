import { describe, expect, test } from "bun:test";
import path from "node:path";

const flattenDepthPath = path.join(process.cwd(), "snippets", "flattendepth", "normalized.ts");

const flattenDepthModule = await import(flattenDepthPath);
const flattenDepth = flattenDepthModule.default;

describe("flattenDepth normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof flattenDepth).toBe("function");
  });

  test("flattens arrays to the requested depth", () => {
    expect(flattenDepth([1, [2, [3, [4]], 5]], 1)).toEqual([1, 2, [3, [4]], 5]);
    expect(flattenDepth([1, [2, [3, [4]], 5]], 2)).toEqual([1, 2, 3, [4], 5]);
  });
});
