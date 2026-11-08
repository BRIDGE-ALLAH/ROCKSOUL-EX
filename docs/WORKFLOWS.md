# ROCKSOUL-EX — Core Workflows

## Workflow A — First contact with a repository

**Goal:** understand the workspace without changing it.

1. The user opens a repository in VS Code.
2. ROCKSOUL shows a quiet entry point and does not start a model call automatically.
3. The user runs Inspect Project.
4. ROCKSOUL checks Workspace Trust and resolves the inspection boundary.
5. It discovers manifests, source roots, documentation, tests, and Git facts within configured limits.
6. It presents a report with observed facts, inferred notes, skipped paths, and inspection time.
7. The user chooses whether to create or update ROCKSOUL project memory.

**Success:** the user can see what was inspected, what was not inspected, and where the main conclusions came from.

## Workflow B — Understand the project

1. Load the project profile, DNA, architecture notes, decisions, and active mission.
2. Refresh only stale or explicitly requested facts.
3. Compare documented claims with repository evidence.
4. Present a concise project briefing: purpose, structure, key constraints, current state, open questions, and next useful step.
5. Let the user correct the interpretation.

**Success:** project context is clear and corrections become durable decisions only with user approval.

## Workflow C — Create a mission

A mission must contain a specific outcome, in-scope and out-of-scope work, relevant files or modules, assumptions and risks, small implementation steps, acceptance criteria, and proposed verification commands.

1. The user states a goal.
2. ROCKSOUL loads relevant context and finds related existing tasks.
3. It proposes a bounded mission.
4. The user edits or approves the scope.
5. The mission is saved locally.

**Success:** a developer or small model can understand the task without reconstructing the whole conversation.

## Workflow D — Build a mission

1. Load the approved mission and its constraints.
2. Select the smallest relevant context.
3. Ask the configured provider for a proposal.
4. Validate that the proposal does not exceed the mission's file and action scope.
5. Present changed-file intent and a reviewable diff.
6. The user approves, edits, or rejects the proposal.
7. Apply approved edits and record the changed paths.
8. Move to verification; do not mark the mission verified yet.

**Success:** no workspace edit occurs invisibly or outside the approved boundary.

## Workflow E — Verify a mission

1. Read the mission's verification plan.
2. Detect project scripts only as suggestions; do not assume they are safe.
3. Show the exact command and working directory.
4. Request permission according to the execution policy.
5. Run the command with cancellation and output limits.
6. Record status, exit code, timing, and concise evidence.
7. Compare results against acceptance criteria.
8. Report verified, failed, not run, or blocked criteria separately.

**Success:** completion claims are directly traceable to actual runs and their limits.

## Workflow F — End a session / resume later

A handoff should include the active mission and state, completed steps, changed files, decisions made, checks run and results, unresolved questions and blockers, and the safest next action.

On resume, ROCKSOUL reads the handoff and checks whether relevant files or Git state changed since it was written. It should not assume the repository is unchanged.

**Success:** the next session starts from a reliable snapshot, not stale confidence.

## Suggested first-use message

"Let's inspect this workspace first. I'll map the project using a bounded, read-only scan, show what I found and what I skipped, then you can decide whether to save its DNA."

## Mission status semantics

| Status | Meaning |
|---|---|
| Draft | Mission is being shaped |
| Ready | Scope and acceptance criteria are approved |
| In progress | Approved implementation is underway |
| Needs review | Proposed change is ready for developer review |
| Implemented | Approved edits were applied |
| Verifying | Checks are running |
| Verified | Required checks passed and criteria have supporting evidence |
| Failed | One or more required checks failed |
| Blocked | A dependency, permission, or environment prevents progress |
| Deferred | User intentionally paused the mission |

"Implemented" and "Verified" are different states.
