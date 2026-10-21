/**
 * Print the id and account count of Apollo account lists whose name matches.
 *
 *   npx tsx --env-file=.env.vercel scripts/check-apollo-list.ts "FM, Food Service & Venues"
 */

const APOLLO = 'https://api.apollo.io/api/v1';
const HEADERS = { 'x-api-key': process.env.APOLLO_API_KEY || '', 'Content-Type': 'application/json' };

async function main() {
  const q = (process.argv[2] || '').toLowerCase();
  const labels = (await (await fetch(`${APOLLO}/labels`, { headers: HEADERS })).json()) as { id: string; name: string; modality: string }[];
  for (const l of labels.filter((x) => x.modality === 'accounts' && x.name.toLowerCase().includes(q))) {
    const r = await fetch(`${APOLLO}/accounts/search`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify({ account_label_ids: [l.id], page: 1, per_page: 1 }),
    });
    const d = (await r.json()) as { pagination?: { total_entries?: number } };
    console.log(`${l.name}\t${l.id}\t${d.pagination?.total_entries ?? '?'}`);
  }
}

main();
