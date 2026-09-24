import { useRef, useState } from 'react';
import { spellInfo, SPELLS } from '../data/spells';
import { ART, INK, NEUT, SHOW_L5, T, fmt, tint, type DamageKey } from '../data/tokens';
import { Art, BadgeChip, TierHeader, badgeStyle, type BadgeStyle } from './bits';

export interface Stats { l5: boolean; L: 4 | 5; dc: number; atk: string; dex: number; prof: number }

export function Loadout({ s, appr, show, onToggle }: { s: Stats; appr: Record<number, boolean>; show: boolean; onToggle: () => void }) {
  return (
    <section className="tier" aria-label="Tier I Loadout">
      <TierHeader n="I" title="Loadout" sub="What Siris carries into the fight" gem="oklch(0.74 0.14 255 / 0.35)">
        <button className="pill-btn" onClick={onToggle} aria-expanded={show}>{show ? '▴ Collapse details' : '▾ Show spells & gear'}</button>
      </TierHeader>
      <div className="stats leaded">
        <div className="stat"><div className="stat-k">Spell atk</div><div className="stat-v">{s.atk}</div></div>
        <div className="stat"><div className="stat-k">Save DC</div><div className="stat-v">{s.dc}</div></div>
        <div className="stat"><div className="stat-k">Chistera atk</div><div className="stat-row"><span className="stat-v">+{s.dex + s.prof}</span><span className="stat-note">(Dex {s.dex} + {s.prof})</span></div></div>
        <div className="stat"><div className="stat-k">Cannon</div><div className="stat-v xxs">AC 18 · HP {5 * s.L}</div><div className="stat-note">5 × level</div></div>
      </div>
      {show && (
        <div className="panels">
          <SpellsPanel s={s} />
          <CannonPanel s={s} />
          <EquipmentPanel s={s} />
          <KitPanels s={s} appr={appr} />
        </div>
      )}
    </section>
  );
}

