import { type CliResult, runCli } from "@ants/cli";
import { buildRevision, version } from "@ants/config";

export function runClient(args: readonly string[], requestId: string): CliResult {
  return runCli(args, { version, runtime: Bun.version, revision: buildRevision }, requestId);
}
