import type { Migration } from "./migrations";

// Separate migration history in the host database; fixture migrations remain unchanged.
export const hostMigrations: readonly Migration[] = [
  {
    version: 1,
    sql: `CREATE TABLE organizations (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 120)
);
CREATE TABLE colonies (
  org_id TEXT NOT NULL REFERENCES organizations(id),
  id TEXT NOT NULL,
  name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 120),
  created_at_ms INTEGER NOT NULL CHECK(created_at_ms >= 0),
  PRIMARY KEY (org_id, id)
);
CREATE TABLE host_owners (
  org_id TEXT NOT NULL,
  colony_id TEXT NOT NULL,
  principal_id TEXT NOT NULL,
  credential_digest TEXT NOT NULL UNIQUE CHECK(length(credential_digest) = 64),
  PRIMARY KEY (org_id, colony_id),
  FOREIGN KEY (org_id, colony_id) REFERENCES colonies(org_id, id)
);
CREATE TABLE host_events (
  org_id TEXT NOT NULL,
  colony_id TEXT NOT NULL,
  sequence INTEGER NOT NULL CHECK(sequence > 0),
  event_id TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  created_at_ms INTEGER NOT NULL,
  PRIMARY KEY (org_id, colony_id, sequence),
  FOREIGN KEY (org_id, colony_id) REFERENCES colonies(org_id, id)
);
CREATE TABLE host_audit (
  event_id TEXT PRIMARY KEY NOT NULL REFERENCES host_events(event_id),
  action TEXT NOT NULL
);
CREATE TABLE host_outbox (
  event_id TEXT PRIMARY KEY NOT NULL REFERENCES host_events(event_id),
  attempts INTEGER NOT NULL DEFAULT 0 CHECK(attempts >= 0)
);`,
  },
];
