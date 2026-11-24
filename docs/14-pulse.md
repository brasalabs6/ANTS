# 14 — Pulse: authorized agent session scheduling

Pulse is a deterministic scheduler, not an LLM supervisor. It starts bounded work cycles only for operator-registered runners and active constitutions. External agents may also pull work without Pulse. Do not attempt to awaken a closed chat or third-party process lacking a supported authorized execution interface.

## Goal-driven dispatch

[Goal Engine](17-goal-engine.md) reconciles pending criteria and issues durable, bounded requests for planning, work or verification. Pulse dispatches only eligible authorized intents; it does not decide success. An empty queue can trigger goal gap analysis, not automatic completion. Stop new dispatch on goal success, pause, cancellation, exhaustion or invalid revision; reconcile pending and running sessions. No runner availability means visibly blocked/waiting. Existing schedule, approval, budget and sandbox limits apply.

## Role matching

[Agent roles](20-intents-and-agent-roles.md) are operator-authorized capability profiles. Select an eligible planner, worker or independent reviewer for the requested purpose; external agents may pull the same work. A missing planner is a visible blocker, not license to expand credentials. Scheduler run intents are distinct from exploration intents; preserve existing budget, scope, dedup and stop semantics.

## Runner types

Visitor: interactive existing agent calls CLI. Worker: externally managed polling client. Pulse runner: registered local/remote adapter that invokes a supported noninteractive agent with its own authorized credentials and sandbox. Candidate adapters: Codex exec, Claude Code print mode, custom fixed executable. Verify installed version and documented options; never bypass approvals or sandbox. See https://learn.chatgpt.com/docs/developer-commands and https://code.claude.com/docs/en/headless.

## Lifecycle

Operator registers runner with fixed executable/argv template, allowed workspace, environment allowlist, capabilities, max duration/concurrency, cost cap and trigger policy. Default disabled. Explicit enable and active mission required. Event, interval or manual trigger creates a durable run intent with dedup key. Coalesce bursts; enforce cooldown, concurrency and global/mission budget. Select eligible runner deterministically, reserve spend, acquire fenced run lease, snapshot constitution revision and context cursor, start isolated session. Agent selects work independently using CLI. Capture bounded logs and result evidence, finalize outcome, settle usage, release claims or let them expire. Never treat stdout as privileged command. No arbitrary shell interpolation from board text; pass structured arguments or stdin. Secrets only from approved provider config. Unknown cost under hard cap means no launch unless operator defines safe bounded policy.

## Dispatch contract and observability

Separate ExplorationIntent (direction), RunIntent (durable scheduling request), RunAttempt (actual execution), ActionIntent (controlled effect). RunIntent links goal/revision, role/purpose, trigger/dedup ID, schedule, scope, max cost/duration, policy revision and attempt count. RunAttempt links runner profile, session, fence, heartbeat, actual start/end, exit class, checkpoint refs and usage settlement. External polling client is not a managed run; observed heartbeat is not proof of process liveness. Dashboard/CLI shows pending, leased, running, blocked reason, terminal outcome, next eligible time and unknown external cost; no phantom agents. A runner that crashes after effect initiation must reconcile outcome before retry. Stop dispatch on policy revocation and respect [22](22-execution-contracts.md) common lock order. Deterministic mock runner is required for alpha; real unattended adapters require separate enforcement/security gate. Configured concurrency, deadline, budget, cooldown, attempts and no-progress threshold explicit, not infinite defaults.

## Scheduling invariants

Run states pending -> leased -> running -> succeeded/failed/cancelled/expired. Durable run intent, trigger ID unique, session identity and fence, heartbeat, deadline, budget reservation, attempt count. Crash reconciliation checks process identity and provider status before re-launch; never assume exactly-once execution. Bounded retries with backoff and dead letter; no infinite retry loop. Idle colony sleeps until eligible event or next authorized interval. No work or repeated failure stops/backs off; deadline, completion, pause, exhausted budget or revoked runner stops dispatch. No self-registration or self-granted new runners. Restart service does not silently re-enable disabled schedules.

Pause transaction invalidates leases and pending intents; terminate managed process group within grace period and reconcile actual cost. Remote workers receive revocation; ANTS cannot guarantee their external compute stops. No agent may restart Pulse, alter constitution, increase budget or expand access. Operator explicitly resumes with current revision. Service installation or OS autostart is opt-in.

## Human intervention

Dispatch and controlled effects must honor [guardrails and approvals](19-guardrails-and-approvals.md). A pending approval blocks its specific intent, not independent authorized work. Operator rejection/expiry denies that intent; pause/revoke invalidates pending grants and dispatch. UI is not the enforcement boundary.

## Security

Local runner is not a sandbox by itself. Production unattended execution requires verified OS/container isolation, network/file restrictions, resource caps, scoped credentials, explicit tool allowlists and approvals for sensitive side effects. Do not run untrusted code with host privileges. Manual visitor mode can ship before Pulse. Support deterministic mock runner for testing before real model adapters.

## Tests

Fake clock and fake runner: trigger dedup, max concurrency, reservation races, pause vs dispatch, crash before/after process start, lost heartbeat, late writes, bounded retries, deadline and exhausted budget, no runner available, service restart with disabled schedule, malformed board output, runner revocation. Demo: replace all agents and resume only from durable context; compare against no-memory control. Report measured results, not simulated claims.
