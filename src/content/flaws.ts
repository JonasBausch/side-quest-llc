import type { Trait } from './schema';

/**
 * Flaws. Transcribed from docs/rules-v5.0.md ("Flaws"). Homebrew is allowed at
 * the character level. `frequency` follows each entry's "once per scene/job"
 * wording so the tracker can offer a mark for the once-a-scene/job triggers;
 * ongoing/passive penalties carry no cadence.
 */
export const flaws = [
  {
    id: 'addiction',
    name: 'Addiction or Compulsive Vice',
    text: `Once per job, when you have downtime, you must either indulge (lose 1 Momentum) or resist (take −1 on your next roll).`,
    frequency: 'perJob',
  },
  {
    id: 'always-short-on-cash',
    name: 'Always Short on Cash',
    text: `Start each job with −1 gear pick due to it not working (or one piece of gear is "cheap/low charge" and can fail, GM pick).`,
  },
  {
    id: 'attracts-wyrd-attention',
    name: 'Attracts Wyrd Attention',
    text: `The first time you cast each job, Wyrd +1.`,
    frequency: 'perJob',
  },
  {
    id: 'believes-their-own-hype',
    name: 'Believes Their Own Hype',
    text: `If you attempt a flashy approach when a quiet one would work, take −1 (GM call).`,
  },
  {
    id: 'cant-leave-well-enough-alone',
    name: "Can't Leave Well Enough Alone",
    text: `When you succeed on an investigation/tech/ritual action, the GM may offer "push further"; if you take it, roll again at −1.`,
  },
  {
    id: 'compulsive-truth-teller',
    name: 'Compulsive Truth-Teller',
    text: `When you try to lie by default, take −1.`,
  },
  {
    id: 'guilt-complex',
    name: 'Guilt Complex',
    text: `When an ally takes a Condition, you also become Distracted until a stabilizing scene.`,
  },
  {
    id: 'has-a-nemesis',
    name: 'Has a Nemesis',
    text: `Once per job, the GM may introduce a nemesis complication; take −1 on your next roll against it.`,
    frequency: 'perJob',
  },
  {
    id: 'haunted-by-past-failure',
    name: 'Haunted by Past Failure',
    text: `The first time per job you face a similar situation, take −1 on that roll.`,
    frequency: 'perJob',
  },
  {
    id: 'insomniac',
    name: 'Insomniac',
    text: `The first check you do each day, the dice is replaced by a d4.`,
  },
  {
    id: 'needs-control',
    name: 'Needs Control',
    text: `When the GM introduces a surprise change, your next roll takes −1.`,
  },
  {
    id: 'not-a-people-person',
    name: 'Not a People Person',
    text: `On your first social roll with a new NPC, take −1.`,
  },
  {
    id: 'overconfident',
    name: 'Overconfident',
    text: `Once per scene, if you roll your "best" stat, a failure counts as 2 failures on the clock.`,
    frequency: 'perScene',
  },
  {
    id: 'prone-to-escalation',
    name: 'Prone to Escalation',
    text: `The first time per scene you choose violence/force/intimidation as your approach, Wyrd +1.`,
    frequency: 'perScene',
  },
  {
    id: 'secretly-superstitious',
    name: 'Secretly Superstitious',
    text: `If you ignore a bad omen/sign you noticed, take −1 on the next roll tied to it.`,
  },
  {
    id: 'tends-to-go-loud',
    name: 'Tends to Go Loud',
    text: `On your first combat/force action each scene, mark Exposure +1 (or GM adds a noise/witness complication).`,
    frequency: 'perScene',
  },
  {
    id: 'trust-issues',
    name: 'Trust Issues',
    text: `You can't receive Handoff Momentum unless you can see/hear the giver directly (no comms).`,
  },
  {
    id: 'unresolved-grudge',
    name: 'Unresolved Grudge',
    text: `When dealing with the grudge target or their associates, take −1 on Charm rolls.`,
  },
] satisfies Trait[];
