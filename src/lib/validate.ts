/**
 * Advisory build validation. Warnings only — never blocking. The tool warns on
 * an illegal or incomplete build but always lets the GM's ruling stand.
 */
import type { CharacterDefinition } from '../content/schema';
import { trainingsById } from '../content';
import {
  DICE,
  STAT_META,
  availableTagIds,
  hasNode,
  startingNodeRef,
} from './character';

export function validateDefinition(def: CharacterDefinition): string[] {
  const warnings: string[] = [];

  if (!def.name.trim()) warnings.push('Character has no name.');

  if (!trainingsById.has(def.mainTrainingId)) {
    warnings.push('No main training selected.');
  }

  // Dice: ideally each of the six sizes assigned exactly once.
  const assigned = STAT_META.map((s) => def.statDice[s.id]).filter(
    (d): d is (typeof DICE)[number] => !!d,
  );
  const missing = STAT_META.filter((s) => !def.statDice[s.id]);
  if (missing.length) {
    warnings.push(
      `Unassigned dice: ${missing.map((s) => s.name).join(', ')}.`,
    );
  }
  const dupes = assigned.filter((d, i) => assigned.indexOf(d) !== i);
  if (dupes.length) {
    warnings.push(`Same die used more than once: ${[...new Set(dupes)].join(', ')}.`);
  }

  // Creation grants the Specialty plus the first node of the starting path
  // (Rules: "Path Options"). Advisory like everything else here — a table that
  // rules otherwise just ignores it.
  if (!hasNode(def, startingNodeRef(def))) {
    const label = def.startingPath === 'wyrd' ? 'Wyrd-1' : 'Gear-1';
    warnings.push(
      `Characters start with the first node of their starting path (${label}); it is not taken.`,
    );
  }

  // Signature choices only make sense with the Wyrd-2 node and a valid tag.
  if (def.signatureTagId && !availableTagIds(def).includes(def.signatureTagId)) {
    warnings.push('Signature tag is not available from any taken Wyrd path.');
  }
  if (def.signatureTune && !def.signatureTagId) {
    warnings.push('A Tune is chosen but no Signature tag is set.');
  }

  return warnings;
}
