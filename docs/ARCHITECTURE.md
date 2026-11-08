# ROCKSOUL-EX — Architecture

## Architecture posture

- **Host:** Visual Studio Code Extension Host.
- **Language:** JavaScript ESM.
- **Runtime:** Node.js runtime supplied by VS Code.
- **Backend:** none required.
- **Persistence:** workspace-local Markdown/JSON plus extension global storage for proposals and Forge transaction journals.
- **AI:** OpenAI Responses API adapter behind an application boundary.
- **UI:** native VS Code commands, Tree View, Output channel, progress, dialogs, and diff editor.

No web server, database, or hosted control plane is required.

## Layers

### VS Code adapter — src/extension.js

Owns activation, commands, Activity Bar view, progress, dialogs, Output channel, SecretStorage, diff review, transaction approval/recovery UX, and approved command execution.

### Application layer

- Mission service: validate/create/update/read mission records.
- Forge service: prepare bounded selected context for a mission.
- Proof service: compute evidence coverage per acceptance criterion.
- Workflow orchestration: collect user intent, disclose provider transmission, request proposals, and route to review/apply/reject/verify.

### Domain and security layer

- Mission model/status state machine.
- Path allowlist and excluded-path policy.
- Mission scope validation and file snapshot hashing.
- Provider response schema.
- Evidence matrix rules: only passing evidence with an explicit, reviewed criterion mapping counts toward coverage.

### Infrastructure

- Workspace inspector: bounded text scan, Git metadata, .gitignore rules, safe reads, and a session-scoped incremental cache.
- Gitignore parser: nested rules, negation, path anchoring, globstar, and directory-only rules.
- ROCKSOUL store: Markdown/JSON local memory and evidence records.
- Forge transaction engine: pre-write journal, durable backup, staged per-file replacement, rollback, and interrupted-transaction recovery.
- Provider adapter: direct Responses API request with strict Structured Outputs.
- Proposal store: pending proposals and temporary before/after review files in VS Code global storage.

## Change lifecycle

1. Create an explicit mission with path scope and acceptance criteria.
2. Build a bounded context pack from allowed project text and relevant local memory.
3. Disclose endpoint, model, and selected paths.
4. Send the context to the configured provider only after consent.
5. Parse a strict structured proposal.
6. Validate the proposal in application code against mission scope, path policy, file type, limits, and current filesystem state.
7. Store the proposal and build temporary diff files outside the workspace.
8. Open native VS Code diffs.
9. Ask for a second, explicit approval to write.
10. Revalidate every snapshot, create the transaction journal and backups, then stage and atomically replace each target file.
11. Roll back completed writes if a later write fails; on restart, offer an explicit recovery action for incomplete journals.
12. Record patch-application evidence separately from verification.
13. Run a selected verification command only after exact-command approval.
14. Let the user explicitly map a passing command result to the acceptance criteria it actually supports.
15. Mark Verified only after every criterion has reviewed passing evidence and the user confirms closure.

The provider cannot perform the approval, apply, command, criterion-review, or Verified-closure steps.

## Storage contracts

Project memory:

- PROJECT.md, DNA.md, ARCHITECTURE.md, DECISIONS.md
- missions/index.json and individual mission Markdown records
- sessions/latest.md
- evidence/index.json

Extension global storage:

- Pending structured proposals
- Before/after diff preview files
- Forge transaction directories with journal.json and pre-write backups

Provider credentials use VS Code SecretStorage only.

## Verification evidence

Evidence records include mission ID, command, working directory, start/finish timestamps, duration, exit code, status, bounded redacted output, and optional criterion review mappings.

A zero exit code alone does not prove that every acceptance criterion was satisfied. Only explicit criterion mappings attached to passing evidence count. The matrix is cumulative across evidence records and compares criterion text as well as its index, so changed criterion wording requires new review.

## Performance and privacy

- No full repository indexing during activation.
- Explicit inspection command only.
- Default limits constrain depth, file count, single-file bytes, and total bytes.
- Secret paths, dependencies, generated output, and ignored paths are excluded before reading.
- Git metadata collection is read-only and bounded by command timeouts.
- The in-memory cache is session-local, bounded, and invalidated when file identity or timestamps change.
- Provider context and output are bounded.
- No automatic network, write, command, commit, push, or deployment action.

## Testing

- Node unit tests cover domain policy, storage, inspection, gitignore behavior, mission lifecycle, provider request shape, patch policy, transaction rollback/recovery, and evidence matrix rules.
- GitHub Actions is configured for Node 20 and 22.
- Extension Development Host smoke test validates activation and command registration.
- CI packaging creates a VSIX artifact.
- Clean-profile installation, hostile concurrency, forced-crash recovery, and live provider acceptance remain manual release gates.
