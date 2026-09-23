// Pure tracker rules: what a lane costs, whether it can be paid, and how paying it changes state.
// Components never mutate tracker state directly; they go through commit() in useTracker.
import type { Card, Lane } from '../data/cards';
import { CANNONS, ORD, PAY, SHOT_CAP, STOCK, T, stockLabel, type CannonType, type Payload, type StockKey } from '../data/tokens';

export type Econ = 'action' | 'bonus' | 'reaction';
export type FreeSpell = 'misty' | 'whispers';
export type OrbStatus = 'held' | 'gifted' | 'self' | 'ally';

export interface Tracker {
  round: number;
  econ: Record<Econ, boolean>;
  slots: Record<number, number>; // used slots per level
  free: Record<FreeSpell, boolean>;
  conc: { name: string; round: number; dur: number } | null;
  cannon: { type: CannonType; hp: number; max: number; shots: number } | null;
  cannonFree: boolean; // the free build for this long rest has been used
  orbs: { round: number; list: { p: Payload; s: OrbStatus }[] } | null;
  pick: Payload[]; // payloads chosen for the next imbue
  stock: Record<StockKey, number>;
  beads: { light: number; sound: number };
  jug: boolean;
  taken: string[]; // lane keys ("cardId:laneIndex") done this turn
  log: { r: string; t: string }[];
}

export const freshTr = (): Tracker => ({
  round: 0, econ: { action: false, bonus: false, reaction: false }, slots: { 1: 0, 2: 0 },
  free: { misty: false, whispers: false }, conc: null, cannon: null, cannonFree: false, orbs: null,
  pick: ['oil', 'oil', 'oil'], stock: { oil: 6, acid: 2, dewar: 3, shards: 2, marbles: 1 },
  beads: { light: 0, sound: 0 }, jug: false, taken: [], log: [],
});

/** Merge a saved tracker over fresh defaults, migrating the old single bead counter. */
export function reviveTr(saved: unknown): Tracker {
  const f = freshTr();
  if (!saved || typeof saved !== 'object') return f;
  const t = saved as Partial<Tracker> & { beads?: unknown };
  const beads = typeof t.beads === 'object' && t.beads ? { ...f.beads, ...(t.beads as Tracker['beads']) } : { light: Number(t.beads) || 0, sound: 0 };
  return { ...f, ...t, econ: { ...f.econ, ...(t.econ || {}) }, stock: { ...f.stock, ...(t.stock || {}) }, beads };
}

export interface Cost {
  econ?: Econ;
  prep?: boolean; // PREP lanes only spend the action economy once combat has started
  slot?: number;
  conc?: string;
  free?: FreeSpell;
  cannon?: CannonType;
  stock?: Partial<Record<StockKey, number>> | null;
  imbue?: Payload;
  orb?: 'self' | 'ally';
  p?: Payload; // preferred payload when throwing an orb
  beads?: 'light' | 'sound';
}

type BaseCost = Omit<Cost, 'conc'> & { conc?: 1 };
const COST: Record<string, BaseCost> = {
  'Catapult': { econ: 'action', stock: { oil: 1 } },
  'Flamethrower': { econ: 'bonus', cannon: 'ft' },
  'Force Ballista': { econ: 'bonus', cannon: 'bal' },
  'Magic Stone': { econ: 'bonus' },
  'Throw orb': { econ: 'action', orb: 'self' },
  'Throw acid orb': { econ: 'action', orb: 'self', p: 'acid' },
  'Throw Dewar orb': { econ: 'action', orb: 'self', p: 'dewar' },
  'Chistera orb': { econ: 'action', stock: { oil: 1 } },
  'Chistera acid orb': { econ: 'action', stock: { acid: 1 } },
  'Oil puddle': { econ: 'action', stock: { oil: 1 } },
  'Oil orb': { econ: 'action', stock: { oil: 1 } },
  'Fire Bolt': { econ: 'action' },
  'Scorching Ray': { econ: 'action', slot: 2 },
  'Faerie Fire': { econ: 'action', slot: 1, conc: 1 },
  'Tasha’s Caustic Brew': { econ: 'action', slot: 1, conc: 1 },
  'Grease': { econ: 'action', slot: 1 },
  'Web': { econ: 'action', slot: 2, conc: 1 },
  'Pyrotechnics': { econ: 'action', slot: 2 },
  'Shatter': { econ: 'action', slot: 2 },
  'Shield': { econ: 'reaction', slot: 1 },
  'Dissonant Whispers': { econ: 'action', free: 'whispers' },
  'Misty Step': { econ: 'bonus', free: 'misty' },
  'Set the trap': { stock: { oil: 2 }, beads: 'sound' },
  'Magical Tinkering': { econ: 'action', beads: 'light' },
  'Lob a bead': { econ: 'action' },
  'Glass shards': { stock: { shards: 1 } },
  'Glass marbles': { econ: 'action', stock: { marbles: 1 } },
};

