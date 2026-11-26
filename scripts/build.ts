import { mkdirSync } from "node:fs";

const head = Bun.spawnSync(["git", "rev-parse", "HEAD"], { stdout: "pipe", stderr: "pipe" });
const status = Bun.spawnSync(["git", "status", "--porcelain"], {
  stdout: "pipe",
  stderr: "pipe",
});
const sha = head.stdout.toString().trim();
const revision =
  head.exitCode === 0 && status.exitCode === 0 && /^[0-9a-f]{40}$/.test(sha)
    ? status.stdout.toString().trim()
      ? "dirty"
      : sha
    : "unavailable";

mkdirSync("dist", { recursive: true });
for (const [entry, out] of [
  ["apps/ants/src/main.ts", "dist/ants"],
  ["scripts/sqlite-smoke.ts", "dist/ants-sqlite-smoke"],
]) {
  const result = Bun.spawnSync(
    [
      process.execPath,
      "build",
      "--compile",
      "--define",
      `ANTS_BUILD_REVISION=${JSON.stringify(revision)}`,
      entry,
      "--outfile",
      out,
    ],
    { stdout: "inherit", stderr: "inherit" },
  );
  if (result.exitCode !== 0) process.exit(result.exitCode ?? 1);
}
