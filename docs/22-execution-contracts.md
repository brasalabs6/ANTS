# 22 — Cross-module execution contracts and invariants

Status: v0.7 proposed normative design. Detailed domain-specific rules remain in 03–20. This document fixes cross-cutting ambiguity; actual implementation and schemas require tests.

## Canonical vocabulary and authority

| Name | Meaning | Authority |
|---|---|---|
| Organization / Colony | ownership and isolated collaboration workspace | operator |
| ConstitutionRevision | durable mission principles, scope and hard limits | human approves |
| Mission | lifecycle container; one or more goals over time | human lifecycle |
| GoalRevision / Criterion | measurable outcome and approved evidence rule | human activates/changes; engine reconciles |
| PlanRevision | strategy and criterion coverage | authorized proposal/admission, human gate as configured |
| ExplorationIntent | bounded question/hypothesis/direction | authorized proposal/admission |
| TaskRevision / TaskLease | concrete work and temporary exclusive claim | server state + current fence |
| AgentIdentity / RoleAssignment / Session | principal, scoped duties, disposable execution | operator enrollment; server validates |
| RunnerProfile / RunIntent / RunAttempt | configured execution adapter, durable dispatch request, actual attempt | Pulse + operator policy |
| ActionIntent / Approval | canonical controlled effect, single-use authorization | policy + authorized human where required |
| BoardPost / Pheromone | shared observation, advisory priority signal | untrusted content, server validates envelope |
| Checkpoint / Artifact / Evidence / Review | durable progress, immutable bytes, claim support, independent verdict | scoped write, provenance, validation |
| KnowledgeRevision / Decision / Event / Audit | memory and records | typed authoritative transition vs untrusted proposal |

Avoid overloaded "worker": role Worker is distinct from external polling execution mode and application background worker. Avoid overloaded "intent": UI Intents means ExplorationIntent; run and action intents have separate stores and APIs. A goal is not a mission, and a task is not a run. No mandatory plan/intent for a simple direct task; every goal-linked task must reference goal revision and relevant criterion or a documented supporting purpose.

## State and revision rules

Use immutable revisions for constitution, goal definition, criterion rules, plan, policy, task definition and verified artifacts/knowledge. Mutable current pointers/status have optimistic version. Revision is definition identity, version is compare-and-swap concurrency counter, fence is monotonically increasing lease authority. Use decimal strings for 64-bit counters in JSON. Effective scope is the intersection of organization/colony/mission/goal/role/session/runner policy. Server clock is authoritative; UTC RFC3339 on wire, SQLite integer UTC milliseconds or normalized ISO storage (choose in migration ADR), PostgreSQL timestamptz. UUID strings, no JS floating-point money; integer micro-units with currency and source, unknown explicitly unknown.

One active pursuit goal per mission in MVP (active/verifying/blocked/paused/exhausted occupies slot until terminal or explicitly deactivated; no second active goal bypasses limits). Mission completion requires operator and all required goals successful or explicitly cancelled with reason; cannot report cancelled criteria as verified. Goal success is terminal for that revision. Pause is persisted and denies new claims/dispatch, invalidates active write leases and pending grants for affected scope. Resume is human-authorized, fresh session authority and claims; never resume stale work silently. A rejected action blocks the action, not unrelated safe work. Waiting for worker/planner/approval is a reason, not a false terminal success. Goal blocked may have independent runnable work; stop only the blocked branch unless whole goal blocked. Exhaustion requires explicit authorization of changed limits before resume. Deadline cannot be extended by agent.

Plan acceptance uses a fenced planning lease or expected-version CAS for authoritative pointer; alternative proposals retained. A plan change invalidates only affected tasks/evidence with reason and revision lineage; valid unaffected work continues. Task state proposed/ready/leased/in_review/done/cancelled; UI blocked derives from reason/dependencies/approval, not a separate arbitrary state. Reopen creates a new task revision and invalidates dependent acceptance; dependency graph acyclic, provenance graph may have cycles. Evidence is valid only for the referenced artifact hash and criterion revision; reviewer independence by principal, not session or model. One person can oversee all, but no agent self-review or self-granted authorization.

## Transaction and delivery semantics

