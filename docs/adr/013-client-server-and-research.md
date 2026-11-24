# ADR-013 — Agent-first client/server and research boundary

Status: proposed baseline for implementation. Date: 2026-11-24. Clarifies ADR-012.

Context: CLI was requested as an alternative to MCP for existing agents. A single binary is a useful distribution option but must not imply every client hosts a colony. ANTS also serves as an experimental product validating capabilities intended for broader human/agent orchestration. Plane is intended to have ANTS capabilities plus human/project management.

Decision: target one human operator to many agents as the typical ANTS use case, without hard-coding a one-user limit. Separate client, colony host and authorized runner roles, with CLI and optional MCP adapter using the same remote contract. Join an existing local or remote colony without initializing a local database or starting a server. Named profiles, scoped credentials, explicit endpoint/colony identity and loopback/TLS policy. One Bun executable may package these roles; boundaries remain independently testable. Keep ANTS independent and instrument experiments for transferable evidence, contracts, fixtures and optional domain libraries. No mandatory Plane runtime dependency or shared data.

Alternatives: MCP-only (onboarding friction); client always starts host (duplicates state, breaks shared colonies); merge products now (scope creep); hard one-human constraint (limits governance/recovery). Rejected for MVP.

Consequences: client contract tests must work without database services; host owns persistent state; runner auth independent; research results require reproducible baselines and safety checks. Transfer into Plane requires separate adoption review, especially for multi-human/project workflows and scale. Public repository contains only product-level strategy, not private implementation details. If binary packaging becomes cumbersome, split distributables while preserving protocol semantics.

See [16 — Client/server and research strategy](../16-colony-client-and-research.md).
