import type { Training } from '../schema';

/**
 * Runner/Driver — "Fast & the Phantasmal."
 * Transcribed verbatim from docs/rules-v5.0.md ("Runner/Driver").
 * Wyrd-4 is Residue Economy, inline.
 */
export const runnerDriver = {
  id: 'runner-driver',
  name: 'Runner/Driver',
  tagline: `Fast & the Phantasmal.`,
  specialty: {
    name: `Ecto-1 Behavior`,
    text: `Once/job, the van does something impossible and gets you out. Aftermath: the van gains a permanent quirk.`,
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
      name: `Residue Economy`,
      text: `Magic leaves usable residue, and you know how to work with it. When you cast, you may choose to leave a Residue Tag in the scene (static smear, salt bloom, mirrored scab, burnt sigil, fog of incense, etc.). Once per scene, anyone can leverage a Residue Tag for a situational advantage (track the hazard, lock a route, reveal a hidden seam, justify a prep, etc.). Cost: each Residue Tag is also a trail. The GM can use it later to justify attention (authorities, entities, rivals, "it shows up in the records").`,
    },
    {
      name: `D12 Wyrd Die`,
      text: `D12 Wyrd Die (All Spell Sizes).`,
      frequency: 'passive',
    },
  ],
  mundaneNodes: [
    {
      name: `Surge-Protected Van Rig`,
      text: `Transport volatile items without automatic Wyrd escalation from proximity.`,
      frequency: 'passive',
    },
    {
      name: `Hot-Zone Routing`,
      text: `Once/scene, ignore a spatial Wyrd shift (loop/wrong turn/impossible hall) and arrive where intended.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Mobile Containment Cell`,
      text: `Once/job, when a failure would mark a setback, redirect it into the van. The van gains a Van Problem (sparking ward, screaming trunk, shifting interior). If you don't address it before job end: Exposure +1d4 or downtime fallout (GM call).`,
      frequency: 'perJob',
      cost: 1,
    },
    {
      name: `Black Bag Extraction`,
      text: `Remove a target/object without a roll. Cost: take a Pursuit Complication immediately. Limit: 1/scene.`,
      frequency: 'perScene',
      cost: 2,
    },
    {
      name: `Siren Lure`,
      text: `Once/job, force the phenomenon to chase you instead of someone else. Works immediately.`,
      frequency: 'perJob',
      cost: 3,
    },
  ],
  availableTagIds: ['omen', 'step'],
} satisfies Training;
