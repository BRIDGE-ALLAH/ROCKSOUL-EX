# ROCKSOUL-EX — Vision

## The thesis

Software projects are more than files. A repository accumulates intent, architecture, trade-offs, experiments, unfinished work, and lessons learned. Yet AI-assisted development often treats every interaction as a fresh request. Context is scattered across prompts, chat histories, TODO files, issue trackers, and the developer's memory.

ROCKSOUL-EX exists to close that continuity gap.

It is an engineering companion inside the editor: it observes a project, helps a developer understand its current reality, keeps its direction available, and turns chosen work into reviewable changes with verifiable outcomes.

## The promise

**Every engineering session should begin with better context and end with clearer evidence.**

ROCKSOUL-EX should help answer five questions:

1. What is this project trying to become?
2. What is actually present in the repository today?
3. What decisions and constraints must not be forgotten?
4. What is the smallest useful next mission?
5. What evidence shows whether that mission succeeded?

## Why this should exist

### The context gap

A model can be capable and still be poorly informed. A new session may not know the repository's conventions, existing decisions, or earlier failed attempts. Repeating the explanation wastes attention and invites contradictions.

### The execution gap

A plan is not an implementation. A proposed patch is not an applied patch. An applied patch is not a working feature. Engineering work needs visible transitions between these states.

### The proof gap

Generated code can look convincing while being incomplete, untested, or inconsistent with the project. Completion needs evidence: changed files, commands, exit codes, test output, and remaining risks.

ROCKSOUL-EX makes these gaps explicit instead of hiding them behind a polished answer.

## The product idea

ROCKSOUL-EX is not primarily a chat window. It is a continuity and execution layer around the developer's existing editor and chosen AI provider.

Its core loop is:

**Observe → Understand → Build → Verify**

- Observe the workspace before proposing changes.
- Understand the project through its DNA, architecture, decisions, and current state.
- Build through scoped missions, explicit approvals, and visible diffs.
- Verify using real project commands and honest evidence records.

## North Star

A developer can reopen a complex repository after days or weeks, ask what matters now, and receive a concise, source-linked account of the project's direction, current reality, unfinished mission, and safest next step—without reconstructing the whole story manually.

## What success feels like

- The developer does not have to explain the same project every session.
- The assistant distinguishes repository facts from guesses.
- A mission is small enough to review and finish.
- A change never appears silently or without a trace.
- "Done" means the stated acceptance criteria have evidence.
- A developer can switch AI providers without losing project memory.
- The tool stays helpful without constantly interrupting the editor.

## What ROCKSOUL-EX is not

It is not a replacement for a developer's judgment, source control, code review, tests, CI, or documentation. It must not imply that AI-generated work is inherently correct. It is not an autonomous agent with unrestricted authority over a workspace.

The developer remains the author and decision-maker. ROCKSOUL-EX helps preserve intent and make the work more accountable.

## Relationship to MoonWitness

The product borrows a creative philosophy, not a runtime dependency:

- **Witness:** look carefully before interpreting.
- **Human Pen:** the human owns the story and final decision.
- **Forge:** ideas must pass through real work.
- **Proof:** claims must be distinguishable from evidence.

MoonWitness may later provide optional narrative or knowledge integrations. ROCKSOUL-EX must be useful on a clean, unrelated repository with no MoonWitness services installed.

## One-sentence positioning

**ROCKSOUL-EX is the project-aware engineering companion that keeps repository context, meaningful work, and proof connected inside VS Code.**
