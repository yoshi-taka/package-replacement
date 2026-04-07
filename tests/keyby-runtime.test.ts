import { describe, expect, test } from "bun:test";
import path from "node:path";

const keyByPath = path.join(process.cwd(), "snippets", "keyby", "normalized.ts");

const keyByModule = await import(keyByPath);
const keyBy = keyByModule.default;

describe("keyBy normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof keyBy).toBe("function");
  });

  test("indexes representative values", () => {
    expect(
      keyBy(
        [
          { dir: "left", code: 97 },
          { dir: "right", code: 100 },
        ],
        "dir",
      ),
    ).toEqual({
      left: { dir: "left", code: 97 },
      right: { dir: "right", code: 100 },
    });
  });
});
