# 12 — Implementation roadmap

> **Supersession notice (v0.2):** [CLI-first product](13-cli-first.md) and [portable architecture / revised roadmap](15-portable-architecture.md) take precedence over conflicting local MVP requirements in this document. Vite UI and MCP are optional; Bun/SQLite single executable first, cloud Postgres later.

No delivery dates promised; sequence by dependencies. Each issue has owner/claim, scope, acceptance tests and review. Use vertical slices, not months of infrastructure-only work.

| ID | Deliverable | Exit condition | Depends on |
|---|---|---|---|
| F01 | pnpm monorepo, TS strict, CI, lint, Vite + TypeScript shell (UI framework decision first) | clean clone builds/tests | — |
| F02 | Postgres migrations + tenant auth/RLS | cross-tenant tests green | F01 |
| F03 | Colony and mission CRUD/lifecycle | authorized state transitions and audit | F02 |
| F04 | Task DAG + claims/fences | concurrency and expiry tests green | F03 |
| F05 | Board + transactional outbox + SSE | replay, typed events, dedup | F03 |
| F06 | Artifact store/checkpoints/results/review | resume and independent validation | F04,F05 |
| F07 | REST/SDK/MCP + CLI | deterministic external agent completes mission | F06 |
| F08 | Vite frontend board, tasks, agents, mission controls | end-to-end human workflow | F03–F07 |
| F09 | Budgets/quotas/revocation | hard caps and pause races tested | F04,F07 |
| F10 | Compose, migrations, docs, backup/export | reproducible self-host smoke test | F08,F09 |
| F11 | Knowledge/FTS and generation evaluation | baseline comparison published | F06,F10 |
| F12 | Hosted beta billing and observability | isolation/load/restore/abuse readiness | F10,F11 |
| F13 | managed runner adapter | security review and sandbox tests | F09,F12 |

Phase 0 design review; Phase 1 alpha with BYO agents; Phase 2 self-host release and public demo; Phase 3 hosted multi-tenant beta; Phase 4 measured scaling, extensions, optional federation RFC. Do not release public hosted agent execution before security review and abuse response procedures.

## First demo

Mission: fix a deliberately seeded bug in a toy project. Worker A claims, investigates and publishes a failing test/checkpoint; terminate A; B reclaims and submits patch; reviewer C reproduces tests and accepts; dashboard shows full trail, costs and mission completion. Repeat with every original session gone. Show human pause rejects stale writes. This demonstrates the product thesis without requiring real-world permissions or expensive models.

## Definition of done

Implementation + tests + docs/contracts + migration/rollback considerations + telemetry + security scope + reviewed PR. No feature claimed shipped until reproducible. Open issues for F01–F13 after remote creation; these are backlog specs, not created GitHub issues yet.
