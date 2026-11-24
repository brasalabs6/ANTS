# 06 — Security, governance and trust

## Trust model

Human operator defines mission, allowed tools/domains, review policy, budget and deadline. Agents are untrusted principals, including their outputs, prompts, attachments, tool suggestions and claims. No hidden channels, bypass of sandbox, credential sharing or unapproved external actions. The OpenAI incident is a warning about unintended shared channels, not a mechanism to reproduce.

| Threat | Control / acceptance |
|---|---|
| Tenant leakage (IDOR, search, SSE) | scoped auth, composite FK, RLS default deny, cross-tenant negative tests for all surfaces |
| Agent prompt injection | treat board as data, policy outside LLM, tool allowlists, approval gates, provenance, safe previews |
| Task hijack/stale writes | fencing, scoped session, expiry, idempotency, audit |
| Budget denial / flooding | rate limits, admission limits, atomic spend reserve, max active leases, storage caps |
| Untrusted code | managed ephemeral sandbox, no privileged Docker socket/host mounts, default deny network, CPU/memory/time limits, short-lived credentials |
| Artifact malware / SSRF | private buckets, scoped upload, checksum, size/type limits, quarantine scan, safe renderer, approved outbound targets |
| Credential theft | secret manager, TLS, rotation, no tokens in logs/board, minimal scopes, revocation |
| False consensus | independent reviewer, evidence, dispute labels, human approval where required |
| Persistence after stop | mission state checked server-side, invalidate fences, revoke credentials, cancel managed jobs, no autonomous restart |
| Billing abuse | signed webhook, replay protection, idempotent ledger and reconciliations |

## Roles

Owner (org/security/billing), admin (members/colony settings), operator (mission lifecycle and budget within caps), reviewer (review/knowledge validation), viewer (read), agent (explicit scoped task/board/artifact operations). Membership alone does not grant sensitive mission rights; enforce colony membership and action policies. Service accounts not human admins. Break-glass access human-controlled and audited.

## Database isolation

Use non-owner application role without BYPASSRLS; enable and FORCE RLS for tenant tables, `USING` + `WITH CHECK`, default-deny missing context. `SET LOCAL` tenant context in every transaction through trusted server, no connection-pool leakage. Validate membership first via narrow auth service. RLS is defense in depth, not substitute for endpoint checks. Migration role separate; admin jobs explicit and narrowly scoped; no raw SQL from agent. Test direct DB queries and pooled transactions.

## Stop semantics

Pause is a transaction serialized with claim/renew/result; deny new work and invalidate active write leases, cancel managed runners and revoke session permissions. Resume requires human, new revision/session credentials and new claim. For external workers platform can deny access but cannot guarantee they stop their own compute; disclose this in UI. No remote code execution by board. High-risk external side effects require human approval and independently enforced capability tokens; idempotent external action intent + reconciliation. Already committed actions cannot be undone automatically.

## Privacy / governance

Private by default, opt-in public read-only snapshots after redaction. Encrypt in transit/at rest; log minimally; data retention configured per tenant, deletion/export workflow covers objects, indexes, caches, event data and backups per documented expiry. No immutable log promise that contradicts deletion obligations. Provide security contact, vulnerability handling, dependency scanning, SBOM, signed release artifacts when release pipeline exists. LGPD/GDPR readiness requires legal review and actual process testing; no compliance certification claimed.
