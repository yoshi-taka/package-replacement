import { describe, expect, test } from "bun:test";

import {
  buildNormalizedHeader,
  normalizeCommonJsToEsm,
  withNormalizedHeader,
} from "../scripts/normalize-snippet.mjs";

describe("normalizeCommonJsToEsm", () => {
  test("converts module.exports default assignment to ESM default export", () => {
    const input = [
      "function debounce() {",
      "  return 1;",
      "}",
      "",
      "module.exports = debounce;",
    ].join("\n");

    const output = normalizeCommonJsToEsm(input);

    expect(output).toContain("export default debounce;");
    expect(output).not.toContain("module.exports = debounce;");
    expect(output).toContain("function debounce()");
  });

  test("throws when no supported export assignment exists", () => {
    expect(() => normalizeCommonJsToEsm("const value = 1;")).toThrow(
      "No supported CommonJS default export found.",
    );
  });

  test("prepends a normalized header with provenance", () => {
    const output = withNormalizedHeader("export default debounce;\n", {
      sourcePackage: "lodash.debounce",
      sourceVersion: "4.0.8",
    });

    expect(output).toContain("Derived from lodash.debounce@4.0.8");
    expect(output).toContain("Preserve the upstream license and attribution notices");
    expect(output).toContain("export default debounce;");
  });

  test("builds a stable normalized header", () => {
    const header = buildNormalizedHeader({
      sourcePackage: "object.assign",
      sourceVersion: "4.1.7",
    });

    expect(header).toContain("Derived from object.assign@4.1.7");
    expect(header).toContain("Rule-based normalized variant");
  });
});
