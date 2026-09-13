import type { CastingGuide } from './schema';

/**
 * Casting reference. Transcribed from docs/rules-v5.0.md ("Casting with
 * Scale"), which prints the steps, the TN per scale, and the escalation and
 * stress rules. Reference prose only — the tracker never resolves a cast.
 *
 * Step 3 prints the two dice with no operator between them, leaving it
 * unclear whether a cast rolls both or the Wyrd Die alone. The glossary
 * ("rolling a casting stat + Wyrd Die") and the GM both have it rolling both.
 * See https://github.com/JonasBausch/side-quest-llc/issues/6.
 */
export const castingGuide = {
  roll: `Casting Stat die + Wyrd Die, plus Skill if one is relevant.`,
  stat: `You choose the casting stat — whatever fits what you're trying to accomplish — so it changes from cast to cast.`,
  scales: [
    { name: 'Small', tn: 9, difficulty: 'Standard', escalatedTn: '14' },
    { name: 'Medium', tn: 12, difficulty: 'Hard', escalatedTn: '17' },
    { name: 'Large', tn: 15, difficulty: 'Severe', escalatedTn: '20+' },
  ],
  escalation: `If the target is actively resisting, the area is unstable, or Wyrd is 4 or more, bump the TN up one step.`,
  escalationAt: 4,
  stress: `If any die shows a 1, Wyrd +1. If the die that blows up is your Wyrd Die, Wyrd +1.`,
} satisfies CastingGuide;
