/**
 * Content registry. Aggregates every authored content collection and exposes
 * id-keyed lookups. Components import from here and stay generic over the data —
 * no component should name a specific training, node, or tag.
 */
import type {
  Training,
  SpellTag,
  Tune,
  Trait,
  Condition,
  GroupBonus,
} from './schema';

import { artifactHandler } from './trainings/artifact-handler';
import { cleanupSpecialist } from './trainings/cleanup-specialist';
import { containmentTech } from './trainings/containment-tech';
import { crowdLiason } from './trainings/crowd-liason';
import { fieldTinkerer } from './trainings/field-tinkerer';
import { negotiator } from './trainings/negotiator';
import { researchArchivist } from './trainings/research-archivist';
import { runnerDriver } from './trainings/runner-driver';
import { sensorOperator } from './trainings/sensor-operator';
import { wardCarpenter } from './trainings/ward-carpenter';

import { spellTags } from './spell-tags';
import { tunes } from './tunes';
import { tropes } from './tropes';
import { strengths } from './strengths';
import { flaws } from './flaws';
import { conditions } from './conditions';
import { wyrdTrack } from './wyrd';
import { momentumGuide } from './momentum';
import { exposureGuide } from './exposure';
import { castingGuide } from './casting';
import { groupBonusGuide } from './group-bonuses';

/** All trainings, alphabetical by display name. */
export const trainings: Training[] = [
  artifactHandler,
  cleanupSpecialist,
  containmentTech,
  crowdLiason,
  fieldTinkerer,
  negotiator,
  researchArchivist,
  runnerDriver,
  sensorOperator,
  wardCarpenter,
].sort((a, b) => a.name.localeCompare(b.name));

export {
  spellTags,
  tunes,
  tropes,
  strengths,
  flaws,
  conditions,
  wyrdTrack,
  momentumGuide,
  exposureGuide,
  castingGuide,
  groupBonusGuide,
};

function byId<T extends { id: string }>(items: readonly T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]));
}

export const trainingsById = byId(trainings);
export const spellTagsById = byId(spellTags);
export const tunesById = byId<Tune>(tunes);
export const tropesById = byId<Trait>(tropes);
export const strengthsById = byId<Trait>(strengths);
export const flawsById = byId<Trait>(flaws);
export const conditionsById = byId<Condition>(conditions);

/** Every unlockable Group Bonus level, flattened out of the guide. */
export const groupBonuses: GroupBonus[] = groupBonusGuide.bonuses;
export const groupBonusesById = byId<GroupBonus>(groupBonuses);

export type { Training, SpellTag, Tune, Trait, Condition, GroupBonus };
