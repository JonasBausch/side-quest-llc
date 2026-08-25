# Open Items

Running list of unresolved questions and unfinished work for the SideQuest
builder/tracker, captured 2026-08-25 after the first full build.

Two audiences:

- **Part A — For the GM.** Rules ambiguities. Each item notes what the tool
  currently assumes so you know what a build/session reflects today.
- **Part B — For the next agent.** Implementation gaps and follow-ups, with
  file pointers.

Ground rules from `CLAUDE.md` still apply: the tool stores rules text as prose,
models no mechanics, and validation is advisory. Don't "fix" any of these by
encoding logic — resolve the rules question, then update the prose/metadata.

---

## Part A — Questions for the GM

### A1. Known ruleset gaps (from `CLAUDE.md`, still open)

These are draft holes the tool must not paper over. Right now the verbatim
rules prose that mentions them renders inside node/tag text, but there is **no
dedicated "GM call" callout** in the UI yet (see B1).

1. **Scale slots.** Referenced as a spendable resource (e.g. Spare Couplers,
   "when a Scale slot is spent"; the casting section "Pick scale (S/M/L)") but
   never defined as a quantity you have. How many does a character get? Per
   scene? Per cast? The tracker has **no Scale-slot counter** because we don't
   know the shape.
2. **Casting roll formula.** Ambiguous: "Casting Stat + Magic Die" vs. Wyrd Die
   alone. Which stat is the casting stat (glossary says "whatever fits")?
3. **Starting nodes / Keystone.** Creation says "Whichever path you choose, you
   get Keystone training for your Training," but the glossary says Keystone is
   the reward for completing all five gear nodes. Do characters start with a
   node? A Keystone? The builder currently starts with **nothing taken**.
4. **Wyrd tiers 0–3 and Spellcraft.** The glossary describes a Tier 0–3 track
   (Tune / Interface / Spellcraft) and a Spellcraft node for authoring custom
   spells, but the training tables only show Wyrd-1..5. There is no Spellcraft
   node in any training. Is Tier/Spellcraft a real progression or leftover text?
   The tool models the five printed Wyrd nodes only and does **not** offer
   custom-spell authoring.
5. **Condition stacking.** Unwritten whether two Conditions on the same stat
   stack. The tracker **displays** them cumulatively (e.g. "−2 (Shaken,
   Winded)") but never applies a number to a roll. Confirm intended behaviour.

### A2. Reset semantics (scene vs. job)

The prototype note says "New scene clears per-scene uses and zeroes Wyrd; New
job clears everything including Exposure" but doesn't fully enumerate.

- **Current New scene:** clears per-scene uses, sets Wyrd to 0. **Keeps**
  Conditions, Momentum, Exposure, and per-job uses.
- **Current New job:** clears everything (Momentum, Wyrd, Exposure, Conditions,
  all uses).
