# Research references and design traceability

Source pointers carried forward from earlier research (2026-11-24); bibliographic metadata and external URL availability must be reverified before publication. This consolidation did not re-audit external papers or withdrawn repositories. Primary sources preferred; hypotheses and design proposals are not validated results. References are links, not bundled copies.

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

## Additional context and reading queue

| Reference | Relevance / limits |
|---|---|
| [Hearsay-II retrospective, 1977](https://ijcai.org/proceedings/1977/191) and [blackboard model, 1986](https://onlinelibrary.wiley.com/doi/abs/10.1609/aimag.v7i2.537) | shared problem-solving space; earlier distributed blackboard work, not direct LLM proof |
| [Distributed Blackboard Architecture](https://wrap.warwick.ac.uk/id/eprint/60787/) | historical distributed state; verify thesis metadata |
| [Group Agency, List & Pettit](https://doi.org/10.1093/acprof:oso/9780199591565.001.0001) and [Cognition in the Wild, Hutchins](https://mitpress.mit.edu/9780262581462/cognition-in-the-wild/) | collective organizational agency and distributed cognition; not consciousness |
| [AgentNet preprint](https://arxiv.org/abs/2504.00587) | decentralized roles/coordination; verify publication version |
| [DeLM preprint lead](https://arxiv.org/abs/2606.10662), [DecentMem preprint lead](https://arxiv.org/abs/2605.22721) | shared context and decentralized memory; unverified bibliographic leads in this audit |
| [Stigmergy modelling and control](https://pmc.ncbi.nlm.nih.gov/articles/PMC11371424/), [robot swarm behaviors](https://www.nature.com/articles/s44172-024-00175-7) | coordination through traces, separate from LLM experiments |
| [Codex Goals](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex) | thread-scoped persistent goal; ANTS colony-scoped analogue |
| [ARTEX historical analysis](https://strandintelligence.com/blog/anatomy-of-artex-infrastructure-indicators-and-implications) | generic intent/planner/worker and dashboard inspiration; secondary source, no offensive features or code adopted |
| [Leonida historical issue #9522](https://github.com/ItsNotRexed/Leonida/issues/9522) | crowd coordination via issue/PR; original unavailable in prior review; do not infer agent count or audit code |
| [Gradient Institute analysis lead](https://www.gradientinstitute.org/research-publications/when-single-ai-agents-become-a-swarm) | emergent coordination risks; verify availability and metadata |

Further implementation leads from earlier discussion, not audited dependencies: [bMAS](https://github.com/arvarik/bmas), [Stigmergic Blackboard Protocol](https://github.com/Xopher00/stigmergic-blackboard-protocol), [Marcus AI Orchestrator](https://github.com/changquan/marcus-ai-orchestrator), [Decentralized Multi-Agent](https://github.com/geeknees/decentralized-multi-agent), [Agent Comms](https://github.com/pbroom/agent-comms). Verify repository existence/licenses before reuse. OpenAI Swarm handoffs are not the durable colony model; distinguish from Agents SDK. Study references as conceptual inspiration; no exact incident statistics or performance claims relied on by implementation. Historical counts from earlier discussions not independently verified in this audit.

## Implementation references

[Bun standalone executables](https://bun.sh/docs/compiler/executables), [Bun SQLite](https://bun.sh/docs/runtime/sqlite), [SQLite FTS5](https://www.sqlite.org/fts5.html), [Vite](https://vite.dev/guide/), historical alternative [Fastify TypeScript](https://fastify.dev/docs/latest/Reference/TypeScript/), [pnpm workspaces](https://pnpm.io/workspaces), [PostgreSQL SELECT / locking](https://www.postgresql.org/docs/current/sql-select.html), [PostgreSQL RLS](https://www.postgresql.org/docs/current/ddl-rowsecurity.html), [MCP specification](https://modelcontextprotocol.io/specification/), [OpenAPI](https://spec.openapis.org/oas/latest.html), [OpenTelemetry](https://opentelemetry.io/docs/), [NATS JetStream](https://docs.nats.io/nats-concepts/jetstream), [OWASP API Security](https://owasp.org/www-project-api-security/). Confirm supported versions at implementation time.

Related open-source projects for later code review: [AgentNet](https://github.com/zoe-yyx/AgentNet), [Beads](https://github.com/steveyegge/beads), [MCP Agent Mail](https://github.com/Dicklesworthstone/mcp_agent_mail), [OpenAI Swarm](https://github.com/openai/swarm). No code copied or audited; verify licenses before reuse.

## Experimental evidence and transfer

Use [experiment report template](experiment-template.md) for matched-budget baselines, negative outcomes, immutable artifact hashes and verified evidence. Current status: no ANTS experimental results. [16](../16-colony-client-and-research.md) describes the Plane transfer boundary; [23](../23-requirements.md) tracks required acceptance. Product origin and decisions in [21](../21-project-context.md).

## Interpretation

The product hypothesis is organizational continuity, not a conscious collective. Shared state can enable useful cross-session coordination and can also amplify errors/abuse. We deliberately separate mission authority, evidence verification, worker selection and infrastructure persistence. Experimental design in [11](../11-testing.md) tests whether the hypothesis holds under equal resource budgets.
