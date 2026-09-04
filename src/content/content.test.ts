import { describe, it, expect } from 'vitest';
import { trainings, spellTagsById, groupBonuses } from './index';
import {
  trainingSchema,
  groupBonusGuideSchema,
  castingGuideSchema,
} from './schema';
import { groupBonusGuide } from './group-bonuses';
import { castingGuide } from './casting';

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