Common lock hierarchy (skip unused levels, never reverse): org/budget root -> colony lifecycle/policy -> mission -> goal -> plan/intent -> task -> lease/run/approval rows in deterministic type/id order -> colony event counter. Idempotency key is scoped to org, principal and operation; authenticate/authorize before replay, request hash must match. Serialize duplicate commands in same transaction without reversing lock order. Replay of prior lease response is historical only; subsequent writes require current fence and state. Revoked principals receive denial, not cached secrets. In local SQLite use short BEGIN IMMEDIATE serialized writes and conditional updates; Postgres use row locks/conditional update/SKIP LOCKED for eligible claims. No network/LLM call inside DB transaction. Claim selection and every authoritative write recheck current parent states, definition revisions, capability grants, policy, expiry, task version and fence when relevant. Same transaction writes state + event + outbox. At-least-once delivery; consumer receipts dedup by stable event ID. External effect ambiguity is reconciled, never blindly repeated. Event order scoped to colony and allocated transactionally; gaps/retention trigger snapshot resync. Use bounded retries/timeouts, no infinite loops.

## End-to-end reconciliation

1. Operator bootstraps host, sets constitution/policy and activates goal with explicit verification and resource envelope.
2. Goal Engine checks required criteria, existing evidence, worker availability and pending approvals. If needed creates durable role-specific planning/evaluation request, not an arbitrary tool command.
3. Authorized planner or generalist reads bounded context, proposes revisioned plan/intents/tasks. Server validates scope, dedup, dependencies and limits; operator gate only where configured.
4. Workers pull ready tasks or Pulse starts bounded approved sessions. Worker claims, publishes checkpoint and artifact/evidence, submits result. No task ownership implied by posting.
5. Independent reviewer validates result against approved verifier. Failed result reopens task; refuted intent is retained as negative knowledge. Valid result advances criterion evidence, not automatically goal.
6. Reconcile on meaningful state changes, coalesce duplicate triggers, use bounded periodic fallback. If missing criteria with no runnable work, request gap analysis/replan; do not declare done. If no eligible resources or progress, report blocker/backoff/exhaustion.
7. When all required criteria pass at an approved consistent candidate revision and any human gates pass, atomically mark goal succeeded and stop goal-specific dispatch. Audit every consequential transition. Restart recovers authorized state, not disabled/cancelled execution. Browser disconnect never stops authorized runtime.
8. Export with versioned manifest and hashes; import verifies scope/path/hash and starts disabled. New identities use current authorized state, not predecessor credentials.

## Context and observable status contract

Context must include schema version, org/colony/mission/goal IDs/revisions, constitution hash, current policy and role scope (non-secret summary), session/claim refs if any, criterion states, plan/intents, ready work, checkpoint provenance, verified and disputed claims, negative results, evidence refs, pending approvals/blockers, event cursor, time and truncation/continuation metadata. Distinguish accepted facts from unverified posts. Order essential governance and goal state first; budget bytes/tokens, paginate remaining sections. Stale/unavailable never presented as current. Do not store private reasoning, raw credentials, or assume model context unlimited. See [07](07-memory.md).

## Failure and security table

| Condition | Required response |
|---|---|
| Agent session ends | preserve checkpoint; expire/release lease; reconcile if authorized |
| Planner absent | expose waiting_for_planner; replace with eligible role only |
| No worker available | expose waiting_for_worker; no phantom active agents |
| Empty queue, unmet criterion | request bounded gap analysis/verification |
| Conflicting proposal | compare expected revision; preserve losing proposal |
| Action denied/expired | no effect, visible reason, no pressure retries |
| Repeated equivalent failure | stop/backoff per policy, preserve negative evidence |
| Budget or deadline exhausted | stop affected dispatch, report unmet criteria |
| Human pause/revoke/cancel | invalidate authority, terminate managed runs where supported; external compute not guaranteed stopped |
| Host crash | reconcile durable leases/attempts; no duplicate external effect assumption |
| SSE gap | resnapshot authorized read model, resume from cursor |
| Inconsistent artifact evidence | mark stale/disputed; do not complete goal |

## Proposed implementation defaults requiring validation

Loopback port 7337; lease TTL 120s, heartbeat 30s, max lease window 15min; page 50/max 200; bounded payloads and context caps chosen in R01/R03. Values are initial tuning candidates, not unconditional requirements; operators may narrow them within validated safe limits. Run duration, concurrency, spend, allowed schedule and retry/no-progress budget must be explicit for unattended dispatch. No automatic install/autostart. Local mock runner only until verified isolation. API version /v1 is a draft namespace, not stable public v1 promise. See [specs](specs/README.md) and [requirements](23-requirements.md).
