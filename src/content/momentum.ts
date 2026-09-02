import type { MomentumGuide } from './schema';

/**
 * Momentum reference. Transcribed from docs/rules-v5.0.md ("Momentum" +
 * "Handoff"). Reference prose only — the tracker counts Momentum but never
 * resolves a spend.
 */
export const momentumGuide = {
  cap: 10,
  gain: `Fail a roll → +1. Fail by 5 or more → +2.`,
  handoff: `Handoff: transfer 1 Momentum to an ally you can see/hear (or via comms), at a 2:1 cost.`,
  spends: [
    {
      name: 'Push',
      cost: 1,
      text: `Add +1 to a roll.`,
    },
    {
      name: 'Flashback',
      cost: 2,
      text: `Declare a reasonable prep you already did (packed gear, called a contact, pulled a map).`,
    },
    {
      name: 'Stunt',
      cost: 3,
      text: `Cinematic repositioning or environmental interaction that changes the situation.`,
    },
    {
      name: 'Teamwork Makes the Dream Work',
      cost: 3,
      text: `Give an ally half the value of one of your stat dice.`,
      note: '1/job',
    },
  ],
} satisfies MomentumGuide;
