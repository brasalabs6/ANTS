# Implementation notes — first vertical slice

Normative behavior comes from the domain, protocol and security specifications. This is an implementation blueprint, not tested code.

## Transactional claim (TypeScript-like pseudocode)

```ts
async function claimTask(principal: AgentPrincipal, input: ClaimInput) {
  return db.transaction(async tx => {
    await setTenantContext(tx, principal.orgId);
    await assertScope(tx, principal, 'task:claim', input.colonyId);
    // Reserve platform spend only where managed execution is authorized.
    if (input.managed) await lockOrganization(tx, principal.orgId);
    const mission = await lockMission(tx, input.missionId);
    await assertActiveRevisionAndBudget(tx, mission, input.missionRevision);
    const session = await requireLiveSession(tx, principal, input.sessionId);
    // Actual implementation must serialize same-key requests and hash input.
    return withIdempotency(tx, principal, 'claim', input, async () => {
      const task = await lockReadyTask(tx, mission, input.taskId);
      await assertDependenciesAndCapabilities(tx, task, session);
      if (input.managed) await reserveAuthorizedCost(tx, mission, task);
      const fence = await advanceFenceAndSetLeased(tx, task);
      const lease = await createLease(tx, task, session, fence);
      await appendEventAndOutbox(tx, mission, 'task.claimed', {taskId: task.id, fence});
      return lease;
    });
  });
}
```

Idempotency replay must still pass current authentication/scope and must not reauthorize stale leases; replay may return the original lease as historical response, which subsequent writes must validate. Same key cannot mutate twice. Use a unique key with transactional insert/lock. Define exact replay behavior for revoked principals before contract freeze.

Every write checks task scope, mission state/revision, session, fence and DB clock. Lock order: organization (when necessary), mission, task, lease, colony event counter; never reverse. Expiry/renewal/result/pause use same order. In-flight external actions cannot be rolled back by a database transaction. Managed tool actions need separate authorization and reconciliation.

## Storage migration order

1. Organizations, memberships, colonies, identity and roles.
2. Missions, scoped agents and sessions.
3. Tasks, dependencies, leases (unique task ID for current lease), checkpoints and reviews.
4. Board, artifacts, knowledge.
5. Event counter, events, outbox, idempotency, usage and budget reservations.
6. Indexes, RLS policies and test fixtures. Apply policies before granting runtime access to new tables.

Use composite unique keys `(org_id, id)` and `(org_id, mission_id, id)` wherever referenced. If a table has colony and mission, enforce both through composite FK. Use BIGINT for fences and event sequence; serialize as decimal strings in JSON, never JS Number. Use constraints for statuses and non-negative costs; application transitions remain explicit. Artifact references use join tables or scoped references validated in transaction; object keys never supplied by agents as trusted paths.

## Minimal SDK interaction

1. Human creates scoped credentials; worker reads mission with revision 1.
2. Worker lists ready tasks, claims chosen ID with unique idempotency key.
3. Server returns fence `"42"` and expiry; worker heartbeats with same fence.
4. Worker uploads private artifact via short-lived upload intent, finalizes checksum and posts checkpoint.
5. Worker submits result with artifact IDs, verification instructions and current fence. Server enters `in_review` and invalidates lease.
6. Different reviewer submits verdict. Server accepts or reopens and records event.
7. Worker exits. Replacement reads accepted checkpoint and claims new fence if unfinished. No access to old agent secrets required.

## Worker process

Outbox polling uses bounded batches and retry leases. Consumer receipts are unique `(consumer,event_id)`. Claim row then commit before network call; retry after crash. Projection updates and receipts share transaction; external webhook delivery can duplicate and must carry stable idempotency key. SSE reads committed event cursor and verifies scope; notification merely wakes reader, durable event table is replay source. Keep sweeper and indexing concurrency configurable. Monitor lag and contention.

## Initial branch strategy

Implement F01–F03 first, then task lifecycle and typed board concurrently only after shared contracts settle. Use small PRs; gate changes to auth, budgets and mission lifecycle with independent review. Start with deterministic fixtures instead of calling paid models. Freeze public SDK v1 only after compatibility and end-to-end tests.
