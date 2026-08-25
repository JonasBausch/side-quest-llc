import { z } from 'zod';

/**
 * SideQuest content + character schemas.
 *
 * Design rules this file obeys (see CLAUDE.md):
 * - No game mechanics are modelled. Rules text lives as prose in a single
 *   `text` field. The only structured fields are metadata: name, frequency,
 *   prerequisite, cost.
 * - Content collections are authored by us and may be validated strictly.
 *   Character *builds* are validated advisory-only elsewhere (src/lib), so the
 *   character schemas below stay permissive on purpose.
 * - Character definition and session state are strictly disjoint types. They
 *   share nothing but a linking id. A session reset must not touch the
 *   definition; a share link must not clobber live state.
 *
 * The current ruleset version. A stored character carries its own
 * `rulesVersion`; when it does not match this, the UI shows a banner.
 */
export const CURRENT_RULES_VERSION = '4.0';

/* -------------------------------------------------------------------------- */
/* Shared primitives                                                          */
/* -------------------------------------------------------------------------- */

/** Content and reference ids are non-empty, lowercase-kebab by convention. */
const id = z.string().min(1);

/** The six stats. Rules: "Stats". */
export const statEnum = z.enum([
  'brains',
  'brawn',
  'charm',
  'fight',
  'flight',
  'grit',
]);
export type StatId = z.infer<typeof statEnum>;

/** The die sizes a stat can be assigned. Rules: "Stats" / "Stat Die". */
export const dieEnum = z.enum(['d4', 'd6', 'd8', 'd10', 'd12', 'd20']);
export type DieSize = z.infer<typeof dieEnum>;

/**
 * The entire mechanical abstraction, per CLAUDE.md. Coarse on purpose:
 * exact limits ("2/scene", "1 active oath") stay in the prose `text`, not here.
 * Optional — specialties and passives often state no cadence, and forcing a
 * bucket would itself be a form of modelling.
 */
export const frequencyEnum = z.enum([
  'perScene',
  'perJob',
  'passive',
  'counter',
]);
export type Frequency = z.infer<typeof frequencyEnum>;

/** A Training's two tracks. Rules: "Path Options". */
export const pathEnum = z.enum(['wyrd', 'mundane']);
export type Path = z.infer<typeof pathEnum>;

/* -------------------------------------------------------------------------- */
/* Nodes (both paths share one shape)                                         */
/* -------------------------------------------------------------------------- */

/**
 * One step on a Training path — a Wyrd-1..5 or Gear-1..5 node.
 *
 * Wyrd and Mundane nodes deliberately share this shape so components stay
 * generic, even though Wyrd-1/3/5 are identical die-upgrade boilerplate across
 * all trainings and Wyrd-4 carries a repeated Interface ability inline. The
 * Wyrd-2 "pick a signature spell tag" choice is captured on the character, not
 * here (see CharacterDefinition.signatureTagId / signatureTune).
 *
 * `cost` is the parenthetical tier on gear headers (e.g. "Provenance Knife (3)";
 * "—" means absent). It is NOT the node's slot index — a training can have two
 * cost-1 gear items.
 */
export const nodeSchema = z.object({
  name: z.string().min(1),
  /** Rules text, verbatim prose. Never parsed for mechanics. */
  text: z.string().min(1),
  frequency: frequencyEnum.optional(),
  cost: z.number().int().optional(),
  /** Freeform prerequisite note, if the rules state one. Never enforced. */
  prerequisite: z.string().optional(),
});
export type Node = z.infer<typeof nodeSchema>;

/* -------------------------------------------------------------------------- */
/* Spell tags (shared across trainings, referenced by id)                     */
/* -------------------------------------------------------------------------- */

/**
 * A spell tag with its Small / Medium / Large prose. Rules: "Spell Tags".
 * Referenced by trainings via id, never duplicated inline. No range/drawback
 * fields — those exist only in the custom-spell formula, not on printed tags,
 * so adding them would be modelling absent content.
 */
export const spellTagSchema = z.object({
  id,
  name: z.string().min(1),
  small: z.string().min(1),
  medium: z.string().min(1),
  large: z.string().min(1),
  /** Optional GM-call note surfacing a ruleset gap for this tag. */
  note: z.string().optional(),
});
export type SpellTag = z.infer<typeof spellTagSchema>;

