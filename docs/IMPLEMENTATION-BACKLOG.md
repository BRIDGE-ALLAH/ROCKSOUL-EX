# ROCKSOUL-EX — Implementation Backlog

This backlog is the source of truth for remaining engineering work. Tasks marked complete have code or tests in the repository; pending tasks are not implied to exist.

## Working agreement

- Work on one task at a time and inspect the current repository first.
- Preserve existing code and user changes.
- Keep JavaScript ESM for the first implementation.
- Do not add a backend, database, framework, or provider dependency without an approved task.
- Do not store secrets or scan excluded files.
- Add tests for behavior and security boundaries.
- Report changed files, commands run, exit codes, and unresolved issues.
- Never claim verification for checks that were not run.

## M0 — Extension skeleton

- [x] **RSX-001** Define package metadata, VS Code engine range, activation, and scripts. Evidence: `package.json`.
- [x] **RSX-002** Add ESM extension entry point, activate/deactivate, commands, and subscriptions. Evidence: `src/extension.js`.
- [ ] **RSX-003** Add automated Extension Development Host activation smoke test. Current unit tests do not replace this check.
- [x] **RSX-004** Add CI for unit tests on Node 20 and 22. Evidence: `.github/workflows/ci.yml`.

## M1 — THE WITNESS

- [x] **RSX-010** Resolve selected workspace roots and multi-root selection.
- [x] **RSX-011** Exclude Git internals, dependencies, generated output, secrets, credentials, and user-configured paths.
- [x] **RSX-012** Bound scan depth, file count, individual file size, and total bytes; skip symlinks and binary types.
- [x] **RSX-013** Detect common project manifests without executing scripts.
- [x] **RSX-014** Build project map of manifests, likely source/test/docs roots, and file type distribution.
- [x] **RSX-015** Present a read-only report with inspection boundaries and skipped reasons.
- [ ] **RSX-016** Parse `.gitignore` semantics and capture Git root/branch/dirty state.
- [ ] **RSX-017** Add incremental caching, scan cancellation tests, and large-monorepo profiling.

## M2 — THE MEMORY

- [x] **RSX-020** Define versioned mission index and Markdown mission serialization.
- [x] **RSX-021** Bootstrap `.rocksoul/` after consent; create missing files only.
- [x] **RSX-022** Add editable DNA, architecture, decision documents, and open affordance.
- [x] **RSX-023** Save a local session handoff and resume mission records after restart.
- [ ] **RSX-024** Add freshness detection, schema migrations, and safe user-data deletion UI.

## M3 — THE MISSION

- [x] **RSX-030** Define mission status enum, validation, and allowed state transitions.
- [x] **RSX-031** Create missions manually with scope, exclusions, risks, and acceptance criteria.
- [x] **RSX-032** Add native mission tree and open Markdown detail.
- [ ] **RSX-033** Add provider-assisted decomposition, duplicate detection, pause/resume polish, and criterion-level review.

## M4 — THE FORGE

- [x] **RSX-042a** Create bounded, disclosed context packs and copy to clipboard for a user-selected AI assistant.
- [ ] **RSX-040** Define provider request/response contracts and fixtures.
- [ ] **RSX-041** Validate one provider and secure authentication through VS Code SecretStorage.
- [ ] **RSX-042** Add relevance ranking, context freshness, and token-budget estimation.
- [ ] **RSX-043** Validate a structured patch, show native diff, and apply only after explicit approval.

## M5 — THE PROOF

- [x] **RSX-050** Discover npm scripts as suggestions; never auto-run discovery results.
- [x] **RSX-051** Require Workspace Trust and explicit approval; apply timeout and output limits.
- [x] **RSX-052** Persist timestamps, command, working directory, exit code, status, and bounded redacted output.
- [ ] **RSX-053** Map evidence to criteria and require explicit criterion review before Verified.
- [ ] **RSX-054** Add non-npm runners and security tests for malicious scripts, cancellation, and secret redaction.

## M6 — EXPERIENCE HARDENING

- [x] **RSX-060a** Add Node unit tests for mission and path policy.
- [ ] **RSX-060** Audit accessibility, keyboard navigation, light/dark themes, and Extension Host behavior.
- [ ] **RSX-061** Validate VSIX package, install/uninstall, and supported VS Code versions.
- [ ] **RSX-062** Add release workflow after the packaging and smoke-test gates pass.

## Definition of done

- [ ] Scope matches the task and no unrelated refactor was introduced.
- [ ] Relevant tests were added or updated and actually run.
- [ ] Security and exclusion rules remain intact.
- [ ] Documentation reflects actual implementation.
- [ ] Remaining risks and unverified behavior are stated.
