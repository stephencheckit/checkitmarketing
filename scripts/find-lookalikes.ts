/**
 * Find lookalike accounts in Apollo that are not already customers, and tag
 * them into a per-market Apollo list.
 *
 * Two Apollo endpoints are needed because neither is sufficient alone:
 *
 *   /organizations/search  carries `industry` and `estimated_num_employees`,
 *                          which the industry filter depends on, but gives no
 *                          indication of whether an org is already an account.
 *   /accounts/search       accepts `q_organization_domains_list`, so workspace
 *                          membership can be checked a batch of domains at a
 *                          time.
 *
 * /mixed_companies/search looks like the obvious choice since it splits
 * `accounts` from `organizations`, but it omits `industry` and headcount from
 * the net-new records, which makes the keyword noise impossible to filter — a
 * search for "plasma" returns plasma *welding* firms.
 *
 * Membership is checked per candidate rather than from an exclusion list built
 * up front: the workspace holds 80,385 accounts, well past the 10,000-result
 * cap on search enumeration.
 *
 * Customer domains from customer_accounts are excluded as a second pass, since
 * a customer could exist in the export without being an Apollo account.
 *
 *   npx tsx scripts/find-lookalikes.ts                    # dry run, all markets
 *   npx tsx scripts/find-lookalikes.ts --market us-medical
 *   npx tsx scripts/find-lookalikes.ts --apply             # create + tag
 *   npx tsx scripts/find-lookalikes.ts --limit 50
 */

import { neon } from '@neondatabase/serverless';
import { ICP_PROFILES, isOperator, plausibleForRegion } from '../lib/apollo-icp';
import { GTM_MARKETS } from '../lib/gtm-markets';

const APPLY = process.argv.includes('--apply');

function argValue(flag: string): string | null {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : null;
}

const ONLY_MARKET = argValue('--market');
const PER_MARKET = Number(argValue('--limit') || 200);

