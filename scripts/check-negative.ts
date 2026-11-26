import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const dir = mkdtempSync(join(tmpdir(), "ants-negative-"));
try {
  const file = join(dir, "intentional.test.ts");
  writeFileSync(file, 'import {expect,test} from "bun:test"; test("intentional failure",()=>expect(1).toBe(2));\n');
  const result = Bun.spawnSync([process.execPath, "test", file], { cwd: dir, stdout: "pipe", stderr: "pipe" });
  if (result.exitCode !== 1 || !(result.stdout.toString() + result.stderr.toString()).includes("intentional failure")) {
    throw new Error("Test harness did not report the intentional failing assertion");
  }
  console.log("Intentional test failure returned exit 1");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
