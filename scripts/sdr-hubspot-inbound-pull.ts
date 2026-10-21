/**
 * Pull HubSpot contacts created since 2025-01 (source, conversion events,
 * lifecycle, geography) into .sdr-data/ to read inbound demand by product and
 * market. Searches month by month to stay under HubSpot's 10k search cap.
 *
 *   npx tsx --env-file=.env.vercel scripts/sdr-hubspot-inbound-pull.ts
 */

import fs from 'fs';
import path from 'path';

const HS = 'https://api.hubapi.com';
const OUT = path.join(process.cwd(), '.sdr-data');
const START = '2025-01-01';

const PROPS = [
  'createdate',
  'email',
  'company',
  'jobtitle',
  'country',
  'industry',
  'lifecyclestage',
  'hs_lead_status',
  'hs_analytics_source',
  'hs_analytics_source_data_1',
  'hs_analytics_source_data_2',
  'first_conversion_event_name',
  'recent_conversion_event_name',
  'num_conversion_events',
  'hubspot_owner_id',
];

async function hs(p: string, body: unknown): Promise<Record<string, unknown>> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${HS}${p}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`${p} ${res.status} ${(await res.text()).slice(0, 300)}`);
    return (await res.json()) as Record<string, unknown>;
  }
  throw new Error(`${p} rate limited`);
}

function monthWindows(start: string, end: Date) {
  const windows: [string, string][] = [];
  const d = new Date(`${start}T00:00:00Z`);
  while (d < end) {
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1));
    windows.push([d.toISOString(), next.toISOString()]);
    d.setTime(next.getTime());
  }
  return windows;
}

async function main() {
  const rows: Record<string, unknown>[] = [];
  for (const [from, to] of monthWindows(START, new Date())) {
    let after: string | undefined;
    let n = 0;
    do {
      const d = await hs('/crm/v3/objects/contacts/search', {
        limit: 100,
        after,
        properties: PROPS,
        sorts: [{ propertyName: 'createdate', direction: 'ASCENDING' }],
        filterGroups: [{ filters: [
          { propertyName: 'createdate', operator: 'GTE', value: from },
          { propertyName: 'createdate', operator: 'LT', value: to },
        ] }],
      });
      for (const c of (d.results as Record<string, unknown>[]) || []) {
        const p = c.properties as Record<string, unknown>;
        rows.push({ id: c.id, ...p, email: undefined, domain: typeof p.email === 'string' ? p.email.split('@')[1] : null });
        n++;
      }
      after = (d.paging as { next?: { after?: string } } | undefined)?.next?.after;
    } while (after && n < 9900);
    console.log(from.slice(0, 7), n);
  }
  fs.writeFileSync(path.join(OUT, 'hs_contacts_2025.json'), JSON.stringify(rows));
  console.log('total', rows.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
