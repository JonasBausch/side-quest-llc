import type { Training } from '../schema';

/**
 * Crowd Liason — "Please stop filming."
 * Transcribed verbatim from docs/rules-v5.0.md ("Crowd Liason").
 *
 * Spelling conflict, flagged: the Training Options list and this section header
 * both spell it "Crowd Liason"; the glossary spells it "Crowd Liaison". The
 * training text wins over the glossary, so the name/id follow "Liason".
 * Wyrd-4 is Thin-Place Etiquette, inline (states its own once-per-scene).
 */
export const crowdLiason = {
  id: 'crowd-liason',
  name: 'Crowd Liason',
  tagline: `Please stop filming.`,
  specialty: {
    name: `Men in Beige`,
    text: `Once/job, cleanup bureaucracy arrives and handles logistics. End one logistics objective; if authorities were the source, also clear 1 Exposure mark (GM call).`,
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
      name: `NDA Packet`,
      text: `Once/job, convert one witness into a non-problem. Clear 1 Exposure mark or prevent one from that witness chain.`,
      frequency: 'perJob',
    },
    {
      name: `Authority Translation`,
      text: `Charm vs TN. Success: for one segment, Exposure can't increase from that authority. Failure: Exposure +1 immediately. Limit: 1/scene.`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Distraction Engine`,
      text: `Once/scene, create a crowd beat that buys time. One ally gets one free action. If used to block cameras/witnesses, it can justify preventing Exposure (GM call).`,
      frequency: 'perScene',
      cost: 1,
    },
    {
      name: `Client Wrangling`,
      text: `Charm vs TN. Success: prevent an NPC from creating a new complication. Failure: you still stop them, but Exposure +1d4.`,
      cost: 2,
    },
    {
      name: `Public Narrative Control`,
      text: `Once/job, erase a piece of "going viral." Clear 1 Exposure mark and that evidence won't resurface.`,
      frequency: 'perJob',
      cost: 3,
    },
  ],
  availableTagIds: ['glamour', 'omen', 'spark'],
} satisfies Training;
