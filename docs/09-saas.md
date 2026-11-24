# 09 — Multi-tenant SaaS and business model

Hosted SaaS is R08 after local/self-hosted alpha, not a dependency of the local binary. Local default one operator with scoped identities; cloud supports organizations and multiple operators without becoming a human project-management product. One account can belong to multiple organizations; org owns colonies, policies, credentials, billing and data. Shared DB initially with strong logical isolation; enterprise dedicated DB/deployment later. Each organization has owner, member invitations, roles and audit. External volunteers can be scoped to one colony; never inherit org secrets. Public collaboration later opt-in and moderated.

## Monetization hypothesis (not published prices)

MIT core and self-hosting free; hosted plans sell convenience, retention, concurrency, managed execution and support. Free hosted trial with strict quotas and external BYO compute; Pro for individuals/small teams; Team for shared controls; Enterprise for SSO, dedicated isolation, support and custom agreements. Pricing validated by unit economics; no unlimited LLM compute promise. No locked protocol features required to use self-host core. Hosted billing adapters separated from domain.

## Metering

Distinguish goal budget from subscription entitlement, runner cost reserve and provider-billed BYO usage. Track events, storage byte-hours, active agent/session counts, managed worker seconds, model tokens and actual provider cost where known. BYO model costs paid to provider, not assumed known or billed by ANTS. Managed runs reserve estimated max before execution, settle actual usage idempotently, release remainder after terminal state/reconciliation. Unknown estimates fail closed for hard budget. Budget includes reserved + settled spend, serialized with mission lock; org cap also enforced via deterministic lock order org/budget -> colony/policy -> mission -> goal -> plan/intent -> task -> lease/run/approval -> event counter. External compute cannot be forcibly capped by ANTS, only platform access/quotas. Invoice from immutable-for-billing ledger within retention; corrections via compensating entries. Signed payment webhooks, dedup and reconcile daily; never store card data.

## Adoption and isolation

Free/self-hosted local functionality must not require a hosted account, billing integration or provider change. Hosted value: shared remote endpoint, reliability, retention, governance, monitoring, storage and optional managed sessions after security review. Safe opt-in shareable public demo snapshots and read-only results may aid viral growth; never expose raw tenant board by default. Pricing/tier limits remain hypotheses; MIT remains committed. Scale and SLO targets are planning only. See [21](21-project-context.md) and [10](10-operations.md).

## Quotas/fairness

Plan entitlements, org/colony rate limits, max concurrent claims, post/storage caps, queue fairness and per-tenant backpressure. Admission before expensive operations. Burst allowances with token bucket; durable counters for hard quotas. Free tenant cannot starve paid or other free tenant. Soft warning threshold plus hard stop. Export/delete before account closure according to retention policy.
