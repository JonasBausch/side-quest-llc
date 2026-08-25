import { useMemo, useState } from 'react';
import {
  characterDefinitionSchema,
  type CharacterDefinition,
  type Frequency,
  type Path,
  type TraitPick,
} from '../content/schema';
import {
  trainings,
  trainingsById,
  spellTagsById,
  tunes,
  tropes,
  strengths,
  flaws,
  type Trait,
} from '../content';
import {
  DICE,
  STAT_META,
  availableTagIds,
  hasNode,
  toggleNode,
  trainingNodeRefs,
} from '../lib/character';
import { validateDefinition } from '../lib/validate';

const FREQ_LABEL: Record<Frequency, string> = {
  perScene: 'per scene',
  perJob: 'per job',
  passive: 'passive',
  counter: 'counter',
};

interface BuilderProps {
  def: CharacterDefinition;
  onChange: (def: CharacterDefinition) => void;
}

export function Builder({ def, onChange }: BuilderProps) {
  const update = (patch: Partial<CharacterDefinition>) =>
    onChange({ ...def, ...patch });

  const warnings = useMemo(() => validateDefinition(def), [def]);
  const mainTraining = trainingsById.get(def.mainTrainingId);
  const tagIds = availableTagIds(def);
  const hasSignatureNode = def.takenNodes.some(
    (n) => n.path === 'wyrd' && n.index === 2,
  );

  const dieCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of STAT_META) {
      const d = def.statDice[s.id];
      if (d) counts[d] = (counts[d] ?? 0) + 1;
    }
    return counts;
  }, [def.statDice]);

  return (
    <div className="builder">
      {warnings.length > 0 && (
        <section className="card warn">
          <h2>Advisory</h2>
          <ul className="warnings">
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
          <p className="muted small">
            Warnings never block a build — the GM's ruling stands.
          </p>
        </section>
      )}

      {/* Identity ------------------------------------------------------- */}
      <section className="card">
        <h2>Identity</h2>
        <label className="field">
          <span>Name</span>
          <input
            type="text"
            value={def.name}
            placeholder="Agent name"
            onChange={(e) => update({ name: e.target.value })}
          />
        </label>
      </section>

      {/* Training + path ------------------------------------------------ */}
      <section className="card">
        <h2>Training</h2>
        <label className="field">
          <span>Main training</span>
          <select
            value={def.mainTrainingId}
            onChange={(e) => update({ mainTrainingId: e.target.value })}
          >
            {trainings.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="field">
          <legend>Starting path</legend>
          <div className="segmented">
            {(['mundane', 'wyrd'] as Path[]).map((p) => (
              <label key={p} className="seg">
                <input
                  type="radio"
                  name="startingPath"
                  checked={def.startingPath === p}
                  onChange={() => update({ startingPath: p })}
                />
                <span>{p === 'wyrd' ? 'Wyrd' : 'Mundane'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {mainTraining && (
          <div className="specialty">
            <div className="specialty-name">
              {mainTraining.specialty.name}
              <span className="tag">Specialty</span>
            </div>
            <p className="node-text">{mainTraining.specialty.text}</p>
          </div>
        )}
      </section>

      {/* Dice ----------------------------------------------------------- */}
      <section className="card">
        <h2>Stat Dice</h2>
        <p className="muted small">Assign each of d4–d20 to a stat.</p>
        <div className="dice-grid">
          {STAT_META.map((stat) => {
            const value = def.statDice[stat.id];
            const dupe = value && dieCounts[value] > 1;
            return (
              <label key={stat.id} className="die-row">
                <span className="die-stat">
                  <b>{stat.name}</b>
                  <small>{stat.use}</small>
                </span>
                <select
                  className={dupe ? 'dupe' : ''}
                  value={value ?? ''}
                  onChange={(e) =>
                    update({
                      statDice: {
                        ...def.statDice,
                        [stat.id]: e.target.value
                          ? (e.target.value as (typeof DICE)[number])
                          : undefined,
                      },
                    })
                  }
                >
                  <option value="">—</option>
                  {DICE.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
        </div>
      </section>

      {/* Nodes: main training ------------------------------------------ */}
      <section className="card">
        <h2>Nodes — {mainTraining?.name}</h2>
        <p className="muted small">
          Taken nodes are filled. Untaken nodes show what a promotion buys.
        </p>
        {(['wyrd', 'mundane'] as Path[]).map((path) => (
          <div key={path} className="node-col">
            <h3>{path === 'wyrd' ? 'Wyrd Path' : 'Mundane Path'}</h3>
            <NodeList def={def} trainingId={def.mainTrainingId} path={path} onChange={onChange} />
          </div>
        ))}

        {hasSignatureNode && (
          <div className="signature">
            <h3>Signature</h3>
            <label className="field">
              <span>Spell tag</span>
              <select
                value={def.signatureTagId ?? ''}
                onChange={(e) =>
                  update({ signatureTagId: e.target.value || undefined })
                }
              >
                <option value="">— pick a tag —</option>
                {tagIds.map((id) => (
                  <option key={id} value={id}>
                    {spellTagsById.get(id)?.name ?? id}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Tune</span>
              <select
                value={def.signatureTune ?? ''}
                onChange={(e) =>
                  update({
                    signatureTune:
                      (e.target.value as CharacterDefinition['signatureTune']) ||
                      undefined,
                  })
                }
              >
                <option value="">— pick a tune —</option>
                {tunes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            {def.signatureTune && (
              <p className="node-text">
                {tunes.find((t) => t.id === def.signatureTune)?.text}
              </p>
            )}
          </div>
        )}
      </section>

      {/* Cross-training ------------------------------------------------- */}
      <CrossTrain def={def} onChange={onChange} />

      {/* Traits --------------------------------------------------------- */}
      <section className="card">
        <h2>Trope · Strength · Flaw</h2>
        <TraitField
          label="Trope"
          options={tropes}
          pick={def.trope}
          onPick={(p) => update({ trope: p })}
        />
        <TraitField
          label="Strength"
          options={strengths}
          pick={def.strength}
          onPick={(p) => update({ strength: p })}
        />
        <TraitField
          label="Flaw"
          options={flaws}
          pick={def.flaw}
          onPick={(p) => update({ flaw: p })}
        />
      </section>

      <ImportExport def={def} onChange={onChange} />
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function NodeList({
  def,
  trainingId,
  path,
  onChange,
}: {
  def: CharacterDefinition;
  trainingId: string;
  path: Path;
  onChange: (def: CharacterDefinition) => void;
}) {
  return (
    <div className="nodes">
      {trainingNodeRefs(trainingId, path).map(({ ref, node }) => {
        const taken = hasNode(def, ref);
        return (
          <button
            key={ref.index}
            type="button"
            className={taken ? 'node taken' : 'node'}
            aria-pressed={taken}
            onClick={() => onChange(toggleNode(def, ref))}
          >
            <span className="node-head">
              <span className="node-idx">
                {path === 'wyrd' ? 'Wyrd' : 'Gear'}-{ref.index}
              </span>
              <span className="node-name">{node.name}</span>
              {node.cost != null && (
                <span className="node-cost">cost {node.cost}</span>
              )}
            </span>
            <span className="node-text">{node.text}</span>
            {node.frequency && (
              <span className="node-freq">{FREQ_LABEL[node.frequency]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function CrossTrain({
  def,
  onChange,
}: {
  def: CharacterDefinition;
  onChange: (def: CharacterDefinition) => void;
}) {
  const others = trainings.filter((t) => t.id !== def.mainTrainingId);
  const [viewId, setViewId] = useState<string>('');
  const crossNodes = def.takenNodes.filter(
    (n) => n.trainingId !== def.mainTrainingId,
  );

  return (
    <section className="card">
      <h2>Cross-train</h2>
      <p className="muted small">
        Promotions can take nodes from any training. Only your main training
        grants its Specialty.
      </p>

      {crossNodes.length > 0 && (
        <div className="chips">
          {crossNodes.map((n) => (
            <span key={`${n.trainingId}:${n.path}:${n.index}`} className="chip">
              {trainingsById.get(n.trainingId)?.name}{' '}
              {n.path === 'wyrd' ? 'Wyrd' : 'Gear'}-{n.index}
            </span>
          ))}
        </div>
      )}

      <label className="field">
        <span>Add from</span>
        <select value={viewId} onChange={(e) => setViewId(e.target.value)}>
          <option value="">— choose a training —</option>
          {others.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      {viewId &&
        (['wyrd', 'mundane'] as Path[]).map((path) => (
          <div key={path} className="node-col">
            <h3>{path === 'wyrd' ? 'Wyrd Path' : 'Mundane Path'}</h3>
            <NodeList def={def} trainingId={viewId} path={path} onChange={onChange} />
          </div>
        ))}
    </section>
  );
}

function TraitField({
  label,
  options,
  pick,
  onPick,
}: {
  label: string;
  options: Trait[];
  pick?: TraitPick;
  onPick: (pick: TraitPick | undefined) => void;
}) {
  const value = pick?.id ?? (pick ? '__custom__' : '');

  function handleSelect(next: string) {
    if (!next) return onPick(undefined);
    if (next === '__custom__') {
      return onPick({ name: pick?.name ?? '', text: pick?.text ?? '' });
    }
    const found = options.find((o) => o.id === next);
    if (found) {
      onPick({
        id: found.id,
        name: found.name,
        text: found.text,
        frequency: found.frequency,
      });
    }
  }

  const selected = pick?.id ? options.find((o) => o.id === pick.id) : undefined;

  return (
    <div className="trait">
      <label className="field">
        <span>{label}</span>
        <select value={value} onChange={(e) => handleSelect(e.target.value)}>
          <option value="">— none —</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
          <option value="__custom__">Custom…</option>
        </select>
      </label>

      {selected && <p className="node-text">{selected.text}</p>}

      {value === '__custom__' && pick && (
        <div className="custom">
          <input
            type="text"
            placeholder={`${label} name`}
            value={pick.name}
            onChange={(e) => onPick({ ...pick, name: e.target.value })}
          />
          <textarea
            placeholder="What it does"
            value={pick.text ?? ''}
            onChange={(e) => onPick({ ...pick, text: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}

function ImportExport({
  def,
  onChange,
}: {
  def: CharacterDefinition;
  onChange: (def: CharacterDefinition) => void;
}) {
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  function apply() {
    try {
      const parsed = characterDefinitionSchema.safeParse(JSON.parse(draft));
      if (!parsed.success) {
        setError('Not a valid character definition.');
        return;
      }
      setError('');
      onChange(parsed.data);
    } catch {
      setError('Could not parse JSON.');
    }
  }

  return (
    <details className="card">
      <summary>Import / Export JSON</summary>
      <label className="field">
        <span>Export (copy this)</span>
        <textarea readOnly rows={4} value={JSON.stringify(def)} />
      </label>
      <label className="field">
        <span>Import (paste, then apply)</span>
        <textarea
          rows={4}
          value={draft}
          placeholder="Paste a character JSON"
          onChange={(e) => setDraft(e.target.value)}
        />
      </label>
      {error && <p className="warn-text">{error}</p>}
      <button type="button" className="ghost" onClick={apply}>
        Apply import
      </button>
    </details>
  );
}
