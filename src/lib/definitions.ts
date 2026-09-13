/**
 * Character-definition persistence. Lives in localStorage under its own key
 * namespace, keyed by character id.
 *
 * This is the definition half of the two lifecycles, and it is kept strictly
 * disjoint from session state: separate module, separate key prefix, and no
 * function here reads or writes a `sidequest:session:*` key (nor the reverse —
 * see `storage.ts`). The two happen to share a medium; they share nothing else.
 *
 * The stored record is an envelope, `{ def, updatedAt, history }`. Only `def`
 * is the character; `updatedAt` exists so an incoming share link can say
 * whether it is older or newer than the copy already on this device, and
 * `history` is a small ring of superseded revisions so no write is
 * unrecoverable. That metadata deliberately does not live inside
 * `CharacterDefinition` — it is about the record, not about the character, and
 * keeping it out leaves the rules schema, the wire format, and JSON export
 * untouched.
 */
import { z } from 'zod';
import {
  characterDefinitionSchema,
  type CharacterDefinition,
} from '../content/schema';
import { emptyDefinition } from './character';

const KEY_PREFIX = 'sidequest:def:';
const keyFor = (characterId: string) => `${KEY_PREFIX}${characterId}`;

/** Superseded revisions kept per character. Small: this is an undo net, not a log. */
const HISTORY_LIMIT = 10;

/**
 * Edits closer together than this fold into a single revision.
 *
 * Every keystroke in the name field is a change, so without coalescing a
 * fourteen-letter name burns the whole ring and the ten revisions on offer
 * cover the last ten keystrokes — precisely the moments nobody needs back. A
 * burst keeps the state from before it started and discards the letters in
 * between, which is what "undo" means here.
 */
const COALESCE_MS = 60_000;

/**
 * Definitions are read back with `name` loosened to any string. The rules
 * schema requires a non-empty name, but a character is storable from the moment
 * it exists — a player who picks a training before typing a name must not have
 * the build dropped on reload because the store refused to parse it. Validation
 * is advisory, never blocking; the Builder is where an empty name gets flagged.
 */
const storableDefinitionSchema = characterDefinitionSchema.extend({
  name: z.string(),
});

const revisionSchema = z.object({
  def: storableDefinitionSchema,
  updatedAt: z.number(),
});

export const storedDefinitionSchema = revisionSchema.extend({
  /** Superseded revisions, newest first. */
  history: z.array(revisionSchema).default([]),
});
export type StoredDefinition = z.infer<typeof storedDefinitionSchema>;

/* ---- stable comparison -------------------------------------------------- */

/**
 * Key-order-independent serialization, used only to answer "is this the same
 * character?". `JSON.stringify` will not do: a definition built up in the
 * Builder and the same definition round-tripped through the wire format carry
 * identical data in different key order. Array order is preserved — in
 * `takenNodes` it is the order the player took them, which is real data.
 */
function stableString(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableString).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableString(v)}`).join(',')}}`;
  }
  return JSON.stringify(value) ?? 'null';
}

export function sameDefinition(
  a: CharacterDefinition,
  b: CharacterDefinition,
): boolean {
  return stableString(a) === stableString(b);
}

/**
 * A character nobody has touched yet — what opening the bare app URL hands you.
 * Storing one would mean every visit to the front page leaves a blank record
 * behind, so these are held in memory until they become somebody's character.
 * The id is ignored: it is minted fresh on arrival and says nothing about
 * whether the sheet has been worked on.
 */
export function isBlankDraft(def: CharacterDefinition): boolean {
  return sameDefinition(def, { ...emptyDefinition(), id: def.id });
}

/* ---- pure record transitions -------------------------------------------- */

/**
 * The record that results from storing `def` over `previous`. Pure, so the ring
 * semantics are testable without touching storage.
 *
 * An unchanged definition returns the previous record untouched: re-opening a
 * share link that matches what is already here must not churn `updatedAt` or
 * push a revision that differs from its successor in nothing.
 *
 * `checkpoint` forces a revision that coalescing would otherwise swallow. It
 * marks a wholesale replacement — taking a link's version over your own — where
 * the state being superseded is the one thing worth keeping, however recently
 * it was touched.
 */
export function withDefinition(
  previous: StoredDefinition | null,
  def: CharacterDefinition,
  now: number,
  { checkpoint = false }: { checkpoint?: boolean } = {},
): StoredDefinition {
  if (previous && sameDefinition(previous.def, def)) return previous;
  if (!previous) return { def, updatedAt: now, history: [] };

  const midBurst = !checkpoint && now - previous.updatedAt < COALESCE_MS;
  const history = midBurst
    ? previous.history
    : [
        { def: previous.def, updatedAt: previous.updatedAt },
        ...previous.history,
      ];
  return { def, updatedAt: now, history: history.slice(0, HISTORY_LIMIT) };
}

/* ---- storage ------------------------------------------------------------ */

export function loadDefinition(characterId: string): StoredDefinition | null {
  try {
    const raw = localStorage.getItem(keyFor(characterId));
    if (!raw) return null;
    const parsed = storedDefinitionSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export interface SaveOptions {
  /** Overridable for tests; production always means "now". */
  now?: number;
  /** Force a revision even mid-burst. See `withDefinition`. */
  checkpoint?: boolean;
}

/**
 * Persist `def`, folding the superseded revision into the ring. Returns the
 * record now on disk, or `null` when storage is unavailable — the caller needs
 * to know, because a device that cannot persist must keep the full definition
 * in the URL instead of handing out a pointer link that resolves to nothing.
 */
export function saveDefinition(
  def: CharacterDefinition,
  { now = Date.now(), checkpoint = false }: SaveOptions = {},
): StoredDefinition | null {
  try {
    const next = withDefinition(loadDefinition(def.id), def, now, {
      checkpoint,
    });
    localStorage.setItem(keyFor(def.id), JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function deleteDefinition(characterId: string): void {
  try {
    localStorage.removeItem(keyFor(characterId));
  } catch {
    /* nothing to do — the record is either gone or unreachable */
  }
}

/** Every character on this device, most recently edited first. */
export function listDefinitions(): StoredDefinition[] {
  const records: StoredDefinition[] = [];
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key?.startsWith(KEY_PREFIX)) continue;
      const record = loadDefinition(key.slice(KEY_PREFIX.length));
      if (record) records.push(record);
    }
  } catch {
    return [];
  }
  return records.sort((a, b) => b.updatedAt - a.updatedAt);
}
