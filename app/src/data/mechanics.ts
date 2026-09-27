// Table-facing mechanics rows for the play dialog. Each lane expands into labeled
// steps that say who rolls what: YOU ROLL (d20 attack), ALLY ROLLS, or DM SAVE
// (the target saves against your DC). Damage amounts stay in the lane's dice rows;
// these rows carry the procedure around them. Cards keep their compact one-liners.
import type { Lane } from './cards';

export type RowKind = 'roll' | 'ally' | 'save' | 'hit' | 'fail' | 'pass' | 'setup' | 'effect' | 'trigger' | 'then';
export interface MechRow { k: RowKind; m?: string; txt: string }

export const ROW_LABEL: Record<RowKind, string> = {
  roll: 'You roll', ally: 'Ally rolls', save: 'DM save', hit: 'On hit', fail: 'On fail',
  pass: 'On pass', setup: 'Setup', effect: 'Effect', trigger: 'Trigger', then: 'Then',
};

interface Ctx { dc: number; atk: string; dex: number; prof: number; l5: boolean }

const PAYLOAD_HIT: Record<string, string> = {
  oil: 'damage below · the orb shatters: target is coated in oil',
  acid: 'damage below · the acid payload splashes the target (second dice row)',
  dewar: 'damage below · target loses 10 ft of speed until your next turn (DM? 9)',
};

const throwOrb = (c: Ctx, payload: string): MechRow[] => [
  { k: 'roll', m: `d20 ${c.atk}`, txt: 'ranged spell attack · thrown 60 ft (or slung 30/120 ft with the chistera: DM? 2)' },
  { k: 'hit', txt: PAYLOAD_HIT[payload] },
];

