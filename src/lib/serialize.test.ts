import { describe, it, expect } from 'vitest';
import { encodeDefinition, decodeDefinition } from './serialize';
import { emptyDefinition } from './character';
import type { CharacterDefinition } from '../content/schema';

/**
 * The definition travels in the URL fragment as an LZ-compressed JSON payload.
 * A share link is only useful if what comes back out equals what went in.
 * encode/decode are pure (no window access), so this needs no DOM.
 */
describe('serialize round-trip', () => {
  it('decodes back to an equal definition', () => {
    const def: CharacterDefinition = {
      ...emptyDefinition(),
      name: 'Jitterbug Deux',
      mainTrainingId: 'field-tinkerer',
      startingPath: 'wyrd',
      takenNodes: [
        { trainingId: 'field-tinkerer', path: 'wyrd', index: 2 },
        { trainingId: 'field-tinkerer', path: 'mundane', index: 1 },
      ],
      signatureTagId: 'spark',
      signatureTune: 'fast',
      statDice: { brains: 'd12', brawn: 'd4', charm: 'd8' },
      trope: { id: 'custom', name: 'Homebrew Trope', text: 'Made up at the table.' },
      strength: { id: 'nerves', name: 'Nerves of Steel', text: 'Unflappable.' },
      flaw: { id: 'reckless', name: 'Reckless', text: 'Leaps first.' },
      notes: 'Owes the fixer a favour.',
    };

    const roundTripped = decodeDefinition(encodeDefinition(def));
    expect(roundTripped).toEqual(def);
  });

  it('returns null for undecodable input', () => {
    expect(decodeDefinition('')).toBeNull();
    // Valid-looking string that decompresses to something that isn't a definition.
    expect(decodeDefinition('not-a-real-payload')).toBeNull();
  });
});
