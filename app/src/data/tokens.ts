// Design tokens: palette, damage/theme glyphs, and shared lookup tables.
// Every color keeps a glyph + text label beside it so nothing relies on color alone.

export const INK = 'oklch(0.95 0.006 80)';
export const MUTED = 'oklch(0.74 0.01 260)';
export const DARKTXT = 'oklch(0.16 0.008 260)';
export const NEUT = 'oklch(0.84 0.01 260)';

export type DamageKey =
  | 'fire' | 'force' | 'acid' | 'psychic' | 'control' | 'bludg' | 'phys'
  | 'thunder' | 'cold' | 'obscure' | 'light' | 'move' | 'pierce';

export interface Token { c: string; g: string; t: string }

export const T: Record<DamageKey, Token> = {
  fire: { c: 'oklch(0.80 0.15 65)', g: '▲', t: 'fire' },
  force: { c: 'oklch(0.74 0.14 255)', g: '◆', t: 'force' },
  acid: { c: 'oklch(0.80 0.15 150)', g: '●', t: 'acid' },
  psychic: { c: 'oklch(0.76 0.14 305)', g: '✦', t: 'psychic' },
  control: { c: 'oklch(0.76 0.14 305)', g: '◎', t: 'control' },
  bludg: { c: NEUT, g: '■', t: 'bludgeoning' },
  phys: { c: NEUT, g: '■', t: 'bludg. + pierc.' },
  thunder: { c: NEUT, g: '≋', t: 'thunder' },
  cold: { c: 'oklch(0.86 0.08 220)', g: '✱', t: 'cold' },
  obscure: { c: 'oklch(0.72 0.015 260)', g: '◐', t: 'smoke' },
  light: { c: 'oklch(0.90 0.13 95)', g: '☼', t: 'light' },
  move: { c: 'oklch(0.74 0.12 25)', g: '⬢', t: 'movement' },
  pierce: { c: NEUT, g: '▪', t: 'piercing' },
};

/** Translucent header tint for a token color. */
export const tint = (k: DamageKey) => T[k].c.replace(')', ' / 0.17)');

/** Trim to at most 2 decimals, dropping trailing zeros (27.5, 17.75, 9). */
export const fmt = (n: number) => String(Math.round(n * 100) / 100);

export type ThemeId = 'all' | 'fire' | 'acid' | 'visibility' | 'movement' | 'cold';
export const THEMES: [ThemeId, string, DamageKey | null][] = [
  ['all', 'All', null], ['fire', 'Fire', 'fire'], ['acid', 'Acid', 'acid'],
  ['visibility', 'Visibility', 'obscure'], ['movement', 'Movement', 'move'], ['cold', 'Cold', 'cold'],
];

export type Payload = 'oil' | 'acid' | 'dewar';
export const PAY: Record<Payload, [glyph: string, label: string, color: string]> = {
  oil: ['▲', 'Oil', T.fire.c],
  acid: ['●', 'Acid', T.acid.c],
  dewar: ['✱', 'Dewar', T.cold.c],
};
export const PAY_ORDER: Payload[] = ['oil', 'acid', 'dewar'];

export type CannonType = 'ft' | 'bal' | 'prot';
export const CANNONS: Record<CannonType, [glyph: string, label: string, color: string]> = {
  ft: ['▲', 'Flamethrower', T.fire.c],
  bal: ['◆', 'Force Ballista', T.force.c],
  prot: ['✚', 'Protector', T.acid.c],
};

export type StockKey = 'oil' | 'acid' | 'dewar' | 'shards' | 'marbles';
export const STOCK: [StockKey, DamageKey, string][] = [
  ['oil', 'fire', 'Oil flasks'], ['acid', 'acid', 'Acid vials'], ['dewar', 'cold', 'Dewar orbs'],
  ['shards', 'pierce', 'Shard bags'], ['marbles', 'move', 'Marble bags'],
];
export const stockLabel = (k: StockKey) => STOCK.find(x => x[0] === k)![2];

const asset = (f: string) => `${import.meta.env.BASE_URL}assets/${f}.webp`;
export const ART = {
  oil: asset('grenade-oil'), acid: asset('payload-acid'), dewar: asset('payload-dewar'),
  shards: asset('payload-shards'), marbles: asset('payload-marbles'), bead: asset('gear-bead'),
  ft: asset('cannon-flamethrower'), bal: asset('cannon-ballista'), prot: asset('cannon-protector'),
  siris: asset('siris'), chistera: asset('gear-chistera'),
};

export const ORD: Record<number, string> = { 1: '1st', 2: '2nd' };

/** Eldritch Cannon shot limit. Table rule, pending DM confirmation (RAW has no limit). */
export const SHOT_CAP = 18;

/** Level 5 content stays in the data but is hidden until Siris levels up. Flip to show it. */
export const SHOW_L5 = false;

/** Display settings the prototype exposed as component props. */
export const SETTINGS = {
  lockedCards: 'dim' as 'dim' | 'hide',
  filterBehavior: 'hide' as 'hide' | 'dim',
  columns: 'auto' as 'auto' | '3' | '4',
};
