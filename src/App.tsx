import { useEffect, useMemo, useState } from 'react';
import {
  CURRENT_RULES_VERSION,
  type CharacterDefinition,
  type SessionState,
} from './content/schema';
import { emptyDefinition } from './lib/character';
import { readPointer, readShare, writeUrl, shareUrl } from './lib/serialize';
import {
  isBlankDraft,
  loadDefinition,
  saveDefinition,
  type StoredDefinition,
} from './lib/definitions';
import { resolveOpen } from './lib/open';
import { emptySession, loadSession, saveSession } from './lib/storage';
import { Builder } from './components/Builder';
import { Tracker } from './components/Tracker';
import { Recovery } from './components/Recovery';
import { WyrdWhimsy } from './components/WyrdWhimsy';

type Screen = 'build' | 'track';

/** A dismissible note about how the character now on screen got here. */
type Notice =
  | { kind: 'imported' }
  /**
   * A share link disagreed with the copy already on this device. The local copy
   * is what loaded — opening a link never overwrites — and this asks which one
   * the player actually wants.
   */
  | {
      kind: 'collision';
      incoming: CharacterDefinition;
      incomingUpdatedAt?: number;
      localUpdatedAt: number;
    };

type Recovering = {
  reason: 'missing' | 'unreadable';
  characterId: string | null;
};

interface InitialOpen {
  def: CharacterDefinition;
  recovering: Recovering | null;
  notice: Notice | null;
}

/**
 * Turn the URL into a starting state. Runs once, on mount; the decision itself
 * lives in `resolveOpen` so it can be tested without a DOM.
 */
function initialOpen(): InitialOpen {
  const share = readShare();
  const snapshot = share === 'unreadable' ? 'unreadable' : (share?.def ?? null);
  const decision = resolveOpen({
    snapshot,
    pointerId: readPointer(),
    lookup: loadDefinition,
  });

  switch (decision.kind) {
    case 'local':
      return { def: decision.record.def, recovering: null, notice: null };
    case 'adopt':
      return {
        def: decision.def,
        recovering: null,
        notice: { kind: 'imported' },
      };
    case 'collision':
      return {
        def: decision.local.def,
        recovering: null,
        notice: {
          kind: 'collision',
          incoming: decision.incoming,
          ...(share && share !== 'unreadable' && share.updatedAt !== undefined
            ? { incomingUpdatedAt: share.updatedAt }
            : {}),
          localUpdatedAt: decision.local.updatedAt,
        },
      };
    case 'missing':
      return {
        def: emptyDefinition(),
        recovering: { reason: 'missing', characterId: decision.characterId },
        notice: null,
      };
    case 'unreadable':
      return {
        def: emptyDefinition(),
        recovering: { reason: 'unreadable', characterId: null },
        notice: null,
      };
    case 'new':
      return { def: emptyDefinition(), recovering: null, notice: null };
  }
}

function wyrdTier(wyrd: number): string {
  if (wyrd >= 6) return 'surge';
  if (wyrd >= 4) return 'hazard';
  if (wyrd >= 2) return 'distortion';
  return 'calm';
}

const when = (epochMs: number | undefined): string =>
  epochMs === undefined
    ? 'an unknown date'
    : new Date(epochMs).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

