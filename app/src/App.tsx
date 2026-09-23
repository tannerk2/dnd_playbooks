import { useCallback, useMemo, useRef, useState } from 'react';
import { buildCards, CARD_THEMES, type Card, type Tag } from './data/cards';
import { ART, SHOW_L5 } from './data/tokens';
import { Footer } from './components/Footer';
import { Loadout, type Stats } from './components/Loadout';
import { PlayDialog } from './components/PlayDialog';
import { Playbook } from './components/Playbook';
import { TrackerRail } from './components/TrackerRail';
import { apply, check, defaultSel, plan } from './tracker/logic';
import { useTracker } from './tracker/useTracker';
import { useSync } from './useSync';
import { usePrefs } from './usePrefs';

export default function App() {
  const [prefs, save] = usePrefs();
  const api = useTracker();
  const sync = useSync(prefs, save, api.tr, api.restore);
  const [filters, setFilters] = useState<Tag[]>([]);
  const [step, setStep] = useState<number | null>(null);
  const [dlg, setDlg] = useState<{ id: string; sel: Record<number, boolean> } | null>(null);
  const playbookRef = useRef<HTMLElement>(null);

  const L: 4 | 5 = SHOW_L5 ? prefs.level : 4;
  const l5 = L === 5;
  const stats: Stats = { l5, L, dc: l5 ? 15 : 14, atk: l5 ? '+7' : '+6', dex: prefs.dex, prof: l5 ? 3 : 2 };

  const cards = useMemo(
    () => buildCards(L, prefs.dex, stats.dc).filter(c => SHOW_L5 || !c.l5only).map(c => ({ ...c, themes: CARD_THEMES[c.id] || [] })),
    [L, prefs.dex, stats.dc],
  );
  const dlgCard = dlg && cards.find(c => c.id === dlg.id);

  const selectStep = (i: number) => {
    const active = step === i;
    save({ theme: 'all' }); // a situation can point across themes, so show them all
    setStep(active ? null : i);
    if (!active) {
      const el = playbookRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top;
      if (top > window.innerHeight * 0.5 || top < 0) window.scrollTo({ top: window.scrollY + top - 10, behavior: 'smooth' });
    }
  };

  const closeDlg = useCallback(() => setDlg(null), []);

  const runDlg = (c: Card) => {
    const runs = plan(c, dlg!.sel, api.tr, L).filter(x => x.kind === 'run');
    if (!runs.length) return;
    api.commit(t => {
      const notes: string[] = [];
      runs.forEach(x => { if (!check(x.cost!, t, L)) notes.push(...apply(t, x.cost!, x.key, L)); });
      return notes.join(' · ');
    }, c.name + ': ' + runs.map(x => c.lanes[x.li].name).join(' → '));
    setDlg(null);
  };

  return (
    <div className="page">
      <div className="main">
        <header className="top">
          <div className="top-id">
            <div className="portrait leaded-img"><img src={ART.siris} alt="Siris" /></div>
            <div className="title">Siris</div>
            <div className="subtitle">Kalashtar Artillerist Artificer · The Eighth Fold · Combat Playbook</div>
          </div>
          <div className="dex">
            <span>Dex mod <span className="edit-tag">EDIT</span></span>
            <button className="stepper" aria-label="Lower Dex modifier" onClick={() => save({ dex: Math.max(-1, prefs.dex - 1) })}>−</button>
            <span className="dex-val">{(prefs.dex >= 0 ? '+' : '') + prefs.dex}</span>
            <button className="stepper" aria-label="Raise Dex modifier" onClick={() => save({ dex: Math.min(5, prefs.dex + 1) })}>+</button>
          </div>
        </header>

        <Loadout s={stats} appr={prefs.appr} show={prefs.showLoadout} onToggle={() => save({ showLoadout: !prefs.showLoadout })} />

        <Playbook ref={playbookRef} cards={cards} L={L} tr={api.tr} appr={prefs.appr}
          theme={prefs.theme} setTheme={theme => save({ theme })}
          filters={filters} setFilters={setFilters}
          step={step} selectStep={selectStep} clearAll={() => { setFilters([]); setStep(null); }}
          flowOpen={prefs.flowOpen} toggleFlow={() => save({ flowOpen: !prefs.flowOpen })}
          onOpen={c => setDlg({ id: c.id, sel: defaultSel(c) })} />

        <div className="lead-rule" />

        <Footer appr={prefs.appr} toggle={n => save({ appr: { ...prefs.appr, [n]: !prefs.appr[n] } })} />
      </div>

      <TrackerRail api={api} L={L} sync={sync} />

      {dlgCard && (
        <PlayDialog card={dlgCard} sel={dlg!.sel} tr={api.tr} L={L} appr={prefs.appr}
          setSel={(li, v) => setDlg(d => d && { ...d, sel: { ...d.sel, [li]: v } })}
          onRun={() => runDlg(dlgCard)} onClose={closeDlg} />
      )}
    </div>
  );
}
