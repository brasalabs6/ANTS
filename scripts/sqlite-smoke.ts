import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openFixtureStore } from "@ants/storage-sqlite";

const dir = mkdtempSync(join(tmpdir(), "ants-sqlite-smoke-"));
const filename = join(dir, "fixture.db");
const scope = { orgId: "00000000-0000-4000-8000-000000000001", colonyId: "00000000-0000-4000-8000-000000000002" };
const note = { id: "00000000-0000-4000-8000-000000000003", body: "ANTS foundation fixture", createdAtMs: 1 };
try {
  const writer = openFixtureStore(filename);
  try { writer.createColony(scope); writer.insert(scope, note); } finally { writer.close(); }
  const reader = openFixtureStore(filename);
  try {
    const result = reader.search(scope, "foundation");
    if (result.notes.length !== 1 || result.notes[0]?.id !== note.id || result.truncated) throw new Error("Fixture persistence failed");
    console.log(JSON.stringify({ ok: true, sqlite: result.method, persisted: true }));
  } finally { reader.close(); }
} finally { rmSync(dir, { recursive: true, force: true }); }
