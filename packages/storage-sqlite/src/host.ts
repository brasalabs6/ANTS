import { Database } from "bun:sqlite";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { chmodSync, lstatSync, mkdirSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import type { ColonyIdentity, HostIdentity, HostReader, Scope } from "@ants/application";
import { hostMigrations } from "./host-migrations";
import { migrate } from "./migrations";

const DB_NAME = "host.sqlite";

function digest(credential: string): string {
  return createHash("sha256").update(credential, "utf8").digest("hex");
}

function localPath(path: string): string {
  if (process.platform === "win32" || !isAbsolute(path) || path.includes("\0")) {
    throw new Error("Host requires an explicit absolute POSIX data directory");
  }
  return resolve(path);
}

function privateDirectory(path: string): void {
  const stat = lstatSync(path);
  if (!stat.isDirectory() || (stat.mode & 0o077) !== 0 || stat.uid !== process.getuid?.()) {
    throw new Error("Unsafe host directory");
  }
}

function privateFile(path: string, required: boolean): void {
  const stat = lstatSync(path, { throwIfNoEntry: false });
  if (!stat && !required) return;
  if (
    !stat?.isFile() ||
    stat.nlink !== 1 ||
    (stat.mode & 0o077) !== 0 ||
    stat.uid !== process.getuid?.()
  ) {
    throw new Error("Unsafe host database file");
  }
}

function configure(db: Database): void {
  db.exec("PRAGMA foreign_keys = ON");
  db.exec("PRAGMA busy_timeout = 250");
  if (db.query<{ journal_mode: string }, []>("PRAGMA journal_mode = WAL").get()?.journal_mode !== "wal") {
    throw new Error("Host database requires WAL");
  }
  if (db.query<{ foreign_keys: number }, []>("PRAGMA foreign_keys").get()?.foreign_keys !== 1) {
    throw new Error("Host database requires foreign keys");
  }
}

/** Trusted local bootstrap only; no network or public CLI exposure in this slice. */
export function bootstrapHost(dataDir: string, name: unknown): HostIdentity {
  if (typeof name !== "string" || name !== name.trim() || !name || name.length > 120 || /[\u0000-\u001f\u007f]/.test(name)) {
    throw new Error("Invalid colony name");
  }
  const path = localPath(dataDir);
  // Exclusive reservation: never modify an existing directory, even an empty one.
  mkdirSync(path, { mode: 0o700 });
  privateDirectory(path);
  const filename = join(path, DB_NAME);
  const db = new Database(filename, { create: true, strict: true });
  try {
    chmodSync(filename, 0o600);
    configure(db);
    migrate(db, hostMigrations);
    const identity: HostIdentity = {
      orgId: randomUUID(),
      colonyId: randomUUID(),
      ownerId: randomUUID(),
      name,
      createdAtMs: Date.now(),
      credential: randomBytes(32).toString("hex"),
    };
    const event = randomUUID();
    db.transaction(() => {
      db.query("INSERT INTO organizations VALUES (?, ?)").run(identity.orgId, name);
      db.query("INSERT INTO colonies VALUES (?, ?, ?, ?)").run(identity.orgId, identity.colonyId, name, identity.createdAtMs);
      db.query("INSERT INTO host_owners VALUES (?, ?, ?, ?)").run(identity.orgId, identity.colonyId, identity.ownerId, digest(identity.credential));
      db.query("INSERT INTO host_events VALUES (?, ?, 1, ?, 'colony.created', ?, ?)").run(identity.orgId, identity.colonyId, event, identity.ownerId, identity.createdAtMs);
      db.query("INSERT INTO host_audit VALUES (?, 'host.bootstrap')").run(event);
      db.query("INSERT INTO host_outbox (event_id) VALUES (?)").run(event);
    }).immediate();
    return identity;
  } finally {
    db.close();
  }
}

/** Existing host only. Never creates or adopts unrelated state. */
export function openHostReader(dataDir: string): HostReader {
  const path = localPath(dataDir);
  privateDirectory(path);
  const filename = join(path, DB_NAME);
  privateFile(filename, true);
  privateFile(`${filename}-wal`, false);
  privateFile(`${filename}-shm`, false);
  privateFile(`${filename}-journal`, false);
  const db = new Database(filename, { readonly: true, strict: true });
  try {
    const query = db.query<ColonyIdentity, [string, string, string]>(
      `SELECT c.org_id AS orgId, c.id AS colonyId, c.name, c.created_at_ms AS createdAtMs,
              o.principal_id AS ownerId
       FROM host_owners o JOIN colonies c
       ON c.org_id = o.org_id AND c.id = o.colony_id
       WHERE o.credential_digest = ? AND o.org_id = ? AND o.colony_id = ?`,
    );
    // Preparing the statement is not sufficient on all SQLite builds; validate schema now.
    const history = db.query<{ version: number; checksum: string }, []>(
      "SELECT version, checksum FROM schema_migrations ORDER BY version",
    ).all();
    if (history.length !== hostMigrations.length || history.some((entry, i) => {
      const migration = hostMigrations[i];
      return !migration || entry.version !== migration.version || entry.checksum !== digest(migration.sql);
    })) {
      throw new Error("Host schema mismatch");
    }
    return {
      readAuthorizedColony(credential: string, scope: Scope) {
        return query.get(digest(credential), scope.orgId, scope.colonyId);
      },
      close() {
        db.close();
      },
    };
  } catch (error) {
    db.close();
    throw error;
  }
}
