import type { CSSProperties, ReactNode } from 'react';
import type { Badge, Dice, LaneKind } from '../data/cards';
import { DARKTXT, INK, MUTED, T, fmt } from '../data/tokens';

export interface BadgeStyle { txt: string; bg: string; fg: string; bd: string; bs: 'solid' | 'dashed' }

/** Card badge colors. DM rulings are dashed amber until approved, then solid green. */
export function badgeStyle([kind, v]: Badge, appr: Record<number, boolean>): BadgeStyle {
  if (kind === 'free') return { txt: 'FREE' + (v ? ' · ' + v : ''), bg: 'transparent', fg: INK, bd: 'oklch(0.80 0.01 260)', bs: 'solid' };
  if (kind === 'slot') return { txt: 'SLOT · ' + v, bg: 'oklch(0.90 0.01 80)', fg: DARKTXT, bd: 'oklch(0.90 0.01 80)', bs: 'solid' };
  if (kind === 'conc') return { txt: '◎ CONC', bg: 'transparent', fg: T.control.c, bd: T.control.c, bs: 'solid' };
  if (kind === 'l5') return { txt: 'L5', bg: T.force.c, fg: DARKTXT, bd: T.force.c, bs: 'solid' };
  return appr[v] ? { txt: 'DM ✓ ' + v, bg: 'transparent', fg: T.acid.c, bd: T.acid.c, bs: 'solid' }
                 : { txt: 'DM? ' + v, bg: 'transparent', fg: T.fire.c, bd: T.fire.c, bs: 'dashed' };
}

export function BadgeChip({ b }: { b: BadgeStyle }) {
  return <span className="badge" style={{ background: b.bg, color: b.fg, borderStyle: b.bs, borderColor: b.bd }}>{b.txt}</span>;
}

const LANE: Record<string, { bg: string; fg: string; bd: string }> = {
  ACTION: { bg: 'oklch(0.92 0.01 80)', fg: DARKTXT, bd: 'oklch(0.92 0.01 80)' },
  BONUS: { bg: 'oklch(0.32 0.01 260)', fg: INK, bd: 'oklch(0.60 0.01 260)' },
  REACTION: { bg: 'transparent', fg: INK, bd: 'oklch(0.80 0.01 260)' },
  other: { bg: 'transparent', fg: MUTED, bd: 'oklch(0.36 0.01 260)' },
};

/** ACTION / BONUS / REACTION lane label; filled-to-outlined so the three read apart without color. */
export function LaneTag({ k, q }: { k: LaneKind; q?: string }) {
  const s = LANE[k] || LANE.other;
  return (
    <div className="lane-side">
      <span className="lane-tag" style={{ background: s.bg, color: s.fg, borderColor: s.bd }}>{k}</span>
      {q ? <span className="lane-q">{q}</span> : null}
    </div>
  );
}

/** "2d8 + 5 (cannon + oil) ≈ 14 ▲ fire" */
export function DiceRow({ d }: { d: Dice }) {
  const tk = T[d.t];
  return (
    <div className="dice">
      <span className="e">{d.e}</span>
      <span className="p">({d.p})</span>
      <span className="a">≈ {fmt(d.a)}</span>
      <span className="dmg" style={{ color: tk.c, borderColor: tk.c }}><span className="g">{tk.g}</span>{tk.t}</span>
    </div>
  );
}

export function TierHeader({ n, title, sub, gem, children }: { n: string; title: string; sub: string; gem: string; children?: ReactNode }) {
  return (
    <div className="tier-head">
      <span className="tier-gem" style={{ background: gem }}><span>{n}</span></span>
      <span className="tier-title">{title}</span>
      <span className="tier-sub">{sub}</span>
      <span className="lead-line" />
      {children}
    </div>
  );
}

export function Thumb({ src, className, style }: { src: string; className: string; style?: CSSProperties }) {
  return <div className={'thumb ' + className} style={{ backgroundImage: `url(${src})`, ...style }} />;
}

export function Art({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <div className={'leaded-img ' + className}><img src={src} alt={alt} loading="lazy" /></div>;
}
