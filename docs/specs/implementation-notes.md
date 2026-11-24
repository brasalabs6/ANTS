# Implementation notes — first vertical slice

Normative behavior comes from the domain, protocol and security specifications. This is an implementation blueprint, not tested code.

## Transactional claim (TypeScript-like pseudocode)

```ts
async function claimTask(principal: AgentPrincipal, input: ClaimInput) {
  return db.transaction(async tx => {
    await setTenantContext(tx, principal.orgId);
    await assertScope(tx, principal, 'task:claim', input.colonyId);
    // Determine managed execution from authenticated runner/session, never caller Boolean.
    await lockOrganizationIfRequired(tx, principal.orgId);
    await lockColonyPolicy(tx, input.colonyId);
    const mission = await lockMission(tx, input.missionId);
    const goal = await lockGoal(tx, input.goalId);
    await assertActiveRevisionsPolicyAndBudget(tx, mission, goal, input);
    const session = await requireLiveSession(tx, principal, input.sessionId);
    // Actual implementation must serialize same-key requests and hash input.
    return withIdempotency(tx, principal, 'claim', input, async () => {
      const task = await lockReadyTask(tx, mission, goal, input.taskId);
      await assertDependenciesAndCapabilities(tx, task, session);
      // Pulse normally reserves managed run cost at dispatch; avoid double reservation.
      await assertReservationOrExternalQuota(tx, session, goal, task);
      const fence = await advanceFenceAndSetLeased(tx, task);
      const lease = await createLease(tx, task, session, fence);
      await appendEventAndOutbox(tx, mission, 'task.claimed', {taskId: task.id, fence});
      return lease;
    });
  });
}
```

Idempotency replay must still pass current authentication/scope and must not reauthorize stale leases; replay may return the original lease as historical response, which subsequent writes must validate. Same key cannot mutate twice. Use a unique key with transactional insert/lock. Define exact replay behavior for revoked principals before contract freeze.

Every write checks task scope, constitution/policy/mission/goal revisions, session, fence and DB clock. Use [22](../22-execution-contracts.md) canonical lock order. SQLite BEGIN IMMEDIATE + conditional update; hosted Postgres row locks. No DB transaction spans LLM/network. Expiry/renewal/result/pause use same order. In-flight external actions cannot be rolled back by a database transaction. Managed tool actions need separate authorization and reconciliation.

## Storage migration order

1. Organizations, memberships, colonies, identity and roles.
2. Constitution/policy revisions, missions, goals, criteria, scoped agents, roles and sessions.
3. Plans, planning leases, exploration intents, tasks, dependencies and fenced leases.
4. Board, artifacts, checkpoints, evidence, reviews, knowledge and lineage.
5. Run intents/attempts, approval/action intents, reconciliation, event counter/outbox, idempotency, usage/budget.
6. Indexes, local scope constraints/test fixtures; hosted RLS before granting runtime access. Actual migration order may group vertical slices but cannot omit scope/constraints.

Use composite unique keys `(org_id, id)` and `(org_id, mission_id, id)` wherever referenced. If a table has colony and mission, enforce both through composite FK. Use BIGINT for fences and event sequence; serialize as decimal strings in JSON, never JS Number. Use constraints for statuses and non-negative costs; application transitions remain explicit. Artifact references use join tables or scoped references validated in transaction; object keys never supplied by agents as trusted paths.

## Minimal SDK interaction

1. Human creates scoped credentials; worker reads mission with revision 1.
2. Worker lists ready tasks, claims chosen ID with unique idempotency key.
3. Server returns fence `"42"` and expiry; worker heartbeats with same fence.
4. Worker uploads private artifact via short-lived upload intent, finalizes checksum and posts checkpoint.
5. Worker submits result with artifact IDs, verification instructions and current fence. Server enters `in_review` and invalidates lease.
6. Different reviewer submits verdict. Server accepts or reopens and records event.
7. Worker exits. Replacement reads accepted checkpoint and claims new fence if unfinished. No access to old agent secrets required.

## Reconciliation and approval integration

Goal Engine consumes durable triggers and calculates missing criterion coverage. Persist a role-specific work/run request and outbox atomically; Pulse checks authorization and reserved budget before launch. Recheck state and revision before every dispatch. Approval binds exact action hash and target, consume atomically before controlled effect and reconcile ambiguous outcome. Mock gateway tests before real runners. Never treat successful session exit or queue exhaustion as goal success. See [17](../17-goal-engine.md), [19](../19-guardrails-and-approvals.md), [20](../20-intents-and-agent-roles.md), [22](../22-execution-contracts.md).

## Worker process

Outbox polling uses bounded batches and retry leases. Consumer receipts are unique `(consumer,event_id)`. Claim row then commit before network call; retry after crash. Projection updates and receipts share transaction; external webhook delivery can duplicate and must carry stable idempotency key. SSE reads committed event cursor and verifies scope; notification merely wakes reader, durable event table is replay source. Keep sweeper and indexing concurrency configurable. Monitor lag and contention.

## Initial branch strategy

Implement R01–R03 first, then task lifecycle and typed board concurrently only after shared contracts settle. Use small PRs; gate changes to auth, budgets and mission lifecycle with independent review. Start with deterministic fixtures instead of calling paid models. Freeze public SDK v1 only after compatibility and end-to-end tests.
