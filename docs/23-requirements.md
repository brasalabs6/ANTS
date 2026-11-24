# 23 — Requirements and traceability matrix

Status: v0.7 design baseline. MUST = release requirement for indicated stage, SHOULD = preferred unless documented ADR, MAY = optional. All rows remain unimplemented/unverified until linked evidence says otherwise. Local technical milestone is not public alpha. R identifiers refer to [12](12-roadmap.md); G = release gate. No claim of completion from documentation alone.

| ID | Requirement / acceptance evidence | Stage | Specification |
|---|---|---|---|
| PR-01 | OSS MIT, independent product, BYO agent; public docs and license | R01/G | [01](01-product.md), [21](21-project-context.md) |
| PR-02 | TypeScript Bun standalone build on clean Linux without runtime installs; OS matrix actual tests | R01 | [15](15-portable-architecture.md) |
| PR-03 | SQLite local, no Postgres/Docker/embedding/MCP required; migration + FTS test | R01–02 | [15](15-portable-architecture.md) |
| PR-04 | Constitution revision/hash; only operator changes authority; deny stale revision | R02 | [17](17-goal-engine.md), [19](19-guardrails-and-approvals.md) |
| PR-05 | Goal activation, explicit acceptance criteria and bounded resource policy; one pursued goal per mission | R02 | [17](17-goal-engine.md) |
| PR-06 | Existing agents join local or remote host via CLI/HTTP with no DB or listening socket | R03 | [13](13-cli-first.md), [16](16-colony-client-and-research.md) |
| PR-07 | Named profiles, scoped token, TLS remote, no fallback; revoke and cross-profile tests | R03 | [16](16-colony-client-and-research.md) |
| PR-08 | Typed asynchronous board, threads, event cursor, source links, negative results; no direct conversation dependency | R03 | [04](04-swarm.md), [07](07-memory.md) |
| PR-09 | Context packet with provenance, bounded search, freshness and failed attempts; worker replacement test | R03–04 | [07](07-memory.md), [22](22-execution-contracts.md) |
| PR-10 | Distinct roles/identities/sessions/capabilities; Planner, Worker, independent Reviewer; role spoof rejected | R03–04 | [20](20-intents-and-agent-roles.md) |
| PR-11 | Plan revisions and alternative proposals; ExplorationIntent with outcome, lineage and scoped limits; stale admission rejected | R04 | [18](18-command-center.md), [20](20-intents-and-agent-roles.md) |
| PR-12 | Task DAG, atomic claims, fences, expiry; concurrency race and cycle rejection | R04 | [03](03-domain.md), [04](04-swarm.md) |
| PR-13 | Checkpoint, artifact hash, independent review, stale evidence invalidation; no self-review | R04 | [07](07-memory.md), [17](17-goal-engine.md) |
| PR-14 | Export/import/restart restores state, no runner auto-enable; tampered manifest rejected | R05 | [10](10-operations.md), [15](15-portable-architecture.md) |
| PR-15 | Durable Goal Engine reconciles empty queue and failed tests, continues without extra human prompts | R06/G | [17](17-goal-engine.md) |
| PR-16 | Pulse event/interval/manual scheduling with explicit authorization, role matching, bounded attempts and no duplicate effective action | R06/G | [14](14-pulse.md) |
| PR-17 | Deterministic allow/ask/deny, exact one-use approval, expiry/revocation/race tests, no privilege expansion | R06/G | [19](19-guardrails-and-approvals.md) |
| PR-18 | Human pause/resume/cancel, budget/deadline limits, no dispatch after stop, honest external-run boundary | R02–06/G | [06](06-security.md), [22](22-execution-contracts.md) |
| PR-19 | Vite operator dashboard with goal, plan, intent, Kanban/list, swarm, board, memory, approvals, guardrails, Pulse and activity; CLI parity | R04–07/G | [08](08-frontend.md), [18](18-command-center.md) |
| PR-20 | Browser closed yet authorized goal continues; SSE reconnect/snapshot and stale decisions tested | R07/G | [18](18-command-center.md) |
| PR-21 | End-to-end demo: replace all sessions, fail verification, replan, approve/deny mock action, verify success; no hidden prompt | R07/G | [11](11-testing.md), [17](17-goal-engine.md) |
| PR-22 | Release binaries/checksums, security contact, quickstart, accessible UI, reproducible benchmark and documented limits | R07/G | [10](10-operations.md), [13](13-cli-first.md) |
| PR-23 | Optional MCP/SDK adapter parity; not a CLI/runtime dependency | after core usability | [05](05-api.md) |
| PR-24 | Hosted Postgres tenant isolation, metering, quota, backup/restore/load and abuse readiness | R08 | [09](09-saas.md), [10](10-operations.md) |
| PR-25 | Real unattended model runners only after sandbox and approval enforcement validated | after security gate | [14](14-pulse.md), [19](19-guardrails-and-approvals.md) |
| PR-26 | Research results and negative evidence transferable to Plane, no automatic dependency | R01–09 | [16](16-colony-client-and-research.md), [research](research/README.md) |
| PR-27 | Extensible modular contracts; local/cloud adapter parity; no forced microservices | R01–08 | [02](02-architecture.md) |
| PR-28 | Optional graph visual/timeline, federation, public snapshots, cosmetic themes, custom roles | later | [18](18-command-center.md), [20](20-intents-and-agent-roles.md), [21](21-project-context.md) |

## Decision and acceptance discipline

Each implementation issue references PR IDs, R milestone, relevant ADRs, allowed scope, dependencies, expected observable result and negative tests. Evidence: exact commit, command and output summary, artifact hashes when relevant, environment, known failures, independent review. Update matrix status only with reproducible evidence, not an agent's self-report. Do not quietly reduce criteria to pass. If a requirement cannot be satisfied, record blocker and propose revised scope for human approval. No unapproved feature expansion. For research compare under matched budgets; distinguish simulated and measured results.
