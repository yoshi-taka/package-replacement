import { describe, expect, test } from "bun:test";
import path from "node:path";

const objectKeysPath = path.join(process.cwd(), "snippets", "object-keys", "normalized.ts");

const objectKeysModule = await import(objectKeysPath);
const objectKeys = objectKeysModule.default;

describe("object-keys normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof objectKeys).toBe("function");
  });

  test("returns representative own enumerable keys", () => {
    expect(objectKeys({ a: 1, b: 2 })).toEqual(["a", "b"]);
    expect(objectKeys("ab")).toEqual(["0", "1"]);
  });
});
