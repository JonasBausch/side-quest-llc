import { describe, it, expect } from 'vitest';
import { trainings, spellTagsById } from './index';
import { trainingSchema } from './schema';

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
