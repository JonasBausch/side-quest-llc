import type { SpellTag } from './schema';

/**
 * Shared spell tags, referenced by id from trainings' `availableTagIds`.
 * Transcribed from docs/rules-v4.0.md ("Spell Tags" per training + the Quick
 * Index). Tags are shared across trainings and never duplicated inline; this
 * list grows one training's worth at a time as trainings are added.
 *
 * Added with Field Tinkerer: ANCHOR, OMEN, SPARK, STEP, UNRAVEL.
 */
export const spellTags = [
  {
    id: 'anchor',
    name: 'Anchor',
    small: `Declare one reality rule that applies to one small focus (one object/one doorway/one 5-ft spot) for a beat.`,
    medium: `Declare one reality rule that applies to a defined section of the scene (one room corner / one corridor segment) for a segment.`,
    large: `Declare one reality rule that applies to an entire room for the scene (until the scene ends or it's narratively broken).`,
  },
  {
    id: 'omen',
    name: 'Omen',
    small: `Name one specific thing you want to avoid (alarm, ambush, exposure, boundary snap, betrayal); you receive a clear sign one beat before it would occur.`,
    medium: `Name one specific thing you want to encounter; you receive a sign about that thing if available.`,
    large: `Name your intended approach for the scene (sneak, negotiate, chase, contain, extract); you learn the most likely cost of that approach and the earliest lever that can reduce it (route, target, object, or moment in the scene).`,
  },
  {
    id: 'spark',
    name: 'Spark',
    small: `Cause one simple device/event (a lock clicks, a light flickers, a camera blinks, a motor coughs).`,
    medium: `Affect one subsystem (panel, elevator logic, sprinklers, security door group) or create two linked effects.`,
    large: `Affect a building-scale system within one zone for the scene (security attention, power routing, Fire suppression system).`,
  },
  {
    id: 'step',
    name: 'Step',
    small: `Move to a new position within the same room/zone using a seam route (shadow edge, reflection, door crack).`,
    medium: `Move into an adjacent space (through one barrier/threshold), or bring one willing ally with you.`,
    large: `Move across multiple connected spaces in the scene (room→hall→stairwell, etc.), or bring up to 3 allies through the same seam-route.`,
  },
  {
    id: 'unravel',
    name: 'Unravel',
    small: `Unmake one small possessed object into harmless basic parts (e.g., a doll into stuffing, a book into loose pages); it cannot function until repaired.`,
    medium: `Unmake one object (or up to 3 small objects) into basic parts (e.g., a blanket into yarn, a chair into boards and nails); it cannot function until repaired.`,
    large: `Unmake one large object (or a tightly connected set of objects) into basic parts (e.g., a couch into fabric and frame, a door into planks and hardware); it cannot function until repaired.`,
  },
] satisfies SpellTag[];
