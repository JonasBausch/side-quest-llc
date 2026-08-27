import { useMemo, type CSSProperties } from 'react';
import { whimsies } from '../content/whimsy';

/**
 * Decorative background layer: as Wyrd climbs, increasingly absurd things drift
 * up the screen. Purely peripheral — aria-hidden, non-interactive, disabled
 * under prefers-reduced-motion (see styles.css). Reads only the scene tier, so
 * it never touches the definition or session state.
 */

const RANK: Record<string, number> = {
  calm: 0,
  distortion: 1,
  hazard: 2,
  surge: 3,
};

/** How many drifters at each tier — calm shows none, surge gently swarms. */
const COUNT = [0, 8, 20, 40];

type Sprite = {
  glyph: string;
  note: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
  sway: number;
  spin: number;
  peak: number;
};

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function WyrdWhimsy({ tier }: { tier: string }) {
  const rank = RANK[tier] ?? 0;

  const sprites = useMemo<Sprite[]>(() => {
    if (rank === 0) return [];
    const pool = whimsies.filter((w) => w.weird <= rank);
    // Weirder scenes drift a little faster and swarm harder.
    const speed = 1 - (rank - 1) * 0.18;
    return Array.from({ length: COUNT[rank] }, () => {
      const w = pool[Math.floor(Math.random() * pool.length)];
      const duration = rand(26, 44) * speed;
      return {
        glyph: w.glyph,
        note: w.note,
        left: rand(2, 94),
        size: rand(26, 30 + rank * 12),
        duration,
        // Negative delay seeds them mid-flight so the layer is populated at load.
        delay: -rand(0, duration),
        sway: rand(-60, 60),
        spin: rand(-40, 40) * rank,
        peak: rand(0.16, 0.2 + rank * 0.06),
      };
    });
  }, [rank]);

  if (sprites.length === 0) return null;

  return (
    <div className="wyrd-whimsy" aria-hidden="true">
      {sprites.map((s, i) => (
        <span
          key={i}
          className="whimsy"
          title={s.note}
          style={
            {
              left: `${s.left}%`,
              fontSize: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              '--sway': `${s.sway}px`,
              '--spin': `${s.spin}deg`,
              '--peak': s.peak,
            } as CSSProperties
          }
        >
          {s.glyph}
        </span>
      ))}
    </div>
  );
}
