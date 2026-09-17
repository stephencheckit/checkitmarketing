/**
 * Resolve missing and junk domains on customer_accounts via Apollo company search.
 *
 * The spreadsheet export carries a LinkedIn-scraped `domain` that is wrong for a
 * meaningful slice of the base: Grifols is "linktr.ee", Nxera Pharma is
 * "linkedin.com", and several NHS trusts came through with no domain at all.
 * Because market classification keys off the domain, a single bad value can
 * strand a large account — Grifols is $1.39m sitting outside any market.
 *
 * Domains are looked up in Apollo by company name rather than hand-written, so
 * the values are sourced rather than guessed. Apollo name matching is fuzzy, so
 * every proposal is scored and only exact/strong matches are written unless
 * --include-weak is passed.
 *
 *   npx tsx scripts/fix-customer-domains.ts              # dry run
 *   npx tsx scripts/fix-customer-domains.ts --apply      # write strong matches
 */

import { neon } from '@neondatabase/serverless';

const APPLY = process.argv.includes('--apply');
const INCLUDE_WEAK = process.argv.includes('--include-weak');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}
if (!process.env.APOLLO_API_KEY) {
  console.error('APOLLO_API_KEY is not set.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

/**
 * Domains that identify a social or link-aggregator page rather than the
 * company. These come from LinkedIn's "website" field being set to whatever the
 * company put on its profile.
 */
const JUNK_DOMAIN = /(linktr\.ee|linkedin\.com|facebook\.com|instagram\.com|twitter\.com|x\.com|jlpjobs\.com|bit\.ly)/i;

/**
 * Domains shared by many unrelated organisations. Apollo returns these as an
 * exact name match — Wexham Park Hospital resolves to "nhs.net", the shared NHS
 * mail domain — but writing one would merge distinct accounts onto a single key
 * and corrupt any domain join. Left unresolved for manual attention instead.
 */
const SHARED_DOMAIN = new Set([
  'nhs.net',
  'nhs.uk',
  'gmail.com',
  'googlemail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
  'btinternet.com',
]);

type Confidence = 'exact' | 'strong' | 'weak';

interface Row {
  id: number;
  source_name: string;
  company_name: string | null;
  domain: string | null;
  match_domain: string | null;
  arr_usd: number | null;
  market_id: string | null;
}

interface ApolloOrg {
  name?: string;
  primary_domain?: string | null;
  estimated_num_employees?: number | null;
  industry?: string | null;
}

/**
 * Strips the legal-form and punctuation noise that stops an otherwise obvious
 * match: "GEORGES TRADITION LIMITED" vs "Georges Tradition".
 */
function normalise(name: string) {
  return name
    .toLowerCase()
    .replace(/\b(limited|ltd|plc|inc|llc|corp|corporation|company|co|group|holdings|the)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function score(queryName: string, candidate: string): Confidence | null {
  const a = normalise(queryName);
  const b = normalise(candidate);
  if (!a || !b) return null;
  if (a === b) return 'exact';
  if (a.startsWith(b) || b.startsWith(a)) return 'strong';
  if (a.includes(b) || b.includes(a)) return 'weak';
  return null;
}

async function searchApollo(name: string): Promise<ApolloOrg[]> {
  const res = await fetch('https://api.apollo.io/api/v1/mixed_companies/search', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.APOLLO_API_KEY as string,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q_organization_name: name, page: 1, per_page: 10 }),
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { accounts?: ApolloOrg[]; organizations?: ApolloOrg[] };
  // Workspace accounts and global orgs come back in separate arrays.
  return [...(data.accounts || []), ...(data.organizations || [])];
}

async function main() {
  const rows = (await sql`
    SELECT id, source_name, company_name, domain, match_domain, arr_usd, market_id
    FROM customer_accounts
    WHERE status = 'active'
    ORDER BY arr_usd DESC NULLS LAST
  `) as Row[];

  const needsFix = rows.filter((r) => {
    const d = r.match_domain || r.domain;
    return !d || JUNK_DOMAIN.test(d);
  });

  console.log(
    `${needsFix.length} active accounts need a domain (of ${rows.length}), ` +
      `carrying $${Math.round(
        needsFix.reduce((s, r) => s + (Number(r.arr_usd) || 0), 0)
      ).toLocaleString()} ARR\n`
  );

  const proposals: { row: Row; domain: string; confidence: Confidence; matched: string }[] = [];
  const unresolved: Row[] = [];

  for (const row of needsFix) {
    const name = row.company_name || row.source_name;
    const candidates = await searchApollo(name);

    let best: { domain: string; confidence: Confidence; matched: string } | null = null;
    const rank: Record<Confidence, number> = { exact: 3, strong: 2, weak: 1 };

    for (const c of candidates) {
      const dom = (c.primary_domain || '').toLowerCase();
      if (!dom || JUNK_DOMAIN.test(dom) || SHARED_DOMAIN.has(dom)) continue;
      const conf = score(name, c.name || '');
      if (!conf) continue;
      if (!best || rank[conf] > rank[best.confidence]) {
        best = { domain: dom, confidence: conf, matched: c.name || '' };
      }
    }

    if (best) proposals.push({ row, ...best });
    else unresolved.push(row);

    // Apollo rate limits on burst; this runs over a few dozen rows at most.
    await new Promise((r) => setTimeout(r, 120));
  }

  const money = (v: number | null) => '$' + Math.round(Number(v) || 0).toLocaleString();

  console.log('=== PROPOSED DOMAINS ===');
  for (const p of proposals.sort((a, b) => (Number(b.row.arr_usd) || 0) - (Number(a.row.arr_usd) || 0))) {
    console.log(
      `${p.confidence.toUpperCase().padEnd(7)} ${money(p.row.arr_usd).padStart(11)}  ` +
        `${(p.row.company_name || p.row.source_name).slice(0, 34).padEnd(36)} ` +
        `-> ${p.domain.padEnd(30)} (Apollo: ${p.matched.slice(0, 28)})`
    );
  }

  if (unresolved.length) {
    console.log('\n=== UNRESOLVED (no confident Apollo match) ===');
    for (const r of unresolved.sort((a, b) => (Number(b.arr_usd) || 0) - (Number(a.arr_usd) || 0))) {
      console.log(`${money(r.arr_usd).padStart(11)}  ${(r.company_name || r.source_name).slice(0, 44)}`);
    }
  }

  const writable = proposals.filter(
    (p) => INCLUDE_WEAK || p.confidence === 'exact' || p.confidence === 'strong'
  );

  console.log(
    `\n${writable.length} writable (${proposals.length} proposed, ${unresolved.length} unresolved)` +
      `  ARR recovered: ${money(writable.reduce((s, p) => s + (Number(p.row.arr_usd) || 0), 0))}`
  );

  if (!APPLY) {
    console.log('\nDry run. Re-run with --apply to write match_domain.');
    return;
  }

  for (const p of writable) {
    await sql`UPDATE customer_accounts SET match_domain = ${p.domain} WHERE id = ${p.row.id}`;
  }
  console.log(`Updated ${writable.length} rows.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
