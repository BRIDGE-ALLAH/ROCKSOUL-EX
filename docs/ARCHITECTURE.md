# ROCKSOUL-EX — Proposed Architecture

## Architecture posture

Build the smallest useful VS Code extension first.

- **Host:** Visual Studio Code Extension Host.
- **Language:** JavaScript with ESM modules.
- **Runtime:** Node.js runtime provided by VS Code.
- **Backend:** none required for MVP.
- **Persistence:** workspace-local Markdown and JSON.
- **AI:** provider adapters behind a stable interface.
- **UI:** native VS Code views and commands first; Webview only where it adds clear value.

Do not introduce a web server, database, Next.js app, Fastify service, or cloud control plane without a demonstrated requirement. A separate local service may be considered later if extension-host constraints make a capability impractical.

## Layer model

### VS Code adapter layer

Owns extension activation, commands, views, status items, notifications, workspace events, editor diffs, Output channel, and progress UI. It translates VS Code events into application use cases.

### Application layer

Coordinates use cases such as Inspect Project, Load DNA, Create Mission, Prepare Change, Apply Approved Change, Resume Session, and Verify Mission. It must not depend directly on a specific AI vendor.

### Domain layer

Contains plain data models and policies:

- ProjectProfile
- ProjectFact
- SourceReference
- DecisionRecord
- Mission
- MissionStep
- ChangeProposal
- VerificationRun
- SessionHandoff

Keep domain logic testable without launching VS Code.

### Ports / adapters

- **Workspace reader:** bounded file and Git inspection.
- **Workspace writer:** writes ROCKSOUL-owned files and applies approved edits.
- **AI provider:** sends a scoped request to the selected model provider.
- **Command runner:** executes user-approved verification commands.
- **Clock / ID provider:** makes records deterministic in tests.

### Storage layer

Reads and writes the workspace's .rocksoul directory. Data should be human-readable and portable. Avoid opaque databases in the MVP.

## Proposed source layout

~~~~text
src/
  extension.js
  adapters/
    vscode/
      commands.js
      views.js
      diagnostics.js
  application/
    inspect-project.js
    load-project-context.js
    create-mission.js
    prepare-change.js
    apply-approved-change.js
    verify-mission.js
    create-handoff.js
  domain/
    project.js
    mission.js
    evidence.js
    decisions.js
    policies.js
  providers/
    provider-port.js
    provider-registry.js
  infrastructure/
    workspace-reader.js
    workspace-writer.js
    git-reader.js
    command-runner.js
    rocksoul-store.js
  security/
    path-policy.js
    secret-exclusions.js
    approval-policy.js
test/
  unit/
  fixtures/
~~~~

This is a target organization, not a claim about existing files. Create folders only when their first real implementation task needs them.

## Workspace data contract

Proposed workspace-owned structure:

~~~~text
.rocksoul/
  PROJECT.md
  DNA.md
  ARCHITECTURE.md
  DECISIONS.md
  missions/
    index.json
    mission-id.md
  sessions/
    latest.md
  evidence/
    index.json
~~~~

Rules:

- Do not overwrite existing project documents.
- Bootstrap only missing ROCKSOUL-owned files.
- Ask before writing into a workspace if the user has not enabled project-local memory.
- Store references to existing docs instead of copying their full contents.
- Keep secrets, provider credentials, environment values, and full source snapshots out of this directory.
- The user can inspect, edit, version, or delete these files with normal tools.

## Project inspection pipeline

1. Resolve the workspace root and Git root, if present.
2. Check VS Code Workspace Trust.
3. Load ignore rules and ROCKSOUL's conservative exclusion policy.
4. Discover a bounded set of project manifests, source directories, tests, and documentation.
5. Read metadata and selected text files within size limits.
6. Build a project map with source references and inspection timestamp.
7. Label facts as observed or inferred.
8. Present the report before offering to persist generated DNA.

Never recursively read every file by default. Never inspect secrets or binary files. Provide limits for file count, depth, file size, and total bytes.

## AI provider contract

The provider port should accept a structured request with:

- task intent and active mission;
- minimal project summary;
- selected source excerpts with paths;
- repository rules and relevant decisions;
- allowed tool capabilities;
- response format and token budget.

It should return a structured proposal with assumptions, changed-file intent, patch or content proposal, risks, and follow-up checks.

The application layer validates the response before displaying it. Treat all model output as untrusted. A provider adapter must not be able to silently expand workspace scope or execute commands.

Start with one provider adapter after a short feasibility spike. Add more only when the core contract is stable. The product must still support non-AI capabilities without a provider.

## Change lifecycle

~~~~text
Mission
  -> Context selection
  -> Provider proposal
  -> Scope / policy validation
  -> Human diff review
  -> Explicit apply approval
  -> Workspace edit
  -> Verification plan
  -> Approved command execution
  -> Evidence record
  -> Mission status update
~~~~

Applying changes and running shell commands are distinct permissions. Approving one must not imply the other.

## Verification records

A verification record should include mission ID, command and working directory, start and finish timestamps, exit code, status, concise output excerpt, and relevant commit or working-tree context when available.

Do not store unlimited terminal output. Redact likely secrets before persistence. A zero exit code is evidence that a command passed, not proof that every acceptance criterion is satisfied.

## Extension activation and performance

- Activate only when a workspace is available or when a relevant command is invoked.
- Avoid expensive scans during activation.
- Use explicit Inspect Project action for initial deep inspection.
- Cache derived project maps with timestamps and invalidation rules.
- Cancel stale work when the workspace changes or the user cancels.
- Keep the editor responsive; use progress and cancellation affordances for longer tasks.

## Testing strategy

- Unit-test domain policies and data validation without VS Code.
- Test path exclusions, file limits, and secret detection with fixtures.
- Test provider response validation with recorded mock responses.
- Test workspace edits and command policies in an extension-host test harness.
- Include a sample workspace with multiple languages and ignored directories.
- Add smoke tests for activation, commands, views, and session recovery.

## Architecture risks to validate early

1. Whether the extension host can support the required provider workflow without a local companion process.
2. What provider APIs and authentication flows are viable for the first integration.
3. How to keep file inspection bounded and responsive on large monorepos.
4. Which project-local records should be committed versus ignored by default.
5. How to present approval without adding excessive friction.

Resolve these through small spikes and tests, not assumptions.
