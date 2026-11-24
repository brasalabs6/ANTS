# 08 — Vite frontend specification

> **Supersession notice (v0.2):** [CLI-first product](13-cli-first.md) and [portable architecture / revised roadmap](15-portable-architecture.md) take precedence over conflicting local MVP requirements in this document. Vite UI and MCP are optional; Bun/SQLite single executable first, cloud Postgres later.

Vite + TypeScript SPA for the product. Vite is the development server and build tool, not a UI framework. UI framework (or vanilla TypeScript), routing, local state and server-cache libraries are pending a separate decision before scaffolding; Vue and its ecosystem are not selected. Keep typed API clients, tenant-aware cache invalidation, SSE lifecycle, shared design tokens and reusable UI components independent of that choice where practical. Public landing/docs static initially; add SSR only for measurable SEO needs. No business authority in browser. API contracts generated from schemas. Lazy route chunks, accessible semantic HTML, keyboard navigation, reduced motion, responsive layouts, i18n English/pt-BR later.

## v0.5 operator baseline

[Command Center](18-command-center.md) supersedes any interpretation of the dashboard as a later optional product feature. It is required for public alpha, optional for runtime. Implement goals, revisioned plans, Kanban/list, agent sessions, approval inbox, guardrails, board and memory. [Guardrails](19-guardrails-and-approvals.md) defines server-enforced decisions. Vite/TypeScript remains selected; UI framework remains pending.

## Routes

`/` landing; `/login`; `/org/:orgId` organization; `/org/:orgId/colonies/:colonyId/overview`; `/missions/:missionId` nested tabs board/tasks/knowledge/artifacts/reviews; `/agents`; `/settings`; `/usage`; `/audit`. Deep links preserve scope. Empty/error/offline states and 403/404 views. URL filters shareable; no secret query strings. Tenant switch clears query cache and closes SSE.

## Screens

Colony overview: active missions, worker health (last seen, not presumed online), progress by accepted task, blockers, spend and pause button. Blackboard: typed posts, threads, search, evidence links, review badges, filters, live updates without disrupting scroll. Task graph: list/kanban first, dependency graph later with accessible list alternative; lease timer is approximate UI, server authoritative. Knowledge: verified/disputed/negative tabs, sources, revisions. Agents: credential creation once, capability list, revoke, onboarding snippet. Mission: objective, revision, policy, budget, human approvals and stop controls. Billing: usage vs limits, estimates and provider-billed vs platform-billed distinction.

## UX rules

No gamified autonomy or fake active-agent counts. Optional ant-themed illustrations or goblin skins are cosmetic. Indicate unverified results, pending review, stale checkpoint, budget exhaustion. Require explicit confirmation for destructive/admin actions. Optimistic UI only for reversible operations; claims and mission status wait for server. Render markdown sanitized, no remote active content. WCAG 2.2 AA target, verify via axe + manual keyboard checks.
