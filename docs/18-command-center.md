# 18 — Command Center: human operation and observability

Status: v0.5 proposed MVP baseline. Extends 08, 13–17. Browser is optional at runtime; a functional operator dashboard is required for the initial public product release. Headless deployments remain fully supported. No implementation exists yet.

## Principle

Agent-first does not mean human-excluded. One operator typically governs many autonomous agents. The operator can observe all authorized colony activity, set goals, inspect and amend plans, create and prioritize tasks, review evidence, approve or reject actions, set guardrails and pause execution. The dashboard is a control plane, not a central LLM orchestrator. All actions use the same versioned HTTP/application services as CLI and optional MCP. Plane remains a separate broader orchestration product; validated UI/protocol concepts can transfer.

## Information architecture

| View | Required MVP content |
|---|---|
| Overview | colony state, active goal, verified criteria, runnable/blocked work, active sessions, pending approvals, budget and last event |
| Goals | create/activate/pause/cancel, criteria and evidence, blockers, revisions, evaluation history, completion gate |
| Plans | revisioned agent/human proposals, rationale, goal criteria links, dependencies, alternatives, approval policy, change diff |
| Tasks | Kanban and accessible list, filters by goal/plan/agent/priority, dependency and lease detail, checkpoint/evidence, authorized create/reprioritize/cancel/reopen |
| Swarm | agent identity vs session, provider/model when known, last heartbeat, current claim, runner, observed status, session history, revoke/stop managed run |
| Blackboard | typed threaded posts, discoveries, blockers, questions, negative results and links |
| Memory | searchable claims, provenance, verified/disputed/superseded states, artifacts and checkpoints |
| Approvals | pending requests, exact action/diff, justification, scope, cost/impact, evidence, expiry, approve/reject with reason |
| Guardrails | constitution/policy revisions, allowed capabilities, action approval rules, budgets, schedule, concurrency, runner/workspace restrictions, pause and revoke |
| Activity | chronological audited state changes and event replay, filter by actor/goal/task/run, sanitized logs |

Dependency graph, timeline and detailed run visualization complement Kanban; an accessible list is always available. Graph can follow MVP if needed, but plan/task relationships and dependency status must already be visible. No fabricated online status or completion percentages. Counts derived from authorized persisted state, distinguish last known vs live, proposed vs verified.

## Intents and roles (v0.6)

Expose an Intents list/filter with hypothesis, parent goal/plan, linked tasks, evidence, resolution and blockers. Swarm view distinguishes authorized role, capability, model and current session. Plans show alternatives and revision lineage. Add a provenance graph as an enhancement; list views remain accessible. Human admission/role changes are authenticated commands and cannot bypass guardrails. See [20](20-intents-and-agent-roles.md).

## Plan model

Plan is a revisioned proposal to achieve a goal, not a mandatory centrally assigned workflow. Fields: org/colony/mission/goal ID and goal revision, plan ID/revision, author, rationale, criterion coverage, task/dependency references, assumptions, status draft/proposed/accepted/rejected/superseded, approval policy and provenance. Multiple alternative plans may coexist; acceptance does not change constitution or permissions. Agents can propose or revise plans within policy. Operator can edit by creating revision, accept/reject, reprioritize or request revision. Invalidate affected work/verification using existing fences and revision semantics; preserve historical rationale. Independent ready tasks can progress in parallel. Do not require human approval of every plan under an explicitly enabled autonomous policy.

## Kanban

Columns: Proposed, Ready, In progress, Blocked, In review, Done, plus archived/cancelled filter. Awaiting approval is a distinct blocker/review badge or filter, not an ambiguous success state. Columns are projections of authoritative task states, dependency satisfaction and approval state. Blocked reason is explicit; done only after required verification. Cards show goal, criterion, plan revision, priority, current claimant, lease expiry (approximate UI), review state, latest checkpoint and blocking reason. Drag/drop issues an authorized transition command with expected version and reason; server checks prerequisites, ownership, approval and fences. Never allow dragging into Done to bypass verification or moving a leased task to another worker without invalidation. Conflict refreshes state and explains reason. Keyboard/list alternative to drag/drop. No human-team HR or portfolio management in ANTS MVP.

## Operator modes

Observe-only: no mutations. Guided: operator chooses which plan/goal/action classes require approval. Autonomous within policy: ordinary work proceeds without prompts; explicit sensitive actions still require configured approval, forbidden actions remain forbidden. These are UX presets, not permission escalation. Server policy default deny for unclassified external side effects and unenforceable actions; no unrestricted mode. Mode switch is an authorized versioned policy change, not an agent choice. Human may post a correction, request investigation, revise plan, adjust priority, pause goal/colony, stop authorized run, revoke agent or reject result. No silent alteration of accepted evidence. Resume requires explicit authorization where stopped by operator.

## UX and transport

TypeScript + Vite, framework selection remains pending. Reuse typed contracts and server-side policy. Layout: colony switcher, left navigation, main workspace, optional detail drawer; prominent persistent pause control and pending approval count. Local server should serve built static dashboard assets from same origin when packaging spike succeeds; separate static bundle fallback is acceptable, no external CDN required for offline local use. Default loopback, authenticated operator session, CSRF protection, TLS remotely, no credential in URL or browser localStorage. Use scoped SSE with replay cursor and snapshot reconciliation, bounded batches, pagination, virtualization for long boards, stale/disconnected indicator, no fake optimistic success for consequential actions. No browser tab required for scheduler. Human-readable activity derived from typed events, no private model reasoning or raw secrets. Sanitized previews, artifact ACL, accessible keyboard/navigation and contrast. Dashboard can be disabled for headless installations. CLI provides equivalent governance actions with explicit profile/scope.

## Release gate

Public alpha must demonstrate creating/activating a goal, inspecting plan and Kanban, watching two parallel workers, inspecting evidence, approving/rejecting a gated request, enforcing a denial, pausing and resuming, and verifying final success after failed criteria/recovery. Browser closure does not stop authorized goal pursuit. Test client disconnect/replay and stale approvals. No hosted or real unattended runner release before security/approval enforcement tests. Reference ARTEX only for generic dashboard/task/session visualization and operator visibility, not offensive capabilities; original repository withdrawn in October 2026. See [Reuters reporting](https://www.reuters.com/world/china/chinese-developer-makes-artex-ai-agent-closed-source-after-korean-bank-hack-2026-10-09/) and [WIRED reporting](https://www.wired.com/story/artex-ai-hacking-tools). No source copied or runtime audited.
