import type { Training } from '../schema';

/**
 * Field Tinkerer — "Hold on, I can fix that."
 * Transcribed verbatim from docs/rules-v4.0.md ("Field Tinkerer").
 *
 * Wyrd nodes carry the shared boilerplate: Wyrd-1/3/5 are die upgrades and
 * Wyrd-2 is the signature choice (the Tune is stored on the character, not
 * here). Wyrd-4 is this training's Interface ability, kept as inline prose.
 * Mundane gear costs are the parenthetical tier from the rules ("—" = absent).
 */
export const fieldTinkerer = {
  id: 'field-tinkerer',
  name: 'Field Tinkerer',
  tagline: `Hold on, I can fix that.`,
  specialty: {
    name: `Chekhov's Toolkit`,
    text: `Once/job: reveal you already built the exact adapter/tool. It works perfectly.`,
    frequency: 'perJob',
  },
  wyrdNodes: [
    {
      name: `D4 Wyrd Die`,
      text: `D4 Wyrd Die (Small Spells).`,
      frequency: 'passive',
    },
    {
      name: `Signature Spell Tag`,
      text: `Pick a signature spell tag. Pick one of your spell tags as your Signature, then choose one Tune for it (Quiet, Fast, Stable, Anchored, Split, Coded).`,
      frequency: 'passive',
    },
    {
      name: `D8 Wyrd Die`,
      text: `D8 Wyrd Die (Small and Medium Spells).`,
      frequency: 'passive',
    },
    {
      name: `Rule-Locking`,
      text: `Your spells can temporarily set a local rule the world follows. When you cast, you may add one Rule Clause to the effect (pick one): "No crossing," "No lies," "No names spoken," "No violence," "No cameras," "No reflections," "No open flames," etc. The clause applies only within the spell's affected space and duration. Cost: Rule Clauses always have a loophole. The GM states it when it matters (not immediately), and entities will find it.`,
    },
    {
      name: `D12 Wyrd Die`,
      text: `D12 Wyrd Die (All Spell Sizes).`,
      frequency: 'passive',
    },
  ],
  mundaneNodes: [
    {
      name: `Jury-Rig Bag`,
      text: `Once/scene, make a broken thing work for one beat. On a failure, it works but you pick the blowback: Wyrd +1 or Exposure +1.`,
      frequency: 'perScene',
    },
    {
      name: `Spare Couplers`,
      text: `Once/scene when a Scale slot is spent, spend a smaller slot instead (M→S, L→M). Cost: choose Wyrd +1 or Exposure +1 (your fix leaves a mark or draws eyes).`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Remote Trigger`,
      text: `Once/scene, activate a device at range (lights, sprinklers, doors, alarms, elevator logic).`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Overclock`,
      text: `Once/job, convert a normal Success into a Strong Success. Cost: Wyrd +1d4 immediately.`,
      frequency: 'perJob',
      cost: 2,
    },
    {
      name: `Safe Discharge`,
      text: `End of scene: remove one lingering hazard without a roll. Cost: you become Strained. Limit: 1/scene.`,
      frequency: 'perScene',
      cost: 3,
    },
  ],
  availableTagIds: ['anchor', 'omen', 'spark', 'step', 'unravel'],
} satisfies Training;
