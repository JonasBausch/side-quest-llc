/**
 * Character definition <-> URL. Session state never touches the URL.
 *
 * Two kinds of link exist:
 *
 * - A **pointer**, `?c=<id>`. Names a character, carries no data. This is what
 *   the URL bar holds, so bookmarking it gets you the character as it is now
 *   rather than a snapshot of it as it was. It resolves only against the
 *   definitions stored on the device that opens it, and therefore leaks
 *   nothing and means nothing to anyone else.
 * - A **share link**, `?c=<id>#2~<payload>`. Carries the whole definition, and
 *   is minted deliberately by Share. Frozen at the moment it was made.
 *
 * Two wire formats live here:
 *
 * - **v1** (legacy, no prefix): the whole definition as JSON, LZ-compressed.
 *   Every share link minted before the compact format uses it. Decoding it is
 *   kept forever — old links must not break.
 * - **v2** (current, `2~` prefix): a compact projection of the same definition.
 *   New optional keys may be added to v2 without a version bump: a decoder
 *   ignores keys it does not know, and an older link simply lacks them.
 *   Short keys, node refs indexed against a link-local training list, dice as a
 *   positional string, and book-picked traits stored as bare ids and rehydrated
 *   from the content registry on read. A full build drops from ~1130 URL chars
 *   to ~300.
 *
 * The prefix is unambiguous: lz-string's URI-safe alphabet is
 * `A-Za-z0-9+-$`, so `~` can never occur in a v1 payload.
 *
 * Compaction lives entirely in this file. `CharacterDefinition` and its Zod
 * schema are unchanged, so components, validation, and JSON import/export are
 * untouched by the wire format.
 */
import LZString from 'lz-string';
import {
  characterDefinitionSchema,
  type CharacterDefinition,
  type DieSize,
  type Frequency,
  type NodeRef,
  type StatDice,
  type TraitPick,
} from '../content/schema';
import { tropesById, strengthsById, flawsById, type Trait } from '../content';

const V2_PREFIX = '2~';

/**
 * Stat order for the packed dice string. Frozen on purpose: this is a wire
 * format, so reordering it would silently rewrite every existing v2 link.
 * Deliberately NOT derived from STAT_META, which is display order and free to
 * change.
 */
const WIRE_STATS = [
  'brains',
  'brawn',
  'charm',
  'fight',
  'flight',
  'grit',
] as const;

/** Trait slot order for the packed `r` triple. Frozen for the same reason. */
const WIRE_TRAITS = ['trope', 'strength', 'flaw'] as const;

const traitRegistries: Record<
  (typeof WIRE_TRAITS)[number],
  Map<string, Trait>
> = {
  trope: tropesById,
  strength: strengthsById,
  flaw: flawsById,
};

/* ---- v2 wire shape ------------------------------------------------------ */

/**
 * A trait slot: `0` when unset, a bare id when it resolves in the content
 * registry (rehydrated on read), or an inline object for a homebrew pick.
 */
type WireTrait =
  0 | string | { i?: string; n: string; x?: string; f?: Frequency };

interface WireV2 {
  /** rulesVersion. Always written, never defaulted — see decode. */
  v: string;
  i: string;
  n: string;
  /** startingPath. */
  p: 'w' | 'm';
  /**
   * `"<trainingIds>|<nodeRefs>"`. Index 0 of the id list is always the main
   * training, so it costs nothing to name it here. Node refs are
   * `<trainingIndex><w|m><slot>` in the order the player took them.
   */
  k: string;
  g?: string;
  u?: string;
  /** Unlocked Group Bonus ids, comma-joined. Absent when none are unlocked. */
  c?: string;
  /** Dice in WIRE_STATS order, `d` prefix stripped, e.g. `"10,6,8,,12,4"`. */
  d?: string;
  /**
   * When the sender last edited this character, epoch ms. Envelope metadata,
   * not part of the definition: it exists so the receiver can say which of two
   * disagreeing copies is older. Absent on links minted before it existed.
   */
  t?: number;
  r?: [WireTrait, WireTrait, WireTrait];
  b?: Record<string, string>;
  z?: string;
}

/* ---- trait packing ------------------------------------------------------ */

