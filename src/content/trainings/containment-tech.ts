import type { Training } from '../schema';

/**
 * Containment Tech — "Bustin' makes me feel employed."
 * Transcribed verbatim from docs/rules-v5.0.md ("Containment Tech").
 * Wyrd-4 is Rule-Locking, inline.
 */
export const containmentTech = {
  id: 'containment-tech',
  name: 'Containment Tech',
  tagline: `Bustin' makes me feel employed.`,
  specialty: {
    name: `Cross the Streams`,
    text: `Once/job, contain something that "should be uncontainable." It works. Aftermath: the GM writes a new permanent rule about this phenomenon type (weakness, price, procedure, limitation).`,
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
      name: `Salt Fogger`,
      text: `Create a Containment Zone (one room or clear 20–30 ft area). Zone rule: the first failure made by anyone inside the Zone does not mark a setback. That roll still: gains Momentum. Limit: 1/scene.`,
      frequency: 'perScene',
    },
    {
      name: `Coil Pack "Buster"`,
      text: `When you add +1 or +2 Progress on a containment action, you may Latch the phenomenon. Next time it tries to shift/escape/phase, it must pay one (GM picks): Collateral: break something loud/visible → Exposure +1 if witnesses/systems can notice, Swap: trade places with an object/feature, Lose Ground: your next roll against it this scene gets +1. Limit: 1/scene.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Iron Spike Kit`,
      text: `Lock a Threshold (door/window/stairs/marked line). The phenomenon can't cross unless it does one: Bleed Pressure: reduce Wyrd by 1d4 (min 0) and the lock breaks, or Break Through: smash it physically (GM sets TN/obstacle). Limit: 2 thresholds/scene.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `The Box`,
      text: `When a containment scene would mark its final setback, you can instead end the scene with the target contained. Choose the price (pick 1): Exposure +2, Everyone involved becomes Marked, Unstable Containment: the Box becomes a downtime problem that must be handled before the next job, Collateral: something important breaks / someone gets hurt / the site becomes hostile. Limit: 1/job.`,
      frequency: 'perJob',
      cost: 2,
    },
    {
      name: `Lockdown Surge`,
      text: `When Wyrd hits 6, delay the Reality Surge until the end of the current beat. Limit: 1/job.`,
      frequency: 'perJob',
      cost: 3,
    },
  ],
  availableTagIds: ['anchor', 'omen', 'saltline', 'spark', 'step', 'wardmark'],
} satisfies Training;
