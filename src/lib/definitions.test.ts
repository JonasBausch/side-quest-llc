import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadDefinition,
  saveDefinition,
  deleteDefinition,
  listDefinitions,
  sameDefinition,
  isBlankDraft,
  withDefinition,
  type StoredDefinition,
} from './definitions';
import { emptySession, saveSession, loadSession, newJob } from './storage';
import { emptyDefinition } from './character';
import type { CharacterDefinition } from '../content/schema';

/**
 * The suite runs in the node environment (see vite.config.ts), so localStorage
 * is stubbed here rather than pulling in a DOM. It is a Map with the three
 * methods this module uses plus the index access listDefinitions() needs.
 */
function installStorage(): Map<string, string> {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  } as Storage;
  return store;
}

/** A definition that passes the rules schema, i.e. has a name. */
function named(name: string): CharacterDefinition {
  return { ...emptyDefinition(), name };
}

let store: Map<string, string>;
beforeEach(() => {
  store = installStorage();
});

describe('saveDefinition / loadDefinition', () => {
  it('round-trips a definition', () => {
    const def = named('Jules Deveraux');
    saveDefinition(def, 1000);

    expect(loadDefinition(def.id)?.def).toEqual(def);
    expect(loadDefinition(def.id)?.updatedAt).toBe(1000);
  });

  it('stores a character that has no name yet', () => {
    // The rules schema requires a non-empty name, but a build exists before
    // anyone types one — dropping it on reload would lose real work.
    const draft = emptyDefinition();
    expect(draft.name).toBe('');

    saveDefinition(draft, 1000);

    expect(loadDefinition(draft.id)?.def.name).toBe('');
  });

  it('returns null for an unknown id and for corrupt data', () => {
    expect(loadDefinition('nope')).toBeNull();

    store.set('sidequest:def:junk', '{not json');
    expect(loadDefinition('junk')).toBeNull();
  });

  it('reports failure when storage is unavailable', () => {
    globalThis.localStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    } as unknown as Storage;

    // The caller has to know: a device that cannot persist must keep the full
    // definition in the URL rather than hand out a pointer that resolves to
    // nothing.
    expect(saveDefinition(named('Jules'))).toBeNull();
  });
});

describe('revision ring', () => {
  it('keeps the superseded revision when the definition changes', () => {
    const def = named('Jules');
    saveDefinition(def, 1000);
    saveDefinition({ ...def, name: 'Jules Deveraux' }, 2000);

    const record = loadDefinition(def.id)!;
    expect(record.def.name).toBe('Jules Deveraux');
    expect(record.history).toHaveLength(1);
    expect(record.history[0]).toEqual({ def, updatedAt: 1000 });
  });

  it('does not churn on an unchanged write', () => {
    const def = named('Jules');
    saveDefinition(def, 1000);
    saveDefinition(def, 2000);

    const record = loadDefinition(def.id)!;
    // Re-saving identical data must not bump updatedAt: that timestamp is what
    // a collision prompt compares, so a no-op write would make it lie.
    expect(record.updatedAt).toBe(1000);
    expect(record.history).toEqual([]);
  });

  it('caps history at ten revisions, newest first', () => {
    const def = named('rev0');
    saveDefinition(def, 0);
    for (let i = 1; i <= 14; i += 1) {
      saveDefinition({ ...def, name: `rev${i}` }, i * 1000);
    }

    const record = loadDefinition(def.id)!;
    expect(record.def.name).toBe('rev14');
    expect(record.history).toHaveLength(10);
    expect(record.history.map((r) => r.def.name)).toEqual([
      'rev13',
      'rev12',
      'rev11',
      'rev10',
      'rev9',
      'rev8',
      'rev7',
      'rev6',
      'rev5',
      'rev4',
    ]);
  });

  it('withDefinition returns the same record object when nothing changed', () => {
    const previous: StoredDefinition = {
      def: named('Jules'),
      updatedAt: 1000,
      history: [],
    };
    expect(withDefinition(previous, { ...previous.def }, 2000)).toBe(previous);
  });
});

describe('isBlankDraft', () => {
  it('is true for an untouched character, whatever id it was given', () => {
    expect(isBlankDraft(emptyDefinition())).toBe(true);
  });

  it('is false once anything has been chosen', () => {
    const draft = emptyDefinition();
    expect(isBlankDraft({ ...draft, name: 'Jules' })).toBe(false);
    expect(isBlankDraft({ ...draft, startingPath: 'wyrd' })).toBe(false);
    expect(isBlankDraft({ ...draft, statDice: { grit: 'd8' } })).toBe(false);
  });
});

describe('sameDefinition', () => {
  it('ignores key order', () => {
    const def = named('Jules');
    const reordered = JSON.parse(
      JSON.stringify({
        statDice: def.statDice,
        name: def.name,
        takenNodes: def.takenNodes,
        startingPath: def.startingPath,
        mainTrainingId: def.mainTrainingId,
        rulesVersion: def.rulesVersion,
        id: def.id,
      }),
    ) as CharacterDefinition;

    expect(sameDefinition(def, reordered)).toBe(true);
  });

  it('respects takenNodes order, which is the order they were taken', () => {
    const def: CharacterDefinition = {
      ...named('Jules'),
      takenNodes: [
        { trainingId: 'field-tinkerer', path: 'mundane', index: 1 },
        { trainingId: 'field-tinkerer', path: 'wyrd', index: 1 },
      ],
    };
    const swapped: CharacterDefinition = {
      ...def,
      takenNodes: [...def.takenNodes].reverse(),
    };

    expect(sameDefinition(def, swapped)).toBe(false);
  });

  it('sees a changed die', () => {
    const def = named('Jules');
    expect(
      sameDefinition(def, {
        ...def,
        statDice: { ...def.statDice, grit: 'd8' },
      }),
    ).toBe(false);
  });
});

describe('listDefinitions', () => {
  it('returns every character, most recently edited first', () => {
    const a = named('Older');
    const b = named('Newer');
    saveDefinition(a, 1000);
    saveDefinition(b, 3000);

    expect(listDefinitions().map((r) => r.def.name)).toEqual([
      'Newer',
      'Older',
    ]);
  });

  it('ignores keys from other namespaces', () => {
    saveDefinition(named('Jules'), 1000);
    saveSession(emptySession('some-other-id'));
    store.set('unrelated:key', 'whatever');

    expect(listDefinitions()).toHaveLength(1);
  });
});

describe('the two lifecycles stay disjoint', () => {
  it('deleting a definition leaves session state alone, and vice versa', () => {
    const def = named('Jules');
    saveDefinition(def, 1000);
    saveSession({ ...emptySession(def.id), momentum: 4 });

    deleteDefinition(def.id);
    // Session state is keyed by the same id but lives in its own namespace.
    expect(loadSession(def.id)?.momentum).toBe(4);
    expect(loadDefinition(def.id)).toBeNull();
  });

  it('a session reset writes nothing into the definition namespace', () => {
    const def = named('Jules');
    saveDefinition(def, 1000);
    const before = store.get(`sidequest:def:${def.id}`);

    saveSession(newJob({ ...emptySession(def.id), momentum: 4, wyrd: 6 }));

    expect(store.get(`sidequest:def:${def.id}`)).toBe(before);
  });

  it('saving a definition writes nothing into the session namespace', () => {
    const def = named('Jules');
    saveSession({ ...emptySession(def.id), momentum: 4 });
    const before = store.get(`sidequest:session:${def.id}`);

    saveDefinition({ ...def, name: 'Renamed' }, 2000);

    expect(store.get(`sidequest:session:${def.id}`)).toBe(before);
  });
});
