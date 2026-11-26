# ADR-018 — Foundation toolchain and fixture storage

Status: proposed for independent review, 2026-11-26. Scope O01/O02/O04/O05 and R01 CLI subset of O07.

Context: bfd6af1fa02688cc6c2b9d353dfade42685141c9 passed native Linux x86-64 foundation checks. Both Bun and pnpm workspace spikes worked with frozen installs. Choose Bun 1.3.5 workspaces, one generated bun.lock, TypeScript 5.9.3, Bun Test and Biome 2.3.8 (MIT OR Apache-2.0); dev tooling is not part of runtime dependency surface. Alternatives pnpm/Turborepo and Vitest add tools without demonstrated need in this slice. Review lockfile provenance, licenses and vulnerability status before integration.

Use Bun SQLite with explicit typed prepared statements and immutable SQL migrations rather than ORM for this small fixture; UTC integer milliseconds, UUID strings, canonical decimal wire counters. WAL/local disk, foreign keys, bounded busy timeout, immediate migrations, SHA256 history. Scope keys are not authentication. Future schema and production indexing remain separate reviewed work. Roll back tool choice by reverting branch before integration; never rewrite applied migrations or reset user data. Restore consistent verified backup for incompatible DB changes.

Standalone native Linux and sample embedded asset succeeded; cross-target extraction failed and clean chroot denied. Prefer embedded assets subject to real Vite packaging later; no supported OS matrix yet. CLI JSON schema v1 is experimental; no stable public compatibility claim. See per-item checkpoints and CI for acceptance.