function packTrait(
  pick: TraitPick | undefined,
  registry: Map<string, Trait>,
): WireTrait {
  if (!pick) return 0;
  // A pick whose id resolves is fully reconstructible from content; storing the
  // prose again is what made links long in the first place.
  if (pick.id && registry.has(pick.id)) return pick.id;
  return {
    ...(pick.id ? { i: pick.id } : {}),
    n: pick.name,
    ...(pick.text ? { x: pick.text } : {}),
    ...(pick.frequency ? { f: pick.frequency } : {}),
  };
}

function unpackTrait(
  wire: WireTrait | undefined,
  registry: Map<string, Trait>,
): TraitPick | undefined {
  if (!wire) return undefined;
  if (typeof wire === 'string') {
    const trait = registry.get(wire);
    // An id the content no longer carries (renamed or dropped trait) keeps its
    // id rather than vanishing from the sheet — advisory, never destructive.
    return trait
      ? {
          id: trait.id,
          name: trait.name,
          text: trait.text,
          frequency: trait.frequency,
        }
      : { id: wire, name: wire };
  }
  return {
    ...(wire.i ? { id: wire.i } : {}),
    name: wire.n,
    ...(wire.x ? { text: wire.x } : {}),
    ...(wire.f ? { frequency: wire.f } : {}),
  };
}

/* ---- node ref packing --------------------------------------------------- */

function packNodes(def: CharacterDefinition): string {
  const ids = [def.mainTrainingId];
  for (const ref of def.takenNodes) {
    if (!ids.includes(ref.trainingId)) ids.push(ref.trainingId);
  }
  const refs = def.takenNodes.map(
    (ref) =>
      `${ids.indexOf(ref.trainingId)}${ref.path === 'wyrd' ? 'w' : 'm'}${ref.index}`,
  );
  return `${ids.join(',')}|${refs.join(',')}`;
}

function unpackNodes(packed: string): {
  mainTrainingId: string;
  takenNodes: NodeRef[];
} {
  const [header = '', body = ''] = packed.split('|');
  const ids = header.split(',');
  const takenNodes: NodeRef[] = [];
  for (const token of body.split(',').filter(Boolean)) {
    const match = /^(\d+)([wm])(\d+)$/.exec(token);
    if (!match) continue;
    const trainingId = ids[Number(match[1])];
    if (!trainingId) continue;
    takenNodes.push({
      trainingId,
      path: match[2] === 'w' ? 'wyrd' : 'mundane',
      index: Number(match[3]),
    });
  }
  return { mainTrainingId: ids[0] ?? '', takenNodes };
}

/* ---- dice packing ------------------------------------------------------- */

function packDice(dice: StatDice): string | undefined {
  const slots = WIRE_STATS.map((stat) => dice[stat]?.replace(/^d/, '') ?? '');
  return slots.some(Boolean) ? slots.join(',') : undefined;
}

function unpackDice(packed: string | undefined): StatDice {
  const dice: StatDice = {};
  if (!packed) return dice;
  packed.split(',').forEach((slot, i) => {
    const stat = WIRE_STATS[i];
    if (stat && slot) dice[stat] = `d${slot}` as DieSize;
  });
  return dice;
}

/* ---- v2 encode / decode ------------------------------------------------- */

function toWire(def: CharacterDefinition, updatedAt?: number): WireV2 {
  const traits = WIRE_TRAITS.map((slot) =>
    packTrait(def[slot], traitRegistries[slot]),
  ) as [WireTrait, WireTrait, WireTrait];

  return {
    v: def.rulesVersion,
    i: def.id,
    n: def.name,
    p: def.startingPath === 'wyrd' ? 'w' : 'm',
    k: packNodes(def),
    ...(def.signatureTagId ? { g: def.signatureTagId } : {}),
    ...(def.signatureTune ? { u: def.signatureTune } : {}),
    ...(def.groupBonuses?.length ? { c: def.groupBonuses.join(',') } : {}),
    ...(packDice(def.statDice) ? { d: packDice(def.statDice) } : {}),
    ...(updatedAt !== undefined ? { t: updatedAt } : {}),
    ...(traits.some((t) => t !== 0) ? { r: traits } : {}),
    ...(def.background ? { b: def.background } : {}),
    ...(def.notes ? { z: def.notes } : {}),
  };
}

