import { describe, expect, test } from "bun:test";
import path from "node:path";

const modularUniqByPath = path.join(process.cwd(), "snippets", "uniqby", "normalized.ts");
const monolithUniqByPath = path.join(process.cwd(), "snippets", "uniqby-lodash", "normalized.ts");

const modularUniqByModule = await import(modularUniqByPath);
const monolithUniqByModule = await import(monolithUniqByPath);

const modularUniqBy = modularUniqByModule.default;
const monolithUniqBy = monolithUniqByModule.default;

describe("uniqBy monolith extraction parity", () => {
  test("monolith-derived normalized uniqBy can be imported in Bun", () => {
    expect(typeof monolithUniqBy).toBe("function");
  });

  test("modular and monolith-derived uniqBy agree on representative arrays", () => {
    const numbers = [2.1, 1.2, 2.3];
    const objects = [{ x: 1 }, { x: 2 }, { x: 1 }];

    expect(monolithUniqBy(numbers, Math.floor)).toEqual(modularUniqBy(numbers, Math.floor));
    expect(monolithUniqBy(objects, "x")).toEqual(modularUniqBy(objects, "x"));
  });
});
