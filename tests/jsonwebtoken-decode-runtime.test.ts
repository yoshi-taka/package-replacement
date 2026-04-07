import { describe, expect, test } from "bun:test";
import path from "node:path";

const decodePath = path.join(process.cwd(), "snippets", "jsonwebtoken-decode", "normalized.ts");

const decodeModule = await import(decodePath);
const decodeJwt = decodeModule.default;

describe("jsonwebtoken decode-only snippet", () => {
  test("can be imported in Bun", () => {
    expect(typeof decodeJwt).toBe("function");
  });

  test("decodes a representative JWT payload", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJhZG1pbiI6dHJ1ZX0.signature";
    expect(decodeJwt(token)).toEqual({
      sub: "123",
      admin: true,
    });
  });

  test("supports the complete option", () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJhZG1pbiI6dHJ1ZX0.signature";
    expect(decodeJwt(token, { complete: true })).toEqual({
      header: {
        alg: "HS256",
        typ: "JWT",
      },
      payload: {
        sub: "123",
        admin: true,
      },
      signature: "signature",
    });
  });

  test("returns null for invalid token shapes", () => {
    expect(decodeJwt("not-a-token")).toBeNull();
  });
});
