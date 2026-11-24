# 21 — Project context, product thesis and continuity dossier

Status: consolidated v0.7 design baseline, 2026-11-24. This is the durable product context, not a transcript or an implementation claim. Start here when taking over without access to earlier conversations.

## Origin and purpose

ANTS originated in a discussion about distributed human/AI collaboration around Leonida's public GitHub coordination issues (including ItsNotRexed/Leonida #9522 and its successor), not about replicating that project's game or code. Many contributors could coordinate through shared issues and PRs; the interesting engineering abstraction was a crowdsourced swarm with independent compute, shared tasks and integration bottlenecks. Historical repository availability changed; do not rely on its current existence or infer exact agent counts or internal implementation.

The second inspiration was the reported 2026 OpenAI/Hugging Face incident: independent evaluation sessions used a shared message board, passing discoveries and work between sessions. The product insight is temporal decoupling: an individual agent can terminate while a later authorized agent continues useful work from external state. The incident was a security failure, not a pattern for evasion, unauthorized persistence or acquiring resources. ANTS explicitly provisions the communication channel, identities, limits and stop controls. The concept is functional collective agency, not consciousness or self-preservation. See [research](research/README.md).

Scientific foundations: stigmergy (coordination through traces left in an environment), blackboard architectures, Linda tuple spaces (asynchronous exchange across process lifetimes), distributed cognition and group agency, collective intelligence, Contract Net-style allocation and LLM multi-agent research. Anthropic's parallel compiler and long-running agent harness experiments illustrate Git, locks, tests and handoffs. Codex Goals inspire persistent outcome-oriented continuation. Historical ARTEX descriptions motivate exploratory intents, replaceable specialist roles, parallel-work visualization and human controls; only generic coordination concepts are relevant. None of these references proves ANTS works.

## Product identity and customer

ANTS = Autonomous Networked Task Swarms. Working brand inspired by ants and digital pheromones. Goblins were an alternative playful reference to OpenAI's reported training behavior; optional cosmetic Goblin Mode, not a feature commitment. Palette: #171717, #D5F75B, #F5F5F0, #737373 (validate contrast); naming/trademark/domain clearance pending. Slogans: "Many agents. One mission." / "Agents come and go. The mission continues." / "Agent-first. Goal-driven. Human-governed."

The flagship customer already uses terminal-capable agents (Codex, Claude Code, Gemini CLI, OpenCode, local/custom agents) and wants continuity across tasks, sessions, machines and providers without mandatory MCP or a new model subscription. The problem is loss of useful working context, repeated attempts and constant human continuation prompts. The differentiated product is not just a memory server or task tracker: a constitution-governed colony proactively pursues verified goals with independent agents. Memory enables continuity but cannot guarantee lossless model context or solve arbitrary objectives.

Typical deployment: one human operator, many agents; not a hard limit on humans. Operator authorizes goals and capabilities, inspects plans/tasks, steers work, reviews evidence and approves or rejects gated actions. No human project management, HR, portfolio or complex delegation workflow in ANTS MVP. Agent role specialization is compatible with decentralized work selection. No permanent central LLM supervisor. The authoritative server is logically centralized initially; physical P2P/federation is a separate later research question.

## Relationship to Plane

ANTS is simultaneously an independent open-source product, a potential hosted SaaS and an applied research laboratory. Plane is intended to incorporate all validated ANTS capabilities and extend them to large-scale human/agent project orchestration: multi-person delegation, planning, portfolios, hybrid/hierarchical workflows and enterprise governance. This is a target capability relationship, not a statement about Plane's current implementation, not a mandatory source-code dependency, not shared storage or deployment. Publish generic contracts, experiments, negative results, reusable pure domain modules where useful; Plane independently validates and adopts them. Never expose private Plane code, data, secrets or architectural details. See [16](16-colony-client-and-research.md).

## Current architecture in one page

