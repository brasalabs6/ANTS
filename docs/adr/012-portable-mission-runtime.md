# ADR-012 — Portable mission runtime, CLI-first

Status: proposed implementation baseline, supersedes conflicting v0.1 architecture and roadmap. Date: 2026-11-24.

Context: users already bring agents; friction from MCP setup and lost context. ANTS must focus on constitution-driven collective mission continuity rather than overlap with general project/task management. A local runtime must not require a cloud stack.

Decision: TypeScript on Bun; compile the CLI/server entrypoint via bun build --compile; SQLite via bun:sqlite for local mode; Bun.serve HTTP; optional Vite UI; PostgreSQL and object storage adapters for later cloud. Keep pure domain and application ports runtime-independent where practical. CLI first, HTTP second, optional MCP/SDK after core. Pulse is opt-in scheduler with explicit runner permissions, stop conditions and budgets. No P2P consensus in MVP.

Alternatives: Node SEA (viable but packaging requires separate validation); Go/Rust (portable binaries but violates current TypeScript decision); Docker/Postgres-only (too much onboarding friction); browser-first SaaS (weak fit for terminal agents).

Consequences: test Bun compatibility, binary size, target OS/arch, SQLite FTS5 availability, migrations, embedded assets and release signing. Binary includes runtime but mutable database/artifacts are separate. SQLite WAL requires local filesystem, single authoritative writer/coordinated transactions, busy timeout and bounded retries; no shared network filesystem or direct distributed database access. Cloud Postgres is separate adapter with contract/concurrency tests; SQLite and Postgres SQL semantics differ. Never promise identical scaling. Default bind loopback, remote TLS/auth explicit. Runtime dependency choices remain subject to a build spike.

References: https://bun.sh/docs/compiler/executables ; https://bun.sh/docs/runtime/sqlite ; https://nodejs.org/api/single-executable-applications.html .

See [CLI/product direction](../13-cli-first.md), [Pulse](../14-pulse.md), [portable architecture](../15-portable-architecture.md).
