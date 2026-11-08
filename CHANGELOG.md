# Changelog

All notable ROCKSOUL-EX changes are recorded here.

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
