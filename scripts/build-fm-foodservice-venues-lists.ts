/**
 * Build one Apollo account list per region for the expanded facilities
 * management target: FM operators, contract caterers / food service
 * management, and venue operators (stadiums, arenas, convention centres).
 *
 * Starts from the FM, contract-catering and venue accounts already in mapped
 * lists, then adds net-new operators from Apollo's organisation search,
 * filtered by industry so keyword noise stays out. Existing customers are
 * excluded by customer database domain, Apollo stage and customer lists, the
 * same three checks find-lookalikes.ts uses.
 *
 *   npx tsx --env-file=.env.vercel scripts/build-fm-foodservice-venues-lists.ts           # dry run
 *   npx tsx --env-file=.env.vercel scripts/build-fm-foodservice-venues-lists.ts --apply   # create + tag
 */

import { neon } from '@neondatabase/serverless';
import { isOperator, plausibleForRegion } from '../lib/apollo-icp';

const APPLY = process.argv.includes('--apply');
const APOLLO = 'https://api.apollo.io/api/v1';
const HEADERS = { 'x-api-key': process.env.APOLLO_API_KEY || '', 'Content-Type': 'application/json' };
const STAMP = new Date().toISOString().slice(0, 7);
const NEW_PER_REGION = 150;

type Segment = 'Facilities management' | 'Contract catering & food service' | 'Venues';

interface RegionSpec {
  region: 'US' | 'UK';
  label: string;
  locations: string[];
  /** Existing lists to seed from, with an optional industry filter per list. */
  seedLists: { id: string; name: string; industries?: string[] }[];
  searches: { segment: Segment; keywords: string[]; industries: string[] }[];
}

const SEGMENT_BY_INDUSTRY: Record<string, Segment> = {
  'facilities services': 'Facilities management',
  restaurants: 'Contract catering & food service',
  'food & beverages': 'Contract catering & food service',
  hospitality: 'Contract catering & food service',
  'events services': 'Venues',
  entertainment: 'Venues',
  'recreational facilities': 'Venues',
  sports: 'Venues',
  'museums & institutions': 'Venues',
};

const FM_INDUSTRIES = ['facilities services'];
const FOOD_INDUSTRIES = ['restaurants', 'food & beverages', 'hospitality'];
const VENUE_INDUSTRIES = ['entertainment', 'recreational facilities', 'sports', 'museums & institutions', 'events services'];

const RANGES = ['201,1000', '1001,5000', '5001,10000', '10001,500000'];

// Keyword search for "food service" and "venue" also returns foodservice
// distributors, cinemas and event security staffing, none of which run the
// kitchens or estates we monitor. Restaurant chains are dropped by leaving
// "restaurants" out of the searched industries instead.
const NOT_TARGET = /\b(sysco|bidfood|brakes|us foods|performance food|gordon food|cinemas?|theatres|vue|everyman|odeon|cineworld|security|showsec|contemporary services)\b/i;

