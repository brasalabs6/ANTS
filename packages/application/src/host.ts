import type { Scope } from "./index";

export interface ColonyIdentity extends Scope {
  readonly name: string;
  readonly ownerId: string;
  readonly createdAtMs: number;
}
export interface HostIdentity extends ColonyIdentity {
  readonly credential: string;
}
export interface HostReader {
  /** Adapter must authenticate and scope the read in the same database statement. */
  readAuthorizedColony(credential: string, scope: Scope): ColonyIdentity | null;
  close(): void;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function readColony(store: HostReader, credential: unknown, scope: unknown): ColonyIdentity {
  if (
    typeof credential !== "string" ||
    !/^[0-9a-f]{64}$/.test(credential) ||
    typeof scope !== "object" ||
    scope === null ||
    !("orgId" in scope) ||
    !("colonyId" in scope) ||
    typeof scope.orgId !== "string" ||
    typeof scope.colonyId !== "string" ||
    !UUID.test(scope.orgId) ||
    !UUID.test(scope.colonyId)
  ) {
    throw new Error("Access denied");
  }
  const result = store.readAuthorizedColony(credential, {
    orgId: scope.orgId,
    colonyId: scope.colonyId,
  });
  if (!result) throw new Error("Access denied");
  return result;
}
