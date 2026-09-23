import { useEffect, useRef } from 'react';
import type { Card } from '../data/cards';
import { INK, MUTED, T, tint } from '../data/tokens';
import { costChips, plan, type StepKind, type Tracker } from '../tracker/logic';
import { BadgeChip, DiceRow, LaneTag, badgeStyle } from './bits';
import { cannonGate } from './Playbook';

// Per step state: box mark, status text, status color, row bg, row border, box border, box fill.
const ST: Record<StepKind, [string, string, string, string, string, string, string]> = {
  info: ['', 'reference', MUTED, 'transparent', 'oklch(0.28 0.01 260)', 'transparent', 'transparent'],
  done: ['✓', 'already done this turn', T.acid.c, 'oklch(0.80 0.15 150 / 0.08)', 'oklch(0.80 0.15 150 / 0.4)', T.acid.c, 'oklch(0.80 0.15 150 / 0.5)'],
  blocked: ['✕', '', T.fire.c, 'oklch(0.70 0.18 30 / 0.07)', 'oklch(0.70 0.18 30 / 0.35)', 'oklch(0.55 0.1 30)', 'transparent'],
  run: ['✓', 'will run', 'oklch(0.86 0.12 70)', 'oklch(0.80 0.15 65 / 0.12)', 'oklch(0.80 0.15 65 / 0.55)', T.fire.c, T.fire.c],
  skip: ['', 'skipped · tap to include', MUTED, 'oklch(0.215 0.008 260)', 'oklch(0.34 0.01 260)', 'oklch(0.50 0.01 260)', 'transparent'],
};

interface Props {
  card: Card;
  sel: Record<number, boolean>;
  setSel: (li: number, v: boolean) => void;
  tr: Tracker;
  L: 4 | 5;
  appr: Record<number, boolean>;
  onRun: () => void;
  onClose: () => void;
}

/** A play opened over the page: every step checked against the tracker in order, then Execute spends it all at once. */
export function PlayDialog({ card, sel, setSel, tr, L, appr, onRun, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); prev?.focus(); };
  }, [onClose]);

  const steps = plan(card, sel, tr, L);
  const locked = !!card.l5only && L !== 5;
  const gate = cannonGate(card, tr);
  const blockedN = steps.filter(x => x.kind === 'blocked').length;
  const warn = locked ? 'Unlocks at Level 5. Nothing can be spent yet.' : gate || (blockedN ? blockedN + (blockedN === 1 ? ' step is' : ' steps are') + ' unavailable right now' : '');
  const runs = steps.filter(x => x.kind === 'run');
  const spend = runs.flatMap(x => costChips(x.cost!));
  const acc = T[card.k];

  return (
    <div className="scrim" data-print-hide onClick={onClose}>
      <div className="dlg" role="dialog" aria-modal="true" aria-label={card.name} onClick={e => e.stopPropagation()}>
        <div className="dlg-head" style={{ background: tint(card.k) }}>
          <div className="card-id" style={{ gap: 3 }}>
            <div className="dlg-name-row"><span className="g" style={{ color: acc.c }}>{acc.g}</span><span className="dlg-name">{card.name}</span></div>
            <div className="dlg-use">{card.use}</div>
          </div>
          <button ref={closeRef} className="dlg-x" onClick={onClose} aria-label="Close">✕</button>
          <div className="dlg-badges">{card.badges.map((b, i) => <BadgeChip key={i} b={badgeStyle(b, appr)} />)}</div>
        </div>
        {warn && <div className="dlg-warn">{warn}</div>}
        <div className="dlg-lanes">
          {steps.map(x => {
            const ln = card.lanes[x.li], s = ST[x.kind], can = x.kind === 'run' || x.kind === 'skip';
            const toggle = () => { if (can) setSel(x.li, x.kind !== 'run'); };
            return (
              <div key={x.li} className="dlg-lane"
                role={can ? 'checkbox' : undefined} aria-checked={can ? x.kind === 'run' : undefined} tabIndex={can ? 0 : undefined}
                onClick={toggle} onKeyDown={e => { if (can && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); toggle(); } }}
                style={{ cursor: can ? 'pointer' : 'default', background: s[3], borderColor: s[4], opacity: x.kind === 'blocked' ? 0.75 : x.kind === 'info' ? 0.85 : 1 }}>
                <span className="dlg-box" style={{ borderColor: s[5], background: s[6] }}>{s[0]}</span>
                <LaneTag k={ln.k} q={ln.q} />
                <div className="dlg-lane-body">
                  <div className="dlg-lane-txt"><b>{ln.name}</b> <span>{ln.txt}</span></div>
                  {ln.dice.map((d, i) => <DiceRow key={i} d={d} />)}
                  <div className="dlg-cost">
                    <span className="c">{x.cost ? 'Costs ' + costChips(x.cost).join(' · ') : ''}</span>
                    <span className="s" style={{ color: s[2] }}>{x.kind === 'blocked' ? x.why : s[1]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {card.note && <div className="dlg-note">{card.note}</div>}
        <div className="dlg-foot">
          <div className="dlg-spend">
            <span className="caps">Will spend</span>
            <span className="v" style={{ color: runs.length ? INK : MUTED }}>{runs.length ? spend.join(' · ') : 'Nothing selected'}</span>
          </div>
          <div className="dlg-actions">
            <button className="dlg-cancel" onClick={onClose}>Cancel</button>
            <button className="dlg-run" onClick={onRun} disabled={!runs.length}
              style={runs.length
                ? { cursor: 'pointer', borderColor: 'oklch(0.86 0.13 65)', background: 'linear-gradient(oklch(0.84 0.14 68), oklch(0.74 0.15 60))', color: 'oklch(0.16 0.008 260)' }
                : { cursor: 'default', borderColor: 'oklch(0.34 0.01 260)', background: 'oklch(0.22 0.008 260)', color: MUTED }}>
              {runs.length ? 'Execute ' + runs.length + (runs.length === 1 ? ' step' : ' steps') : 'Nothing to execute'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
