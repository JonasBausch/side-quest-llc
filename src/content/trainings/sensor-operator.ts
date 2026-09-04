import type { Training } from '../schema';

/**
 * Sensor Operator — "We have it on Polaroid."
 * Transcribed verbatim from docs/rules-v5.0.md ("Sensor Operator").
 *
 * v5.0's leveling table put the costed EM/Sigil Sweep at Gear-1 and the free
 * Thermal Polaroids at Gear-2, the only training where the "—" gear was not
 * first. The GM confirms that was a slip: the two are swapped, which also makes
 * the table agree with the Mundane Path Options prose, where Thermal Polaroids
 * was always printed first.
 *
 * Also: this section's Echo Recording (Wyrd-4) omits the "Cost: Echos are
 * sticky" line that Artifact Handler and Research Archivist include. Transcribed
 * as printed — the omission is preserved.
 */
export const sensorOperator = {
  id: 'sensor-operator',
  name: 'Sensor Operator',
  tagline: `We have it on Polaroid.`,
  specialty: {
    name: `Enhance… Enhance…`,
    text: `Once/job, freeze a moment and ask three SENSE reads about the same subject.`,
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
      text: `Your magic "records" reality and can play it back. Each time you cast, you may capture one Echo: a 1–2 second sensory snippet (sound, reflection, heat-image, smell, a sentence). Later in the job, you can release an Echo to: prove something happened (to an NPC/system), bait something (trigger, lure, distraction), reconstruct a clue ("show me what the hallway looked like before it looped").`,
    },
    {
      name: `D12 Wyrd Die`,
      text: `D12 Wyrd Die (All Spell Sizes).`,
      frequency: 'passive',
    },
  ],
  mundaneNodes: [
    {
      name: `Thermal Polaroids`,
      text: `Once/scene, ask one SENSE question with gear. Answer arrives as an image artifact.`,
      frequency: 'perScene',
    },
    {
      name: `EM/Sigil Sweep`,
      text: `On entering a scene, name what you're scanning for (ridden object / thin place / trigger / anchor). Learn where it is OR what it is not (GM answers concretely). Limit: 1/scene.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Ring-Light Projector`,
      text: `Reveal hidden writing/doors/sigils. If trapped, you learn the trigger condition before it trips. Limit: 1/scene "save."`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Pattern Library`,
      text: `Once/scene after any roll, invoke a prior clue: gain +1 on the next related roll, or treat your next success as a Strong Success (if it directly follows from the clue).`,
      frequency: 'perScene',
      cost: 2,
    },
    {
      name: `Signal Stitcher`,
      text: `Once/job, prove a reading is a false-positive (loop/mimic/reflection). Wyrd −1. On a bad call: Wyrd +1 and you become Distracted (GM call).`,
      frequency: 'perJob',
      cost: 3,
    },
  ],
  availableTagIds: ['bindname', 'sense', 'step', 'wardmark'],
} satisfies Training;
