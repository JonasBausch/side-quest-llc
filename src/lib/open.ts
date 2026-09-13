/**
 * What to do with the URL someone just opened.
 *
 * Two kinds of link exist. A **pointer** (`?c=<id>`) names a character but
 * carries no data; it is what the URL bar holds, so a bookmark of it always
 * opens the current character rather than a frozen copy of an old one. A
 * **share link** (`?c=<id>#2~<payload>`) carries the whole definition, and is
 * minted deliberately by the Share button.
 *
 * Resolution is a pure function over the URL and a lookup, so the whole
 * decision table is testable without a DOM. Nothing here writes: it returns
 * what should happen and the caller does it.
 *
 * The governing rule is that opening a link never destroys work. A share link
 * whose character already exists here and differs from it does not overwrite —
 * it reports a collision and lets the player choose.
 */
import type { CharacterDefinition } from '../content/schema';
import type { StoredDefinition } from './definitions';
import { sameDefinition } from './definitions';

/**
 * The share payload found in the URL: a decoded definition, `'unreadable'` when
 * the URL carried a payload that would not decode (truncated in a chat app,
 * mangled by a link shortener), or `null` when it carried none.
 */
export type UrlSnapshot = CharacterDefinition | 'unreadable' | null;

export interface OpenInput {
  snapshot: UrlSnapshot;
  pointerId: string | null;
  lookup: (characterId: string) => StoredDefinition | null;
}

export type OpenDecision =
  /** No link to speak of — start a fresh character. */
  | { kind: 'new' }
  /** Load what is already on this device. The ordinary bookmark case. */
  | { kind: 'local'; record: StoredDefinition }
  /** A share link for a character this device does not have: take it. */
  | { kind: 'adopt'; def: CharacterDefinition; notice: 'imported' }
  /** A share link that disagrees with the local copy. Ask; write nothing yet. */
  | {
      kind: 'collision';
      incoming: CharacterDefinition;
      local: StoredDefinition;
    }
  /** A pointer to a character this device does not have. Offer recovery. */
  | { kind: 'missing'; characterId: string }
  /** A share link arrived damaged and there is no local copy to fall back on. */
  | { kind: 'unreadable' };

export function resolveOpen({
  snapshot,
  pointerId,
  lookup,
}: OpenInput): OpenDecision {
  if (snapshot && snapshot !== 'unreadable') {
    // The payload's own id wins over the pointer: the pointer is a convenience
    // for the URL bar, the payload is the character.
    const local = lookup(snapshot.id);
    if (!local) return { kind: 'adopt', def: snapshot, notice: 'imported' };
    // Re-opening an unchanged link is not an event. The GM reloading six player
    // links every session should be prompted only when something actually
    // differs.
    if (sameDefinition(local.def, snapshot))
      return { kind: 'local', record: local };
    return { kind: 'collision', incoming: snapshot, local };
  }

  const local = pointerId ? lookup(pointerId) : null;
  // A damaged payload is not worth a modal when the pointer beside it resolves:
  // the player gets their character, which is the thing they wanted.
  if (local) return { kind: 'local', record: local };
  if (snapshot === 'unreadable') return { kind: 'unreadable' };
  if (pointerId) return { kind: 'missing', characterId: pointerId };
  return { kind: 'new' };
}
