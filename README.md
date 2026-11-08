# ROCKSOUL-EX

**The Engineering Experience. Build with purpose. Prove with evidence.**

![ROCKSOUL-EX poster](assets/rocksoul-ex-poster.svg)

ROCKSOUL-EX is a local-first Visual Studio Code engineering companion. It connects repository context, durable project memory, focused missions, a provider-neutral AI handoff, and verification evidence — without requiring a hosted backend.

**OBSERVE → UNDERSTAND → BUILD → VERIFY**

> Your repository has a story. Don't lose its direction.

## Current release line

**0.1.0 — working local-first MVP foundation.** The repository now contains a runnable VS Code extension implementation, bounded project inspection, `.rocksoul/` memory, missions, clipboard-based AI context packs, and explicit npm verification with evidence records.

The initial Forge handoff does not call an AI API. An automated provider adapter, patch/diff approval, full mission verification, and Marketplace packaging remain separate work and are not represented as complete.

## Start here

| Document | Purpose |
|---|---|
| [Getting Started](docs/GETTING-STARTED.md) | Run the extension and follow the first-use flow |
| [Implementation Status](docs/IMPLEMENTATION-STATUS.md) | Implemented, partial, and unverified capabilities |
| [Vision](docs/VISION.md) | Why ROCKSOUL-EX exists |
| [Product definition](docs/PRODUCT.md) | Users, promise, scope, and boundaries |
| [Behavior DNA](docs/DNA.md) | Witness, Human Pen, Forge, and Proof |
| [Visual & UX direction](docs/UX-DIRECTION.md) | Art direction and interface principles |
| [Architecture](docs/ARCHITECTURE.md) | Extension layers and technical boundaries |
| [Core workflows](docs/WORKFLOWS.md) | Inspection, missions, handoff, and proof |
| [Security model](docs/SECURITY.md) | Workspace trust, privacy, and execution boundaries |
| [Roadmap](docs/ROADMAP.md) | Milestones and remaining product work |
| [Implementation backlog](docs/IMPLEMENTATION-BACKLOG.md) | Small tasks with acceptance criteria |

## What works now

- **Witness:** explicit, bounded, read-only text inspection; no scan runs automatically.
- **Memory:** user-readable project DNA, architecture, decisions, missions, and handoffs in `.rocksoul/`.
- **Mission:** create and maintain small work items with scope and acceptance criteria.
- **Forge handoff:** copy an approved mission context pack to the clipboard for use with the AI assistant of your choice. No provider call is made.
- **Proof:** inspect npm scripts, approve one exact command, run it in a trusted workspace, and store bounded evidence.

## Run and test

```bash
npm test
npm run check
```

Open the repository in VS Code, press `F5`, and follow [Getting Started](docs/GETTING-STARTED.md).

## Product principles

1. Understand before changing.
2. Keep context durable and human-readable.
3. Make work small, scoped, and reviewable.
4. Separate implementation from verification.
5. Prove completion with evidence, not confident language.
6. Keep humans in control of writes, provider disclosure, and command execution.
7. Stay local-first and useful without an AI provider.

## Relationship to MoonWitness

ROCKSOUL-EX shares the Witness / Human Pen / Forge / Proof philosophy associated with the wider MoonWitness creative universe. It remains an independent developer tool; MoonWitness is not a runtime dependency.

**ROCKSOUL-EX — Silent by default. Useful by design. Honest by evidence.**
