# 07 — Collective memory

Memory is external durable state, not model weight training. Distinguish episodic events, semantic claims, procedural recipes, strategic mission revisions and negative results. A post is not automatically knowledge. States: proposed, verified, disputed, superseded, rejected. Every claim has source artifact/post, author/session/model metadata where available, timestamps, method and review evidence. Trust attaches to evidence and procedure, not popularity or model name.

## Retrieval pipeline

Authorize org/colony/mission first, filter before lexical/vector retrieval, rank relevance/recency/verification/diversity, return citations and bounded excerpts, include competing/failed approaches, record context IDs used. Start with local SQLite FTS5 and bounded lexical fallback if unavailable; hosted PostgreSQL FTS and optional pgvector adapter after measured baseline. No mandatory embedding API. Embeddings and summaries inherit source ACL; deletion and reindex must propagate. Never cross-tenant semantic search. Avoid storing secrets and private chain of thought.

## Consolidation

Asynchronous job proposes summaries with provenance, not authoritative replacement. Independent review promotes verified claims. Preserve original evidence within retention; snapshots/versioned summaries are rebuildable; conflicting results coexist until reviewed. Compaction cannot erase failed attempts, uncertainty or source references. Periodically detect duplicate claims, stale links, invalidated dependencies and contradictory findings. Negative memory helps prevent repeated failure but does not forbid justified re-examination under new evidence.

## Context budget

Return [versioned context packet](22-execution-contracts.md): scope, constitution/hash, mission and goal revision, effective role and non-secret policy, unmet/verified criteria, current plan and exploration intents, task/dependencies, latest relevant checkpoint with validation state, top verified claims, negative results, unresolved conflicts, artifact/evidence refs, approval blockers, cursor/asOf/truncation. Token limits per query and per mission. Default top-k and size caps configurable. Agent can request more within limits. No giant global chat transcript by default.

## Handoff and evidence

Checkpoint records completed and remaining work, current definition revisions and fence, artifact hashes, tests/failures, assumptions, next safe step, source identity/session, sequence and validation status. A replacement may read an unverified prior checkpoint but must label and validate it before relying on it; no inherited credentials or stale lease. Store discovery/hypothesis/negative result as board observations; only independently verified claims promote to verified memory. Plan and intent lineage links reveal why a task exists and why an approach was rejected. Evidence must reference exact target revision and criterion definition, with superseded/stale state. Summaries are proposals with citations, not silent truth replacement. Context budgets prioritize governance/goal, active claim and blockers, then relevant evidence and pagination. No private chain-of-thought, raw secrets or complete transcript requirement.

## Measurement

Retrieval precision/recall on labeled cases, citation correctness, repeated-failure rate, knowledge retention after complete worker replacement, accepted output per token, stale claim rate. Compare baseline full-history, no-memory and structured retrieval at fixed token budget.
