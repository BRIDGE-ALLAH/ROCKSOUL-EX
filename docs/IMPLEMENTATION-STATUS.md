# ROCKSOUL-EX — Implementation Status

**Release line:** 0.1.0 · **Status:** working local-first MVP foundation

This file distinguishes implemented code from planned provider and patch capabilities. A documented design is not evidence of a working feature.

## Implemented in this release line

- [x] JavaScript ESM VS Code extension manifest and activation entry point.
- [x] Activity Bar container, Missions Tree View, status item, Command Palette commands, and Output channel.
- [x] Bounded read-only workspace inspection with depth, file-count, per-file-size, and total-byte limits.
- [x] Conservative secret/dependency/generated-path exclusions and custom exclusion setting.
- [x] Symbolic-link avoidance and UTF-8 text-file allowlist.
- [x] Human-readable witness report with observed paths, heuristics, skips, and limits.
- [x] Explicitly confirmed `.rocksoul/` bootstrap that never overwrites existing files.
- [x] Local mission creation, validation, Markdown record, JSON index, and guarded status transitions.
- [x] Mission prompt pack copied to clipboard after context-disclosure confirmation; no provider API is called.
- [x] Session handoff document.
- [x] Approved npm script execution in trusted workspaces with timeout, bounded/redacted output, and evidence persistence.
- [x] Node built-in unit tests and GitHub Actions CI for Node 20 and 22.

## Partially implemented / constrained

- [ ] **Witness:** Git root, `.gitignore` semantic matching, language-specific project graph, and large-monorepo incremental caching are not implemented.
- [ ] **Memory:** DNA/decision documents are human-editable; semantic freshness checks and linked-document indexing are not implemented.
- [ ] **Mission:** mission create/open/status is implemented; AI decomposition, overlap detection, and rich native mission detail are not.
- [ ] **Forge:** clipboard-based provider handoff is implemented; API provider adapter, SecretStorage credentials, proposed-patch schema, native diff preview, and approval-bound apply are not.
- [ ] **Proof:** approved npm script execution and evidence recording are implemented; non-npm runners, criterion-to-evidence mapping, and verified-closure workflow are not.
- [ ] **Release:** package metadata and ignore rules exist; VSIX packaging, Marketplace publication, and automated Extension Development Host test are not yet verified.

## Release integrity

A command is never marked as passed unless its process exits with code 0. A successful command is not equivalent to verified mission acceptance. The extension does not perform AI requests, modify source files, or run scripts automatically.

## Manual validation still required

1. Open the repository in VS Code and press `F5`.
2. Confirm the Activity Bar view and commands appear.
3. Inspect a fixture containing fake secret files and confirm the report shows them as skipped.
4. Bootstrap memory over a workspace with pre-existing `.rocksoul` files and verify they remain untouched.
5. Create a mission, restart the Extension Development Host, and reopen it.
6. Copy a mission prompt and confirm the clipboard contains only allowed excerpts.
7. Run a harmless fixture npm script after approving it, then inspect `.rocksoul/evidence/index.json`.
8. Test rejection in an untrusted workspace.
