# ROCKSOUL-EX — Implementation Status

**Release line:** 0.2.0 · **Status:** feature-complete candidate pending final CI, clean-profile installation, and live-provider acceptance

This document separates code implemented in the repository from release checks that still require an actual environment or publisher credential.

## Implemented

- [x] JavaScript ESM VS Code package and activation entry point.
- [x] Activity Bar, Mission Tree View, status item, Command Palette commands, and Output channel.
- [x] Workspace Trust capability declaration with limited Restricted Mode support.
- [x] Bounded, read-only inspection with depth, file count, per-file bytes, total bytes, symlink avoidance, path exclusions, and skipped-path report.
- [x] Project memory bootstrap that creates missing files only and preserves existing files.
- [x] Nested storage symlink safeguards and non-creating read-only lookups.
- [x] Mission schema, Markdown records, versioned JSON index, and allowed status transitions.
- [x] OpenAI Responses API adapter with strict Structured Outputs schema, configurable model/endpoint, timeout, and request cancellation.
- [x] API-key management via VS Code SecretStorage.
- [x] Explicit disclosure of provider endpoint, model, and selected context paths.
- [x] Mission context pack with file/path scope selection and secret exclusions.
- [x] Patch proposal validation for path traversal, scope, duplicate paths, secret exclusions, text allowlist, size, symlink/hard-link targets, and create/update semantics.
- [x] Diff previews in VS Code before application.
- [x] Second explicit approval before applying a patch.
- [x] Apply-time snapshot/hash revalidation to avoid overwriting files changed since proposal creation.
- [x] Separate patch-application evidence from verification evidence.
- [x] Local session handoff.
- [x] Approved npm script execution with pre/post lifecycle hooks suppressed, timeout/cancellation, bounded output, and evidence records.
- [x] Node unit tests, syntax check script, Extension Development Host smoke test, CI matrix, VSIX artifact job, and tag-based GitHub Release workflow definitions.

## Known limits

- [ ] Witness does not yet implement complete .gitignore semantics, Git root/branch/dirty-state discovery, or incremental scan caching.
- [ ] DNA documents are editable human-owned records; semantic freshness checks and linked-document indexing are not implemented.
- [ ] Mission overlap detection and AI-assisted decomposition are not implemented.
- [ ] Patch application is not transactional across multiple files. If a later save fails, some edits may already have been applied; inspect Source Control before retrying.
- [ ] Proof only discovers npm scripts. It does not support other package managers or language-specific runners yet.
- [ ] Proof records a command result but does not map every acceptance criterion to independent evidence; a mission is not automatically marked Verified.
- [ ] Extension Host CI is a smoke test, not full GUI/manual QA.
- [ ] Marketplace publication requires a registered publisher and valid OIDC trust or Marketplace PAT.
- [ ] A live provider request must be tested by the release owner using their own API account; this repository contains no API key.

## Release gates

1. Latest pull-request CI is green on Node 20 and 22.
2. Extension Development Host smoke test passes.
3. VSIX packaging job succeeds and the artifact is downloadable.
4. Release owner installs the VSIX in a clean VS Code profile and validates inspection, memory, mission, provider disclosure, proposal diff, apply/reject, and verification.
5. Release owner validates a real provider request and API billing behavior.
6. The Marketplace publisher identity and publishing credential/OIDC trust are verified before Marketplace publication.

Do not describe the extension as Marketplace-published unless Marketplace confirms the published version.
