/**
 * Tags every customer_accounts row that exists in Apollo into a single
 * "Customer · GTM1" account list, so customer exclusion is visible inside
 * Apollo rather than living only inside find-lookalikes.ts.
 *
 * This is deliberately a second layer on top of the stage check in
 * find-lookalikes.ts, because neither source covers the other:
 *
 *   - 174 of the Excel customers sit at "Cold" stage in Apollo, so a
 *     stage-only check would happily prospect them.
 *   - 238 accounts on Apollo's own customer lists match no Excel domain, so
 *     a spreadsheet-only check misses subsidiaries and post-export wins.
 *
 * Neither layer catches corporate siblings on an unrelated domain
 * (octapharmausa.com is the customer, octapharmaplasma.com the sibling);
 * that needs Apollo's stage data to be correct on the sibling record.
 *
 * Usage:
 *   npx tsx scripts/sync-customer-list.ts            # dry run
 *   npx tsx scripts/sync-customer-list.ts --apply
 */

import { neon } from '@neondatabase/serverless';

const APPLY = process.argv.includes('--apply');
const LABEL_NAME = 'Customer · GTM1';

const APOLLO = 'https://api.apollo.io/api/v1';
const API_KEY = process.env.APOLLO_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

if (!API_KEY) throw new Error('APOLLO_API_KEY is not set');
if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const HEADERS = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
};

const sql = neon(DATABASE_URL);

/**
 * Apollo enforces an hourly write quota and answers with retry-after when it
 * is spent, which can be a 30+ minute wait. Honouring it is the only way a
 * few hundred writes complete in one pass.
 */
async function request(method: 'GET' | 'POST' | 'PUT', path: string, body?: unknown, attempt = 0) {
  const res = await fetch(`${APOLLO}${path}`, {
    method,
    headers: HEADERS,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    const retryAfter = Number(res.headers.get('retry-after'));
    const waitMs =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? (retryAfter + 5) * 1000
        : Math.min(60_000, 2_000 * 2 ** attempt);
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

interface ApolloAccount {
  id: string;
  name: string;
  domain: string;
  labelIds: string[];
  stage: string | null;
}

/** Resolves the account record behind each domain, paging until exhausted. */
async function lookupAccounts(domains: string[], stageNames: Map<string, string>) {
  const found = new Map<string, ApolloAccount>();
  const BATCH = 40;

  for (let i = 0; i < domains.length; i += BATCH) {
    const batch = domains.slice(i, i + BATCH);
    for (let page = 1; page <= 10; page++) {
      const res = await request('POST', '/accounts/search', {
        q_organization_domains_list: batch,
        page,
        per_page: 100,
      });
      if (!res.ok) break;
      const d = res.data as {
        accounts?: Record<string, unknown>[];
        pagination?: { total_pages: number };
      };
      for (const a of d.accounts || []) {
        const dom = String(a.domain || '').toLowerCase();
        if (!dom || found.has(dom)) continue;
        found.set(dom, {
          id: String(a.id),
          name: String(a.name || ''),
          domain: dom,
          labelIds: Array.isArray(a.label_ids) ? a.label_ids.map(String) : [],
          stage: a.account_stage_id ? stageNames.get(String(a.account_stage_id)) || null : null,
        });
      }
      if (!d.pagination || page >= d.pagination.total_pages) break;
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  return found;
}

async function stageNameMap(): Promise<Map<string, string>> {
  const res = await request('GET', '/account_stages');
  if (!res.ok) return new Map();
  const d = res.data as {
    account_stages?: { id: string; name?: string; display_name?: string }[];
  };
  return new Map(
    (d.account_stages || []).map((s) => [String(s.id), s.display_name || s.name || ''])
  );
}

/** Apollo drops label_names on create, so the label must exist up front. */
async function ensureLabel(name: string): Promise<string | null> {
  const existing = await request('GET', '/labels');
  if (existing.ok) {
    const labels = existing.data as { id: string; name: string; modality: string }[];
    const hit = labels.find((l) => l.name === name && l.modality === 'accounts');
    if (hit) return String(hit.id);
  }
  if (!APPLY) return null;
  const res = await request('POST', '/labels', { name, modality: 'accounts' });
  if (!res.ok) return null;
  const d = res.data as { label?: { id?: string } };
  return d.label?.id ? String(d.label.id) : null;
}

async function main() {
  const customers = (await sql`
    SELECT company_name, source_name, lower(coalesce(match_domain, domain)) AS domain,
           arr_usd, status, market_id
    FROM customer_accounts
    WHERE coalesce(match_domain, domain) IS NOT NULL
  `) as {
    company_name: string | null;
    source_name: string | null;
    domain: string;
    arr_usd: string | null;
    status: string | null;
    market_id: string | null;
  }[];

  const domains = [...new Set(customers.map((c) => c.domain))];
  console.log(`${customers.length} customer rows, ${domains.length} unique domains.`);

  const stageNames = await stageNameMap();
  const accounts = await lookupAccounts(domains, stageNames);
  console.log(`${accounts.size} resolve to an Apollo account.\n`);

  const labelId = await ensureLabel(LABEL_NAME);
  const toTag = [...accounts.values()].filter((a) => !labelId || !a.labelIds.includes(labelId));

  // Customers Apollo still has at a prospectable stage are the reason this
  // list is needed: a stage-based exclusion would not protect them.
  const misStaged = [...accounts.values()].filter(
    (a) => !a.stage || !/current client|do not prospect/i.test(a.stage)
  );
  console.log(`${misStaged.length} are NOT at a customer stage in Apollo:`);
  const byStage: Record<string, number> = {};
  for (const a of misStaged) byStage[a.stage || 'none'] = (byStage[a.stage || 'none'] || 0) + 1;
  console.log(`  ${JSON.stringify(byStage)}\n`);

  const missing = customers.filter((c) => !accounts.has(c.domain));
  const missingArr = missing.reduce((s, c) => s + Number(c.arr_usd || 0), 0);
  console.log(
    `${missing.length} customer rows have no Apollo account ` +
      `($${Math.round(missingArr).toLocaleString()} ARR) — these need a domain fix or a record.\n`
  );

  if (!APPLY) {
    console.log(`Dry run — would tag ${toTag.length} accounts into "${LABEL_NAME}".`);
    console.log('Re-run with --apply to write.');
    return;
  }

  if (!labelId) {
    console.error(`Could not create or find the "${LABEL_NAME}" list.`);
    process.exit(1);
  }

  let tagged = 0;
  let failed = 0;
  const errors: Record<string, number> = {};

  for (const a of toTag) {
    const res = await request('PUT', `/accounts/${a.id}`, {
      label_ids: [...a.labelIds, labelId],
    });
    if (res.ok) {
      tagged++;
      if (tagged % 25 === 0) console.log(`  tagged ${tagged}/${toTag.length}`);
    } else {
      failed++;
      errors[String(res.status)] = (errors[String(res.status)] || 0) + 1;
    }
    await new Promise((r) => setTimeout(r, 180));
  }

  console.log(`\nTagged ${tagged} accounts into "${LABEL_NAME}".`);
  if (failed) console.log(`${failed} failed: ${JSON.stringify(errors)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
