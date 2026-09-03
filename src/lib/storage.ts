/**
 * Session state persistence. Lives in localStorage, keyed by character id, and
 * is never shared. Kept strictly separate from the character definition: a
 * session reset must not touch the definition, and loading a share link must
 * not clobber live state.
 */
import {
  sessionStateSchema,
  type CharacterDefinition,
  type SessionState,
} from '../content/schema';
import { usableAbilities } from './character';

const keyFor = (characterId: string) => `sidequest:session:${characterId}`;

export function emptySession(characterId: string): SessionState {
  return {
    characterId,
    momentum: 0,
    wyrd: 0,
    exposure: 0,
    conditions: [],
    spentUses: [],
  };
}

export function loadSession(characterId: string): SessionState | null {
  try {
    const raw = localStorage.getItem(keyFor(characterId));
    if (!raw) return null;
    const parsed = sessionStateSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveSession(state: SessionState): void {
  try {
    localStorage.setItem(keyFor(state.characterId), JSON.stringify(state));
  } catch {
    /* storage full or unavailable — live state is best-effort */
  }
}

/**
 * "New scene": clear per-scene spent uses and zero Wyrd. Conditions, Momentum,
 * Exposure, and per-job/counter uses persist across a scene.
 */
export function newScene(
  def: CharacterDefinition,
  state: SessionState,
): SessionState {
  const perSceneKeys = new Set(
    usableAbilities(def)
      .filter((a) => a.frequency === 'perScene')
      .map((a) => a.key),
  );
  return {
    ...state,
    wyrd: 0,
    spentUses: state.spentUses.filter((k) => !perSceneKeys.has(k)),
  };
}

/**
 * "New job": clear the scene and the job — Wyrd, Exposure, conditions, and
 * every spent use.
 *
 * Momentum is the one exception: it carries between jobs (GM ruling, v5.0
 * leaves it unwritten). Zeroing it would make the expensive Group Bonuses
 * unbuyable, since Legacy or Contact costs 5 per player against a cap of 10.
 */
export function newJob(state: SessionState): SessionState {
  return { ...emptySession(state.characterId), momentum: state.momentum };
}
