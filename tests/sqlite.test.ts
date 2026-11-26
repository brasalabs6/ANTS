import { expect, test } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { migrate, migrations, openFixtureDatabase, openFixtureStore } from "@ants/storage-sqlite";

const scope = { orgId: "00000000-0000-4000-8000-000000000001", colonyId: "00000000-0000-4000-8000-000000000002" };
const other = { ...scope, orgId: "00000000-0000-4000-8000-000000000004" };
const note = { id: "00000000-0000-4000-8000-000000000003", body: "ANTS foundation fixture", createdAtMs: 1 };

function temporaryDb(fn: (filename: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), "ants-db-"));
  try { fn(join(dir, "fixture.db")); } finally { rmSync(dir, { recursive: true, force: true }); }
}
test("real SQLite persists, scopes search, uses FTS and bounded lexical fallback", () => temporaryDb((filename) => {
  const writer = openFixtureStore(filename);
  try {
    writer.createColony(scope);
    writer.createColony(other);
    writer.insert(scope, note);
    writer.insert(other, { ...note, body: "foundation private" });
    expect(() => writer.insert({ ...scope, colonyId: other.orgId }, note)).toThrow();
    expect(() => writer.insert(scope, note)).toThrow();
    expect(() => writer.search(scope, "")).toThrow();
  } finally { writer.close(); }
  const reader = openFixtureStore(filename);
  try {
    const result = reader.search(scope, "foundation");
    expect(result.method).toBe("fts5");
    expect(result.notes).toEqual([note]);
    expect(reader.search(scope, 'foundation" OR "private').notes).toEqual([]);
  } finally { reader.close(); }
  const fallback = openFixtureStore(filename, { forceLexical: true });
  try {
    expect(fallback.search(scope, "FOUNDATION")).toEqual({ method: "lexical", notes: [note], truncated: false });
    for (let i = 0; i < 201; i++) {
      fallback.insert(scope, { ...note, id: "10000000-0000-4000-8000-" + i.toString(16).padStart(12, "0") });
    }
    expect(fallback.search(scope, "foundation").notes).toHaveLength(20);
    expect(fallback.search(scope, "foundation").truncated).toBe(true);
  } finally { fallback.close(); }
}));
test("fresh migration, no-op, upgrade and changed checksum rejection", () => temporaryDb((filename) => {
  const db = openFixtureDatabase(filename);
  try {
    expect(migrate(db, migrations.slice(0, 1))).toBe(1);
    db.query("INSERT INTO fixture_colonies VALUES (?, ?)").run(scope.orgId, scope.colonyId);
    db.query("INSERT INTO fixture_notes VALUES (?, ?, ?, ?)").run(scope.orgId, scope.colonyId, note.id, note.body);
    expect(migrate(db)).toBe(1);
    expect(migrate(db)).toBe(0);
    expect(db.query("SELECT created_at_ms FROM fixture_notes").get()).toEqual({ created_at_ms: 0 });
    expect(() => migrate(db, [{ version: 1, sql: "SELECT 1" }, ...migrations.slice(1)])).toThrow("Migration history mismatch");
    expect(() => migrate(db, migrations.slice(0, 1))).toThrow("Migration history mismatch");
    expect(() => migrate(db, [{ version: 2, sql: "SELECT 1" }])).toThrow("Invalid migration sequence");
  } finally { db.close(); }
}));
test("failed migration and transaction roll back; competing writer is rejected", () => temporaryDb((filename) => {
  const db = openFixtureDatabase(filename, 20);
  const competitor = openFixtureDatabase(filename, 20);
  try {
    expect(migrate(db)).toBe(2);
    expect(() => migrate(db, [...migrations, { version: 3, sql: "CREATE TABLE doomed (id INTEGER); INVALID SQL;" }])).toThrow();
    expect(db.query("SELECT name FROM sqlite_master WHERE name = 'doomed'").get()).toBeNull();
    expect(db.query("SELECT count(*) AS count FROM schema_migrations").get()).toEqual({ count: 2 });
    expect(() => db.transaction(() => {
      db.query("INSERT INTO fixture_colonies VALUES (?, ?)").run(scope.orgId, scope.colonyId);
      throw new Error("injected");
    }).immediate()).toThrow("injected");
    expect(db.query("SELECT count(*) AS count FROM fixture_colonies").get()).toEqual({ count: 0 });
    db.exec("BEGIN IMMEDIATE");
    try { expect(() => migrate(competitor)).toThrow(/locked|busy/i); } finally { db.exec("ROLLBACK"); }
    expect(migrate(competitor)).toBe(0);
  } finally { competitor.close(); db.close(); }
}));
