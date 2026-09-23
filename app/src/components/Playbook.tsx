import { forwardRef } from 'react';
import { GEAR, STEPS, type Card, type Tag } from '../data/cards';
import { CANNONS, DARKTXT, INK, MUTED, SETTINGS, SHOW_L5, T, THEMES, fmt, tint, type CannonType, type ThemeId } from '../data/tokens';
import { check, costChips, costFor, type Tracker } from '../tracker/logic';
import { BadgeChip, DiceRow, LaneTag, TierHeader, badgeStyle } from './bits';

const GEAR_LBL = { ft: ['▲', 'Flamethrower', T.fire.c], bal: ['◆', 'Force Ballista', T.force.c], ch: ['■', 'Chistera', 'oklch(0.84 0.01 260)'] } as const;

/** "Needs Flamethrower · you have Force Ballista" when the built cannon can't run this play. */
export function cannonGate(c: Card, tr: Tracker): string {
  const needs = [...new Set(c.lanes.map(ln => (ln.name === 'Flamethrower' ? 'ft' : ln.name === 'Force Ballista' ? 'bal' : null)).filter(Boolean))] as CannonType[];
  if (!needs.length || !tr.cannon || needs.includes(tr.cannon.type)) return '';
  return 'Needs ' + needs.map(n => CANNONS[n][1]).join(' or ') + ' · you have ' + CANNONS[tr.cannon.type][1];
}

interface Props {
  cards: (Card & { themes: string[] })[];
  L: 4 | 5;
  tr: Tracker;
  appr: Record<number, boolean>;
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  filters: Tag[];
  setFilters: (f: Tag[]) => void;
  step: number | null;
  selectStep: (i: number) => void;
  clearAll: () => void;
  flowOpen: boolean;
  toggleFlow: () => void;
  onOpen: (c: Card) => void;
}

