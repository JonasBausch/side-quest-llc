import type { Training } from '../schema';

/**
 * Cleanup Specialist — "Professional vibes janitor."
 * Transcribed verbatim from docs/rules-v4.0.md ("Cleanup Specialist").
 *
 * Naming conflict, flagged: the leveling-track table calls Gear-2 "Trace Kit",
 * but the Mundane Path Options describe it under the heading "Forensics Kit".
 * The table is the canonical node list (tables win), so the node name follows
 * the table and the text is the Forensics Kit prose. Wyrd-4 is Residue Economy,
 * inline. Neutralizer's rules text is truncated in the source ("choose one:"
 * with a single option) and is transcribed as printed.
 */
export const cleanupSpecialist = {
  id: 'cleanup-specialist',
  name: 'Cleanup Specialist',
  tagline: `Professional vibes janitor.`,
  specialty: {
    name: `White-Glove Clearance`,
    text: `Once/job, only when Wyrd is low (0–2): fully clear one room/zone to "certifiably normal." Set Exposure to 0 for that zone and your report holds.`,
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
      name: `Residue Economy`,
      text: `Magic leaves usable residue, and you know how to work with it. When you cast, you may choose to leave a Residue Tag in the scene (static smear, salt bloom, mirrored scab, burnt sigil, fog of incense, etc.). Once per scene, anyone can leverage a Residue Tag for a situational advantage (track the hazard, lock a route, reveal a hidden seam, justify a prep, etc.). Cost: each Residue Tag is also a trail. The GM can use it later to justify attention (authorities, entities, rivals, "it shows up in the records").`,
    },
    {
      name: `D12 Wyrd Die`,
      text: `D12 Wyrd Die (All Spell Sizes).`,
      frequency: 'passive',
    },
  ],
  mundaneNodes: [
    {
      name: `Glamour Wash`,
      text: `Once/scene, reduce civilian noticing. Clear 1 Exposure mark or prevent the next Exposure mark from bystanders this scene.`,
      frequency: 'perScene',
    },
    {
      name: `Trace Kit`,
      text: `Collect a sample that becomes a leverage asset (intel, contact, crafting input, ward ingredient). If you use it later to support a cover story, it can justify clearing Exposure (GM call).`,
      cost: 1,
    },
    {
      name: `Neutralizer`,
      text: `Remove one sensory hazard (smell/static/whispers/shadow stain). On a success, choose one: Wyrd −1d4 (if the hazard is Wyrd-driven)`,
      cost: 1,
    },
    {
      name: `Certification Stamp`,
      text: `Once/job, declare a zone "handled" for official purposes. Clear 1 Exposure mark, and Exposure can't increase from this zone for one segment. Cost: the GM writes a quiet consequence (paperwork, inspections, a complaint, a contact call).`,
      frequency: 'perJob',
      cost: 2,
    },
    {
      name: `Hazmat Seal`,
      text: `Once/job, prevent Wyrd from bleeding into adjacent spaces for the rest of the scene. Also prevents Exposure from spillover.`,
      frequency: 'perJob',
      cost: 3,
    },
  ],
  availableTagIds: ['bindname', 'cleanse', 'saltline', 'sense', 'step'],
} satisfies Training;
