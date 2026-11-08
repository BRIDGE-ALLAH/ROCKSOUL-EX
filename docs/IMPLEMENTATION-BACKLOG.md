# ROCKSOUL-EX — Implementation Backlog

This backlog converts the product blueprint into small tasks suitable for a local coding agent. Tasks are intentionally ordered. Do not skip prerequisites or mark a task complete without the stated evidence.

## Working agreement for the coding agent

- Work on one task at a time.
- Read README and the relevant product docs before editing.
- Inspect the current repository before creating files.
- Preserve existing code and user changes.
- Keep JavaScript ESM for the first implementation.
- Do not add a backend, database, framework, or provider dependency without an approved task.
- Do not store secrets or scan excluded files.
- Add tests for behavior and security boundaries.
- Run the smallest relevant test after each change.
- Report changed files, commands run, exit codes, and unresolved issues.
- Never claim verification for checks that were not run.

## M0 — Extension skeleton

### RSX-001 — Inspect toolchain and define package metadata

- [ ] Inspect the repository and available Node.js / npm versions.
- [ ] Define package name, display name, publisher placeholder, VS Code engine range, and activation strategy.
- [ ] Add only the minimal dependencies required.
- [ ] Add scripts for test and packaging only when their tooling exists.
- [ ] Document setup commands.

**Acceptance:** package metadata is valid and npm install completes without unnecessary dependencies.

### RSX-002 — Create the ESM extension entry point

- [ ] Add the extension entry module.
- [ ] Implement activate and deactivate exports.
- [ ] Register one harmless diagnostic command.
- [ ] Dispose subscriptions cleanly.

**Acceptance:** Extension Development Host activates without error and the command is discoverable.

### RSX-003 — Add a minimal smoke test

- [ ] Configure the VS Code extension test harness.
- [ ] Add a test for activation and command registration.
- [ ] Document the exact test command.

**Acceptance:** the smoke test runs locally and its result is recorded.

## M1 — THE WITNESS

### RSX-010 — Resolve workspace boundaries

- [ ] Resolve the active workspace folder.
- [ ] Resolve Git root when available.
- [ ] Handle multi-root workspaces explicitly.
- [ ] Return a clear empty-workspace state.

**Acceptance:** workspace boundaries are deterministic and no path outside the selected root is traversed.

### RSX-011 — Implement path exclusion policy

- [ ] Exclude Git internals, dependencies, generated output, and common secret locations.
- [ ] Support standard ignore files where safe.
- [ ] Add configurable file and directory exclusions.
- [ ] Unit-test positive and negative path cases.

**Acceptance:** fixture secrets are excluded before file content is read.

### RSX-012 — Add bounded file discovery

- [ ] Configure maximum depth, file count, individual size, and total bytes.
- [ ] Skip binary and oversized files.
- [ ] Support cancellation.
- [ ] Return skipped-path reasons.

**Acceptance:** scans terminate within configured limits and explain omissions.

### RSX-013 — Detect project manifests

- [ ] Detect common JS, Python, Rust, Go, and .NET manifest files.
- [ ] Identify scripts and package manager when evidence is present.
- [ ] Label unsupported or ambiguous cases as unknown.
- [ ] Add fixture tests.

**Acceptance:** detected metadata includes source paths and does not execute project scripts.

### RSX-014 — Generate project map

- [ ] Identify likely source, test, documentation, and configuration areas.
- [ ] Capture Git branch and dirty state when available.
- [ ] Produce a concise map with inspection timestamp.
- [ ] Keep facts separate from inference.

**Acceptance:** project map can be viewed without writing to the workspace.

### RSX-015 — Present Witness report

- [ ] Add Inspect Project command.
- [ ] Show progress and cancellation.
- [ ] Present facts, inference, exclusions, and unknowns.
- [ ] Link findings to file paths.

**Acceptance:** user can inspect the report and no files are changed.

## M2 — THE MEMORY

### RSX-020 — Define local data schemas

- [ ] Define schemas for project profile, decision, mission index, and handoff.
- [ ] Validate loaded records.
- [ ] Handle malformed or older records without crashing.
- [ ] Add serialization tests.

**Acceptance:** invalid records produce actionable diagnostics rather than silent data loss.

### RSX-021 — Bootstrap project memory safely

- [ ] Offer to create .rocksoul after inspection.
- [ ] Create only missing ROCKSOUL-owned files.
- [ ] Never overwrite existing files.
- [ ] Explain what will be written before confirmation.

**Acceptance:** declined bootstrap creates no files; accepted bootstrap preserves pre-existing content.

### RSX-022 — Implement DNA and decision loading

