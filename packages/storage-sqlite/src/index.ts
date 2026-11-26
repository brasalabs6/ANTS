import { Database } from "bun:sqlite";
import { chmodSync, lstatSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { FixtureNote, FixtureSearch, FixtureStore, Scope } from "@ants/application";
import { migrate } from "./migrations";

export { migrate, migrations } from "./migrations";
export type { Migration } from "./migrations";

const MAX_CANDIDATES = 200;
const MAX_RESULTS = 20;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateScope(scope: Scope): void {
  if (!UUID.test(scope.orgId) || !UUID.test(scope.colonyId)) throw new Error("Invalid fixture scope");
}

/** The caller supplies a private, existing directory on a local filesystem. */
export function openFixtureDatabase(filename: string, busyTimeoutMs = 250): Database {
  if (!Number.isSafeInteger(busyTimeoutMs) || busyTimeoutMs < 0 || busyTimeoutMs > 5000) {
    throw new RangeError("Invalid SQLite busy timeout");
  }
  const path = resolve(filename);
  const parent = lstatSync(dirname(path));
  if (!parent.isDirectory() || (process.platform !== "win32" && (parent.mode & 0o077) !== 0)) {
    throw new Error("Fixture database requires a private directory");
  }
  const existing = lstatSync(path, { throwIfNoEntry: false });
  if (existing && !existing.isFile()) throw new Error("Invalid database file");
  const db = new Database(path, { create: true, strict: true });
  try {
    if (process.platform !== "win32") chmodSync(path, 0o600);
    db.exec("PRAGMA foreign_keys = ON");
    db.exec("PRAGMA busy_timeout = " + busyTimeoutMs);
    const wal = db.query<{ journal_mode: string }, []>("PRAGMA journal_mode = WAL").get();
    const fk = db.query<{ foreign_keys: number }, []>("PRAGMA foreign_keys").get();
    if (wal?.journal_mode !== "wal" || fk?.foreign_keys !== 1) {
      throw new Error("Required SQLite pragmas not enabled");
    }
    return db;
  } catch (error) {
    db.close();
    throw error;
  }
}

function enableFts(db: Database): boolean {
  try {
    db.exec("CREATE VIRTUAL TABLE temp.ants_search USING fts5(body)");
    return true;
  } catch (error) {
    if (error instanceof Error && /no such module: fts5/i.test(error.message)) return false;
    throw error;
  }
}

/** Bounded fixture search; production indexing, auth and ranking are deferred to R03. */
export function openFixtureStore(filename: string, options: { readonly forceLexical?: boolean } = {}): FixtureStore {
  const db = openFixtureDatabase(filename);
  try {
    migrate(db);
    const fts = options.forceLexical !== true && enableFts(db);
    const insertColony = db.query<never, [string, string]>(
      "INSERT INTO fixture_colonies (org_id, colony_id) VALUES (?, ?)",
    );
    const insertNote = db.query<never, [string, string, string, string, number]>(
      "INSERT INTO fixture_notes (org_id, colony_id, id, body, created_at_ms) VALUES (?, ?, ?, ?, ?)",
    );
    const candidates = db.query<FixtureNote, [string, string, number]>(
      "SELECT id, body, created_at_ms AS createdAtMs FROM fixture_notes WHERE org_id = ? AND colony_id = ? ORDER BY id LIMIT ?",
    );
    return {
      createColony(scope) {
        validateScope(scope);
        db.transaction(() => insertColony.run(scope.orgId, scope.colonyId)).immediate();
      },
      insert(scope, note) {
        validateScope(scope);
        if (!UUID.test(note.id) || !note.body || note.body.length > 4096 ||
            !Number.isSafeInteger(note.createdAtMs) || note.createdAtMs < 0) {
          throw new Error("Invalid fixture note");
        }
        db.transaction(() => insertNote.run(scope.orgId, scope.colonyId, note.id, note.body, note.createdAtMs)).immediate();
      },
      search(scope, query): FixtureSearch {
        validateScope(scope);
        const term = query.trim();
        if (!term || term.length > 128 || term.includes("\0")) throw new Error("Invalid search query");
        const rows = candidates.all(scope.orgId, scope.colonyId, MAX_CANDIDATES + 1);
        const bounded = rows.slice(0, MAX_CANDIDATES);
        let matches: FixtureNote[];
        if (fts) {
          matches = db.transaction(() => {
            db.exec("DELETE FROM temp.ants_search");
            const index = db.query<never, [number, string]>("INSERT INTO temp.ants_search (rowid, body) VALUES (?, ?)");
            bounded.forEach((note, i) => index.run(i + 1, note.body));
            const phrase = '"' + term.replaceAll('"', '""') + '"';
            const hits = db.query<{ rowid: number }, [string, number]>(
              "SELECT rowid FROM temp.ants_search WHERE ants_search MATCH ? ORDER BY rowid LIMIT ?",
            ).all(phrase, MAX_RESULTS + 1);
            return hits.map(({ rowid }) => {
              const note = bounded[rowid - 1];
              if (!note) throw new Error("Fixture search index mismatch");
              return note;
            });
          })();
        } else {
          const needle = term.toLowerCase();
          matches = bounded.filter((note) => note.body.toLowerCase().includes(needle));
        }
        return {
          method: fts ? "fts5" : "lexical",
          notes: matches.slice(0, MAX_RESULTS),
          truncated: rows.length > MAX_CANDIDATES || matches.length > MAX_RESULTS,
        };
      },
      close() { db.close(); },
    };
  } catch (error) {
    db.close();
    throw error;
  }
}
