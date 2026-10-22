/**
 * Apply a list plan written by one of the build-*-plan.py scripts: for each
 * list, create it if missing and add the given Apollo account IDs, keeping
 * every account's other lists intact.
 *
 *   npx tsx --env-file=.env.vercel scripts/apply-list-plan.ts .sdr-data/plans/uk-healthcare.json
 *
 * --split-expansion moves members of the old mixed "Expansion · Customer
 * groups" list into the regional US / UK expansion lists by account country.
 */

import fs from 'fs';
import path from 'path';

const APOLLO = 'https://api.apollo.io/api/v1';
const HEADERS = { 'x-api-key': process.env.APOLLO_API_KEY || '', 'Content-Type': 'application/json' };
const RULES = JSON.parse(fs.readFileSync(path.join(__dirname, 'target-list-rules.json'), 'utf8')) as {
  expansionLists: Record<'US' | 'UK', string>;
};
const OLD_EXPANSION = 'Expansion · Customer groups · 2026-10';

async function request(method: 'GET' | 'POST' | 'PUT', p: string, body?: unknown, attempt = 0): Promise<{ ok: boolean; data: unknown }> {
  const res = await fetch(`${APOLLO}${p}`, { method, headers: HEADERS, body: body ? JSON.stringify(body) : undefined });
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    const retryAfter = Number(res.headers.get('retry-after'));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? (retryAfter + 5) * 1000 : Math.min(60_000, 2_000 * 2 ** attempt);
    console.log(`    rate limited, waiting ${Math.round(waitMs / 1000)}s…`);
    await new Promise((r) => setTimeout(r, waitMs));
    return request(method, p, body, attempt + 1);
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON error body
  }
  return { ok: res.ok, data };
}

let labelCache: { id: string; name: string; modality: string }[] | null = null;
async function ensureLabel(name: string) {
  labelCache ??= ((await request('GET', '/labels')).data as { id: string; name: string; modality: string }[]) || [];
  const hit = labelCache.find((l) => l.name === name && l.modality === 'accounts');
  if (hit) return hit.id;
  const created = await request('POST', '/labels', { name, modality: 'accounts' });
  const id = (created.data as { label?: { id?: string } })?.label?.id || null;
  if (id) labelCache.push({ id, name, modality: 'accounts' });
  return id;
}

async function addToList(accountId: string, labelId: string, removeId?: string) {
  const got = await request('GET', `/accounts/${accountId}`);
  const account = (got.data as { account?: { label_ids?: string[] } })?.account;
  if (!account) return false;
  const current = (account.label_ids || []).filter((l) => l !== removeId);
  if (current.includes(labelId) && !removeId) return true;
  const next = current.includes(labelId) ? current : [...current, labelId];
  return (await request('PUT', `/accounts/${accountId}`, { label_ids: next })).ok;
}

async function splitExpansion() {
  const oldId = await ensureLabel(OLD_EXPANSION);
  if (!oldId) return;
  const members: Record<string, unknown>[] = [];
  for (let page = 1; page <= 5; page++) {
    const r = await request('POST', '/accounts/search', { account_label_ids: [oldId], page, per_page: 100 });
    const d = r.data as { accounts?: Record<string, unknown>[]; pagination?: { total_pages?: number } };
    members.push(...(d.accounts || []));
    if (!d.pagination?.total_pages || page >= d.pagination.total_pages) break;
  }
  const ukId = await ensureLabel(RULES.expansionLists.UK);
  const usId = await ensureLabel(RULES.expansionLists.US);
  const counts = { UK: 0, US: 0, failed: 0 };
  for (const a of members) {
    const region = String(a.country || '') === 'United Kingdom' ? 'UK' : 'US';
    const ok = await addToList(String(a.id), (region === 'UK' ? ukId : usId)!, oldId);
    if (ok) counts[region]++;
    else counts.failed++;
  }
  console.log(`Split ${members.length} expansion accounts: ${counts.US} US, ${counts.UK} UK${counts.failed ? `, ${counts.failed} failed` : ''}`);
}

async function main() {
  if (process.argv.includes('--split-expansion')) await splitExpansion();
  const planPath = process.argv.slice(2).find((a) => a.endsWith('.json'));
  if (!planPath) return;
  const plan = JSON.parse(fs.readFileSync(planPath, 'utf8')) as { lists: { name: string; add: string[] }[] };
  for (const list of plan.lists) {
    const labelId = await ensureLabel(list.name);
    if (!labelId) {
      console.log(`could not create ${list.name}`);
      continue;
    }
    let ok = 0;
    for (const id of list.add) if (await addToList(id, labelId)) ok++;
    console.log(`${list.name}: ${ok} of ${list.add.length} accounts (${labelId})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
