# 03 — Domain model and storage

All identifiers UUID (UUIDv7 where supported); UTC RFC3339 wire format, SQLite UTC storage format chosen in migration ADR, PostgreSQL timestamptz; every tenant-owned row includes org_id; composite foreign keys enforce same organization and where relevant same colony/mission. Monetary quantities integer micro-units + currency. No sensitive raw prompt in operational logs. All mutations have actor, request ID, idempotency key where relevant and audit reference.

| Entity | Essential fields / constraints |
|---|---|
| organization | id, slug, plan, status |
| membership | org_id, user_id, role, unique pair |
| colony | org_id, id, name, visibility, lifecycle |
| constitution_revision | org_id, colony_id, id, revision, document/hash, approved scope and limits, approver |
| mission | org_id, colony_id, id, purpose, constitution_revision, revision, state, budget, deadline |
| goal / goal_revision | org_id, colony_id, mission_id, id, revision, objective, policy, status, next evaluation, stop reason, version |
| goal_criterion / verification | goal_id/revision, criterion_id, verifier/rubric ref, required, state, target artifact hash, evidence refs, independent principal |
| goal_attempt / reconciliation_intent | goal_id/revision, purpose, dedup key, fence, timing, outcome, next evaluation |
| plan_revision / planning_lease | goal_id/revision, plan_id/revision, rationale, coverage, status, author, fence, admission version |
| exploration_intent | goal_id/revision, optional plan/parent intent revision, question, expected evidence, cap, state/outcome, dedup, version |
| agent | org_id, id, colony_id, label, capabilities, status, principal_id |
| role_profile / role_assignment | org/colony, version, allowed operations, capability needs, role, principal, authorization |
| agent_session | org_id, agent_id, id, role_assignment, effective scopes, start/end, heartbeat, model metadata |
| runner_profile / run_intent / run_attempt | scoped runner, fixed adapter config ref, role, goal revision, trigger/dedup, fence, state, budget, deadlines |
| policy_revision | org/colony/goal/runner scope, version/hash, approved rules and hard caps |
| action_intent / approval | scoped action hash, target, policy/goal/task/run revisions, actor, expiry, decision, consumption, effect status |
| task / task_revision | org_id, mission_id, goal_id/revision, id, revision, optional parent/plan/intent, criterion links, status, priority, requirements, current_fence, version, result_id |
| task_dependency | org_id, mission_id, task_id, depends_on_id; no cycles/self dependency |
| lease | org_id, task_id, session_id, fence, expires_at; max one active per task |
| checkpoint | org_id, task_id, fence, sequence, artifact refs, summary |
| board_post | org_id, mission_id, task_id?, id, parent_post_id?, actor, type, payload, created_at |
| knowledge_item | org_id, mission_id, id, claim, status, revision, provenance, supersedes_id |
| artifact | org_id, id, object_key, sha256, size, media_type, scan_state, creator |
| evidence / decision | source artifact hash, claim/criterion/intent/task revision, provenance, verdict/rationale, actor |
| pheromone | scoped typed advisory signal, weight, expiry, evidence ref |
| review | org_id, task_id, result_id, reviewer_principal, verdict, evidence, created_at |
| event | org_id, colony_id, sequence, event_id, type, schema_version, payload, actor, causation/correlation |
| outbox | event_id, attempts, next_attempt_at, processed_at; delivery receipts per consumer |
| budget_reservation | org_id, mission_id, run_id, reserved, consumed, state, expires_at |
| usage_ledger | org_id, event_id unique, unit, quantity, source, cost, currency |
| idempotency | org_id, principal, operation, key, request_hash, response, expiry |
| audit_record | org_id, actor, action, target, time, result, correlation_id |

Mission state: draft -> active -> paused -> active; active/paused -> completed/cancelled; terminal state immutable (clone to restart). Deadline/budget exhaustion pauses issuance. Goal lifecycle and slot rules are in [17](17-goal-engine.md) and [22](22-execution-contracts.md); intent and plan states in [20](20-intents-and-agent-roles.md) and [18](18-command-center.md); approval lifecycle in [19](19-guardrails-and-approvals.md). Revision changes invalidate prior capabilities where necessary; explicit operator action resumes.

Task state: proposed -> ready -> leased -> in_review -> done; leased -> ready on release/expiry; in_review -> ready on rejection; proposed/ready/leased/in_review -> cancelled subject to permissions. Blocked is derived from unsatisfied dependencies or recorded reason. Done may be reopened via authorized new revision, never silently overwritten. `done` only after required approvals. Dependencies are on accepted result revisions; upstream invalidation flags downstream stale.

## Storage scope

All scoped child rows carry org/colony/mission/goal linkage as applicable even when abbreviated above. Composite FK enforce same scope and immutable revision; normalized links for artifacts, evidence and lineage. SQLite has no RLS; server enforces scope and constraints, file permissions protect DB. PostgreSQL adds forced RLS. No cross-tenant retrieval. Keep current tables authoritative and event projections rebuildable. See [22](22-execution-contracts.md) for revision vs version vs fence.

## Concurrency invariants

- Follow [22](22-execution-contracts.md) common hierarchy: org/budget -> colony lifecycle/policy -> mission -> goal -> plan/intent -> task -> lease/run/approval -> colony event counter; skip unused levels, never reverse. SQLite uses short serialized write transactions; PostgreSQL uses row locks. Serialize graph edge writes per mission and check cycles in transaction.
- Server clock defines lease expiry; strictly increasing fence per task. Check session, fence, task status, mission/goal revision/state, policy and expiry on every checkpoint, renewal or result write. Late worker receives 409 and may only submit a new untrusted observation through authorized channel.
- Idempotency keys scoped to org + principal + operation, with current authorization recheck; equal hash returns same result, different hash returns 409. Outbox consumer deduplicates event IDs; do not claim exactly-once external side effects.
- Colony event ordering: allocate monotonic sequence in same transaction with per-colony counter row, do not use global sequence as commit order. Use cursor (colony, sequence). Hot colony counter is a known throughput bottleneck; revisit using partitioned streams and opaque cursors if measured.
- Index `(org_id, mission_id, status, priority DESC, created_at, id)`, `(org_id, colony_id, sequence)`, `(org_id, task_id, fence, sequence)`, lease expiry, outbox retry. Use keyset pagination, bounded query sizes.
- Event history append-only to application principals, subject to authorized retention/deletion. Store current tables as authority, events for history/projections; not full event sourcing initially.
