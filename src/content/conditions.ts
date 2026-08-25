import type { Condition } from './schema';

/**
 * The five Conditions. Transcribed from docs/rules-v4.0.md ("Conditions").
 * Each applies −1 to relevant rolls until cleared; `affectedStats` is the
 * stat→condition cross-reference the tracker uses to highlight penalised dice.
 * The −1 itself is not resolved in code.
 */
export const conditions = [
  {
    id: 'shaken',
    name: 'Shaken',
    text: `fear/unease`,
    affectedStats: ['fight', 'grit'],
  },
  {
    id: 'winded',
    name: 'Winded',
    text: `fatigue`,
    affectedStats: ['brawn', 'fight'],
  },
  {
    id: 'distracted',
    name: 'Distracted',
    text: `sensory distortion`,
    affectedStats: ['brains', 'charm'],
  },
  {
    id: 'marked',
    name: 'Marked',
    text: `the phenomenon "knows you"`,
    affectedStats: ['flight', 'charm'],
  },
  {
    id: 'strained',
    name: 'Strained',
    text: `magic overload`,
    affectedStats: ['grit', 'brains'],
  },
] satisfies Condition[];
