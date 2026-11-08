# Security Policy

ROCKSOUL-EX handles repository source code and may send selected project excerpts to a configured AI provider. Do not submit secrets or regulated data.

## Reporting a vulnerability

Please do not open public issues for exploitable vulnerabilities. Contact the repository owner through GitHub's private vulnerability reporting feature.

## Security guarantees and boundaries

- Workspace inspection is bounded, read-only, and excludes credential and generated paths by default.
- Provider API keys are stored with VS Code SecretStorage, not in project files or source control.
- Provider requests require Workspace Trust and explicit disclosure of endpoint, model, and source paths.
- Patch output is untrusted. Paths, operations, scope, size, symlinks, and hard links are checked in application code.
- Proposed changes open in separate diff previews and require explicit apply approval.
- Apply-time file snapshots are revalidated to prevent overwriting concurrent user edits.
- Verification scripts require Workspace Trust and explicit approval. Automatic npm pre/post lifecycle hooks are suppressed.
- A successful command is evidence for that command only; it does not automatically verify a mission.

See the full [security model](docs/SECURITY.md) and [release checklist](docs/RELEASE-CHECKLIST.md).
