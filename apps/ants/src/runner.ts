import { type CliResult, unavailableMode } from "@ants/cli";

/** No runner dispatch or external process effects before its authorization gates. */
export function runRunner(args: readonly string[], requestId: string): CliResult {
  return unavailableMode(args, "Runner mode is unavailable in this foundation build.", requestId);
}
