# CLI interface contract (draft v0.7)

No command is shipped. This is the intended ergonomic surface for existing terminal agents and human operators. Canonical authorization and state are server-side; no CLI or MCP bypass.

## Modes and examples

Host bootstrap: ants init NAME; ants constitution set FILE; ants serve. Proposed loopback 127.0.0.1:7337. Explicit data dir and operator ownership. Remote TLS and scoped auth required. Client: ants agent invite (operator enrollment, exact syntax pending); ants join --url URL --profile NAME --token-stdin; ants colony list; ants colony use NAME; ants context --profile NAME --json. Client-only join never starts host, initializes database or opens listener. No automatic fallback. Human operator and agent credentials distinct.

| Group | Intended commands / purpose |
|---|---|
| constitution | set FILE, show; operator-approved revision |
| goal | create --file FILE, activate ID, status ID --json, list --json, evidence ID, pause/resume/cancel ID |
| plan | list --goal ID, propose --file FILE, show ID, operator/policy admit/reject/revise |
| intent | list --goal ID --json, propose --file FILE, show ID --json, scoped resolve/admit/cancel |
| task | list, claim ID, renew, result --file FILE, release; require explicit session/fence or unambiguous current claim |
| checkpoint | --file FILE; include task revision, claim fence and evidence refs |
| board | read --cursor CURSOR, publish --file FILE (typed post, not authorization) |
| memory | search QUERY; bounded scoped source-linked results |
| agent / role | status, role list, scoped enrollment/assignment/revoke |
| runner / pulse / run | runner add NAME --adapter ADAPTER, pulse once/enable/disable, run cancel ID (operator; explicit limits) |
| guardrails / approvals | guardrails show/set --file FILE, approvals list/show/approve/reject/revoke with reason and expected version |
| pause / resume / export | colony-wide operator control; export --output FILE |
| status / context | --json, profile and scope, last state, blockers, limits and evidence |

Exact flags for commands not yet detailed remain pending R01–R06; no compatibility promise until implemented. Context example in [examples](examples/context.example.json), domain rules [22](../22-execution-contracts.md). Never place tokens in command arguments, URL, logs, context or board. Use protected stdin/file or OS keychain. No commands auto-install model providers or enable OS autostart.

## Machine interaction

Stable schema-versioned JSON on stdout with --json, diagnostic stderr, UTF-8, no ANSI/progress output in JSON mode, noninteractive mode never prompts. Paginated result envelope items/cursor/truncated; context includes asOf and fresh/stale flag. Proposed exit codes for R01 validation: 0 success; 2 usage/validation; 3 auth/forbidden; 4 not found; 5 conflict/stale fence; 6 rate/quota; 7 unavailable/timeout; 1 unexpected error. No work available is a successful empty list, not fake error; claim conflict is 5. Error JSON includes code, message, request ID, retryability and safe next step; never secrets. HTTP mapping in [05](../05-api.md); explicit 409 handling, idempotent safe retries only. Freeze exact names after contract tests. Mutating operations carry idempotency key and relevant expected revision/fence; same request retry must not duplicate work. Operator approvals require current decision scope and exact action; no blanket permissions.

## Onboarding instructions for agent users

Provide optional copyable AGENTS.md/agent-specific snippet: use configured profile, retrieve context before work, select eligible task, claim, renew, checkpoint with evidence, submit, release/stop on invalid fence, honor policy and report blockers. Do not overwrite existing agent instructions, pretend session history persisted, or require MCP. Supported providers verified separately; agent needs its own installed/authenticated runtime. CLI client only needs ANTS binary and network path. Operator dashboard optional at runtime but required alpha deliverable.
