import { describe, expect, test } from "bun:test";
import path from "node:path";

const isArgumentsPath = path.join(process.cwd(), "snippets", "is-arguments", "normalized.ts");

const isArgumentsModule = await import(isArgumentsPath);
const isArguments = isArgumentsModule.default;

describe("is-arguments normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof isArguments).toBe("function");
  });

  test("detects representative arguments objects", () => {
    const value = (function () {
      return arguments;
    })("a");
    expect(isArguments(value)).toBe(true);
    expect(isArguments(["a"])).toBe(false);
    expect(isArguments({ 0: "a", length: 1 })).toBe(false);
  });
});
