import { describe, expect, test } from "bun:test";
import path from "node:path";

const modularThrottlePath = path.join(process.cwd(), "snippets", "throttle", "normalized.ts");
const monolithThrottlePath = path.join(
  process.cwd(),
  "snippets",
  "throttle-lodash",
  "normalized.ts",
);

const modularThrottleModule = await import(modularThrottlePath);
const monolithThrottleModule = await import(monolithThrottlePath);

const modularThrottle = modularThrottleModule.default;
const monolithThrottle = monolithThrottleModule.default;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("throttle monolith extraction parity", () => {
  test("monolith-derived normalized throttle can be imported in Bun", () => {
    expect(typeof monolithThrottle).toBe("function");
  });

  test("modular and monolith-derived throttle agree on representative calls", async () => {
    const modularCalls: string[] = [];
    const monolithCalls: string[] = [];

    const modular = modularThrottle((value: string) => {
      modularCalls.push(value);
      return value;
    }, 10);

    const monolith = monolithThrottle((value: string) => {
      monolithCalls.push(value);
      return value;
    }, 10);

    modular("first");
    modular("second");
    monolith("first");
    monolith("second");

    await wait(30);

    expect(monolithCalls).toEqual(modularCalls);
    expect(monolith.flush()).toBe(modular.flush());
  });
});
