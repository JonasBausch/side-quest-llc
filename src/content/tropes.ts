import type { Trait } from './schema';

/**
 * Tropes. Transcribed from docs/rules-v5.0.md ("Tropes"). These are suggestions
 * — the rules explicitly allow homebrew, handled at the character level. The
 * `frequency` tag is derived from each trope's own "once per scene/job" wording;
 * where none is stated it is left passive.
 */
export const tropes = [
  {
    id: 'by-the-book',
    name: 'By-the-Book',
    text: `Once per job, you can produce the right form/permit/phrase to reduce Exposure clock by 1 (or cancel one complication).`,
    frequency: 'perJob',
  },
  {
    id: 'conspiracy-nut',
    name: 'Conspiracy Nut',
    text: `Once per scene, when you make a wild theory, roll Brains; on a success you get one true clue (even if your theory is wrong).`,
    frequency: 'perScene',
  },
  {
    id: 'cynical-field-agent',
    name: 'Cynical Field Agent',
    text: `Once per scene, when you call out the obvious downside, you may ask for the real cost of a plan; the GM must name one concrete consequence to watch for.`,
    frequency: 'perScene',
  },
  {
    id: 'down-on-their-luck',
    name: 'Down-on-their-Luck',
    text: `When you fail an investigation/social read, gain +2 Momentum instead of +1.`,
  },
  {
    id: 'ex-specialist',
    name: 'Ex-Specialist',
    text: `Once per job, you can downgrade a TN by 1 step for a roll you've "done a hundred times".`,
    frequency: 'perJob',
  },
  {
    id: 'glitchy-gadgeteer',
    name: 'Glitchy Gadgeteer',
    text: `Once per job, you can jury-rig a device to create a one-off effect.`,
    frequency: 'perJob',
  },
  {
    id: 'jaded-survivor',
    name: 'Jaded Survivor',
    text: `Once per scene, when Wyrd increases, you may ignore becoming Shaken from that moment.`,
    frequency: 'perScene',
  },
  {
    id: 'just-doing-my-job',
    name: '"Just Doing My Job"',
    text: `Once per scene, ignore one Condition penalty (−1) on a roll if you describe the calm, procedural routine you fall into.`,
    frequency: 'perScene',
  },
  {
    id: 'normal-one',
    name: 'The "Normal" One (no one believes you)',
    text: `Once per job, you can make a mundane explanation stick; erase 1 point of Exposure (witnesses reinterpret what they saw).`,
    frequency: 'perJob',
  },
  {
    id: 'occult-freelancer',
    name: 'Occult Freelancer',
    text: `You start each job with one extra contact "on retainer" (one call/text for a useful fact, tool, or introduction).`,
    frequency: 'perJob',
  },
  {
    id: 'reluctant-hero',
    name: 'Reluctant Hero, Reluctant Believer',
    text: `The first time per scene you step in to protect someone, gain +1 Momentum immediately.`,
    frequency: 'perScene',
  },
  {
    id: 'true-believer',
    name: 'True Believer in the Thin Places',
    text: `Once per job, when you cast in a thin place, you may treat Wyrd as 1 lower for determining escalation/TN bump (doesn't reduce the track—just your threshold).`,
    frequency: 'perJob',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    text: `Once per job, declare a classified detail you "already know" about a site/entity; take +1 on the next roll that uses it.`,
    frequency: 'perJob',
  },
  {
    id: 'wannabe-influencer',
    name: 'Wannabe Influencer of the Supernatural',
    text: `Once per job, you can manufacture a distraction that buys a beat: take +1 on the next Charm/Flight roll to redirect a crowd or attention.`,
    frequency: 'perJob',
  },
  {
    id: 'wyrdness-magnet',
    name: '"Wyrdness Magnet"',
    text: `Once per scene, you can ask the GM: "What's the Wyrdest thing here?" and get a straight, actionable answer.`,
    frequency: 'perScene',
  },
] satisfies Trait[];
