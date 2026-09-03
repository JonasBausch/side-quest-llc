import { describe, it, expect } from 'vitest';
import LZString from 'lz-string';
import { encodeDefinition, decodeDefinition } from './serialize';
import { emptyDefinition } from './character';
import { tropesById } from '../content';
import type { CharacterDefinition } from '../content/schema';

/**
 * The definition travels in the URL fragment as an LZ-compressed payload.
 * A share link is only useful if what comes back out equals what went in — and
 * if every link minted before the compact v2 format still opens.
 */

const fullBuild = (): CharacterDefinition => ({
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
});

describe('serialize round-trip', () => {
  it('decodes back to an equal definition', () => {
    const def = fullBuild();
    expect(decodeDefinition(encodeDefinition(def))).toEqual(def);
  });

  it('returns null for undecodable input', () => {
    expect(decodeDefinition('')).toBeNull();
    // Valid-looking string that decompresses to something that isn't a definition.
    expect(decodeDefinition('not-a-real-payload')).toBeNull();
    expect(decodeDefinition('2~not-a-real-payload')).toBeNull();
  });

  it('preserves cross-training and the order nodes were taken', () => {
    const def: CharacterDefinition = {
      ...fullBuild(),
      takenNodes: [
        { trainingId: 'field-tinkerer', path: 'wyrd', index: 2 },
        { trainingId: 'negotiator', path: 'mundane', index: 1 },
        { trainingId: 'field-tinkerer', path: 'mundane', index: 5 },
        { trainingId: 'ward-carpenter', path: 'wyrd', index: 3 },
      ],
    };
    expect(decodeDefinition(encodeDefinition(def))?.takenNodes).toEqual(
      def.takenNodes,
    );
  });

  it('keeps every stat die on the right stat', () => {
    const def: CharacterDefinition = {
      ...fullBuild(),
      statDice: {
        brains: 'd4',
        brawn: 'd6',
        charm: 'd8',
        fight: 'd10',
        flight: 'd12',
        grit: 'd20',
      },
    };
    expect(decodeDefinition(encodeDefinition(def))?.statDice).toEqual(
      def.statDice,
    );
  });

  it('does not default rulesVersion to the current ruleset', () => {
    const def: CharacterDefinition = { ...fullBuild(), rulesVersion: '3.1' };
    expect(decodeDefinition(encodeDefinition(def))?.rulesVersion).toBe('3.1');
  });
});

describe('trait rehydration', () => {
  it('stores a book-picked trait by id and resolves it from content', () => {
    const trope = tropesById.get('by-the-book')!;
    const def: CharacterDefinition = {
      ...fullBuild(),
      trope: {
        id: trope.id,
        name: trope.name,
        text: trope.text,
        frequency: trope.frequency,
      },
    };

    // The prose must not be in the payload — that duplication is what made
    // links long.
    const payload = LZString.decompressFromEncodedURIComponent(
      encodeDefinition(def).slice(2),
    )!;
    expect(payload).toContain('by-the-book');
    expect(payload).not.toContain(trope.text);

    expect(decodeDefinition(encodeDefinition(def))?.trope).toEqual(def.trope);
  });

  it('keeps a homebrew trait inline', () => {
    const def: CharacterDefinition = {
      ...fullBuild(),
      flaw: { name: 'Owes the wrong people', text: 'They know where you sleep.' },
    };
    expect(decodeDefinition(encodeDefinition(def))?.flaw).toEqual(def.flaw);
  });

  it('inlines a pick whose id does not resolve, rather than stripping it', () => {
    // Only ids that resolve in the registry are safe to strip to a bare id.
    const def: CharacterDefinition = {
      ...fullBuild(),
      strength: { id: 'retired-strength', name: 'Retired Strength' },
    };
    expect(decodeDefinition(encodeDefinition(def))?.strength).toEqual(
      def.strength,
    );
  });

  it('keeps a bare id the content has since dropped, rather than losing it', () => {
    // A link minted while the trait existed, opened after content removed it.
    // Reconstructed by hand because encode can no longer produce this.
    const link =
      '2~' +
      LZString.compressToEncodedURIComponent(
        JSON.stringify({
          v: '4.0',
          i: 'a1b2c3d4',
          n: 'Ghost Pick',
          p: 'm',
          k: 'field-tinkerer|',
          r: [0, 'trait-since-removed', 0],
        }),
      );
    expect(decodeDefinition(link)?.strength).toEqual({
      id: 'trait-since-removed',
      name: 'trait-since-removed',
    });
  });
});

