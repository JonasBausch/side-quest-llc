import type { ExposureGuide } from './schema';

/**
 * Exposure reference. Transcribed from docs/rules-v5.0.md ("Exposure").
 * Reference prose only.
 *
 * v5.0 left it unclear whether Exposure was a 0–3 clock that empties when it
 * fires or a tally that keeps climbing. The GM has settled it as an open-ended
 * tally, which is what the tracker already did — so the counter has a floor of
 * zero and no ceiling. See https://github.com/JonasBausch/side-quest-llc/issues/13.
 */
export const exposureGuide = {
  mark: `Witnesses/cameras catch it, alarms/damage, obvious magic, cops/security escalate, evidence left behind.`,
  clear: `Evacuate/distract, cover story/permits, block sightlines/relocate, secure footage, clean residue/patch damage.`,
  threshold: {
    at: 3,
    text: `The scene continues, but a consequence hits (authorities arrive, footage spreads, site gets restricted, new complication clock).`,
  },
  tally: `Exposure does not reset when the consequence fires — it keeps climbing. Clearing is the only thing that brings it down.`,
} satisfies ExposureGuide;
