import { describe, it, expect } from 'vitest';
import { resolveOpen, type UrlSnapshot } from './open';
import type { StoredDefinition } from './definitions';
import { emptyDefinition } from './character';
import type { CharacterDefinition } from '../content/schema';

function def(
  overrides: Partial<CharacterDefinition> = {},
): CharacterDefinition {
  return { ...emptyDefinition(), name: 'Jules Deveraux', ...overrides };
}

function record(
  definition: CharacterDefinition,
  updatedAt = 1000,
): StoredDefinition {
  return { def: definition, updatedAt, history: [] };
}

/** A lookup backed by a plain map, so the decision table needs no storage. */
function lookupOf(...records: StoredDefinition[]) {
  const byId = new Map(records.map((r) => [r.def.id, r]));
  return (id: string) => byId.get(id) ?? null;
}

function open(
  snapshot: UrlSnapshot,
  pointerId: string | null,
  ...local: StoredDefinition[]
) {
  return resolveOpen({ snapshot, pointerId, lookup: lookupOf(...local) });
}

describe('pointer links', () => {
  it('loads the local character — a bookmark is never stale', () => {
    const local = record(def());

    expect(open(null, local.def.id, local)).toEqual({
      kind: 'local',
      record: local,
    });
  });

  it('offers recovery when this device does not have that character', () => {
    expect(open(null, 'ab12cd34')).toEqual({
      kind: 'missing',
      characterId: 'ab12cd34',
    });
  });
});

describe('share links', () => {
  it('adopts a character this device has never seen', () => {
    const incoming = def();

    expect(open(incoming, incoming.id)).toEqual({
      kind: 'adopt',
      def: incoming,
      notice: 'imported',
    });
  });

  it('is silent when the link matches what is already here', () => {
    const local = record(def());

    // The GM re-opening six unchanged player links should not be prompted six
    // times.
    expect(open({ ...local.def }, local.def.id, local)).toEqual({
      kind: 'local',
      record: local,
    });
  });

  it('reports a collision rather than overwriting', () => {
    const local = record(def({ name: 'Jules Deveraux' }));
    const incoming = def({ id: local.def.id, name: 'Jules D.' });

    expect(open(incoming, local.def.id, local)).toEqual({
      kind: 'collision',
      incoming,
      local,
    });
  });

  it('collides even when the link is the newer of the two', () => {
    // Direction does not decide anything — both cases ask. The timestamps are
    // there to inform the choice, not to make it.
    const local = record(def({ name: 'Mine' }), 5000);
    const incoming = def({ id: local.def.id, name: 'Theirs' });

    expect(open(incoming, local.def.id, local).kind).toBe('collision');
  });

  it("trusts the payload's id over the pointer beside it", () => {
    const local = record(def());
    const incoming = def({ id: 'different', name: 'Someone Else' });

    // The pointer is a convenience for the URL bar; the payload is the
    // character. A mismatched pair must not resolve against the wrong record.
    expect(open(incoming, local.def.id, local)).toEqual({
      kind: 'adopt',
      def: incoming,
      notice: 'imported',
    });
  });
});

describe('damaged and empty links', () => {
  it('falls back to the local character when the payload will not decode', () => {
    const local = record(def());

    expect(open('unreadable', local.def.id, local)).toEqual({
      kind: 'local',
      record: local,
    });
  });

  it('reports an unreadable link when there is nothing to fall back on', () => {
    expect(open('unreadable', null)).toEqual({ kind: 'unreadable' });
    expect(open('unreadable', 'ab12cd34')).toEqual({ kind: 'unreadable' });
  });

  it('starts a fresh character for a bare URL', () => {
    expect(open(null, null)).toEqual({ kind: 'new' });
  });
});
