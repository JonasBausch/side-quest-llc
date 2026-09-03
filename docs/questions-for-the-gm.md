# SideQuest — Open Rules Questions

**For:** the GM and the rules team
**About:** rules v5.0
**Date:** 3 September 2026

---

## How to use this document

While building the character sheet app, we ran into **17 places where the rulebook
either doesn't say something, says two different things in two places, or looks like
a typo**. We haven't guessed at any of them — we'd rather ask.

**Q1 is already answered** (Scale slots have since been removed from the game), so
there are **16 open**. It's kept below with its answer so the numbering stays put.

Each question below is laid out the same way:

- **What the rulebook says** — quoted, so you don't have to go looking
- **Why we're stuck** — the specific problem in one or two sentences
- **What the app does right now** — our temporary placeholder, so nothing is broken
- **The question** — the bit we need you to answer
- **Your answer** — leave a comment, or type straight onto the line

You don't need to answer them in order, and you don't need to answer all of them
at once. Anything you leave blank just stays as it is today.

**A note on the "temporary placeholder" lines:** wherever the rules were unclear,
we picked the safest reading and moved on. None of these placeholders are decisions —
they're holding patterns. Overrule any of them freely.

---

## The questions at a glance

| # | Question | Part |
|---|---|---|
| ~~Q1~~ | ~~What is a Scale slot, and how many do you get?~~ — **answered** | — |
| Q2 | What exactly do you roll to cast a spell? | Big gaps |
| Q3 | What does a brand-new character start with? | Big gaps |
| Q4 | Are Wyrd Tiers and Spellcraft still in the game? | Big gaps |
| Q5 | Do two Conditions on the same stat add up? | Big gaps |
| Q6 | Is Exposure a 0–3 clock or a running total? | Counters |
| Q7 | Which spell tags can be your Signature if you cross-train? | Counters |
| Q8 | When do oaths and echoes reset? | Counters |
| Q9 | What exactly does "new scene" wipe? | Counters |
| Q10 | Unshakable Calm — once per scene, or always on? | How often |
| Q11 | Always Short on Cash — a use, or a standing penalty? | How often |
| Q12 | Insomniac says "each day" — how does that work in play? | How often |
| Q13 | Trace Kit and Forensics Kit — one thing or two? | Possible typos |
| Q14 | Sensor Operator's gear is in an unusual order — on purpose? | Possible typos |
| Q15 | The Neutralizer's "choose one" only has one option | Possible typos |
| Q16 | Echo Recording is missing its cost line in one training | Possible typos |
| Q17 | Museum Gloves is only one line — is that all of it? | Possible typos |

---
---

# Part 1 — The big gaps

*Five things the rulebook refers to but never fully explains. These are the ones
that matter most, because they affect every character and every session.*

---

## Q1. What is a Scale slot, and how many do you get? — ANSWERED

**No need to answer this one.** Scale slots have been removed from the game, so the
question no longer applies. Leaving it here so the other numbers don't shift.

For the record, the update took out the Scale Slot glossary entry, dropped the mention
of spending one from the description of casting, and replaced the Field Tinkerer's
Spare Couplers (the only thing that used them) with "Um, Actually".

Worth saying clearly, since the two sound alike: **scale itself is untouched.** Small,
Medium and Large spells, picking a scale when you cast, and the target numbers that go
with each are all exactly as they were. Only the spendable *slot* is gone.

---

## Q2. What exactly do you roll to cast a spell?

**What the rulebook says**

The casting steps say:

> "3. **Roll:** Casting Stat **Magic Die** (+Skill if relevant)"

The glossary says casting is *"rolling a casting stat + Magic Die."*

Elsewhere the Wyrd Die is described as the die you roll for magic.

**Why we're stuck**

The casting step is missing the symbol between "Casting Stat" and "Magic Die" — so we
can't tell if it's **stat die + magic die together**, or **the magic die on its own**.
The glossary suggests both dice, but it's the only place that's explicit, and glossaries
have been out of date elsewhere.

There's a second, smaller puzzle: the glossary defines the Casting Stat as
*"whatever fits the action: Brains, Grit, etc."* — so it's the player's pick each time,
rather than a fixed stat. We just want to confirm that's intended and not a placeholder.

**What the app does right now**

The app doesn't roll dice or work out results at all — that stays at the table. So
nothing is currently wrong. But we can't show players a helpful "here's what you roll"
reminder until we know the answer.

**The question**

1. When you cast, do you roll **your casting stat's die AND the magic die**, or **the
   magic die alone**?
2. Is "whatever stat fits" really the rule, or should each spell tag have a set stat?

**Your answer:**

>

---

## Q3. What does a brand-new character start with?

**What the rulebook says**

The character creation section says:

> "Whichever path you choose, you get Keystone training for your **Training**."

