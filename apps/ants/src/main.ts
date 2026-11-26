import { runClient } from "./client";
import { runHost } from "./host";
import { runRunner } from "./runner";

const args = process.argv.slice(2);
const command = args.find((arg) => arg !== "--json" && arg !== "--noninteractive");
const requestId = crypto.randomUUID();
const result =
  command === "init" || command === "serve"
    ? runHost(args, requestId)
    : command === "runner"
      ? runRunner(args, requestId)
      : runClient(args, requestId);
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
process.exitCode = result.exitCode;
