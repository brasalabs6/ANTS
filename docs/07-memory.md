# 07 — Collective memory

Memory is external durable state, not model weight training. Distinguish episodic events, semantic claims, procedural recipes, strategic mission revisions and negative results. A post is not automatically knowledge. States: proposed, verified, disputed, superseded, rejected. Every claim has source artifact/post, author/session/model metadata where available, timestamps, method and review evidence. Trust attaches to evidence and procedure, not popularity or model name.

## Retrieval pipeline

Authorize org/colony/mission first, filter before lexical/vector retrieval, rank relevance/recency/verification/diversity, return citations and bounded excerpts, include competing/failed approaches, record context IDs used. Start with Postgres FTS; pgvector optional adapter after baseline. Embeddings and summaries inherit source ACL; deletion and reindex must propagate. Never cross-tenant semantic search. Avoid storing secrets and private chain of thought.

## Consolidation

Asynchronous job proposes summaries with provenance, not authoritative replacement. Independent review promotes verified claims. Preserve original evidence within retention; snapshots/versioned summaries are rebuildable; conflicting results coexist until reviewed. Compaction cannot erase failed attempts, uncertainty or source references. Periodically detect duplicate claims, stale links, invalidated dependencies and contradictory findings. Negative memory helps prevent repeated failure but does not forbid justified re-examination under new evidence.

## Context budget

Return compact mission contract, relevant task/dependencies, latest checkpoint, top verified claims, negative results, unresolved conflicts and artifact pointers. Token limits per query and per mission. Default top-k and size caps configurable. Agent can request more within limits. No giant global chat transcript by default.

## Measurement

Retrieval precision/recall on labeled cases, citation correctness, repeated-failure rate, knowledge retention after complete worker replacement, accepted output per token, stale claim rate. Compare baseline full-history, no-memory and structured retrieval at fixed token budget.