- **Question:** On a new scene, should Conditions clear? Momentum? (We assumed
  no — those aren't scene-scoped in the fiction.)

### A3. `counter`-frequency abilities — reset timing

Abilities like **Oath Tape Recorder** ("Limit: 1 active oath") and the
**Echo Recording** hold-limit are ongoing counts, not once-a-scene toggles.

- **Current behaviour:** treated like per-job — they appear under "Per job" in
  the tracker and clear on **New job**, not New scene.
- **Question:** Is that right, or does an oath/echo persist across jobs, or
  reset per scene?

### A4. Signature tag access when cross-trained

A character picks a Signature spell tag at Wyrd-2. With cross-training, which
tags are eligible?

- **Current behaviour:** the union of `availableTagIds` from the main training
  **plus** any training in which the character has taken a Wyrd node.
- **Question:** Correct? Or is the Signature limited to the main training's
  tags only?

### A5. Momentum / Exposure limits

- Momentum is clamped **0–10** (rules state a 10 cap). OK?
- Exposure floors at 0, **no ceiling**, with a note "consequence at 3" (rules:
  "At 3 failures a consequence hits"). Is Exposure a 0–3 clock that resets, or
  an open counter? We treated it as an open counter.

### A6. Transcription conflicts (please confirm the source PDF)

Where the training tables and the options prose disagree, we followed the
tables (per `CLAUDE.md`), but these are worth a human/GM confirmation. Each is
flagged in a header comment in the relevant file under `src/content/trainings/`.

1. **Cleanup Specialist, Gear-2.** Table calls it **Trace Kit**; the options
   prose heads the same entry **Forensics Kit**. We used "Trace Kit" (name) with
   the Forensics Kit text. Same node, or two different ones?
2. **Sensor Operator, gear order vs. cost.** Uniquely, the no-cost "(—)" gear
   is **not** Gear-1 here. The table orders **Gear-1 EM/Sigil Sweep (1)**,
   **Gear-2 Thermal Polaroids (—)**. Every other training makes the "(—)" item
   Gear-1. Is the table order correct, or should Thermal Polaroids be Gear-1?
3. **Cleanup Specialist, Neutralizer.** The rules text is truncated: "On a
   success, choose one: Wyrd −1d4 (if the hazard is Wyrd-driven)" — "choose one"
   with a single option. Is an option missing?
4. **Echo Recording wording.** Artifact Handler and Research Archivist include a
   final "Cost: Echos are sticky…" line; **Sensor Operator's copy omits it.**
   Transcribed as printed. Intentional?
5. **Artifact Handler, Museum Gloves (Gear-1).** Its only description is the
   unlabelled line "First contact with a ridden object doesn't auto-trigger it."
   Confirm that's the whole node.
6. **"Crowd Liason" spelling.** The section header and Training Options spell it
   "Liason"; the glossary spells it "Liaison." We used "Crowd Liason" (id
   `crowd-liason`). Confirm the intended spelling — a rename touches the id.

---

## Part B — For the next agent

Repo orientation: content in `src/content/` (schema + one file per training +
shared collections + `index.ts` registry), pure helpers in `src/lib/`, two
screens in `src/components/` (`Builder.tsx`, `Tracker.tsx`), shell in
`src/App.tsx`. `npm run dev` / `npm run build`. Deploys via
`.github/workflows/deploy.yml` to `https://jonasbausch.github.io/side-quest-llc/`
(Vite `base` is `/side-quest-llc/`).

### B1. Surface the known gaps as GM-call notes (highest priority)

`CLAUDE.md` explicitly wants the five A1 gaps shown in the UI as GM-call notes;
this was **not built**. Suggested approach: a small `src/content/gm-notes.ts`
(id, title, prose, optional `relatesTo` tags/nodes) plus a generic
`<GmNote>`/callout component, shown in the Builder (near the relevant section)
and/or a dedicated "GM calls" card. Keep it data-driven — no gap text hard-coded
in a component.

### B2. In-browser runtime verification

The build is `tsc`-clean and the live page returns 200, but **no screen was
exercised in a browser** this session (the Chrome extension wasn't connected).
Smoke-test: build a character, take cross-trained nodes, assign dice, confirm
the share link round-trips, then on the tracker toggle each Condition (verify
the stat cross-reference highlights), move Wyrd through 4 and 6 (background
reskin), and run both resets. Confirm mobile layout and the print stylesheet.

### B3. No automated tests

`CLAUDE.md` mentions structural tests ("a specialty, five gear nodes, five wyrd
nodes, a non-empty tag list, tag ids that resolve"). None exist. Suggest adding
Vitest with: (a) content structural tests over `trainings`, (b) tag-id
resolution against `spellTags`, (c) a `serialize` round-trip test, (d) storage
scene/job reset tests. A quick manual resolution check was done via grep only.

### B4. Trait frequency tagging is heuristic

The `frequency` on each trope/strength/flaw was inferred from its own
"once per scene/job" wording; entries with no stated cadence got none (so they
don't appear as tracker "uses"). A pass against the PDF could reclassify edge
cases (e.g. "start each job with…" was tagged `passive`, not `perJob`). Files:
`src/content/{tropes,strengths,flaws}.ts`.

### B5. Workflow Node version

`.github/workflows/deploy.yml` pins `setup-node@v4` with `node-version: 20`,
which GitHub now force-runs on Node 24 with a deprecation warning. Bump to 24.

### B6. Smaller follow-ups

- **Copy-as-new-character.** The character `id` lives in the URL payload, so a
  shared link shares the id (each browser still keeps its own localStorage
  session). If you want recipients to fork cleanly, add a "duplicate as new"
  action that regenerates `id` (`emptyDefinition()` shows the pattern).
- **Signature UI gating** appears once any Wyrd-2 node is taken in any training
  (`Builder.tsx`, `hasSignatureNode`). Revisit if A4 changes.
- **Import/Export** uses plain (uncompressed) JSON in a textarea; the URL uses
  LZ compression. Fine, just noting the asymmetry.
- **Rules-version banner** compares `def.rulesVersion` to `CURRENT_RULES_VERSION`
  (`src/content/schema.ts`) and shows a banner on mismatch. When a new rules
  file lands, bump the constant; there is intentionally **no silent migration**.