/* -------------------------------------------------------------------------- */
/* Signature Tunes (shared, a per-character choice at Wyrd-2)                  */
/* -------------------------------------------------------------------------- */

/**
 * The six Tunes. Rules: "Signature Spells" (Tier 1). A character picks one and
 * applies it to their signature tag. Modelled as a closed set because the rules
 * fix it; custom Tunes are not a thing.
 */
export const tuneIdEnum = z.enum([
  'quiet',
  'fast',
  'stable',
  'anchored',
  'split',
  'coded',
]);
export type TuneId = z.infer<typeof tuneIdEnum>;

export const tuneSchema = z.object({
  id: tuneIdEnum,
  name: z.string().min(1),
  text: z.string().min(1),
});
export type Tune = z.infer<typeof tuneSchema>;

/* -------------------------------------------------------------------------- */
/* Trainings                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * A Training Specialty. Rules: "Training Specialty". Granted only by a
 * character's *main* training. Separate from the ten path nodes.
 */
export const specialtySchema = z.object({
  name: z.string().min(1),
  text: z.string().min(1),
  frequency: frequencyEnum.optional(),
});
export type Specialty = z.infer<typeof specialtySchema>;

/**
 * A Training. All ten share this shape: a specialty, exactly five Wyrd nodes,
 * exactly five Mundane nodes, and a non-empty list of available spell tag ids.
 * The length/non-empty checks are the structural tests from CLAUDE.md. Tag-id
 * resolution (that each id resolves to a real tag) is cross-collection and
 * lives in src/lib/validation, not here.
 */
export const trainingSchema = z.object({
  id,
  name: z.string().min(1),
  /** The quoted flavour line, e.g. "White gloves. Bad decisions." */
  tagline: z.string().optional(),
  specialty: specialtySchema,
  wyrdNodes: z.array(nodeSchema).length(5),
  mundaneNodes: z.array(nodeSchema).length(5),
  availableTagIds: z.array(id).min(1),
});
export type Training = z.infer<typeof trainingSchema>;

/* -------------------------------------------------------------------------- */
/* Tropes, Strengths, Flaws                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Tropes, Strengths and Flaws all share one shape. Rules explicitly allow
 * homebrew ("create your own"), so the character may reference one of these by
 * id or supply a custom pick inline (see traitPickSchema).
 */
export const traitSchema = z.object({
  id,
  name: z.string().min(1),
  text: z.string().min(1),
  frequency: frequencyEnum.optional(),
});
export type Trait = z.infer<typeof traitSchema>;

/* -------------------------------------------------------------------------- */
/* Conditions                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A Condition. Rules: "Conditions". Each applies −1 to rolls on the stats it
 * penalises; `affectedStats` drives the prototype's cross-reference (toggling a
 * condition highlights the affected dice with the reason). We store the mapping
 * as data, not the −1 resolution.
 */
export const conditionIdEnum = z.enum([
  'shaken',
  'winded',
  'distracted',
  'marked',
  'strained',
]);
export type ConditionId = z.infer<typeof conditionIdEnum>;

export const conditionSchema = z.object({
  id: conditionIdEnum,
  name: z.string().min(1),
  /** Short gloss, e.g. "fear/unease". */
  text: z.string().min(1),
  affectedStats: z.array(statEnum).min(1),
});
export type Condition = z.infer<typeof conditionSchema>;

/* -------------------------------------------------------------------------- */
/* Wyrd track                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A named threshold on the Wyrd track. Rules: "Wyrd threshold" (2, 4, 6). The
 * UI uses these for peripheral scene-state feedback (background shifts at 4
 * and 6).
 */
export const wyrdThresholdSchema = z.object({
  at: z.number().int(),
  name: z.string().min(1),
  text: z.string().min(1),
});
export type WyrdThreshold = z.infer<typeof wyrdThresholdSchema>;

