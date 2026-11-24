# 10 — Deployment, scale and reliability

## Stages

Local: compiled Bun executable, SQLite data directory and private artifacts, explicit config and migrations; HTTP loopback default, optional Vite assets bundled or static fallback. No Docker/Postgres/Node/Bun install required for end user. Remote self-host: same executable on approved VPS, TLS via configured proxy, scoped enrollment, protected data dir; no automatic firewall/service/autostart changes. Optional Docker Compose for hosted Postgres/object-store deployment, not local prerequisite. Health endpoints and migration readiness. No external LLM key needed for deterministic demo. Hosted: CDN SPA, stateless API replicas, worker replicas, managed Postgres with PITR, private S3-compatible bucket, secrets manager, TLS, OIDC provider. Cloud vendor neutral initially. Separate environments/accounts and credentials. No Kubernetes requirement until operational benefit. IaC after first deployment.

Scale by measurement: connection pooling, indexes and keyset pagination, bounded payloads, background indexing, cache read projections, separate SSE gateway as connections grow, shard hot tenants by colony/organization if needed, read replicas for non-authoritative analytics. Queue adapter (e.g. NATS JetStream) only when outbox polling/throughput warrants it; DB remains authoritative, at-least-once delivery with dedup. Avoid dual writes. Regional partitioning/federation later requires design review; no cross-region strong consistency promised.

## Design targets, not validated capacity

Hosted engineering load-test target (not local alpha gate): 100 orgs / 1,000 registered agents / 100 concurrent active workers / 20 commands/sec sustained, p95 ordinary API < 300 ms excluding external work. Beta goal 10,000 orgs / 100,000 registered agents / 5,000 concurrent sessions / 500 events/sec aggregate; benchmark workload incl. hot colony, payload distribution, review and SSE. These are planning targets, not claims of existing performance. Availability target 99.9% monthly after GA (hosted target); RPO <= 5 min and RTO <= 60 min with verified restores. Tune targets using measured cost/usage.

## Local recovery and distribution

Validate compile and smoke test on clean Linux, then supported OS/architecture matrix before publishing claims. Verify SQLite foreign_keys/WAL, busy retry, migrations, FTS fallback, binary asset packaging, no required external services. Local backup uses SQLite backup API or quiesced DB + artifact snapshot, checksums and scoped manifest; restore disabled runners, re-enroll secrets, reject path traversal and invalid hashes. Do not copy only live DB or place WAL DB on network filesystem. Document atomic upgrade/migration rollback and export before upgrade. Provide signed checksums, manual install instructions, optional wrappers. Real provider credentials and CLI install are separate prerequisites. Headless and browser use same runtime.

## Operations

OpenTelemetry traces, metrics and structured logs. Correlation IDs, no raw prompts/secrets. Metrics: claim p95, lock wait, stale fences, queue lag, SSE lag, error rate, DB pool saturation, tenant quota denials, accepted tasks, review backlog, spend drift. Alerts for outbox age, DLQ, backup/restore failures, cross-tenant policy tests, budget reconciliation. Avoid high-cardinality IDs as metric labels; use logs/traces with access control. Health live vs ready checks. Graceful drain: stop new claims, let bounded work finish/checkpoint or release. Exponential retries, DLQ with explicit replay and dedup, incident runbooks.

## Release / recovery

CI lint/typecheck/unit/integration/contract/E2E; migration tests from prior version; dependency/secret scan; container scan; SBOM and signed images at release. Expand/contract schema migration, backward compatible rolling deploys, canary, rollback app before destructive migrations; restore drill quarterly target. Hosted daily backups + PITR, encrypted and access-scoped, restore isolated environment and verify counts/hashes. Document retention, backup expiry, export/import, outage/pause and security incident procedures. No production SLA until tested and staffed.
