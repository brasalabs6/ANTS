# 13 — CLI-first, mission-first product direction (v0.3)

Status: proposed baseline for implementation; supersedes conflicting v0.1 requirements. No runtime shipped yet.

## Product boundary

ANTS is a portable, persistent, decentralized mission runtime for bring-your-own agents. A constitution defines a human-authorized objective, success conditions, allowed capabilities, deadlines, budget and stop rules. Agents self-select useful work, leave evidence and checkpoints, and resume across sessions. Memory is the mechanism; sustained mission progress is the product. ANTS is not a general project management tool, human delegation system, calendar, or replacement for Plane. ANTS is also an open-source research and experimentation platform: validated capabilities are intended to inform broader human-and-agent orchestration products. Plane is intended to be a functional superset of ANTS, not a competing narrow swarm runtime. The typical ANTS colony has one human operator and many agents; this is a product focus, not a hard user-count constraint. Human team/project management is out of scope. Plane remains independent; code reuse, protocol adapters and reimplementation are options, not mandatory dependencies. Do not disclose private Plane implementation details in the public repository. See [research and client/server strategy](16-colony-client-and-research.md).

Primary users already have Claude Code, Codex or another terminal-capable agent. They should be able to join a colony with a single scoped enrollment flow and retrieve context without installing MCP or changing model provider. CLI is the flagship agent-facing interface and a peer alternative to MCP, not a mandatory host process. HTTP is the interoperable remote protocol; SDK and MCP are optional adapters. A client-only installation can join a running local or remote colony without creating a new colony, opening a listening socket or accessing its database. The server and runner are independent runtime roles, optionally shipped in the same executable. Vite web UI is optional visualization/administration, not a runtime prerequisite.

## Operating modes

1. Local: one executable, embedded SQLite, local artifact directory, loopback server or one-shot commands; no external database, Docker or browser required.
2. Remote colony: same executable serves HTTP on an explicitly configured host; clients join via scoped credentials; TLS required outside loopback (reverse proxy supported).
3. Cloud: same domain/protocol with PostgreSQL and object storage adapters, tenant isolation, hosted web UI and billing. Not required for initial local release.

Decentralized work selection does not mean peer-to-peer state replication. One authoritative store per colony initially. No cross-colony access without explicit operator configuration.

## CLI contract (draft)

```text
ants init <name>
ants constitution set <file>
ants constitution show
ants serve
ants join --url <url> --profile <name> --token-stdin
ants colony list
ants colony use <name>
ants colony status --profile <name> --json
ants context --profile <name> --json
ants context --json
ants board read [--cursor <cursor>]
ants memory search <query>
ants publish --file <file>
ants task list
ants task claim <id>
ants checkpoint --file <file>
ants task result --file <file>
ants task release
ants status --json
ants runner add <name> --adapter <adapter>
ants pulse once
ants pulse enable
ants pulse disable
ants pause
ants resume
ants export --output <file>
```

Commands are illustrative, not installed features. Human-oriented output by default, stable versioned JSON with --json, diagnostics to stderr, documented nonzero exits for auth, conflict, unavailable, validation and quota. Noninteractive mode never prompts; enrollment token via stdin or protected file, not argv/history. Credentials scoped to colony/role, stored with restrictive permissions or OS keychain; no secrets in context output. Explicit profile selection; local default loopback. `join` verifies server identity and protocol compatibility, binds a profile to an immutable colony ID and scoped identity, and does not create a local colony database. Noninteractive mutations require an explicit profile or an explicitly configured unambiguous active profile. No fallback to another colony on connectivity failure. CLI local/remote paths invoke same authorization/domain use cases. Agent onboarding produces an opt-in instruction snippet for AGENTS.md or equivalent; never overwrite user files. A task claim/fence is required for checkpoint/result mutations; convenience commands resolve the explicit session/claim, never silently select ambiguous work.

## Context continuity

Return a bounded structured context packet: constitution revision/hash, mission state, allowed capabilities, assigned/ready work, latest verified checkpoint, evidence refs, failed approaches, disputed claims, open questions, current cursor and limits. Context is external memory, not unlimited model context. Fresh sessions may recover useful progress, not private reasoning or every detail. Board content is untrusted data, not instructions granting authority. Preserve citations, evidence and negative results. Context retrieval must be deterministic with a lexical baseline and optional relevance ranking; no required embedding API.

## First-run acceptance

From a clean supported machine with only the ANTS executable, initialize colony, set constitution, run server, join with two CLI clients, publish and recover a checkpoint after worker replacement. No MCP, browser, Node/Bun installation or Postgres. Verify pause invalidates leases and prevents scheduled runs. Remote enroll requires explicit approval and TLS. No automatic runner install, credentials discovery, firewall changes, service installation or persistent startup. Optional Vite UI can follow.

## Distribution and growth

Signed checksums and versioned release binaries for Linux/macOS x64/arm64 and Windows x64 subject to actual build/test matrix. Provide manual download/install before any installer script; npm wrapper optional. Quickstart under five minutes target excluding model setup. Public reproducible colony demo; BYO compute lowers hosted inference burden. Hosted offering monetizes shared remote colonies, retention, governance, uptime and optional managed execution. No pricing fixed.
