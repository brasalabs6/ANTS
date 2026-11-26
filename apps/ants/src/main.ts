import { runClient } from "./client";

process.exitCode = runClient(process.argv.slice(2));
