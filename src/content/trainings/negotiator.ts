import type { Training } from '../schema';

/**
 * Negotiator — "Talk it down. Pay the toll."
 * Transcribed verbatim from docs/rules-v5.0.md ("Negotiator").
 *
 * Structurally the unusual one, and it exercises the schema's edges:
 * - only two available tags (BANISH, GLAMOUR) — the non-empty minimum;
 * - Oath Tape Recorder uses `counter` frequency ("1 active oath"), the one
 *   cadence that isn't per-scene/per-job/passive;
 * - Offer Kit is a passive with no cost tier ("—");
 * - a gear node whose name carries a slash ("Last Rites / Binding Oath").
 * Wyrd-4 is this training's Interface ability (Thin-Place Etiquette), kept as
 * inline prose; it states its own "once per scene" cadence.
 */
export const negotiator = {
  id: 'negotiator',
  name: 'Negotiator',
  tagline: `Talk it down. Pay the toll.`,
  specialty: {
    name: `The Winchester Rule`,
    text: `Once/job: "we have an understanding." It holds through the job. Aftermath becomes a future obligation.`,
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
      name: `Thin-Place Etiquette`,
      text: `Your magic is a negotiation with the location. Once per scene, before a cast, ask: "What does this place demand?" The GM gives a concrete demand (silence, salt line, offering, name spoken, light off, door closed, a promise, a memory, etc.). If you pay it, your cast gains a reality privilege: it sticks (harder to undo), or it can't be ignored, or it can't be disguised. Cost: the demand is real; it changes the fiction and can create obligations.`,
      frequency: 'perScene',
    },
    {
      name: `D12 Wyrd Die`,
      text: `D12 Wyrd Die (All Spell Sizes).`,
      frequency: 'passive',
    },
  ],
  mundaneNodes: [
    {
      name: `Offer Kit`,
      text: `You always have the right offering (salt, milk, coin, incense, battery, story, etc.). Presenting it creates a conversation opening.`,
      frequency: 'passive',
    },
    {
      name: `Etiquette Cards`,
      text: `Once/scene when you fail a Charm roll in negotiation: name the rule you followed. Your failure becomes a partial success, and you choose the sting: Exposure +1d4 or you become Marked or +1d4 to Wyrd.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Soft Bargain`,
      text: `Take Marked to gain one concrete concession: safe passage, info, one-minute pause, release from immediate harm. Limit: 1/scene.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Oath Tape Recorder`,
      text: `Record a promise with terms. If it's broken: you gain +2 Momentum, and your next roll against that target counts as Strong Success (if relevant). Limit: 1 active oath.`,
      frequency: 'counter',
      cost: 2,
    },
    {
      name: `Last Rites / Binding Oath`,
      text: `End a negotiation scene immediately; treat the objective as completed. Pay one: Exposure +1, Marked, owe a favor, or lose something small/personal. Limit: 1/job.`,
      frequency: 'perJob',
      cost: 3,
    },
  ],
  availableTagIds: ['banish', 'glamour'],
} satisfies Training;