But the glossary says a Keystone is:

> "A permanent benefit unlocked by completing all five gear modules in a Training."

**Why we're stuck**

These two say opposite things. One says you get your Keystone at the *start*, the other
says it's the *reward* for finishing an entire five-step path. That's a big difference:
a Keystone is a strong once-a-job ability (the Field Tinkerer's, for example, lets you
reveal you built exactly the right tool earlier and it works perfectly).

It's possible "Keystone training" in the creation line means something different from
"a Keystone" — a starting bit of grounding rather than the end-of-path reward. We
genuinely can't tell.

**What the app does right now**

New characters start with **nothing ticked** — no gear steps, no Wyrd steps, no Keystone.
Players tick things on as they earn them.

**The question**

1. Does a brand-new character start with any gear or Wyrd step already unlocked?
2. Do they start with their Keystone, or is the Keystone only earned by finishing all
   five gear steps?

**Your answer:**

>

---

## Q4. Are Wyrd Tiers and Spellcraft still in the game?

**What the rulebook says**

The glossary describes a whole progression track we can't find anywhere else:

> "**Wyrd Tier (0–3):** A progression track for Wyrd Upgrades: Tier 1 Tune, Tier 2
> Interface, Tier 3 Spellcraft."

> "**Spellcraft (Tier 3):** Wyrd Tier 3 upgrade that lets you author Custom Spells."

> "**Custom Spell:** A spell authored at Spellcraft (Tier 3). Defined by five lines:
> name + tag(s), effect, S/M/L, range, drawback."

**Why we're stuck**

The training tables don't have any of this. Every training shows five Wyrd steps
(Wyrd-1 through Wyrd-5), and **none of them is a Spellcraft step**. So either the
glossary is describing a system that got cut, or the training tables are missing a
chunk of content.

This one has the biggest knock-on effect: if Spellcraft is real, players can invent
their own spells, and that's a whole feature we'd need to build.

**What the app does right now**

Only the five Wyrd steps printed in the training tables. No tiers, and no way to write
custom spells.

**The question**

1. Is the Tier 0–3 track (Tune → Interface → Spellcraft) still part of the game, or is
   it leftover text from an older draft?
2. Can players author custom spells? If yes, we'll need a bit more detail before we
   build anything.

**Your answer:**

>

---

## Q5. Do two Conditions on the same stat add up?

**What the rulebook says**

Nothing, as far as we can find. Individual Conditions say which stat they penalise, but
the rules never cover what happens when a character picks up two that hit the same stat.

**Why we're stuck**

If someone is both Shaken and Winded and both hit the same stat, do they take −2, or
just −1 (the worse one applies, and the second is flavour)? It comes up more than you'd
expect once Wyrd starts climbing.

**What the app does right now**

The app shows them **added together** — for example "−2 (Shaken, Winded)". It never
applies that number to anything; it's a reminder for the player, and the table can
ignore it. But if they don't actually stack, that reminder is misleading.

**The question**

Do two Conditions on the same stat stack (−1 and −1 = −2), or does only the worst one
count?

**Your answer:**

>

---
---

# Part 2 — Counters and limits

*Four questions about the numbers that get tracked during play, and when they reset.
These are lower-stakes than Part 1, but getting them wrong means the app wipes
something at the wrong moment mid-session.*

---

## Q6. Is Exposure a 0–3 clock or a running total?

**What the rulebook says**

> "**At 3 failures:** the scene continues, but a consequence hits (authorities arrive,
> footage spreads, site gets restricted, new complication clock)."

And the glossary: *"Exposure Clock: A clock tracking public visibility/response
(e.g., '4 successes before 3 failures')."*

Momentum is clearly defined, and we're just double-checking it:

> "You may have a maximum of **10 Momentum** at one time."

**Why we're stuck**

"At 3 failures a consequence hits" could mean two quite different things:

- **A clock:** Exposure fills 0 → 1 → 2 → 3, the consequence lands, and it **resets to
  zero**. You can then fill it again.
- **A running total:** Exposure just keeps climbing all job — 4, 5, 6 — and 3 was
  simply the first threshold where something bad happens.

The app has to pick one, because it decides whether the counter has a ceiling.

**What the app does right now**

- **Momentum:** capped at 10, matching the rules.
- **Exposure:** can't go below zero, and has **no upper limit** — it just keeps counting
  up, with a note reminding you a consequence hits at 3.

**The question**

1. Is 10 still the Momentum cap? (We think yes — just confirming nothing changed.)
2. Is Exposure a 0–3 clock that resets when it fills, or an open-ended tally?

**Your answer:**

>

---

## Q7. Which spell tags can be your Signature if you cross-train?

**What the rulebook says**

At Wyrd-2, every training says:

> "**Wyrd-2:** Pick a signature spell tag"

