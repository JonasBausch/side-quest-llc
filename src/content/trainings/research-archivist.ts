import type { Training } from '../schema';

/**
 * Research Archivist — "Hold music, then forbidden PDFs."
 * Transcribed verbatim from docs/rules-v5.0.md ("Research Archivist").
 *
 * Only one available tag (SENSE) — the non-empty minimum. Wyrd-4 is Echo
 * Recording, inline (this section includes the "Cost: Echos are sticky" line).
 */
export const researchArchivist = {
  id: 'research-archivist',
  name: 'Research Archivist',
  tagline: `Hold music, then forbidden PDFs.`,
  specialty: {
    name: `The X-File`,
    text: `Once/job: you already have a file on this phenomenon. Gain its name, rule, and price.`,
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
      name: `Case Card System`,
      text: `Once/scene, ask one factual question about the object/location's history; get a concrete lead.`,
      frequency: 'perScene',
    },
    {
      name: `Serial Run Search`,
      text: `Brains vs TN. On success: identify lineage/version + one known weakness/price. Next roll exploiting that gets +1.`,
      cost: 1,
    },
    {
      name: `Cross-Case Patterning`,
      text: `Once/job: link to a previous case; learn what carries over (weakness/trigger/name/method). Next roll exploiting that becomes Strong Success on a normal success (GM confirms applicability).`,
      frequency: 'perJob',
      cost: 1,
    },
    {
      name: `App Update Push`,
      text: `Once/job: introduce one tool/ritual/route mid-job that logically exists because your system flagged it. Counts as a Flashback with no Momentum spend.`,
      frequency: 'perJob',
      cost: 2,
    },
    {
      name: `Red Thread Board`,
      text: `Once/job, name the true villain of the episode's Wyrdness. Wrong: Wyrd +1d4. Right: Wyrd −1d4.`,
      frequency: 'perJob',
      cost: 3,
    },
  ],
  availableTagIds: ['sense'],
} satisfies Training;
