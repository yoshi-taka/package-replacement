import { describe, expect, test } from "bun:test";
import path from "node:path";

const modularHasPath = path.join(process.cwd(), "snippets", "has", "normalized.ts");
const monolithHasPath = path.join(process.cwd(), "snippets", "has-lodash", "normalized.ts");

const modularHasModule = await import(modularHasPath);
const monolithHasModule = await import(monolithHasPath);

const modularHas = modularHasModule.default;
const monolithHas = monolithHasModule.default;

describe("has monolith extraction parity", () => {
  test("monolith-derived normalized has can be imported in Bun", () => {
    expect(typeof monolithHas).toBe("function");
  });

  test("modular and monolith-derived has agree on representative paths", () => {
    const sample = {
      a: { b: 2 },
      list: [{ value: 1 }],
    };
    const inherited = Object.create({ a: { b: 2 } });

    expect(monolithHas(sample, "a")).toBe(modularHas(sample, "a"));
    expect(monolithHas(sample, "a.b")).toBe(modularHas(sample, "a.b"));
    expect(monolithHas(sample, ["list", "0", "value"])).toBe(
      modularHas(sample, ["list", "0", "value"]),
    );
    expect(monolithHas(inherited, "a")).toBe(modularHas(inherited, "a"));
  });
});
