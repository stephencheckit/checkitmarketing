/**
 * Prune the FM, Food Service & Venues target lists in Apollo: remove accounts
 * under the size threshold (or with no headcount), and move existing
 * customers and customer-group brands out of the prospect lists into a
 * separate expansion list. Rules live in scripts/target-list-rules.json.
 *
 *   npx tsx --env-file=.env.vercel scripts/prune-target-lists.ts           # dry run
 *   npx tsx --env-file=.env.vercel scripts/prune-target-lists.ts --apply
 */

import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

const APPLY = process.argv.includes('--apply');
const APOLLO = 'https://api.apollo.io/api/v1';
const HEADERS = { 'x-api-key': process.env.APOLLO_API_KEY || '', 'Content-Type': 'application/json' };
const RULES = JSON.parse(fs.readFileSync(path.join(__dirname, 'target-list-rules.json'), 'utf8')) as {
  minEmployees: number;
  dropUnknownSize: boolean;
  expansionListName: string;
  customerGroups: Record<string, string>;
};
const LISTS = ['FM, Food Service & Venues · US · 2026-10', 'FM, Food Service & Venues · UK · 2026-10'];
const GROUPS = Object.entries(RULES.customerGroups).map(([g, re]) => [g, new RegExp(re, 'i')] as const);

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

const norm = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\b(inc|llc|ltd|limited|plc|co|corp|corporation|group|the)\b/g, ' ').replace(/\s+/g, ' ').trim();

async function main() {
  const sql = neon(process.env.DATABASE_URL || '');
  const customers = (await sql`SELECT company_name, domain, match_domain FROM customer_accounts WHERE status IS DISTINCT FROM 'churned'`) as {
    company_name: string | null;
    domain: string | null;
    match_domain: string | null;
  }[];
  const custNames = new Set(customers.map((c) => norm(c.company_name || '')).filter((n) => n.length > 3));
  const custDomains = new Set(customers.flatMap((c) => [c.domain, c.match_domain]).filter(Boolean).map((d) => String(d).toLowerCase()));
  const stages = ((await request('GET', '/account_stages')).data as { account_stages?: { id: string; name?: string; display_name?: string }[] }).account_stages || [];
  const clientStage = new Set(stages.filter((s) => /current client/i.test(s.display_name || s.name || '')).map((s) => s.id));

  const labels = ((await request('GET', '/labels')).data as { id: string; name: string; modality: string }[]) || [];
  let expansionId = labels.find((l) => l.name === RULES.expansionListName && l.modality === 'accounts')?.id;

  for (const listName of LISTS) {
    const label = labels.find((l) => l.name === listName && l.modality === 'accounts');
    if (!label) {
      console.log(`missing list ${listName}`);
      continue;
    }
    const accounts: Record<string, unknown>[] = [];
    for (let page = 1; page <= 10; page++) {
      const r = await request('POST', '/accounts/search', { account_label_ids: [label.id], page, per_page: 100 });
      const d = r.data as { accounts?: Record<string, unknown>[]; pagination?: { total_pages?: number } };
      accounts.push(...(d.accounts || []));
      if (!d.pagination?.total_pages || page >= d.pagination.total_pages) break;
    }
    const domains = accounts.map((a) => String(a.domain || a.primary_domain || '').toLowerCase()).filter(Boolean);
    const size = new Map<string, number>();
    for (let i = 0; i < domains.length; i += 10) {
      const r = await request('POST', '/organizations/search', { q_organization_domains_list: domains.slice(i, i + 10), page: 1, per_page: 100 });
      for (const o of ((r.data as { organizations?: Record<string, unknown>[] })?.organizations || [])) {
        const dom = String(o.primary_domain || '').toLowerCase();
        if (dom && o.estimated_num_employees) size.set(dom, Number(o.estimated_num_employees));
      }
    }

    const customer: { a: Record<string, unknown>; why: string }[] = [];
    const small: { a: Record<string, unknown>; emp: number | null }[] = [];
    for (const a of accounts) {
      const name = String(a.name || '');
      const dom = String(a.domain || a.primary_domain || '').toLowerCase();
      const group = GROUPS.find(([, re]) => re.test(name))?.[0];
      const why = clientStage.has(String(a.account_stage_id))
        ? 'Apollo stage: Current Client'
        : custDomains.has(dom)
          ? 'Customer domain'
          : custNames.has(norm(name))
            ? 'Customer name'
            : group
              ? `${group} group`
              : null;
      if (why) {
        customer.push({ a, why });
        continue;
      }
      const emp = size.get(dom) ?? null;
      if (emp === null ? RULES.dropUnknownSize : emp < RULES.minEmployees) small.push({ a, emp });
    }

    console.log(`${listName}: ${accounts.length} accounts`);
    console.log(`  customers / customer groups to move: ${customer.length}`);
    for (const c of customer) console.log(`    ${String(c.a.name)}  (${c.why})`);
    console.log(`  under ${RULES.minEmployees} staff or unknown size to remove: ${small.length}`);
    console.log(`    e.g. ${small.slice(0, 12).map((s) => `${s.a.name} (${s.emp ?? '?'})`).join(', ')}`);
    console.log(`  remaining: ${accounts.length - customer.length - small.length}`);

    if (!APPLY) continue;
    if (!expansionId) {
      const created = await request('POST', '/labels', { name: RULES.expansionListName, modality: 'accounts' });
      expansionId = (created.data as { label?: { id?: string } })?.label?.id;
    }
    let done = 0;
    for (const { a } of customer) {
      const ids = (Array.isArray(a.label_ids) ? a.label_ids.map(String) : []).filter((l) => l !== label.id);
      if (expansionId && !ids.includes(expansionId)) ids.push(expansionId);
      if ((await request('PUT', `/accounts/${a.id}`, { label_ids: ids })).ok) done++;
    }
    for (const { a } of small) {
      const ids = (Array.isArray(a.label_ids) ? a.label_ids.map(String) : []).filter((l) => l !== label.id);
      if ((await request('PUT', `/accounts/${a.id}`, { label_ids: ids })).ok) done++;
    }
    console.log(`  applied ${done} of ${customer.length + small.length} changes\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
