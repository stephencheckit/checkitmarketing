// Assigns customer_accounts.market_id from the GTM market list.
// Run with: npx tsx scripts/classify-customer-markets.ts [--apply]
//
// Defaults to a dry run that prints the resulting distribution. Pass --apply
// to write market_id.
//
// Region comes from the ISO country code at the end of companyAddress in the
// source export, which is far more reliable than the city in `location`
// ("Cambridge" is ambiguous, and some rows are French or Luxembourgish).
// Because that column isn't imported, region is read from the spreadsheet and
// joined back on account name.

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as XLSX from 'xlsx';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const APPLY = process.argv.includes('--apply');
const FILE = process.argv.slice(2).find((a) => !a.startsWith('--')) || 'GTM1.xlsx';

const sql = neon(process.env.DATABASE_URL!);

type Region = 'uk' | 'us' | 'row';

const UK_COUNTRIES = new Set(['GB', 'IE', 'JE', 'GG', 'IM']);
const US_COUNTRIES = new Set(['US', 'CA']);

function regionFromAddress(address: unknown): Region | null {
  if (typeof address !== 'string') return null;
  const match = address.trim().match(/\b([A-Z]{2})$/);
  if (!match) return null;
  const code = match[1];
  if (UK_COUNTRIES.has(code)) return 'uk';
  if (US_COUNTRIES.has(code)) return 'us';
  return 'row';
}

const UK_TLD = /\.(uk|scot|wales|je|gg|im)$/;
const US_STATES =
  /,\s*(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)\b/;
const UK_COUNTIES =
  /\b(England|Scotland|Wales|Northern Ireland|Surrey|Nottinghamshire|Yorkshire|Kent|Essex|Hertfordshire|Cambridgeshire|Oxfordshire|Lancashire|Cheshire|Devon|Dorset|Hampshire|Berkshire|Wiltshire|Somerset|Suffolk|Norfolk|Staffordshire|Warwickshire|Derbyshire|Leicestershire|Lincolnshire|Middlesex)\b/i;

/**
 * Fallback for rows whose companyAddress has no trailing country code. A
 * UK-specific TLD is decisive; otherwise the headquarters string usually names
 * a US state or an English county.
 */
function regionFallback(domain: string | null, headquarters: unknown): Region | null {
  if (domain && UK_TLD.test(domain)) return 'uk';
  if (typeof headquarters === 'string') {
    if (US_STATES.test(headquarters)) return 'us';
    if (UK_COUNTIES.test(headquarters)) return 'uk';
  }
  return null;
}

// Industry groupings. The source has 59 distinct industry strings, including
// near-duplicates from different LinkedIn vintages ("Food & Beverages" vs
// "Food and Beverage Services"), so they are grouped rather than matched.
const NHS_DOMAIN = /(^|\.)nhs\.(uk|wales|scot)$|\.nhs\./;

const HOSPITAL_INDUSTRIES = new Set([
  'Hospitals and Health Care',
  'Medical Practices',
  'Government Administration',
]);

const LIFE_SCIENCE_INDUSTRIES = new Set([
  'Pharmaceutical Manufacturing',
  'Biotechnology Research',
  'Biotechnology',
  'Medical Equipment Manufacturing',
  'Medical Device',
  'Appliances, Electrical, and Electronics Manufacturing',
  'Automation Machinery Manufacturing',
]);

const FOOD_INDUSTRIES = new Set([
  'Hospitality',
  'Restaurants',
  'Food and Beverage Services',
  'Food & Beverages',
  'Food Production',
  'Food and Beverage Manufacturing',
  'Retail',
  'Retail Groceries',
]);

const LEISURE_INDUSTRIES = new Set([
  'Entertainment Providers',
  'Spectator Sports',
  'Gambling Facilities and Casinos',
  'Leisure, Travel & Tourism',
  'Travel Arrangements',
  'Events Services',
  'Wellness and Fitness Services',
  'Health, Wellness & Fitness',
]);