- [ ] Load project DNA and architecture notes.
- [ ] Resolve linked documentation references.
- [ ] Load decisions by relevance.
- [ ] Track freshness and missing references.

**Acceptance:** briefing shows source paths and highlights stale or missing inputs.

### RSX-023 — Implement session handoff

- [ ] Save active mission, changed files, decisions, checks, blockers, and next action.
- [ ] Keep handoff concise.
- [ ] Detect likely stale handoff from changed files or Git state.
- [ ] Support resume without an AI provider.

**Acceptance:** session continuity works after editor restart and stale state is clearly flagged.

## M3 — THE MISSION

### RSX-030 — Define Mission model and state transitions

- [ ] Add mission schema and status enum.
- [ ] Validate required fields and acceptance criteria.
- [ ] Reject illegal status transitions.
- [ ] Add unit tests.

**Acceptance:** Draft cannot transition directly to Verified.

### RSX-031 — Create mission manually

- [ ] Add Create Mission command.
- [ ] Capture goal, scope, exclusions, and acceptance criteria.
- [ ] Generate a unique mission identifier.
- [ ] Persist a Markdown mission file and index entry.

**Acceptance:** user can create and reopen a mission without AI.

### RSX-032 — Add mission tree and detail view

- [ ] Add native Tree View for mission list.
- [ ] Show clear status labels.
- [ ] Open mission detail with criteria and scope.
- [ ] Support pause, defer, resume, and close.

**Acceptance:** keyboard-accessible mission navigation works in a clean VS Code theme.

### RSX-033 — Add mission decomposition interface

- [ ] Add optional provider-backed task decomposition after provider contract exists.
- [ ] Require approval before saving generated scope.
- [ ] Keep tasks small and independently verifiable.
- [ ] Detect obvious overlap with an active mission.

**Acceptance:** generated tasks are proposals and do not silently become approved work.

## M4 — THE FORGE

### RSX-040 — Define provider port

- [ ] Define request and response schemas.
- [ ] Include selected context, active mission, and allowed capabilities.
- [ ] Validate response shape and changed-file intent.
- [ ] Add mock provider tests.

**Acceptance:** application logic has no direct vendor-specific dependency.

### RSX-041 — Validate one provider integration

- [ ] Evaluate one provider's authentication and request flow.
- [ ] Store credentials using secure editor storage.
- [ ] Document context disclosure and limits.
- [ ] Keep provider integration optional.

**Acceptance:** one small request succeeds without writing credentials to workspace files or logs.

### RSX-042 — Build mission context pack

- [ ] Select only relevant project facts, decisions, and excerpts.
- [ ] Respect exclusions and user-defined context boundaries.
- [ ] Include source references and freshness.
- [ ] Estimate and cap request size.

**Acceptance:** excluded files never enter a provider request fixture.

### RSX-043 — Present and apply proposed changes

- [ ] Convert provider output into a reviewable proposal.
- [ ] Open the native diff editor.
- [ ] Validate proposed paths against mission scope.
- [ ] Require approval before applying.
- [ ] Record changed paths.

**Acceptance:** an out-of-scope proposal is rejected and no file is modified.

## M5 — THE PROOF

### RSX-050 — Discover check commands

- [ ] Detect candidate build, lint, and test commands from manifests.
- [ ] Label them as suggestions.
- [ ] Never execute discovery results automatically.
- [ ] Show working directory and command arguments.

**Acceptance:** user can inspect command candidates before execution.

### RSX-051 — Add approved command runner

- [ ] Require Workspace Trust.
- [ ] Require explicit approval according to policy.
- [ ] Add timeout, cancellation, and output limits.
- [ ] Separate command execution permission from edit approval.

**Acceptance:** no script runs in an untrusted workspace and cancellation is handled.

### RSX-052 — Persist verification evidence

- [ ] Record command, timestamps, exit code, status, and output excerpt.
- [ ] Redact likely secrets.
- [ ] Map evidence to mission criteria.
- [ ] Distinguish not-run and blocked outcomes.

**Acceptance:** report can be independently inspected and does not claim more than the command proved.

### RSX-053 — Close mission with proof report

- [ ] Compare acceptance criteria with supporting evidence.
- [ ] Require all mandatory criteria to pass before Verified.
- [ ] List failed, not-run, and blocked criteria.
- [ ] Generate a concise handoff.

**Acceptance:** mission cannot be Verified with missing required evidence.

## Definition of done for every task

- [ ] Scope matches the task.
- [ ] No unrelated refactor was introduced.
- [ ] Relevant tests were added or updated.
- [ ] Required checks were run and their exact outcomes are reported.
- [ ] Security and exclusion rules remain intact.
- [ ] Documentation reflects the actual implementation.
- [ ] Remaining risks and unverified behavior are stated.
