import { useMemo } from 'react';
import type {
  CharacterDefinition,
  ConditionId,
  SessionState,
  StatId,
} from '../content/schema';
import {
  conditions,
  wyrdTrack,
  momentumGuide,
  exposureGuide,
} from '../content';
import { STAT_META, usableAbilities } from '../lib/character';
import { newJob, newScene } from '../lib/storage';

const MAX_MOMENTUM = 10;

interface TrackerProps {
  def: CharacterDefinition;
  session: SessionState;
  onChange: (session: SessionState) => void;
}

export function Tracker({ def, session, onChange }: TrackerProps) {
  const patch = (p: Partial<SessionState>) => onChange({ ...session, ...p });

  const activeIds = useMemo(
    () => new Set(session.conditions.map((c) => c.id)),
    [session.conditions],
  );

  // stat -> list of active condition names penalising it
  const penalties = useMemo(() => {
    const map = new Map<StatId, string[]>();
    for (const cond of conditions) {
      if (!activeIds.has(cond.id)) continue;
      for (const stat of cond.affectedStats) {
        map.set(stat, [...(map.get(stat) ?? []), cond.name]);
      }
    }
    return map;
  }, [activeIds]);

  const abilities = useMemo(() => usableAbilities(def), [def]);
  const perScene = abilities.filter((a) => a.frequency === 'perScene');
  const perJob = abilities.filter((a) => a.frequency !== 'perScene');
  const spent = new Set(session.spentUses);

  const activeThreshold = [...wyrdTrack.thresholds]
    .filter((t) => t.at <= session.wyrd)
    .sort((a, b) => b.at - a.at)[0];

  function toggleCondition(id: ConditionId) {
    patch({
      conditions: activeIds.has(id)
        ? session.conditions.filter((c) => c.id !== id)
        : [...session.conditions, { id }],
    });
  }

  function toggleUse(key: string) {
    patch({
      spentUses: spent.has(key)
        ? session.spentUses.filter((k) => k !== key)
        : [...session.spentUses, key],
    });
  }

  return (
    <div className="tracker">
      {/* Wyrd --------------------------------------------------------- */}
      <section className="card">
        <div className="row-between">
          <h2>
            Wyrd <span className="cap">scene pressure 0–6</span>
          </h2>
          <div className="stepper">
            <button
              className="round"
              aria-label="Decrease Wyrd"
              onClick={() => patch({ wyrd: Math.max(wyrdTrack.min, session.wyrd - 1) })}
            >
              −
            </button>
            <button
              className="round"
              aria-label="Increase Wyrd"
              onClick={() => patch({ wyrd: Math.min(wyrdTrack.max, session.wyrd + 1) })}
            >
              +
            </button>
          </div>
        </div>
        <div className="wyrd-track" role="group" aria-label="Wyrd track">
          {Array.from({ length: wyrdTrack.max - wyrdTrack.min + 1 }, (_, i) => {
            const value = wyrdTrack.min + i;
            const on = value <= session.wyrd && session.wyrd > 0;
            const isThreshold = wyrdTrack.thresholds.some((t) => t.at === value);
            return (
              <button
                key={value}
                className={
                  'wyrd-cell' +
                  (on ? ' on' : '') +
                  (isThreshold ? ' threshold' : '')
                }
                aria-pressed={value === session.wyrd}
                onClick={() => patch({ wyrd: value })}
              >
                {value}
              </button>
            );
          })}
        </div>
        {activeThreshold && (
          <p className="threshold-note">
            <b>
              {activeThreshold.at} — {activeThreshold.name}.
            </b>{' '}
            {activeThreshold.text}
          </p>
        )}
      </section>

      {/* Momentum + Exposure ----------------------------------------- */}
      <section className="card">
        <div className="resource-cols">
          <div className="resource-col">
            <Counter
              label="Momentum"
              value={session.momentum}
              note={session.momentum >= MAX_MOMENTUM ? 'at cap (10)' : undefined}
              onDec={() =>
                patch({ momentum: Math.max(0, session.momentum - 1) })
              }
              onInc={() =>
                patch({ momentum: Math.min(MAX_MOMENTUM, session.momentum + 1) })
              }
            />
            <MomentumCheat momentum={session.momentum} />
          </div>
          <div className="resource-col">
            <Counter
              label="Exposure"
              value={session.exposure}
              note={session.exposure >= 3 ? 'consequence at 3' : undefined}
              onDec={() =>
                patch({ exposure: Math.max(0, session.exposure - 1) })
              }
              onInc={() => patch({ exposure: session.exposure + 1 })}
            />
            <ExposureCheat exposure={session.exposure} />
          </div>
        </div>
      </section>

      {/* Conditions + stat cross-reference --------------------------- */}
      <section className="card">
        <h2>
          Conditions <span className="cap">−1 to relevant rolls</span>
        </h2>
        <div className="conditions">
          {conditions.map((cond) => {
            const on = activeIds.has(cond.id);
            return (
              <button
                key={cond.id}
                className={on ? 'cond on' : 'cond'}
                aria-pressed={on}
                onClick={() => toggleCondition(cond.id)}
              >
                <span className="cond-name">{cond.name}</span>
                <span className="cond-sub">{cond.text}</span>
                <span className="cond-stats">
                  {cond.affectedStats
                    .map((s) => STAT_META.find((m) => m.id === s)?.name)
                    .join(' · ')}
                </span>
              </button>
            );
          })}
        </div>

        <div className="stat-grid">
          {STAT_META.map((stat) => {
            const hits = penalties.get(stat.id) ?? [];
            return (
              <div
                key={stat.id}
                className={hits.length ? 'stat penalised' : 'stat'}
              >
                <span className="stat-name">{stat.name}</span>
                <span className="stat-die">{def.statDice[stat.id] ?? '—'}</span>
                {hits.length > 0 && (
                  <span className="stat-pen">
                    −{hits.length} <small>{hits.join(', ')}</small>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Uses --------------------------------------------------------- */}
      <section className="card">
        <h2>
          Uses <span className="cap">per scene · per job</span>
        </h2>
        {abilities.length === 0 && (
          <p className="muted small">
            No once-per-scene or once-per-job abilities taken yet.
          </p>
        )}
        {perScene.length > 0 && (
          <UseGroup
            title="Per scene"
            abilities={perScene}
            spent={spent}
            onToggle={toggleUse}
          />
        )}
        {perJob.length > 0 && (
          <UseGroup
            title="Per job"
            abilities={perJob}
            spent={spent}
            onToggle={toggleUse}
          />
        )}
      </section>

      {/* Resets ------------------------------------------------------- */}
      <section className="card resets">
        <button
          className="reset"
          onClick={() => onChange(newScene(def, session))}
        >
          New scene
          <small>clears per-scene uses · zeroes Wyrd</small>
        </button>
        <button
          className="reset danger"
          onClick={() => {
            if (window.confirm('New job clears everything, including Exposure. Continue?')) {
              onChange(newJob(session));
            }
          }}
        >
          New job
          <small>clears everything</small>
        </button>
      </section>
    </div>
  );
}

function Counter({
  label,
  value,
  note,
  onDec,
  onInc,
}: {
  label: string;
  value: number;
  note?: string;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <div className="counter">
      <div className="counter-label">
        {label}
        {note && <small>{note}</small>}
      </div>
      <div className="stepper">
        <button className="round" aria-label={`Decrease ${label}`} onClick={onDec}>
          −
        </button>
        <span className="counter-value">{value}</span>
        <button className="round" aria-label={`Increase ${label}`} onClick={onInc}>
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Momentum spend cheat sheet. Full menu is always shown; the current Momentum
 * lights up what you can afford and dims what you can't.
 */
function MomentumCheat({ momentum }: { momentum: number }) {
  return (
    <details className="cheat">
      <summary>Momentum — spend & gain</summary>
      <p className="cheat-meta">
        {momentumGuide.gain} · cap {momentumGuide.cap}
      </p>
      <ul className="spends">
        {momentumGuide.spends.map((s) => {
          const afford = momentum >= s.cost;
          return (
            <li key={s.name} className={afford ? 'spend afford' : 'spend'}>
              <span className="spend-cost">{s.cost}</span>
              <span className="spend-body">
                <span className="spend-name">
                  {s.name}
                  {s.note && <em> ({s.note})</em>}
                </span>
                <span className="spend-text">{s.text}</span>
              </span>
            </li>
          );
        })}
      </ul>
      <p className="cheat-meta">{momentumGuide.handoff}</p>
    </details>
  );
}

/** Exposure cheat sheet. The consequence line lights up once you reach it. */
function ExposureCheat({ exposure }: { exposure: number }) {
  const hit = exposure >= exposureGuide.threshold.at;
  return (
    <details className="cheat">
      <summary>Exposure — mark, clear, threshold</summary>
      <p className="cheat-line">
        <b>Mark (failure):</b> {exposureGuide.mark}
      </p>
      <p className="cheat-line">
        <b>Clear (success):</b> {exposureGuide.clear}
      </p>
      <p className={hit ? 'cheat-line threshold-hit' : 'cheat-line'}>
        <b>At {exposureGuide.threshold.at}:</b> {exposureGuide.threshold.text}
      </p>
    </details>
  );
}

function UseGroup({
  title,
  abilities,
  spent,
  onToggle,
}: {
  title: string;
  abilities: ReturnType<typeof usableAbilities>;
  spent: Set<string>;
  onToggle: (key: string) => void;
}) {
  return (
    <div className="use-group">
      <h3>{title}</h3>
      {abilities.map((a) => {
        const isSpent = spent.has(a.key);
        return (
          <label key={a.key} className={isSpent ? 'use spent' : 'use'}>
            <input
              type="checkbox"
              checked={isSpent}
              onChange={() => onToggle(a.key)}
            />
            <span className="use-body">
              <span className="use-name">{a.name}</span>
              <span className="use-source">{a.source}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
