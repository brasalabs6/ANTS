# 24 — Development handoff and open decisions

Status at v0.7 consolidation (2026-11-24): documentation-only repository. No runnable application, dependency lockfile, schema migrations, tests, CLI binary, dashboard, live SaaS, benchmarks or deployment. The remote Git repository brasalabs6/ANTS, main, is source of truth. Earlier local bundles are historical. This document intentionally does not record private conversations or credentials.

## Start a new session

1. Read root README, AGENTS.md, [25 mandatory implementation contract](25-implementation-contract.md), [90-item backlog](backlog/README.md), [implementation evidence](implementation/README.md), [21 project context](21-project-context.md), [22 cross-module contracts](22-execution-contracts.md), [23 requirements](23-requirements.md), [12 roadmap](12-roadmap.md) and [ADR index](adr/README.md).
2. Read relevant numbered specification and current contract examples. Verify actual Git HEAD and working tree; do not assume docs are code. Search open issues/PRs before claiming work. Record any contradiction as a proposed fix rather than silently selecting old behavior.
3. If asked to begin implementation, start R01: minimal strict TypeScript workspace with Bun CLI, compile spike, SQLite migration/FTS, clean-host test, basic CI and test strategy. Resolve only decisions necessary for the slice; don't scaffold the full SaaS first. No external service creation or paid model call implied.
4. Work on a scoped branch/PR unless authorized to commit directly to main (the owner authorized direct main updates for this documentation workflow; that is not blanket permission for outside contributors or deployment). Test, record evidence, update docs/contracts and checkpoint. Never overwrite concurrent work. Stop on missing authority or blocked assumptions.

## Open decisions (do not treat these as user choices)

| ID | Question | Current direction / resolution gate |
|---|---|---|
| O01 | Bun standalone reliability, binary size, cross-platform and FTS5 | R01 spike, test clean hosts; no claimed support until verified |
| O02 | pnpm vs Bun workspaces; exact dependencies and CI | pnpm/Turborepo historical baseline, choose one lockfile in R01 with ADR |
| O03 | UI framework, routing, cache, components | Vite + TS fixed; React was suggested, not selected; decide before UI scaffolding |
| O04 | Embedded static web assets vs separate bundle | prefer one binary if packaging succeeds; fallback allowed, dashboard still required for alpha |
| O05 | SQLite adapter/schema tooling, IDs/time types | SQLite local chosen; evaluate typed SQL/migrations; Drizzle candidate, not mandate |
| O06 | Auth bootstrap, token exchange, rotation, session TTL and local OS keychain | scoped profiles and operator auth required; finalize contract and tests in R02–03 |
| O07 | Exact REST payloads, event schemas, CLI exits and compatibility | current examples draft, expand slice by slice before v1 stability |
| O08 | Lease renewal caps, context limits, retry and fairness tuning | baseline suggestions in 22; tune with tests, require explicit unattended limits |
| O09 | Real runner provider adapters / isolation | verify versions and sandbox/gateway first; mock runner in CI, no unattended release before security gate |
| O10 | Artifact merge and verifier strategies for concurrent code edits | isolated branches/workspaces, immutable hashes, review; pick adapter and test conflict recovery |
| O11 | Hosted provider/region/billing/prices/SLO/scale | no provider or price chosen; measured cloud targets only, R08 |
| O12 | Plane transfer implementation | functional superset goal, no forced library/DB dependency; review evidence and private architecture separately |
| O13 | License/brand | MIT committed, AGPL alternative not adopted; trademark/domain clearance pending, no unilateral license change |
| O14 | Research provenance / links | references carried from earlier research, verify titles/authors/URLs before public claims; no repo code copied |
| O15 | Graph UI, custom roles, multi-goal/federation | later, model preserves lineage; no scope creep in MVP |
| O16 | Security contact, release signing and distribution | maintainer configure private reporting and signing; verify actual setting before claiming enabled |

## Checkpoint format for development contributors

Use a committed note or issue/PR update: date, HEAD SHA, milestone/requirement IDs, objective, completed changes with paths, decisions and rationale, actual test commands/results, artifacts, failures and risks, remaining tasks/dependencies, next safe step, explicit blockers/owner decisions needed. Preserve earlier evidence and negative attempts. No secrets, raw private conversations, model private reasoning or invented measurements. Update the roadmap and requirement status only when verified. This mirrors the product's own continuity principles.

