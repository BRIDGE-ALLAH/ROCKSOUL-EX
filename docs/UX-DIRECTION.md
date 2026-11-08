# ROCKSOUL-EX — Visual & UX Direction

## Art direction

**Dark Engineering × Brutalist Editorial × MoonWitness restraint.**

The interface should feel like a focused engineering instrument with the attitude of an underground print poster. It should not look like a generic admin dashboard, a neon gaming template, or a clone of another AI assistant.

The poster is a campaign expression of the identity. The daily extension UI must be calmer and more legible than the poster.

## Visual pillars

### 1. Brutalist editorial

- Large, decisive typography in marketing surfaces.
- Clear hierarchy, hard edges, compact labels, intentional negative space.
- Occasional distressed / halftone textures in promotional assets only.
- Avoid ornamental cards, gradients everywhere, and stock cyberpunk clichés.

### 2. Engineering instrument

- Precise alignment, thin rules, grids, coordinates, file paths, and status markers.
- Technical data should be quiet and immediately readable.
- Use cyan as a restrained signal color, not as a full-screen glow.
- Never label a visible UI section with the literal word "HUD"; the influence is visual, not a product feature name.

### 3. MoonWitness restraint

- A witness / monolith symbol can represent observation without depicting a face.
- Use light, orbit, shadow, and signal as motifs.
- Avoid literal religious symbols or claims in the developer-tool interface.
- Keep the visual tone respectful, original, and functional.

## Design tokens

| Token | Value | Intended use |
|---|---|---|
| Background | #080A0D | Poster / optional custom surface |
| Surface | #11151A | Secondary surface |
| Elevated surface | #1B2128 | Selected or raised element |
| Primary text | #F2EEE5 | Main text on dark surfaces |
| Muted text | #AAB3B5 | Secondary labels |
| Signal orange | #EF704B | Primary accent / active mission |
| Signal cyan | #8FC8D4 | Technical focus / observation |
| Border | #394148 | Dividers and boundaries |
| Success | Theme-native success | Verified outcome |
| Warning | Theme-native warning | Needs attention |
| Error | Theme-native error | Failed outcome |

The initial extension should inherit VS Code theme colors wherever possible. Tokens above are the visual reference for any branded webview or promotional material, not a mandate to override editor accessibility settings.

## Typography

- Main display: Inter Display or a close system sans-serif fallback.
- Technical labels: a legible monospace family.
- Body: VS Code theme typography or the editor's configured font.
- Avoid using display fonts for long technical text.
- Do not depend on a bundled font for the first release.

## Icon and symbol language

- Primary mark: abstract monolith / witness aperture / signal point.
- Use simple line icons for inspect, mission, memory, build, verify, and settings.
- Use familiar VS Code icon conventions for actions.
- Do not use a human face, mascot face, or emoji as the core brand mark.
- The monolith must remain legible at 16–24 px; simplify it into a single silhouette at small sizes.

## Interface composition

### Sidebar

A compact tree, not a wall of cards:

- Project
- DNA
- Missions
- Decisions
- Sessions
- Proof

The tree should reveal only useful status metadata. Keep file and mission names readable and navigable.

### Mission view

Show the goal, scope, acceptance criteria, proposed files, risk notes, current state, and available actions. The primary action must be unambiguous. Separate "Apply changes" from "Run checks".

### Proof view

Show checks as rows with status, command, exit code, duration, and expandable output. A check that was not run must not appear as passed.

### Empty state

Start with one useful question: **What's the mission?** Offer a clear inspect command and a short explanation. Do not show fake data or decorative metrics.

### Editor and diff

The editor remains central. Use VS Code's native diff editor for proposed changes wherever possible. Do not force all code review into a webview.

## Interaction rules

- Command Palette is the fast path.
- No automatic chat panel on activation.
- No background model calls without an explicit user action or clearly configured behavior.
- Avoid modal prompts for non-critical information.
- Use native VS Code confirmation and progress APIs where possible.
- Preserve keyboard navigation and screen-reader labels.
- Respect light and dark themes; branded surfaces must have adequate contrast.

## Motion and sound

- Motion is optional, short, and informative.
- Never use pulsing / blinking as the only status indicator.
- No sound effects in the MVP.
- No continuous ambient animation.

## Promotional direction

The first poster uses a faceless monolith inside an orbital engineering diagram, high-contrast typography, graphite black, warm paper white, signal orange, and technical cyan. It communicates observation, continuity, and evidence—not an autonomous robot or generic chatbot.

## Visual acceptance criteria

- The extension looks native enough to belong inside VS Code.
- Branded elements are recognizable without overwhelming code.
- Important status is communicated by text and icon, not color alone.
- No placeholder statistics, fake progress, or decorative "AI is thinking" theatrics.
- The poster and extension share motifs, while each surface serves its own purpose.
