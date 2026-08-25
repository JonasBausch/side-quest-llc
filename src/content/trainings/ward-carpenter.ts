import type { Training } from '../schema';

/**
 * Ward Carpenter — "Home imp-rovement."
 * Transcribed verbatim from docs/rules-v4.0.md ("Ward Carpenter").
 * Wyrd-4 is Rule-Locking, inline.
 */
export const wardCarpenter = {
  id: 'ward-carpenter',
  name: 'Ward Carpenter',
  tagline: `Home imp-rovement.`,
  specialty: {
    name: `No Solicitors`,
    text: `Choose one location (van/HQ/site). It has a permanent ward rule. Attempts to break it fail and reveal themselves; it does not add Exposure.`,
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
      name: `Chalk & Salt Geometry`,
      text: `Establish a Safe Zone (room or 20–30 ft area). Inside it, PCs can't gain new Conditions unless Wyrd ≥ 4. Limit: 1/scene.`,
      frequency: 'perScene',
    },
    {
      name: `Copper/Cold Iron Plates`,
      text: `Reinforce a doorway/window/object. The first possession attempt fails and leaves a visible mark. Limit: 2/scene.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Retrofit Kit`,
      text: `Create a one-job Threshold Rule (no crossing/no lies/no names/no violence/etc.). Roll Brains or Brawn vs TN. Success: rule holds. Failure: rule holds, Wyrd +1d4. Limit: 1/scene.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Patch Job`,
      text: `When something breaks in-scene (ward line, seal, door), fix it fast. On a success, treat it as a Strong Success for progress. Limit: 1/scene.`,
      frequency: 'perScene',
      cost: 2,
    },
    {
      name: `Quiet Room`,
      text: `Once/job, create a pocket where Wyrd cannot rise for one scene.`,
      frequency: 'perJob',
      cost: 3,
    },
  ],
  availableTagIds: ['banish', 'saltline', 'unravel', 'wardmark'],
} satisfies Training;
