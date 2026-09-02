import type { Training } from '../schema';

/**
 * Artifact Handler — "White gloves. Bad decisions."
 * Transcribed verbatim from docs/rules-v5.0.md ("Artifact Handler").
 *
 * Gear-1 (Museum Gloves) is described by the unlabelled line under "Mundane
 * Path Gear Options" ("First contact with a ridden object doesn't auto-trigger
 * it.") and carries no cost tier. Wyrd-4 is Echo Recording, inline.
 */
export const artifactHandler = {
  id: 'artifact-handler',
  name: 'Artifact Handler',
  tagline: `White gloves. Bad decisions.`,
  specialty: {
    name: `The Annabelle Clause`,
    text: `Contained object can't be re-possessed by the same entity again. Cost: the entity remembers you; you're Marked until job end.`,
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
      name: `Echo Recording`,
      text: `Your magic "records" reality and can play it back. Each time you cast, you may capture one Echo: a 1–2 second sensory snippet (sound, reflection, heat-image, smell, a sentence). Later in the job, you can release an Echo to: prove something happened (to an NPC/system), bait something (trigger, lure, distraction), reconstruct a clue ("show me what the hallway looked like before it looped"). Cost: Echos are sticky. Holding more than 1 at a time makes you feel "observed" (GM can justify Marked/pressure when it fits).`,
    },
    {
      name: `D12 Wyrd Die`,
      text: `D12 Wyrd Die (All Spell Sizes).`,
      frequency: 'passive',
    },
  ],
  mundaneNodes: [
    {
      name: `Museum Gloves`,
      text: `First contact with a ridden object doesn't auto-trigger it.`,
      frequency: 'passive',
    },
    {
      name: `Finish-Safe Extraction`,
      text: `Remove an entity/object without damaging function/appearance. If it would cause Exposure, you may take Marked instead. Limit: 1/scene.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Trigger Diagnosis`,
      text: `Learn what sets an object off and what calms it down. (If contested/obscure, roll Brains vs TN; failure still gives one true fact and Marked—GM call.)`,
      cost: 1,
    },
    {
      name: `Secure Storage Protocols`,
      text: `Once/job, "store" a problem safely until downtime. Stable, not solved. If storage is sloppy or rushed: Exposure +1d4 (GM call).`,
      frequency: 'perJob',
      cost: 2,
    },
    {
      name: `Provenance Knife`,
      text: `Cut an ownership chain (symbolically). Remove one layer of claim/protection. If contested, roll Charm or Brains vs TN 12.`,
      cost: 3,
    },
  ],
  availableTagIds: ['banish', 'sense', 'step', 'unravel', 'wardmark'],
} satisfies Training;
