import { describe, it, expect } from 'vitest';
import { newScene, newJob, emptySession } from './storage';
import { emptyDefinition, usableAbilities, toggleGroupBonus } from './character';
import type { CharacterDefinition, SessionState } from '../content/schema';

/**
 * Reset semantics from CLAUDE.md: "New scene" clears per-scene uses and zeroes
 * Wyrd; "New job" clears everything including Exposure. And the two data
 * lifecycles stay disjoint — a reset must never touch the definition.
 *
 * Keys are derived from usableAbilities() rather than hard-coded so the test
 * stays generic over content (Field Tinkerer's specialty is perJob and its
 * first mundane node is perScene, giving us one key of each cadence).
 */
function fixture(): {
  def: CharacterDefinition;
  perSceneKey: string;
  perJobKey: string;
} {
  const def: CharacterDefinition = {
    ...emptyDefinition(),
    mainTrainingId: 'field-tinkerer',
    takenNodes: [{ trainingId: 'field-tinkerer', path: 'mundane', index: 1 }],
  };
  const abilities = usableAbilities(def);
  const perSceneKey = abilities.find((a) => a.frequency === 'perScene')!.key;
  const perJobKey = abilities.find((a) => a.frequency === 'perJob')!.key;
  return { def, perSceneKey, perJobKey };
}

function seededSession(
  characterId: string,
  perSceneKey: string,
  perJobKey: string,
): SessionState {
  return {
    characterId,
    momentum: 3,
    wyrd: 5,
    exposure: 2,
    conditions: [{ id: 'shaken' }],
    spentUses: [perSceneKey, perJobKey],
  };
}

describe('newScene', () => {
  it('zeroes Wyrd and clears only per-scene uses; keeps everything else', () => {
    const { def, perSceneKey, perJobKey } = fixture();
    const state = seededSession(def.id, perSceneKey, perJobKey);

    const next = newScene(def, state);

    expect(next.wyrd).toBe(0);
    expect(next.spentUses).not.toContain(perSceneKey);
    expect(next.spentUses).toContain(perJobKey);
    // Momentum, Exposure and conditions persist across a scene.
    expect(next.momentum).toBe(state.momentum);
    expect(next.exposure).toBe(state.exposure);
    expect(next.conditions).toEqual(state.conditions);
  });

  it('does not mutate the definition or the input state', () => {
    const { def, perSceneKey, perJobKey } = fixture();
    const state = seededSession(def.id, perSceneKey, perJobKey);
    const defBefore = structuredClone(def);
    const stateBefore = structuredClone(state);

    const next = newScene(def, state);

    expect(def).toEqual(defBefore);
    expect(state).toEqual(stateBefore);
    expect(next).not.toBe(state);
  });
});

describe('newJob', () => {
  it('clears everything including Exposure, preserving the character id', () => {
    const { def, perSceneKey, perJobKey } = fixture();
    const state = seededSession(def.id, perSceneKey, perJobKey);

    const next = newJob(state);

    expect(next).toEqual(emptySession(state.characterId));
    expect(next.characterId).toBe(state.characterId);
    expect(next.exposure).toBe(0);
    expect(next).not.toBe(state);
  });
});

describe('group bonuses across resets', () => {
  /**
   * The whole point of storing unlocks in the definition: a crew upgrade is
   * bought once and kept, while its once-per-job use is spent and refreshed.
   */
  it('survives New job, while its per-job use is cleared', () => {
    const def = toggleGroupBonus(
      { ...emptyDefinition(), mainTrainingId: 'field-tinkerer' },
      'team-protocol-1',
    );
    const key = usableAbilities(def).find((a) =>
      a.key === 'group:team-protocol-1',
    )!.key;

    const spent: SessionState = {
      ...emptySession(def.id),
      spentUses: [key],
    };

    expect(newJob(spent).spentUses).toEqual([]);
    expect(def.groupBonuses).toEqual(['team-protocol-1']);
  });

  it('a per-job crew use is not cleared by New scene', () => {
    const def = toggleGroupBonus(
      { ...emptyDefinition(), mainTrainingId: 'field-tinkerer' },
      'team-protocol-1',
    );
    const spent: SessionState = {
      ...emptySession(def.id),
      spentUses: ['group:team-protocol-1'],
    };
    expect(newScene(def, spent).spentUses).toEqual(['group:team-protocol-1']);
  });

  it('a passive level takes no use slot', () => {
    const def = toggleGroupBonus(emptyDefinition(), 'legacy-or-contact');
    expect(
      usableAbilities(def).some((a) => a.key === 'group:legacy-or-contact'),
    ).toBe(false);
  });
});
