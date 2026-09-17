// Imports the customer base export into the customer_accounts table.
// Run with: npx tsx scripts/import-customer-accounts.ts [path-to-xlsx]
//
// The spreadsheet is gitignored because it carries per-account revenue, so
// this is a local, re-runnable load rather than part of the build. Re-running
// upserts on source_name, so a refreshed export updates in place.
//
// The export has 157 columns, almost all LinkedIn scrape noise (60
// relatedCompanies, ~50 distribution percentages). Only the columns below are
// read.

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FILE = args.find((a) => !a.startsWith('--')) || 'GTM1.xlsx';

// --dry-run parses and summarises without touching the database, so the
// transform can be checked where DATABASE_URL isn't available locally.
const sql = DRY_RUN ? null : neon(process.env.DATABASE_URL!);

/**
 * Several accounts carry a LinkedIn careers domain rather than the corporate
 * one, which would break any join to Apollo. These are the ones that matter —
 * the largest accounts by ARR. Anything not listed falls back to the
 * exported domain.
 */
const DOMAIN_OVERRIDES: Record<string, string> = {
  'jlpjobs.com': 'johnlewis.co.uk',
  'careers.dishoom.com': 'dishoom.com',
};

function toNumber(value: unknown): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  // Currency-formatted cells arrive as "$-" for zero and "$1,234.00" otherwise.
  const cleaned = value.replace(/[^0-9.-]/g, '');
  if (!cleaned || cleaned === '-') return null;
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function cleanDomain(raw: unknown): string | null {
  if (typeof raw !== 'string' || !raw.trim()) return null;
  const d = raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
  return d || null;
}

function text(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
}

async function main() {
  const filePath = path.resolve(process.cwd(), FILE);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const wb = XLSX.readFile(filePath);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null });

  console.log(`Read ${rows.length} rows from ${FILE} (sheet "${wb.SheetNames[0]}")`);

  if (!sql) {
    let arrTotal = 0;
    let named = 0;
    let overridden = 0;
    const byProduct: Record<string, number> = {};
    const arrByProduct: Record<string, number> = {};

    for (const row of rows) {
      const sourceName = text(row['original']) || text(row['companyName']);
      if (!sourceName) continue;
      named++;
      const domain = cleanDomain(row['domain']);
      if (domain && DOMAIN_OVERRIDES[domain]) overridden++;
      const arrUsd = toNumber(row['ARR']) ?? 0;
      arrTotal += arrUsd;
      const product = text(row['PRODUCT']) ?? '(none)';
      byProduct[product] = (byProduct[product] || 0) + 1;
      arrByProduct[product] = (arrByProduct[product] || 0) + arrUsd;
    }

    console.log(`\nDRY RUN — nothing written.`);
    console.log(`Rows with a usable name: ${named} of ${rows.length}`);
    console.log(`Domain overrides applied: ${overridden}`);
    console.log(`ARR total (USD): ${arrTotal.toLocaleString()}`);
    for (const p of Object.keys(byProduct)) {
      console.log(`  ${p}: ${byProduct[p]} accounts · $${arrByProduct[p].toLocaleString()}`);
    }
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS customer_accounts (
      id SERIAL PRIMARY KEY,
      source_name TEXT NOT NULL,
      company_name TEXT,
      domain TEXT,
      match_domain TEXT,
      product TEXT,
      arr_usd NUMERIC(14,2),
      cam_usd NUMERIC(14,2),
      cam_plus_usd NUMERIC(14,2),
      size_segment TEXT,
      industry TEXT,
      location TEXT,
      employee_count INTEGER,
      market_id TEXT,
      imported_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(source_name)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_customer_accounts_domain ON customer_accounts(match_domain)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_customer_accounts_market ON customer_accounts(market_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_customer_accounts_arr ON customer_accounts(arr_usd DESC)`;

  let imported = 0;
  let skipped = 0;
  let arrTotal = 0;

  for (const row of rows) {
    const sourceName = text(row['original']) || text(row['companyName']);
    if (!sourceName) {
      skipped++;
      continue;
    }

    const domain = cleanDomain(row['domain']);
    const matchDomain = domain ? DOMAIN_OVERRIDES[domain] ?? domain : null;
    const arrUsd = toNumber(row['ARR']);
    if (arrUsd) arrTotal += arrUsd;

    await sql`
      INSERT INTO customer_accounts (
        source_name, company_name, domain, match_domain, product,
        arr_usd, cam_usd, cam_plus_usd, size_segment, industry,
        location, employee_count
      ) VALUES (
        ${sourceName}, ${text(row['companyName'])}, ${domain}, ${matchDomain},
        ${text(row['PRODUCT'])}, ${arrUsd}, ${toNumber(row['CAM'])},
        ${toNumber(row['CAM+'])}, ${text(row['Segment'])}, ${text(row['industry'])},
        ${text(row['location'])}, ${toNumber(row['totalEmployeeCount'])}
      )
      ON CONFLICT (source_name) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        domain = EXCLUDED.domain,
        match_domain = EXCLUDED.match_domain,
        product = EXCLUDED.product,
        arr_usd = EXCLUDED.arr_usd,
        cam_usd = EXCLUDED.cam_usd,
        cam_plus_usd = EXCLUDED.cam_plus_usd,
        size_segment = EXCLUDED.size_segment,
        industry = EXCLUDED.industry,
        location = EXCLUDED.location,
        employee_count = EXCLUDED.employee_count,
        imported_at = NOW()
    `;
    imported++;
  }

  console.log(`Imported ${imported} accounts, skipped ${skipped} without a name`);
  console.log(`ARR total (USD, as exported): ${arrTotal.toLocaleString()}`);

  // market_id is left null: assigning each customer to a market from
  // lib/gtm-markets.ts needs rules we have not agreed yet.
  const unassigned = await sql`
    SELECT COUNT(*)::int AS n FROM customer_accounts WHERE market_id IS NULL
  `;
  console.log(`Accounts without a market assigned: ${(unassigned[0] as { n: number }).n}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
