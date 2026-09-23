import { useCallback, useEffect, useState } from 'react';
import { clone, freshTr, reviveTr, type Tracker } from './logic';

// Same key as the prototype, so an in-progress session carries over.
const TKEY = 'siris-tracker-v1';
const LOG_MAX = 40;
const UNDO_MAX = 30;

interface Store { tr: Tracker; hist: Tracker[] }

function load(): Store {
  try {
    const t = JSON.parse(localStorage.getItem(TKEY) || '{}');
    return { tr: reviveTr(t.tr), hist: Array.isArray(t.hist) ? t.hist : [] };
  } catch {
    return { tr: freshTr(), hist: [] };
  }
}

/**
 * A mutation runs on a deep copy of the tracker. Return false to cancel, or a
 * string to append to the log line.
 */
export type Mutation = (t: Tracker) => string | false | void;

export function useTracker() {
  const [store, setStore] = useState<Store>(load);

  useEffect(() => {
    try { localStorage.setItem(TKEY, JSON.stringify(store)); } catch { /* storage full or blocked */ }
  }, [store]);

  /** Apply a change as one undoable step; log it when `text` is given. */
  const commit = useCallback((mut: Mutation, text: string | null) => {
    setStore(s => {
      const tr = clone(s.tr);
      const extra = mut(tr);
      if (extra === false) return s;
      if (text) tr.log = [{ r: tr.round ? 'R' + tr.round : '·', t: text + (extra ? ' · ' + extra : '') }, ...tr.log].slice(0, LOG_MAX);
      return { tr, hist: [...s.hist, s.tr].slice(-UNDO_MAX) };
    });
  }, []);

  /** Change state without an undo step (e.g. picking orb payloads before imbuing). */
  const tweak = useCallback((mut: (t: Tracker) => void) => {
    setStore(s => { const tr = clone(s.tr); mut(tr); return { ...s, tr }; });
  }, []);

  const undo = useCallback(() => {
    setStore(s => (s.hist.length ? { tr: s.hist[s.hist.length - 1], hist: s.hist.slice(0, -1) } : s));
  }, []);

  const reset = useCallback(() => setStore({ tr: freshTr(), hist: [] }), []);

  return { tr: store.tr, canUndo: store.hist.length > 0, commit, tweak, undo, reset };
}

export type TrackerApi = ReturnType<typeof useTracker>;
