import { expect, test } from "bun:test";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const main = resolve("apps/ants/src/main.ts");
function run(...args: string[]) {
  const cwd = mkdtempSync(join(tmpdir(), "ants-cli-"));
  try {
    const result = Bun.spawnSync([process.execPath, main, ...args], {
      cwd,
      stdout: "pipe",
      stderr: "pipe",
    });
    expect(readdirSync(cwd)).toEqual([]);
    return { code: result.exitCode, out: result.stdout.toString(), err: result.stderr.toString() };
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}
test("help and version work without initializing local state", () => {
  expect(run("--help").out).toContain("Usage: ants");
  const result = run("--version", "--json", "--noninteractive");
  expect(result.code).toBe(0);
  expect(result.err).toBe("");
  expect(JSON.parse(result.out)).toMatchObject({
    schemaVersion: 1,
    ok: true,
    data: { version: "0.1.0-dev.0" },
  });
});
test("invalid commands fail without echoing untrusted input", () => {
  const result = run("unknown-secret-value", "--json");
  expect(result.code).toBe(2);
  expect(result.out + result.err).not.toContain("unknown-secret-value");
  expect(JSON.parse(result.out)).toMatchObject({
    schemaVersion: 1,
    ok: false,
    error: { code: "usage", retryable: false },
  });
  expect(run("--help", "--help").code).toBe(2);
});

test("reserved host and runner modes fail closed without effects", () => {
  for (const command of ["init", "serve", "runner"]) {
    const result = run(command, "--json");
    expect(result.code).toBe(7);
    expect(JSON.parse(result.out)).toMatchObject({
      schemaVersion: 1,
      ok: false,
      error: { code: "unavailable", retryable: false },
    });
    expect(result.err).toContain("unavailable");
  }
});
