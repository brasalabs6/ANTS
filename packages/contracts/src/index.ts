export type ExitCode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export interface VersionInfo {
  readonly version: string;
  readonly runtime: string;
}
export interface CommandInfo {
  readonly name: string;
  readonly description: string;
}
export type CliEnvelope =
  | {
      readonly schemaVersion: 1;
      readonly ok: true;
      readonly data: VersionInfo | { readonly commands: readonly CommandInfo[] };
    }
  | {
      readonly schemaVersion: 1;
      readonly ok: false;
      readonly error: {
        readonly code: "usage";
        readonly message: string;
        readonly requestId: string;
        readonly retryable: false;
        readonly nextStep: string;
      };
    };
