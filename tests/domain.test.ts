import { expect, test } from "bun:test";
import { parseCounter } from "../packages/domain/src/index";
import { domainViolations } from "../scripts/check-boundaries";

test("canonical unsigned counter preserves 64-bit precision", () => {
  expect(parseCounter("18446744073709551615")).toBe(18446744073709551615n);
  expect(parseCounter("0")).toBe(0n);
});
test("invalid counters are rejected", () => {
  for (const value of [0, -1, "", "01", "-1", "18446744073709551616", "1e3", "1\n"]) {
    expect(() => parseCounter(value)).toThrow(RangeError);
  }
});
test("domain boundary rejects storage and runtime imports", () => {
  const root = "/workspace/packages/domain/src";
  for (const source of [
    'import { db } from "@ants/storage-sqlite";',
    'export * from "../../storage-sqlite/src/index";',
    'type DB = import("bun:sqlite").Database;',
    'const db = await import("bun:sqlite");',
    'Bun.serve({});',
  ]) expect(domainViolations(source, root + "/index.ts", root).length).toBeGreaterThan(0);
  expect(domainViolations('import { value } from "./value";', root + "/index.ts", root)).toEqual([]);
});
