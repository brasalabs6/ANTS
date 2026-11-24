# 17 — ANTS Goals: persistent collective goal pursuit

Status: v0.4 design baseline; first-class MVP capability, not implemented. This document extends 13–16, superseding any interpretation of an empty task queue or finished agent session as mission completion.

## Product contract

An authorized human activates a measurable objective. The colony proactively pursues it across independent agent sessions until the completion criteria are verified, or an explicit stop/block condition is reached. The objective is owned by the colony, not a particular model, thread, agent or runner. No additional human "continue" prompt is required while the host is running, eligible resources are available and execution is explicitly authorized. The system guarantees durable tracking and bounded continuation attempts under these conditions, not eventual success, uninterrupted uptime or that an LLM is always correct.

Inspiration: [Using Goals in Codex (OpenAI, May 9 2026)](https://developers.openai.com/cookbook/examples/codex/using_goals_in_codex). Codex Goals are durable thread-scoped objectives with completion checks and controls. ANTS proposes a colony-scoped, multi-agent equivalent; no dependency on Codex Goal mode or assumption of identical semantics.

## Model

Constitution: enduring mission, governance, authorized capabilities and hard limits. Mission: existing lifecycle and container for work. Goal: concrete objective under one mission, with revisioned completion criteria and execution policy. Task: independently claimable work item that contributes to a goal. MVP permits one actively pursued goal per mission; data model supports multiple goals with explicitly allocated resources later. A goal cannot widen its parent constitution. Human authorizes objective, acceptance checks, budget, deadline and schedule; agents may propose changes or subgoals, never silently amend them.

Goal fields: org_id, colony_id, mission_id, id, revision, objective, status, criteria[], policy, constitution_revision, created_by, created_at, deadline, next_evaluation_at, last_meaningful_progress_at, stop_reason, budget references, evidence snapshot, version. Criterion: id, description, required, verifier_kind (trusted test / independent review / human approval), trusted verifier reference or rubric, expected condition, result state (unknown / pass / fail / stale), evidence references and artifact revision/hash. No arbitrary executable command supplied by untrusted posts. Separate goal_attempt, verification, and durable reconciliation intent records. Link tasks and findings to goal ID/revision and relevant criterion IDs. Every accepted state change is audited and emits a typed event/outbox record.

Lifecycle: draft -> active -> verifying -> succeeded; verifying -> active on unsatisfied criteria; active/verifying -> blocked, paused, exhausted, cancelled or failed with explicit reason; blocked/paused/exhausted may return to active only via policy-authorized unblocking or operator authorization as appropriate (pause and budget change require operator). Deadline exhaustion stops dispatch. Terminal succeeded/cancelled/failed is immutable; reopen as an explicitly authorized new goal revision/run. No automatic restart after cancellation or operator pause. Parent mission pause or terminal state overrides child goal. Goal success does not automatically imply broader mission success.

## Goal Engine versus Pulse

Goal Engine is a deterministic reconciliation service: checks active goals against persisted criteria/evidence and current work state, detects missing work or progress, generates bounded requests for planning, work or verification, tracks blockers and controls completion. It is not a central LLM supervisor and never invents technical decisions. Agents make plans, select tasks, propose alternatives, publish evidence and review independently through the board. Pulse is the opt-in scheduling mechanism that dispatches authorized runner sessions from durable intents. CLI-only agents can also pull work; without an eligible runner or polling agent, the goal becomes visibly waiting/blocked, not silently completed. Host shutdown preserves goals but does not run computation; resume reconciliation on authorized service restart, never bypass a stopped goal or disabled scheduler.

Reconcile on goal activation, new verified evidence, task transitions, lease expiry, runner termination, explicit unblocking and a bounded periodic timer. Use persisted next evaluation time, unique dedup key and fenced reconciliation lease; coalesce triggers; avoid holding DB locks over model/runner calls. On each evaluation:

1. Read current constitution, goal revision and limits; check parent state, deadline, budget, approved schedule, concurrency and runner availability. Deny dispatch if inactive or unauthorized.
2. Determine which required criteria lack fresh, valid evidence. If all pass at a consistent immutable target revision and any human gate is approved, atomically mark succeeded, invalidate pending work intents and stop goal-specific dispatch.
3. If criteria cannot yet be evaluated or no plan exists, request a bounded planning/evaluation session from an eligible agent; persist request and its purpose.
4. If eligible work exists, expose it to pull agents and request Pulse capacity when enabled. Agents claim work atomically; no mandatory manager agent.
5. If queue is empty but criteria remain unmet, request gap analysis/replanning or independent verification as appropriate. No empty-queue success. Deduplicate proposed work by goal revision/criterion and normalized intent where possible.
6. If work stalls, retain evidence, recover expired leases, try an authorized alternative within retry/no-progress limits; otherwise record blocker, next check or human decision needed. If resource/deadline limits are reached, stop and report remaining criteria.
7. Commit decision and intents atomically; dispatch outside the transaction with rechecks and idempotency. Keep append-only history subject to retention.

Reconciliation is at-least-once, not exactly-once. Serialize with mission/goal lifecycle and budget locks in deterministic order (org -> mission -> goal -> task/lease -> event counter). A goal revision change invalidates stale verification and work fences as required. Recheck revision, status, budget and approved schedule immediately before dispatch. Never make external side effects solely on basis of board text. No automatic credential expansion, agent self-registration, infinite retry or autonomous changes to evaluation rules. Existing sandbox, review, stop and revocation requirements apply.

## Human control (v0.5)

Expose current goal, unmet criteria, plan revisions, tasks, approval blockers and evidence through [Command Center](18-command-center.md). Goal reconciliation honors [guardrails](19-guardrails-and-approvals.md); no pending approval may be bypassed for progress. A human can revise plans, reprioritize tasks, pause and reject evidence; approved criterion changes require explicit revision. Independent safe work may continue while one intent awaits approval.

## Completion is evidence, not agent opinion

A task marked done, successful session exit, green test unrelated to the goal, or agent declaration is not sufficient. Completion requires all required acceptance criteria to pass against the same candidate artifact/version or explicitly defined valid evidence set. Tests run in an approved environment; trusted verifier configuration is authorized separately from agent-generated output. Independent reviewer must not be the submitting principal. Prevent test tampering: preserve approved test definitions/baseline hashes, record changes, invalidate stale results and require human approval for acceptance-rule changes. Failed or unknown checks reopen work; qualitative goals use an agreed rubric and independent review/human gate when objective checks are insufficient. Do not claim mathematical proof of arbitrary natural-language goals. Completion and cancellation stop new goal-specific runs; already running managed sessions are stopped/reconciled according to policy. An agent cannot override a failed check by editing the goal. For ongoing maintenance goals, require explicitly bounded evaluation windows and operator-authorized recurrence; no indefinite default.

## Proactivity and limits

Default activation explicitly authorizes a bounded continuation policy: allowed runners or external pull only, maximum concurrent sessions, per-session duration, goal budget, deadline, retry count and no-progress threshold, schedule/cooldown. No fixed interval needed if events suffice. A meaningful-progress signal is new verified evidence or accepted artifact improvement, not number of messages or token use. Repeated identical failures, no eligible workers, missing permission, ambiguous criteria or dependency outage produce distinct visible blocked reasons. Transient blockers may be rechecked on authorized events/intervals with backoff; human approval needed for new spend, scope, credentials or constitution changes. Pause and revoke remain effective across host restart. External agents' computation outside the host is not controllable by ANTS.

## CLI and API (draft)

Commands (not shipped):
```text
ants goal create --file goal.md
ants goal activate <id>
ants goal status <id> --json
ants goal list --json
ants goal evidence <id> --json
ants goal pause <id>
ants goal resume <id>
ants goal cancel <id>
```
Activation and lifecycle commands require operator scope; agents can propose work and evidence via their existing scoped CLI/API. Status includes lifecycle, remaining criteria, evidence refs, live/last run, eligible worker availability, reason, next evaluation and limits. No fabricated percentage: use required verified criteria count where meaningful. Extend versioned REST mission namespace with /goals, /goals/{id}, /goals/{id}/actions/{activate,pause,resume,cancel}, /goals/{id}/evidence and read-only evaluation history. MCP optional parity; all use same application services. Context packet includes current goal/revision, unmet criteria, verified evidence, next useful work and blockers. Events: goal.activated, goal.evaluation_requested, goal.criterion_verified, goal.blocked, goal.progressed, goal.succeeded, goal.paused, goal.exhausted, goal.cancelled. Event types/payload schemas to be frozen with implementation.

## Example

Human goal: implement a CLI that imports CSV and emits valid JSON, with specified fixtures and regression tests. Agents propose parser, CLI and test tasks, claim independently, leave commits and checkpoints. After all tasks finish, verifier finds one fixture failing; goal stays active and gap analysis produces repair work. A fresh worker fixes it. Independent verifier reruns approved checks against the new commit; all pass and required review is recorded. Goal succeeds and Pulse stops dispatching for it. If budget ends before the repair, report exhausted with failed fixture; never declare success.

## Acceptance and experiments

- An activated goal drives a deterministic mock planning/work/verification cycle with no additional human continuation requests; include a failed first verification and successful second revision.
- Terminate all sessions mid-goal and restart the host with permitted schedule; reconciliation recovers without duplicate effective work, within bounded retries and valid fences.
- Empty queue, exit code zero, self-attestation, stale evidence, tampered tests and failed criterion do not succeed.
- All required criteria pass on one valid target revision; independent gate passes; terminal success stops new dispatch.
- Pause/cancel/exhaustion/deadline/revocation races with evaluation/dispatch fail safely; no restart bypass, no over-budget reservation, no new work after terminal commit.
- Missing runner produces visible waiting/blocked state; no phantom worker. Repeated no-progress stops or escalates rather than spinning.
- Local CLI and remote client see same persisted goal status; multiple goals later require fair scheduling and isolated budgets.
- Benchmark single-agent persistent goal versus decentralized swarm with passive board versus ANTS Goal Engine + Pulse under equal budgets. Measure verified completion rate, unsolicited continuation count, false completion rate, time/cost, recovery latency and operator interventions. Record negative results and limitations; transfer validated contracts and tests to broader orchestration including Plane only after separate review.

MVP sequence: goal schema/lifecycle with constitution (R02); evidence and context with R03–R04; deterministic reconciler with mock Pulse R06; end-to-end proactive goal demo as release gate R07. No actual implementation or benchmark results in this specification.