export const Playbook = forwardRef<HTMLElement, Props>(function Playbook(p, ref) {
  const { cards, L, tr, appr, theme, filters, step } = p;
  const l5 = L === 5;
  const byId = Object.fromEntries(cards.map(c => [c.id, c]));
  const focus = step === null ? null : STEPS[step][1];

  // Situations whose plays are all hidden (L5-only) drop out, and the rest renumber.
  const steps = STEPS.map(([q, ids], i) => ({ i, q, ids: ids.filter(id => byId[id]) })).filter(s => s.ids.length);

  const chips: [Tag, string][] = [['free', 'Free'], ['slot', 'Uses slot'], ['near', 'Near ≤30 ft'], ['far', 'Far']];
  if (SHOW_L5) chips.push(['l5', 'Level 5 only']);

  const cols = SETTINGS.columns;
  const gridCols = cols === 'auto' ? 'repeat(auto-fill, minmax(272px, 1fr))' : `repeat(${cols}, minmax(0, 1fr))`;

  return (
    <section className="tier" aria-label="Tier II Playbook" ref={ref}>
      <TierHeader n="II" title="Playbook" sub="Run the play" gem="oklch(0.80 0.15 150 / 0.30)" />
      <div className="tabs" role="tablist">
        {THEMES.map(([id, label, k]) => {
          const on = theme === id, c = k ? T[k].c : 'oklch(0.84 0.01 260)';
          return (
            <button key={id} role="tab" aria-selected={on} className="tab" onClick={() => p.setTheme(id)}
              style={{ background: on ? (k ? tint(k) : 'oklch(0.84 0.01 260 / 0.14)') : 'transparent', color: on ? INK : MUTED, borderBottomColor: on ? c : 'transparent' }}>
              <span className="g" style={{ color: c }}>{k ? T[k].g : '◇'}</span>{label}
              <span className="n">{cards.filter(x => id === 'all' || x.themes.includes(id)).length}</span>
            </button>
          );
        })}
      </div>

      <div className="flow">
        <button className="flow-toggle" onClick={p.toggleFlow} aria-expanded={p.flowOpen}>
          <span className="flow-chev">{p.flowOpen ? '▾' : '▸'}</span>
          <span className="flow-title">Decision flow</span>
          <span className="flow-hint">{p.flowOpen ? 'Tap a situation to highlight its plays across all themes' : 'Show situations'}</span>
        </button>
        {p.flowOpen && (
          <div className="flow-grid">
            {steps.map((s, j) => {
              const active = step === s.i;
              return (
                <button key={s.i} className="flow-step" onClick={() => p.selectStep(s.i)} aria-pressed={active}
                  style={{ background: active ? 'oklch(0.80 0.15 65 / 0.22)' : 'oklch(0.215 0.008 260)', boxShadow: `0 0 0 ${active ? '2px' : '1px'} ${active ? T.fire.c : 'oklch(0.36 0.01 260)'}` }}>
                  <span className="flow-num">{j + 1}</span>
                  <span className="flow-body">
                    <span style={{ fontWeight: 700 }}>{s.q}</span>
                    <span className="flow-plays">
                      {s.ids.map(id => {
                        const c = byId[id], lock = !!c.l5only && !l5;
                        return <span key={id} style={{ color: lock ? 'oklch(0.58 0.01 260)' : INK, textDecoration: lock ? 'line-through' : 'none' }}>→ {c.name + (c.l5only ? ' (L5)' : '')}</span>;
                      })}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="filter-row">
        {chips.map(([id, label]) => {
          const on = filters.includes(id);
          return (
            <button key={id} className="chip" aria-pressed={on} onClick={() => p.setFilters(on ? filters.filter(x => x !== id) : [...filters, id])}
              style={{ background: on ? 'oklch(0.90 0.01 80)' : 'oklch(0.215 0.008 260)', color: on ? DARKTXT : INK, borderColor: on ? 'oklch(0.90 0.01 80)' : 'oklch(0.40 0.01 260)' }}>
              {on ? '✓' : ''} {label}
            </button>
          );
        })}
        {(filters.length > 0 || step !== null) && (
          <button className="chip-clear" onClick={p.clearAll}>
            ✕ Clear {step !== null ? 'step ' + (step + 1) + (filters.length ? ' + filters' : '') : 'filters'}
          </button>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: gridCols }}>
        {cards.map(c => {
          const locked = !!c.l5only && !l5;
          const gate = cannonGate(c, tr);
          const match = filters.every(f => c.tags.includes(f));
          const inFocus = !focus || focus.includes(c.id);
          const inTheme = theme === 'all' || c.themes.includes(theme);
          const hide = !inTheme || (!match && SETTINGS.filterBehavior === 'hide') || (locked && SETTINGS.lockedCards === 'hide');
          if (hide) return null;
          const dim = locked || !match;
          const ringOn = !!focus && inFocus;
          return (
            <article key={c.id} className="card" role="button" tabIndex={0} aria-label={'Open ' + c.name}
              onClick={() => p.onOpen(c)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.onOpen(c); } }}
              style={{ opacity: dim ? 0.32 : gate ? 0.5 : inFocus ? 1 : 0.55, boxShadow: `0 0 0 ${ringOn ? '2px' : '1px'} ${ringOn ? T.fire.c : 'oklch(0.36 0.01 260)'}` }}>
              <div className="card-head" style={{ background: tint(c.k) }}>
                <div className="card-id">
                  <div className="card-name-row"><span className="g" style={{ color: T[c.k].c }}>{T[c.k].g}</span><span className="card-name">{c.name}</span></div>
                  <div className="card-use">{c.use}</div>
                  <div className="gear-row">
                    {(GEAR[c.id] || []).map(g => (
                      <span key={g} className="gear" style={{ borderColor: GEAR_LBL[g][2] }}><span style={{ color: GEAR_LBL[g][2] }}>{GEAR_LBL[g][0]}</span>{GEAR_LBL[g][1]}</span>
                    ))}
                  </div>
                </div>
                <div className="totals">
                  {c.totals.map(([l, v]) => (
                    <div key={l} className="total"><span className="total-l">{l}</span><span className="total-v">≈{typeof v === 'number' ? fmt(v) : v}</span></div>
                  ))}
                </div>
              </div>
              <div className="badges">{c.badges.map((b, i) => <BadgeChip key={i} b={badgeStyle(b, appr)} />)}</div>
              {gate && <div className="gate">{gate}</div>}
              {c.lanes.map((ln, li) => {
                const cost = locked ? null : costFor(c.id, ln, l5), key = c.id + ':' + li;
                const taken = tr.taken.includes(key), why = cost && !taken ? check(cost, tr, L) : '';
                return (
                  <div key={li} className="lane" style={{ background: taken ? 'oklch(0.80 0.15 150 / 0.12)' : 'transparent', opacity: cost && why ? 0.6 : 1 }}>
                    <LaneTag k={ln.k} q={ln.q} />
                    <div className="lane-body">
                      <div className="lane-txt"><b>{ln.name}</b> <span>{ln.txt}</span></div>
                      {ln.dice.map((d, i) => <DiceRow key={i} d={d} />)}
                      {cost && (
                        <div className="lane-cost">
                          <span className="c">Costs {costChips(cost).join(' · ')}</span>
                          <span className="s" style={{ color: taken ? T.acid.c : why ? T.fire.c : 'oklch(0.62 0.01 260)' }}>{taken ? '✓ taken' : why}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {c.note && <div className="card-note">{c.note}</div>}
              {locked && <div className="card-locked">Unlocks at Level 5 · numbers shown at L5</div>}
            </article>
          );
        })}
      </div>
    </section>
  );
});
