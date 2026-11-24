# 20 — Intents, exploration and specialized agent roles

Status: v0.6 proposed MVP baseline; extends 04, 14, 17–19. No runtime implemented. Domain-neutral design for benign software development, research and knowledge work.

## Motivation and reference

The useful architectural distinction in ARTEX is an exploratory direction (intent) versus concrete execution, specialized planning versus worker sessions, and feedback from durable observations. Its original repository was withdrawn; available descriptions are secondary or historical, not an audit of the latest implementation. ANTS takes only the generic coordination abstraction, not security-testing capabilities, tools, prompts or source code. Reference: [Strand Intelligence architecture analysis](https://strandintelligence.com/blog/anatomy-of-artex-infrastructure-indicators-and-implications). ANTS does not inherit ARTEX's centralized intent-generation authority.

## Concepts

Constitution = human-approved principles and authority. Mission = lifecycle/container. Goal = verifiable outcome. Plan = revisioned strategy. Exploration Intent = a bounded direction of inquiry or contribution that may not yet have a known implementation. Task = concrete independently claimable execution unit. Evidence = source-linked observation or verified result. A plan may reference multiple intents and direct tasks; an intent may produce zero or more tasks or proposed child intents. Do not require every simple task to have an intent. Intents are distinct from existing scheduler run intents and approval action intents; internal names ExplorationIntent, RunIntent, ActionIntent prevent confusion. An exploration intent grants no execution authorization.

## Intent model and lifecycle

Fields: org_id, colony_id, mission_id, goal_id/revision, intent_id, revision, optional plan_id/revision, optional parent_intent_id, author principal, title, question or hypothesis, rationale, criterion_ids, expected evidence, scope/capability requirements, proposed budget/time cap, priority, dedup key, state, outcome, evidence refs, created/updated timestamps, version. Intent must fit approved goal/constitution/policy. Agents may propose; server admits only within authorized bounds, otherwise requires operator approval or rejects. Intent cannot broaden tool scope, spend or deadline. Child intents obey bounded depth/count, same goal scope, acyclic lineage. Intent activation does not spawn agents automatically outside Pulse policy.

Lifecycle: proposed -> admitted -> exploring -> resolved; proposed/admitted/exploring -> blocked/cancelled/superseded; blocked -> admitted when policy permits. Resolved outcomes: supported, refuted, inconclusive, converted_to_work. Record evidence and reason, not merely agent opinion. An inconclusive outcome is not a goal success. Reopen via new revision. Tasks retain existing fenced leases; the intent itself need not be locked by a single worker when explicitly authorized parallel tasks explore independent questions. A bounded direct exploration can be represented as one task. Duplicate active directions for same goal revision and scope are surfaced for merge/review; deliberate independent replication needs distinct attempt IDs and budget. Do not erase negative evidence.

## Role taxonomy

| Role | Responsibility | MVP |
|---|---|---|
| Planner | Propose/revise plans, identify unmet criteria, propose intents and tasks | yes |
| Worker | Claim eligible tasks, execute within scope, publish checkpoint/results | yes |
| Reviewer | Independently assess evidence and results against approved criteria | yes |
| Scout | Research questions and alternatives, collect observations | worker specialization |
| Archivist | Propose evidence-backed summaries and memory consolidation | later / worker specialization |
| Liaison | Explain progress, gather human decisions, translate requests into proposals | later / operator UI first |

Role profile: ID/version, name, purpose, allowed operation set, required capabilities, context retrieval policy, preferred model/runner (optional), output schema, per-session limits. Registry binds operator-authorized roles to agent identities or runner profiles. Separate agent identity, role assignment, provider/model, session, capability grants and execution mode. A model may play different roles across sessions, but changing label never grants permissions or makes its own result independent. Review separation is by authenticated independent principal and evidence provenance, not model name or session ID. Human approval remains a human role. A generalist may propose work and execute it when authorized, not approve its own output. Operator can configure defaults and later custom role profiles within hard limits. No mandatory proprietary model or central planner service.

## Functional hierarchy, decentralized execution

Human operator holds mission and policy authority. Goal Engine determines missing criteria and requests work. Planner is a replaceable analytical role, not an administrator; it proposes strategies and directions, cannot allocate new credentials, override guardrails, expand scope or guarantee success. Workers choose ready tasks using existing scoped claims, and may propose new intents/tasks when they discover gaps. Reviewers independently verify. Pulse dispatches authorized role-matched sessions or external clients pull. A planner is not required to stay alive, be a parent process of workers or approve every contribution.

Use a single admitted planning revision writer per goal revision at a time (short fenced planning lease / optimistic compare-and-swap), not one permanent planner identity. Multiple planning proposals and independent alternative investigations can coexist within explicitly allocated resources. Resolve conflicts by versioned admission and operator policy; a stale plan cannot overwrite current state. No LLM call inside transaction. Goal Engine is deterministic and continues if planner disappears; request eligible replacement or surface waiting_for_planner. Planning is triggered by initial activation, verified evidence, missing criterion coverage, blocked work or bounded re-evaluation, with coalescing and cooldown; no unnecessary planning round per message. Protect ongoing valid independent work from needless cancellation. Task selection remains decentralized. No mandatory always-on supervisor or unrestricted agent spawning.

## Knowledge and progress graph

Use existing relational database with typed links rather than introduce graph DB: goal -> criterion, plan -> intent/task, intent -> child intent/task, task -> artifact/evidence, evidence -> criterion/intent, review -> evidence, discovery -> proposed intent. Track provenance and scope, explicit relation types, no circular decomposition links; provenance links can represent a general graph. Query goal coverage by verified criteria and explored/unexplored directions. Distinguish coverage of proposed directions from verified outcome; neither number of tasks nor explored intents is success. Link observations and negative results to intent revisions; retrieval gives planners bounded relevant context including failed approaches and conflicts. Dashboard lists intents with evidence and parent goal, and later graph visualizes lineage. No raw model private reasoning; show human-readable rationale, decisions and observed events.

## Integration contracts (draft)

CLI: ants intent list --goal ID --json; ants intent propose --file intent.json; ants intent show ID --json; ants role list --json; ants agent status --json. Admission, cancellation and role assignment through scoped commands; HTTP and optional MCP use same services. Existing task/plan/checkpoint/review APIs remain. Event types: intent.proposed/admitted/resolved/blocked/superseded, plan.proposed/revised, agent.role_assigned; payload schemas pending implementation. Context packets include effective role, goal revision, uncovered criteria, relevant intents, plans and evidence. Human Command Center exposes roles, current work, plan/intent lineage, approvals and conflicts; edit/approval controls honor existing policies. Proposed roles or intent text cannot change runtime permissions.

## MVP and tests

R03: register roles and capabilities; R04: persist exploration intents, plan revisions, lineage and task association; R06: role-aware Goal Engine/Pulse with deterministic mock planner, worker and independent reviewer; R07: dashboard intent view and end-to-end release gate. Test planner replacement after expiry, stale concurrent revision, missing planner, worker proposed discovery, refuted intent preserves evidence, duplicate/loop prevention, role spoofing and self-review denial, policy/budget/pause and intent authorization, and no goal success solely from explored directions. Benign demo: reduce latency in synthetic API; compare alternate explanations using local test fixtures, choose evidenced improvements, verify agreed threshold, record discarded hypotheses. Research comparison: generalist-only vs specialized roles vs single planner vs multiple proposed planners under equal budgets; measure verified quality, duplicate work, planning overhead, recovery, false completion and operator burden. Transfer validated contracts and evidence to Plane, not automatic deployment. See [goals](17-goal-engine.md), [Pulse](14-pulse.md), [dashboard](18-command-center.md), [guardrails](19-guardrails-and-approvals.md).
