# ROCKSOUL-EX — Product Roadmap

## Delivery strategy

Build in a sequence that proves product value before adding complexity. Each milestone must produce a usable capability and explicit evidence. Dates are intentionally omitted; progress is measured by acceptance criteria, not optimistic estimates.

## M0 — Extension foundation

**Status: implemented in 0.1.0; Extension Development Host smoke test pending.**

- [x] JavaScript ESM extension manifest and entry point.
- [x] Activity Bar container, native Missions Tree View, status item, commands, and Output channel.
- [x] Dependency-free Node test runner and CI workflow.
- [x] VS Code engine range and local setup guide.
- [ ] Automated Extension Development Host activation test.
- [ ] VSIX packaging validation.

## M1 — THE WITNESS

**Status: bounded inspection implemented; advanced repository semantics remain open.**

- [x] Resolve a selected workspace folder and report an empty-workspace state.
- [x] Read-only directory walk with depth, file-count, per-file-size, and total-byte limits.
- [x] Conservative secret, credential, dependency, generated-output, binary, and `.rocksoul` exclusions.
- [x] Avoid symbolic links and present skipped-path reasons.
- [x] Detect common manifests, likely source/test/docs roots, and file-type distribution.
- [x] Present observed paths, heuristics, and limitations in a report.
- [ ] Git root / branch / dirty-state inspection.
- [ ] Full `.gitignore` semantics and incremental scan caching.
- [ ] Large-monorepo performance profiling and cancellation hardening.

## M2 — THE MEMORY

**Status: local store and basic handoff implemented.**

- [x] Bootstrap `.rocksoul/` after explicit confirmation.
- [x] Create only missing files and preserve pre-existing content.
- [x] Human-readable project DNA, architecture, decision, mission, and handoff files.
- [x] Versioned JSON mission index and basic validation.
- [x] Resume missions from local state after editor restart.
- [ ] Semantic freshness checks for linked documentation.
- [ ] Rich inspect/edit/delete affordances and data migration tests.

## M3 — THE MISSION

**Status: foundational mission lifecycle implemented.**

- [x] Mission schema validation and state transition guard.
- [x] Manual mission creation with scope and acceptance criteria.
- [x] Native Missions Tree View and Markdown mission detail.
- [x] Status updates that cannot skip directly from Draft to Verified.
- [ ] AI decomposition, mission overlap detection, and richer review workflow.
- [ ] Criterion-level evidence mapping and verified closure.

## M4 — THE FORGE

**Status: manual provider handoff implemented; automated provider and patch workflow deferred.**

- [x] Build a bounded context pack from mission, DNA, architecture, decisions, and eligible project excerpts.
- [x] Disclose context categories and copy to clipboard without network access.
- [ ] Provider port and first API adapter.
- [ ] Secure provider credentials using VS Code SecretStorage.
- [ ] Structured patch proposal, scope validation, native diff preview, and approval-bound apply.

## M5 — THE PROOF

**Status: approved npm script runner and evidence log implemented.**

- [x] Discover eligible npm scripts as suggestions only.
- [x] Require Workspace Trust and explicit command approval.
- [x] Execute one selected npm script with timeout and bounded output.
- [x] Persist command, working directory, timestamps, exit code, status, and redacted output excerpt.
- [ ] Additional package-manager and language-specific runners.
- [ ] Evidence-to-criterion mapping and verified mission closure.
- [ ] Security test fixtures for malicious scripts, output redaction, and cancellation.

## M6 — EXPERIENCE HARDENING

**Status: started.**

- [x] Respect VS Code theme and use native controls.
- [x] Add CI for Node 20 and 22 unit tests.
- [ ] Accessibility and keyboard-navigation audit in Extension Development Host.
- [ ] Test light/dark themes, large workspaces, and multi-root behavior.
- [ ] VSIX packaging, installation, and clean uninstall validation.
- [ ] Release automation and Marketplace metadata review.

## Later exploration — not MVP commitments

- Multiple provider adapters and optional local model support.
- Optional MoonWitness knowledge bridge.
- Mission templates and reusable project playbooks.
- Multi-agent delegation with explicit role boundaries.
- Team synchronization after a privacy and access model exists.

These ideas must not delay a dependable single-developer workflow.
