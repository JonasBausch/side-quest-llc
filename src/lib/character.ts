/**
 * Helpers over a CharacterDefinition. Pure functions; no I/O. These stay
 * generic over content — they resolve ids against the registry but never
 * hard-code a specific training, node, or tag.
 */
import {
  CURRENT_RULES_VERSION,
  type CharacterDefinition,
  type DieSize,
  type Frequency,
  type NodeRef,
  type Node,
  type Path,
  type StatId,
} from '../content/schema';
import { trainings, trainingsById } from '../content';

export const STAT_META: { id: StatId; name: string; use: string }[] = [
  { id: 'brains', name: 'Brains', use: 'Research, analysis, tech, and planning' },
  { id: 'brawn', name: 'Brawn', use: 'Lifting, breaking, carrying, and force' },
  { id: 'charm', name: 'Charm', use: 'Social leverage, deception, and command' },
  { id: 'fight', name: 'Fight', use: 'Combat, grapples, and possession' },
  { id: 'flight', name: 'Flight', use: 'Speed, stealth, driving, and escapes' },
  { id: 'grit', name: 'Grit', use: 'Fear control, endurance, resisting Wyrd' },
];

export const STAT_IDS = STAT_META.map((s) => s.id);

export const DICE: DieSize[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'];

/** Frequencies that surface as a spendable use in the tracker. */
export const USABLE_FREQUENCIES: Frequency[] = ['perScene', 'perJob', 'counter'];

/**
 * A short, stable id for a new character. Only the localStorage session key is
 * derived from it, so 32 bits is ample — and it costs ~28 fewer URL characters
 * than a full UUID. Existing characters keep the id they were created with:
 * ids are read from the share link, never regenerated, so nobody loses their
 * live session state.
 */
function newCharacterId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 8);
  }
  return Date.now().toString(36);
}

export function emptyDefinition(): CharacterDefinition {
  return {
    id: newCharacterId(),
    rulesVersion: CURRENT_RULES_VERSION,
    name: '',
    mainTrainingId: trainings[0].id,
    startingPath: 'mundane',
    takenNodes: [],
    statDice: {},
  };
}

/* ---- node references ---------------------------------------------------- */

export function nodeKey(ref: NodeRef): string {
  return `${ref.trainingId}:${ref.path}:${ref.index}`;
}

export function resolveNode(ref: NodeRef): Node | undefined {
  const training = trainingsById.get(ref.trainingId);
  if (!training) return undefined;
  const list = ref.path === 'wyrd' ? training.wyrdNodes : training.mundaneNodes;
  return list[ref.index - 1];
}

/** Every node of a training as [ref, node] pairs, in path/index order. */
export function trainingNodeRefs(
  trainingId: string,
  path: Path,
): { ref: NodeRef; node: Node }[] {
  const training = trainingsById.get(trainingId);
  if (!training) return [];
  const list = path === 'wyrd' ? training.wyrdNodes : training.mundaneNodes;
  return list.map((node, i) => ({
    ref: { trainingId, path, index: i + 1 },
    node,
  }));
}

export function hasNode(def: CharacterDefinition, ref: NodeRef): boolean {
  return def.takenNodes.some((n) => nodeKey(n) === nodeKey(ref));
}

export function toggleNode(
  def: CharacterDefinition,
  ref: NodeRef,
): CharacterDefinition {
  const key = nodeKey(ref);
  const taken = def.takenNodes.some((n) => nodeKey(n) === key);
  return {
    ...def,
    takenNodes: taken
      ? def.takenNodes.filter((n) => nodeKey(n) !== key)
      : [...def.takenNodes, ref],
  };
}

/** Training ids the character has touched (main + any cross-trained node). */
export function trainingsInPlay(def: CharacterDefinition): string[] {
  const ids = new Set<string>([def.mainTrainingId]);
  for (const n of def.takenNodes) ids.add(n.trainingId);
  return [...ids].filter((id) => trainingsById.has(id));
}

/**
 * Spell tag ids the character can pick a Signature from: the union of available
 * tags across the main training and any training in which a Wyrd node is taken.
 */
export function availableTagIds(def: CharacterDefinition): string[] {
  const out = new Set<string>();
  const add = (id: string) => {
    const t = trainingsById.get(id);
    if (t) t.availableTagIds.forEach((tag) => out.add(tag));
  };
  add(def.mainTrainingId);
  for (const n of def.takenNodes) if (n.path === 'wyrd') add(n.trainingId);
  return [...out];
}

/* ---- usable abilities (tracker checkboxes) ------------------------------ */

export interface UsableAbility {
  key: string;
  name: string;
  source: string;
  frequency: Frequency;
  text: string;
}

/**
 * Every ability and trait the character owns, whatever its cadence: the main
 * training's specialty, taken nodes, and the chosen trope/strength/flaw. Each
 * carries the rules `text` so the tracker can show what it does. `frequency` is
 * undefined when the source states no cadence (e.g. a passive gear note).
 */
export function characterAbilities(
  def: CharacterDefinition,
): (Omit<UsableAbility, 'frequency'> & { frequency?: Frequency })[] {
  const out: (Omit<UsableAbility, 'frequency'> & { frequency?: Frequency })[] =
    [];

  const main = trainingsById.get(def.mainTrainingId);
  if (main) {
    out.push({
      key: `specialty:${main.id}`,
      name: main.specialty.name,
      source: `${main.name} · Specialty`,
      frequency: main.specialty.frequency,
      text: main.specialty.text,
    });
  }

  for (const ref of def.takenNodes) {
    const node = resolveNode(ref);
    if (!node) continue;
    const training = trainingsById.get(ref.trainingId);
    const pathLabel = ref.path === 'wyrd' ? 'Wyrd' : 'Gear';
    out.push({
      key: `node:${nodeKey(ref)}`,
      name: node.name,
      source: `${training?.name ?? ref.trainingId} · ${pathLabel}-${ref.index}`,
      frequency: node.frequency,
      text: node.text,
    });
  }

  const traitEntries: [string, CharacterDefinition['trope']][] = [
    ['Trope', def.trope],
    ['Strength', def.strength],
    ['Flaw', def.flaw],
  ];
  for (const [label, pick] of traitEntries) {
    if (pick) {
      out.push({
        key: `${label.toLowerCase()}:${pick.id ?? 'custom'}`,
        name: pick.name,
        source: label,
        frequency: pick.frequency,
        text: pick.text ?? '',
      });
    }
  }

  return out;
}

const isUsable = (f?: Frequency): f is Frequency =>
  !!f && USABLE_FREQUENCIES.includes(f);

/**
 * Everything the character owns that has a spendable cadence: surfaced as
 * checkboxes in the tracker's Uses section. Passives are omitted (nothing to
 * spend).
 */
export function usableAbilities(def: CharacterDefinition): UsableAbility[] {
  return characterAbilities(def).filter(
    (a): a is UsableAbility => isUsable(a.frequency),
  );
}

/**
 * Everything the character owns that is *not* spendable — passives and abilities
 * that state no cadence. Shown as a reference loadout, no checkboxes.
 */
export function passiveAbilities(
  def: CharacterDefinition,
): (Omit<UsableAbility, 'frequency'> & { frequency?: Frequency })[] {
  return characterAbilities(def).filter((a) => !isUsable(a.frequency));
}