/** Structured steps for a lane, or [] to fall back to the lane's plain text. */
export function laneRows(cardId: string, ln: Lane, c: Ctx): MechRow[] {
  // On Agent Orange the Magic Stone lane is a follow-up throw, not the imbue.
  const name = cardId === 'acid' && ln.name === 'Magic Stone' ? 'Throw orb' : ln.name;
  switch (name) {
    case 'Catapult': return [
      { k: 'setup', txt: 'drop an oil orb at your feet first — Catapult can’t move anything held or worn' },
      { k: 'save', m: `Dex DC ${c.dc}`, txt: 'one creature in the orb’s 90-ft path' },
      { k: 'fail', txt: 'full damage below · the orb shatters and coats the target in oil (DM? 4)' },
      { k: 'pass', txt: 'no damage · the orb keeps flying' }];
    case 'Flamethrower': return [
      { k: 'setup', txt: 'the cannon can walk 15 ft free as part of this bonus action · 15-ft cone' },
      { k: 'save', m: `Dex DC ${c.dc}`, txt: 'every creature in the cone' },
      { k: 'fail', txt: 'full damage below (an oiled target’s +5 is already included where shown)' },
      { k: 'pass', txt: 'half damage · either way it ignites unattended flammables (oil puddles, webs)' }];
    case 'Force Ballista': return [
      { k: 'roll', m: `d20 ${c.atk}`, txt: 'ranged spell attack · 120 ft · the cannon fires on your bonus action' },
      { k: 'hit', txt: 'damage below · the target is pushed 5 ft away from the cannon' }];
    case 'Fire Bolt': return [
      { k: 'roll', m: `d20 ${c.atk}`, txt: 'ranged spell attack · 120 ft' },
      { k: 'hit', txt: 'damage below · ignites oil coatings (+5 shown where it applies), webs and unattended flammables' }];
    case 'Magic Stone': return [
      { k: 'setup', txt: `bonus action · imbue up to 3 glass orbs for 1 min · you or allies throw them with your ${c.atk} (glass orbs as “pebbles”: DM? 1)` }];
    case 'Throw orb':
      if (ln.k === 'ALLY') return [
        { k: 'ally', m: `d20 ${c.atk}`, txt: 'the ally attacks with YOUR spell attack · thrown 60 ft' },
        { k: 'hit', txt: PAYLOAD_HIT.oil }];
      return throwOrb(c, cardId === 'etcher' ? 'acid' : 'oil');
    case 'Throw acid orb': return throwOrb(c, 'acid');
    case 'Throw Dewar orb': return throwOrb(c, 'dewar');
    case 'Chistera orb': return [
      { k: 'roll', m: `d20 +${c.dex + c.prof}`, txt: 'ranged weapon attack · 30/120 ft (chistera as a sling: DM? 2)' },
      { k: 'hit', txt: 'damage below (shrapnel +1d4: DM? 3) · target is coated in oil' }];
    case 'Chistera acid orb': return [
      { k: 'roll', m: `d20 +${c.dex + c.prof}`, txt: 'ranged weapon attack · 30/120 ft' },
      { k: 'hit', txt: PAYLOAD_HIT.acid }];
    case 'Oil puddle': return [
      { k: 'effect', txt: 'shatter an orb on the floor · 5-ft oil puddle · once lit it burns 2 rounds: 5 fire to anyone entering or ending a turn there · no roll' }];
    case 'Oil orb': return [
      { k: 'effect', txt: 'throw an oil orb at the ground near the enemy backline · makes a 5-ft puddle · no roll' }];
    case 'Faerie Fire': return [
      { k: 'save', m: `Dex DC ${c.dc}`, txt: 'every creature in a 20-ft cube, up to 60 ft away' },
      { k: 'fail', txt: 'outlined in light for 1 min · every attack roll against it has advantage · invisibility doesn’t help it' },
      { k: 'then', txt: 'concentration — hold it and the whole party keeps advantage' }];
    case 'Tasha’s Caustic Brew': return [
      { k: 'save', m: `Dex DC ${c.dc}`, txt: 'each creature in a 30-ft line, 5 ft wide' },
      { k: 'fail', txt: 'covered in acid: damage below at the start of each of its turns' },
      { k: 'then', txt: 'ends when it (or a creature next to it) spends an action scraping it off · concentration, up to 1 min' }];
    case 'Grease': return [
      { k: 'save', m: `Dex DC ${c.dc}`, txt: '10-ft square · when it appears, and again on entering or ending a turn there' },
      { k: 'fail', txt: 'falls prone · melee against it has advantage; ranged (including yours) has disadvantage' }];
    case 'Web': return [
      { k: 'save', m: `Dex DC ${c.dc}`, txt: '20-ft cube · when it appears, and on entering or starting a turn there · must be anchored or laid across a surface' },
      { k: 'fail', txt: `restrained · escaping takes an action: Str check vs DC ${c.dc}` }];
    case 'Shield': return [
      { k: 'trigger', txt: 'you’re hit by an attack (or targeted by magic missile) — call it before damage is rolled' },
      { k: 'effect', txt: '+5 AC until your next turn, including against the triggering attack · no roll' }];
    case 'Dissonant Whispers': return [
      { k: 'save', m: `Wis DC ${c.dc}`, txt: 'one creature within 60 ft (a deafened creature auto-passes)' },
      { k: 'fail', txt: 'full damage below · it spends its reaction fleeing as far as it can, provoking opportunity attacks from your allies' },
      { k: 'pass', txt: 'half damage, no movement' }];
    case 'Misty Step': return [
      { k: 'effect', txt: 'teleport up to 30 ft to a spot you can see · no roll · uses the bonus action (no cannon shot this turn)' }];
    case 'Scorching Ray': return [
      { k: 'roll', m: `3 × d20 ${c.atk}`, txt: 'three rays, a separate attack roll for each · 120 ft' },
      { k: 'hit', txt: 'damage below per ray · the firearm die rides on one ray; oil’s +5 triggers once' }];
    case 'Shatter': return [
      { k: 'save', m: `Con DC ${c.dc}`, txt: 'every creature in a 10-ft sphere, up to 60 ft away' },
      { k: 'fail', txt: 'full damage below' },
      { k: 'pass', txt: 'half damage' }];
    case 'Pyrotechnics': return [
      { k: 'setup', txt: 'target a nonmagical flame within 60 ft (your lit oil puddle) — the flame goes out' },
      { k: 'save', m: `Con DC ${c.dc}`, txt: 'fireworks option: everyone within 10 ft of the flame' },
      { k: 'fail', txt: 'blinded until the end of your next turn' },
      { k: 'effect', txt: 'or take the smoke option instead: 20-ft radius heavily obscured for 1 min, no save' }];
    case 'Set the trap': return [
      { k: 'setup', txt: 'Snare the chokepoint · set a sound bead (recorded footsteps/voices) to lure · shatter 2 oil orbs on the floor · park the Flamethrower cannon in reach' }];
    case 'Magical Tinkering': return [
      { k: 'setup', txt: 'an action + tinker’s tools per bead · up to 4 active · each sheds 5 ft bright + 5 ft dim light' }];
    case 'Lob a bead': return [
      { k: 'effect', txt: 'chistera or hand throw to light a spot (lobbing to a point: DM? 10) · no roll' }];
    case 'Glass shards': return [
      { k: 'setup', txt: 'spread across a 5-ft doorway or stair (at your feet by default; at range with the chistera: DM? 10)' },
      { k: 'save', m: 'Dex DC 15', txt: 'fixed DC, not yours · anyone crossing at full speed (half speed skips the save)' },
      { k: 'fail', txt: 'stops moving · 1 piercing · −10 ft speed until healed' }];
    case 'Glass marbles': return [
      { k: 'save', m: 'Dex DC 10', txt: 'fixed DC, not yours · anyone crossing the 10-ft square' },
      { k: 'fail', txt: 'falls prone' }];
    default: return [];
  }
}
