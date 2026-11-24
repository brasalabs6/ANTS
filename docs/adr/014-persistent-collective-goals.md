# ADR-014 — Persistent collective goals as a first-class capability

Status: proposed implementation baseline v0.4. Date: 2026-11-24.

Context: agents should not depend on repeated human continuation prompts. Codex Goals motivate persistent objectives with verifiable completion; ANTS needs colony-scoped continuity across workers.

Decision: separate constitution, mission, durable goal, and tasks. Add a deterministic Goal Engine which reconciles evidence and remaining work, requests planning/work/verification via authorized Pulse or external pull, and marks success only after required criteria are verified on a valid target revision. Persist evaluation intent, reasons, limits and history. No central LLM required. Empty queue or ended session does not imply success. One active goal per mission in MVP; extensible schema. Explicit operator activation, limits and stop controls; blocked/exhausted outcomes are honest alternatives to success.

Alternatives: passive board only (requires human nudges); prompt-only persistence (lost with session); unconditional infinite loop (cost and safety failures); agent self-attestation (false completion). Rejected.

Consequences: goal lifecycle and verifier contracts become core MVP; mock-runner reconciliation and evidence-based end-to-end demo gate release. Separate scheduling from outcome evaluation, preserve fences and transaction order, benchmark continuation and false completion. No promise of guaranteed completion or uptime. Plane may adopt validated capabilities without requiring ANTS deployment.

See [17 — Goal Engine](../17-goal-engine.md).
