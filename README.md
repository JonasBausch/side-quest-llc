# SideQuest — Character Builder & Session Tracker

A web-based character builder and live session tracker for **SideQuest**, a
homebrew tabletop RPG. It's used by a small cast during recorded actual-play
sessions — often on phones, sometimes on bad wifi — so it's mobile-first, works
without a backend, and turns each character into a shareable link.

**▶️ Live app:** https://jonasbausch.github.io/side-quest-llc/

---

## What is SideQuest?

SideQuest is a homebrew tabletop roleplaying game about working stiffs doing
dangerous, strange jobs for an LLC that would rather you didn't ask too many
questions. Characters are built from a **training** (their job specialty), a
**path** of unlockable nodes, plus a trope, a strength, a flaw, and an
assignment of dice to stats. During play the table tracks live scene state —
**Momentum**, **Conditions**, **Wyrd**, **Exposure**, and once-per-scene
abilities — as the weirdness climbs.

It's an unfinished, actively-houseruled draft. The game is played and recorded
by **[Scyted TV](https://www.scyted.tv)**.

### Resources

| Resource                              | Link |
|---------------------------------------|---|
| 📖 **Official rules (v5)**            | https://homebrewery.naturalcrit.com/share/Zicv7vxkQ761 |
| 💬 **Discord community**              | https://discord.gg/gw527W9AB |
| 🎬 **Scyted TV (production company)** | https://www.scyted.tv |

---

## What this app does

- **Build a character** — pick a training, walk its Wyrd and Mundane paths,
  choose a trope/strength/flaw, and assign your dice.
- **Share it as a link** — the whole character definition is compressed into
  the URL, so sending someone the link sends them the character. You can also
  import/export as JSON.
- **Run a live session** — track Momentum, Conditions, Wyrd, and Exposure at the
  table. Toggling a Condition highlights exactly which dice it penalizes and
  why. "New scene" clears per-scene state and zeroes Wyrd; "New job" clears
  everything.
- **Feel the Wyrd** — as the Wyrd track rises, the background shifts and a
  decorative layer of absurd drifters gets denser, readable in peripheral
  vision without looking away from the table.
- **Print it** — there's a print stylesheet for anyone who wants paper.

The character definition lives in the URL/JSON; live session state lives in your
browser's `localStorage` and is never shared. Loading someone's share link
won't clobber your own live state.

---

## Running it locally

The app is a static Vite + React + TypeScript site. No database, no accounts, no
server to stand up — you just need Node.js.

### 1. Install Node.js (v20 or newer)

You need **Node.js 20+** (which includes `npm`). Check what you have with:

```
node -v
```

If it prints `v20.x` or higher, skip to step 2.

<details>
<summary><strong>macOS</strong></summary>

**Option A — Homebrew (recommended):**

```
# Install Homebrew first if you don't have it (https://brew.sh):
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node:
brew install node
```

**Option B — official installer:** download the LTS `.pkg` from
https://nodejs.org and run it.

</details>

<details>
<summary><strong>Windows</strong></summary>

**Option A — winget (built into Windows 10/11):**

```
winget install OpenJS.NodeJS.LTS
```

**Option B — official installer:** download the LTS `.msi` from
https://nodejs.org and run it. Accept the defaults (this also installs `npm`).

After installing, **open a new terminal** (PowerShell or Command Prompt) so the
updated `PATH` takes effect, then verify with `node -v`.

</details>

You'll also need **[Git](https://git-scm.com/downloads)** to clone the repo
(macOS: `brew install git`; Windows: `winget install Git.Git`).

### 2. Clone and install

The commands below are identical on macOS and Windows once Node and Git are
installed:

```
git clone https://github.com/jonasbausch/side-quest-llc.git
cd side-quest-llc
npm install
```

### 3. Run the dev server

```
npm run dev
```

Vite prints a local URL (default http://localhost:5173) with hot-reload. Open it
in a browser.

### Other commands

```
npm run lint       # ESLint over the repo
npm test           # run the test suite once
npm run test:watch # keep the tests running as you edit
npm run build      # typecheck (tsc -b) AND production build into dist/
npm run preview    # serve the built dist/ locally
npx tsc --noEmit   # typecheck only, no build
```

`npm run lint`, `npm test` and `npm run build` are the automated gates, and CI
runs all three on every pull request. Run them before you commit.

---

## Contributing

Most contributions are **game content** — transcribing training tables, spell
tags, tropes, and other rules text from the PDF into structured data. A few
conventions keep that reviewable and correct:

- **Content is data; code is a renderer.** Every SideQuest-specific fact lives
  in `src/content/`. Components are generic over that data — if a component
  names a specific training or spell tag, that's a bug.
- **Don't model game mechanics.** Store rules text as prose. The only structured
  fields are metadata (name, frequency, prerequisite, cost). No functions that
  resolve effects or compute rolls — the ruleset is a draft and gets houseruled
  constantly.
- **One training per commit.** Small diffs can be reviewed against the PDF; a
  thousand-line content dump can't. Quote rules text closely — copyedit typos,
  but don't paraphrase or "improve" wording.
- **Validation is advisory.** The tool warns on an illegal build, it never
  blocks one. A tool that refuses a GM's ruling gets abandoned.
- **Run `npm run build` before committing** so the typecheck passes. Content is
  additionally validated at import time by the Zod schemas in
  `src/content/schema.ts`.

Deploys are automatic: pushing to `main` triggers the GitHub Actions workflow in
`.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages.

For deeper architectural guidance — the two data lifecycles, the content model,
known gaps in the ruleset, and UI conventions — read
[`CLAUDE.md`](./CLAUDE.md). The rules themselves live in `docs/` as verbatim
copies of the GM's document (currently `rules-v5.0.md`), which drive content
updates and must not be edited.

### Project layout

```
docs/                   GM's ruleset, verbatim, read-only
src/content/schema.ts   Zod schemas and inferred types
src/content/trainings/  One file per training (ten of them)
src/content/*.ts        Spell tags, tropes, strengths, flaws, conditions, wyrd…
src/lib/                Serialization, storage, validation
src/components/         Generic renderers
```

---

## Tech stack

Vite · React · TypeScript · Zod (content validation) · lz-string (URL
compression). Deployed as a static site to GitHub Pages via GitHub Actions.