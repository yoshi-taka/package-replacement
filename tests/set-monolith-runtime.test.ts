import { describe, expect, test } from "bun:test";
import path from "node:path";

const modularSetPath = path.join(process.cwd(), "snippets", "set", "normalized.ts");
const monolithSetPath = path.join(process.cwd(), "snippets", "set-lodash", "normalized.ts");

const modularSetModule = await import(modularSetPath);
const monolithSetModule = await import(monolithSetPath);

const modularSet = modularSetModule.default;
const monolithSet = monolithSetModule.default;

describe("set monolith extraction parity", () => {
  test("monolith-derived normalized set can be imported in Bun", () => {
    expect(typeof monolithSet).toBe("function");
  });

  test("modular and monolith-derived set agree on representative path writes", () => {
    const modularObject = { a: [{ b: { c: 1 } }] };
    const monolithObject = { a: [{ b: { c: 1 } }] };

    modularSet(modularObject, "a[0].b.c", 4);
    monolithSet(monolithObject, "a[0].b.c", 4);

    expect(monolithObject).toEqual(modularObject);

    const modularDynamic = {};
    const monolithDynamic = {};

    modularSet(modularDynamic, ["x", "0", "y", "z"], 5);
    monolithSet(monolithDynamic, ["x", "0", "y", "z"], 5);

    expect(monolithDynamic).toEqual(modularDynamic);
  });
});
