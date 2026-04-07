import { describe, expect, test } from "bun:test";
import path from "node:path";

const isArrayPath = path.join(process.cwd(), "snippets", "isarray", "normalized.ts");

const isArrayModule = await import(isArrayPath);
const isArray = isArrayModule.default;

describe("isarray normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof isArray).toBe("function");
  });

  test("matches representative array checks", () => {
    expect(isArray([])).toBe(true);
    expect(isArray({ length: 0 })).toBe(false);
    expect(isArray("x")).toBe(false);
  });
});