const PAYLOAD_BY_CARD: Record<string, Payload> = { pebble: 'oil', handoff: 'oil', etcher: 'acid', coldsnap: 'dewar' };

/** What a lane spends, or null for reference-only lanes. */
export function costFor(cardId: string, ln: Lane, l5: boolean): Cost | null {
  if (ln.k === 'ALLY') return { orb: 'ally' };
  if (cardId === 'acid' && ln.name === 'Magic Stone') return { econ: 'action', orb: 'self', p: 'oil' };
  if (ln.k === 'AFTER') return null;
  const b = COST[ln.name];
  if (!b) return null;
  const c: Cost = { ...b, conc: undefined, stock: b.stock ? { ...b.stock } : null };
  if (ln.k === 'ACTION') c.econ = 'action'; else if (ln.k === 'BONUS') c.econ = 'bonus'; else if (ln.k === 'REACTION') c.econ = 'reaction';
  if (ln.k === 'PREP') c.prep = true;
  if (b.conc) c.conc = ln.name;
  if (ln.name === 'Catapult') c.slot = l5 ? 2 : 1;
  if (ln.name === 'Magic Stone') c.imbue = PAYLOAD_BY_CARD[cardId] || 'oil';
  if (ln.name === 'Throw orb') c.p = PAYLOAD_BY_CARD[cardId] || 'oil';
  if (cardId === 'glassshot' && ln.name === 'Force Ballista') c.stock = { oil: 1 };
  return c;
}

/** Short human-readable list of what a cost spends. */
export function costChips(c: Cost): string[] {
  const out: string[] = [];
  if (c.econ) out.push(c.econ + (c.prep ? ' (in combat)' : ''));
  if (c.slot) out.push(ORD[c.slot] + ' slot');
  if (c.free) out.push('free 1/LR');
  if (c.conc) out.push('◎ conc');
  if (c.cannon) out.push(CANNONS[c.cannon][0] + ' ' + CANNONS[c.cannon][1]);
  if (c.stock) Object.entries(c.stock).forEach(([k, n]) => { const s = STOCK.find(x => x[0] === k)!; out.push(T[s[1]].g + ' ' + s[2].toLowerCase() + ' −' + n); });
  if (c.imbue) out.push('3 × ' + PAY[c.imbue][0] + ' ' + PAY[c.imbue][1].toLowerCase() + ' orbs');
  if (c.orb === 'self') out.push('orb −1');
  if (c.orb === 'ally') out.push('gifted orb −1');
  if (c.beads) out.push((c.beads === 'light' ? '☼ light' : '≋ sound') + ' bead +1');
  return out;
}

export const slotMax = (L: 4 | 5): Record<number, number> => (L === 5 ? { 1: 4, 2: 2 } : { 1: 3 });

/** Lowest available slot level at or above n, or 0 if none. Upcasts when the exact level is spent. */
export function slotAvail(tr: Tracker, n: number, L: 4 | 5): number {
  const m = slotMax(L);
  for (let lv = n; lv <= 2; lv++) if ((m[lv] || 0) - (tr.slots[lv] || 0) > 0) return lv;
  return 0;
}

export function spendSlot(tr: Tracker, n: number, L: 4 | 5): number {
  const lv = slotAvail(tr, n, L);
  if (lv) tr.slots[lv] = (tr.slots[lv] || 0) + 1;
  return lv;
}

/** Why a cost can't be paid right now, or '' if it can. */
export function check(c: Cost, tr: Tracker, L: 4 | 5): string {
  if (c.econ && (!c.prep || tr.round > 0) && tr.econ[c.econ]) return c.econ + ' used';
  if (c.cannon && (!tr.cannon || tr.cannon.type !== c.cannon)) return 'needs ' + CANNONS[c.cannon][1];
  if (c.cannon && (tr.cannon!.shots || 0) >= SHOT_CAP) return 'cannon out of shots';
  if (c.slot && !slotAvail(tr, c.slot, L)) return 'no slot left';
  if (c.free && tr.free[c.free] && !slotAvail(tr, c.free === 'misty' ? 2 : 1, L)) return 'used today';
  if (c.stock) for (const [k, n] of Object.entries(c.stock) as [StockKey, number][]) if ((tr.stock[k] || 0) < n) return 'out of ' + stockLabel(k).toLowerCase();
  if (c.imbue && (tr.stock[c.imbue] || 0) < 1) return 'out of ' + PAY[c.imbue][1].toLowerCase();
  if (c.orb === 'self' && !tr.orbs?.list.some(o => o.s === 'held')) return 'no orbs held';
  if (c.orb === 'ally' && !tr.orbs?.list.some(o => o.s === 'gifted')) return 'no gifted orbs';
  if (c.beads && tr.beads.light + tr.beads.sound >= 4) return '4 beads active';
  return '';
}

