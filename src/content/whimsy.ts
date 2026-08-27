/**
 * Wyrd whimsies — the absurd things that drift across the background as scene
 * pressure climbs. This is decorative flavor, NOT rules content: nothing here
 * is transcribed from the ruleset and no code resolves it. Kept as data so the
 * renderer stays generic and the list is editable without touching components.
 *
 * `weird` is a rank, not a mechanic: 1 = mildly off (appears from the first
 * Wyrd threshold up), 2 = clearly wrong (hazard up), 3 = fully unhinged (surge
 * only). Higher scene tiers unlock the wilder pool on top of the calmer one.
 */
export type Whimsy = {
  glyph: string;
  /** The compound conceit, used as a hover title — peripheral, never spoken. */
  note: string;
  weird: 1 | 2 | 3;
};

export const whimsies: Whimsy[] = [
  // 1 — mildly off
  { glyph: '🫖', note: 'a kettle humming a tune it half-remembers', weird: 1 },
  { glyph: '☎️', note: 'a phone quietly drafting a poem', weird: 1 },
  { glyph: '🧦', note: 'a single sock, plotting something', weird: 1 },
  { glyph: '🪑', note: 'a chair that paced all night', weird: 1 },
  { glyph: '🥄', note: 'a spoon with strong opinions', weird: 1 },
  { glyph: '🕯️', note: 'a candle reading in the dark', weird: 1 },

  // 2 — clearly wrong
  { glyph: '🍦', note: 'an ice cream cone doing the dishes', weird: 2 },
  { glyph: '🐌', note: 'a snail running late for something', weird: 2 },
  { glyph: '🕰️', note: 'a clock ticking sideways', weird: 2 },
  { glyph: '🐟', note: 'a fish filing a formal complaint', weird: 2 },
  { glyph: '🧻', note: 'a roll of paper reciting case law', weird: 2 },
  { glyph: '🍳', note: 'a frying pan officiating a wedding', weird: 2 },

  // 3 — fully unhinged
  { glyph: '🐙', note: 'an octopus conducting an orchestra', weird: 3 },
  { glyph: '🛁', note: 'a bathtub sailing to work', weird: 3 },
  { glyph: '🪐', note: 'a planet that owes you money', weird: 3 },
  { glyph: '🌪️', note: 'a tornado made entirely of paperwork', weird: 3 },
  { glyph: '🐘', note: 'an elephant tiptoeing through a keyhole', weird: 3 },
  { glyph: '🚪', note: 'a door that opens onto more doors', weird: 3 },
];
