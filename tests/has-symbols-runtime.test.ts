import { describe, expect, test } from "bun:test";
import path from "node:path";

const hasSymbolsPath = path.join(process.cwd(), "snippets", "has-symbols", "normalized.ts");

const hasSymbolsModule = await import(hasSymbolsPath);
const hasSymbols = hasSymbolsModule.default;

describe("has-symbols normalized snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof hasSymbols).toBe("function");
  });

  test("reports symbol support in Bun", () => {
    expect(hasSymbols()).toBe(true);
  });
});
