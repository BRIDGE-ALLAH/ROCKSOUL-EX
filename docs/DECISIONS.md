# ROCKSOUL-EX — Architecture & Product Decisions

This is the initial decision log. Decisions may be superseded, but changes must be recorded with rationale and migration impact.

## ADR-001 — Build an engineering companion, not a chat clone

**Status:** Accepted

**Decision:** The core product is repository continuity plus mission execution plus proof. Chat is an optional interaction surface, not the product definition.

**Rationale:** A chat wrapper is replaceable and does not solve project context loss or false completion.

## ADR-002 — VS Code extension is the first product surface

**Status:** Accepted

**Decision:** Start inside VS Code using Extension API, native views, commands, and diff editor.

**Rationale:** The user is already working in the editor. A separate dashboard would add friction before value is proven.

## ADR-003 — Local-first workspace memory

**Status:** Accepted for MVP

**Decision:** Use user-inspectable Markdown and small JSON records under .rocksoul.

**Rationale:** Portability, transparency, low operational cost, and independence from any server or provider.

**Constraint:** Never overwrite existing files; bootstrap requires consent or an explicit setting.

## ADR-004 — JavaScript ESM, no backend by default

**Status:** Accepted for MVP

**Decision:** Implement the extension in JavaScript ESM using the VS Code-provided Node.js runtime. Do not add Fastify, Next.js, or a database unless a validated capability requires a separate process.

**Rationale:** An extension can deliver the initial product loop without a server. A smaller stack reduces setup and maintenance.

## ADR-005 — Provider-agnostic core

**Status:** Accepted

**Decision:** Put model calls behind a provider port. Validate one provider integration before supporting multiple providers.

**Rationale:** Project DNA and mission state must survive model and vendor changes.

## ADR-006 — Read-only inspection first; explicit write approval

**Status:** Accepted

**Decision:** Workspace inspection is read-only. Proposed code changes are shown as diffs and applied only after approval by default.

**Rationale:** Trust and reviewability are product features, not optional polish.

## ADR-007 — Verification is a separate permission and state

**Status:** Accepted

**Decision:** Applying edits does not authorize shell execution. Implemented does not mean Verified. Required evidence must exist before a mission becomes Verified.

**Rationale:** Protect against accidental side effects and fake completion.

## ADR-008 — Native VS Code UX before a custom dashboard

**Status:** Accepted

**Decision:** Use Tree Views, commands, Output channel, Progress, and native diff first. Add a Webview only for a clearly demonstrated need.

**Rationale:** Keep the editor central and avoid generic dashboard bloat.

## ADR-009 — Documentation baseline before implementation

**Status:** Accepted

**Decision:** This repository establishes product, behavior, UX, architecture, security, and task contracts before the extension implementation begins.

**Rationale:** A coherent baseline reduces contradictory local-agent implementation and duplicated features.

## Deferred decisions

- First AI provider and authentication flow.
- Whether a local companion process is required.
- Default Git tracking policy for .rocksoul records.
- Whether team synchronization is valuable.
- How optional MoonWitness integration should exchange knowledge.

Do not decide deferred items by adding infrastructure speculatively.