const EDUCATION_INDUSTRIES = new Set([
  'Higher Education',
  'Education Administration Programs',
  'E-Learning Providers',
]);

const FORECOURT_INDUSTRIES = new Set(['Oil and Gas']);
const UTILITY_INDUSTRIES = new Set(['Utilities']);

/**
 * Returns a market id, or a reason the account doesn't fit one. Unmatched
 * accounts are left null rather than forced into the nearest market — the
 * gaps are the point.
 */
function classify(
  region: Region | null,
  industry: string | null,
  domain: string | null
): { marketId: string | null; reason: string } {
  if (domain && NHS_DOMAIN.test(domain)) {
    return { marketId: 'uk-healthcare', reason: 'NHS domain' };
  }

  if (!industry) return { marketId: null, reason: 'no industry' };
  if (!region) return { marketId: null, reason: 'no country in address' };

  if (HOSPITAL_INDUSTRIES.has(industry)) {
    if (region === 'uk') return { marketId: 'uk-healthcare', reason: 'UK hospital' };
    if (region === 'us') return { marketId: 'us-medical', reason: 'US hospital' };
    return { marketId: null, reason: 'RoW hospital — no market' };
  }

  if (LIFE_SCIENCE_INDUSTRIES.has(industry)) {
    if (region === 'us') return { marketId: 'us-medical', reason: 'US life sciences' };
    // UK life sciences is only ~$320k across a dozen accounts — too small to
    // run as its own market, so it sits with the other UK medical demand.
    if (region === 'uk') return { marketId: 'uk-healthcare', reason: 'UK life sciences' };
    // Plasma and biologics majors are domiciled outside both regions (Grifols
    // is Spanish, Octapharma Swiss) while the revenue is US plasma collection.
    // us-medical already names Grifols, Octapharma and BioIVT as beachheads,
    // so RoW life sciences belongs there rather than nowhere.
    return { marketId: 'us-medical', reason: 'RoW life sciences (plasma/biologics)' };
  }

  if (FORECOURT_INDUSTRIES.has(industry)) {
    return region === 'uk'
      ? { marketId: 'uk-forecourts', reason: 'UK oil and gas' }
      : { marketId: null, reason: 'non-UK forecourt — no market' };
  }

  // UK water was a market of its own until it was dropped, so utilities now
  // have nowhere to land. Anglian Water stays a customer, just an unattributed
  // one, which is the honest reading of a segment nobody is selling into.
  if (UTILITY_INDUSTRIES.has(industry)) {
    return { marketId: null, reason: 'utilities — no market' };
  }

  if (LEISURE_INDUSTRIES.has(industry)) {
    if (region === 'uk') return { marketId: 'uk-entertainment', reason: 'UK leisure' };
    if (region === 'us') return { marketId: 'us-venues', reason: 'US venue' };
    return { marketId: null, reason: 'RoW leisure — no market' };
  }

  if (FOOD_INDUSTRIES.has(industry)) {
    if (region === 'uk') return { marketId: 'uk-foodservice', reason: 'UK food service' };
    if (region === 'us') return { marketId: 'us-facilities', reason: 'US food service' };
    return { marketId: null, reason: 'RoW food service — no market' };
  }

  if (EDUCATION_INDUSTRIES.has(industry)) {
    return { marketId: null, reason: 'education — no market' };
  }

  return { marketId: null, reason: `unmatched industry: ${industry}` };
}