const REGIONS: RegionSpec[] = [
  {
    region: 'US',
    label: `FM, Food Service & Venues · US · ${STAMP}`,
    locations: ['United States'],
    seedLists: [
      { id: '6ab1465d0bf79c001c3e8944', name: 'FM · US · 2026-09' },
      { id: '6aac24944ee6930018fcdfd7', name: 'Lookalike · Contract catering & FM · 2026-09', industries: [...FM_INDUSTRIES, 'food & beverages', 'hospitality'] },
      { id: '6aac23865a2fa300107fdfac', name: 'Lookalike · Venues & entertainment · 2026-09', industries: VENUE_INDUSTRIES },
    ],
    searches: [
      { segment: 'Facilities management', keywords: ['facilities management', 'integrated facilities management'], industries: FM_INDUSTRIES },
      { segment: 'Contract catering & food service', keywords: ['contract catering', 'food service management', 'dining services', 'concessions', 'corporate dining'], industries: ['food & beverages', 'hospitality', ...FM_INDUSTRIES] },
      { segment: 'Venues', keywords: ['stadium', 'arena', 'convention center', 'venue management', 'amphitheater'], industries: VENUE_INDUSTRIES },
    ],
  },
  {
    region: 'UK',
    label: `FM, Food Service & Venues · UK · ${STAMP}`,
    locations: ['United Kingdom'],
    seedLists: [
      { id: '6ab1465c304a16000cf8fefb', name: 'FM · UK · 2026-09' },
      // Mostly food manufacturers despite the name; keep only the operators.
      { id: '6aac233500f6cc001c1f809f', name: 'Lookalike · Food service & FM · 2026-09', industries: [...FM_INDUSTRIES, 'food & beverages', 'hospitality'] },
      { id: '6aac23100a208c0014c2f9e3', name: 'Lookalike · Entertainment & leisure · 2026-09', industries: VENUE_INDUSTRIES },
    ],
    searches: [
      { segment: 'Facilities management', keywords: ['facilities management', 'integrated facilities management'], industries: FM_INDUSTRIES },
      { segment: 'Contract catering & food service', keywords: ['contract catering', 'catering services', 'food service management', 'education catering', 'healthcare catering'], industries: ['food & beverages', 'hospitality', ...FM_INDUSTRIES] },
      { segment: 'Venues', keywords: ['stadium', 'arena', 'conference centre', 'event venue', 'racecourse'], industries: VENUE_INDUSTRIES },
    ],
  },
];

async function request(method: 'GET' | 'POST' | 'PUT', path: string, body?: unknown, attempt = 0): Promise<{ ok: boolean; status: number; data: unknown }> {
  const res = await fetch(`${APOLLO}${path}`, { method, headers: HEADERS, body: body ? JSON.stringify(body) : undefined });
  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    const retryAfter = Number(res.headers.get('retry-after'));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? (retryAfter + 5) * 1000 : Math.min(60_000, 2_000 * 2 ** attempt);
    console.log(`    rate limited, waiting ${Math.round(waitMs / 1000)}s…`);
    await new Promise((r) => setTimeout(r, waitMs));
    return request(method, path, body, attempt + 1);
  }
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // Non-JSON error body
  }
  return { ok: res.ok, status: res.status, data };
}

interface Account {
  id: string | null;
  name: string;
  domain: string;
  industry: string | null;
  employees: number | null;
  labelIds: string[];
  stageId: string | null;
  segment: Segment;
  source: string;
}

async function listAccounts(labelId: string) {
  const out: Record<string, unknown>[] = [];
  for (let page = 1; page <= 20; page++) {
    const r = await request('POST', '/accounts/search', { account_label_ids: [labelId], page, per_page: 100 });
    if (!r.ok) break;
    const d = r.data as { accounts?: Record<string, unknown>[]; pagination?: { total_pages?: number } };
    out.push(...(d.accounts || []));
    if (!d.pagination?.total_pages || page >= d.pagination.total_pages) break;
  }
  return out;
}

async function orgsByDomain(domains: string[]) {
  const map = new Map<string, Record<string, unknown>>();
  for (let i = 0; i < domains.length; i += 10) {
    const r = await request('POST', '/organizations/search', { q_organization_domains_list: domains.slice(i, i + 10), page: 1, per_page: 100 });
    if (!r.ok) continue;
    for (const o of ((r.data as { organizations?: Record<string, unknown>[] }).organizations || [])) {
      const dom = String(o.primary_domain || '').toLowerCase();
      if (dom && !map.has(dom)) map.set(dom, o);
    }
  }
  return map;
}

async function existingByDomain(domains: string[]) {
  const map = new Map<string, { id: string; labelIds: string[]; stageId: string | null }>();
  for (let i = 0; i < domains.length; i += 40) {
    for (let page = 1; page <= 5; page++) {
      const r = await request('POST', '/accounts/search', { q_organization_domains_list: domains.slice(i, i + 40), page, per_page: 100 });
      if (!r.ok) break;
      const d = r.data as { accounts?: Record<string, unknown>[]; pagination?: { total_pages?: number } };
      for (const a of d.accounts || []) {
        const dom = String(a.domain || a.primary_domain || '').toLowerCase();
        if (!dom || map.has(dom)) continue;
        map.set(dom, { id: String(a.id), labelIds: Array.isArray(a.label_ids) ? a.label_ids.map(String) : [], stageId: a.account_stage_id ? String(a.account_stage_id) : null });
      }
      if (!d.pagination?.total_pages || page >= d.pagination.total_pages) break;
    }
  }
  return map;
}

