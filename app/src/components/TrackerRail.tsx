import { ART, CANNONS, INK, ORD, PAY, PAY_ORDER, SHOT_CAP, STOCK, T, type CannonType } from '../data/tokens';
import { resetTurn, slotAvail, slotMax, spendSlot, type Econ, type FreeSpell, type OrbStatus } from '../tracker/logic';
import type { TrackerApi } from '../tracker/useTracker';
import { Thumb } from './bits';

/** Lit/unlit toggle colors for action economy and free spells. `hue` is the oklch hue of the lit state. */
function onOff(used: boolean, hue: string) {
  return {
    background: used ? 'oklch(0.17 0.006 260)' : `linear-gradient(oklch(0.34 0.05 ${hue} / 0.9), oklch(0.26 0.03 ${hue} / 0.9))`,
    color: used ? 'oklch(0.56 0.01 260)' : 'oklch(0.96 0.01 80)',
    borderColor: used ? 'oklch(0.32 0.01 260)' : `oklch(0.72 0.13 ${hue} / 0.8)`,
    boxShadow: used ? 'inset 0 1px 3px oklch(0 0 0 / 0.5)' : `inset 0 1px 0 oklch(1 0 0 / 0.1), 0 0 10px oklch(0.75 0.14 ${hue} / 0.18)`,
    textDecoration: used ? 'line-through' : 'none',
  };
}

// Orb tile look per status: label, background, border style, border color, opacity.
const ORB_ST: Record<OrbStatus, [string, string, string, string, number]> = {
  held: ['held', 'oklch(0.28 0.01 260)', 'solid', 'oklch(0.55 0.01 260)', 1],
  gifted: ['gifted', 'oklch(0.76 0.14 305 / 0.22)', 'dashed', 'oklch(0.76 0.14 305)', 1],
  self: ['thrown', 'transparent', 'solid', 'oklch(0.36 0.01 260)', 0.4],
  ally: ['ally threw', 'transparent', 'dashed', 'oklch(0.36 0.01 260)', 0.4],
};

