/**
 * Pull HubSpot meetings and their associated contacts into .sdr-data/ so
 * meetings can be matched back to Apollo SDR outreach. The production token
 * reads meetings and contacts only (no deals, companies, owners or emails).
 *
 *   npx tsx --env-file=.env.vercel scripts/sdr-hubspot-pull.ts
 */

import fs from 'fs';
import path from 'path';

const HS = 'https://api.hubapi.com';
const OUT = path.join(process.cwd(), '.sdr-data');

async function hs(p: string, body?: unknown): Promise<Record<string, unknown>> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`${HS}${p}`, {
      method: body ? 'POST' : 'GET',
      headers: { Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`${p} ${res.status} ${(await res.text()).slice(0, 300)}`);
    return (await res.json()) as Record<string, unknown>;
  }
  throw new Error(`${p} rate limited`);
}

const MEETING_PROPS = [
  'hs_meeting_title',
  'hs_meeting_start_time',
  'hs_meeting_end_time',
  'hubspot_owner_id',
  'hs_meeting_outcome',
  'hs_activity_type',
  'hs_meeting_source',
  'hs_createdate',
  'hs_meeting_location',
  'hs_internal_meeting_notes',
];

const CONTACT_PROPS = [
  'email',
  'company',
  'jobtitle',
  'country',
  'lifecyclestage',
  'hs_analytics_source',
  'hs_analytics_source_data_1',
  'hs_latest_source',
  'createdate',
  'hubspot_owner_id',
  'hs_lead_status',
];

async function main() {
  const meetings: Record<string, unknown>[] = [];
  let after: string | undefined;
  do {
    const qs = new URLSearchParams({ limit: '100', properties: MEETING_PROPS.join(','), associations: 'contacts' });
    if (after) qs.set('after', after);
    const d = await hs(`/crm/v3/objects/meetings?${qs}`);
    for (const m of (d.results as Record<string, unknown>[]) || []) {
      const props = m.properties as Record<string, unknown>;
      const assoc = (m.associations as { contacts?: { results?: { id: string }[] } } | undefined)?.contacts?.results || [];
      if (typeof props.hs_internal_meeting_notes === 'string') props.hs_internal_meeting_notes = props.hs_internal_meeting_notes.slice(0, 300);
      meetings.push({ id: m.id, ...props, contact_ids: Array.from(new Set(assoc.map((a) => a.id))) });
    }
    after = (d.paging as { next?: { after?: string } } | undefined)?.next?.after;
  } while (after);
  fs.writeFileSync(path.join(OUT, 'hs_meetings.json'), JSON.stringify(meetings));
  console.log('meetings', meetings.length);

  const ids = Array.from(new Set(meetings.flatMap((m) => m.contact_ids as string[])));
  const contacts: Record<string, unknown>[] = [];
  for (let i = 0; i < ids.length; i += 100) {
    const d = await hs('/crm/v3/objects/contacts/batch/read', {
      properties: CONTACT_PROPS,
      inputs: ids.slice(i, i + 100).map((id) => ({ id })),
    });
    for (const c of (d.results as Record<string, unknown>[]) || []) contacts.push({ id: c.id, ...(c.properties as object) });
  }
  fs.writeFileSync(path.join(OUT, 'hs_meeting_contacts.json'), JSON.stringify(contacts));
  console.log('meeting contacts', contacts.length);

  const stages = ['subscriber', 'lead', 'marketingqualifiedlead', 'salesqualifiedlead', 'opportunity', 'customer'];
  const counts: Record<string, number> = {};
  for (const s of stages) {
    const d = await hs('/crm/v3/objects/contacts/search', {
      limit: 1,
      filterGroups: [{ filters: [{ propertyName: 'lifecyclestage', operator: 'EQ', value: s }] }],
    });
    counts[s] = Number(d.total) || 0;
  }
  fs.writeFileSync(path.join(OUT, 'hs_lifecycle_counts.json'), JSON.stringify(counts));
  console.log('lifecycle', counts);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