async function ensureLabel(name: string) {
  const r = await request('GET', '/labels');
  const hit = ((r.data as { id: string; name: string; modality: string }[]) || []).find((l) => l.name === name && l.modality === 'accounts');
  if (hit) return hit.id;
  const created = await request('POST', '/labels', { name, modality: 'accounts' });
  return (created.data as { label?: { id?: string } })?.label?.id || null;
}

async function main() {
  const sql = neon(process.env.DATABASE_URL || '');
  const customerDomains = new Set(
    ((await sql`SELECT DISTINCT lower(coalesce(match_domain, domain)) AS d FROM customer_accounts WHERE coalesce(match_domain, domain) IS NOT NULL`) as { d: string }[]).map((r) => r.d)
  );
  const stages = ((await request('GET', '/account_stages')).data as { account_stages?: { id: string; name?: string; display_name?: string }[] }).account_stages || [];
  const blockedStages = new Set(stages.filter((s) => /current client|do not prospect/i.test(s.display_name || s.name || '')).map((s) => s.id));
  const labels = ((await request('GET', '/labels')).data as { id: string; name: string; modality: string }[]) || [];
  const customerLabels = new Set(labels.filter((l) => l.modality === 'accounts' && ['Customers', 'Customer · GTM1', 'US Medical — Customers (do not sequence)'].includes(l.name)).map((l) => l.id));
  const isCustomer = (domain: string, labelIds: string[], stageId: string | null) =>
    customerDomains.has(domain) || (stageId !== null && blockedStages.has(stageId)) || labelIds.some((l) => customerLabels.has(l));
  console.log(`Excluding ${customerDomains.size} customer domains, ${blockedStages.size} blocked stages, ${customerLabels.size} customer lists.\n`);

  const claimed = new Set<string>();
  for (const spec of REGIONS) {
    const picked = new Map<string, Account>();
    let droppedCustomers = 0;
    let droppedIndustry = 0;

    // 1. Seed from existing mapped lists.
    for (const list of spec.seedLists) {
      const rows = await listAccounts(list.id);
      const doms = rows.map((a) => String(a.domain || a.primary_domain || '').toLowerCase()).filter(Boolean);
      const orgs = await orgsByDomain(doms);
      for (const a of rows) {
        const domain = String(a.domain || a.primary_domain || '').toLowerCase();
        if (!domain || picked.has(domain) || claimed.has(domain)) continue;
        const labelIds = Array.isArray(a.label_ids) ? a.label_ids.map(String) : [];
        const stageId = a.account_stage_id ? String(a.account_stage_id) : null;
        if (isCustomer(domain, labelIds, stageId)) {
          droppedCustomers++;
          continue;
        }
        if (NOT_TARGET.test(String(a.name || ''))) {
          droppedIndustry++;
          continue;
        }
        const org = orgs.get(domain);
        const industry = org?.industry ? String(org.industry) : null;
        if (list.industries && (!industry || !list.industries.includes(industry))) {
          droppedIndustry++;
          continue;
        }
        picked.set(domain, {
          id: String(a.id),
          name: String(a.name || ''),
          domain,
          industry,
          employees: org?.estimated_num_employees ? Number(org.estimated_num_employees) : null,
          labelIds,
          stageId,
          segment: (industry && SEGMENT_BY_INDUSTRY[industry]) || 'Facilities management',
          source: list.name,
        });
      }
    }
    const seeded = picked.size;

    // 2. Add net-new operators from organisation search.
    const candidates = new Map<string, Account>();
    for (const search of spec.searches) {
      const allowed = new Set(search.industries);
      for (const keyword of search.keywords) {
        for (let page = 1; page <= 3; page++) {
          const r = await request('POST', '/organizations/search', {
            q_organization_keyword_tags: [keyword],
            organization_locations: spec.locations,
            organization_num_employees_ranges: RANGES,
            page,
            per_page: 100,
          });
          if (!r.ok) break;
          const d = r.data as { organizations?: Record<string, unknown>[]; pagination?: { total_pages?: number } };
          for (const o of d.organizations || []) {
            const domain = String(o.primary_domain || '').toLowerCase();
            const name = String(o.name || '');
            const industry = String(o.industry || '');
            if (!domain || !name || !allowed.has(industry)) continue;
            if (!isOperator(name) || NOT_TARGET.test(name) || !plausibleForRegion(domain, spec.locations)) continue;
            if (picked.has(domain) || candidates.has(domain) || claimed.has(domain) || customerDomains.has(domain)) continue;
            candidates.set(domain, {
              id: null,
              name,
              domain,
              industry,
              employees: o.estimated_num_employees ? Number(o.estimated_num_employees) : null,
              labelIds: [],
              stageId: null,
              segment: search.segment,
              source: `Apollo search: ${keyword}`,
            });
          }
          if (!d.pagination?.total_pages || page >= d.pagination.total_pages) break;
        }
      }
    }

    const existing = await existingByDomain([...candidates.keys()]);
    const ranked = [...candidates.values()].sort((a, b) => (b.employees || 0) - (a.employees || 0));
    let added = 0;
    for (const c of ranked) {
      if (added >= NEW_PER_REGION) break;
      const ex = existing.get(c.domain);
      if (ex && isCustomer(c.domain, ex.labelIds, ex.stageId)) {
        droppedCustomers++;
        continue;
      }
      if (ex) Object.assign(c, { id: ex.id, labelIds: ex.labelIds, stageId: ex.stageId });
      picked.set(c.domain, c);
      added++;
    }
    for (const d of picked.keys()) claimed.add(d);

    const all = [...picked.values()];
    const bySegment = all.reduce<Record<string, number>>((acc, a) => ({ ...acc, [a.segment]: (acc[a.segment] || 0) + 1 }), {});
    console.log(`${spec.label}`);
    console.log(`  ${all.length} accounts: ${seeded} from existing lists, ${added} from search (${all.filter((a) => !a.id).length} new to Apollo)`);
    console.log(`  dropped ${droppedCustomers} customers, ${droppedIndustry} off-profile (e.g. food manufacturers)`);
    console.log(`  by segment: ${JSON.stringify(bySegment)}`);
    for (const seg of Object.keys(bySegment)) {
      const top = all.filter((a) => a.segment === seg).sort((a, b) => (b.employees || 0) - (a.employees || 0)).slice(0, 10);
      console.log(`  ${seg}: ${top.map((a) => a.name).join(', ')}`);
    }

    if (!APPLY) {
      console.log('  (dry run)\n');
      continue;
    }

    const labelId = await ensureLabel(spec.label);
    if (!labelId) {
      console.error(`  could not create label ${spec.label}`);
      continue;
    }
    let tagged = 0;
    let failed = 0;
    const toCreate = all.filter((a) => !a.id);
    for (let i = 0; i < toCreate.length; i += 100) {
      const r = await request('POST', '/accounts/bulk_create', {
        accounts: toCreate.slice(i, i + 100).map((a) => ({ name: a.name, domain: a.domain })),
        run_dedupe: true,
      });
      const d = r.data as { created_accounts?: Record<string, unknown>[]; existing_accounts?: Record<string, unknown>[] };
      for (const acc of [...(d?.created_accounts || []), ...(d?.existing_accounts || [])]) {
        const dom = String(acc.domain || acc.primary_domain || '').toLowerCase();
        const target = picked.get(dom);
        if (target) Object.assign(target, { id: String(acc.id), labelIds: Array.isArray(acc.label_ids) ? acc.label_ids.map(String) : [] });
      }
    }
    for (const a of all) {
      if (!a.id) {
        failed++;
        continue;
      }
      if (a.labelIds.includes(labelId)) {
        tagged++;
        continue;
      }
      const r = await request('PUT', `/accounts/${a.id}`, { label_ids: [...a.labelIds, labelId] });
      if (r.ok) tagged++;
      else failed++;
    }
    console.log(`  tagged ${tagged} into list ${labelId}${failed ? `, ${failed} failed` : ''}\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