describe('legacy v1 links', () => {
  /**
   * Captured from the pre-v2 encoder. Never regenerate this — its whole job is
   * to be a real link from before the format change.
   */
  const V1_LINK =
    'N4IglgJiBcIMwDMBMBDAjAIwCwGMC0ArARAGx5YDsApgBx4CcKADGnhkjnBFlQQiUwogANCABOAVwA2VAM4A1KmNlgA9gDsYILADomIkOpQBbKloBSYAC5WlGCQHMABABEqEgB4HjKMOoAqYr7qfg4AklCwCGBUUhB4Vn4A1kpKBrJWKGKJ6g4ACihWABZaAO4AnmJQopkp6gByqhByMADaoFZBfqERWtGx8TkpYmmiAA6FJbAVVQZ+zV7QSAC+wh1dIbm9sOpUDqqJhapiBhPFWsYS6hAou3PXVItoywC6oioORlYSI-4o4ZEQLIJmIkukwJ9Cj8qP4rmYoigMulMlYXGAcPDQBgNrItBA0EgDNiUKVNLBuAYcEUssY8TQQKsQJ1VGNMeBARhygkilQ2KpVGDREZTFoAELlJzFKhOUX8wVMx5WLQAZX8AEEADIAUSceQASgB5ZU6gBihoAsk41fUnAaNS4nBqwvUANI6AwIEYARwkVHUOHKWgmshUADczIyMiNcudoKBhfCQAAJVSmbFUUpOZWdP0Oc41RVac0oZpOCRjJyFSU8yUoDAyd2M9QHFqwA2lOTV6XRDxKStOBAoUOqH6NoA';

  it('still decodes, with its uuid and node order intact', () => {
    const def = decodeDefinition(V1_LINK);
    expect(def).not.toBeNull();
    // The session key is derived from this — an old link must keep its id or
    // the character loses its live state.
    expect(def!.id).toBe('3f2a1b4c-55d6-47e8-9a01-b2c3d4e5f607');
    expect(def!.name).toBe('Jitterbug Deux');
    expect(def!.takenNodes).toEqual([
      { trainingId: 'field-tinkerer', path: 'wyrd', index: 2 },
      { trainingId: 'negotiator', path: 'mundane', index: 1 },
    ]);
    expect(def!.statDice).toEqual({ brains: 'd12', brawn: 'd4', charm: 'd8' });
    expect(def!.strength).toEqual({
      name: 'Homebrew Strength',
      text: 'Made up at the table.',
    });
    expect(def!.notes).toBe('Owes the fixer a favour.');
  });

  it('reads a v1 payload verbatim, without rehydrating its traits', () => {
    // v1 decoding is untouched: the prose frozen into an old link is what that
    // link shows. It only picks up current content once re-minted as v2.
    expect(decodeDefinition(V1_LINK)!.trope!.text).toBe(
      'STALE PROSE FROM AN OLD LINK.',
    );
  });

  it('re-minting a v1 link produces a shorter v2 link for the same character', () => {
    const def = decodeDefinition(V1_LINK)!;
    expect(encodeDefinition(def).length).toBeLessThan(V1_LINK.length * 0.6);
    expect(decodeDefinition(encodeDefinition(def))!.id).toBe(def.id);
  });
});
