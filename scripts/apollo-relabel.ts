/**
 * Move specific Apollo accounts between account lists, keeping their other
 * lists intact.
 *
 *   npx tsx --env-file=.env.vercel scripts/apollo-relabel.ts \
 *     --remove "US Healthcare targets · 2026-10" [--add "Expansion · Customer groups · 2026-10"] <accountId> ...
 */

const APOLLO = 'https://api.apollo.io/api/v1';
const HEADERS = { 'x-api-key': process.env.APOLLO_API_KEY || '', 'Content-Type': 'application/json' };

function arg(flag: string) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}

async function main() {
  const removeName = arg('--remove');
  const addName = arg('--add');
  const ids = process.argv.slice(2).filter((a, i, all) => !a.startsWith('--') && !['--remove', '--add'].includes(all[i - 1] || ''));

  const labels = (await (await fetch(`${APOLLO}/labels`, { headers: HEADERS })).json()) as { id: string; name: string; modality: string }[];
  const find = (n: string | null) => (n ? labels.find((l) => l.name === n && l.modality === 'accounts')?.id : undefined);
  const removeId = find(removeName);
  const addId = find(addName);
  if (removeName && !removeId) throw new Error(`list not found: ${removeName}`);
  if (addName && !addId) throw new Error(`list not found: ${addName}`);

  for (const id of ids) {
    const got = await fetch(`${APOLLO}/accounts/${id}`, { headers: HEADERS });
    const account = ((await got.json()) as { account?: { name?: string; label_ids?: string[] } }).account;
    if (!account) {
      console.log(`${id}: not found`);
      continue;
    }
    let next = (account.label_ids || []).filter((l) => l !== removeId);
    if (addId && !next.includes(addId)) next = [...next, addId];
    const res = await fetch(`${APOLLO}/accounts/${id}`, { method: 'PUT', headers: HEADERS, body: JSON.stringify({ label_ids: next }) });
    console.log(`${account.name}: ${res.ok ? 'updated' : `failed ${res.status}`}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
