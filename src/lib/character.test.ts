import { describe, it, expect } from 'vitest';
import {
  availableTagIds,
  emptyDefinition,
  hasNode,
  nodeKey,
  setStart,
  startingNodeRef,
  tagSourceTrainingIds,
} from './character';
import { validateDefinition } from './validate';
import { trainingsById } from '../content';
import type { CharacterDefinition, NodeRef } from '../content/schema';

/**
 * Creation grants the Training's Specialty plus the first node of the chosen
 * path — Wyrd-1 or Gear-1 (Rules: "Path Options"). Everything below is about
 * that one free node: that a new character has it, that it follows a change of
 * training or path, and that changing your mind at creation never eats a node
 * that was actually earned.
 */
describe('the free starting node', () => {
  it('is taken by a brand-new character, and nothing else is', () => {
    const def = emptyDefinition();
    expect(def.takenNodes).toEqual([startingNodeRef(def)]);
  });

  it('follows a change of starting path', () => {
    const def = emptyDefinition();
    const next = setStart(def, { startingPath: 'wyrd' });

    expect(next.startingPath).toBe('wyrd');
    expect(next.takenNodes).toEqual([
      { trainingId: def.mainTrainingId, path: 'wyrd', index: 1 },
    ]);
  });

  it('follows a change of main training', () => {
    const def = emptyDefinition();
    const next = setStart(def, { mainTrainingId: 'negotiator' });

    expect(hasNode(next, startingNodeRef(next))).toBe(true);
    expect(hasNode(next, startingNodeRef(def))).toBe(false);
  });

  it('leaves earned and cross-trained nodes alone', () => {
    const earned: NodeRef = {
      trainingId: 'field-tinkerer',
      path: 'mundane',
      index: 3,
    };
    const crossed: NodeRef = {
      trainingId: 'negotiator',
      path: 'wyrd',
      index: 1,
    };
    const def: CharacterDefinition = {
      ...emptyDefinition(),
      mainTrainingId: 'field-tinkerer',
      startingPath: 'mundane',
      takenNodes: [
        { trainingId: 'field-tinkerer', path: 'mundane', index: 1 },
        earned,
        crossed,
      ],
    };

    const next = setStart(def, { startingPath: 'wyrd' });

    expect(next.takenNodes).toContainEqual(earned);
    expect(next.takenNodes).toContainEqual(crossed);
  });

  it('does not duplicate a node the character already had', () => {
    const def: CharacterDefinition = {
      ...emptyDefinition(),
      mainTrainingId: 'field-tinkerer',
      startingPath: 'mundane',
      takenNodes: [
        { trainingId: 'field-tinkerer', path: 'mundane', index: 1 },
        { trainingId: 'field-tinkerer', path: 'wyrd', index: 1 },
      ],
    };

    const next = setStart(def, { startingPath: 'wyrd' });
    const keys = next.takenNodes.map(nodeKey);

    expect(new Set(keys).size).toBe(keys.length);
    expect(next.takenNodes).toHaveLength(1);
  });

  it('is only advised, never enforced', () => {
    const def: CharacterDefinition = {
      ...emptyDefinition(),
      name: 'Jules',
      takenNodes: [],
    };

    // The build stands; the player is only told what creation would have given.
    expect(validateDefinition(def)).toContainEqual(
      expect.stringContaining('Gear-1'),
    );
  });
});

/**
 * A cross-trained character picks their Signature from either training's tags
 * (Rules: "Getting a Promotion"). The Specialty is the only thing locked to the
 * main training, so tags are a union, never a filter.
 */
describe('signature tag access', () => {
  const main = 'field-tinkerer';
  const other = 'sensor-operator';

  function withNode(path: 'wyrd' | 'mundane') {
    return {
      ...emptyDefinition(),
      mainTrainingId: main,
      startingPath: 'mundane' as const,
      takenNodes: [{ trainingId: other, path, index: 1 }],
    };
  }

  it('offers the main training on its own', () => {
    const def = { ...emptyDefinition(), mainTrainingId: main };
    expect(tagSourceTrainingIds(def)).toEqual([main]);
  });

  it('adds the training of a cross-trained Wyrd node', () => {
    expect(tagSourceTrainingIds(withNode('wyrd')).sort()).toEqual(
      [main, other].sort(),
    );
  });

  it('does not add a training entered on the Gear side alone', () => {
    expect(tagSourceTrainingIds(withNode('mundane'))).toEqual([main]);
  });

  it('unions both tag lists rather than filtering to the main training', () => {
    const def = withNode('wyrd');
    const tags = availableTagIds(def);

    for (const id of [main, other]) {
      for (const tag of trainingsById.get(id)!.availableTagIds) {
        expect(tags).toContain(tag);
      }
    }
  });
});
