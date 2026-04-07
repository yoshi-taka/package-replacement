import { describe, expect, test } from "bun:test";
import path from "node:path";

const chunkPath = path.join(process.cwd(), "snippets", "chunk", "normalized.ts");

const chunkModule = await import(chunkPath);
const chunk = chunkModule.default;

describe("chunk normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof chunk).toBe("function");
  });

  test("splits representative arrays", () => {
    expect(chunk(["a", "b", "c", "d"], 2)).toEqual([
      ["a", "b"],
      ["c", "d"],
    ]);
    expect(chunk(["a", "b", "c", "d"], 3)).toEqual([["a", "b", "c"], ["d"]]);
  });
});
