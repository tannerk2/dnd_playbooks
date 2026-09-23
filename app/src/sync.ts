// Client for the /api/state sync endpoint (Lambda + DynamoDB behind CloudFront).
// The whole app state (prefs + tracker) syncs as one document with a revision number.
import type { Prefs } from './usePrefs';
import type { Tracker } from './tracker/logic';

export interface SyncData { prefs: Prefs; tr: Tracker }
export interface RemoteDoc { rev: number; data: SyncData | null }

const TOKEN_KEY = 'siris-sync-token';

export function getToken(): string {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}
export function setToken(t: string) {
  try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* blocked storage */ }
}

export class SyncError extends Error {
  constructor(public status: number) { super('sync ' + status); }
}

// Relative path, so it works on the CloudFront domain; in `npm run dev` there is
// no backend and requests fail, which the app shows as sync being offline.
const URL = 'api/state';
const headers = () => ({ 'x-sync-token': getToken(), 'content-type': 'application/json' });

export async function pull(): Promise<RemoteDoc> {
  const r = await fetch(URL, { headers: headers() });
  if (!r.ok) throw new SyncError(r.status);
  return r.json();
}

/** Optimistic write: on a stale baseRev the server answers 409 with its current doc, and the caller takes that. */
export async function push(baseRev: number, data: SyncData): Promise<{ ok: true; rev: number } | { ok: false; doc: RemoteDoc }> {
  const r = await fetch(URL, { method: 'PUT', headers: headers(), body: JSON.stringify({ baseRev, data }) });
  if (r.status === 409) return { ok: false, doc: await r.json() };
  if (!r.ok) throw new SyncError(r.status);
  return { ok: true, rev: (await r.json()).rev };
}
