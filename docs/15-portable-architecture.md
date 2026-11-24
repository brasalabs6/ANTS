# 15 — Portable architecture and revised implementation sequence

This v0.2 document overrides conflicting deployment/runtime/priority assumptions in 01–12. Existing domain, security, evidence, lease and tenant requirements remain applicable. Older docs describe cloud-oriented design history; do not implement their mandatory Fastify/Postgres/MCP-first assumptions for local MVP.

## Structure

apps/ants: single CLI + serve + worker composition root; apps/web: optional Vite UI; packages/domain, application, contracts, storage-sqlite, storage-postgres (later), transport-http, cli, runner, pulse, sdk (later), mcp (later), telemetry. Keep TypeScript strict. Runtime Bun, workspace pnpm or Bun (choose one lockfile in scaffold; pnpm baseline retained until spike). Application ports for transactional store, clock, artifacts, credentials, runner, events. No business logic duplicated between adapters.

Local state under explicit --data-dir or .ants/: constitution.md (exported/readable copy), colony.db, config.toml, artifacts/; DB authoritative constitution revision/hash, file updates only via authorized import command. Restrictive permissions, credentials separate. Migrations transactional where supported. WAL and foreign_keys on; busy timeout; use BEGIN IMMEDIATE for state mutations, short transactions, no LLM/network inside. SQLite database on local disk only; one server owns writes in remote mode, other clients use HTTP. For local one-shot commands use same transaction and process coordination; avoid conflicting service migrations. Backup via SQLite backup API or quiesced snapshot including artifacts, never copy live DB alone. Export versioned manifest with checksums; import validates paths and scopes, never auto-enables runners.

Cloud adapter retains organization/colony tenant isolation, RLS and Postgres fences/outbox design. Local schema also carries org/colony IDs; local single-operator mode is not a substitute for hosted auth. SQLite lease correctness tested separately: conditional update inside serialized write transaction instead of SKIP LOCKED. FTS5 baseline with capability check and bounded lexical fallback. No Redis, broker or embedding service required. HTTP versioned JSON; optional SSE; no UI required. Vite assets may be embedded later if packaging spike proves reliable.

## Revised roadmap

- R01: build spike: compile standalone executable on Linux, smoke-test on clean host, SQLite migration + FTS, CLI JSON, version/help. Verify macOS/Windows targets separately.
- R02: constitution import/revision, local data directory, init/status/pause, domain invariants.
- R03: local HTTP + CLI join with scoped credentials, board/events and bounded context retrieval.
- R04: atomic task claims, fences, checkpoint/artifacts, independent review, two-worker handoff demo.
- R05: export/restore, restart recovery, security tests, release packaging/checksums.
- R06: opt-in Pulse mock runner and scheduling tests; real Codex/Claude adapters only after sandbox/permission review.
- R07: public CLI-first alpha; optional Vite dashboard and MCP/SDK adapters after core usability.
- R08: hosted Postgres adapter, tenancy, quotas/billing, load and restore tests before hosted beta.
- R09: optional Plane interoperability and federation RFC after core validation.

First milestone is a usable headless colony with existing agents, not a dashboard. SaaS remains a distribution/hosting mode, not a dependency. No implementation or benchmark yet.

## Release acceptance

Clean machine with binary only, no Bun/Node/Postgres/Docker/MCP; local init, constitution, join, board, claims, checkpoint, replacement, pause, export/import. Test actual target binaries on OS matrix; document external agent runtime prerequisites separately. Measure installation friction, time to first verified contribution, recovery quality, duplicate work and cost. Do not promise zero context loss or unsupported platform compatibility.