and later: *"Pick **one** of your spell tags as your **Signature**."*

**Why we're stuck**

Each training comes with its own list of available spell tags. If a character has taken
Wyrd steps in a **second** training as well, they now have access to two lists — and the
rules don't say whether their Signature has to come from their **main** training, or can
come from either.

**What the app does right now**

The more generous reading: you can pick a Signature from **any training you've taken a
Wyrd step in**, not just your main one.

**The question**

Can a cross-trained character pick their Signature from either training's spell tags, or
must it come from their main training only?

**Your answer:**

>

---

## Q8. When do oaths and echoes reset?

**What the rulebook says**

Some abilities are ongoing counts rather than once-a-scene uses. For example the **Oath
Tape Recorder** has *"Limit: 1 active oath"*, and **Echo Recording** lets you hold a
limited number of captured echoes.

**Why we're stuck**

These aren't things you "use up" in a scene — they're things you're **holding onto**.
The rules say how many you can have at once, but never say when you let go of them. If a
sworn oath is still live at the start of the next job, that's very different from it
expiring at the end of the current one.

**What the app does right now**

Treated as **job-length**. They show up under "per job" and clear when you start a new
job — not when you start a new scene.

**The question**

Do active oaths and held echoes:

- carry over from one job to the next,
- clear when the job ends, or
- clear at the end of each scene?

**Your answer:**

>

---

## Q9. What exactly does "new scene" wipe?

**What the rulebook says**

Nothing directly — this comes from how the table has been playing. There are two reset
moments: **new scene** and **new job**.

**Why we're stuck**

We know a new scene clears once-per-scene abilities and resets Wyrd to zero. What we
don't know is what a new scene **keeps**. Conditions and Momentum are the two we're
unsure about, and they're the two that hurt most if we clear them by accident mid-session.

**What the app does right now**

- **New scene:** clears once-per-scene uses, sets Wyrd to 0.
  **Keeps** Conditions, Momentum, Exposure, and once-per-job uses.
- **New job:** clears everything — Momentum, Wyrd, Exposure, Conditions, all uses.

**The question**

When you start a new scene:

1. Do Conditions carry over, or are they cleared?
2. Does Momentum carry over, or is it cleared?

**Your answer:**

>

---
---

# Part 3 — How often can you use it?

*Three specific abilities whose wording doesn't quite match any of the categories the
rules use elsewhere. The app sorts abilities into "once per scene", "once per job",
"always on", and "ongoing count" — these three don't fit cleanly.*

---

## Q10. Unshakable Calm — once per scene, or always on?

**What the rulebook says**

> **Unshakable Calm (Strength):** "When Wyrd hits 4+, you don't take Shaken from the
> **scene's first** scare/shift."

**Why we're stuck**

This is bounded to once a scene, so in one sense it's a once-per-scene ability. But it's
also **automatic** — you don't decide to use it, it just happens. There's nothing to
actively spend.

Compare the trope **Jaded Survivor**: *"Once per scene, when Wyrd increases, you **may**
ignore becoming Shaken."* Almost the same protection — but that one says "may", so the
player chooses. We treat Jaded Survivor as a once-per-scene ability with a tick-box.

**What the app does right now**

Unshakable Calm has no tick-box; it's listed as an always-on trait.

**The question**

