import { describe, expect, test } from "bun:test";
import path from "node:path";

const isRegexPath = path.join(process.cwd(), "snippets", "is-regex", "normalized.ts");

const isRegexModule = await import(isRegexPath);
const isRegex = isRegexModule.default;

describe("is-regex normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof isRegex).toBe("function");
  });

  test("detects representative regular expressions", () => {
    expect(isRegex(/abc/)).toBe(true);
    expect(isRegex(new RegExp("abc"))).toBe(true);
    expect(isRegex("abc")).toBe(false);
    expect(isRegex({ lastIndex: 0, exec() {} })).toBe(false);
  });
});
