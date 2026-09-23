import { describe, expect, it } from 'vitest';
import { buildCards } from '../data/cards';
import { SHOT_CAP } from '../data/tokens';
import { apply, check, costFor, defaultSel, freshTr, plan, reviveTr } from './logic';

const cards = buildCards(4, 2, 14);
const card = (id: string) => cards.find(c => c.id === id)!;

describe('plan', () => {
  it('blocks cannon steps until the matching cannon is built', () => {
    const spooky = card('glassfire');
    const steps = plan(spooky, defaultSel(spooky), freshTr(), 4);
    expect(steps.map(s => s.kind)).toEqual(['run', 'blocked', 'blocked']);
    expect(steps[1].why).toBe('needs Flamethrower');
  });

  it('checks steps in order, so a second bonus action is blocked', () => {
    const tr = freshTr();
    tr.cannon = { type: 'ft', hp: 20, max: 20, shots: 0 };
    const spooky = card('glassfire');
    const steps = plan(spooky, defaultSel(spooky), tr, 4);
    expect(steps.map(s => s.kind)).toEqual(['run', 'run', 'blocked']);
    expect(steps[2].why).toBe('bonus used');
  });

  it('leaves ALT lanes unselected and AFTER lanes as reference', () => {
    const smart = card('pebble');
    expect(defaultSel(smart)).toEqual({ 0: true, 1: true, 2: true });
    const lamp = card('lamp');
    expect(plan(lamp, defaultSel(lamp), freshTr(), 4)[2].kind).toBe('info');
  });

  it('marks lanes already taken this turn as done', () => {
    const tr = freshTr();
    tr.taken = ['clean:0'];
    expect(plan(card('clean'), { 0: true }, tr, 4)[0].kind).toBe('done');
  });
});

describe('apply', () => {
  it('Catapult spends the action, a 1st-level slot and an oil flask', () => {
    const tr = freshTr();
    const notes = apply(tr, costFor('glassfire', card('glassfire').lanes[0], false)!, 'glassfire:0', 4);
    expect(tr.econ.action).toBe(true);
    expect(tr.slots[1]).toBe(1);
    expect(tr.stock.oil).toBe(5);
    expect(notes).toContain('1st slot');
  });

  it('PREP lanes do not spend action economy out of combat', () => {
    const tr = freshTr();
    apply(tr, costFor('pebble', card('pebble').lanes[0], false)!, 'pebble:0', 4);
    expect(tr.econ.bonus).toBe(false);
    expect(tr.orbs?.list).toHaveLength(3);
    expect(tr.stock.oil).toBe(3);
  });

  it('re-imbuing Magic Stone notes that the old orbs lost their magic', () => {
    const tr = freshTr();
    const c = costFor('pebble', card('pebble').lanes[0], false)!;
    apply(tr, c, 'a', 4);
    expect(apply(tr, c, 'b', 4)).toContain('previous orbs lost magic');
  });

  it('throwing prefers an orb with the play’s payload', () => {
    const tr = freshTr();
    tr.orbs = { round: 0, list: [{ p: 'oil', s: 'held' }, { p: 'acid', s: 'held' }] };
    apply(tr, costFor('etcher', card('etcher').lanes[1], false)!, 'etcher:1', 4);
    expect(tr.orbs.list.map(o => o.s)).toEqual(['held', 'self']);
  });

  it('a free 1/LR spell falls back to a slot once used', () => {
    const tr = freshTr();
    const whispers = costFor('clean', card('clean').lanes[1], false)!;
    expect(apply(tr, whispers, 'a', 4)).toContain('free use');
    tr.econ.action = false;
    expect(check(whispers, tr, 4)).toBe('');
    expect(apply(tr, whispers, 'b', 4)).toContain('1st slot');
  });

  it('cannon shots count toward the cap', () => {
    const tr = freshTr();
    tr.cannon = { type: 'bal', hp: 20, max: 20, shots: SHOT_CAP };
    expect(check(costFor('lamp', card('lamp').lanes[1], false)!, tr, 4)).toBe('cannon out of shots');
  });
});

describe('check', () => {
  it('reports the first missing resource', () => {
    const tr = freshTr();
    tr.slots[1] = 3;
    expect(check(costFor('lamp', card('lamp').lanes[0], false)!, tr, 4)).toBe('no slot left');
    tr.stock.oil = 0;
    expect(check(costFor('chistera', card('chistera').lanes[0], false)!, tr, 4)).toBe('out of oil flasks');
  });

  it('caps Tinkering beads at 4 across both modes', () => {
    const tr = freshTr();
    tr.beads = { light: 2, sound: 2 };
    expect(check(costFor('flare', card('flare').lanes[0], false)!, tr, 4)).toBe('4 beads active');
  });
});

describe('reviveTr', () => {
  it('migrates the old single bead counter and fills missing fields', () => {
    const tr = reviveTr({ round: 2, beads: 3, stock: { oil: 1 } });
    expect(tr.beads).toEqual({ light: 3, sound: 0 });
    expect(tr.stock).toMatchObject({ oil: 1, acid: 2 });
    expect(tr.econ).toEqual({ action: false, bonus: false, reaction: false });
  });
});
