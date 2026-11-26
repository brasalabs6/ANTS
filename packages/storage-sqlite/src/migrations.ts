import type { Database } from "bun:sqlite";
import { createHash } from "node:crypto";

export interface Migration {
  readonly version: number;
  readonly sql: string;
}

export const migrations: readonly Migration[] = [
  {
    version: 1,
    sql: `CREATE TABLE fixture_colonies (
  org_id TEXT NOT NULL, colony_id TEXT NOT NULL,
  PRIMARY KEY (org_id, colony_id)
);
CREATE TABLE fixture_notes (
  org_id TEXT NOT NULL, colony_id TEXT NOT NULL, id TEXT NOT NULL,
  body TEXT NOT NULL CHECK(length(body) BETWEEN 1 AND 4096),
  PRIMARY KEY (org_id, colony_id, id),
  FOREIGN KEY (org_id, colony_id) REFERENCES fixture_colonies(org_id, colony_id)
);`,
  },
  {
    version: 2,
    sql: `ALTER TABLE fixture_notes ADD COLUMN created_at_ms INTEGER NOT NULL DEFAULT 0 CHECK(created_at_ms >= 0);`,
  },
];

function checksum(sql: string): string {
  return createHash("sha256").update(sql, "utf8").digest("hex");
}

/** Trusted, static migrations only. No external effects or transaction control in migration SQL. */
export function migrate(db: Database, desired: readonly Migration[] = migrations): number {
  desired.forEach((migration, index) => {
    if (migration.version !== index + 1 || !migration.sql.trim()) {
      throw new Error("Invalid migration sequence");
    }
  });
  return db.transaction(() => {
    db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      checksum TEXT NOT NULL,
      applied_at_ms INTEGER NOT NULL
    )`);
    const history = db.query<{ version: number; checksum: string }, []>(
      "SELECT version, checksum FROM schema_migrations ORDER BY version",
    ).all();
    for (const [index, applied] of history.entries()) {
      const expected = desired[index];
      if (!expected || applied.version !== index + 1 || applied.checksum !== checksum(expected.sql)) {
        throw new Error("Migration history mismatch");
      }
    }
    const record = db.query<never, [number, string, number]>(
      "INSERT INTO schema_migrations (version, checksum, applied_at_ms) VALUES (?, ?, ?)",
    );
    const pending = desired.slice(history.length);
    for (const migration of pending) {
      db.exec(migration.sql);
      record.run(migration.version, checksum(migration.sql), Date.now());
    }
    return pending.length;
  }).immediate();
}
