import { fmt, type DamageKey, type ThemeId } from './tokens';

export type LaneKind = 'ACTION' | 'BONUS' | 'REACTION' | 'PREP' | 'AFTER' | 'ALT' | 'ALLY' | 'GROUND';
export type Tag = 'free' | 'slot' | 'near' | 'far' | 'l5';
export type Badge = ['free', string?] | ['slot', string] | ['conc'] | ['l5'] | ['dm', number];

export interface Dice { e: string; p: string; a: number; t: DamageKey }
export interface Lane { k: LaneKind; q?: string; name: string; txt: string; dice: Dice[] }
export interface Card {
  id: string;
  name: string;
  use: string;
  k: DamageKey;
  tags: Tag[];
  badges: Badge[];
  lanes: Lane[];
  totals: [label: string, value: number | string][];
  note?: string;
  l5only?: boolean;
}

const ALL: Exclude<ThemeId, 'all'>[] = ['fire', 'acid', 'visibility', 'movement', 'cold'];
export const CARD_THEMES: Record<string, Exclude<ThemeId, 'all'>[]> = {
  glassfire: ['fire'], pebble: ['fire'], chistera: ['fire'], glassshot: ['fire'], handoff: ['fire'], prism: ['fire'], shatter: ['fire'],
  kill: ['fire', 'movement'], rkill: ['fire', 'movement'], acid: ['acid'], etcher: ['acid'],
  lamp: ['visibility'], blackout: ['visibility'], willie: ['visibility'], flare: ['visibility'],
  carpet: ['movement'], blackice: ['movement'], foam: ['movement'], pinball: ['movement'],
  coldsnap: ['cold'], clean: ALL,
};

export type GearKey = 'ft' | 'bal' | 'ch';
export const GEAR: Record<string, GearKey[]> = {
  glassfire: ['ft', 'bal'], pebble: ['ft', 'bal'], chistera: ['ch', 'ft', 'bal'], handoff: ['bal'], lamp: ['bal'], acid: ['bal'],
  kill: ['ft'], glassshot: ['bal'], prism: ['bal'], rkill: ['bal'], shatter: ['ft'], etcher: ['bal', 'ch'], willie: ['ft'],
  flare: ['ch'], carpet: ['ch'], blackice: ['bal'], foam: ['bal'], pinball: ['bal'], coldsnap: ['bal'],
};

/** Decision-flow situations: question, the card ids it points to. */
export const STEPS: [q: string, ids: string[]][] = [
  ['Caught in melee?', ['clean']],
  ['Target immune/resistant to fire?', ['etcher', 'acid']],
  ['Boss hard to hit and allies can capitalize?', ['lamp']],
  ['Mob swarm + time to prepare?', ['kill', 'rkill']],
  ['Enemy caster is the problem?', ['blackout']],
  ['Enemy archers or casters have clear sightlines?', ['willie', 'blackout']],
  ['Fighting in the dark, or invisible enemies?', ['flare', 'lamp']],
  ['Chokepoint or door to hold?', ['carpet', 'kill']],
  ['Something rushing the backline?', ['coldsnap', 'blackice', 'pinball']],
  ['Pack of mobs to pin down?', ['foam', 'blackice']],
  ['Mobs clustered?', ['shatter']],
  ['Boss within ~30 ft of cannon?', ['glassfire', 'pebble', 'chistera']],
  ['Boss at range?', ['glassshot', 'handoff', 'prism', 'glassfire']],
];

