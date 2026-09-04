import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  CharacterDefinition,
  ConditionId,
  DieSize,
  SessionState,
  StatId,
} from '../content/schema';
import {
  conditions,
  wyrdTrack,
  momentumGuide,
  exposureGuide,
  castingGuide,
  groupBonusGuide,
  groupBonuses,
} from '../content';
import {
  STAT_META,
  usableAbilities,
  passiveAbilities,
  hasGroupBonus,
  toggleGroupBonus,
  unlockedGroupBonuses,
} from '../lib/character';
import { newJob, newScene } from '../lib/storage';

// The cap is content, not a component constant — it comes from the rules.
const MAX_MOMENTUM = momentumGuide.cap;

interface TrackerProps {
  def: CharacterDefinition;
  session: SessionState;
  onChange: (session: SessionState) => void;
  /**
   * Edits the character definition. Notes and unlocked Group Bonuses are
   * definition data, not session — they must survive "New job".
   */
  onDefChange: (def: CharacterDefinition) => void;
}

export function Tracker({ def, session, onChange, onDefChange }: TrackerProps) {
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

  // Ephemeral dice roll. Not definition, not session state — a physical-die
  // substitute that lives only in component state and is never persisted.
  const [roll, setRoll] = useState<{
    statId: StatId;
    die: DieSize;
    raw: number; // settled face value
    penalty: number; // −N from active conditions at roll time (display only)
    rolling: boolean;
    display: number; // number currently shown; cycles during the animation
  } | null>(null);
  const rollTimer = useRef<number | null>(null);

  const reduceMotion = useMemo(
    () =>
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false,
    [],
  );

  useEffect(
    () => () => {
      if (rollTimer.current !== null) window.clearInterval(rollTimer.current);
    },
    [],
  );

  function rollStat(statId: StatId, die: DieSize) {
    const faces = Number(die.slice(1));
    if (!faces) return;
    const penalty = (penalties.get(statId) ?? []).length;
    const final = 1 + Math.floor(Math.random() * faces);
    const rand = () => 1 + Math.floor(Math.random() * faces);

    if (rollTimer.current !== null) {
      window.clearInterval(rollTimer.current);
      rollTimer.current = null;
    }

    if (reduceMotion) {
      setRoll({ statId, die, raw: final, penalty, rolling: false, display: final });
      return;
    }

    setRoll({ statId, die, raw: final, penalty, rolling: true, display: rand() });
    const start = performance.now();
    const DURATION = 550;
    rollTimer.current = window.setInterval(() => {
      if (performance.now() - start >= DURATION) {
        if (rollTimer.current !== null) window.clearInterval(rollTimer.current);
        rollTimer.current = null;
        setRoll((r) =>
          r && r.statId === statId ? { ...r, rolling: false, display: final } : r,
        );
      } else {
        setRoll((r) =>
          r && r.statId === statId ? { ...r, display: rand() } : r,
        );
      }
    }, 55);
  }

  const abilities = useMemo(() => usableAbilities(def), [def]);
  const passives = useMemo(() => passiveAbilities(def), [def]);
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
              note={
                session.momentum >= MAX_MOMENTUM
                  ? `at cap (${MAX_MOMENTUM})`
                  : undefined
              }
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
          Conditions <span className="cap">−1 each · same stat stacks</span>
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

        <p className="stat-hint cap">Tap a stat to roll its die</p>

        <CastingCheat wyrd={session.wyrd} />

        {roll && (
          <p className="roll-readout" aria-live="polite">
            <strong>{STAT_META.find((s) => s.id === roll.statId)?.name}</strong>
            <span className="cap"> {roll.die}</span>
            {' → '}
            <span className="roll-raw">
              {roll.rolling ? roll.display : roll.raw}
            </span>
            {!roll.rolling && roll.penalty > 0 && (
              <span className="roll-adj">
                {' '}− {roll.penalty} = {roll.raw - roll.penalty}
              </span>
            )}
          </p>
        )}

        <div className="stat-grid">
          {STAT_META.map((stat) => {
            const hits = penalties.get(stat.id) ?? [];
            const die = def.statDice[stat.id];
            const isRolled = roll?.statId === stat.id;
            return (
              <button
                key={stat.id}
                type="button"
                className={[
                  'stat',
                  hits.length ? 'penalised' : '',
                  isRolled ? 'rolled' : '',
                  isRolled && roll.rolling ? 'rolling' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => die && rollStat(stat.id, die)}
                disabled={!die}
                aria-label={
                  die
                    ? `Roll ${stat.name} ${die}`
                    : `${stat.name}: no die assigned`
                }
              >
                <span className="stat-name">{stat.name}</span>
                {isRolled ? (
                  <>
                    <span className="stat-roll">{roll.display}</span>
                    <span className="stat-die-cap">{die}</span>
                  </>
                ) : (
                  <span className="stat-die">{die ?? '—'}</span>
                )}
                {hits.length > 0 && (
                  <span className="stat-pen">
                    −{hits.length} <small>{hits.join(', ')}</small>
                  </span>
                )}
              </button>
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

      {/* Crew --------------------------------------------------------- */}
      <CrewSection
        def={def}
        momentum={session.momentum}
        onDefChange={onDefChange}
      />

      {/* Passives + traits ------------------------------------------- */}
      {passives.length > 0 && (
        <section className="card">
          <h2>
            Kit <span className="cap">passives · traits · always on</span>
          </h2>
          <div className="kit">
            {passives.map((a) => (
              <div key={a.key} className="kit-item">
                <div className="kit-head">
                  <span className="kit-name">{a.name}</span>
                  <span className="kit-source">{a.source}</span>
                </div>
                {a.text && <p className="kit-text">{a.text}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Notes -------------------------------------------------------- */}
      <section className="card">
        <h2>Notes</h2>
        <label className="field">
          <span>Backstory, reminders, anything</span>
          <textarea
            rows={5}
            value={def.notes ?? ''}
            placeholder="Freeform notes — background story, table reminders, loose ends…"
            onChange={(e) => onDefChange({ ...def, notes: e.target.value })}
          />
        </label>
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
            if (
              window.confirm(
                'New job clears Exposure, Wyrd, conditions and all uses. Momentum carries. Continue?',
              )
            ) {
              onChange(newJob(session));
            }
          }}
        >
          New job
          <small>clears all but Momentum</small>
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
      <p className="cheat-meta">{exposureGuide.tally}</p>
    </details>
  );
}

/**
 * Casting cheat sheet. At Wyrd 4+ the escalation rule applies on its own, so
 * the bumped TNs appear next to the printed ones and the escalation line
 * highlights. The rule itself is always spelled out, because it also fires on a
 * resisting target or an unstable area — a GM call the tracker can't see.
 */
function CastingCheat({ wyrd }: { wyrd: number }) {
  const escalated = wyrd >= castingGuide.escalationAt;
  return (
    <details className="cheat">
      <summary>Casting — what you roll</summary>
      <p className="cheat-line">
        <b>Roll:</b> {castingGuide.roll}
      </p>
      <p className="cheat-line">
        <b>Casting stat:</b> {castingGuide.stat}
      </p>
      <ul className="scales">
        {castingGuide.scales.map((scale) => (
          <li key={scale.name} className="scale">
            <span className="scale-name">{scale.name}</span>
            <span className="scale-tn">
              TN {scale.tn}
              {escalated && <b> → {scale.escalatedTn}</b>}
            </span>
            <span className="scale-note">
              {scale.difficulty}
              {escalated && ' · escalated'}
            </span>
          </li>
        ))}
      </ul>
      <p className={escalated ? 'cheat-line threshold-hit' : 'cheat-line'}>
        <b>Escalation:</b> {castingGuide.escalation}
      </p>
      <p className="cheat-line">
        <b>Stress:</b> {castingGuide.stress}
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
              {a.text && <span className="use-text">{a.text}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/**
 * Group Bonuses. Crew-level in the fiction, recorded per player: the table
 * agrees on a purchase out loud and everyone marks it here, the same way a
 * promotion is recorded. Nothing is spent or enforced — locked levels stay
 * visible but inert so players can see what the crew could save toward.
 *
 * Unlocking writes the *definition*, so a bonus survives "New job". The
 * once-per-job levels then show up in Uses like any other ability, and it is
 * the existing spentUses machinery that ticks and resets them.
 */
function CrewSection({
  def,
  momentum,
  onDefChange,
}: {
  def: CharacterDefinition;
  momentum: number;
  onDefChange: (def: CharacterDefinition) => void;
}) {
  const unlocked = unlockedGroupBonuses(def);

  const families = groupBonuses.reduce<
    { group: string; levels: typeof groupBonuses }[]
  >((acc, bonus) => {
    const family = acc.find((f) => f.group === bonus.group);
    if (family) family.levels.push(bonus);
    else acc.push({ group: bonus.group, levels: [bonus] });
    return acc;
  }, []);

  return (
    <section className="card">
      <h2>
        Crew <span className="cap">group bonuses</span>
      </h2>

      {unlocked.length === 0 ? (
        <p className="muted small">
          Nothing unlocked yet. Agree a purchase at the table, then everyone
          marks it below.
        </p>
      ) : (
        <ul className="crew-owned">
          {unlocked.map((b) => (
            <li key={b.id}>
              <span className="crew-owned-name">{b.name}</span>
              <span className="crew-owned-source">{b.group}</span>
            </li>
          ))}
        </ul>
      )}

      <details className="cheat">
        <summary>Unlock a group bonus</summary>
        <p className="cheat-meta">{groupBonusGuide.purchase}</p>

        {families.map((family) => (
          <div key={family.group} className="crew-family">
            <h3>
              {family.group}
              <span className="crew-price">
                {family.levels[0].costPerPlayer}/player
              </span>
            </h3>
            {family.levels.map((bonus) => {
              const owned = hasGroupBonus(def, bonus.id);
              const afford = momentum >= bonus.costPerPlayer;
              return (
                <label
                  key={bonus.id}
                  className={
                    'crew-level' +
                    (owned ? ' owned' : '') +
                    (!owned && afford ? ' afford' : '')
                  }
                >
                  <input
                    type="checkbox"
                    checked={owned}
                    onChange={() => onDefChange(toggleGroupBonus(def, bonus.id))}
                  />
                  <span className="crew-body">
                    <span className="crew-name">
                      {family.levels.length > 1 && (
                        <span className="crew-level-no">L{bonus.level}</span>
                      )}
                      {bonus.name}
                      {bonus.frequency === 'perJob' && (
                        <em className="crew-freq">1/job</em>
                      )}
                    </span>
                    <span className="crew-text">{bonus.text}</span>
                    {bonus.note && (
                      <span className="crew-note">GM call: {bonus.note}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        ))}

        {groupBonusGuide.note && (
          <p className="cheat-meta">GM call: {groupBonusGuide.note}</p>
        )}
      </details>
    </section>
  );
}
