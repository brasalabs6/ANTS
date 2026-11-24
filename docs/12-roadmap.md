# 12 — Canonical implementation roadmap (v0.7)

> **Active v0.7 baseline:** [project context](21-project-context.md), [cross-module contracts](22-execution-contracts.md) and [requirements](23-requirements.md). This document describes current design, not shipped functionality.

No delivery dates promised. All milestones below are planned, not complete. Documentation foundation exists; no runnable source or CI yet. [23 requirements](23-requirements.md) lists acceptance evidence by ID; [24 handoff](24-handoff.md) lists pending decisions. R01–R09 replace old F01–F13 as active issue IDs.

| ID | Deliverable | Exit condition | Depends on |
|---|---|---|---|
| R01 | Strict TS workspace, Bun compile spike, CLI help/version/JSON, SQLite migration/FTS, basic CI | clean Linux binary smoke, no Node/Bun install, actual compatibility report; resolve workspace/test tooling | — |
| R02 | local host/bootstrap, constitution revision, mission/goal lifecycle, scope and policy foundations | persisted goal criteria/limits, operator control and unauthorized/stale writes denied | R01 |
| R03 | versioned HTTP/CLI client-only join, named profiles, role/session registry, board/event cursor, bounded context | distinct clients share one host, no client DB/listener, auth isolation and replay tests | R02 |
| R04 | revisioned plans/ExplorationIntent, task DAG, lease/fence, artifacts/checkpoints, independent review; start Vite views | concurrency/expiry/stale plan tests, worker and planner handoff, verified evidence, Kanban projection | R03 |
| R05 | export/import/restore, restart reconciliation, binary checksums and security test infrastructure | clean backup restore, tamper rejection, disabled runners on import, documented limits | R04 |
| R06 | Goal Engine, role-aware mock Pulse, deterministic policy/approval gateway, dashboard controls | proactive planning/work/verification with failed first check; approval/denial, budget, stop/race tests | R04–05 |
| R07 | public CLI-first alpha with Command Center, Kanban, goals/plans/intents, swarm, approvals, guardrails, Pulse, activity | full release scenario below; reproducible docs and research report, no browser dependency at runtime | R06 |
| R08 | hosted PostgreSQL adapter, tenant RLS, quotas/billing, metering, observability, horizontal scaling | parity/isolation/load/restore/abuse tests, operator review; no unvalidated real unattended runner | R07 |
| R09 | evidence transfer to Plane, optional federation/interoperability and graph enhancements | reproducible capability assessment and separate review | R01–08 evidence |

MCP/SDK optional after core usability, not R07 dependency. Real Codex/Claude or other unattended adapters require sandbox, enforcement and security validation, not just completion of mock Pulse. UI framework selected before R04 scaffolding via ADR; Vite fixed. Embedded UI preferred if packaging works, separate static bundle fallback. Cloud Compose optional, not local prerequisite. R01 is next; no need to build full SaaS before proving core.

## First public demo — The Immortal Colony

Use benign synthetic CSV-to-JSON CLI or seeded toy bug with approved fixtures, budget and deterministic agents. Human starts Goal once. Planner proposes plan/intents; two workers claim independent tasks. One publishes checkpoint and exits; fresh worker resumes, with all initial sessions replaced at controlled boundary. Review first candidate, fail one required test; empty queue triggers gap analysis, new plan/repair and another session without additional human continuation. Operator sees progress in Command Center, rejects a mock action and approves an exact distinct action; unrelated allowed work continues. Pause invalidates stale writes and stops managed dispatch, then authorized resume. Final approved verifier confirms required criteria on candidate hash; Goal succeeds and dispatch ends. Browser closed at an intermediate point, reconnect and audit. Compare against no-memory/passive-board and single-agent baseline at equal limits. Publish actual results, not mock data as measured claims. Alternative latency benchmark tests refuted Intents.

## Definition of done

Scoped issue with PR IDs, dependency and acceptance criteria; implementation, unit/integration/contract/E2E evidence as applicable, docs and schema updates, migration/rollback, telemetry, security review, negative tests, reproducible checkpoint and independent review. Do not declare shipped until verified. Update actual milestone status in [24](24-handoff.md). Normal contributors use branches/PR; direct main requires explicit maintainer authorization.

## Legacy roadmap crosswalk (history, not a second backlog)

F01 -> R01; F02 (Postgres/RLS) -> local scope R02/R03 and hosted R08; F03 -> R02; F04/F06 -> R04; F05 -> R03; F07 -> R03 CLI/HTTP, MCP/SDK later; F08 -> R04/R06/R07; F09 -> R02/R06/R08; F10 -> R05/R07, cloud Compose R08; F11 -> R03/R07 research; F12 -> R08; F13 -> mock R06, real managed runner after security gate. Preserve original phase intent (design review, local alpha, OSS/self-host launch, hosted beta, measured scaling) without treating old PostgreSQL-first or MCP-required choices as active. Backlog is documentation; no GitHub issue creation claimed.
