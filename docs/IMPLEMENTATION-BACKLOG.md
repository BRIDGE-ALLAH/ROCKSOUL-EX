# ROCKSOUL-EX — Implementation Backlog

## M0 — Extension foundation

- [x] Package manifest, ESM entry point, commands, and Activity Bar UI.
- [x] Node unit test runner and syntax check.
- [x] CI matrix for Node 20/22.
- [x] VS Code Extension Host smoke-test harness.
- [x] VSIX packaging workflow.

## M1 — THE WITNESS

- [x] Read-only bounded file discovery and project report.
- [x] Secret, credential, dependency, generated, binary, and symbolic-link exclusions.
- [x] Custom path exclusions and scan-size limits.
- [x] Root and nested .gitignore rules, including anchored paths, globstar, directory-only patterns, and negation.
- [x] Git root, branch, clean/dirty state, and bounded status summary.
- [x] In-memory incremental file cache with file-identity/timestamp invalidation.
- [x] Added/changed/removed file comparison against the previous scan in the same extension session.
- [x] No-follow file opening, inode verification, and resolved-path boundary checks.
- [ ] Multi-root aggregate reporting, cancellation stress tests, and large monorepo profiling.

## M2 — THE MEMORY

- [x] Confirmed .rocksoul bootstrap; missing files only.
- [x] Mission Markdown records and versioned index.
- [x] Nested symlink-safe storage access.
- [x] Session handoff and evidence log.
- [ ] Data migrations, freshness checking, and deletion UI.

## M3 — THE MISSION

- [x] Mission validation, acceptance criteria, and status transition guard.
- [x] Mission creation and tree navigation.
- [x] Human-reviewed criterion coverage gates Verified closure.
- [ ] AI decomposition, overlap detection, richer detail, and mission templates.

## M4 — THE FORGE

- [x] Provider port via direct Responses API adapter.
- [x] SecretStorage credential management.
- [x] Explicit provider/context disclosure.
- [x] Structured patch schema and response validation.
- [x] Mission-scope/path/security policy.
- [x] Native diff preview, explicit apply/reject, and apply-time hash validation.
- [x] Durable transaction journal and pre-write backups in extension global storage.
- [x] Per-file atomic replacement, rollback on failure, and conflict-safe interrupted-transaction recovery.
- [ ] More provider adapters, richer context ranking, and portable filesystem compare-and-swap guarantees.

## M5 — THE PROOF

- [x] npm scripts discovered as suggestions only.
- [x] Workspace Trust and exact-command approval.
- [x] npm lifecycle hooks suppressed during runner invocation.
- [x] Timeout, cancellation, bounded/redacted output and evidence persistence.
- [x] Passing evidence can be explicitly linked to individual acceptance criteria.
- [x] Evidence matrix aggregates independently reviewed evidence across runs.
- [x] Verified closure is blocked while any criterion lacks reviewed passing evidence.
- [ ] pnpm/yarn/bun and language-specific verification runners.

## M6 — Release hardening

- [x] Node 20/22 CI.
- [x] Extension Host smoke-test harness.
- [x] VSIX build artifact workflow.
- [x] Tag-based GitHub Release workflow.
- [ ] Green final PR CI and downloaded VSIX validation.
- [ ] Clean VS Code profile/manual provider acceptance.
- [ ] Marketplace publisher/credential validation.