export function TrackerRail({ api, L }: { api: TrackerApi; L: 4 | 5 }) {
  const { tr, commit, tweak } = api;
  const inCombat = tr.round > 0;
  const m = slotMax(L);

  // Concentration: rounds left in combat (Web lasts up to an hour, so no countdown).
  let concLeft = 'active';
  if (tr.conc && inCombat) {
    const left = tr.conc.dur - (tr.round - tr.conc.round);
    concLeft = tr.conc.dur > 10 ? 'up to 1 hr' : left > 0 ? left + (left === 1 ? ' round' : ' rounds') + ' left' : 'expired';
  }

  const cn = tr.cannon;
  const canBuild = !(inCombat && tr.econ.action) && (!tr.cannonFree || !!slotAvail(tr, 1, L));
  const build = (k: CannonType) => {
    if (!canBuild) return;
    commit(t => {
      if (t.round > 0) t.econ.action = true;
      let note: string;
      if (!t.cannonFree) { t.cannonFree = true; note = 'free build'; } else note = ORD[spendSlot(t, 1, L)] + ' slot';
      t.cannon = { type: k, hp: 5 * L, max: 5 * L, shots: 0 };
      return note;
    }, 'Built ' + CANNONS[k][1]);
  };
  const hp = (n: number) => commit(t => {
    if (!t.cannon) return false;
    t.cannon.hp = Math.max(0, Math.min(t.cannon.max, t.cannon.hp + n));
    if (t.cannon.hp === 0) { t.cannon = null; return 'destroyed'; }
  }, 'Cannon ' + (n > 0 ? '+' : '') + n + ' HP');

  const ob = tr.orbs;
  const cnt = (s: OrbStatus) => (ob ? ob.list.filter(o => o.s === s).length : 0);
  let orbSub = 'not imbued';
  if (ob) {
    if (inCombat) { const left = 10 - (tr.round - ob.round); orbSub = left > 0 ? left + (left === 1 ? ' round' : ' rounds') + ' left' : 'expired'; }
    else orbSub = 'lasts 1 min';
  }
  const canImbue = !(inCombat && tr.econ.bonus) && tr.pick.some(p => tr.stock[p] > 0);
  const imbue = () => {
    if (!canImbue) return;
    commit(t => {
      if (t.round > 0) t.econ.bonus = true;
      const list: NonNullable<typeof t.orbs>['list'] = [];
      t.pick.forEach(p => { if (t.stock[p] > 0) { t.stock[p] -= 1; list.push({ p, s: 'held' }); } });
      // Recasting Magic Stone ends the magic on any orbs from the last cast, including gifted ones.
      const lost = t.orbs ? t.orbs.list.filter(o => o.s === 'held' || o.s === 'gifted').length : 0;
      t.orbs = { round: t.round, list };
      return list.map(o => PAY[o.p][1].toLowerCase()).join(', ') + (lost ? ' · ' + lost + ' old orb' + (lost > 1 ? 's' : '') + ' lost magic' : '');
    }, 'Magic Stone');
  };
  const orbAct = (from: OrbStatus, to: OrbStatus, label: string, useAction: boolean) => () => {
    if (!ob || !ob.list.some(o => o.s === from)) return;
    if (useAction && inCombat && tr.econ.action) return;
    commit(t => {
      const o = t.orbs!.list.find(o => o.s === from)!;
      o.s = to;
      if (useAction && t.round > 0) t.econ.action = true;
      return PAY[o.p][1].toLowerCase();
    }, label);
  };

  const beadTotal = tr.beads.light + tr.beads.sound;

  return (
    <aside className="rail" data-print-hide aria-label="Tracker">
      <div className="rail-box leaded">
        <div className="rail-head"><span className="head">Tracker</span><span className="rail-round">{inCombat ? 'Round ' + tr.round : 'Out of combat'}</span></div>

        <div className="rail-sec row">
          <button className="btn-primary" onClick={() => commit(t => {
            resetTurn(t);
            if (t.round === 0) {
              t.round = 1;
              if (t.orbs && t.orbs.round === 0) t.orbs.round = 1;
              if (t.conc && t.conc.round === 0) t.conc.round = 1;
            } else t.round += 1;
          }, inCombat ? 'Turn ended' : 'Combat started')}>{inCombat ? 'End turn → R' + (tr.round + 1) : 'Start combat'}</button>
          {inCombat && <button className="btn" onClick={() => commit(t => { resetTurn(t); t.round = 0; }, 'Combat ended')}>End combat</button>}
        </div>

        <div className="rail-sec">
          <div className="rail-title"><span>This turn</span></div>
          <div className="btn-row">
            {([['action', 'Action', '65'], ['bonus', 'Bonus', '255'], ['reaction', 'Reaction', '150']] as [Econ, string, string][]).map(([k, label, hue]) => (
              <button key={k} className="toggle econ" aria-pressed={tr.econ[k]} style={onOff(tr.econ[k], hue)} onClick={() => commit(t => { t.econ[k] = !t.econ[k]; }, null)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="rail-sec">
          <div className="rail-title"><span>Spell slots</span></div>
          {Object.keys(m).map(Number).map(lv => {
            const used = tr.slots[lv] || 0, max = m[lv];
            return (
              <div key={lv} className="slot-tray">
                <span className="slot-lbl"><span className="head">{ORD[lv]}</span><span className="caps">level</span></span>
                <div className="pips">
                  {Array.from({ length: max }, (_, i) => {
                    const on = i < max - used;
                    return (
                      <button key={i} className="pip" aria-label={on ? 'Spend slot' : 'Restore slot'}
                        style={{ background: on ? T.psychic.c : 'transparent', borderColor: on ? T.psychic.c : 'oklch(0.45 0.01 260)' }}
                        onClick={() => commit(t => { const avail = max - (t.slots[lv] || 0); t.slots[lv] = max - (i < avail ? i : i + 1); }, null)} />
                    );
                  })}
                </div>
              </div>
            );
          })}
          <span className="caps">Free once per long rest</span>
          <div className="btn-row">
            {([['misty', 'Misty Step'], ['whispers', 'Dissonant Whispers']] as [FreeSpell, string][]).map(([k, label]) => (
              <button key={k} className="toggle free" aria-pressed={tr.free[k]} style={onOff(tr.free[k], '305')} onClick={() => commit(t => { t.free[k] = !t.free[k]; }, null)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="rail-sec">
          <div className="rail-title"><span>Concentration</span></div>
          {tr.conc ? (
            <div className="conc-row">
              <span><span style={{ color: T.control.c }}>◎</span> <b>{tr.conc.name}</b> <span style={{ color: 'oklch(0.70 0.01 260)' }}>{concLeft}</span></span>
              <button className="btn none" onClick={() => commit(t => { const n = t.conc!.name; t.conc = null; return n; }, 'Concentration ended')}>End</button>
            </div>
          ) : <span style={{ color: 'oklch(0.66 0.01 260)' }}>None</span>}
        </div>

        <div className="rail-sec">
          <div className="rail-title"><span>Eldritch Cannon</span><span className="note">{cn ? '' : tr.cannonFree ? 'next build: 1st slot' : 'free build ready'}</span></div>
          {cn ? (
            <>
              <div className="cannon-row">
                <Thumb src={ART[cn.type]} className="cannon-thumb" style={{ borderColor: CANNONS[cn.type][2], boxShadow: '0 0 12px ' + CANNONS[cn.type][2].replace(')', ' / 0.45)') }} />
                <b>{CANNONS[cn.type][1]}</b>
                <span className="hp">{cn.hp} / {cn.max} HP</span>
              </div>
              <div className="hp-bar"><div style={{ width: Math.round((cn.hp / cn.max) * 100) + '%', background: CANNONS[cn.type][2] }} /></div>
              <div className="shots">
                <span className="caps">Shots</span>
                <div className="ticks">
                  {Array.from({ length: SHOT_CAP }, (_, i) => <span key={i} style={{ background: i < SHOT_CAP - (cn.shots || 0) ? CANNONS[cn.type][2] : 'oklch(0.28 0.01 260)' }} />)}
                </div>
                <span className="shots-n"><b>{SHOT_CAP - (cn.shots || 0)}</b><span>/{SHOT_CAP}</span></span>
              </div>
              <div className="btn-row">
                <button className="btn" onClick={() => commit(t => { if (!t.cannon || !(t.cannon.shots > 0)) return false; t.cannon.shots -= 1; }, null)}>↶ Shot</button>
                <button className="btn wide" onClick={() => commit(t => {
                  if (!t.cannon || (t.cannon.shots || 0) >= SHOT_CAP) return false;
                  t.cannon.shots = (t.cannon.shots || 0) + 1;
                  return (SHOT_CAP - t.cannon.shots) + ' left';
                }, 'Cannon fired')}>Fire (−1 shot)</button>
              </div>
              <div className="btn-row">
                <button className="btn" onClick={() => hp(-5)}>−5</button>
                <button className="btn" onClick={() => hp(-1)}>−1</button>
                <button className="btn" onClick={() => hp(1)}>+1</button>
                <button className="btn" onClick={() => commit(t => { t.cannon = null; }, 'Cannon dismissed')}>Dismiss</button>
              </div>
            </>
          ) : (
            <div className="builds">
              {(Object.keys(CANNONS) as CannonType[]).map(k => (
                <button key={k} className="build" style={{ opacity: canBuild ? 1 : 0.45 }} onClick={() => build(k)} disabled={!canBuild}>
                  <Thumb src={ART[k]} className="" style={{ borderBottomColor: CANNONS[k][2] }} />
                  <span>{CANNONS[k][1].replace('Force ', '')}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rail-sec">
          <div className="rail-title"><span>Magic Stone orbs</span><span className="note">{orbSub}</span></div>
          <div className="orbs">
            {ob
              ? Array.from({ length: 3 }, (_, i) => {
                  const o = ob.list[i];
                  if (!o) return (
                    <div key={i} className="orb" style={{ background: 'transparent', borderStyle: 'dotted', borderColor: 'oklch(0.36 0.01 260)', opacity: 0.5 }}>
                      <Thumb src={ART.oil} className="" style={{ borderColor: 'oklch(0.45 0.01 260)', opacity: 0.15 }} />
                      <span>none</span>
                    </div>
                  );
                  const s = ORB_ST[o.s];
                  return (
                    <div key={i} className="orb" aria-label={PAY[o.p][1] + ' orb, ' + s[0]} style={{ background: s[1], borderStyle: s[2], borderColor: s[3], opacity: s[4] }}>
                      <Thumb src={ART[o.p]} className="" style={{ borderColor: PAY[o.p][2] }} />
                      <span>{s[0]}</span>
                    </div>
                  );
                })
              : tr.pick.map((p, i) => (
                  <button key={i} className="orb" aria-label={'Orb ' + (i + 1) + ' payload: ' + PAY[p][1] + '. Tap to change.'}
                    style={{ cursor: 'pointer', background: 'transparent', borderStyle: 'dashed', borderColor: 'oklch(0.55 0.01 260)' }}
                    onClick={() => tweak(t => { t.pick[i] = PAY_ORDER[(PAY_ORDER.indexOf(t.pick[i]) + 1) % 3]; })}>
                    <Thumb src={ART[p]} className="" style={{ borderColor: PAY[p][2], opacity: 0.85 }} />
                    <span>{PAY[p][1]}</span>
                  </button>
                ))}
          </div>
          {ob ? (
            <>
              <div className="orb-counts">{cnt('held')} held · {cnt('gifted')} with allies · thrown: {cnt('self')} by you, {cnt('ally')} by allies</div>
              <div className="btn-row">
                <button className="btn" onClick={orbAct('held', 'self', 'Threw orb', true)}>Throw</button>
                <button className="btn" onClick={orbAct('held', 'gifted', 'Gave orb to ally', false)}>Gift to ally</button>
                <button className="btn" onClick={orbAct('gifted', 'ally', 'Ally threw orb', false)}>Ally threw</button>
              </div>
              <div className="btn-row">
                <button className="btn violet" style={{ opacity: canImbue ? 1 : 0.45 }} onClick={imbue}>Re-imbue</button>
                <button className="btn" onClick={() => commit(t => { t.orbs = null; }, 'Magic Stone ended')}>End</button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button className="btn" style={{ opacity: canImbue ? 1 : 0.45 }} onClick={imbue}>Imbue</button>
              <span className="hint">Tap an orb to change its payload</span>
            </div>
          )}
        </div>

        <div className="rail-sec">
          <div className="rail-title"><span>Consumables</span></div>
          {STOCK.map(([k, tk, label]) => (
            <StockRow key={k} img={ART[k]} c={T[tk].c} label={label} n={tr.stock[k]}
              dec={() => commit(t => { if (t.stock[k] <= 0) return false; t.stock[k] -= 1; }, null)}
              inc={() => commit(t => { t.stock[k] += 1; }, null)} />
          ))}
          {(['light', 'sound'] as const).map(mode => (
            <StockRow key={mode} img={ART.bead} c={mode === 'light' ? T.light.c : T.thunder.c} label={'Tinkering beads: ' + mode + ' (' + beadTotal + '/4)'} n={tr.beads[mode]}
              dec={() => commit(t => { if (t.beads[mode] <= 0) return false; t.beads[mode] -= 1; }, null)}
              inc={() => commit(t => { if (t.beads.light + t.beads.sound >= 4) return false; t.beads[mode] += 1; }, null)} />
          ))}
          <div className="jug">
            <span className="jug-lbl">Alchemy jug<br />1 / day</span>
            {(['oil', 'acid'] as const).map(k => (
              <button key={k} className="btn" style={{ opacity: tr.jug ? 0.4 : 1 }} disabled={tr.jug}
                onClick={() => commit(t => { t.stock[k] += 2; t.jug = true; }, 'Alchemy jug +2 ' + k)}>+2 {k}</button>
            ))}
          </div>
        </div>

        <div className="rail-sec row">
          <button className="btn" style={{ opacity: api.canUndo ? 1 : 0.4 }} onClick={api.undo}>↶ Undo</button>
          <button className="btn" onClick={() => commit(t => { resetTurn(t); t.round = 0; }, 'Short rest')}>Short rest</button>
          <button className="btn" onClick={() => commit(t => {
            resetTurn(t); t.round = 0; t.slots = { 1: 0, 2: 0 }; t.free = { misty: false, whispers: false };
            t.cannon = null; t.cannonFree = false; t.conc = null; t.orbs = null; t.jug = false;
          }, 'Long rest: slots, free spells, cannon build and jug reset')}>Long rest</button>
          <button className="btn" onClick={() => { if (window.confirm('Reset the tracker? This clears slots, cannon, orbs, consumables and the log.')) api.reset(); }}>Reset</button>
        </div>
      </div>

      <div className="rail-box leaded">
        <div className="log-head">Action log</div>
        {tr.log.length
          ? tr.log.map((l, i) => <div key={i} className="log-row"><span className="mono">{l.r}</span><span>{l.t}</span></div>)
          : <div className="log-empty">Open a play and tap Execute to log it.</div>}
      </div>
    </aside>
  );
}

function StockRow({ img, c, label, n, dec, inc }: { img: string; c: string; label: string; n: number; dec: () => void; inc: () => void }) {
  return (
    <div className="stock-row">
      <Thumb src={img} className="stock-thumb" style={{ borderColor: c }} />
      <span>{label}</span>
      <div className="stock-ctl">
        <button onClick={dec} aria-label={'Remove one: ' + label}>−</button>
        <span style={{ color: INK }}>{n}</span>
        <button onClick={inc} aria-label={'Add one: ' + label}>+</button>
      </div>
    </div>
  );
}
