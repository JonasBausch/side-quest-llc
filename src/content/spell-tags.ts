import type { SpellTag } from './schema';

/**
 * Shared spell tags, referenced by id from trainings' `availableTagIds`.
 * Transcribed from docs/rules-v5.0.md ("Spell Tags" per training + the Quick
 * Index). Tags are shared across trainings and never duplicated inline; kept
 * alphabetical by id. This is the full set of 12 from the Quick Index.
 *
 * First introduced by:
 * - Field Tinkerer:     ANCHOR, OMEN, SPARK, STEP, UNRAVEL
 * - Negotiator:         BANISH, GLAMOUR
 * - Artifact Handler:   SENSE, WARDMARK
 * - Cleanup Specialist: BINDNAME, CLEANSE, SALTLINE
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
    id: 'banish',
    name: 'Banish',
    small: `Cleanse one object of possession; the presence is forced out and cannot cling to that object for a beat.`,
    medium: `Cleanse up to 3 objects, or cleanse one large object (e.g., a couch, a door, a vehicle); the presence is forced out and cannot re-enter those objects for a segment.`,
    large: `Cleanse all possessed objects within one defined room/zone; presences are forced out and cannot re-enter objects in that space for the scene.`,
  },
  {
    id: 'bindname',
    name: 'Bindname',
    small: `Choose one target; it must present as what it truly is (disguise/false shape/false category can't hold) for a beat.`,
    medium: `Choose one target; the truth-lock holds for a segment, or affects up to 3 targets for a beat.`,
    large: `Choose one source phenomenon in an entire room (one spirit, one illusion engine, one curse web); everything it projects in that room must present honestly for the scene.`,
  },
  {
    id: 'cleanse',
    name: 'Cleanse',
    small: `Reduce Wyrd by 1 in one small focus (one person/object/one 5-ft spot); the air "clears" and the pressure drops.`,
    medium: `Reduce Wyrd by 2 across a 10-ft radius area.`,
    large: `Reduce Wyrd by 3 in an entire room/zone.`,
  },
  {
    id: 'glamour',
    name: 'Glamour',
    small: `Make yourself or one item seem like a plausible replacement (staff/guest/contractor/etc.) to any observers.`,
    medium: `Make up to 3 people (you + 2) seem like a plausible replacement (e.g., a team/unit) to any observers.`,
    large: `Make the whole group or space seem like a plausible replacement to any observers.`,
  },
  {
    id: 'omen',
    name: 'Omen',
    small: `Name one specific thing you want to avoid (alarm, ambush, exposure, boundary snap, betrayal); you receive a clear sign one beat before it would occur.`,
    medium: `Name one specific thing you want to encounter; you receive a sign about that thing if available.`,
    large: `Name your intended approach for the scene (sneak, negotiate, chase, contain, extract); you learn the most likely cost of that approach and the earliest lever that can reduce it (route, target, object, or moment in the scene).`,
  },
  {
    id: 'saltline',
    name: 'Saltline',
    small: `Draw a line across one threshold (one doorway, one stairwell mouth, one window). No extraplanar creature can cross this threshold.`,
    medium: `Draw a boundary that encloses a small area (a circle around a workstation, a ritual pocket, a corner of a room). No extraplanar creature can cross this threshold.`,
    large: `Draw a boundary that encloses an entire room (or seals multiple exits of that room as one working). No extraplanar creature can cross this threshold.`,
  },
  {
    id: 'sense',
    name: 'Sense',
    small: `Get one clear read (one concrete answer) about one thing in the immediate situation.`,
    medium: `Get two reads, or one read plus directional context (near/far, above/below, toward/away).`,
    large: `Get three reads, and you may ask the primary hazard or trigger active in the room.`,
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
  {
    id: 'wardmark',
    name: 'Wardmark',
    small: `Mark one object; while marked, it cannot be possessed (possessions fails to take hold).`,
    medium: `Mark up to 3 objects, or one larger object (e.g., a couch, a door, a vehicle component); while marked, they cannot be possessed.`,
    large: `Mark all objects within one defined room/area; while marked, objects there cannot be possessed.`,
  },
] satisfies SpellTag[];
