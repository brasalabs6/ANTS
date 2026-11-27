/** R01 fixture port, not the production memory or authorization contract. */
export interface Scope {
  readonly orgId: string;
  readonly colonyId: string;
}
export interface FixtureNote {
  readonly id: string;
  readonly body: string;
  readonly createdAtMs: number;
}
export interface FixtureSearch {
  readonly method: "fts5" | "lexical";
  readonly notes: readonly FixtureNote[];
  /** True when the bounded candidate scan or result limit omitted rows. */
  readonly truncated: boolean;
}
export interface FixtureStore {
  createColony(scope: Scope): void;
  insert(scope: Scope, note: FixtureNote): void;
  search(scope: Scope, query: string): FixtureSearch;
  close(): void;
}

export type { ColonyIdentity, HostIdentity, HostReader } from "./host";
export { readColony } from "./host";
