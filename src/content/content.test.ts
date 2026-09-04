import { describe, it, expect } from 'vitest';
import { trainings, spellTagsById, groupBonuses, strengthsById } from './index';
import {
  trainingSchema,
  groupBonusGuideSchema,
  castingGuideSchema,
  exposureGuideSchema,
  momentumGuideSchema,
} from './schema';
import { groupBonusGuide } from './group-bonuses';
import { castingGuide } from './casting';
import { exposureGuide } from './exposure';
import { momentumGuide } from './momentum';

/**
 * The "structural tests" CLAUDE.md relies on to catch silent transcription
 * failures. Training files only `satisfies Training` (compile-time), so the Zod
 * schema is never actually run against authored content — these tests run it.
 */
describe('trainings', () => {
  it('has all ten trainings', () => {
    expect(trainings).toHaveLength(10);
  });

  it.each(trainings)(
    '$name is structurally valid (specialty, 5 wyrd, 5 mundane, non-empty tags)',
    (training) => {
      // trainingSchema enforces: specialty present, exactly 5 wyrd nodes,
      // exactly 5 mundane nodes, and a non-empty availableTagIds list.
      expect(() => trainingSchema.parse(training)).not.toThrow();
    },
  );

  // The pattern that caught Sensor Operator's swapped Gear-1/Gear-2: the free
  // item opens the Mundane Path in every training. A costed Gear-1 means two
  // entries have been transcribed in the wrong order.
  it.each(trainings)('$name opens its Mundane Path with the free gear', (training) => {
    expect(training.mundaneNodes[0].cost ?? 0).toBe(0);
  });

  it.each(trainings)(
    '$name references only spell tags that resolve',
    (training) => {
      for (const tagId of training.availableTagIds) {
        expect(spellTagsById.has(tagId)).toBe(true);
      }
    },
  );
});

describe('group bonuses', () => {
  it('is structurally valid', () => {
    expect(() => groupBonusGuideSchema.parse(groupBonusGuide)).not.toThrow();
  });

  it('has unique ids', () => {
    const ids = groupBonuses.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('levels within a family are contiguous from 1', () => {
    const families = new Map<string, number[]>();
    for (const b of groupBonuses) {
      families.set(b.group, [...(families.get(b.group) ?? []), b.level]);
    }
    for (const [group, levels] of families) {
      expect(
        [...levels].sort((a, b) => a - b),
        `${group} levels`,
      ).toEqual(levels.map((_, i) => i + 1));
    }
  });

  it('prices every level of a family identically', () => {
    const priced = new Map<string, number>();
    for (const b of groupBonuses) {
      const seen = priced.get(b.group);
      if (seen === undefined) priced.set(b.group, b.costPerPlayer);
      else expect(b.costPerPlayer, `${b.group} price`).toBe(seen);
    }
  });
});

describe('casting guide', () => {
  it('is structurally valid', () => {
    expect(() => castingGuideSchema.parse(castingGuide)).not.toThrow();
  });

  it('covers all three scales', () => {
    expect(castingGuide.scales.map((s) => s.name)).toEqual([
      'Small',
      'Medium',
      'Large',
    ]);
  });
});

describe('resource guides', () => {
  it('are structurally valid', () => {
    expect(() => exposureGuideSchema.parse(exposureGuide)).not.toThrow();
    expect(() => momentumGuideSchema.parse(momentumGuide)).not.toThrow();
  });

  // Both confirmed by the GM: Momentum is capped, Exposure is not.
  it('cap Momentum at 10 and leave Exposure open-ended', () => {
    expect(momentumGuide.cap).toBe(10);
    expect(exposureGuide.threshold.at).toBe(3);
    expect(exposureGuide.tally).toMatch(/does not reset/i);
  });
});

describe('trait cadences', () => {
  // GM ruling: Unshakable Calm gets a tick-box even though it fires on its own.
  // Book traits ride in a share link as an id and are rebuilt from content, so
  // this cadence reaches characters built before the ruling.
  it('makes Unshakable Calm a per-scene use', () => {
    expect(strengthsById.get('unshakable-calm')?.frequency).toBe('perScene');
  });
});
