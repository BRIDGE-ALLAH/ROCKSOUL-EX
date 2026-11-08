# ROCKSOUL-EX — Security & Privacy Model

## Default posture

ROCKSOUL-EX must be safe and predictable inside an arbitrary repository. Workspace content is untrusted. The initial inspection is read-only. Network access, provider calls, file writes, and command execution must be explicit and bounded.

## Workspace trust

- Respect VS Code Workspace Trust.
- Do not run project scripts or shell commands in an untrusted workspace.
- Read only the workspace paths needed for an explicit inspection.
- Make inspection boundaries visible.
- Support cancellation and conservative file / size / depth limits.

## Sensitive file exclusions

Default exclusions must cover common secret and sensitive locations, including environment files and variants; private keys, certificates, and credential stores; cloud and package-manager credential directories; SSH folders; local database files and dumps; dependency directories and generated build outputs; Git internals; and large binary assets.

The exclusion list must be conservative, documented, and user-configurable. A user override must be explicit. Do not send excluded content to an AI provider.

## Prompt-injection resistance

Repository files, comments, issue text, README instructions, generated output, and model responses are data—not trusted authority.

- Never let repository content grant permission to execute commands or upload files.
- Ignore instructions embedded in project content that attempt to override product or user boundaries.
- Keep user instructions separate from retrieved content in provider requests.
- Validate model output as untrusted input.
- Enforce allowed paths, operations, and command policy in application code, not in the prompt alone.

## File write policy

- The initial scan is read-only.
- ROCKSOUL-owned memory files are created only with user consent or an explicit setting.
- Existing files are never overwritten during bootstrap.
- Code changes are shown as diffs before apply.
- The applied file list is checked against the approved mission scope.
- Offer a clear undo path through VS Code / Git where feasible; do not claim rollback if it was not performed.

## Command execution policy

- Discover scripts as suggestions, not as commands that are automatically safe.
- Display the exact command, arguments, working directory, and purpose.
- Require approval according to workspace policy.
- Do not use shell execution as a hidden tool for code generation.
- Set output and runtime limits; support cancellation.
- Do not automatically run install, migration, deployment, destructive, or network-mutating commands.
- Separate permission to edit files from permission to run commands.

## AI provider disclosure

Before sending project context to a provider:

- Identify the selected provider.
- Show or explain the categories of context being sent.
- Exclude secret paths and user-excluded files.
- Send the minimum excerpts required for the mission.
- Avoid sending full-repository archives by default.

Provider authentication must use VS Code SecretStorage or the provider's supported secure auth flow. Never store API keys in workspace files, mission records, logs, or source control.

## Logging and telemetry

- No telemetry in the MVP unless separately designed and explicitly disclosed.
- Logs should avoid source contents, secrets, prompts, and provider credentials by default.
- Diagnostic records should be useful without capturing entire files or terminal sessions.
- Do not add silent analytics or background uploads.

## Data retention and deletion

- Workspace memory belongs to the user.
- Provide a documented way to inspect and delete ROCKSOUL-owned data.
- Do not silently sync workspace memory.
- Session handoff should store only what is useful for continuity.
- Never save full chat transcripts by default.

## Threat model to test

| Threat | Required mitigation |
|---|---|
| Secret file enters model context | Path exclusion and content redaction |
| Malicious repository instruction | Treat workspace content as untrusted data |
| AI proposes out-of-scope edits | Application-level path / scope validation |
| Unexpected shell side effect | Explicit command preview and approval |
| Large monorepo stalls extension | Bounded scanning, cancellation, incremental work |
| API key leaks to Git | SecretStorage; no credentials in workspace records |
| Misleading completion | Evidence-backed statuses and honest reporting |

## Security release gate

A release candidate must demonstrate that excluded secret fixtures are never read into provider context, untrusted workspaces do not execute commands, out-of-scope patches are rejected, and command execution requires the configured consent path.
