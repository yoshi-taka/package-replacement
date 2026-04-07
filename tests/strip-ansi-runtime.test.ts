import { describe, expect, test } from "bun:test";
import path from "node:path";

const rawPath = path.join(process.cwd(), "snippets", "strip-ansi", "raw.js");
const normalizedPath = path.join(process.cwd(), "snippets", "strip-ansi", "normalized.ts");

const rawModule = await import(rawPath);
const normalizedModule = await import(normalizedPath);

const rawStripAnsi = rawModule.default;
const normalizedStripAnsi = normalizedModule.default;

describe("strip-ansi extracted bundle", () => {
  test("raw and normalized variants can be imported in Bun", () => {
    expect(typeof rawStripAnsi).toBe("function");
    expect(typeof normalizedStripAnsi).toBe("function");
  });

  test("raw and normalized strip representative ANSI sequences", () => {
    const input = "\u001B[4mUnicorn\u001B[0m";
    expect(rawStripAnsi(input)).toBe("Unicorn");
    expect(normalizedStripAnsi(input)).toBe("Unicorn");
  });

  test("raw and normalized strip OSC hyperlink sequences", () => {
    const input = "\u001B]8;;https://github.com\u0007Click\u001B]8;;\u0007";
    expect(rawStripAnsi(input)).toBe("Click");
    expect(normalizedStripAnsi(input)).toBe("Click");
  });
});