## Audit boundary

v0.7 consolidates the full prior specification set and conversation decisions; it does not prove the runtime, packaging, security or scalability. External literature and historical incidents are context, not audited implementations. Exact endpoint schemas, production migrations, framework and runner isolation remain engineering work. Keep [21](21-project-context.md) current when product direction changes, [23](23-requirements.md) for traceability, and this file for the actual handoff. The previous baseline commit was 5d227751ef70168ed4ed5bd34fcf2df2a4b3312e. Git history retains pre-consolidation versions.


## Consolidation audit evidence

Audit input commit: 5d227751ef70168ed4ed5bd34fcf2df2a4b3312e (41 files). Reviewed all tracked text files and reconciled original SaaS-first assumptions against v0.2–v0.6 decisions. Consolidated content verified at 498ca627a39a781361d0423f0cb67539d9101b5b (51 files, 43 Markdown); all 51 fetched again from remote, 268 relative Markdown link occurrences checked against tracked paths, no missing targets. Four JSON files parsed. OpenAPI YAML corruption introduced during editing was detected, corrected and re-fetched at 5fa5cd9e81affaa3f721eff6b814dfed8d613bb9; YAML parsed without duplicate keys, 4 paths, 26 internal references resolved, all path parameter declarations matched. Issue-template YAML parsed; event envelope passed JSON Schema Draft 2020-12 metaschema check. These are document/structure checks, not full OpenAPI conformance, executable contract tests, external link verification or proof of product correctness. No runtime tests possible yet. The final audit notes append only explanatory text and do not change the machine contracts. External source metadata/availability, full endpoint and payload contracts, packaging, UI framework and security enforcement remain open. Use the requirement matrix and R01 next step, not a prior conversation.

## Implementation contract adoption

IC v1.0 in [25](25-implementation-contract.md) establishes mandatory scoped ownership, quality, test evidence, independent review and integration/handoff requirements. [Backlog](backlog/README.md) contains 90 unique IDs: 72 alpha and 18 post-alpha. Use [checkpoint template](implementation/checkpoint-template.md) for per-item records. At adoption, implementation remains unstarted, R01 next once authorized; GitHub issue list was empty at the preceding read, so do not infer issues from draft documents. No stack choices resolved by this process change. Direct main documentation authorization is not blanket permission for code, release or deployment. Verify actual state at the next session.

## R01 candidate handoff — 2026-11-26

Branch feat/r01-01-foundation contains code candidate bfd6af1fa02688cc6c2b9d353dfade42685141c9, locally tested, not integrated. Eight per-item checkpoints record evidence. Six items awaiting independent review; R01.04 and R01.08 have incomplete acceptance. O01/O02/O04/O05 and CLI subset of O07 provisionally addressed by [ADR-018](adr/018-foundation-toolchain.md); no final approval claimed. Current main remains documentation baseline. Next: open PR, check CI and clean Linux run, repeat final lock tests, independent review, authorized integration; do not start dependent R02 until gate passes. No PR number confirmed at this read.

## Autonomous development handoff — 2026-11-26

Maintainer delegated ongoing engineering across R01–R09; [ADR-019](adr/019-autonomous-engineering.md) and IC v1.1 supersede earlier review-wait language for development. PR #1 merged at 74ff8f1bfe95defd8cbd42c34841597e97276699 with documented external-review exception. Post-merge fresh Linux x86-64 checkout: frozen install, root check, 10/10 tests (65 assertions), negative harness, compiled CLI with exact merge revision, SQLite fixture persisted/reopened with FTS5; exit 0. Earlier clean Linux CI passed. No external reviewer response; no independent approval claimed. R01 accepted for development continuation; R01.05 capability-detection path and R01.08 actual CI failure injection still follow-up evidence, no unsupported platform claim. Next R02.01, [issue #2](https://github.com/brasalabs6/ANTS/issues/2), explicitly allowed as dependent development despite these nonblocking evidence follow-ups. Coordinate secure R02.06 bootstrap before exposing any host command. No runtime release or deployment authorized by this delegation.
