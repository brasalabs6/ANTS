# 03 — Domain model and storage

All identifiers UUID (UUIDv7 where supported); UTC timestamptz; every tenant-owned row includes org_id; composite foreign keys enforce same organization and where relevant same colony/mission. Monetary quantities integer micro-units + currency. No sensitive raw prompt in operational logs. All mutations have actor, request ID, idempotency key where relevant and audit reference.

| Entity | Essential fields / constraints |
|---|---|
| organization | id, slug, plan, status |
| membership | org_id, user_id, role, unique pair |
| colony | org_id, id, name, visibility, lifecycle |
| mission | org_id, colony_id, id, goal, constraints, success_criteria, revision, state, budget, deadline |
| agent | org_id, id, colony_id, label, capabilities, status, principal_id |
| agent_session | org_id, agent_id, id, start/end, lease heartbeat, model metadata |
| task | org_id, mission_id, id, parent_id, status, priority, requirements, current_fence, version, result_id |
| task_dependency | org_id, mission_id, task_id, depends_on_id; no cycles/self dependency |
| lease | org_id, task_id, session_id, fence, expires_at; max one active per task |
| checkpoint | org_id, task_id, fence, sequence, artifact refs, summary |
| board_post | org_id, mission_id, task_id?, id, parent_post_id?, actor, type, payload, created_at |
| knowledge_item | org_id, mission_id, id, claim, status, revision, provenance, supersedes_id |
| artifact | org_id, id, object_key, sha256, size, media_type, scan_state, creator |
| review | org_id, task_id, result_id, reviewer_principal, verdict, evidence, created_at |
| event | org_id, colony_id, sequence, event_id, type, schema_version, payload, actor, causation/correlation |
| outbox | event_id, attempts, next_attempt_at, processed_at; delivery receipts per consumer |
| budget_reservation | org_id, mission_id, run_id, reserved, consumed, state, expires_at |
| usage_ledger | org_id, event_id unique, unit, quantity, source, cost, currency |
| idempotency | org_id, principal, operation, key, request_hash, response, expiry |
| audit_record | org_id, actor, action, target, time, result, correlation_id |

Mission state: draft -> active -> paused -> active; active/paused -> completed/cancelled; terminal state immutable (clone to restart). Deadline/budget exhaustion pauses issuance. Revision changes invalidate prior capabilities where necessary; explicit operator action resumes.

Task state: proposed -> ready -> leased -> in_review -> done; leased -> ready on release/expiry; in_review -> ready on rejection; proposed/ready/leased/in_review -> cancelled subject to permissions. Blocked is derived from unsatisfied dependencies or recorded reason. Done may be reopened via authorized new revision, never silently overwritten. `done` only after required approvals. Dependencies are on accepted result revisions; upstream invalidation flags downstream stale.

## Concurrency invariants

- For budget-sensitive transitions lock organization first, then mission; otherwise lock mission first; then task rows by deterministic ID. Never acquire an organization lock after a mission lock. Serialize graph edge writes per mission and check cycles in transaction.
- Server clock defines lease expiry; strictly increasing fence per task. Check session, fence, task status, mission revision/state and expiry on every checkpoint, renewal or result write. Late worker receives 409 and may only submit a new untrusted observation through authorized channel.
- Idempotency keys scoped to principal + operation; equal hash returns same result, different hash returns 409. Outbox consumer deduplicates event IDs; do not claim exactly-once external side effects.
- Colony event ordering: allocate monotonic sequence in same transaction with per-colony counter row, do not use global sequence as commit order. Use cursor (colony, sequence). Hot colony counter is a known throughput bottleneck; revisit using partitioned streams and opaque cursors if measured.
- Index `(org_id, mission_id, status, priority DESC, created_at, id)`, `(org_id, colony_id, sequence)`, `(org_id, task_id, fence, sequence)`, lease expiry, outbox retry. Use keyset pagination, bounded query sizes.
- Event history append-only to application principals, subject to authorized retention/deletion. Store current tables as authority, events for history/projections; not full event sourcing initially.
