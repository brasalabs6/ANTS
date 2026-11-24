# Architecture decision records

> Current decisions: [ADR-012 — Portable mission runtime](012-portable-mission-runtime.md) and [ADR-013 — Agent-first client/server and research boundary](013-client-server-and-research.md). ADR-013 clarifies CLI client, server and runner roles; no required local hosting or Plane dependency.

[ADR-014 — Persistent collective goals](014-persistent-collective-goals.md) establishes proactive goal pursuit and evidence-based completion as first-class MVP requirements.

[ADR-015 — Human operator control plane](015-operator-control-plane.md) requires a usable dashboard and enforced approvals for public alpha.

[ADR-016 — Exploration intents and replaceable roles](016-exploration-intents-and-roles.md) adds functional specialization without permanent centralized command.

[ADR-017 — Consolidated specification](017-consolidated-specification.md) establishes the v0.7 baseline and continuity discipline.

Proposed decisions; review before coding. Record new ADRs rather than silently changing old ones.

| ID | Decision | Alternatives and tradeoffs |
|---|---|---|
| ADR-001 | Historical: TypeScript + Vue 3 (superseded by ADR-011; Vue not selected) | initial proposal; Python agents still integrate via protocol |
| ADR-002 | modular monolith + separate worker | microservices add ops and consistency cost; extract based on data |
| ADR-003 | SQLite local / Postgres cloud authoritative, transactional outbox (ADR-012) | broker-first/event sourcing adds operational/replay complexity; projections rebuildable |
| ADR-004 | decentralized pull + fenced lease | central LLM supervisor not necessary; contention/fairness need explicit policies |
| ADR-005 | CLI + HTTP first; optional MCP/SDK (ADR-013) | direct provider framework coupling limits adoption; maintain versioned contract |
| ADR-006 | org-scoped RLS + application authorization | database per tenant stronger isolation at greater cost; optional later |
| ADR-007 | MIT core | lower adoption friction; AGPL would require network-use source disclosure, business tradeoff revisit before release only |
| ADR-008 | BYO agent first | managed real execution deferred until security readiness; mock Pulse required for alpha |
| ADR-009 | private by default | public swarm discovery improves network effects but introduces moderation and data leakage |
| ADR-010 | human mission control | emergent task selection allowed, no autonomous permission expansion or mission mutation |

| ADR-011 | Vite + TypeScript frontend required for alpha; UI framework pending (ADR-015) | user correction supersedes ADR-001 frontend choice; Vite does not select a rendering framework |

Acceptance: owner reviews changes with security, operational and compatibility implications; record date, status, context, alternatives, consequences and rollback strategy in separate ADR when implementation starts.
