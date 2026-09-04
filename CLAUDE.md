# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Read this whole file before making changes. The **Non-negotiables** below are
the constraints most likely to trip you up; the **Commands** section gets you
running.

## Commands

```
npm install        # once
npm run dev        # Vite dev server with HMR (default http://localhost:5173)
npm run build      # tsc -b && vite build — the typecheck AND the build in one
npm run preview    # serve the production build from dist/
```

- **`npm run build` is the only automated gate.** There is no lint step and no
  test runner configured — `tsc -b` inside `build` is what catches breakage, so
  run it before you commit. To typecheck alone: `npx tsc --noEmit`.
- **The "structural tests" referred to under Working conventions are a manual
  review discipline** (diff each training against the PDF), not an automated
  suite. Content correctness at runtime is enforced by the Zod schemas in
  `src/content/schema.ts`, validated as content is imported.
- **Deploy is automatic.** Pushing to `main` triggers `.github/workflows/deploy.yml`,
  which builds and publishes `dist/` to GitHub Pages. There is nothing to run by hand.

## Where to start

- Game content to add or fix → `src/content/` (schema in `schema.ts`, one file
  per training under `trainings/`). See **Content model** and **Working conventions**.
- Builder/tracker behavior or styling → `src/components/` + `src/styles.css`.
- Serialization, storage, validation → `src/lib/`. See the two data lifecycles
  under **Architecture** — keep them separate.

## What this is

A character builder and live session tracker for **SideQuest**, a homebrew
tabletop RPG. It is used by a small cast during recorded actual-play sessions,
often on phones, sometimes with bad wifi.

The rules live in `docs/rules-v5.0.md`. It is the source of truth for all game
content, and it is edited in place — there is no new-file-per-version dance and
no strict versioning semantics. Rules changes flow both ways: the GM ships
updates that land here and drive the content update, and we may also correct
the rules ourselves (typos, stale references, half-applied edits), which then
get sent back to the GM to apply on their end.

Keep the two kinds of edit distinct. Transcribing the GM's changes into
`src/content/` is routine. Changing the rules *themselves* is a game-design
decision — make those only when asked, or when something is unambiguously
broken (a node the rules no longer define, a reference to a removed concept).

Open questions for the GM live in `docs/gm-questions.md`. It is **local only,
gitignored, and must never be committed** — it is a working sheet shared with
the GM outside this repo. Edit it in place as answers come in (each question is
also mirrored as a GitHub issue), but keep it out of every commit and PR.

## Non-negotiables

**Do not model game mechanics.** Store rules text as prose. The only structured
fields are metadata: name, frequency, prerequisite, cost. Never write code that
resolves an effect, computes a roll outcome, or enforces a rule. The ruleset is
an unfinished draft and tables houserule constantly. Anything encoded as logic
becomes wrong and has to be unwound.

Concretely: `{ id, name, frequency: 'perScene', text: 'Make a broken thing
work for one beat...' }` is right. A `applyBlowback()` function is wrong.

**Content is data, code is a renderer.** Every SideQuest-specific fact lives in
`src/content/`. Components must be generic over that data. If a component names
a specific training, gear node, or spell tag, that is a bug.

**Validation is advisory, never blocking.** Warn on an illegal build, do not
prevent it. A tool that refuses a GM's ruling gets abandoned after one session.

**No backend.** No accounts, no database, no auth. The GM tracks the shared
table state herself. Players only track their own.

## Architecture

Vite + React + TypeScript. Deployed to GitHub Pages via GitHub Actions.

Two data lifecycles, kept strictly separate:

- **Character definition.** Training, path, nodes taken, trope, strength, flaw,
  die assignment, name. Changes about once per job. Serialized, compressed, and
  stored in the URL fragment so a character is a shareable link. Also
  importable and exportable as JSON.
- **Session state.** Momentum, conditions, Wyrd, Exposure, which
  once-per-scene uses are spent. Changes constantly. Lives in localStorage,
  keyed by character id. Never shared.

Do not let these leak into each other. A session reset must not touch the
definition, and loading a share link must not clobber someone's live state.

## Layout

