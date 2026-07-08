// One-off generator: reads Ramp MCP transaction dumps and rewrites the
// `rampSnapshotMeta` + `rampTransactions` blocks in lib/ramp-snapshot.ts.
// Run: node scripts/gen-ramp-snapshot.mjs <page1.json> <page2.json> ...
import fs from 'node:fs';
import path from 'node:path';

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/gen-ramp-snapshot.mjs <file.json> ...');
  process.exit(1);
}

const seen = new Set();
const txns = [];
let totalCount = 0;

for (const f of files) {
  const raw = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (typeof raw.total_count === 'number') totalCount = Math.max(totalCount, raw.total_count);
  for (const t of raw.transactions || []) {
    if (seen.has(t.transaction_uuid)) continue;
    seen.add(t.transaction_uuid);
    const amount = Number(String(t.amount).replace(/[$,]/g, ''));
    txns.push({
      id: t.transaction_uuid,
      date: new Date(t.transaction_time).toISOString(),
      merchant: t.merchant_name || 'Unknown',
      category: t.merchant_category || 'Uncategorized',
      amount,
      spentBy: t.spent_by_user || '',
      memo: t.reason_or_justification || null,
      link: t.transaction_link || '',
    });
  }
}

txns.sort((a, b) => (a.date < b.date ? 1 : -1));

const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const rows = txns
  .map(
    (t) =>
      `  { id: '${t.id}', date: '${t.date}', merchant: '${esc(t.merchant)}', category: '${esc(
        t.category,
      )}', amount: ${t.amount}, spentBy: '${esc(t.spentBy)}', memo: ${
        t.memo === null ? 'null' : `'${esc(t.memo)}'`
      }, link: '${t.link}' },`,
  )
  .join('\n');

const dates = txns.map((t) => t.date.slice(0, 10)).sort();
const meta = {
  lastUpdated: new Date().toISOString(),
  windowStart: dates[0],
  windowEnd: dates[dates.length - 1],
  totalAvailable: totalCount || txns.length,
  scope: 'Stephen Newman (marketing spend)',
  partial: (totalCount || txns.length) > txns.length,
};

const file = path.join(process.cwd(), 'lib/ramp-snapshot.ts');
let src = fs.readFileSync(file, 'utf8');

const metaBlock = `export const rampSnapshotMeta: RampSnapshotMeta = {
  lastUpdated: '${meta.lastUpdated}',
  windowStart: '${meta.windowStart}',
  windowEnd: '${meta.windowEnd}',
  totalAvailable: ${meta.totalAvailable},
  scope: '${esc(meta.scope)}',
  partial: ${meta.partial},
};`;

src = src.replace(/export const rampSnapshotMeta: RampSnapshotMeta = \{[\s\S]*?\};/, metaBlock);
src = src.replace(
  /export const rampTransactions: RampTransaction\[\] = \[[\s\S]*?\];/,
  `export const rampTransactions: RampTransaction[] = [\n${rows}\n];`,
);

fs.writeFileSync(file, src);
console.log(`Wrote ${txns.length} transactions (total_count=${meta.totalAvailable}) to lib/ramp-snapshot.ts`);
