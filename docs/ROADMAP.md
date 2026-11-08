# ROCKSOUL-EX — Product Roadmap

## Delivery strategy

Build in a sequence that proves product value before adding complexity. Each milestone must produce a usable capability and explicit evidence. Dates are intentionally omitted; progress should be measured by acceptance criteria, not optimistic calendar estimates.

## M0 — Product and technical foundation

**Outcome:** a stable contract for the first implementation.

- [ ] Confirm product name, positioning, and first-release scope.
- [ ] Keep the repository documentation as the single product baseline.
- [ ] Create a minimal VS Code extension skeleton in JavaScript ESM.
- [ ] Add a minimal test runner and formatting / lint conventions.
- [ ] Add a sample workspace fixture with mixed project files.
- [ ] Record the extension's supported VS Code engine range.
- [ ] Validate the extension can activate and run one command.
- [ ] Document how to run extension-host tests locally.

**Exit criteria:** extension installs in an Extension Development Host, one command runs, and a smoke test passes.

## M1 — THE WITNESS

**Outcome:** read-only workspace understanding.

- [ ] Detect workspace root and Git root safely.
- [ ] Respect Workspace Trust.
- [ ] Implement conservative ignore and secret exclusions.
- [ ] Add scan depth, file count, file size, and total-byte limits.
- [ ] Discover common manifests, scripts, docs, source roots, and tests.
- [ ] Create a project map with source-linked facts.
- [ ] Show observed, inferred, skipped, and unknown information distinctly.
- [ ] Add cancellation and progress feedback.
- [ ] Add tests for exclusions, limits, and unusual repository layouts.

**Exit criteria:** inspection works on the sample fixture and a medium-sized real repository without modifying workspace files.

## M2 — THE MEMORY

**Outcome:** durable, portable project context.

- [ ] Define and validate the .rocksoul data contract.
- [ ] Bootstrap only missing files after explicit user consent.
- [ ] Read DNA and architecture references.
- [ ] Record decisions with date, rationale, and affected area.
- [ ] Save a session handoff.
- [ ] Detect when a handoff may be stale.
- [ ] Add inspect / edit / delete affordances for ROCKSOUL-owned data.
- [ ] Test round-trip serialization and malformed records.

**Exit criteria:** a user can close VS Code, reopen the project, and recover an accurate handoff without a provider call.

## M3 — THE MISSION

**Outcome:** turn goals into bounded engineering tasks.

- [ ] Define Mission schema and status transitions.
- [ ] Create a mission from a natural-language goal.
- [ ] Attach scope, exclusions, assumptions, risks, and acceptance criteria.
- [ ] Split large goals into reviewable steps.
- [ ] Detect likely overlap with active missions.
- [ ] Display mission list and mission detail in native VS Code UI.
- [ ] Support pause, defer, resume, and close.
- [ ] Test invalid state transitions and incomplete criteria.

**Exit criteria:** a mission can be created and resumed without AI; AI may improve decomposition but is not required for storage or display.

## M4 — THE FORGE

**Outcome:** provider-assisted, reviewable implementation.

- [ ] Define the provider adapter contract.
- [ ] Run a feasibility spike for one initial provider.
- [ ] Store provider secrets with secure editor storage.
- [ ] Build minimal context packs from the active mission.
- [ ] Validate provider output and proposed changed paths.
- [ ] Present the proposed patch in the VS Code diff editor.
- [ ] Require explicit approval before applying edits by default.
- [ ] Record changed files and proposal metadata.
- [ ] Test provider failures, cancellation, malformed output, and scope violations.

**Exit criteria:** one provider can propose a small patch, the developer can review it, and only approved changes are applied.

## M5 — THE PROOF

**Outcome:** honest verification and mission closure.

- [ ] Discover project check commands as suggestions.
- [ ] Show command, arguments, working directory, and expected effect.
- [ ] Enforce Workspace Trust and command approval policy.
- [ ] Run approved checks with timeout, cancellation, and output limits.
- [ ] Store command evidence and exit status.
- [ ] Map evidence to acceptance criteria.
- [ ] Distinguish implemented, verified, failed, not-run, and blocked.
- [ ] Generate a concise mission report.
- [ ] Test failing commands and interrupted runs.

**Exit criteria:** a mission cannot become Verified unless every required criterion has supporting evidence and the required checks passed.

## M6 — EXPERIENCE HARDENING

**Outcome:** a dependable extension that feels at home in VS Code.

- [ ] Audit accessibility and keyboard navigation.
- [ ] Test dark and light themes.
- [ ] Test large repositories and cancellation.
- [ ] Improve performance and cache invalidation.
- [ ] Add extension packaging and release automation.
- [ ] Add a clean uninstall / workspace data retention guide.
- [ ] Validate installation on supported VS Code versions.
- [ ] Publish a release only after a complete smoke and security test.

## Later exploration — not MVP commitments

- Multiple provider adapters.
- Optional local companion process.
- Optional MoonWitness knowledge bridge.
- Mission templates and reusable project playbooks.
- Multi-agent delegation with explicit role boundaries.
- Team synchronization after a privacy and access model exists.

These ideas must not delay the first reliable single-developer workflow.