Should Unshakable Calm get a once-per-scene tick-box (so the player can see "the first
scare this scene has already happened — the protection is used up"), or stay as an
always-on trait with no tracking?

*Our suggestion: give it the tick-box. Even though it fires automatically, knowing
whether it's already been used this scene is genuinely useful at the table.*

**Your answer:**

>

---

## Q11. Always Short on Cash — a use, or a standing penalty?

**What the rulebook says**

> **Always Short on Cash (Flaw):** "Start each job with −1 gear pick due to it not
> working (or one piece of gear is 'cheap/low charge' and can fail, GM pick)."

**Why we're stuck**

It says "each job", which sounds like a once-per-job thing. But it isn't something you
*do* at a moment in play — it's a condition applied when you pack your kit, and it lasts
the whole job. There's no point during the session where you'd tick it off.

For contrast, the flaw **Occult Freelancer** also says "start each job with…" but gives
you something you actively use (one call or text), so that one does get a tick-box.

**What the app does right now**

No tick-box. It's shown as a standing note on the character's kit.

**The question**

Should Always Short on Cash show up as a once-per-job item players tick off, or stay as
a standing note?

*Our suggestion: leave it as a standing note. There's nothing to spend, and a tick-box
on a permanent condition would just be confusing.*

**Your answer:**

>

---

## Q12. Insomniac says "each day" — how does that work in play?

**What the rulebook says**

> **Insomniac (Flaw):** "The first check you do **each day**, the dice is replaced by a d4."

**Why we're stuck**

"Each day" is a cadence that appears nowhere else in the rules. Everything else is per
scene, per job, or always on. And we can't just quietly treat it as per job, because a
single job could easily run over two or three in-fiction days — which would mean the
penalty fires once when it should have fired three times.

**What the app does right now**

No tracking. It's shown as a standing note, and the table handles it in the fiction.

**The question**

1. In practice, does "each day" usually just mean once per job at your table?
2. Or do jobs regularly span multiple days, in which case this needs its own kind of
   tracking?

If it's the second, this may be worth a line in the rulebook itself — right now "per day"
is the only cadence of its kind.

*Our suggestion: leave it untracked for now and flag it as a known gap.*

**Your answer:**

>

---
---

# Part 4 — Possible typos in the rulebook

*Five spots where the rules v5.0 text looks like it might have a slip in it. We've
copied everything exactly as printed and changed nothing — but each of these would be
worth a glance at the original document.*

---

## Q13. Trace Kit and Forensics Kit — one thing or two?

**Where:** Cleanup Specialist, second gear step

**What the rulebook says**

The training table lists the second gear step as **Trace Kit**. But the description
underneath, for what looks like the same entry, is headed **Forensics Kit**.

**Why we're stuck**

Either it's one thing that got two names, or they're two separate pieces of gear and one
of them is missing its description. If it's the latter, Cleanup Specialist is short a
gear step.

**What the app does right now**

Shown as one item, using the name **Trace Kit** from the table with the Forensics Kit
description underneath.

**The question**

One gear step or two? And if it's one, which name is the right one?

**Your answer:**

>

---

## Q14. Sensor Operator's gear is in an unusual order — on purpose?

**Where:** Sensor Operator, first and second gear steps

**What the rulebook says**

- Gear-1: **EM/Sigil Sweep** (cost: 1)
- Gear-2: **Thermal Polaroids** (cost: —)

**Why we're stuck**

In every other training, the free item — the one marked "(—)" — is the **first** gear
step. Sensor Operator is the only training where the free item sits in second place and
a costed item comes first. That pattern break makes us think the two might have been
swapped by accident.

**What the app does right now**

Exactly as printed — EM/Sigil Sweep first, Thermal Polaroids second.

**The question**

Is Sensor Operator's order intentional, or should Thermal Polaroids be the first gear
step like the free item is in every other training?

**Your answer:**

>

---

## Q15. The Neutralizer's "choose one" only has one option

**Where:** Cleanup Specialist, Neutralizer

**What the rulebook says**

> "On a success, choose one: Wyrd −1d4 (if the hazard is Wyrd-driven)"

**Why we're stuck**

It says "choose one" and then gives exactly one option — and that option has a condition
attached ("if the hazard is Wyrd-driven"), so if the hazard *isn't* Wyrd-driven, there's
nothing to choose at all. It reads like the sentence got cut off.

**What the app does right now**

Printed exactly as it appears, single option and all. We haven't invented anything to
fill the gap.

**The question**

What are the other options in that list?

**Your answer:**

>

---

## Q16. Echo Recording is missing its cost line in one training

**Where:** Sensor Operator, Echo Recording

**What the rulebook says**

Artifact Handler and Research Archivist both end their Echo Recording entry with a line
beginning *"Cost: Echos are sticky…"*. Sensor Operator's version of the same ability
doesn't have that line.

**Why we're stuck**

Could be deliberate — maybe Sensor Operators are better at this and don't pay the cost.
Or the line just got dropped when the third copy was written.

**What the app does right now**

Exactly as printed — Sensor Operator's version has no cost line.

**The question**

Should Sensor Operator's Echo Recording carry the same "Echos are sticky" cost as the
other two trainings, or is it genuinely a cheaper version for them?

**Your answer:**

>

---

## Q17. Museum Gloves is only one line — is that all of it?

**Where:** Artifact Handler, first gear step

**What the rulebook says**

The entire description is:

> "First contact with a ridden object doesn't auto-trigger it."

**Why we're stuck**

That's unusually short. Most gear steps have some combination of how often you can use
them, what they cost, or a limit. This one has none of that — just the single sentence,
with no label in front of it. It might well be complete (some first gear steps are one-liners),
but it's worth a look in case a line was dropped.

**What the app does right now**

Exactly as printed — the one line, nothing else.

**The question**

Is that the whole entry, or is there a missing "once per scene" / cost / limit line?

**Your answer:**

>

---
---

## That's everything

Sixteen open questions. Comment on whichever ones you have views on — partial answers
are genuinely useful, and anything you skip just stays as it is.

If any of these turn out to be things the rulebook should say out loud, that's a good
outcome too: several of them (Q3 starting Keystone, Q5 stacking Conditions, Q12 "each
day") are gaps a new player would hit on their own.

Thank you.
