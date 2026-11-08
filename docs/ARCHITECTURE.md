# ROCKSOUL-EX — Architecture

## Architecture posture

- **Host:** Visual Studio Code Extension Host.
- **Language:** JavaScript ESM.
- **Runtime:** Node.js runtime supplied by VS Code.
- **Backend:** none required.
- **Persistence:** workspace-local Markdown/JSON plus extension global storage for pending patch previews.
- **AI:** OpenAI Responses API adapter behind an application boundary.
- **UI:** native VS Code commands, Tree View, Output channel, and diff editor.

No web server, database, or hosted control plane is required.

## Layers

### VS Code adapter — src/extension.js

Owns activation, commands, Activity Bar view, progress, dialogs, Output channel, SecretStorage, native diff editor, WorkspaceEdit, and command execution UX.

### Application layer

- Mission service: validate/create/update/read mission records.
- Forge service: prepare bounded selected context for a mission.
- Workflow orchestration: collect user intent, disclose provider transmission, request proposals, and route to review/apply/reject.

### Domain and security layer

- Mission model/status state machine.
- Path allowlist and excluded-path policy.
- Scope validation and file snapshot hashing.
- Provider response schema.

### Infrastructure

- Workspace inspector: bounded text scanning.
- ROCKSOUL store: Markdown/JSON local memory.
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
10. Recheck the source-file snapshots, apply through WorkspaceEdit, save, and record patch-application evidence.
11. Run verification only through a separate approved command flow.

The provider cannot perform step 9 or step 11.

## Storage contracts

Project memory:

- PROJECT.md, DNA.md, ARCHITECTURE.md, DECISIONS.md
- missions/index.json and individual mission Markdown records
- sessions/latest.md
- evidence/index.json

Extension global storage:

- Pending structured proposals
- Before/after diff preview files

Provider credentials use VS Code SecretStorage only.

## Verification evidence

Evidence includes mission ID, command, working directory, start/finish timestamps, duration, exit code, status, and bounded redacted output. Patch application has a distinct evidence status from command verification.

A zero exit code does not prove that every acceptance criterion was satisfied. Mission Verified closure remains a human-reviewed future capability.

## Performance

- No full repository indexing during activation.
- Explicit scan command only.
- Default limits constrain depth, file count, single-file bytes, and total bytes.
- Inspection excludes binary and sensitive paths.
- Provider requests use bounded context and output-token settings.
- Long model/command work is cancellable and bounded by a timeout.

## Testing

- Node unit tests cover domain policy, storage, inspection, mission lifecycle, provider request shape, patch policy, and stale-file detection.
- GitHub Actions runs syntax/unit checks on Node 20 and 22.
- Extension Development Host smoke test validates activation and command registration.
- CI packaging creates a VSIX artifact.
- Clean-profile installation and live provider round-trip remain manual release acceptance checks.