/** Pay a cost in place. Returns log notes. Assumes check() passed. */
export function apply(tr: Tracker, c: Cost, key: string, L: 4 | 5): string[] {
  const notes: string[] = [];
  if (c.econ && (!c.prep || tr.round > 0)) tr.econ[c.econ] = true;
  if (c.slot) notes.push(ORD[spendSlot(tr, c.slot, L)] + ' slot');
  if (c.free) {
    if (!tr.free[c.free]) { tr.free[c.free] = true; notes.push('free use'); }
    else notes.push(ORD[spendSlot(tr, c.free === 'misty' ? 2 : 1, L)] + ' slot');
  }
  if (c.conc) {
    if (tr.conc && tr.conc.name !== c.conc) notes.push('dropped ' + tr.conc.name);
    tr.conc = { name: c.conc, round: tr.round, dur: c.conc === 'Web' ? 600 : 10 };
  }
  if (c.stock) (Object.entries(c.stock) as [StockKey, number][]).forEach(([k, n]) => { tr.stock[k] -= n; });
  if (c.imbue) {
    if (tr.orbs?.list.some(o => o.s === 'held' || o.s === 'gifted')) notes.push('previous orbs lost magic');
    const n = Math.min(3, tr.stock[c.imbue]);
    tr.stock[c.imbue] -= n;
    tr.orbs = { round: tr.round, list: Array.from({ length: n }, () => ({ p: c.imbue!, s: 'held' as const })) };
    notes.push(n + ' orbs imbued');
  }
  if (c.orb === 'self') {
    const list = tr.orbs!.list;
    let i = list.findIndex(o => o.s === 'held' && o.p === c.p);
    if (i < 0) i = list.findIndex(o => o.s === 'held');
    list[i].s = 'self';
    notes.push(PAY[list[i].p][1].toLowerCase() + ' orb');
  }
  if (c.orb === 'ally') tr.orbs!.list.find(o => o.s === 'gifted')!.s = 'ally';
  if (c.beads) tr.beads[c.beads] += 1;
  if (c.cannon && tr.cannon) { tr.cannon.shots = (tr.cannon.shots || 0) + 1; notes.push('shot ' + tr.cannon.shots + '/' + SHOT_CAP); }
  tr.taken.push(key);
  return notes;
}

export type StepKind = 'info' | 'done' | 'blocked' | 'run' | 'skip';
export interface PlanStep { li: number; cost: Cost | null; key: string; kind: StepKind; why?: string }

export const clone = <X>(x: X): X => JSON.parse(JSON.stringify(x));

/**
 * Walk a play's lanes in order against a simulated tracker, so each selected step
 * sees the costs of the steps before it (two action steps: the second is blocked).
 */
export function plan(card: Card, sel: Record<number, boolean>, tr: Tracker, L: 4 | 5): PlanStep[] {
  const sim = clone(tr), l5 = L === 5, locked = !!card.l5only && !l5;
  return card.lanes.map((ln, li) => {
    const cost = locked ? null : costFor(card.id, ln, l5), key = card.id + ':' + li;
    if (!cost) return { li, cost, key, kind: 'info' };
    if (sim.taken.includes(key)) return { li, cost, key, kind: 'done' };
    const why = check(cost, sim, L);
    if (why) return { li, cost, key, kind: 'blocked', why };
    if (sel[li]) { apply(sim, cost, key, L); return { li, cost, key, kind: 'run' }; }
    return { li, cost, key, kind: 'skip' };
  });
}

/** Lanes selected by default when a play dialog opens: everything except ALT options. */
export const defaultSel = (card: Card) => Object.fromEntries(card.lanes.flatMap((ln, li) => (ln.k !== 'ALT' ? [[li, true]] : [])));

/** Clears the action economy and per-turn "taken" marks. */
export function resetTurn(t: Tracker) {
  t.econ = { action: false, bonus: false, reaction: false };
  t.taken = [];
}
