import type { GroupBonusGuide } from './schema';

/**
 * Group Bonuses. Transcribed from docs/rules-v5.0.md ("SideQuest Group
 * Bonuses"). Reference prose only — the crew agrees on a purchase at the table
 * and each player records it; nothing here spends Momentum or checks that
 * everyone paid.
 *
 * Two gaps run through the whole section and are surfaced as GM-call notes
 * rather than resolved:
 * - Families with levels print one price on the header. Whether each level
 *   costs that price separately, and whether levels must be bought in order,
 *   is unwritten.
 * - "Gear slot" (Full Gear Expansion) appears exactly once in v5.0, here. The
 *   rules never establish gear as slot-based, so there is no slot count to
 *   render against.
 */
export const groupBonusGuide = {
  purchase: `All require every player to spend the listed Momentum at the same end-of-episode scene. If even one person can't/won't pay, the upgrade is not unlocked.`,
  note: `Levelled families print a single per-player price on the header. Whether each level costs that again, and whether they must be taken in order, is a GM call.`,
  bonuses: [
    {
      id: 'team-protocol-1',
      group: 'Team Protocol',
      name: `"On My Mark!"`,
      level: 1,
      costPerPlayer: 1,
      frequency: 'perJob',
      text: `Once per job, all PCs can act in the same beat (synchronized move and a +1 to everyone's next roll).`,
    },
    {
      id: 'team-protocol-2',
      group: 'Team Protocol',
      name: `"Mutual Cover"`,
      level: 2,
      costPerPlayer: 1,
      frequency: 'perJob',
      text: `Once per job, anyone can transfer a Condition or any Momentum to any other player.`,
    },
    {
      id: 'team-protocol-3',
      group: 'Team Protocol',
      name: `"Redundant Prep"`,
      level: 3,
      costPerPlayer: 1,
      frequency: 'passive',
      text: `If a job goes off the rails, you know how to fix it. (Share Momentum at a one-to-one ratio, forever.)`,
      note: `Standing effect, not a once-per-job maneuver — it replaces the 2:1 Handoff cost for the crew.`,
    },
    {
      id: 'arcane-advancement',
      group: 'Arcane Advancement',
      name: 'Arcane Advancement',
      level: 1,
      costPerPlayer: 2,
      frequency: 'passive',
      text: `One player of the group's choice (or by vote/roll) upgrades their Wyrd Die to the next available tier (d4→d8, d8→d12).`,
      note: `The printed tiers skip d6 and d10; whether those are valid Wyrd Die sizes is a GM call. Apply the upgrade to your die assignment by hand.`,
    },
    {
      id: 'group-asset-1',
      group: 'Group Asset',
      name: 'Specter Van',
      level: 1,
      costPerPlayer: 2,
      frequency: 'passive',
      text: `A vehicle kitted for Wyrd containment, stealth, and security.`,
    },
    {
      id: 'group-asset-2',
      group: 'Group Asset',
      name: 'Null Field Emitter',
      level: 2,
      costPerPlayer: 2,
      frequency: 'perJob',
      text: `Once per job, the party can drop a Wyrd-dampening field (reduce Wyrd by 2 scene-wide, or block one Reality Surge).`,
      note: `One use for the whole crew, not one each.`,
    },
    {
      id: 'group-asset-3',
      group: 'Group Asset',
      name: 'Mobile Workshop',
      level: 3,
      costPerPlayer: 2,
      frequency: 'passive',
      text: `Repair, mod, or prep gear mid-mission.`,
    },
    {
      id: 'group-asset-4',
      group: 'Group Asset',
      name: 'Field Archive',
      level: 4,
      costPerPlayer: 2,
      frequency: 'passive',
      text: `Secure digital (or arcane) storage; unlock "prep" flashbacks and clues more flexibly.`,
    },
    {
      id: 'full-gear-expansion',
      group: 'Full Gear Expansion',
      name: 'Full Gear Expansion',
      level: 1,
      costPerPlayer: 3,
      frequency: 'passive',
      text: `Every PC gains an additional gear slot and immediately selects a new piece of gear or upgrade.`,
      note: `v5.0 never defines gear slots anywhere else, so there is no slot count to raise — treat the extra pick as a GM call.`,
    },
    {
      id: 'legacy-or-contact',
      group: 'Legacy or Contact',
      name: 'Legacy or Contact',
      level: 1,
      costPerPlayer: 5,
      frequency: 'passive',
      text: `Gain a crew-wide contact, major favor, or legacy asset (NPC, informant, safehouse, "retired" ghost, etc.). A permanent resource or relationship in the setting, mechanically accessible via flashbacks or downtime.`,
      note: `5 per player against a Momentum cap of 10 — the crew banks toward this across jobs.`,
    },
  ],
} satisfies GroupBonusGuide;
