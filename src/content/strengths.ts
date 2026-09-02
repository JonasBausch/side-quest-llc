import type { Trait } from './schema';

/**
 * Strengths. Transcribed from docs/rules-v5.0.md ("Strengths"). Homebrew is
 * allowed at the character level. `frequency` follows each entry's own
 * "1/scene" or "1/job" wording; passive/situational ones carry no cadence.
 */
export const strengths = [
  {
    id: 'excellent-liar',
    name: 'Excellent Liar',
    text: `When you successfully deceive, gain +1 Momentum (max 1/scene).`,
    frequency: 'perScene',
  },
  {
    id: 'fast-learner',
    name: 'Fast Learner',
    text: `After you see someone do a thing once, you can attempt it with no "you can't" penalty (GM still sets TN).`,
  },
  {
    id: 'field-medicine-training',
    name: 'Field Medicine Training',
    text: `During a stabilizing scene, also clear one extra Condition from someone (2 total, split or same person).`,
  },
  {
    id: 'good-with-animals',
    name: 'Good with Animals',
    text: `1/scene, you can calm/handle a creature/device enough to get one simple cooperation.`,
    frequency: 'perScene',
  },
  {
    id: 'high-pain-tolerance',
    name: 'High Pain Tolerance',
    text: `Once per scene, ignore one Condition penalty (−1) on a roll caused by pain/fatigue.`,
    frequency: 'perScene',
  },
  {
    id: 'improvisational-genius',
    name: 'Improvisational Genius',
    text: `1/scene, turn nearby junk into a one-use tool that makes sense; next relevant roll gets +1.`,
    frequency: 'perScene',
  },
  {
    id: 'lucky-breaks',
    name: 'Lucky Breaks',
    text: `1/job, reroll one die you just rolled (keep the new result).`,
    frequency: 'perJob',
  },
  {
    id: 'protective-instincts',
    name: 'Protective Instincts',
    text: `1/scene, take a hit for an ally: you take the Condition they would've taken.`,
    frequency: 'perScene',
  },
  {
    id: 'quick-problem-solving',
    name: 'Quick Problem-Solving',
    text: `1/scene, ask the GM one yes/no about the current obstacle ("Is this the real trigger?").`,
    frequency: 'perScene',
  },
  {
    id: 'reads-people-instantly',
    name: 'Reads People Instantly',
    text: `On first meeting someone, get one read (honest/afraid/hiding something/what they want).`,
  },
  {
    id: 'specialist-certification',
    name: 'Specialist Certification',
    text: `In your certified domain, treat one failed roll per job as a partial success (you succeed, but GM adds a complication).`,
    frequency: 'perJob',
  },
  {
    id: 'stubborn-as-hell',
    name: 'Stubborn as Hell',
    text: `When you fail a roll, gain +2 Momentum instead of +1.`,
  },
  {
    id: 'trusted-network',
    name: 'Trusted Network',
    text: `1/job, get a quick favor from a contact: a tip, a ride, a key, a name, or a location.`,
    frequency: 'perJob',
  },
  {
    id: 'unshakable-calm',
    name: 'Unshakable Calm',
    text: `When Wyrd hits 4+, you don't take Shaken from the scene's first scare/shift.`,
  },
  {
    id: 'vehicle-mastery',
    name: 'Vehicle Mastery',
    text: `In any chase/drive/pilot clock, your first success counts as +2 instead of +1.`,
  },
] satisfies Trait[];
