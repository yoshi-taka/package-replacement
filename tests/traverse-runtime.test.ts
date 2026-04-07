import { describe, expect, test } from "bun:test";
import path from "node:path";

const traversePath = path.join(process.cwd(), "snippets", "traverse", "normalized.ts");

const traverseModule = await import(traversePath);
const traverse = traverseModule.default;

describe("traverse normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof traverse).toBe("function");
  });

  test("gets and sets representative nested paths", () => {
    const obj = { a: { b: 2 } };
    expect(traverse.get(obj, ["a", "b"])).toBe(2);
    expect(traverse.has(obj, ["a", "b"])).toBe(true);
    expect(traverse(obj).set(["a", "c"], 3)).toBe(3);
    expect(obj.a.c).toBe(3);
  });

  test("maps representative nested values immutably", () => {
    const input = { a: 1, nested: { b: 2 } };
    const mapped = traverse(input).map(function (value) {
      if (typeof value === "number") {
        this.update(value * 10);
      }
    });

    expect(mapped).toEqual({ a: 10, nested: { b: 20 } });
    expect(input).toEqual({ a: 1, nested: { b: 2 } });
  });
});
