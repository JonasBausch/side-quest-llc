import { describe, it, expect, beforeEach } from 'vitest';
import {
  encodeDefinition,
  decodeShare,
  readPointer,
  readShare,
  writeUrl,
  shareUrl,
} from './serialize';
import { emptyDefinition } from './character';
import type { CharacterDefinition } from '../content/schema';

/**
 * The pointer/share split, exercised against a stubbed location. The suite runs
 * in the node environment (see vite.config.ts), and these four properties plus
 * replaceState are the entire surface these functions touch — enough to check
 * the shapes without pulling in a DOM.
 */
const BASE = 'https://jonasbausch.github.io';
const PATH = '/side-quest-llc/';

function visit(url: string): void {
  const parsed = new URL(url);
  globalThis.window = {
    location: {
      origin: parsed.origin,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
    },
    history: {
      replaceState: (_state: unknown, _title: string, next: string) => {
        const resolved = new URL(next, parsed.origin);
        window.location.pathname = resolved.pathname;
        window.location.search = resolved.search;
        window.location.hash = resolved.hash;
      },
    },
  } as unknown as Window & typeof globalThis;
}

const currentUrl = () =>
  `${window.location.pathname}${window.location.search}${window.location.hash}`;

const def = (): CharacterDefinition => ({
  ...emptyDefinition(),
  id: 'ab12cd34',
  name: 'Jules Deveraux',
});

beforeEach(() => visit(`${BASE}${PATH}`));

describe('readPointer', () => {
  it('reads the character id a pointer link names', () => {
    visit(`${BASE}${PATH}?c=ab12cd34`);
    expect(readPointer()).toBe('ab12cd34');
  });

  it('is null on a bare URL', () => {
    expect(readPointer()).toBeNull();
  });
});

describe('readShare', () => {
  it('is null when the URL carries no payload', () => {
    visit(`${BASE}${PATH}?c=ab12cd34`);
    expect(readShare()).toBeNull();
  });

  it('decodes a share link', () => {
    const character = def();
    visit(`${BASE}${PATH}?c=ab12cd34#${encodeDefinition(character, 1000)}`);

    const share = readShare();
    expect(share).not.toBe('unreadable');
    expect(share && share !== 'unreadable' && share.def).toEqual(character);
    expect(share && share !== 'unreadable' && share.updatedAt).toBe(1000);
  });

  it('reports a truncated payload rather than pretending there was none', () => {
    // Chat apps and shorteners cut long links; the difference between "no link"
    // and "a link that arrived broken" is worth telling the player about.
    const cut = encodeDefinition(def()).slice(0, 20);
    visit(`${BASE}${PATH}?c=ab12cd34#${cut}`);
    expect(readShare()).toBe('unreadable');
  });
});

describe('writeUrl', () => {
  it('leaves a bare pointer when the definition is stored on the device', () => {
    writeUrl(def(), { persisted: true, updatedAt: 1000 });
    expect(currentUrl()).toBe(`${PATH}?c=ab12cd34`);
  });

  it('drops a share payload from the URL bar once it is stored', () => {
    visit(`${BASE}${PATH}?c=ab12cd34#${encodeDefinition(def(), 1000)}`);
    writeUrl(def(), { persisted: true, updatedAt: 1000 });
    // The bookmark someone takes from here has to be the pointer, or we are
    // back to bookmarking snapshots.
    expect(window.location.hash).toBe('');
  });

  it('keeps the full payload when the device cannot store it', () => {
    writeUrl(def(), { persisted: false, updatedAt: 1000 });

    expect(window.location.search).toBe('?c=ab12cd34');
    const share = readShare();
    expect(share && share !== 'unreadable' && share.def).toEqual(def());
  });
});

describe('shareUrl', () => {
  it('carries the whole character, plus the pointer for the receiver', () => {
    const link = shareUrl(def(), 1000);
    const parsed = new URL(link);

    expect(parsed.origin + parsed.pathname).toBe(`${BASE}${PATH}`);
    expect(parsed.searchParams.get('c')).toBe('ab12cd34');
    const share = decodeShare(parsed.hash.slice(1));
    expect(share?.def).toEqual(def());
    expect(share?.updatedAt).toBe(1000);
  });
});

describe('links minted before the pointer existed', () => {
  it('reads as a share link, so opening one upgrades it in place', () => {
    // Old bookmarks are a bare fragment with no `?c=`. They resolve through the
    // same path as a share link, which means the first time someone opens one
    // it gets stored and the URL becomes a pointer.
    visit(`${BASE}${PATH}#${encodeDefinition(def())}`);

    expect(readPointer()).toBeNull();
    const share = readShare();
    expect(share && share !== 'unreadable' && share.def).toEqual(def());

    writeUrl(def(), { persisted: true });
    expect(currentUrl()).toBe(`${PATH}?c=ab12cd34`);
  });
});
