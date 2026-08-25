import type { WyrdTrack } from './schema';

/**
 * The Wyrd track (0 → 6) with its named thresholds. Transcribed from
 * docs/rules-v4.0.md ("Wyrd threshold"). The tracker uses the thresholds for
 * peripheral scene-state feedback (the page background shifts at 4 and 6).
 */
export const wyrdTrack = {
  min: 0,
  max: 6,
  thresholds: [
    {
      at: 2,
      name: 'Environmental Distortion',
      text: `Lights, sounds, looping, "wrong" acoustics, unreliable directionality.`,
    },
    {
      at: 4,
      name: 'Hazard Active',
      text: `Boundary snap, cold pockets, shadow latch, bleed to other realms begins.`,
    },
    {
      at: 6,
      name: 'The Scene Gets Wyrd',
      text: `Reality-altering surge. Objects become actively possessed, two spaces overlap, the environment re-skins (indoor forest, underwater building, suddenly high in a tree), and the scene becomes a set piece.`,
    },
  ],
} satisfies WyrdTrack;
