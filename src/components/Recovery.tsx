/**
 * What the app shows when the URL names a character this device does not have.
 *
 * A pointer link resolves only against local storage, so someone else's copy of
 * it — or your own, on a phone you have not used before — lands here. The one
 * thing this screen must not do is quietly hand over a blank character, which
 * looks like the character was lost rather than merely absent.
 */
import { useState } from 'react';
import {
  characterDefinitionSchema,
  type CharacterDefinition,
} from '../content/schema';

interface RecoveryProps {
  reason: 'missing' | 'unreadable';
  characterId: string | null;
  onImport: (def: CharacterDefinition) => void;
  onStartNew: () => void;
}

export function Recovery({
  reason,
  characterId,
  onImport,
  onStartNew,
}: RecoveryProps) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  function apply() {
    try {
      const parsed = characterDefinitionSchema.safeParse(JSON.parse(draft));
      if (!parsed.success) {
        setError('Not a valid character definition.');
        return;
      }
      onImport(parsed.data);
    } catch {
      setError('Could not parse JSON.');
    }
  }

  return (
    <main className="screen">
      <section className="card warn">
        <h2>
          {reason === 'missing'
            ? 'Not on this device'
            : 'That link arrived damaged'}
        </h2>
        {reason === 'missing' ? (
          <p>
            This link points at character{' '}
            <b>{characterId ?? 'an unknown id'}</b>, but nothing by that id is
            stored in this browser. Character sheets live on the device that
            built them — a plain link like this one does not carry the character
            with it.
          </p>
        ) : (
          <p>
            The link carried a character, but it could not be read — chat apps
            and shorteners often cut long links in half. Ask for it again, or
            paste the character's JSON below.
          </p>
        )}
        <p>
          To get this sheet here, ask whoever has it to send a <b>Share</b> link
          or an exported JSON file, then paste it below.
        </p>

        <label className="field">
          <span>Paste a character JSON</span>
          <textarea
            rows={4}
            value={draft}
            placeholder="{ … }"
            onChange={(e) => {
              setDraft(e.target.value);
              setError('');
            }}
          />
        </label>
        {error && <p className="warn-text">{error}</p>}

        <div className="row-actions">
          <button
            type="button"
            className="ghost primary"
            onClick={apply}
            disabled={!draft.trim()}
          >
            Import character
          </button>
          <button type="button" className="ghost" onClick={onStartNew}>
            Start a new character
          </button>
        </div>
      </section>
    </main>
  );
}
