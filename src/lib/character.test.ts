import { describe, it, expect } from 'vitest';
import {
  emptyDefinition,
  hasNode,
  nodeKey,
  setStart,
  startingNodeRef,
} from './character';
import { validateDefinition } from './validate';
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
