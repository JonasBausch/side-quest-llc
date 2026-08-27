import { useEffect, useMemo, useState } from 'react';
import {
  CURRENT_RULES_VERSION,
  type CharacterDefinition,
  type SessionState,
} from './content/schema';
import { emptyDefinition } from './lib/character';
import { readHash, writeHash, shareUrl } from './lib/serialize';
import { emptySession, loadSession, saveSession } from './lib/storage';
import { Builder } from './components/Builder';
import { Tracker } from './components/Tracker';
import { WyrdWhimsy } from './components/WyrdWhimsy';

type Screen = 'build' | 'track';

function wyrdTier(wyrd: number): string {
  if (wyrd >= 6) return 'surge';
  if (wyrd >= 4) return 'hazard';
  if (wyrd >= 2) return 'distortion';
  return 'calm';
}

export function App() {
  const [def, setDef] = useState<CharacterDefinition>(
    () => readHash() ?? emptyDefinition(),
  );
  const [session, setSession] = useState<SessionState>(
    () => loadSession(def.id) ?? emptySession(def.id),
  );
  const [screen, setScreen] = useState<Screen>('build');
  const [copied, setCopied] = useState(false);

  // Keep the URL fragment in sync with the definition (shareable link).
  useEffect(() => {
    writeHash(def);
  }, [def]);

  // Persist live session state, keyed by character id.
  useEffect(() => {
    saveSession(session);
  }, [session]);

  const versionMismatch = def.rulesVersion !== CURRENT_RULES_VERSION;
  const tier = useMemo(() => wyrdTier(session.wyrd), [session.wyrd]);

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareUrl(def));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the URL bar already holds the link */
    }
  }

  return (
    <div className={`app wyrd-${tier}`}>
      <WyrdWhimsy tier={tier} />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">SideQuest LLC / Field Record</span>
          <span className="brand-name">{def.name.trim() || 'Unnamed Agent'}</span>
        </div>
        <button className="ghost" onClick={copyShare}>
          {copied ? 'Link copied' : 'Share'}
        </button>
      </header>

      {versionMismatch && (
        <div className="banner" role="status">
          This character was built on rules <b>{def.rulesVersion}</b>; current is{' '}
          <b>{CURRENT_RULES_VERSION}</b>. Content may have changed — verify with
          your GM.
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
