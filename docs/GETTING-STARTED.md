# ROCKSOUL-EX — Getting Started

## Requirements

- Visual Studio Code 1.90 or newer.
- Node.js 20 or newer for repository checks.
- An opened local workspace folder.
- An OpenAI API key and API billing enabled only when using Forge.

ROCKSOUL-EX does not require a server, database, login, or account of its own.

## Run from source

1. Clone the repository and open its root folder in VS Code.
2. Run npm run check.
3. Press F5 and choose **ROCKSOUL-EX: Run Extension** to launch an Extension Development Host.
4. Open a project folder in the new window.
5. Select the ROCKSOUL-EX icon in the Activity Bar.
6. Run **ROCKSOUL-EX: Inspect Project** from the Command Palette.
7. Review the read-only report. Choose whether to create project memory.
8. Create a mission with a clear outcome, in-scope paths, and acceptance criteria.
9. Open **ROCKSOUL-EX: Configure AI Provider** to confirm endpoint and model.
10. Run **ROCKSOUL-EX: Set OpenAI API Key**. The key is saved in VS Code SecretStorage.
11. Run **ROCKSOUL-EX: Generate Mission Patch**. Inspect the endpoint, model, and disclosed paths in the consent dialog.
12. Review the generated diff in VS Code. Only then choose **Apply Proposed Patch**; otherwise reject it.
13. Run **ROCKSOUL-EX: Run Approved Verification** separately and approve the exact npm script.

## First-use flow

**Observe → Understand → Build → Verify**

- **Observe:** bounded, read-only inspection of allowlisted text files.
- **Understand:** maintain local DNA, architecture, decisions, missions, and handoffs.
- **Build:** prepare a structured patch proposal from selected context. Model output is untrusted and cannot execute tools.
- **Review:** see every proposed file in VS Code diff, then explicitly approve or reject the patch.
- **Verify:** select an npm script, inspect its command and directory, approve its execution, and retain bounded evidence.

## Commands

| Command | Purpose |
|---|---|
| Inspect Project | Bounded read-only workspace scan |
| Create Project Memory | Create missing project records after confirmation |
| Open Project DNA | Open project memory documents |
| Create Mission | Create a mission with acceptance criteria |
| Configure AI Provider | Open endpoint/model settings |
| Set OpenAI API Key | Save key in VS Code SecretStorage |
| Clear OpenAI API Key | Remove the stored key |
| Generate Mission Patch | Generate and review an AI patch proposal |
| Review Pending Patch | Reopen pending proposal diffs |
| Apply Reviewed Patch | Ask for explicit approval and apply a pending proposal |
| Reject Pending Patch | Discard a proposal and its temporary previews |
| Create Session Handoff | Save a local resume note |
| Run Approved Verification | Run an approved npm script and save evidence |

## Provider configuration

Default endpoint: https://api.openai.com/v1

Default model: gpt-6-luna.

Change the model under Settings → ROCKSOUL-EX → Provider. Select a model available to the API project that supports the Responses API and Structured Outputs. For stronger coding/reasoning quality, select gpt-6-astra; it has a materially higher API price than Luna. Check the current OpenAI model catalogue and pricing before use.

The extension stores the API key using VS Code SecretStorage. Provider settings are application-scoped rather than workspace-scoped so a repository cannot silently redirect a stored key through a committed workspace setting. A user may still explicitly change their endpoint; the consent dialog displays it before every request. Do not use an untrusted third-party endpoint with production source code.

Forge submissions use store=false, but the provider still receives and processes the submitted request according to its API terms and applicable controls. API usage may incur charges. ROCKSOUL-EX does not offer an API-key proxy or billing account.

## Workspace data

The local .rocksoul folder contains PROJECT.md, DNA.md, ARCHITECTURE.md, DECISIONS.md, a missions folder, sessions/latest.md, and evidence/index.json.

All project memory is inspectable text/JSON. The repository root ignores .rocksoul by default; remove that ignore deliberately if project memory should be versioned. Provider credentials are never written into .rocksoul.

Pending Forge proposals and diff previews are kept under VS Code extension global storage, not in the repository.

## Safety boundaries

- Inspection is read-only and bounded by depth, file count, per-file bytes, and total bytes.
- Git internals, environment files, credentials, keys, certificates, databases, generated output, dependency directories, binary files, and .rocksoul are excluded by default.
- Symbolic links are not followed during workspace inspection.
- Workspace Trust is required for project writes, provider requests, patch application, and command execution.
- Provider context is selected from safe excerpts; the endpoint, model, and file list are shown before transmission.
- Patch policy validates scope, path traversal, excluded paths, file type, file size, symbolic links, hard links, and existing-file snapshots.
- Applying changes requires explicit approval after reviewing diffs. Apply and verification are different actions.
- Verification discovers npm scripts as suggestions. The exact command and working directory are shown, automatic pre/post lifecycle hooks are suppressed, and execution has timeout/cancellation and bounded output.
- The selected npm script itself can still perform arbitrary actions. Read its contents before approving it.
- A passed command means only that command exited with code 0; it does not automatically mark all acceptance criteria as verified.

## Tests and packaging

Run npm run check, npm test, and npm run test:extension.

The Extension Host smoke test downloads and launches a clean VS Code test instance. GitHub Actions performs this test and builds a VSIX artifact after the required jobs pass.

Install a downloaded VSIX with code --install-extension rocksoul-ex-0.2.0.vsix. Restart VS Code after installation.
