import type { Tune } from './schema';

/**
 * The six Signature Tunes. Transcribed from docs/rules-v4.0.md ("Signature
 * Spells", Tier 1). A character picks one at Wyrd-2 and applies it to their
 * signature spell tag.
 */
export const tunes = [
  {
    id: 'quiet',
    name: 'Quiet',
    text: `No obvious visuals unless you want them.`,
  },
  {
    id: 'fast',
    name: 'Fast',
    text: `Once per scene, cast your Signature as a free "minor action".`,
  },
  {
    id: 'stable',
    name: 'Stable',
    text: `On your Signature, "any die shows a 1" doesn't add Wyrd (still marks Strain) 1/scene.`,
  },
  {
    id: 'anchored',
    name: 'Anchored',
    text: `Your Signature lasts one step longer (beat→segment→scene).`,
  },
  {
    id: 'split',
    name: 'Split',
    text: `Your Signature can affect +1 target at the same scale.`,
  },
  {
    id: 'coded',
    name: 'Coded',
    text: `Your Signature looks mundane on sensors unless someone is actively scanning for it.`,
  },
] satisfies Tune[];
