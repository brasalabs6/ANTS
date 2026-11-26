import { type CliResult, unavailableMode } from "@ants/cli";

/** No listener or database initialization before the reviewed R02 bootstrap. */
export function runHost(args: readonly string[], requestId: string): CliResult {
  return unavailableMode(args, "Host mode is unavailable in this foundation build.", requestId);
}
