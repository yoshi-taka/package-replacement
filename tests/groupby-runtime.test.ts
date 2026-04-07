import { describe, expect, test } from "bun:test";
import path from "node:path";

const groupByPath = path.join(process.cwd(), "snippets", "groupby", "normalized.ts");

const groupByModule = await import(groupByPath);
const groupBy = groupByModule.default;

describe("groupBy normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof groupBy).toBe("function");
  });

  test("groups representative values", () => {
    expect(groupBy([6.1, 4.2, 6.3], Math.floor)).toEqual({
      "4": [4.2],
      "6": [6.1, 6.3],
    });
  });
});
