import { describe, expect, it } from 'vitest';
import { buildCards } from './cards';
import { FLAVOR } from './flavor';
import { laneRows } from './mechanics';

const ctx4 = { dc: 14, atk: '+6', dex: 2, prof: 2, l5: false };
const ctx5 = { dc: 15, atk: '+7', dex: 2, prof: 3, l5: true };

describe('laneRows', () => {
  it('covers every actionable lane at both levels', () => {
    for (const [L, ctx] of [[4, ctx4], [5, ctx5]] as const) {
      for (const c of buildCards(L, 2, ctx.dc)) {
        for (const ln of c.lanes) {
          // AFTER lanes and "Alternate …" reminders are reference text; everything else must expand.
          if (ln.k === 'AFTER' || ln.name.startsWith('Alternate')) continue;
          expect(laneRows(c.id, ln, ctx), `${c.id} / ${ln.name} (L${L})`).not.toHaveLength(0);
        }
      }
    }
  });

  it('says who rolls: player d20 for attacks, DM save for save spells', () => {
    const cards = buildCards(4, 2, 14);
    const spooky = cards.find(c => c.id === 'glassfire')!;
    const kinds = (name: string) => laneRows(spooky.id, spooky.lanes.find(l => l.name === name)!, ctx4).map(r => r.k);
    expect(kinds('Catapult')).toContain('save');
    expect(kinds('Force Ballista')).toContain('roll');
    const catapultSave = laneRows(spooky.id, spooky.lanes[0], ctx4).find(r => r.k === 'save')!;
    expect(catapultSave.m).toBe('Dex DC 14');
  });

  it('resolves the Agent Orange Magic Stone lane as a throw, and Party Favors as an ally roll', () => {
    const cards = buildCards(4, 2, 14);
    const acid = cards.find(c => c.id === 'acid')!;
    const stone = acid.lanes.find(l => l.name === 'Magic Stone')!;
    expect(laneRows('acid', stone, ctx4).map(r => r.k)).toContain('roll');
    const handoff = cards.find(c => c.id === 'handoff')!;
    const ally = handoff.lanes.find(l => l.k === 'ALLY')!;
    expect(laneRows('handoff', ally, ctx4)[0].k).toBe('ally');
    expect(laneRows('handoff', ally, ctx4)[0].m).toBe('d20 +6');
  });
});

describe('FLAVOR', () => {
  it('has a read-aloud line for every lane of every card at both levels', () => {
    for (const L of [4, 5] as const) {
      for (const c of buildCards(L, 2, L === 5 ? 15 : 14)) {
        for (const ln of c.lanes) {
          expect(FLAVOR[c.id]?.[ln.name], `${c.id} / ${ln.name} (L${L})`).toBeTruthy();
        }
      }
    }
  });
});
