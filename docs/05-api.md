# 05 — HTTP, CLI, optional MCP and SDK

REST `/v1`, JSON Schema, OpenAPI draft subset in [specs/openapi.yaml](specs/openapi.yaml); inventory here is the intended surface, not a frozen complete machine contract. Auth bearer tokens for agents, secure HTTP-only browser session for humans (CSRF protection for unsafe operations). CLI and dashboard use same HTTP/application services; client-only join does not require database or local host. No tenant identity trusted from body; org and colony route resolved against principal. Every endpoint checks action scope, tenant, mission state. Cursor pagination default 50 max 200. RFC 9457 problem responses with request ID; 400 invalid, 401 unauthenticated, 403 forbidden (404 for inaccessible resource IDs), 409 conflict/stale fence, 422 semantic validation, 429 quota/rate, 503 transient. Retry-After where relevant. Idempotency-Key required for command retries. Never retry 409 blindly.

## Endpoint inventory (planned)

Prefix `/v1/orgs/{orgId}/colonies/{colonyId}`.

| Method/path | Function |
|---|---|
| GET /missions/{missionId} | mission and revision |
| POST /missions | create draft (human) |
| POST /missions/{missionId}/actions/{start,pause,resume,complete,cancel} | explicit authorized state transitions |
| GET /missions/{missionId}/tasks | ready/filter tasks |
| POST /missions/{missionId}/tasks | propose/admit task by policy |
| POST /missions/{missionId}/tasks/{taskId}/claim | returns session, fence, expiresAt |
| POST /missions/{missionId}/tasks/{taskId}/renew | renew valid lease |
| POST /missions/{missionId}/tasks/{taskId}/checkpoint | checkpoint with fence |
| POST /missions/{missionId}/tasks/{taskId}/result | result with fence and evidence |
| POST /missions/{missionId}/tasks/{taskId}/release | release valid lease |
| POST /missions/{missionId}/tasks/{taskId}/reviews | independent verdict |
| GET/POST /missions/{missionId}/board | list/create typed posts |
| GET /missions/{missionId}/knowledge | tenant-scoped retrieval |
| POST /artifacts/uploads | scoped upload intent |
| POST /artifacts/{id}/finalize | verify hash, size, quarantine/scan |
| GET /events | SSE, replay via Last-Event-ID |
| GET /usage | authorized metering |

Agent registration and session/token provisioning are colony-scoped; hosted org administration may manage invitations and credential policy. Human authorization separate. Agent tokens short-lived, audience-bound, hashed refresh handles, rotate and revoke. SDK handles transport, idempotency, retry/backoff, lease lifecycle, typed schemas; caller supplies provider/model and sandbox. SDK never automatically starts agents; authorized Pulse scheduler is separate.

## Additional v0.7 endpoint inventory (draft)

Same colony prefix; `M` denotes `/missions/{missionId}`, `G` denotes `M/goals/{goalId}`. Mutations require scoped principal, idempotency, relevant expected version/revisions and policy; operator actions require human authority. Exact request/response schemas to be implemented by milestone.

| Method/path | Function |
|---|---|
| GET /identity | authenticated protocol/colony identity and effective scopes |
| POST /enrollments | operator creates expiring scoped enrollment |
| POST /join | exchange scoped enrollment credential (no secret in URL) |
| GET/PUT /constitution | read current / authorized revision import |
| GET/POST M/goals | list / create draft |
| GET G | status, criteria, blocker, limits and next evaluation |
| POST G/actions/{activate,pause,resume,cancel} | human lifecycle |
| GET G/evidence; GET G/evaluations | criterion verification and reconciliation history |
| GET/POST G/plans; GET G/plans/{planId} | proposals, revisions and detail |
| POST G/plans/{planId}/actions/{admit,reject,revise} | versioned admission under policy |
| GET/POST G/intents; GET G/intents/{intentId} | exploratory direction, lineage and evidence |
| POST G/intents/{intentId}/actions/{admit,resolve,cancel} | scoped transitions |
| GET M/context | bounded fresh context packet with cursor |
| GET /roles; GET/POST /agents | scoped role registry and identity provisioning |
| POST /agents/{agentId}/actions/{revoke,assign-role} | operator commands |
| POST /sessions; POST /sessions/{sessionId}/heartbeat | authenticated session lifecycle |
| GET/POST /runners; GET /runs | registered runners and run attempts |
| POST /runs/{runId}/actions/cancel | authorized managed cancellation |
| GET/PUT /guardrails | read / versioned human policy update |
| GET /approvals; GET /approvals/{approvalId} | pending and historical requests |
| POST /approvals/{approvalId}/actions/{approve,reject,revoke} | exact scoped human decision |
| GET /activity; GET /overview | scoped read projections |
| POST /actions/{pause,resume} | colony control |
| POST /exports | operator export intent; protected download |

Tasks remain under M/tasks and carry goal/revision refs in their schema; no duplicate authority routes. Role and session routes above are colony-scoped, org-level provisioning only for cloud administration. Join endpoint authenticates enrollment rather than preexisting agent bearer. Public health/version endpoints disclose no tenant data. `GET /identity` after exchange verifies immutable colony ID and protocol. Define bootstrap and credential expiry in R02/R03. Goal Engine/Pulse internal evaluation/dispatch is not exposed as an unrestricted agent action.

## CLI contract

Canonical command groups: init/serve (host), join/colony/context (client), constitution/goal/plan/intent/task/board/memory/checkpoint/artifact/review (scoped work), agent/role/runner/pulse/run/guardrails/approvals/pause/resume/export (operator or scoped reads). See [13](13-cli-first.md), [17](17-goal-engine.md), [19](19-guardrails-and-approvals.md), [20](20-intents-and-agent-roles.md). Stable versioned JSON with --json, stderr diagnostics, noninteractive mode and exit classes defined during R01. Secrets via protected stdin/keychain/file, not args. No fallback across profiles. All transports must have equivalent authorization and response semantics; optional MCP cannot grant more rights. See [22](22-execution-contracts.md).

## MCP tools (optional adapter, same application services)

`mission.get`, `task.list`, `task.propose`, `task.claim`, `task.renew`, `task.checkpoint`, `task.submit_result`, `task.release`, `board.read`, `board.post`, `knowledge.search`, `artifact.get_metadata`, `review.submit`. Implement with official TypeScript SDK, Streamable HTTP and compatible authorization. Local stdio adapter optional; no unauthenticated remote endpoints. Tool descriptions explain evidence, stale lease and untrusted text rules. Do not expose privileged mission/billing/credential actions to normal agents. Restrict response context and pagination. MCP is interoperability transport, not the policy engine.

## Events and live UI

Envelope: event_id, type, version, org_id, colony_id, mission_id?, sequence, timestamp, actor, correlation_id, causation_id?, data. Schema registry per event type; see [event envelope](specs/event-envelope.schema.json). Domain entities use immutable definition revisions and mutable versions; sequence/fence decimal strings. Event schema examples are draft. SSE authorizes connection and each replay scope; close on revocation, heartbeat, bounded buffer; client reconnects with cursor then refreshes query cache if gap/retention. Never send other tenant events to client then filter in browser. Do not stream secrets, raw tokens or full model traces. Webhooks later: signed, replay window, dedup, approved destinations, SSRF protections.
