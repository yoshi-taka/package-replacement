import { describe, expect, test } from "bun:test";
import path from "node:path";

const modularGetPath = path.join(process.cwd(), "snippets", "get", "normalized.ts");
const monolithGetPath = path.join(process.cwd(), "snippets", "get-lodash", "normalized.ts");

const modularGetModule = await import(modularGetPath);
const monolithGetModule = await import(monolithGetPath);

const modularGet = modularGetModule.default;
const monolithGet = monolithGetModule.default;

describe("get monolith extraction parity", () => {
  test("monolith-derived normalized get can be imported in Bun", () => {
    expect(typeof monolithGet).toBe("function");
  });

  test("modular and monolith-derived get agree on representative paths", () => {
    const sample = {
      a: [{ b: { c: 3 } }],
      nested: {
        value: 42,
      },
      nil: null,
    };

    expect(monolithGet(sample, "a[0].b.c")).toBe(modularGet(sample, "a[0].b.c"));
    expect(monolithGet(sample, ["nested", "value"])).toBe(modularGet(sample, ["nested", "value"]));
    expect(monolithGet(sample, "missing.path", "fallback")).toBe(
      modularGet(sample, "missing.path", "fallback"),
    );
    expect(monolithGet(sample, "nil.deep", "fallback")).toBe(
      modularGet(sample, "nil.deep", "fallback"),
    );
  });
});
