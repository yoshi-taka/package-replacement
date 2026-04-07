import { describe, expect, test } from "bun:test";
import path from "node:path";

const rawPath = path.join(process.cwd(), "snippets", "debounce", "raw.js");
const normalizedPath = path.join(process.cwd(), "snippets", "debounce", "normalized.ts");

const rawModule = await import(rawPath);
const normalizedModule = await import(normalizedPath);

const rawDebounce = rawModule.default;
const normalizedDebounce = normalizedModule.default;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("debounce runtime parity", () => {
  test("normalized variant can be imported in Bun", () => {
    expect(typeof normalizedDebounce).toBe("function");
  });

  test("raw and normalized expose cancel and flush", () => {
    const raw = rawDebounce(() => "raw", 5);
    const normalized = normalizedDebounce(() => "normalized", 5);

    expect(typeof raw.cancel).toBe("function");
    expect(typeof raw.flush).toBe("function");
    expect(typeof normalized.cancel).toBe("function");
    expect(typeof normalized.flush).toBe("function");
  });

  test("raw and normalized produce the same trailing-call behavior", async () => {
    const rawCalls: string[] = [];
    const normalizedCalls: string[] = [];

    const raw = rawDebounce((value: string) => {
      rawCalls.push(value);
      return value;
    }, 10);

    const normalized = normalizedDebounce((value: string) => {
      normalizedCalls.push(value);
      return value;
    }, 10);

    raw("first");
    raw("second");
    normalized("first");
    normalized("second");

    await wait(30);

    expect(rawCalls).toEqual(["second"]);
    expect(normalizedCalls).toEqual(["second"]);
  });

  test("raw and normalized flush pending work consistently", () => {
    const rawCalls: string[] = [];
    const normalizedCalls: string[] = [];

    const raw = rawDebounce((value: string) => {
      rawCalls.push(value);
      return value;
    }, 20);

    const normalized = normalizedDebounce((value: string) => {
      normalizedCalls.push(value);
      return value;
    }, 20);

    raw("later");
    normalized("later");

    expect(raw.flush()).toBe("later");
    expect(normalized.flush()).toBe("later");
    expect(rawCalls).toEqual(["later"]);
    expect(normalizedCalls).toEqual(["later"]);
  });
});
