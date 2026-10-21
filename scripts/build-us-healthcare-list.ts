/**
 * Consolidate the US Healthcare Apollo lists into one target list of about
 * TARGET accounts. Seeds from the five us-medical lists, keeps accounts at or
 * above the size threshold, then tops up with net-new operators from Apollo's
 * organisation search, largest first. Customers and customer-group brands go
 * to the expansion list instead. Rules: scripts/target-list-rules.json.
 *
 *   npx tsx --env-file=.env.vercel scripts/build-us-healthcare-list.ts           # dry run
 *   npx tsx --env-file=.env.vercel scripts/build-us-healthcare-list.ts --apply
 */

import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';
import { isOperator, plausibleForRegion } from '../lib/apollo-icp';
import { GTM_MARKETS } from '../lib/gtm-markets';

const APPLY = process.argv.includes('--apply');
const TARGET = 250;
const LABEL = `US Healthcare targets · ${new Date().toISOString().slice(0, 7)}`;
const APOLLO = 'https://api.apollo.io/api/v1';
const HEADERS = { 'x-api-key': process.env.APOLLO_API_KEY || '', 'Content-Type': 'application/json' };
const RULES = JSON.parse(fs.readFileSync(path.join(__dirname, 'target-list-rules.json'), 'utf8')) as {
  minEmployees: number;
  dropUnknownSize: boolean;
  expansionListName: string;
  customerGroups: Record<string, string>;
};
const GROUPS = Object.entries(RULES.customerGroups).map(([g, re]) => [g, new RegExp(re, 'i')] as const);

// Medical practices are left out of the top-up: on the seed lists they were
// mostly orthopaedic practices and med spas with no cold-storage estate.
const SEARCHES = [
  { keyword: 'clinical laboratory', industries: ['hospital & health care', 'research', 'biotechnology'] },
  { keyword: 'reference laboratory', industries: ['hospital & health care', 'research', 'biotechnology'] },
  { keyword: 'blood center', industries: ['hospital & health care', 'nonprofit organization management', 'research'] },
  { keyword: 'plasma', industries: ['hospital & health care', 'biotechnology', 'pharmaceuticals'] },
  { keyword: 'biorepository', industries: ['research', 'biotechnology', 'hospital & health care'] },
  { keyword: 'tissue bank', industries: ['hospital & health care', 'biotechnology', 'nonprofit organization management'] },
  { keyword: 'cord blood', industries: ['hospital & health care', 'biotechnology'] },
  { keyword: 'health system', industries: ['hospital & health care'] },
  { keyword: 'hospital pharmacy', industries: ['hospital & health care', 'pharmaceuticals'] },
  { keyword: 'cell therapy', industries: ['biotechnology', 'pharmaceuticals', 'research'] },
];
const RANGES = ['201,1000', '1001,5000', '5001,10000', '10001,500000'];

// Health insurers, distributors, government agencies, billing firms, pharmacy
// automation vendors and CROs match the healthcare keywords and industries but
// run no labs or cold storage of their own.
const NOT_TARGET = /billing|vwr|avantor|omnicell|scriptpro|syneos|premier research|unitedhealth|\bcvs\b|elevance|anthem|cigna|humana|aetna|centene|molina|insurance|health plan|fisher scientific|cardinal health|mckesson|cencora|amerisourcebergen|owens & minor|medline|defense health|veterans affairs|department of/i;

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

interface Acct {
  id: string | null;
  name: string;
  domain: string;
  employees: number | null;
  labelIds: string[];
  stageId: string | null;
  source: string;
}

