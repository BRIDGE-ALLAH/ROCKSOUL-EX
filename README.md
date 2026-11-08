# ROCKSOUL-EX

**The Engineering Experience. Build with purpose. Prove with evidence.**

ROCKSOUL-EX is a local-first Visual Studio Code engineering companion. It connects repository context, durable project memory, focused missions, AI-proposed patches, human review, and verification evidence — without requiring a hosted backend.

**OBSERVE → UNDERSTAND → BUILD → VERIFY**

> Your repository has a story. Don't lose its direction.

## Current release line

**0.3.0 — Reliability engines.** The GitHub Release is published with an installable VSIX; Marketplace publication remains a separate credential-gated step. ROCKSOUL-EX includes the local-first Witness, Memory, Mission, and Proof foundation plus an OpenAI Responses API adapter, SecretStorage credentials, mission-scoped structured patch proposals, diff preview, and a second explicit approval before applying changes.

The AI provider integration sends only the selected mission context after a disclosure prompt. The model never has direct file-system or shell access. A successful command or patch application does not automatically verify a mission.

## What works

- **Witness:** explicit, bounded, read-only workspace inspection; respects nested .gitignore rules, reports Git state, reuses unchanged files in a session cache, and shows scan deltas.
- **Memory:** user-readable project DNA, architecture, decisions, missions, and handoffs in the project’s .rocksoul folder.
- **Mission:** create, reopen, and update focused work with scope and acceptance criteria.
- **Forge:** send selected context to the OpenAI Responses API; validate structured proposed changes against the mission scope; show native VS Code diffs.
- **Human approval:** require a second approval before source files change; reject out-of-scope, secret, traversal, symlink, hard-link, binary, and oversized targets. Multi-file writes use a durable journal, backups, rollback, and explicit crash recovery.
- **Proof:** inspect npm scripts, approve one exact command, suppress automatic npm lifecycle hooks, run with timeout/cancellation, and retain bounded evidence mapped to reviewed acceptance criteria. Verified is blocked until every criterion has passing evidence.

## Quick start

Requirements: Visual Studio Code 1.90+, Node.js 20+ for repository tests, and an OpenAI API key only when using Forge.

Clone this repository, run npm test, and open the folder in VS Code. Press **F5** and select **ROCKSOUL-EX: Run Extension**. For full usage and configuration, read [Getting Started](docs/GETTING-STARTED.md).

## Privacy and trust

ROCKSOUL-EX has no required server, database, login, telemetry, or background indexing. Project memory is local. The OpenAI API key is kept in VS Code SecretStorage. Before a provider request, the extension identifies the endpoint, model, and selected paths. Source excerpts are transmitted to the endpoint only after explicit approval. OpenAI API usage may incur charges under the user's API account.

The extension respects Workspace Trust. Writes, provider requests, patch application, and command execution are disabled in Restricted Mode.

## Quality and distribution

- npm run check runs syntax checks and unit tests.
- GitHub Actions tests Node 20 and 22.
- An Extension Development Host smoke test runs in CI.
- A VSIX package is built as a CI artifact.
- A version change merged to main triggers a verified GitHub Release. The Marketplace publisher ID is `MohRezzaFahlevi`; publication requires a matching Marketplace publisher credential or trusted OIDC configuration.

Read [Implementation Status](docs/IMPLEMENTATION-STATUS.md), [Security](SECURITY.md), and [Release Checklist](docs/RELEASE-CHECKLIST.md). A green CI run is necessary but not a substitute for a clean-profile manual installation and live-provider acceptance test.

## Product principles

1. Understand before changing.
2. Keep context durable and human-readable.
3. Make work small, scoped, and reviewable.
4. Separate patch application from command execution.
5. Prove completion with evidence, not confident language.
6. Keep humans in control of provider disclosure, writes, and execution.
7. Stay local-first and useful without an AI provider.

## Relationship to MoonWitness

ROCKSOUL-EX shares the Witness / Human Pen / Forge / Proof philosophy associated with the wider MoonWitness creative universe. It remains an independent developer tool; MoonWitness is not a runtime dependency.

**ROCKSOUL-EX — Silent by default. Useful by design. Honest by evidence.**
