# ROCKSOUL-EX — Product Definition

## Product identity

- **Name:** ROCKSOUL-EX
- **Working expansion:** Engineering eXperience
- **Category:** VS Code engineering companion
- **Product form:** VS Code extension; local-first for the first release
- **Primary promise:** preserve project direction and connect implementation to evidence
- **Tagline:** Build with purpose. Prove with evidence.

The expansion "Engineering eXperience" is a working explanation for EX, not a requirement that must appear in every user-facing surface.

## Target users

### Primary — independent developers and small product teams

They work across repositories, often with AI assistance, and need a reliable way to retain decisions, plan focused changes, and validate outcomes.

### Secondary — AI-assisted engineers and technical leads

They coordinate work across multiple sessions, models, or contributors and need a durable view of project intent versus implementation reality.

### Not the initial target

Large enterprise organizations requiring centralized policy administration, fleet management, audit retention, or organization-wide identity integrations. Those needs may be explored later without shaping the local MVP prematurely.

## Core jobs to be done

- When I return to a repository, help me quickly understand its current state and next meaningful step.
- When I have a broad goal, break it into small missions that fit the repository's conventions.
- When an AI proposes code, help me inspect and approve the actual change.
- When work is marked complete, show the verification evidence and any remaining gaps.
- When I change models or start a new session, retain the project context that matters.

## Problem / response map

| Problem | Product response |
|---|---|
| Project context is scattered | Project DNA and decision records |
| New sessions repeat discovery | Workspace witness report and session handoff |
| Large goals become vague prompts | Mission decomposition with acceptance criteria |
| AI changes are difficult to review | Scoped file list and visible diff before apply |
| Completion is asserted without tests | Proof report with commands and outcomes |
| Provider changes erase workflow | Provider-neutral project memory |

## Product capabilities

### 1. Project DNA

A small, human-readable source of project intent, architecture boundaries, coding conventions, and important decisions. It should reference existing documentation rather than duplicate entire documents.

### 2. Witness Engine

A bounded workspace inspector that maps project structure and surfaces observable facts. It records the inspection scope and skipped areas.

### 3. Mission System

A task model with a title, goal, scope, assumptions, files or modules in play, acceptance criteria, risks, and status.

### 4. Forge Engine

An implementation workflow that uses a selected AI provider. It prepares context, proposes a patch, and presents a diff for review. Applying changes follows the user's approval and workspace permissions.

### 5. Proof Engine

A verification workflow that discovers or uses configured build, lint, and test commands, runs them only under the workspace execution policy, and records exact outcomes.

### 6. Continuity Engine

A handoff layer that records the active mission, current known state, recent decisions, changed files, failed checks, and next actions.

## Product surfaces

- **Activity Bar / sidebar:** project overview, DNA, missions, and knowledge navigation.
- **Command Palette:** fast access to inspect, ask, create mission, resume, apply, and verify.
- **Editor:** remains the primary workspace for code and review.
- **Diff editor:** the normal place to review code changes.
- **Output channel:** diagnostic and execution logs.
- **Optional Webview:** only for a focused mission canvas or report when native VS Code views are insufficient.

Do not turn the extension into a large, always-open dashboard.

## First-release scope

### Included

- Workspace bootstrap and bounded inspection.
- Project map and source-linked facts.
- Local project DNA and decisions.
- Session handoff.
- Small mission creation and status.
- One provider integration behind an adapter.
- Proposed edits and diff review.
- Configured verification commands and evidence records.

### Excluded until proven necessary

- Hosted accounts and cloud synchronization.
- Team collaboration and shared mission boards.
- Autonomous commits, pushes, merges, or deployments.
- Unrestricted background indexing.
- Complex multi-agent orchestration.
- Marketplace and billing.
- Mandatory external database or server.

## Product constraints

- VS Code is the first host; do not design a generic IDE abstraction before real demand.
- Local workspace files are the portable system of record.
- The model is replaceable; project memory is not.
- The extension must be usable without an AI provider for inspection, DNA, missions, and proof organization.
- Every feature must have a user-visible purpose and an acceptance test.
