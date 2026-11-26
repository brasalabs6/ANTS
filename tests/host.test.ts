import { Database } from "bun:sqlite";
import { expect, test } from "bun:test";
import { chmodSync, existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { bootstrapHost, openHostReader } from "@ants/storage-sqlite";
import { readColony } from "../packages/application/src/host";

function temporary(fn: (dir: string) => void): void {
  const dir = mkdtempSync(join(tmpdir(), "ants-host-"));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("host identity persists; credential and exact scope are required", () => temporary((dir) => {
  const path = join(dir, "first");
  const first = bootstrapHost(path, "Colony A");
  const other = bootstrapHost(join(dir, "second"), "Colony B");
  const reader = openHostReader(path);
  try {
    const { credential, ...identity } = first;
    expect(readColony(reader, credential, first)).toEqual(identity);
    expect(() => readColony(reader, other.credential, first)).toThrow("Access denied");
    expect(() => readColony(reader, credential, other)).toThrow("Access denied");
    expect(() => readColony(reader, credential, { ...first, colonyId: other.colonyId })).toThrow("Access denied");
    expect(() => readColony(reader, credential, { ...first, orgId: other.orgId })).toThrow("Access denied");
    expect(() => readColony(reader, "", first)).toThrow("Access denied");
    expect(() => readColony(reader, credential, null)).toThrow("Access denied");
  } finally {
    reader.close();
  }
  const reopened = openHostReader(path);
  try {
    expect(readColony(reopened, first.credential, first).ownerId).toBe(first.ownerId);
  } finally {
    reopened.close();
  }
  expect(readFileSync(join(path, "host.sqlite")).includes(first.credential)).toBe(false);
  const db = new Database(join(path, "host.sqlite"), { readonly: true });
  try {
    expect(db.query("SELECT count(*) AS n FROM host_events").get()).toEqual({ n: 1 });
    expect(db.query("SELECT count(*) AS n FROM host_audit").get()).toEqual({ n: 1 });
    expect(db.query("SELECT count(*) AS n FROM host_outbox").get()).toEqual({ n: 1 });
  } finally {
    db.close();
  }
}));

test("bootstrap rejects existing state and invalid inputs without modifying them", () => temporary((dir) => {
  const marker = join(dir, "keep.txt");
  writeFileSync(marker, "unrelated");
  expect(() => bootstrapHost(dir, "Colony")).toThrow();
  expect(readFileSync(marker, "utf8")).toBe("unrelated");
  const path = join(dir, "new");
  expect(() => bootstrapHost(path, "bad\nname")).toThrow("Invalid colony name");
  expect(existsSync(path)).toBe(false);
  expect(() => openHostReader(path)).toThrow();
  expect(existsSync(path)).toBe(false);
  bootstrapHost(path, "Colony");
  expect(() => bootstrapHost(path, "replacement")).toThrow();
  const link = join(dir, "link");
  symlinkSync(path, link);
  expect(() => openHostReader(link)).toThrow("Unsafe host directory");
  chmodSync(path, 0o755);
  expect(() => openHostReader(path)).toThrow("Unsafe host directory");
  chmodSync(path, 0o700);
}));

test("host composite foreign key prevents orphan and cross-organization ownership", () => temporary((dir) => {
  const path = join(dir, "host");
  const first = bootstrapHost(path, "Colony");
  const db = new Database(join(path, "host.sqlite"));
  try {
    db.exec("PRAGMA foreign_keys = ON");
    expect(() => db.transaction(() => {
      db.query("INSERT INTO organizations VALUES (?, ?)").run("other", "Other");
      db.query("INSERT INTO host_owners VALUES (?, ?, ?, ?)").run("other", first.colonyId, "fake", "a".repeat(64));
    }).immediate()).toThrow();
    expect(db.query("SELECT count(*) AS n FROM organizations").get()).toEqual({ n: 1 });
  } finally {
    db.close();
  }
}));