export interface Ruling { n: number; txt: string; plays: string; l5?: boolean }
export const RULINGS: Ruling[] = [
  { n: 1, txt: 'Glass orbs count as Magic Stone “pebbles”', plays: 'Smart Bomb · Party Favors · Pineapple · Hailstorm' },
  { n: 2, txt: 'Chistera counts as a sling (proficient)', plays: 'Fox Two' },
  { n: 3, txt: 'Shrapnel adds +1d4 piercing to chistera orbs', plays: 'Fox Two' },
  { n: 4, txt: 'A Catapulted orb that shatters coats the target in oil', plays: 'Spooky' },
  { n: 5, l5: true, txt: 'Force Ballista can fire oil orbs (same damage, adds oil)', plays: 'Glass-shot Ballista' },
  { n: 6, l5: true, txt: 'Fire Bolt can target and ignite a Web', plays: 'Ranged Welcome Mat' },
  { n: 7, l5: true, txt: 'Arcane Firearm +1d8 can apply to one Magic Stone throw', plays: 'Magic Stone (L5)' },
  { n: 8, txt: 'Payload rule: on a hit, the target takes the delivery’s damage plus the payload’s normal effect', plays: 'Pineapple · Hailstorm' },
  { n: 9, txt: 'Dewar orb is a consumable; target loses 10 ft of speed until my next turn, no damage', plays: 'Hailstorm' },
  { n: 10, txt: 'Chistera can lob area payloads (marbles, shards, beads, oil) to a point within range', plays: 'Shoes Off · Night Light' },
];

