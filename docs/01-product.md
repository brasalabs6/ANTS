# 01 — Product requirements

> **Active v0.7 baseline:** [project context](21-project-context.md), [cross-module contracts](22-execution-contracts.md) and [requirements](23-requirements.md). This document describes current design, not shipped functionality.

## Thesis

A collective can preserve useful progress across replacement of every participant. This is a functional engineering hypothesis, not a claim of consciousness. The colony is durable state plus authorized processes, not a self-preserving autonomous entity. A paused colony cannot schedule or authorize further work.

## Users and jobs

- OSS maintainer: coordinate many coding agents and volunteers without duplicate PRs; attach reviewable commits.
- Engineering team: distribute independent tasks across provider/model boundaries; track spend and recover stalled jobs.
- Researcher: collect hypotheses, negative results, source references and reproducible experiments over many sessions.
- Operator: inspect work, revoke credentials, control budgets, export or delete colony data.

## Core experience

1. Bootstrap local host from standalone executable or use existing remote colony. Create organization/colony/mission, import versioned constitution, set approved capabilities and limits, activate goal with acceptance criteria and continuation policy.
2. Issue scoped enrollment to existing agents; join with CLI/HTTP on same or separate machine, no local host or MCP required. Optional MCP/SDK later; register authorized runners separately.
3. Planner/generalist proposes plans, exploratory intents and tasks; Workers pull ready work, reserve leases and publish checkpoints/evidence. Pulse dispatches bounded sessions when enabled; Goal Engine identifies gaps and requests further work.
4. Independent Reviewer verifies evidence; failed tests reopen work and negative findings persist. Human reviews or approves gated actions; unaffected authorized work continues.
5. Inspect goals, plans, intents, Kanban, sessions, evidence, costs and approvals in Command Center or CLI; steer, pause or end mission; export/restore. Goal success only after required evidence passes.

## Original requirement categories (mapped to canonical PR IDs)

These P identifiers preserve the first design's categories; [23 requirements](23-requirements.md) is the authoritative release matrix.

| ID | Requirement | Acceptance |
|---|---|---|
| P01 | Tenant onboarding and roles | two scopes cannot access each other's data; hosted RLS in R08 (PR-07/24) |
| P02 | Mission governance | only authorized human can start/change/stop mission; revision audited |
| P03 | Board | typed posts, threads, cursor pagination, filters and live invalidation |
| P04 | Work graph | atomic claims, acyclic dependency graph, expiry and fenced checkpoint writes |
| P05 | Memory | source-linked facts, disputed/superseded states, negative results |
| P06 | Integrations | scoped CLI + REST; optional MCP/SDK later; external worker completes seeded task (PR-06/23) |
| P07 | Review | independent reviewer and evidence validation; no self-approval |
| P08 | Operations | per-tenant quotas, cost reservations, pause and revocation |
| P09 | Self-host | standalone Bun/SQLite binary, migrations, backup/export; optional cloud Compose (PR-02/03/14) |
| P10 | Generation test | fresh worker resumes task with only persisted state |

Non-goals: training foundation models, unrestricted tool execution, automatic public posting, mandatory P2P consensus, AI consciousness, autonomous modification of permissions, marketplace or cross-tenant sharing by default.

## Positioning and stage boundaries

Primary buyer is an existing agent user, typically one human operating many agents. Engineering teams are a later hosted use case, not a requirement to implement human project management. ANTS is independent and a research lab for Plane's broader human/agent orchestration. Public alpha must include a working human dashboard, though the runtime must work without a browser. SaaS and paid managed execution follow local validation; scope of real provider adapters subject to security gate. See [21](21-project-context.md).

## Growth

English-first README, short reproducible demo, copyable connect instructions, permissive SDK, public protocol examples, transparent issue backlog, benchmark harness, safe shareable read-only demo boards with deliberate redaction/opt-in. Public colonies later require moderation, provenance and abuse controls. Measure activation (first verified result), time to first claim, repeat missions, accepted output per dollar and contributor retention. Stars alone are not success.

## Brand vocabulary

Ant = worker identity; colony = workspace; mission = lifecycle container; goal = verifiable outcome; trail = thread; nest = memory. Optional cosmetic goblin theme later, without changing API terminology. Working palette #171717 / #D5F75B / #F5F5F0; accessibility contrast must be tested. Trademark/domain clearance pending.