- TypeScript throughout. Bun runtime and standalone compilation are chosen design direction pending R01 spike. Vite + TypeScript web UI; no Vue; UI framework still undecided. Local SQLite with FTS5 (bounded fallback), artifact filesystem, one authoritative host; HTTP and authenticated scoped SSE. Later PostgreSQL/RLS, private S3-compatible storage, scalable workers and hosted tenancy. No mandatory Docker, Node, Bun installation, cloud service, embedding API or MCP for binary end user.
- One distributable executable can host distinct CLI client, server and authorized runner roles. Client-only join never starts a server or opens colony DB. Named profiles, scoped enrollment, TLS remote / authenticated loopback. Browser optional at runtime; Command Center with goals/plans/intents/Kanban/swarm/approvals/guardrails required for first public alpha.
- Constitution is versioned human-approved durable direction and limits; Mission is lifecycle/container; Goal is measurable target; Plan is revisioned strategy; ExplorationIntent is bounded investigative direction; Task is concrete work; Evidence and reviews verify outcomes. RunIntent is a scheduling request, ActionIntent a proposed controlled effect. Neither grants permission. Do not conflate.
- Goal Engine deterministically reconciles remaining criteria and schedules bounded work requests; Pulse dispatches configured eligible runners when enabled. External workers can pull. No worker available => visible blocker. Completion requires verified evidence, not task count or agent claim. Explicit pause/cancel/revocation, budget/deadline/no-progress limits always win over pursuit.
- Planner proposes strategies; Worker executes; Reviewer independently checks. Scout, Archivist and Liaison optional specializations. Roles are replaceable and scoped; model, role, identity, session, execution mode and permissions distinct. Workers can propose new directions. One fenced plan admission at a time, not one permanent leader.
- Blackboard is a typed asynchronous shared environment. Nest is collective memory (episodic, semantic, procedural, strategic, negative). Trails record provenance; pheromones are advisory, decaying priority signals. Store checkpoints, evidence hashes, negative findings, decision revisions and known blockers. No secrets or private chain-of-thought. No giant transcript as sole state.
- Human governs with deterministic policy: allow / require_approval / deny, constrained action-specific approvals, audit, stop, revocation. Cannot control unrelated external shell activity; managed effects require enforced isolation. No autonomous privilege escalation, resource acquisition, unapproved persistence or self-replication.
- Modular monolith with independent domain/application ports; add brokers, cache, partitioning, federation only when measured. MIT license for adoption; hosted plans monetize convenience and governance, BYO compute first. AGPL alternative discussed but not chosen. No fixed prices or measured capacity yet.

## Why the decisions changed

| Version | Change | Why |
|---|---|---|
| v0.1 | SaaS-first modular design, shared board, memory, leases, MIT | initial collective continuity concept |
| v0.1 correction | Vite + TS, Vue removed | user corrected frontend stack; rendering framework not chosen |
| v0.2 | portable Bun/SQLite binary, CLI-first, Pulse | reduce install friction, allow agents to resume or be scheduled |
| v0.3 | explicit client/server roles, Plane research relationship | CLI was originally an MCP alternative; remote join must not require own host |
| v0.4 | persistent Goal Engine | Codex Goals analogy: no repeated human "continue", verified completion |
| v0.5 | mandatory public-alpha dashboard and enforceable approvals | autonomy must coexist with human operation, parallel task visibility and Kanban |
| v0.6 | exploration intents, Planner/Worker/Reviewer | distinguish uncertain directions from known tasks; functional hierarchy without permanent command |
| v0.7 | consolidation and handoff | remove ambiguity, preserve decisions, expose implementation gaps and traceable acceptance |

Historical versions remain recoverable in Git. This dossier preserves motivations without pretending every earlier option is still active.

## Release and growth

Public alpha: clean-machine binary, local host and remote client-only join, persistent constitution/goals, role-aware planner/worker/reviewer, board/knowledge/checkpoint, durable evidence, managed mock Pulse, human dashboard + Kanban/approvals/guardrails, safe pause/restart/export, reproducible demo. Real unattended provider execution requires isolation/security verification; do not make mock capability look like production readiness. Hosted SaaS follows local validation. Initial viral demo concept: "The Immortal Colony" (immortal knowledge, not unstoppable execution): replace every agent and show measured continuation with vs without durable memory. Share opt-in redacted read-only demo views, easy install, transparent benchmarks, provider neutrality. No invented performance figures. Optional future Goblin Mode is cosmetic.

## What is and is not decided

User-confirmed direction: ANTS name, open source + SaaS, TypeScript/Vite not Vue, CLI alternative to MCP, local/remote join, lightweight deployment, agent-first focus, Plane research transfer, persistent goals, human dashboard/Kanban/approvals/guardrails, intents and planner specialization. Design proposals adopted as implementation baseline: Bun, SQLite, single binary packaging, REST/SSE, module boundaries, role taxonomy, one active goal per mission, lease/fence and approval contracts, MIT already committed. Validate proposed technical choices by spike; never treat an untested design as working code. Open decisions listed in [handoff](24-handoff.md). See [requirements](23-requirements.md), [roadmap](12-roadmap.md), [execution contracts](22-execution-contracts.md).