/** All play cards, with numbers for the given level and Dex modifier. */
export function buildCards(L: 4 | 5, dex: number, dc: number): Card[] {
  const l5 = L === 5;
  const D = (e: string, p: string, a: number, t: DamageKey): Dice => ({ e, p, a, t });
  const fb = l5 ? { e: '2d10 + 1d8', p: 'cantrip + firearm', a: 15.5 } : { e: '1d10', p: 'cantrip', a: 5.5 };
  const ch = 5 + dex, prof = l5 ? 3 : 2, atk = l5 ? '+7' : '+6';
  const FT = D('2d8 + 5', 'cannon + oil', 14, 'fire'), FT0 = D('2d8', 'cannon', 9, 'fire'), BAL = D('2d8', 'cannon', 9, 'force');
  const STONE = D('1d6 + 4', 'stone + Int', 7.5, 'bludg');
  const CH = D('1d4 + 1d4 + ' + dex, 'impact + shrapnel + Dex', ch, 'phys');
  const ACID = D('2d6', 'acid payload', 7, 'acid');
  const fbOil = D(fb.e + ' + 5', fb.p + ' + oil', fb.a + 5, 'fire');
  return [
    { id: 'glassfire', name: 'Spooky', use: 'Boss burst opener', k: 'fire', tags: ['slot', 'near', 'far'],
      badges: [['slot', l5 ? '2nd' : '1st'], ['dm', 4]],
      lanes: [
        { k: 'ACTION', name: 'Catapult', txt: (l5 ? 'at 2nd level through glass rod · ' : '') + 'oil orb · Dex save DC ' + dc + ' · orb shatters and oils target', dice: [l5 ? D('4d8 + 1d8', 'upcast + firearm', 22.5, 'bludg') : D('3d8', 'catapult', 13.5, 'bludg')] },
        { k: 'BONUS', q: 'near', name: 'Flamethrower', txt: 'ignites the oil', dice: [FT] },
        { k: 'BONUS', q: 'far', name: 'Force Ballista', txt: 'next turn Fire Bolt ignites oil (+5)', dice: [BAL] }],
      totals: [['near', l5 ? 36.5 : 27.5], ['far', l5 ? 31.5 : 22.5]],
      note: 'Catapult can’t move a held object: drop the orb at your feet first. Somatic only (works silenced).' },
    { id: 'pebble', name: 'Smart Bomb', use: 'Spell attack · Magic Stone orbs', k: 'fire', tags: ['free', 'near', 'far'],
      badges: [['free'], ['dm', 1]],
      lanes: [
        { k: 'PREP', q: 'bonus, pre-combat', name: 'Magic Stone', txt: 'imbue 3 oil orbs', dice: [] },
        { k: 'ACTION', name: 'Throw orb', txt: '60 ft · spell atk ' + atk + ' · target oiled', dice: [STONE] },
        { k: 'BONUS', q: 'near', name: 'Flamethrower', txt: 'ignites the oil', dice: [FT] },
        { k: 'ALT', q: 'far', name: 'Alternate turns', txt: 'orb + Ballista (16.5) · then Fire Bolt ignite + Ballista (' + fmt(fb.a + 14) + ')', dice: [] }],
      totals: [['near', 21.5], ['far', (16.5 + fb.a + 14) / 2]],
      note: l5 ? 'L5: Fire Bolt route (24.5) wins; use orbs vs fire immunity or hand them off.' : '' },
    { id: 'chistera', name: 'Fox Two', use: 'Weapon attack · chistera, no slots', k: 'fire', tags: ['free', 'near', 'far'],
      badges: [['free'], ['dm', 2], ['dm', 3]],
      lanes: [
        { k: 'ACTION', name: 'Chistera orb', txt: 'atk +' + (dex + prof) + ' · 30/120 ft · target oiled', dice: [CH] },
        { k: 'BONUS', q: 'near', name: 'Flamethrower', txt: 'ignites the oil', dice: [FT] },
        { k: 'ALT', q: 'far', name: 'Alternate with Fire Bolt ignite', txt: 'orb + Ballista (' + fmt(ch + 9) + ') · then Fire Bolt + Ballista (' + fmt(fb.a + 14) + ')', dice: [] },
        { k: 'GROUND', name: 'Oil puddle', txt: 'shatter orb on the floor · 5-ft square · lasts 2 rounds once lit', dice: [D('5', 'per entry / turn end', 5, 'fire')] }],
      totals: [['near', ch + 14], ['far', (ch + 9 + fb.a + 14) / 2]] },
    { id: 'glassshot', l5only: true, name: 'Glass-shot Ballista', use: 'Sustained ranged, any range', k: 'force', tags: ['free', 'near', 'far', 'l5'],
      badges: [['free'], ['dm', 5], ['l5']],
      lanes: [
        { k: 'BONUS', q: 'first', name: 'Force Ballista', txt: 'fires an oil orb · target oiled', dice: [BAL] },
        { k: 'ACTION', name: 'Fire Bolt', txt: '120 ft · ignites the oil', dice: [D('2d10 + 1d8 + 5', 'cantrip + firearm + oil', 20.5, 'fire')] }],
      totals: [['per turn', 29.5]], note: 'Baseline is 24.5.' },
    { id: 'handoff', name: 'Party Favors', use: 'Team damage', k: 'fire', tags: ['free', 'near', 'far'],
      badges: [['free'], ['dm', 1]],
      lanes: [
        { k: 'PREP', q: 'pre-combat', name: 'Magic Stone', txt: 'imbue 3 oil orbs, give to an ally without a good ranged attack', dice: [] },
        { k: 'ALLY', q: 'action', name: 'Throw orb', txt: 'uses your ' + atk + ' · 60 ft · target oiled', dice: [STONE] },
        { k: 'ACTION', name: 'Fire Bolt', txt: 'on the oiled target', dice: [fbOil] },
        { k: 'BONUS', name: 'Force Ballista', txt: '', dice: [BAL] }],
      totals: [['you', fb.a + 14], ['+ ally', fb.a + 14 + 7.5]] },
    { id: 'prism', l5only: true, name: 'Prism Ray', use: 'Boss burst', k: 'fire', tags: ['slot', 'near', 'far', 'l5'],
      badges: [['slot', '2nd'], ['l5']],
      lanes: [
        { k: 'ACTION', name: 'Scorching Ray', txt: 'refracted through a glass prism · 3 rays, 3 attack rolls', dice: [D('3 × 2d6 + 1d8 + 5', 'rays + firearm on one ray + oil if oiled', 30.5, 'fire')] },
        { k: 'BONUS', name: 'Force Ballista', txt: '', dice: [BAL] }],
      totals: [['all hit', 39.5]] },
    { id: 'lamp', name: 'Fox One', use: 'Hard-to-hit boss', k: 'control', tags: ['slot', 'near', 'far'],
      badges: [['slot', '1st'], ['conc']],
      lanes: [
        { k: 'ACTION', name: 'Faerie Fire', txt: 'luminous glass dust · 20-ft cube · Dex save DC ' + dc + ' · attacks vs targets have advantage', dice: [] },
        { k: 'BONUS', name: 'Force Ballista', txt: 'with advantage', dice: [BAL] },
        { k: 'AFTER', q: '1 min', name: 'Everyone', txt: 'party, Fire Bolt and cannon all attack with advantage', dice: [] }],
      totals: [['turn 1', 9]] },
    { id: 'acid', name: 'Agent Orange', use: 'Fire-immune enemies', k: 'acid', tags: ['slot', 'near', 'far'],
      badges: [['slot', '1st'], ['conc']],
      lanes: [
        { k: 'ACTION', name: 'Tasha’s Caustic Brew', txt: '30-ft line · Dex save DC ' + dc + ' · ticks at the start of each of its turns until scraped off (action)', dice: l5 ? [D('2d4 + 1d8', 'per turn + firearm on first tick', 9.5, 'acid')] : [D('2d4', 'per turn', 5, 'acid')] },
        { k: 'BONUS', name: 'Force Ballista', txt: '', dice: [BAL] },
        { k: 'AFTER', name: 'Magic Stone', txt: 'throw', dice: [STONE] }],
      totals: [['turn 1', l5 ? 18.5 : 14]] },
    { id: 'kill', name: 'Welcome Mat', use: 'Mob swarm, prep time', k: 'fire', tags: ['free', 'slot', 'near'],
      badges: l5 ? [['slot', '0–2'], ['conc']] : [['slot', '0–2']],
      lanes: [
        { k: 'PREP', q: 'before combat', name: 'Set the trap', txt: 'Snare the chokepoint · Magical Tinkering bead (recorded footsteps/voices) to lure · shatter oil orbs on the floor · pre-place Flamethrower cannon near the chokepoint', dice: [] },
        l5 ? { k: 'ACTION', name: 'Web', txt: 'instead of Grease · burns when lit', dice: [D('2d4', 'burning web, each turn start', 5, 'fire')] }
           : { k: 'ACTION', q: 'optional', name: 'Grease', txt: 'the approach', dice: [] },
        { k: 'BONUS', name: 'Flamethrower', txt: 'cone + lights the oil', dice: [FT0, D('5', 'burning oil, per entry / turn end · 2 rounds', 5, 'fire')] }],
      totals: [['cone', 9]] },
    { id: 'rkill', l5only: true, name: 'Ranged Welcome Mat', use: 'Mob at range', k: 'fire', tags: ['slot', 'far', 'l5'],
      badges: [['slot', '2nd'], ['conc'], ['dm', 6], ['l5']],
      lanes: [
        { k: 'ACTION', q: 'turn 1', name: 'Web', txt: '60 ft · 20-ft cube · Dex save DC 15 or restrained', dice: [] },
        { k: 'ACTION', q: 'turn 2', name: 'Fire Bolt', txt: 'ignites the web from up to 120 ft', dice: [D('2d4', 'burning web, each turn start', 5, 'fire')] },
        { k: 'BONUS', name: 'Force Ballista', txt: 'cannon stays safe with you', dice: [BAL] }],
      totals: [] },
    { id: 'blackout', l5only: true, name: 'Blackout', use: 'Shut down a caster', k: 'control', tags: ['slot', 'free', 'near', 'far', 'l5'],
      badges: [['slot', '2nd'], ['free', 'or 1/LR'], ['l5']],
      lanes: [
        { k: 'ACTION', q: 'A · slot', name: 'Pyrotechnics', txt: 'light an oil puddle near the caster, then use that fire · Con save DC 15 or blinded until end of your next turn (all within 10 ft of the flame), or a 20-ft smoke cloud', dice: [] },
        { k: 'ACTION', q: 'B · free 1/LR', name: 'Dissonant Whispers', txt: 'Wis save DC 15 · half on success · on a fail it flees, provoking opportunity attacks from allies', dice: [D('3d6', 'spell', 10.5, 'psychic')] }],
      totals: [], note: 'If the cannon is within 15 ft of the puddle, Flamethrower lights it as your bonus action and Pyrotechnics goes off the same turn.' },
    { id: 'shatter', l5only: true, name: 'Shatterpoint', use: 'Clustered mobs', k: 'thunder', tags: ['slot', 'near', 'l5'],
      badges: [['slot', '2nd'], ['l5']],
      lanes: [
        { k: 'ACTION', name: 'Shatter', txt: 'through glass rod · 10-ft burst · Con save DC 15, half on success', dice: [D('3d8 + 1d8', 'spell + firearm', 18, 'thunder')] },
        { k: 'BONUS', name: 'Flamethrower', txt: 'on survivors', dice: [FT0] }],
      totals: [['per target', 27]] },
    { id: 'etcher', name: 'Pineapple', use: 'Fire-immune boss, no slots', k: 'acid', tags: ['free', 'near', 'far'],
      badges: [['free'], ['dm', 1], ['dm', 8]],
      lanes: [
        { k: 'PREP', q: 'bonus, pre-combat', name: 'Magic Stone', txt: 'imbue acid orbs', dice: [] },
        { k: 'ACTION', name: 'Throw acid orb', txt: '60 ft · spell atk ' + atk, dice: [STONE, ACID] },
        { k: 'BONUS', name: 'Force Ballista', txt: '', dice: [BAL] },
        { k: 'ALT', q: 'chistera', name: 'Chistera acid orb', txt: 'atk +' + (dex + prof) + ' · plus the acid payload', dice: [CH, ACID] }],
      totals: [['per turn', 23.5]],
      note: 'L4 baseline 14.5 · L5 baseline 24.5: about even, but acid gets past fire resistance. Jug: 2 free vials/day, then 25 gp each.' },
    { id: 'willie', l5only: true, name: 'Willie Pete', use: 'Blind their archers and casters', k: 'obscure', tags: ['slot', 'near', 'far', 'l5'],
      badges: [['slot', '2nd'], ['l5']],
      lanes: [
        { k: 'ACTION', q: 'turn 1', name: 'Oil orb', txt: 'shatter near the enemy backline, creating a 5-ft puddle', dice: [] },
        { k: 'BONUS', q: 'turn 1', name: 'Flamethrower', txt: 'lights the puddle if the cannon can get within 15 ft', dice: [D('5', 'burning oil, per entry / turn end', 5, 'fire')] },
        { k: 'ACTION', q: 'turn 2', name: 'Pyrotechnics', txt: 'smoke option: 20-ft radius heavily obscured for 1 min; puts out the source flame', dice: [] }],
      totals: [],
      note: 'No cannon in reach? Light it with Fire Bolt and cast Pyrotechnics a turn later. At L4, a crafted Eversmoking Bottle (Uncommon, 500 gp, 20 days, 60-ft cloud) does the job. Siris has no darkvision, and darkvision doesn’t see through smoke anyway.' },
    { id: 'flare', name: 'Night Light', use: 'Dark tombs, hidden enemies', k: 'light', tags: ['free', 'near', 'far'],
      badges: [['free'], ['dm', 10]],
      lanes: [
        { k: 'PREP', q: 'before combat', name: 'Magical Tinkering', txt: 'up to 4 glowing glass beads (action each, tinker’s tools)', dice: [] },
        { k: 'ACTION', name: 'Lob a bead', txt: 'chistera or hand throw lights a spot · 5 ft bright + 5 ft dim', dice: [] },
        { k: 'AFTER', name: 'Fox One', txt: 'Faerie Fire reveals invisible creatures', dice: [] }],
      totals: [],
      note: 'Permanent option at L5: Continual Flame (2nd slot, 50 gp ruby dust consumed) sealed in a glass sphere.' },
    { id: 'carpet', name: 'Shoes Off', use: 'Hold a chokepoint', k: 'move', tags: ['free', 'near'],
      badges: [['free'], ['dm', 10]],
      lanes: [
        { k: 'PREP', q: 'before combat', name: 'Glass shards', txt: 'spread across a 5-ft door or stair', dice: [] },
        { k: 'AFTER', name: 'Anyone crossing at full speed', txt: 'Dex DC 15 (fixed) or stop moving, lose 10 ft speed until healed', dice: [D('1', 'shards', 1, 'pierce')] },
        { k: 'ALT', name: 'Glass marbles', txt: '10-ft square, Dex DC 10 (fixed) or prone', dice: [] }],
      totals: [],
      note: 'Deploying at range with the chistera needs DM? 10. By default, spreading takes an action at your feet.' },
    { id: 'blackice', name: 'Grease Gun', use: 'Knock the rush flat for your melee', k: 'move', tags: ['slot', 'near', 'far'],
      badges: [['slot', '1st']],
      lanes: [
        { k: 'BONUS', q: 'first', name: 'Force Ballista', txt: 'push target 5 ft away from the cannon into the zone', dice: [BAL] },
        { k: 'ACTION', name: 'Grease', txt: '10-ft square · Dex DC ' + dc + ' or prone · difficult terrain · re-save on entering or ending a turn there', dice: [] },
        { k: 'AFTER', name: 'Melee allies', txt: 'advantage vs prone targets', dice: [] }],
      totals: [['turn 1', 9]],
      note: 'Fire the Ballista BEFORE the Grease: ranged attacks vs prone targets have disadvantage, including yours. Follow up with saves instead (Flamethrower, Catapult, Caustic Brew).' },
    { id: 'foam', l5only: true, name: 'Sticky Foam', use: 'Pin a pack in place', k: 'move', tags: ['slot', 'near', 'far', 'l5'],
      badges: [['slot', '2nd'], ['conc'], ['l5']],
      lanes: [
        { k: 'ACTION', name: 'Web', txt: '60 ft · 20-ft cube · Dex DC ' + dc + ' or restrained · must be anchored or laid across floor/walls', dice: [] },
        { k: 'BONUS', name: 'Force Ballista', txt: 'with advantage', dice: [BAL] },
        { k: 'AFTER', name: 'Everyone', txt: 'advantage vs restrained targets; their Dex saves have disadvantage, so follow with Flamethrower or Catapult', dice: [] }],
      totals: [['turn 1', 9]],
      note: 'Webs are flammable: see Welcome Mat to burn them.' },
    { id: 'pinball', name: 'Kettle', use: 'Shove them into your hazards', k: 'move', tags: ['free', 'near', 'far'],
      badges: [['free']],
      lanes: [
        { k: 'BONUS', name: 'Force Ballista', txt: 'pushes 5 ft away from the cannon', dice: [BAL] },
        { k: 'AFTER', name: 'Into a hazard', txt: 'glass shards (1 piercing + stop), burning oil (5 fire), or off a ledge', dice: [] }],
      totals: [['per turn', '9 + hazard']],
      note: 'Position the cannon on the far side of the target: the push goes away from the cannon, not from you.' },
    { id: 'coldsnap', name: 'Hailstorm', use: 'Stop the charge at your backline', k: 'cold', tags: ['free', 'near', 'far'],
      badges: [['free'], ['dm', 1], ['dm', 9]],
      lanes: [
        { k: 'PREP', q: 'bonus, pre-combat', name: 'Magic Stone', txt: 'imbue Dewar orbs', dice: [] },
        { k: 'ACTION', name: 'Throw Dewar orb', txt: '60 ft · spell atk ' + atk + ' · target loses 10 ft of speed until your next turn', dice: [STONE] },
        { k: 'BONUS', name: 'Force Ballista', txt: 'pushes 5 ft', dice: [BAL] }],
      totals: [['per turn', 16.5]],
      note: 'Charging enemies lose ~15 ft of ground per turn. Stacks well with Grease Gun. Cold is your thinnest theme: real cold damage needs a cantrip swap (Ray of Frost or Frostbite).' },
    { id: 'clean', name: 'Dust Off', use: 'Escape melee', k: 'psychic', tags: ['free', 'near'],
      badges: [['free', 'mostly']],
      lanes: [
        { k: 'REACTION', name: 'Shield', txt: '+5 AC until your next turn · 1st-level slot', dice: [] },
        { k: 'ACTION', name: 'Dissonant Whispers', txt: 'free 1/LR · Wis save DC ' + dc + ' · target flees', dice: [D('3d6', 'spell', 10.5, 'psychic')] },
        { k: 'BONUS', q: 'last resort', name: 'Misty Step', txt: 'free 1/LR · 30 ft · costs this turn’s cannon shot', dice: [] }],
      totals: [] },
  ];
}
