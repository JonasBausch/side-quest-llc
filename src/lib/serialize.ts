/**
 * Character definition <-> URL fragment. The definition is JSON, LZ-compressed
 * into the hash so a character is a shareable link. `rulesVersion` travels
 * inside the payload as the version field. Session state never touches the URL.
 */
import LZString from 'lz-string';
import {
  characterDefinitionSchema,
  type CharacterDefinition,
} from '../content/schema';

export function encodeDefinition(def: CharacterDefinition): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(def));
}

export function decodeDefinition(encoded: string): CharacterDefinition | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = characterDefinitionSchema.safeParse(JSON.parse(json));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function readHash(): CharacterDefinition | null {
  const hash = window.location.hash.replace(/^#/, '');
  return hash ? decodeDefinition(hash) : null;
}

/**
 * Write the definition into the hash without adding history entries or firing a
 * hashchange we'd have to ignore.
 */
export function writeHash(def: CharacterDefinition): void {
  const encoded = encodeDefinition(def);
  const url = `${window.location.pathname}${window.location.search}#${encoded}`;
  window.history.replaceState(null, '', url);
}

/** A full shareable URL for the current definition. */
export function shareUrl(def: CharacterDefinition): string {
  return `${window.location.origin}${window.location.pathname}#${encodeDefinition(def)}`;
}
