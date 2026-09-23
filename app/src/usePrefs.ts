import { useCallback, useEffect, useState } from 'react';
import { THEMES, type ThemeId } from './data/tokens';

// Same key as the prototype, so approved DM rulings and Dex carry over.
const STORE = 'siris-playbook-v1';

export interface Prefs {
  level: 4 | 5;
  dex: number;
  appr: Record<number, boolean>; // approved DM rulings
  showLoadout: boolean;
  theme: ThemeId;
  flowOpen: boolean;
}

function load(): Prefs {
  let s: Partial<Prefs> = {};
  try { s = JSON.parse(localStorage.getItem(STORE) || '{}'); } catch { /* ignore corrupt storage */ }
  return {
    level: s.level === 5 ? 5 : 4,
    dex: s.dex ?? 2,
    appr: s.appr || {},
    showLoadout: s.showLoadout ?? true,
    theme: THEMES.some(t => t[0] === s.theme) ? s.theme! : 'all',
    flowOpen: s.flowOpen ?? true,
  };
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<Prefs>(load);
  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify(prefs)); } catch { /* storage full or blocked */ }
  }, [prefs]);
  const save = useCallback((patch: Partial<Prefs>) => setPrefs(p => ({ ...p, ...patch })), []);
  return [prefs, save] as const;
}
