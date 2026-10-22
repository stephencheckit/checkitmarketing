/**
 * Run the nightly GTM target-list sync once, locally.
 *
 *   npx tsx --env-file=.env.vercel scripts/run-gtm-target-sync.ts
 */

import { syncTargetLists } from '../lib/gtm-target-sync';

async function main() {
  const started = Date.now();
  const result = await syncTargetLists();
  console.log(JSON.stringify(result, null, 2));
  console.log(`took ${Math.round((Date.now() - started) / 1000)}s`);
  process.exit(result.ok ? 0 : 1);
}

main();