export function App() {
  const [initial] = useState(initialOpen);
  const [def, setDef] = useState<CharacterDefinition>(initial.def);
  const [recovering, setRecovering] = useState<Recovering | null>(
    initial.recovering,
  );
  const [notice, setNotice] = useState<Notice | null>(initial.notice);
  const [session, setSession] = useState<SessionState>(
    () => loadSession(initial.def.id) ?? emptySession(initial.def.id),
  );
  const [stored, setStored] = useState<StoredDefinition | 'unavailable' | null>(
    null,
  );
  const [screen, setScreen] = useState<Screen>('build');
  const [copied, setCopied] = useState(false);

  // While a collision is unanswered the share payload stays in the URL, so a
  // reload does not throw away the version the player has not yet chosen.
  const undecided = notice?.kind === 'collision';

  // An untouched character is nobody's yet: storing it would litter a record
  // behind every visit to the bare app URL, and pointing the URL bar at a
  // character that was never stored would send the next reload to Recovery.
  const blank = useMemo(() => isBlankDraft(def), [def]);

  // The definition lives on the device; the URL only points at it.
  useEffect(() => {
    if (recovering || blank) return;
    const record = saveDefinition(def);
    setStored(record ?? 'unavailable');
    if (!undecided) {
      writeUrl(def, {
        persisted: record !== null,
        updatedAt: record?.updatedAt,
      });
    }
  }, [def, recovering, blank, undecided]);

  // Session state is keyed by character id, so swapping characters — importing
  // one, or taking a link's version — has to pick up that character's state.
  useEffect(() => {
    setSession(loadSession(def.id) ?? emptySession(def.id));
  }, [def.id]);

  // Persist live session state, keyed by character id.
  useEffect(() => {
    saveSession(session);
  }, [session]);

  // Reflect the character name in the browser tab title.
  useEffect(() => {
    const name = def.name.trim() || 'Unnamed Agent';
    document.title = `SideQuest LLC — ${name} Character Sheet`;
  }, [def.name]);

  const versionMismatch = def.rulesVersion !== CURRENT_RULES_VERSION;
  const tier = useMemo(() => wyrdTier(session.wyrd), [session.wyrd]);

  async function copyShare() {
    const link = shareUrl(
      def,
      stored && stored !== 'unavailable' ? stored.updatedAt : undefined,
    );
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the share link is still reachable from the URL bar */
    }
  }

  if (recovering) {
    return (
      <div className="app wyrd-calm">
        <header className="topbar">
          <div className="brand">
            <span className="brand-mark">SideQuest LLC / Field Record</span>
          </div>
        </header>
        <Recovery
          reason={recovering.reason}
          characterId={recovering.characterId}
          onImport={(imported) => {
            setDef(imported);
            setRecovering(null);
          }}
          onStartNew={() => setRecovering(null)}
        />
      </div>
    );
  }

  return (
    <div className={`app wyrd-${tier}`}>
      <WyrdWhimsy tier={tier} />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">SideQuest LLC / Field Record</span>
          <span className="brand-name">
            {def.name.trim() || 'Unnamed Agent'}
          </span>
        </div>
        <button className="ghost" onClick={copyShare}>
          {copied ? 'Link copied' : 'Share'}
        </button>
      </header>

      {stored === 'unavailable' && (
        <div className="banner" role="status">
          This browser is not storing data — a private window, or storage is
          full. Your character is being kept in the link itself instead, so{' '}
          <b>bookmark this page</b> or you will lose it when the tab closes.
        </div>
      )}

      {notice?.kind === 'imported' && (
        <div className="banner" role="status">
          Imported from a link and saved on this device. The address bar now
          points at your copy, so you can bookmark it.{' '}
          <button className="ghost" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </div>
      )}

      {notice?.kind === 'collision' && (
        <div className="banner" role="alert">
          This link holds a different version of <b>{notice.incoming.name}</b>,
          saved {when(notice.incomingUpdatedAt)}. Your copy on this device was
          edited {when(notice.localUpdatedAt)} and is what you are looking at.
          Nothing has been overwritten.
          <div className="row-actions">
            <button
              type="button"
              onClick={() => {
                setDef(notice.incoming);
                setNotice(null);
              }}
            >
              Use the link's version
            </button>
            <button
              type="button"
              className="ghost"
              onClick={() => setNotice(null)}
            >
              Keep mine
            </button>
          </div>
        </div>
      )}

      {versionMismatch && (
        <div className="banner" role="status">
          This character was built on rules <b>{def.rulesVersion}</b>; current
          is <b>{CURRENT_RULES_VERSION}</b>. Content may have changed — verify
          with your GM.
        </div>
      )}

      <nav className="tabs" role="tablist" aria-label="Screens">
        <button
          role="tab"
          aria-selected={screen === 'build'}
          className={screen === 'build' ? 'tab active' : 'tab'}
          onClick={() => setScreen('build')}
        >
          Builder
        </button>
        <button
          role="tab"
          aria-selected={screen === 'track'}
          className={screen === 'track' ? 'tab active' : 'tab'}
          onClick={() => setScreen('track')}
        >
          Tracker
        </button>
      </nav>

      <main className="screen">
        {screen === 'build' ? (
          <Builder def={def} onChange={setDef} />
        ) : (
          <Tracker
            def={def}
            session={session}
            onChange={setSession}
            onDefChange={setDef}
          />
        )}
      </main>
    </div>
  );
}
