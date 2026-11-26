import { runCli } from "@ants/cli";
import { version } from "@ants/config";

export function runClient(args: readonly string[]): number {
  const result = runCli(args, { version, runtime: Bun.version }, crypto.randomUUID());
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  return result.exitCode;
}
