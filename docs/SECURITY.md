# ROCKSOUL-EX — Security & Privacy Model

## Default posture

ROCKSOUL-EX operates inside arbitrary repositories. Workspace content and model output are untrusted data. Inspection is read-only. Network access, writes, provider requests, and command execution are explicit user actions.

## Workspace Trust

- Read-only inspection is available in Restricted Mode.
- Project-memory writes, provider requests, patch application, and command execution require Workspace Trust.
- No scan, model request, script, commit, push, or deployment starts automatically.
- The selected workspace folder is the root boundary for inspection and patch paths.

## Sensitive content

The inspection policy excludes common environment files, credential stores, SSH keys, certificates, local databases, Git internals, dependency directories, generated output, binaries, and ROCKSOUL memory. Symbolic links are not followed. The text allowlist limits the content that can be read into project context.

Default exclusions are intentionally conservative. A user can configure additional excluded paths but cannot use that setting to override the core secret/path restrictions.

## Provider credentials and network requests

- OpenAI credentials are stored with VS Code SecretStorage, not in source files or workspace memory.
- Endpoint/model settings use application scope; a repository cannot change a stored key's destination using committed workspace settings.
- HTTPS is required for remote endpoints. HTTP is permitted only for localhost development endpoints.
- Before every model call, ROCKSOUL-EX displays the endpoint, model, selected file paths, and a notice that source context is sent externally.
- The Responses API request uses Structured Outputs and sets store=false.
- Requests have a bounded timeout and cancellation path.
- Provider errors are bounded and redact the supplied API key.
- The API provider still processes the data it receives under its own service terms. Store=false is not a substitute for reviewing provider data controls or avoiding sensitive source content.

## Prompt injection and model output

Repository files, comments, README/AGENTS instructions, task text, and model responses are untrusted data. They cannot grant permission to execute commands, send additional data, or change product policy.

The Forge model has no direct tools for filesystem, terminal, network, Git, or deployment operations. It returns a structured patch proposal only. Application code enforces path scope and write policy independently from the prompt.

## Patch application

- A mission must include explicit in-scope paths.
- Only create/update operations on allowlisted text files are supported.
- Absolute paths, traversal, excluded paths, duplicate paths, binary/NUL content, oversized content, symlinks, and hard-linked files are rejected.
- Existing-file hashes and existence are captured during proposal validation and checked again before applying.
- Proposed files are displayed in native VS Code diffs.
- The developer must approve application separately after reviewing the diffs.
- Apply is separate from verification.
- Multi-file apply is not transactional. If a later editor save fails after a prior file has been saved, inspect Source Control and review the partial result before retrying.

## Command execution

- Workspace Trust is required.
- npm scripts are suggestions and require selection plus explicit approval.
- Automatic npm pre/post lifecycle hooks are suppressed.
- The selected script itself can still perform arbitrary actions; read it before approving.
- Execution has a configurable timeout, cancellation path, and bounded output.
- Output persisted to evidence is redacted for common token/secret patterns and truncated.
- A passed command is evidence for that command only, not proof that all mission acceptance criteria are met.

## Local storage and logging

- Project memory lives in the inspectable .rocksoul folder.
- Existing project memory is never overwritten during bootstrap.
- Nested symbolic links in .rocksoul are rejected.
- Pending proposals and temporary diff previews live in VS Code global extension storage.
- No telemetry, chat transcript sync, or background upload is implemented.
- Output-channel messages avoid API-key logging and do not include full source files by default.

## Threat model tests

| Threat | Mitigation |
|---|---|
| Secret enters model context | Path exclusions and text allowlist |
| Repo prompt injection | Treat source as data; no model tools |
| Model suggests file outside mission | Application path/scope validation |
| Model targets credential file | Hard exclusion policy |
| User edits file after proposal | Apply-time hash revalidation |
| Symlink/hard-link escape | lstat checks and hard-link rejection |
| Unexpected shell side effects | Exact command preview and explicit approval |
| npm lifecycle hook surprise | npm ignore-scripts mode |
| API key reaches committed files | SecretStorage only |
| Misleading completion claim | Separate Applied and Verified states |

## Release gate

Before a production release, run the full CI matrix, Extension Host smoke test, VSIX packaging, a clean-profile install, a live provider request with a non-sensitive test repository, an apply/reject check, and an approved harmless npm script. Report any unavailable gate as unverified.
