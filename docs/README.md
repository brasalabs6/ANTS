# Engineering handbook

> **Current baseline v0.4:** [Persistent goals](17-goal-engine.md), [ADR-014](adr/014-persistent-collective-goals.md), [CLI-first product](13-cli-first.md), [Pulse](14-pulse.md), [portable architecture](15-portable-architecture.md), [client/server and research strategy](16-colony-client-and-research.md), [ADR-012](adr/012-portable-mission-runtime.md), [ADR-013](adr/013-client-server-and-research.md). These supersede conflicting v0.1 choices; older specs retained for cloud design and domain requirements.

All specifications are proposed v0.1, dated 2026-11-24. RFCs change through review; no scale or security claim has been validated in production.

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
| [16 Client/server & research](16-colony-client-and-research.md) | Client-only joins, operator model, experiments and capability transfer |
| [17 Goal Engine](17-goal-engine.md) | Proactive collective goals, verification, reconciliation and stop conditions |
| [Research](research/README.md) | Literature and evidence |
| [ADRs](adr/README.md) | Decisions and alternatives |
| [Contract examples](specs/README.md) | Initial OpenAPI and event JSON Schema |
