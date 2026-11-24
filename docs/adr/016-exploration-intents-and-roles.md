# ADR-016 — Exploration intents and replaceable agent roles

Status: proposed v0.6 baseline. Date: 2026-11-24.

Decision: distinguish durable exploratory intent from concrete task, goal, plan, scheduler run intent and approval action intent. Add Planner, Worker and independent Reviewer roles for MVP; Scout/Archivist/Liaison may be later specializations. Role is a bounded capability profile, not human authority. Planners propose revisioned strategies and directions; workers independently claim work and can propose new directions. One fenced admission/writer per planning revision, multiple alternative proposals allowed within policy. No permanent central LLM manager; Goal Engine owns deterministic reconciliation, Pulse handles authorized dispatch, evidence gates completion. Use relational lineage, not a required graph DB. Do not introduce offensive capabilities from inspiration projects.

Tradeoffs: richer domain and potential planning overhead; keep direct tasks valid without an intent, bounded triggers, optional specializations. Reject mandatory centralized planner-only work creation, a role label as authorization, and self-review via role switching. Benchmark different topologies before transferring to Plane.

See [20 — Intents and agent roles](../20-intents-and-agent-roles.md).
