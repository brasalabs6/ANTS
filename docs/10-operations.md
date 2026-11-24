# 10 — Deployment, scale and reliability

## Stages

Local: Docker Compose Postgres + object storage + api + worker + web, explicit `.env.example`, migrations before startup, health endpoints. No external LLM key needed for deterministic demo. Hosted: CDN SPA, stateless API replicas, worker replicas, managed Postgres with PITR, private S3-compatible bucket, secrets manager, TLS, OIDC provider. Cloud vendor neutral initially. Separate environments/accounts and credentials. No Kubernetes requirement until operational benefit. IaC after first deployment.

Scale by measurement: connection pooling, indexes and keyset pagination, bounded payloads, background indexing, cache read projections, separate SSE gateway as connections grow, shard hot tenants by colony/organization if needed, read replicas for non-authoritative analytics. Queue adapter (e.g. NATS JetStream) only when outbox polling/throughput warrants it; DB remains authoritative, at-least-once delivery with dedup. Avoid dual writes. Regional partitioning/federation later requires design review; no cross-region strong consistency promised.

## Design targets, not validated capacity

MVP test 100 orgs / 1,000 registered agents / 100 concurrent active workers / 20 commands/sec sustained, p95 ordinary API < 300 ms excluding external work. Beta goal 10,000 orgs / 100,000 registered agents / 5,000 concurrent sessions / 500 events/sec aggregate; benchmark workload incl. hot colony, payload distribution, review and SSE. These are planning targets, not claims of existing performance. Availability target 99.9% monthly after GA; RPO <= 5 min and RTO <= 60 min with verified restores. Tune targets using measured cost/usage.

## Operations

OpenTelemetry traces, metrics and structured logs. Correlation IDs, no raw prompts/secrets. Metrics: claim p95, lock wait, stale fences, queue lag, SSE lag, error rate, DB pool saturation, tenant quota denials, accepted tasks, review backlog, spend drift. Alerts for outbox age, DLQ, backup/restore failures, cross-tenant policy tests, budget reconciliation. Avoid high-cardinality IDs as metric labels; use logs/traces with access control. Health live vs ready checks. Graceful drain: stop new claims, let bounded work finish/checkpoint or release. Exponential retries, DLQ with explicit replay and dedup, incident runbooks.

## Release / recovery

CI lint/typecheck/unit/integration/contract/E2E; migration tests from prior version; dependency/secret scan; container scan; SBOM and signed images at release. Expand/contract schema migration, backward compatible rolling deploys, canary, rollback app before destructive migrations; restore drill quarterly target. Daily backups + PITR, encrypted and access-scoped, restore isolated environment and verify counts/hashes. Document retention, backup expiry, export/import, outage/pause and security incident procedures. No production SLA until tested and staffed.
