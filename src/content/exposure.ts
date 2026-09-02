import type { ExposureGuide } from './schema';

/**
 * Exposure reference. Transcribed from docs/rules-v5.0.md ("Exposure").
 * Reference prose only. Note: whether Exposure is a 0–3 clock that resets or an
 * open counter is unresolved in v4.0 — see OPEN-ITEMS.md (A5). The tracker
 * treats it as an open counter and surfaces the 3-mark consequence here.
 */
export const exposureGuide = {
  mark: `Witnesses/cameras catch it, alarms/damage, obvious magic, cops/security escalate, evidence left behind.`,
  clear: `Evacuate/distract, cover story/permits, block sightlines/relocate, secure footage, clean residue/patch damage.`,
  threshold: {
    at: 3,
    text: `The scene continues, but a consequence hits (authorities arrive, footage spreads, site gets restricted, new complication clock).`,
  },
} satisfies ExposureGuide;