function fromWire(wire: WireV2): unknown {
  const { mainTrainingId, takenNodes } = unpackNodes(wire.k ?? '');
  const traits = wire.r ?? [];

  return {
    id: wire.i,
    // rulesVersion is never defaulted to the current ruleset: a link authored
    // against an older ruleset must keep saying so, or the mismatch banner
    // silently migrates it.
    rulesVersion: wire.v,
    name: wire.n,
    mainTrainingId,
    startingPath: wire.p === 'w' ? 'wyrd' : 'mundane',
    takenNodes,
    ...(wire.g ? { signatureTagId: wire.g } : {}),
    ...(wire.u ? { signatureTune: wire.u } : {}),
    ...(wire.c ? { groupBonuses: wire.c.split(',').filter(Boolean) } : {}),
    statDice: unpackDice(wire.d),
    ...Object.fromEntries(
      WIRE_TRAITS.map((slot, i) => [
        slot,
        unpackTrait(traits[i], traitRegistries[slot]),
      ]).filter(([, pick]) => pick !== undefined),
    ),
    ...(wire.b ? { background: wire.b } : {}),
    ...(wire.z ? { notes: wire.z } : {}),
  };
}

/* ---- public API --------------------------------------------------------- */

/** The contents of a share link: a definition plus when the sender last edited it. */
export interface SharePayload {
  def: CharacterDefinition;
  updatedAt?: number;
}

/** A share payload found in the URL, or `'unreadable'` when one arrived damaged. */
export type UrlShare = SharePayload | 'unreadable' | null;

export function encodeDefinition(
  def: CharacterDefinition,
  updatedAt?: number,
): string {
  return (
    V2_PREFIX +
    LZString.compressToEncodedURIComponent(
      JSON.stringify(toWire(def, updatedAt)),
    )
  );
}

export function decodeShare(encoded: string): SharePayload | null {
  try {
    const isV2 = encoded.startsWith(V2_PREFIX);
    const json = LZString.decompressFromEncodedURIComponent(
      isV2 ? encoded.slice(V2_PREFIX.length) : encoded,
    );
    if (!json) return null;
    const raw: unknown = JSON.parse(json);
    const wire = raw as WireV2;
    const candidate = isV2 ? fromWire(wire) : raw;
    const parsed = characterDefinitionSchema.safeParse(candidate);
    if (!parsed.success) return null;
    return {
      def: parsed.data,
      ...(isV2 && typeof wire.t === 'number' ? { updatedAt: wire.t } : {}),
    };
  } catch {
    return null;
  }
}

export function decodeDefinition(encoded: string): CharacterDefinition | null {
  return decodeShare(encoded)?.def ?? null;
}

/* ---- the URL ------------------------------------------------------------ */

/** The character id a pointer link names, if the URL carries one. */
export function readPointer(): string | null {
  return new URLSearchParams(window.location.search).get('c');
}

/**
 * The share payload in the fragment. A fragment that will not decode reports
 * itself as `'unreadable'` rather than as absent: a truncated link is worth
 * saying so about, where a bare URL is not.
 */
export function readShare(): UrlShare {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return null;
  return decodeShare(hash) ?? 'unreadable';
}

/**
 * Point the URL bar at `def` without adding history entries or firing a
 * hashchange we would have to ignore.
 *
 * Normally that means a bare pointer — the definition itself lives on the
 * device. When it could not be stored (private window, storage full), the full
 * payload stays in the URL instead: a pointer would resolve to nothing on the
 * next reload, which is the one outcome worse than a long link.
 */
export function writeUrl(
  def: CharacterDefinition,
  { persisted, updatedAt }: { persisted: boolean; updatedAt?: number },
): void {
  const pointer = `${window.location.pathname}?c=${encodeURIComponent(def.id)}`;
  const url = persisted
    ? pointer
    : `${pointer}#${encodeDefinition(def, updatedAt)}`;
  window.history.replaceState(null, '', url);
}

/** A full shareable URL: the pointer, plus the definition frozen into the fragment. */
export function shareUrl(def: CharacterDefinition, updatedAt?: number): string {
  return `${window.location.origin}${window.location.pathname}?c=${encodeURIComponent(def.id)}#${encodeDefinition(def, updatedAt)}`;
}
