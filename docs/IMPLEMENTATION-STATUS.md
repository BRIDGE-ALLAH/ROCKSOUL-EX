# ROCKSOUL-EX — Implementation Status

**Release line:** 0.3.0 candidate · **Repository state:** feature branch / PR validation pending · **Marketplace:** not verified as published

This document separates implementation in source from checks that require GitHub CI, a clean VS Code profile, a live provider account, or publisher credentials.

## Implemented in source

- [x] JavaScript ESM VS Code package, Activity Bar, Mission Tree View, commands, status item, and Output channel.
- [x] Workspace Trust and bounded read-only inspection.
- [x] Sensitive-path, dependency, generated-output, binary, symlink, and custom exclusions.
- [x] Root and nested .gitignore evaluation with common Git glob, anchoring, directory-only, and negation behavior.
- [x] Read-only Git root, branch, dirty state, and bounded status summary.
- [x] In-memory incremental cache keyed by file identity and timestamps; added/changed/removed scan deltas.
- [x] File reads use no-follow open where supported, compare file identity before reading, and verify resolved paths remain inside the workspace.
- [x] Project memory bootstrap that creates missing files only and preserves existing files.
- [x] Mission Markdown records, status transitions, versioned index, session handoff, and evidence log.
- [x] OpenAI Responses API adapter, Structured Outputs validation, SecretStorage API-key handling, timeout, and cancellation.
- [x] Explicit endpoint/model/context disclosure before a provider request.
- [x] Mission-scoped patch validation, text allowlist, path exclusions, size checks, symlink/hard-link rejection, and snapshot/hash validation.
- [x] Native diff preview and a second explicit user approval before file writes.
- [x] Forge transaction journal and per-file backups stored in VS Code global storage before source writes.
- [x] Per-file staged replacement, rollback after a partial failure, and recovery prompt for interrupted transactions.
- [x] Rollback refuses to overwrite files that match neither the before nor expected after snapshot.
- [x] Approved npm script execution with lifecycle hooks suppressed, timeout/cancellation, bounded output, and redacted evidence.
- [x] Explicit criterion-to-evidence mapping and confirmation after reviewing a passing command.
- [x] Evidence matrix aggregates reviewed passing evidence and prevents Verified while any acceptance criterion is uncovered.
- [x] Node 20/22 CI definition, Extension Development Host smoke test, VSIX packaging, and GitHub Release workflow definition.

## Known limits / not yet verified

- [ ] Gitignore support targets common documented patterns; exhaustive parity with every Git edge case has not been independently conformance-tested.
- [ ] Incremental cache is in-memory for the current extension session; it does not survive a VS Code restart.
- [ ] The scan is bounded, and cancellation / very large monorepo performance still need stress profiling.
- [ ] Filesystem transactions use per-file atomic replacement plus rollback; portable Node APIs do not provide a cross-file atomic commit or a universal compare-and-swap primitive against hostile concurrent writers.
- [ ] A crash/recovery prompt is implemented, but clean-profile manual testing of forced termination at every transaction phase remains a release check.
- [ ] Proof currently discovers npm scripts only; other package managers and language-specific runners remain planned.
- [ ] Extension Host CI is a smoke test, not complete GUI/manual QA.
- [ ] A live provider request and API billing behavior must be tested by the release owner using their own API account.
- [ ] Marketplace publication requires valid publisher credentials or trusted OIDC and must be verified directly in the Marketplace.

## Release gates

1. Latest pull-request CI green on Node 20 and 22.
2. Extension Development Host smoke test passes.
3. VSIX packaging job succeeds and the artifact is downloadable.
4. Clean-profile manual test covers inspection, nested ignore rules, mission creation, provider disclosure, diff review, apply/reject, transaction recovery, evidence mapping, and Verified gating.
5. A live provider round-trip is tested using non-sensitive fixture content.
6. Marketplace publication is reported only after the Marketplace confirms the published version.

Do not describe source implementation, a GitHub Release, or a VSIX artifact as Marketplace publication.
