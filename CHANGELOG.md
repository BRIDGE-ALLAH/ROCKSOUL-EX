# Changelog

All notable ROCKSOUL-EX changes are recorded here.

## 0.3.0 — Reliability engines

### Added
- Root and nested .gitignore scanning with glob, negation, anchoring, and directory-only rule support.
- Git root, branch, working-tree status, and previous-inspection file deltas.
- Bounded session-local incremental scan cache and safer no-follow file reads.
- Durable Forge transaction journal and pre-write backups, per-file staging/replacement, rollback on partial failure, and user-approved interrupted-transaction recovery.
- Passing command evidence can be explicitly mapped to acceptance criteria; the cumulative proof matrix blocks Verified until every criterion has reviewed passing evidence.

### Security
- Recovery never overwrites files that match neither the transaction's before nor after snapshot.
- Failed, cancelled, unreviewed, or stale-criterion evidence cannot satisfy the proof matrix.

### Release gates
- [x] PR CI passed on Node 20/22, Extension Host smoke test passed, and the v0.3.0 VSIX is published on GitHub Releases.
- [ ] Clean-profile transaction/recovery and evidence-matrix behavior still require manual release-owner acceptance.
- [ ] Marketplace publication requires publisher credentials or trusted OIDC; this workflow skipped Marketplace publishing.

## 0.2.1 — Marketplace publisher identity

### Fixed
- Align the extension manifest publisher ID with the registered Marketplace publisher `MohRezzaFahlevi`.
- Derive the Extension Host test extension identifier from package metadata instead of hard-coding a publisher value.
- Bump the package version so the corrected identity ships as a new VSIX and does not overwrite v0.2.0.

## 0.2.0 — Forge and review workflow

### Added
- OpenAI Responses API integration with structured patch proposals.
- API key management through VS Code SecretStorage.
- Explicit context disclosure before provider requests.
- Mission-scoped patch validation, native diff preview, explicit apply/reject, and apply-time snapshot checks.
- Patch application evidence distinct from verification evidence.
- Extension Host integration smoke test, Node 20/22 CI, VSIX packaging, and tag-based release workflows.

### Security
- Reject out-of-scope paths, path traversal, excluded files, symlinks, hard links, binaries, and oversized patch content.
- Require trusted workspaces for persistent writes, provider requests, patch application, and command execution.
- Suppress automatic npm pre/post lifecycle hooks during verification.

### Known release gates
- Final CI and Extension Host test on the release commit.
- Clean-profile VSIX installation and manual provider round-trip.
- Confirm Marketplace publisher ownership and configure Trusted Publishing before Marketplace publication.
