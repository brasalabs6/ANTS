# ADR-017 — Consolidated specification and continuity discipline

Status: v0.7 documentation baseline, 2026-11-24.

Context: incremental v0.1–v0.6 specs left old technology, roadmap and integration assumptions beside revised decisions. A new contributor must not need a prior chat to recover current product intent.

Decision: one active baseline; root README and docs index point to context, cross-module contracts, requirements, canonical R01–R09 roadmap and handoff. Rewrite conflicting normative passages in place, keep Git history and explicit historical rationale. ADR-001/005 and portions of 002/003/008/012 are clarified or superseded for local MVP; preserve cloud applicability and tradeoffs. Detailed topic specs remain canonical within scope; cross-module rules in 22 resolve integration ambiguity. Any future contradiction requires an explicit ADR/owner decision and synchronized documentation, not silent interpretation. Distinguish user requirements, design defaults, pending decisions, implementation and verified results. No runtime feature claimed shipped.

Consequences: stable requirement IDs and acceptance evidence, self-contained handoff, traceability between plans and specs, fewer ambiguous implementation choices. Documentation is not a substitute for executable contracts, tests, security review or evidence. See [21](../21-project-context.md), [22](../22-execution-contracts.md), [23](../23-requirements.md), [24](../24-handoff.md).
