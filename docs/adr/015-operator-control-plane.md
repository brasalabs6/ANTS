# ADR-015 — Human operator control plane is an MVP requirement

Status: proposed baseline v0.5. CLI-first remains agent-facing; headless runtime remains supported. Dashboard is a public alpha release requirement, not a runtime dependency.

Decision: deliver Vite/TypeScript Command Center with goal/plan/task Kanban, swarm/session inspection, evidence, approval inbox and guardrails. Use authoritative shared API and event projections; human actions are authenticated, revisioned commands. Add plan revisions and typed approval intents. Deterministic policy allow/require_approval/deny; no approval bypasses hard deny, no unbounded execution. Separate human governance from agent work selection. Build minimal dashboard alongside core slices; test real operator workflows before release. Optional graph/timeline enhancements after core Kanban. Prefer embedded static assets if packaging validated.

Alternatives rejected: CLI-only product launch, dashboard as passive metrics only, unconditional autonomous execution, required human approval for every routine task. Preserve one-human-to-many-agent product focus; do not expand into human project management.

See [Command Center](../18-command-center.md) and [Guardrails](../19-guardrails-and-approvals.md).
