// Records churn against the customer base export.
// Run with: npx tsx scripts/mark-customer-churn.ts [--apply]
//
// The spreadsheet is a point-in-time export with no churn flag, and accounts
// have left since. Rather than deleting rows — which would quietly change
// historic totals — each account carries a status, so a stale figure can still
// be traced to the row that produced it.
//
// This list is directional, not authoritative: it is what we have been told
// has churned, not a reconciliation against billing. Keep `confidence` honest.

import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const APPLY = process.argv.includes('--apply');
const sql = neon(process.env.DATABASE_URL!);

type Confidence = 'reported' | 'confirmed';

/**
 * Matched on source_name with a LIKE, because the export's names carry legal
 * suffixes ("John Lewis plc", "Center Parcs Ltd") that nobody types.
 */
const CHURN: { match: string; note: string; confidence: Confidence }[] = [
  { match: 'John Lewis%', note: 'Churned since export', confidence: 'reported' },
  { match: 'Center Parcs%', note: 'Churned since export', confidence: 'reported' },
  { match: 'Dishoom%', note: 'Churned since export', confidence: 'reported' },
];

async function main() {
  await sql`
    ALTER TABLE customer_accounts
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active'
  `;
  await sql`
    ALTER TABLE customer_accounts
      ADD COLUMN IF NOT EXISTS status_note TEXT
  `;
  await sql`
    ALTER TABLE customer_accounts
      ADD COLUMN IF NOT EXISTS status_confidence TEXT
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_customer_accounts_status ON customer_accounts(status)`;

  for (const c of CHURN) {
    const rows = (await sql`
      SELECT source_name, arr_usd, market_id
      FROM customer_accounts
      WHERE source_name ILIKE ${c.match}
    `) as { source_name: string; arr_usd: string | null; market_id: string | null }[];

    if (rows.length === 0) {
      console.log(`  NO MATCH for ${c.match}`);
      continue;
    }

    for (const r of rows) {
      console.log(
        `  ${r.source_name} — $${Number(r.arr_usd || 0).toLocaleString()} (${r.market_id ?? 'unassigned'})`
      );
    }

    if (APPLY) {
      await sql`
        UPDATE customer_accounts
        SET status = 'churned',
            status_note = ${c.note},
            status_confidence = ${c.confidence}
        WHERE source_name ILIKE ${c.match}
      `;
    }
  }

  const summary = (await sql`
    SELECT status,
           COUNT(*)::int AS accounts,
           COALESCE(SUM(arr_usd), 0)::float AS arr_usd
    FROM customer_accounts
    GROUP BY status
    ORDER BY arr_usd DESC
  `) as { status: string; accounts: number; arr_usd: number }[];

  console.log('\n--- BY STATUS ---');
  for (const s of summary) {
    console.log(
      `  ${(s.status || 'null').padEnd(8)} ${String(s.accounts).padStart(4)} accts  $${Math.round(s.arr_usd).toLocaleString()}`
    );
  }

  if (!APPLY) {
    console.log('\nDry run — nothing written. Re-run with --apply.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
