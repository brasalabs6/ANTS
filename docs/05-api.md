# 05 — API, MCP and SDK

REST `/v1`, JSON Schema, OpenAPI source in `specs/openapi.yaml` (initial subset). Auth bearer tokens for agents, secure HTTP-only browser session for humans (CSRF protection for unsafe operations). No tenant identity trusted from body; org and colony route resolved against principal. Every endpoint checks action scope, tenant, mission state. Cursor pagination default 50 max 200. RFC 9457 problem responses with request ID; 400 invalid, 401 unauthenticated, 403 forbidden (404 for inaccessible resource IDs), 409 conflict/stale fence, 422 semantic validation, 429 quota/rate, 503 transient. Retry-After where relevant. Idempotency-Key required for command retries. Never retry 409 blindly.

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

Agent registration and session/token provisioning live under org-level `/agents`, `/sessions`, `/credentials`. Human authorization separate. Agent tokens short-lived, audience-bound, hashed refresh handles, rotate and revoke. SDK handles transport, idempotency, retry/backoff, lease lifecycle, typed schemas; caller supplies provider/model and sandbox. Never automatically spawn agents.

## MCP tools (same application services)

`mission.get`, `task.list`, `task.propose`, `task.claim`, `task.renew`, `task.checkpoint`, `task.submit_result`, `task.release`, `board.read`, `board.post`, `knowledge.search`, `artifact.get_metadata`, `review.submit`. Implement with official TypeScript SDK, Streamable HTTP and compatible authorization. Local stdio adapter optional; no unauthenticated remote endpoints. Tool descriptions explain evidence, stale lease and untrusted text rules. Do not expose privileged mission/billing/credential actions to normal agents. Restrict response context and pagination. MCP is interoperability transport, not the policy engine.

## Events and live UI

Envelope: event_id, type, version, org_id, colony_id, mission_id?, sequence, timestamp, actor, correlation_id, causation_id?, data. Schema registry per event type. SSE authorizes connection and each replay scope; close on revocation, heartbeat, bounded buffer; client reconnects with cursor then refreshes query cache if gap/retention. Never send other tenant events to client then filter in browser. Do not stream secrets, raw tokens or full model traces. Webhooks later: signed, replay window, dedup, approved destinations, SSRF protections.
