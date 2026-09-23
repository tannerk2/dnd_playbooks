import type { ReactNode } from 'react';
import { RULINGS } from '../data/cards';
import { INK, MUTED, NEUT, SHOW_L5, T } from '../data/tokens';

const RULES: [glyph: string, color: string, body: ReactNode][] = [
  ['◎', T.control.c, <><b>One concentration spell at a time:</b> Faerie Fire, Caustic Brew, Web, Heat Metal. Catapult, Shatter, Pyrotechnics, Snare, and Magic Stone don't need it</>],
  ['▲', T.fire.c, <>Oil's +5 triggers <b>once per coating</b></>],
  ['■', NEUT, <><b>Only one bonus action per turn:</b> cannon vs Magic Stone vs Misty Step</>],
  ['■', NEUT, <><b>Bosses:</b> target Dex saves or attack rolls. <b>Casters:</b> target Con/Str saves</>],
  ['⬢', T.move.c, <><b>Prone:</b> melee within 5 ft has advantage; ranged has disadvantage, including yours. Saves unaffected</>],
  ['⬢', T.move.c, <><b>Restrained:</b> attacks against it have advantage; its Dex saves have disadvantage</>],
  ['◐', T.obscure.c, <><b>Heavily obscured</b> = effectively blinded, both ways. Siris has no darkvision; darkvision doesn’t see through smoke</>],
  ['◐', T.obscure.c, <>Pyrotechnics puts out the flame it uses</>],
  ['▪', NEUT, <>Shards DC 15 and marbles DC 10 are <b>fixed</b>, not your DC. Enemies moving at half speed skip the save</>],
  ['■', NEUT, <>After imbuing Magic Stone (bonus action spell), the only other spell that turn is Fire Bolt or another action cantrip</>],
];

export function Footer({ appr, toggle }: { appr: Record<number, boolean>; toggle: (n: number) => void }) {
  return (
    <footer className="footer">
      <div className="footer-col">
        <div className="footer-title">Rules reminders</div>
        {RULES.map(([g, c, body], i) => (
          <div key={i} className="rule"><span style={{ color: c }}>{g}</span><span>{body}</span></div>
        ))}
      </div>
      <div className="rulings">
        <div className="rulings-head">
          <span className="footer-title">Pending DM rulings</span>
          <span className="flow-hint">Tap to mark approved; badges go solid</span>
        </div>
        {RULINGS.filter(r => SHOW_L5 || !r.l5).map(({ n, txt, plays }) => {
          const ok = !!appr[n], c = ok ? T.acid.c : T.fire.c;
          return (
            <button key={n} className="ruling" onClick={() => toggle(n)} aria-pressed={ok}>
              <span className="ruling-badge" style={{ borderStyle: ok ? 'solid' : 'dashed', borderColor: c, color: c }}>{ok ? '✓ ' + n : '? ' + n}</span>
              <span style={{ color: ok ? MUTED : INK }}>{txt}</span>
              <span className="ruling-plays">{plays}</span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
