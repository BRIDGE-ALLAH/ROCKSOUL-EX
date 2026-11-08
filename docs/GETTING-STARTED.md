# ROCKSOUL-EX — Getting Started

## Requirements

- Visual Studio Code 1.90 or newer.
- Node.js 20 or newer for running the repository's unit tests.
- A project folder opened in VS Code.

ROCKSOUL-EX has no required server, database, login, telemetry, or AI provider.

## Run from source

1. Clone this repository and open its root folder in VS Code.
2. Run `npm test` in the integrated terminal.
3. Press `F5` and choose **ROCKSOUL-EX: Run Extension** to launch an Extension Development Host. The repository includes this debug configuration.
4. Open a project folder in the new window.
5. Select the ROCKSOUL-EX icon in the Activity Bar.
6. Run **ROCKSOUL-EX: Inspect Project** from the Command Palette.
7. Review the read-only report. Then choose whether to create `.rocksoul/` project memory.
8. Create a mission and capture its goal, scope, and acceptance criteria.
9. Run **Prepare AI Mission Prompt** to copy a bounded context pack to the clipboard. Paste it into the AI assistant you choose.
10. Review any code changes in the editor and source control. Run **Run Approved Verification** only after checking the exact npm script and approving its execution.

## First-use flow

**Observe → Understand → Build → Verify**

- **Observe:** inspect a bounded set of text files without changing the workspace.
- **Understand:** maintain human-readable project DNA and decisions under `.rocksoul/`.
- **Build:** create missions and prepare a scoped AI prompt. The initial release uses a manual provider handoff; it does not call a model API.
- **Verify:** discover npm scripts as suggestions, require explicit approval, run one selected script, and retain bounded evidence.

## Commands

| Command | Purpose |
|---|---|
| `ROCKSOUL-EX: Open Companion` | Open the Activity Bar view and Output channel |
| `ROCKSOUL-EX: Inspect Project` | Run a bounded, read-only project inspection |
| `ROCKSOUL-EX: Create Project Memory` | Create missing `.rocksoul/` files after confirmation |
| `ROCKSOUL-EX: Open Project DNA` | Open project memory documents |
| `ROCKSOUL-EX: Create Mission` | Save a small mission with acceptance criteria |
| `ROCKSOUL-EX: Prepare AI Mission Prompt` | Copy a local-only mission context pack to clipboard |
| `ROCKSOUL-EX: Update Mission Status` | Move a mission through allowed non-verified states |
| `ROCKSOUL-EX: Create Session Handoff` | Save a concise resume note |
| `ROCKSOUL-EX: Run Approved Verification` | Run one approved npm script and record evidence |

## Workspace data

```text
.rocksoul/
  PROJECT.md
  DNA.md
  ARCHITECTURE.md
  DECISIONS.md
  missions/
    index.json
    rsx-*.md
  sessions/
    latest.md
  evidence/
    index.json
```

All memory is local and inspectable. Add `.rocksoul/` to source control only when that is appropriate for your project. The repository's root `.gitignore` ignores `.rocksoul/` by default; remove that line deliberately if you want to version the memory.

## Safety and scope

- Workspace inspection is read-only and bounded by configurable depth, file count, per-file size, and total bytes.
- Git internals, dependency folders, build outputs, environment files, credential directories, private keys, databases, binary files, and `.rocksoul/` are excluded by default.
- Symbolic links are not followed.
- No project script runs during discovery.
- Workspace Trust is required before running a verification script.
- The exact selected `npm run <script>` command and working directory are shown before execution.
- A passed command is evidence for that command only. It does not automatically mark all acceptance criteria as verified.
- No provider API calls, account setup, background indexing, telemetry, commits, pushes, or deployments are performed by the extension.

## Tests

```bash
npm test
npm run check
```

The unit suite covers mission validation/state transitions and the workspace path/security policy. The Extension Development Host smoke test remains a manual `F5` check in a real VS Code installation.
