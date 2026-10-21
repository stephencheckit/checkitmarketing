/**
 * Dump customer account names and domains from customer_accounts into
 * .sdr-data/customers.json, so target lists can be checked against customer
 * groups that buy under a different domain (e.g. Compass brands).
 *
 *   npx tsx --env-file=.env.vercel scripts/dump-customer-accounts.ts
 */

import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

async function main() {
  const sql = neon(process.env.DATABASE_URL || '');
  const rows = await sql`SELECT * FROM customer_accounts`;
  fs.writeFileSync(path.join(process.cwd(), '.sdr-data', 'customers.json'), JSON.stringify(rows));
  console.log(rows.length, Object.keys(rows[0] || {}));
}

main();