async function main() {
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    XLSX.readFile(path.resolve(process.cwd(), FILE)).Sheets[
      XLSX.readFile(path.resolve(process.cwd(), FILE)).SheetNames[0]
    ],
    { defval: null }
  );

  const byMarket: Record<string, { n: number; arr: number }> = {};
  const unmatched: Record<string, { n: number; arr: number }> = {};
  const updates: { name: string; marketId: string }[] = [];

  for (const row of rows) {
    const name = (row['original'] || row['companyName']) as string | null;
    if (!name) continue;

    const industry = row['industry'] ? String(row['industry']).trim() : null;
    const domain = row['domain'] ? String(row['domain']).toLowerCase().trim() : null;
    const region =
      regionFromAddress(row['companyAddress']) ?? regionFallback(domain, row['headquarters']);
    const arr = typeof row['ARR'] === 'number' ? row['ARR'] : 0;

    const { marketId, reason } = classify(region, industry, domain);

    if (marketId) {
      byMarket[marketId] ||= { n: 0, arr: 0 };
      byMarket[marketId].n++;
      byMarket[marketId].arr += arr;
      updates.push({ name: String(name), marketId });
    } else {
      unmatched[reason] ||= { n: 0, arr: 0 };
      unmatched[reason].n++;
      unmatched[reason].arr += arr;
    }
  }

  const fmt = (v: number) => '$' + Math.round(v).toLocaleString();

  console.log('--- ASSIGNED ---');
  for (const [m, v] of Object.entries(byMarket).sort((a, b) => b[1].arr - a[1].arr)) {
    console.log(`  ${m.padEnd(18)} ${String(v.n).padStart(4)} accts  ${fmt(v.arr).padStart(12)}`);
  }

  const assignedArr = Object.values(byMarket).reduce((s, v) => s + v.arr, 0);
  const unmatchedArr = Object.values(unmatched).reduce((s, v) => s + v.arr, 0);

  console.log('\n--- NOT ASSIGNED ---');
  for (const [reason, v] of Object.entries(unmatched).sort((a, b) => b[1].arr - a[1].arr)) {
    console.log(`  ${String(v.n).padStart(4)} accts  ${fmt(v.arr).padStart(12)}  ${reason}`);
  }

  const total = assignedArr + unmatchedArr;
  // These totals come from the export, which predates the known churn and so
  // still counts John Lewis, Center Parcs and Dishoom. Churn status lives only
  // in the database, so the active picture is printed separately below.
  console.log(
    `\nAs exported (includes churn): assigned ${updates.length} accounts / ` +
      `${fmt(assignedArr)} (${((assignedArr / total) * 100).toFixed(0)}% of ARR), ` +
      `unassigned ${fmt(unmatchedArr)} (${((unmatchedArr / total) * 100).toFixed(0)}%)`
  );

  if (!APPLY) {
    console.log('\nDry run — nothing written. Re-run with --apply to write market_id.');
    return;
  }

  for (const u of updates) {
    await sql`UPDATE customer_accounts SET market_id = ${u.marketId} WHERE source_name = ${u.name}`;
  }
  console.log(`\nWrote market_id for ${updates.length} accounts.`);

  const live = (await sql`
    SELECT market_id,
           COUNT(*) FILTER (WHERE status = 'active')::int AS n_active,
           COALESCE(SUM(arr_usd) FILTER (WHERE status = 'active'), 0)::float AS arr_active,
           COALESCE(SUM(arr_usd) FILTER (WHERE status = 'churned'), 0)::float AS arr_churned
    FROM customer_accounts
    GROUP BY market_id
    ORDER BY arr_active DESC
  `) as { market_id: string | null; n_active: number; arr_active: number; arr_churned: number }[];

  console.log('\n--- ACTIVE ARR BY MARKET (database, churn excluded) ---');
  let activeTotal = 0;
  let churnTotal = 0;
  for (const r of live) {
    activeTotal += r.arr_active;
    churnTotal += r.arr_churned;
    console.log(
      `  ${(r.market_id || '(unassigned)').padEnd(18)} ${String(r.n_active).padStart(4)} accts  ` +
        `${fmt(r.arr_active).padStart(12)}` +
        (r.arr_churned ? `   (churned ${fmt(r.arr_churned)})` : '')
    );
  }
  console.log(`\nActive ${fmt(activeTotal)} · churned ${fmt(churnTotal)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
