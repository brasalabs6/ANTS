# 08 — Vite frontend specification

> **Active v0.7 baseline:** [project context](21-project-context.md), [cross-module contracts](22-execution-contracts.md) and [requirements](23-requirements.md). This document describes current design, not shipped functionality.

Vite + TypeScript SPA for the product. Vite is the development server and build tool, not a UI framework. UI framework (or vanilla TypeScript), routing, local state and server-cache libraries are pending a separate decision before scaffolding; Vue and its ecosystem are not selected. Keep typed API clients, tenant-aware cache invalidation, SSE lifecycle, shared design tokens and reusable UI components independent of that choice where practical. Public landing/docs static initially; add SSR only for measurable SEO needs. No business authority in browser. API contracts generated from schemas. Lazy route chunks, accessible semantic HTML, keyboard navigation, reduced motion, responsive layouts, i18n English/pt-BR later.

## Operator baseline

[Command Center](18-command-center.md) supersedes any interpretation of the dashboard as a later optional product feature. It is required for public alpha, optional for runtime. Implement goals, revisioned plans, exploration intents, Kanban/list, agent roles/sessions, approval inbox, guardrails, board, memory, Pulse and activity. [Guardrails](19-guardrails-and-approvals.md) defines server-enforced decisions. Vite/TypeScript remains selected; UI framework remains pending.

## Routes

`/` landing; `/login`; `/org/:orgId` organization; `/org/:orgId/colonies/:colonyId/overview`; `/missions/:missionId` nested tabs goals/plans/intents/tasks/board/knowledge/artifacts/reviews; colony-scoped `/agents`, `/pulse`, `/approvals`, `/guardrails`, `/activity`, `/settings`, `/usage`. Local single-org mode may hide org switcher, not bypass scope. Deep links preserve scope. Empty/error/offline states and 403/404 views. URL filters shareable; no secret query strings. Tenant switch clears query cache and closes SSE.

## Screens

Colony overview: active missions, worker health (last seen, not presumed online), progress by verified required goal criteria (task counts separately), blockers, spend and pause button. Blackboard: typed posts, threads, search, evidence links, review badges, filters, live updates without disrupting scroll. Task graph: list/kanban first, dependency graph later with accessible list alternative; lease timer is approximate UI, server authoritative. Knowledge: verified/disputed/negative tabs, sources, revisions. Agents: credential creation once, capability list, revoke, onboarding snippet. Mission: objective, revision, policy, budget, human approvals and stop controls. Billing: usage vs limits, estimates and provider-billed vs platform-billed distinction.

## Interaction contracts

Overview shows actual status, budget/unknown cost and pending gates. Goal detail includes criterion evidence and next evaluation. Plan/Intent detail includes revisions, rationale, alternative proposals, lineage and negative outcomes. Kanban projections: Proposed, Ready, In progress, Blocked, In review, Done; cancelled filter. Drag/drop uses authorized transition + expected version; no direct Done bypass. Approval detail shows exact action hash/target, diff, rationale, expiry and effect status; rejection reason persists. Swarm separates role, session, heartbeat and runner mode. Pulse shows schedule, run state, blockers and operator controls. Persistent pause action; user can govern by CLI too. SSE scoped replay, reconnect, stale state, snapshot resync; browser closure does not stop scheduler. Accessibility keyboard and list alternative. Embedded assets preferred if R01 succeeds; otherwise separate static bundle. Graph/timeline enhancement later, lineage required from start. See [18](18-command-center.md), [19](19-guardrails-and-approvals.md).

## UX rules

No gamified autonomy or fake active-agent counts. Optional ant-themed illustrations or goblin skins are cosmetic. Indicate unverified results, pending review, stale checkpoint, budget exhaustion. Require explicit confirmation for destructive/admin actions. Optimistic UI only for reversible operations; claims and mission status wait for server. Render markdown sanitized, no remote active content. WCAG 2.2 AA target, verify via axe + manual keyboard checks.
