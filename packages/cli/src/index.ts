import type { CliEnvelope, CommandInfo, ExitCode, VersionInfo } from "@ants/contracts";

const commands: readonly CommandInfo[] = [
  { name: "help", description: "Show available commands" },
  { name: "version", description: "Show build version" },
];

export interface CliResult {
  readonly exitCode: ExitCode;
  readonly stdout: string;
  readonly stderr: string;
}

export function runCli(
  args: readonly string[],
  version: VersionInfo,
  requestId: string,
): CliResult {
  const json = args.includes("--json");
  const positional = args.filter((arg) => arg !== "--json" && arg !== "--noninteractive");
  const repeated = ["--json", "--noninteractive"].some(
    (flag) => args.filter((arg) => arg === flag).length > 1,
  );
  const command = positional[0] ?? "help";
  if (
    repeated ||
    positional.length > 1 ||
    !["help", "--help", "-h", "version", "--version", "-v"].includes(command)
  ) {
    const message = "Unknown command or invalid arguments.";
    const error: CliEnvelope = {
      schemaVersion: 1,
      ok: false,
      error: { code: "usage", message, requestId, retryable: false, nextStep: "Run ants --help." },
    };
    return {
      exitCode: 2,
      stdout: json ? `${JSON.stringify(error)}\n` : "",
      stderr: `${message} Run ants --help.\n`,
    };
  }
  const isVersion = ["version", "--version", "-v"].includes(command);
  const data = isVersion ? version : { commands };
  const envelope: CliEnvelope = { schemaVersion: 1, ok: true, data };
  const help =
    "ANTS — Autonomous Networked Task Swarms\n\nUsage: ants [help|version] [--json] [--noninteractive]\n";
  return {
    exitCode: 0,
    stdout: json ? `${JSON.stringify(envelope)}\n` : isVersion ? `${version.version}\n` : help,
    stderr: "",
  };
}

/** Reserved modes fail closed until their later milestone implements real behavior. */
export function unavailableMode(
  args: readonly string[],
  message: string,
  requestId: string,
): CliResult {
  const envelope: CliEnvelope = {
    schemaVersion: 1,
    ok: false,
    error: {
      code: "unavailable",
      message,
      requestId,
      retryable: false,
      nextStep: "Run ants --help for supported commands.",
    },
  };
  return {
    exitCode: 7,
    stdout: args.includes("--json") ? `${JSON.stringify(envelope)}\n` : "",
    stderr: `${message}\n`,
  };
}
