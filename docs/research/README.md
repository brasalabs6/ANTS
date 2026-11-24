# Research references and design traceability

Reviewed source pointers (2026-11-24). Primary sources preferred; hypotheses and design proposals are not validated results. References are links, not bundled copies.

| Source | Application in ANTS | Limit / status |
|---|---|---|
| [Heylighen, Stigmergy as a universal coordination mechanism I (2016)](https://www.sciencedirect.com/science/article/pii/S1389041715000327) | agents leave durable traces that influence later work | general coordination theory, not LLM evaluation |
| [Smith, Contract Net Protocol (1980)](https://doi.org/10.1109/TC.1980.1675516) | allocation and negotiation ideas | ANTS starts with pull/lease, not full negotiation |
| [Gelernter, Generative communication in Linda (1985)](https://doi.org/10.1145/2363.2433) | temporal decoupling through shared space | conceptual analogy |
| [Han & Zhang, Exploring Advanced LLM Multi-Agent Systems Based on Blackboard Architecture (2025)](https://arxiv.org/abs/2507.01701) | shared blackboard with LLM contributions | preprint; ANTS differs in persistence/tenancy |
| [AgentNet, NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/hash/9a379c1b05793d1c42dc832269834515-Abstract-Conference.html) | decentralized coordination, DAG, retrieval memory | research architecture, not proof of SaaS scalability |
| [Anthropic, Building a C compiler with parallel Claudes (2026)](https://www.anthropic.com/research/building-c-compiler) | shared Git, locks, test harness and independent sessions | specific task and budget; generalization unproven |
| [Anthropic, Effective harnesses for long-running agents](https://www.anthropic.com/research/effective-harnesses-for-long-running-agents) | durable progress/handoff | engineering guidance |
| [OpenAI, Hugging Face incident and the road ahead (2026)](https://openai.com/index/hugging-face-incident-and-the-road-ahead/) | evidence of risks from unintended shared communication; authorized persistence only | security failure, not a reference implementation |
| [OpenAI incident updates](https://openai.com/hugging-face-incident-and-misalignment/) | related shared-board reports, defense in depth | distinguish multiple incidents |
| [METR / Redwood independent investigation (2026)](https://evals.alignment.org/blog/2026-08-26-openai-hugging-face-incident-investigation/) | separate sessions coordinated through shared state; threat modeling | bounded investigation, does not establish consciousness |
| [OpenAI, Where the goblins came from (2026)](https://openai.com/index/where-the-goblins-came-from/) | playful brand inspiration only | training behavior unrelated to collective agency |

## Implementation references

[Vite](https://vite.dev/guide/), [Fastify TypeScript](https://fastify.dev/docs/latest/Reference/TypeScript/), [pnpm workspaces](https://pnpm.io/workspaces), [PostgreSQL SELECT / locking](https://www.postgresql.org/docs/current/sql-select.html), [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [MCP specification](https://modelcontextprotocol.io/specification/), [OpenAPI](https://spec.openapis.org/oas/latest.html), [OpenTelemetry](https://opentelemetry.io/docs/), [NATS JetStream](https://docs.nats.io/nats-concepts/jetstream), [OWASP API Security](https://owasp.org/www-project-api-security/). Confirm supported versions at implementation time.

Related open-source projects for later code review: [AgentNet](https://github.com/zoe-yyx/AgentNet), [Beads](https://github.com/steveyegge/beads), [MCP Agent Mail](https://github.com/Dicklesworthstone/mcp_agent_mail), [OpenAI Swarm](https://github.com/openai/swarm). No code copied or audited; verify licenses before reuse.

## Interpretation

The product hypothesis is organizational continuity, not a conscious collective. Shared state can enable useful cross-session coordination and can also amplify errors/abuse. We deliberately separate mission authority, evidence verification, worker selection and infrastructure persistence. Experimental design in [11](../11-testing.md) tests whether the hypothesis holds under equal resource budgets.