function SpellsPanel({ s }: { s: Stats }) {
  const [open, setOpen] = useState<string | null>(null);
  const openedAt = useRef(0);
  const info = spellInfo(s.dc, s.atk);
  return (
    <div className="panel visible leaded">
      <div className="panel-head" style={{ background: 'oklch(0.76 0.14 305 / 0.16)' }}><span className="g" style={{ color: T.psychic.c }}>✦</span>Spells</div>
      {SPELLS.filter(g => SHOW_L5 || g[1] !== 2).map(([title, tier, items]) => {
        const lock = tier === 2 && !s.l5, swap = tier === 'swap';
        const sub = swap ? 'not known' : tier === 1 ? (s.l5 ? '4 slots' : '3 slots') : tier === 2 ? (s.l5 ? '2 slots' : 'unlocks L5') : tier === 3 ? 'free 1 / long rest' : 'at will';
        return (
          <div key={title} className="panel-row stack">
            <div className="group-head"><span>{title}</span><span style={{ color: lock ? T.force.c : undefined }}>{sub}</span></div>
            <div className="chips">
              {items.map(([name, conc]) => {
                const isOpen = open === name, sp = info[name] || { meta: [], lines: [] };
                // Hover opens on desktop; on a tablet, tap opens and a second tap closes.
                const tap = () => {
                  if (isOpen && Date.now() - openedAt.current > 400) setOpen(null);
                  else { openedAt.current = Date.now(); setOpen(name); }
                };
                return (
                  <span key={name} className="spell"
                    onMouseEnter={() => { openedAt.current = Date.now(); setOpen(name); }}
                    onMouseLeave={() => setOpen(o => (o === name ? null : o))}
                    onClick={tap}>
                    <span className="spell-chip" style={{
                      background: isOpen ? 'oklch(0.76 0.14 305 / 0.35)' : swap ? 'transparent' : 'oklch(0.28 0.01 260)',
                      color: lock ? 'oklch(0.58 0.01 260)' : swap ? 'oklch(0.80 0.01 260)' : INK,
                      textDecoration: lock ? 'line-through' : 'none',
                      borderStyle: swap ? 'dashed' : 'dotted',
                      borderColor: swap ? 'oklch(0.55 0.01 260)' : 'transparent transparent oklch(0.60 0.01 260) transparent',
                    }}>
                      {name}<span style={{ color: T.psychic.c }}>{conc ? ' ◎' : ''}</span>
                    </span>
                    {isOpen && (
                      <span className="spell-pop" role="tooltip">
                        <span className="spell-pop-box">
                          <span className="spell-pop-name">{name}</span>
                          <span className="chips">{sp.meta.map(m => <span key={m} className="spell-meta">{m}</span>)}</span>
                          {sp.lines.map(([k, dice, v]) => (
                            <span key={k} className="spell-line">
                              <span className="spell-line-k">{k}</span>
                              <span><span className="mono" style={{ fontWeight: 700 }}>{dice}</span> <span className="spell-line-v">{v}</span></span>
                            </span>
                          ))}
                        </span>
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
            {swap && <div className="group-note">Only 2 cantrips known (Fire Bolt + Magic Stone). Swap one at a level-up.</div>}
          </div>
        );
      })}
      <div className="panel-foot"><span style={{ color: T.psychic.c }}>◎</span> = concentration · one at a time</div>
    </div>
  );
}

function CannonPanel({ s }: { s: Stats }) {
  const cell = (src: string, g: string, c: string, label: string) => (
    <div className="art-cell"><Art src={src} alt={label} /><span><span style={{ color: c }}>{g}</span> {label}</span></div>
  );
  return (
    <div className="panel leaded">
      <div className="panel-head" style={{ background: 'oklch(0.74 0.14 255 / 0.16)' }}><span className="g" style={{ color: T.force.c }}>◆</span>Eldritch Cannon</div>
      <div className="art-grid three">
        {cell(ART.ft, '▲', T.fire.c, 'Flamethrower')}
        {cell(ART.bal, '◆', T.force.c, 'Force Ballista')}
        {cell(ART.prot, '✚', T.acid.c, 'Protector')}
      </div>
      <div className="panel-row"><div className="row-title">Rules</div>Bonus action to fire · within 60 ft of you · walks/climbs 15 ft as part of that bonus action · type locked when summoned; rebuild costs a slot</div>
      <div className="panel-row"><div className="row-title"><span style={{ color: T.force.c }}>◆</span> Force Ballista</div>Spell atk {s.atk} · 120 ft · <span className="dice-inline">2d8</span> force <span className="avg-inline">≈ 9</span> · push 5 ft</div>
      <div className="panel-row"><div className="row-title"><span style={{ color: T.fire.c }}>▲</span> Flamethrower</div>15-ft cone · Dex save {s.dc} · <span className="dice-inline">2d8</span> fire <span className="avg-inline">≈ 9</span>, half on save · ignites unattended flammables · reach ≈ 30 ft (15 move + 15 cone)</div>
    </div>
  );
}

function EquipmentPanel({ s }: { s: Stats }) {
  return (
    <div className="panel leaded">
      <div className="panel-head" style={{ background: 'oklch(0.80 0.15 65 / 0.16)' }}><span className="g" style={{ color: T.fire.c }}>■</span>Equipment</div>
      <div className="art-grid two">
        <Art src={ART.chistera} alt="Chistera" className="art-43" />
        <Art src={ART.bead} alt="Tinkering bead" className="art-43" />
      </div>
      <div className="panel-row"><div className="row-title"><span style={{ color: NEUT }}>■</span> Chistera</div>Glass jai-alai launcher, sling-style · 30/120 ft · atk +{s.dex + s.prof} · <span className="dice-inline">1d4 + 1d4 + {s.dex}</span> <span className="avg-inline">≈ {fmt(5 + s.dex)}</span></div>
      <div className="panel-row">
        <div className="row-title">Tinkering bead</div>
        Magical Tinkering · free · 4 active total · action + tinker’s tools · one mode per bead:
        <div className="bead-modes">
          <span style={{ color: T.light.c }}>☼</span><span><b>Light:</b> 5 ft bright + 5 ft dim</span>
          <span style={{ color: NEUT }}>≋</span><span><b>Sound:</b> replays up to 6 s of recorded footsteps/voices when tapped, to lure</span>
        </div>
      </div>
    </div>
  );
}

interface KitRow { k: DamageKey; name: string; txt: string; img?: string; c?: string; dm?: number[]; dice?: string; avg?: number | string; dt?: DamageKey; tip?: string; lock?: boolean }

function KitPanels({ s, appr }: { s: Stats; appr: Record<number, boolean> }) {
  const dmB = (n: number) => badgeStyle(['dm', n], appr);
  const kits: { title: string; sub: string; g: string; k: DamageKey; intro?: [string, BadgeStyle[]]; rows: KitRow[] }[] = [
    { title: 'Payloads', sub: 'what’s inside the orb', g: '●', k: 'acid', rows: [
      { k: 'fire', name: 'Oil', img: ART.oil, txt: 'Jug makes 2 pints/day · 1 sp per flask. Coats target: +5 fire on next fire damage within 1 min. Puddle: 5-ft square, burns 2 rounds once lit, 5 fire per entry / turn end' },
      { k: 'acid', name: 'Acid', img: ART.acid, txt: 'Jug makes 8 oz/day = 2 vials · 25 gp per vial', dice: '2d6', avg: 7, dt: 'acid' },
      { k: 'move', name: 'Glass marbles', img: ART.marbles, txt: 'Ball bearings, 1 gp/bag · 10-ft square · Dex DC 10 (fixed) or prone' },
      { k: 'pierce', name: 'Glass shards', img: ART.shards, txt: 'Caltrops, 1 gp/20 · 5-ft square · Dex DC 15 (fixed) or stop moving, 1 piercing, −10 ft speed until healed · movers at half speed skip the save' },
      { k: 'cold', name: 'Dewar orb', img: ART.dewar, txt: 'Homebrew · target loses 10 ft of speed until the start of my next turn · no damage from the payload itself', dm: [9] }] },
    { title: 'Deliveries', sub: 'how the orb gets there', g: '◆', k: 'force', intro: ['Delivery sets the attack roll and base damage; payload adds its effect', [dmB(8)]], rows: [
      { k: 'bludg', name: 'Hand throw', txt: '20 ft · improvised (no proficiency)', c: NEUT },
      { k: 'phys', name: 'Chistera', txt: 'atk +' + (s.dex + s.prof) + ' · 30/120 ft', dm: [2, 3], dice: '1d4 + 1d4 + ' + s.dex, avg: fmt(5 + s.dex), dt: 'phys' },
      { k: 'bludg', name: 'Smart Bomb (Magic Stone)', txt: 'Bonus action imbues up to 3 orbs for 1 min · spell atk ' + s.atk, dm: [1], dice: '1d6 + 4', avg: 7.5, dt: 'bludg', tip: 'mix payloads in one cast (1 oil, 1 acid, 1 Dewar)' },
      { k: 'bludg', name: 'Catapult', txt: '1st slot · Dex save DC ' + s.dc, dm: [4], dice: '3d8', avg: 13.5, dt: 'bludg' },
      { k: 'force', name: 'Glass-shot Ballista', txt: s.l5 ? 'Force Ballista fires the orb' : 'Unlocks at Level 5', dm: [5], lock: !s.l5 }] },
  ];
  return (
    <>
      {kits.map(kit => (
        <div key={kit.title} className="panel leaded">
          <div className="panel-head wrap" style={{ background: tint(kit.k) }}><span className="g" style={{ color: T[kit.k].c }}>{kit.g}</span>{kit.title}<span className="sub">{kit.sub}</span></div>
          {kit.intro && <div className="kit-intro">{kit.intro[0]}{kit.intro[1].map(b => <BadgeChip key={b.txt} b={b} />)}</div>}
          {kit.rows.map(r => {
            const dt = T[r.dt || r.k];
            return (
              <div key={r.name} className="kit-row" style={{ opacity: r.lock ? 0.45 : 1 }}>
                {r.img && <Art src={r.img} alt={r.name} className="kit-img" />}
                <div className="kit-body">
                  <div className="kit-title">
                    <span style={{ color: r.c || T[r.k].c }}>{T[r.k].g}</span><span>{r.name}</span>
                    {(r.dm || []).map(n => <BadgeChip key={n} b={dmB(n)} />)}
                  </div>
                  {r.dice && (
                    <div className="kit-dice"><span className="e">{r.dice}</span><span className="a">≈ {r.avg}</span><span className="t" style={{ color: dt.c }}>{dt.g} {r.dt ? dt.t : ''}</span></div>
                  )}
                  <div className="pretty">{r.txt}</div>
                  {r.tip && <div className="kit-tip">Tip: {r.tip}</div>}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
