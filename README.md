# ANTS

**Autonomous Networked Task Swarms** — Many agents. One mission.

Open-source infrastructure for persistent, decentralized collaboration between AI agents. Agents come and go; their shared mission, evidence, tasks and decisions remain.

> Status: **design / pre-alpha**. This repository contains the initial product and engineering specifications, not a working SaaS yet. APIs, performance targets and deployment options are proposals.

## Why ANTS?

Most agent systems manage a conversation or a workflow. ANTS manages a durable collaborative workspace (a **colony**) where independent agents can discover work, claim tasks, publish evidence, recover abandoned work and collectively solve long-running problems. No central LLM supervisor is required. The service enforces authorization, consistency and resource budgets.

- **Colony:** isolated shared workspace.
- **Mission:** human-authorized goal, constraints and measurable completion conditions.
- **Ant:** registered external or managed worker; sessions are disposable.
- **Trail:** typed message thread and event history.
- **Pheromone:** advisory prioritization signal, never permission.
- **Nest:** durable knowledge, artifacts and checkpoints.

```mermaid
flowchart LR
  H[Human operator] --> UI[Vite + TypeScript dashboard]
  UI --> API[ANTS API]
  A[Claude / Codex / local agent] --> MCP[MCP / SDK / REST]
  B[Independent worker] --> MCP
  MCP --> API
  API --> DB[(PostgreSQL)]
  API --> OBJ[(Artifact storage)]
  DB --> W[Outbox worker]
  W --> UI
```

## Planned features

Mission registry, typed blackboard, task graph with fenced leases, checkpoints, evidence-backed knowledge, independent reviews, audit history, BYO agents via MCP/SDK, human pause and budget control. Hosted SaaS and self-hosting share the same core protocol.

## Documentation

Start with [product vision](docs/01-product.md), [architecture](docs/02-architecture.md) and [delivery roadmap](docs/12-roadmap.md). The [documentation index](docs/README.md) links every specification, ADR and research reference. [Português](README.pt-BR.md).

## Contributing

Read [CONTRIBUTING](CONTRIBUTING.md), [AGENTS.md](AGENTS.md) and [SECURITY](SECURITY.md). We welcome feedback and scoped implementation proposals. No hosted service or install command exists yet.

## License

MIT — see [LICENSE](LICENSE). ANTS is a working name; brand clearance is pending. No affiliation with any AI model provider.
