import { useCallback, useEffect, useRef, useState } from 'react';
import { getToken, pull, push, setToken, SyncError, type RemoteDoc, type SyncData } from './sync';
import type { Tracker } from './tracker/logic';
import type { Prefs } from './usePrefs';

export type SyncStatus = 'off' | 'syncing' | 'synced' | 'offline' | 'denied';
export interface Sync { status: SyncStatus; connect: () => void }

const POLL_MS = 20000;
const DEBOUNCE_MS = 800;

/**
 * Keeps prefs + tracker in step with the /api/state document. Offline-first:
 * localStorage stays the source of truth on this device, and changes push up
 * (debounced) while newer server revisions pull down (on load, on a 20s poll
 * while visible, and when the tab regains focus). On a conflicting write the
 * server's copy wins and replaces local state.
 */
export function useSync(prefs: Prefs, savePrefs: (p: Partial<Prefs>) => void, tr: Tracker, restore: (t: Tracker) => void): Sync {
  const [status, setStatus] = useState<SyncStatus>(() => (getToken() ? 'syncing' : 'off'));
  const [tick, setTick] = useState(0); // bumped when the passphrase changes, to re-init
  const rev = useRef(0);
  const synced = useRef(''); // JSON of the last state synced in either direction
  const latest = useRef<SyncData>({ prefs, tr });
  latest.current = { prefs, tr };
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fail = (e: unknown) => setStatus(e instanceof SyncError && e.status === 401 ? 'denied' : 'offline');

  const apply = useCallback((doc: RemoteDoc) => {
    rev.current = doc.rev;
    if (doc.data) {
      // Record the server's JSON first, so the save effect sees the applied state as already synced.
      synced.current = JSON.stringify(doc.data);
      savePrefs(doc.data.prefs);
      restore(doc.data.tr);
    }
  }, [savePrefs, restore]);

  const send = useCallback(async () => {
    const data = latest.current, json = JSON.stringify(data);
    if (json === synced.current) return;
    setStatus('syncing');
    const r = await push(rev.current, data);
    if (r.ok) { rev.current = r.rev; synced.current = json; }
    else apply(r.doc); // our baseRev was stale: take the server's copy
    setStatus('synced');
  }, [apply]);

  const refresh = useCallback(async () => {
    const doc = await pull();
    if (doc.rev > rev.current) { apply(doc); setStatus('synced'); return; }
    await send(); // pushes anything unsent, e.g. changes made while offline
    setStatus('synced');
  }, [apply, send]);

  // Initial load + poll while the tab is visible.
  useEffect(() => {
    if (!getToken()) { setStatus('off'); return; }
    setStatus('syncing');
    refresh().catch(fail);
    const iv = setInterval(() => { if (!document.hidden) refresh().catch(fail); }, POLL_MS);
    const onVis = () => { if (!document.hidden) refresh().catch(fail); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', onVis); };
  }, [tick, refresh]);

  // Debounced save on every local change.
  useEffect(() => {
    if (!getToken() || status === 'off' || status === 'denied') return;
    if (JSON.stringify({ prefs, tr }) === synced.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { send().catch(fail); }, DEBOUNCE_MS);
    return () => clearTimeout(timer.current);
  }, [prefs, tr, status, send]);

  const connect = useCallback(() => {
    const cur = getToken();
    const t = window.prompt(cur ? 'Sync passphrase (leave blank to turn sync off):' : 'Enter the sync passphrase (printed by deploy.sh):', cur);
    if (t === null) return;
    setToken(t.trim());
    rev.current = 0;
    synced.current = '';
    setTick(x => x + 1);
  }, []);

  return { status, connect };
}