/** The Wyrd track: 0 → 6, with named thresholds. Rules: "Wyrd". */
export const wyrdTrackSchema = z.object({
  min: z.number().int(),
  max: z.number().int(),
  thresholds: z.array(wyrdThresholdSchema),
});
export type WyrdTrack = z.infer<typeof wyrdTrackSchema>;

/* -------------------------------------------------------------------------- */
/* Character definition (shareable: URL fragment / JSON, changes ~once a job)  */
/* -------------------------------------------------------------------------- */

/**
 * A reference to a taken node. Nodes span any training and either path because
 * promotions allow cross-training (Rules: "Getting a Promotion"). `index` is
 * the 1-based slot (Wyrd-1..5 / Gear-1..5).
 */
export const nodeRefSchema = z.object({
  trainingId: id,
  path: pathEnum,
  index: z.number().int().min(1).max(5),
});
export type NodeRef = z.infer<typeof nodeRefSchema>;

/**
 * A Trope/Strength/Flaw pick. References content by `id` when chosen from the
 * book; a homebrew pick omits `id` and supplies its own name/text. Rules allow
 * "create your own" for all three.
 */
export const traitPickSchema = z.object({
  id: id.optional(),
  name: z.string().min(1),
  text: z.string().optional(),
  frequency: frequencyEnum.optional(),
});
export type TraitPick = z.infer<typeof traitPickSchema>;

/**
 * Die assignment: each stat gets a die. Advisory — a build may be incomplete or
 * house-ruled, so this is a partial map, not an enforced bijection.
 */
export const statDiceSchema = z.record(statEnum, dieEnum);
export type StatDice = z.infer<typeof statDiceSchema>;

/**
 * The shareable, long-lived half of a character. Serialized into the URL
 * fragment and importable/exportable as JSON. Contains no live scene state.
 */
export const characterDefinitionSchema = z.object({
  /** Stable id; session state is keyed off this. */
  id,
  /** Ruleset this build was authored against; drives the mismatch banner. */
  rulesVersion: z.string().min(1),
  name: z.string().min(1),

  /** The one training that grants a Specialty. Rules: "Getting a Promotion". */
  mainTrainingId: id,
  /** Wyrd or Mundane, chosen at creation. Rules: "Path Options". */
  startingPath: pathEnum,
  /** Every node taken, across any training and either path. */
  takenNodes: z.array(nodeRefSchema),

  /** Wyrd-2 choices, present only once that node is taken on the Wyrd path. */
  signatureTagId: id.optional(),
  signatureTune: tuneIdEnum.optional(),

  statDice: statDiceSchema,

  trope: traitPickSchema.optional(),
  strength: traitPickSchema.optional(),
  flaw: traitPickSchema.optional(),

  /** Background-question answers, freeform Q→A. Rules: "Quick Backstory". */
  background: z.record(z.string(), z.string()).optional(),
});
export type CharacterDefinition = z.infer<typeof characterDefinitionSchema>;

/* -------------------------------------------------------------------------- */
/* Session state (localStorage, keyed by character id, never shared)          */
/* -------------------------------------------------------------------------- */

/**
 * One active condition instance. The rules leave open whether two conditions on
 * the same stat stack, so duplicates are permitted here and the UI surfaces it
 * as a GM call rather than resolving it.
 */
export const activeConditionSchema = z.object({
  id: conditionIdEnum,
  note: z.string().optional(),
});
export type ActiveCondition = z.infer<typeof activeConditionSchema>;

/**
 * The live, per-session half of a character. Changes constantly. Strictly
 * disjoint from CharacterDefinition — they share only `characterId`. "New
 * scene" clears per-scene spent uses and zeroes Wyrd; "New job" clears
 * everything including Exposure.
 */
export const sessionStateSchema = z.object({
  /** Links to CharacterDefinition.id. The only field the two halves share. */
  characterId: id,
  momentum: z.number().int(),
  wyrd: z.number().int(),
  exposure: z.number().int(),
  conditions: z.array(activeConditionSchema),
  /**
   * Opaque keys for spent once-per-scene / once-per-job uses. The app builds a
   * key per usable ability; this schema does not interpret them.
   */
  spentUses: z.array(z.string()),
});
export type SessionState = z.infer<typeof sessionStateSchema>;