if (!process.env.APOLLO_API_KEY) {
  console.error('APOLLO_API_KEY is not set.');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const APOLLO = 'https://api.apollo.io/api/v1';
const HEADERS = {
  'x-api-key': process.env.APOLLO_API_KEY,
  'Content-Type': 'application/json',
};

/** Cohort label, dated so a tagged batch stays auditable and reversible. */
const STAMP = new Date().toISOString().slice(0, 7);

interface Candidate {
  name: string;
  domain: string;
  industry: string;
  employees: number | null;
  city: string | null;
}

/**
 * Apollo rate limits writes in bursts and returns 429 for a window of several
 * minutes. Without backoff a long tagging run loses whole markets: a first
 * pass dropped entertainment, food service and water entirely while the
 * markets either side of them succeeded.
 */
async function request(method: 'POST' | 'PUT', path: string, body: unknown, attempt = 0) {
  const res = await fetch(`${APOLLO}${path}`, {
    method,
    headers: HEADERS,
    body: JSON.stringify(body),
  });

  if ((res.status === 429 || res.status >= 500) && attempt < 4) {
    // Apollo's write quota is hourly, and on exhaustion it reports
    // x-hourly-requests-left: 0 with a retry-after in seconds — commonly over
    // 30 minutes. Exponential backoff alone cannot bridge that, so the header
    // is honoured when present.
    const retryAfter = Number(res.headers.get('retry-after'));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
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

async function post(path: string, body: unknown) {
  return request('POST', path, body);
}

interface SearchResponse {
  accounts?: Record<string, unknown>[];
  organizations?: Record<string, unknown>[];
  pagination?: { page: number; total_pages: number; total_entries: number };
}

/** Global-database search. Includes orgs that are already accounts. */
async function searchOrganizations(
  keyword: string,
  locations: string[],
  ranges: string[],
  page: number
): Promise<{ orgs: Record<string, unknown>[]; totalPages: number }> {
  const res = await post('/organizations/search', {
    q_organization_keyword_tags: [keyword],
    organization_locations: locations,
    organization_num_employees_ranges: ranges,
    page,
    per_page: 100,
  });
  if (!res.ok) return { orgs: [], totalPages: 0 };
  const d = res.data as SearchResponse;
  return { orgs: d.organizations || [], totalPages: d.pagination?.total_pages || 0 };
}

interface ExistingAccount {
  id: string;
  /** Current labels, so tagging can append instead of replacing. */
  labelIds: string[];
  stageId: string | null;
}

/**
 * Stages that disqualify an account from a prospecting list. The
 * customer_accounts domain set alone is not enough: corporate groups buy under
 * one domain and appear under another (octapharmausa.com is the customer,
 * octapharmaplasma.com is the sibling), and the spreadsheet lags Apollo on
 * renames and mergers. Apollo's own stage is the more reliable signal.
 */
const BLOCKED_STAGES = /current client|do not prospect/i;

async function blockedStageIds(): Promise<Set<string>> {
  const res = await fetch(`${APOLLO}/account_stages`, { headers: HEADERS });
  if (!res.ok) return new Set();
  const d = (await res.json()) as {
    account_stages?: { id: string; name?: string; display_name?: string }[];
  };
  return new Set(
    (d.account_stages || [])
      .filter((s) => BLOCKED_STAGES.test(s.display_name || s.name || ''))
      .map((s) => String(s.id))
  );
}

/** Label ids whose membership marks an account as an existing customer. */
async function customerLabelIds(): Promise<Set<string>> {
  const res = await fetch(`${APOLLO}/labels`, { headers: HEADERS });
  if (!res.ok) return new Set();
  const labels = (await res.json()) as { id: string; name: string; modality: string }[];
  return new Set(
    labels
      .filter((l) => l.modality === 'accounts' && /customer|current client/i.test(l.name))
      .map((l) => String(l.id))
  );
}

/**
 * Maps each of `domains` that already exists as an account to its id and
 * current labels. One domain can carry several entities (20 accounts share
 * bp.com), so results are paged until exhausted and the first hit per domain
 * wins.
 */
async function lookupExistingAccounts(domains: string[]): Promise<Map<string, ExistingAccount>> {
  const present = new Map<string, ExistingAccount>();
  const BATCH = 40;

  for (let i = 0; i < domains.length; i += BATCH) {
    const batch = domains.slice(i, i + BATCH);
    for (let page = 1; page <= 10; page++) {
      const res = await post('/accounts/search', {
        q_organization_domains_list: batch,
        page,
        per_page: 100,
      });
      if (!res.ok) break;
      const d = res.data as SearchResponse;
      for (const a of d.accounts || []) {
        const dom = String(a.domain || a.primary_domain || '').toLowerCase();
        if (!dom || present.has(dom)) continue;
        present.set(dom, {
          id: String(a.id),
          labelIds: Array.isArray(a.label_ids) ? a.label_ids.map(String) : [],
          stageId: a.account_stage_id ? String(a.account_stage_id) : null,
        });
      }
      if (!d.pagination || page >= d.pagination.total_pages) break;
    }
    await new Promise((r) => setTimeout(r, 120));
  }
  return present;
}

/**
 * Apollo ignores `label_names` on account create — it returns 200 and silently
 * drops them — and /accounts/bulk_update accepts `label_ids` with a 200 without
 * applying them either. Creating the label up front and PUTting `label_ids`
 * per account is the only path that actually sticks.
 */
async function ensureLabel(name: string): Promise<string | null> {
  const existing = await fetch(`${APOLLO}/labels`, { headers: HEADERS });
  if (existing.ok) {
    const labels = (await existing.json()) as { id: string; name: string; modality: string }[];
    const hit = labels.find((l) => l.name === name && l.modality === 'accounts');
    if (hit) return hit.id;
  }
  const res = await post('/labels', { name, modality: 'accounts' });
  if (!res.ok) return null;
  const d = res.data as { label?: { id?: string } };
  return d.label?.id ? String(d.label.id) : null;
}

/** Appends a label, preserving any lists the account already belongs to. */
async function addLabel(accountId: string, labelId: string, current: string[]) {
  if (current.includes(labelId)) return { ok: true, status: 200 };
  const res = await request('PUT', `/accounts/${accountId}`, {
    label_ids: [...current, labelId],
  });
  return { ok: res.ok, status: res.status };
}

async function main() {
  const customerDomains = new Set(
    (
      (await sql`
        SELECT DISTINCT lower(coalesce(match_domain, domain)) AS d
        FROM customer_accounts
        WHERE coalesce(match_domain, domain) IS NOT NULL
      `) as { d: string }[]
    ).map((r) => r.d)
  );
  const blockedStages = await blockedStageIds();
  const customerLabels = await customerLabelIds();
  const isCustomerAccount = (a: ExistingAccount) =>
    (a.stageId !== null && blockedStages.has(a.stageId)) ||
    a.labelIds.some((l) => customerLabels.has(l));

  console.log(
    `Excluding ${customerDomains.size} customer domains, ` +
      `${blockedStages.size} blocked stages, ${customerLabels.size} customer lists.\n`
  );

  const profiles = ONLY_MARKET
    ? ICP_PROFILES.filter((p) => p.marketId === ONLY_MARKET)
    : ICP_PROFILES;

  if (!profiles.length) {
    console.error(`No ICP profile for market "${ONLY_MARKET}".`);
    process.exit(1);
  }

  // Deduped across markets as well as within one, so an account tagged for
  // uk-foodservice is not also handed to uk-entertainment.
  const claimed = new Set<string>();
  const results: {
    marketId: string;
    label: string;
    tagExisting: Candidate[];
    createNew: Candidate[];
    inWorkspace: Map<string, ExistingAccount>;
    matched: number;
  }[] = [];

  for (const profile of profiles) {
    const market = GTM_MARKETS.find((m) => m.id === profile.marketId);
    const allowed = new Set(profile.industries);
    const found = new Map<string, Candidate>();
    let existing = 0;

    // Over-collect, because the workspace-membership pass below removes a
    // large share — much of the obvious universe is already in Apollo.
    const target = PER_MARKET * 3;

    for (const keyword of profile.keywords) {
      if (found.size >= target) break;

      for (let page = 1; page <= 6; page++) {
        const { orgs, totalPages } = await searchOrganizations(
          keyword,
          profile.locations,
          profile.employeeRanges,
          page
        );

        for (const o of orgs) {
          const domain = String(o.primary_domain || '').toLowerCase();
          const industry = String(o.industry || '');
          const name = String(o.name || '');
          if (!domain || !name) continue;
          // The industry check is what removes keyword noise.
          if (!allowed.has(industry)) continue;
          if (!isOperator(name)) continue;
          if (!plausibleForRegion(domain, profile.locations)) continue;
          if (customerDomains.has(domain)) continue;
          if (claimed.has(domain) || found.has(domain)) continue;
          found.set(domain, {
            name,
            domain,
            industry,
            employees: o.estimated_num_employees ? Number(o.estimated_num_employees) : null,
            city: o.city ? String(o.city) : null,
          });
        }

        if (page >= totalPages) break;
        if (found.size >= target) break;
      }
    }

    const inWorkspace = await lookupExistingAccounts([...found.keys()]);

    // Accounts Apollo already holds are tagged in place. They cost no new
    // records and carry whatever stage and contact history already exists, so
    // they are filled first and the per-market cap is spent on them before any
    // account is created.
    const onProfile = [...found.values()];
    const customerHits = onProfile.filter((c) => {
      const a = inWorkspace.get(c.domain);
      return a ? isCustomerAccount(a) : false;
    });
    for (const c of customerHits) claimed.add(c.domain);

    const prospectable = onProfile.filter((c) => !customerHits.includes(c));
    const toTag = prospectable.filter((c) => inWorkspace.has(c.domain));
    const toCreate = prospectable.filter((c) => !inWorkspace.has(c.domain));

    const tagExisting = toTag.slice(0, PER_MARKET);
    const createNew = toCreate.slice(0, Math.max(0, PER_MARKET - tagExisting.length));
    for (const c of [...tagExisting, ...createNew]) claimed.add(c.domain);
    existing = tagExisting.length;

    const label = `Lookalike · ${market?.label || profile.marketId} · ${STAMP}`;
    results.push({
      marketId: profile.marketId,
      label,
      tagExisting,
      createNew,
      inWorkspace,
      matched: found.size,
    });

    console.log(
      `${profile.marketId.padEnd(18)} ${String(found.size).padStart(4)} on profile  ->  ` +
        `${String(existing).padStart(3)} existing accounts to tag, ` +
        `${String(createNew.length).padStart(3)} to create` +
        (customerHits.length ? `, ${customerHits.length} dropped as customers` : '')
    );
    for (const c of [...tagExisting, ...createNew].slice(0, 5)) {
      console.log(
        `    ${c.name.slice(0, 36).padEnd(38)} ${c.domain.padEnd(30)} ${c.industry.padEnd(24)} ${
          c.employees ?? '?'
        }`
      );
    }
  }

  const totalTag = results.reduce((s, r) => s + r.tagExisting.length, 0);
  const totalNew = results.reduce((s, r) => s + r.createNew.length, 0);
  console.log(
    `\n${totalTag + totalNew} accounts to label: ${totalTag} already in Apollo, ${totalNew} new records.`
  );

  if (!APPLY) {
    console.log('\nDry run — nothing written to Apollo. Re-run with --apply to create and tag.');
    return;
  }

  console.log('\nTagging in Apollo…');
  for (const r of results) {
    if (!r.tagExisting.length && !r.createNew.length) continue;

    const labelId = await ensureLabel(r.label);
    if (!labelId) {
      console.log(`  ${r.label} — could not create label, skipped`);
      continue;
    }

    let tagged = 0;
    let created = 0;
    let failed = 0;
    const errors: Record<string, number> = {};

    for (const c of r.tagExisting) {
      const acct = r.inWorkspace.get(c.domain);
      if (!acct) continue;
      const out = await addLabel(acct.id, labelId, acct.labelIds);
      if (out.ok) tagged++;
      else {
        failed++;
        errors[String(out.status)] = (errors[String(out.status)] || 0) + 1;
      }
      await new Promise((res) => setTimeout(res, 150));
    }

    for (const c of r.createNew) {
      const res = await post('/accounts', { name: c.name, domain: c.domain });
      const acct = (res.data as { account?: { id?: string; label_ids?: unknown } } | null)?.account;
      if (!res.ok || !acct?.id) {
        failed++;
        errors[String(res.status)] = (errors[String(res.status)] || 0) + 1;
        continue;
      }
      const current = Array.isArray(acct.label_ids) ? acct.label_ids.map(String) : [];
      const out = await addLabel(String(acct.id), labelId, current);
      if (out.ok) created++;
      else {
        failed++;
        errors[String(out.status)] = (errors[String(out.status)] || 0) + 1;
      }
      await new Promise((res) => setTimeout(res, 150));
    }

    const detail = Object.keys(errors).length
      ? `  [${Object.entries(errors)
          .map(([s, n]) => `${n}x HTTP ${s}`)
          .join(', ')}]`
      : '';
    console.log(
      `  ${r.label} — tagged ${tagged} existing, created ${created}, failed ${failed}${detail}`
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
