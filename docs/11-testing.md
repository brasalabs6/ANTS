# 11 — Verification and research plan

## Test pyramid

Domain unit/property tests for state transitions, dependency DAG, budget and fences; repository integration with real Postgres and two independent connections; API/MCP contract tests; frontend component tests (framework-specific adapter TBD); Playwright E2E; load and chaos tests. Use deterministic mock agents and provider adapters. No model key in CI. Reproducible seed datasets; separate real-model opt-in evaluation with explicit budget and sandbox.

Critical acceptance matrix:

| Scenario | Expected result |
|---|---|
| 100 concurrent claims for one task | one valid lease; others conflict/no work |
| Lease expires, new worker claims, old worker submits | old fence rejected; new result accepted for review |
| Pause races claim and result | serial order; nothing authorized after pause commit |
| Duplicate result / outbox delivery | one business result, idempotent consumer |
| Same idempotency key with changed body | conflict |
| Concurrent dependency edges create cycle | at least one rejected |
| Org A guesses org B IDs / search / SSE / object URLs | no data, no side effect |
| Two agents reserve final budget | total reserve + settled <= cap |
| Agent submits own review | rejected |
| Malicious board text asks for secrets or new permissions | no authority change |
| All sessions terminated | fresh session resumes from checkpoint only |
| DB restore and projection rebuild | expected state and event cursors restored |

## Research experiment

Compare single agent, supervisor-driven parallel agents, decentralized agents without durable memory, decentralized blackboard, structured-memory ANTS. Hold model(s), dataset, tool access, budget, time and number of attempts constant. Randomize task order and repeat seeds. Example benchmark: small compiler/test-suite repair, literature synthesis with known answers, independent task DAG. Measure accepted quality, time/cost, duplicate work, verification rate, stale claims, recovery lag, knowledge retention, false facts, policy violations. Report distributions, confidence intervals, negative results and limitations; do not infer consciousness from success.

Generation test: terminate every worker and context at fixed boundaries; keep only approved artifacts and board state; start fresh identities with same scoped mission; compare remaining work completed and cost to no-memory control. Require explicit operator activation and stop. Record run configuration and artifact hashes. Test whether memory contributes more than raw parallelism.

## Research transfer (v0.3)

Record the hypothesis, baseline, immutable constitution revision, model/adapter versions, workload and seed, budgets, configuration, protocol version, artifact hashes, outcome and negative results for each experiment. Store sanitized reproducible fixtures and a capability assessment (experimental / validated in ANTS / candidate for transfer) rather than claiming general readiness. Validate client-only joins and model-independent continuity. See [16 — Research strategy](16-colony-client-and-research.md). A larger human-agent orchestration platform must repeat security, scale and mixed-participant tests in its own environment before adoption.

## Goal Engine acceptance (v0.4)

[Goal specification](17-goal-engine.md) defines the mandatory proactive end-to-end demo: activate once, plan, work, fail verification, recover/replan across session replacement, then verify and succeed without further human continuation prompts. Test empty queue, stale/tampered evidence, false completion, no runner, pause, budget and deadline, reconciliation dedup and restart. Compare verified completion and human intervention count against passive board and single-agent goal baseline under equal limits.