async function ensureLabel(name: string) {
  const labels = ((await request('GET', '/labels')).data as { id: string; name: string; modality: string }[]) || [];
  const hit = labels.find((l) => l.name === name && l.modality === 'accounts');
  if (hit) return hit.id;
  const created = await request('POST', '/labels', { name, modality: 'accounts' });
  return (created.data as { label?: { id?: string } })?.label?.id || null;
}

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
  const blocked = new Set(stages.filter((s) => /current client|do not prospect/i.test(s.display_name || s.name || '')).map((s) => s.id));
  const customerReason = (a: Acct) => {
    if (a.stageId && blocked.has(a.stageId)) return 'Apollo stage';
    if (custDomains.has(a.domain)) return 'Customer domain';
    if (custNames.has(norm(a.name))) return 'Customer name';
    const g = GROUPS.find(([, re]) => re.test(a.name));
    return g ? `${g[0]} group` : null;
  };
  const tooSmall = (e: number | null) => (e === null ? RULES.dropUnknownSize : e < RULES.minEmployees);

  // 1. Seeds from the existing us-medical lists.
  const seedLists = GTM_MARKETS.find((m) => m.id === 'us-medical')?.apolloLists || [];
  const seeds = new Map<string, Acct>();
  for (const list of seedLists) {
    for (let page = 1; page <= 10; page++) {
      const r = await request('POST', '/accounts/search', { account_label_ids: [list.id], page, per_page: 100 });
      const d = r.data as { accounts?: Record<string, unknown>[]; pagination?: { total_pages?: number } };
      for (const a of d.accounts || []) {
        const domain = String(a.domain || a.primary_domain || '').toLowerCase();
        const key = domain || String(a.name || '').toLowerCase();
        if (!key || seeds.has(key)) continue;
        seeds.set(key, {
          id: String(a.id),
          name: String(a.name || ''),
          domain,
          employees: null,
          labelIds: Array.isArray(a.label_ids) ? a.label_ids.map(String) : [],
          stageId: a.account_stage_id ? String(a.account_stage_id) : null,
          source: list.name,
        });
      }
      if (!d.pagination?.total_pages || page >= d.pagination.total_pages) break;
    }
  }
  const seedDomains = [...seeds.values()].map((a) => a.domain).filter(Boolean);
  for (let i = 0; i < seedDomains.length; i += 10) {
    const r = await request('POST', '/organizations/search', { q_organization_domains_list: seedDomains.slice(i, i + 10), page: 1, per_page: 100 });
    for (const o of ((r.data as { organizations?: Record<string, unknown>[] })?.organizations || [])) {
      const s = seeds.get(String(o.primary_domain || '').toLowerCase());
      if (s && o.estimated_num_employees) s.employees = Number(o.estimated_num_employees);
    }
  }

  const keep: Acct[] = [];
  const expansion: { a: Acct; why: string }[] = [];
  let small = 0;
  for (const a of seeds.values()) {
    const why = customerReason(a);
    if (why) expansion.push({ a, why });
    else if (tooSmall(a.employees)) small++;
    else keep.push(a);
  }
  console.log(`Seeds: ${seeds.size} accounts -> ${keep.length} kept, ${expansion.length} customers, ${small} under ${RULES.minEmployees} staff`);

  // 2. Top up from organisation search, largest first.
  const taken = new Set([...seeds.keys()]);
  const candidates = new Map<string, Acct & { industry: string; keyword: string }>();
  for (const s of SEARCHES) {
    if (keep.length >= TARGET) break;
    const allowed = new Set(s.industries);
    for (let page = 1; page <= 2; page++) {
      const r = await request('POST', '/organizations/search', {
        q_organization_keyword_tags: [s.keyword],
        organization_locations: ['United States'],
        organization_num_employees_ranges: RANGES,
        page,
        per_page: 100,
      });
      const d = r.data as { organizations?: Record<string, unknown>[]; pagination?: { total_pages?: number } };
      for (const o of d.organizations || []) {
        const domain = String(o.primary_domain || '').toLowerCase();
        const name = String(o.name || '');
        const industry = String(o.industry || '');
        if (!domain || !name || !allowed.has(industry) || taken.has(domain) || candidates.has(domain)) continue;
        if (!isOperator(name) || NOT_TARGET.test(name) || !plausibleForRegion(domain, ['United States'])) continue;
        candidates.set(domain, {
          id: null,
          name,
          domain,
          employees: o.estimated_num_employees ? Number(o.estimated_num_employees) : null,
          labelIds: [],
          stageId: null,
          source: `Apollo search: ${s.keyword}`,
          industry,
          keyword: s.keyword,
        });
      }
      if (!d.pagination?.total_pages || page >= d.pagination.total_pages) break;
    }
  }

  // Round-robin across search keywords, largest first within each, so labs,
  // blood and plasma operators are not crowded out by the biggest health systems.
  const byKeyword = new Map<string, (Acct & { keyword: string })[]>();
  for (const c of candidates.values()) {
    if (tooSmall(c.employees)) continue;
    byKeyword.set(c.keyword, [...(byKeyword.get(c.keyword) || []), c]);
  }
  for (const list of byKeyword.values()) list.sort((a, b) => (b.employees || 0) - (a.employees || 0));
  const ranked: (Acct & { keyword: string })[] = [];
  for (let i = 0; ranked.length < candidates.size; i++) {
    let any = false;
    for (const list of byKeyword.values()) {
      if (list[i]) {
        ranked.push(list[i]);
        any = true;
      }
    }
    if (!any) break;
  }
  const doms = ranked.map((c) => c.domain);
  const existing = new Map<string, { id: string; labelIds: string[]; stageId: string | null }>();
  for (let i = 0; i < doms.length; i += 40) {
    const r = await request('POST', '/accounts/search', { q_organization_domains_list: doms.slice(i, i + 40), page: 1, per_page: 100 });
    for (const a of ((r.data as { accounts?: Record<string, unknown>[] })?.accounts || [])) {
      const dom = String(a.domain || a.primary_domain || '').toLowerCase();
      if (dom && !existing.has(dom)) existing.set(dom, { id: String(a.id), labelIds: Array.isArray(a.label_ids) ? a.label_ids.map(String) : [], stageId: a.account_stage_id ? String(a.account_stage_id) : null });
    }
  }
  const added: Acct[] = [];
  for (const c of ranked.slice(0, (TARGET - keep.length) * 2)) {
    if (keep.length + added.length >= TARGET) break;
    const ex = existing.get(c.domain);
    if (ex) Object.assign(c, ex);
    const why = customerReason(c);
    if (why) {
      expansion.push({ a: c, why });
      continue;
    }
    added.push(c);
  }

  const final = [...keep, ...added];
  console.log(`Top-up: ${candidates.size} on profile, ${added.length} added (${added.filter((a) => !a.id).length} new to Apollo)`);
  console.log(`${LABEL}: ${final.length} accounts; ${expansion.length} to the expansion list`);
  console.log(`  added: ${added.map((a) => `${a.name} (${a.employees})`).join(', ')}`);
  console.log(`  to expansion: ${expansion.map((e) => `${e.a.name} [${e.why}]`).join(', ')}`);

  if (!APPLY) return;

  const toCreate = final.filter((a) => !a.id);
  for (let i = 0; i < toCreate.length; i += 100) {
    const r = await request('POST', '/accounts/bulk_create', { accounts: toCreate.slice(i, i + 100).map((a) => ({ name: a.name, domain: a.domain })), run_dedupe: true });
    const d = r.data as { created_accounts?: Record<string, unknown>[]; existing_accounts?: Record<string, unknown>[] };
    for (const acc of [...(d?.created_accounts || []), ...(d?.existing_accounts || [])]) {
      const dom = String(acc.domain || acc.primary_domain || '').toLowerCase();
      const t = toCreate.find((a) => a.domain === dom);
      if (t) Object.assign(t, { id: String(acc.id), labelIds: Array.isArray(acc.label_ids) ? acc.label_ids.map(String) : [] });
    }
  }

  const labelId = await ensureLabel(LABEL);
  const expansionId = await ensureLabel(RULES.expansionListName);
  let tagged = 0;
  let failed = 0;
  for (const a of final) {
    if (!a.id || !labelId) {
      failed++;
      continue;
    }
    if (a.labelIds.includes(labelId) || (await request('PUT', `/accounts/${a.id}`, { label_ids: [...a.labelIds, labelId] })).ok) tagged++;
    else failed++;
  }
  let moved = 0;
  for (const { a } of expansion) {
    if (!a.id || !expansionId || a.labelIds.includes(expansionId)) continue;
    if ((await request('PUT', `/accounts/${a.id}`, { label_ids: [...a.labelIds, expansionId] })).ok) moved++;
  }
  console.log(`Tagged ${tagged} into ${LABEL} (${labelId})${failed ? `, ${failed} failed` : ''}; ${moved} added to the expansion list`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
