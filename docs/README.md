# Engineering handbook

> **Current baseline v0.7:** [project context](21-project-context.md), [cross-module execution contracts](22-execution-contracts.md), [requirements traceability](23-requirements.md), [development handoff](24-handoff.md), [canonical roadmap](12-roadmap.md), [ADR-017](adr/017-consolidated-specification.md). All active topic specs below form one baseline; historical versions remain in Git.

All specifications are design-stage proposals, consolidated 2026-11-24. No runtime implemented. RFCs change through review; no scale or security claim has been validated in production.

| Document | Scope |
|---|---|
| [01 Product](01-product.md) | Vision, users, scope, UX, growth |
| [02 Architecture](02-architecture.md) | Components, monorepo, boundaries |
| [03 Domain & data](03-domain.md) | Models, relationships, invariants |
| [04 Swarm protocol](04-swarm.md) | Discovery, task claims, signals, continuity |
| [05 API & MCP](05-api.md) | Contracts, errors, event streams, tools |
| [06 Security](06-security.md) | Trust boundaries, isolation, pause, threat model |
| [07 Memory](07-memory.md) | Provenance, retrieval, compaction |
| [08 Frontend](08-frontend.md) | Vite frontend UX and state architecture |
| [09 SaaS](09-saas.md) | Tenancy, quotas, pricing, billing |
| [10 Deployment & scale](10-operations.md) | Infra, SLO, backups, migration |
| [11 Testing & experiments](11-testing.md) | Correctness, benchmarks, continuity |
| [12 Roadmap](12-roadmap.md) | Backlog, milestones, acceptance |
| [13 CLI-first](13-cli-first.md) | Agent onboarding, local/remote client and distribution |
| [14 Pulse](14-pulse.md) | Authorized agent session scheduling |
| [15 Portable architecture](15-portable-architecture.md) | Bun/SQLite and deployment boundaries |
| [16 Client/server & research](16-colony-client-and-research.md) | Client-only joins, operator model, experiments and capability transfer |
| [17 Goal Engine](17-goal-engine.md) | Proactive collective goals, verification, reconciliation and stop conditions |
| [18 Command Center](18-command-center.md) | Operator dashboard, plans, Kanban, sessions and human control |
| [19 Guardrails & approvals](19-guardrails-and-approvals.md) | Enforced policy, scoped approvals and audit |
| [20 Intents & agent roles](20-intents-and-agent-roles.md) | Exploratory directions, specialized roles, functional hierarchy and evidence lineage |
| [21 Project context](21-project-context.md) | Full product thesis, history, decisions and relationship to Plane |
| [22 Execution contracts](22-execution-contracts.md) | Cross-module vocabulary, lifecycle, consistency and failure semantics |
| [23 Requirements](23-requirements.md) | Stable requirements and release acceptance traceability |
| [24 Handoff](24-handoff.md) | Current state, open decisions, next steps and checkpoint format |
| [25 Implementation contract](25-implementation-contract.md) | Mandatory engineering process, invariants, test/review/integration gates |
| [Engineering backlog](backlog/README.md) | Seven epics, 90 numbered implementation items |
| [Implementation evidence](implementation/README.md) | Per-item checkpoints and verified acceptance |
| [Research](research/README.md) | Literature and evidence |
| [ADRs](adr/README.md) | Decisions and alternatives |
| [Contract examples](specs/README.md) | Initial OpenAPI and event JSON Schema |