```
docs/rules-v5.0.md      GM's ruleset, verbatim, read-only
docs/gm-questions.md    Open questions for the GM — local only, never commit
src/content/schema.ts   Zod schemas and inferred types
src/content/trainings/  One file per training
src/content/*.ts        Spell tags, tropes, strengths, flaws, conditions, wyrd
src/lib/                Serialization, storage, validation
src/components/         Generic renderers
```

## Content model

All ten trainings share one shape: a specialty, five Wyrd path nodes, five
Mundane path nodes, and a list of available spell tags. Spell tags are shared
across trainings and referenced by id, never duplicated inline.

`frequency` is one of `perScene`, `perJob`, `passive`, `counter`. That enum is
the entire mechanical abstraction. Resist adding to it.

Every stored character carries a `rulesVersion`. When it does not match the
current ruleset, show a banner. Do not migrate silently.

## Known gaps in the ruleset

The draft has real holes. Do not paper over them in code, surface them in the
UI as GM-call notes:

- The casting roll formula is ambiguous, stat die plus Wyrd die or Wyrd die
  alone.
- Starting nodes are unclear. Creation implies a Keystone, the glossary says
  Keystone is the reward for finishing a path.
- The glossary describes Wyrd tiers 0 to 3 and a Spellcraft node that the
  training tables do not contain.
- Whether two conditions on the same stat stack is unwritten.

Where the rules conflict, the training tables win over the glossary, and a note
goes in the UI.

## The prototype

`docs/prototype/jd-field-record.html` is a single-character throwaway built
before this repo existed. It is a **design reference only**. It is not part of
the build, it is not to be ported, and nothing should import from it.

Take from it:

- The interaction model. Conditions cross-reference the stats they penalise, so
  toggling one highlights the affected dice with the reason. This is the single
  most useful thing it does at the table.
- Scene-state feedback. The Wyrd track changes the page background at 4 and
  again at 6, readable in peripheral vision without focusing on it.
- Reset semantics. "New scene" clears per-scene uses and zeroes Wyrd. "New job"
  clears everything including Exposure, except Momentum, which carries between
  jobs. These map to real table moments.
- Progression as unlock. Nodes not yet taken are visible but inert, so players
  can see what a promotion buys them.
- The visual direction: work-order stock, condensed industrial display type,
  carbon-copy accent. Reuse the direction, not the CSS.

Ignore from it:

- **`window.storage`.** That is a Claude artifact API and does not exist in a
  browser. Use localStorage.
- Vanilla JS, string-built DOM, and global state. All of it is throwaway.
- Everything hardcoded to one character, one training, one path.

## Working conventions

Transcription is the bulk of the work and it fails silently. Therefore:

- **One training per commit.** Small diffs are reviewable against the PDF.
  A thousand-line content dump is not.
- Quote rules text closely. Light copyedits for typos are fine. Do not
  paraphrase, reorder, or "improve" wording.
- Every training must pass structural tests: a specialty, five gear nodes,
  five wyrd nodes, a non-empty tag list, and tag ids that resolve.
- Field Tinkerer first, then Negotiator. Negotiator is structurally unusual
  and will stress the schema early, while it is still cheap to change.

## UI

Mobile-first. The primary use is a phone held in one hand during a recording,
so touch targets are generous and the live-state controls sit above the fold.
Include a print stylesheet, someone will want paper.

Respect `prefers-reduced-motion`, keep keyboard focus visible, and make sure
the whole builder is usable without a pointer.

Scene-state feedback keys off the Wyrd tier computed in `App.tsx` (`wyrd-calm`
→ `distortion` → `hazard` → `surge` at 0/2/4/6). That tier drives both the
background shift and `WyrdWhimsy`, a decorative layer of absurd drifters that
gets denser as Wyrd climbs. Its list lives in `src/content/whimsy.ts` — note
this is **decorative data, deliberately outside the Zod rules registry** in
`content/index.ts`. Not all `src/content/` is rules content; don't give whimsy
a rules schema or wire it into character/session state. Anything motion-based
here must be disabled under `prefers-reduced-motion` (CSS handles the whimsy).

## Before you start

If the schema does not exist yet, write it and stop. Do not scaffold the app
around an unreviewed schema. Every content file inherits its shape, and
reworking it later means redoing all of them.