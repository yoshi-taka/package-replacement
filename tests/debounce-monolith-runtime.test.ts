import { describe, expect, test } from "bun:test";
import path from "node:path";

const modularDebouncePath = path.join(process.cwd(), "snippets", "debounce", "normalized.ts");
const monolithDebouncePath = path.join(
  process.cwd(),
  "snippets",
  "debounce-lodash",
  "normalized.ts",
);

const modularDebounceModule = await import(modularDebouncePath);
const monolithDebounceModule = await import(monolithDebouncePath);

const modularDebounce = modularDebounceModule.default;
const monolithDebounce = monolithDebounceModule.default;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("debounce monolith extraction parity", () => {
  test("monolith-derived normalized debounce can be imported in Bun", () => {
    expect(typeof monolithDebounce).toBe("function");
  });

  test("modular and monolith-derived debounce agree on trailing invocation", async () => {
    const modularCalls: string[] = [];
    const monolithCalls: string[] = [];

    const modular = modularDebounce((value: string) => {
      modularCalls.push(value);
      return value;
    }, 10);

    const monolith = monolithDebounce((value: string) => {
      monolithCalls.push(value);
      return value;
    }, 10);

    modular("first");
    modular("second");
    monolith("first");
    monolith("second");

    await wait(30);

    expect(monolithCalls).toEqual(modularCalls);
    expect(monolithCalls).toEqual(["second"]);
  });

  test("modular and monolith-derived debounce agree on flush", () => {
    const modular = modularDebounce((value: string) => value, 20);
    const monolith = monolithDebounce((value: string) => value, 20);

    modular("later");
    monolith("later");

    expect(monolith.flush()).toBe(modular.flush());
  });
});
