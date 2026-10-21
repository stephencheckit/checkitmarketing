/**
 * Pull SDR activity history out of Apollo into .sdr-data/ for the SDR
 * baseline review: calls, sequence emails, sequences, positive-stage contacts,
 * account stages by owner, and tasks.
 *
 *   npx tsx --env-file=.env.local scripts/sdr-baseline-pull.ts
 */

import fs from 'fs';
import path from 'path';

const APOLLO_API = 'https://api.apollo.io/api/v1';
const OUT = path.join(process.cwd(), '.sdr-data');

async function ap(p: string, body?: unknown): Promise<Record<string, unknown>> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${APOLLO_API}${p}`, {
      method: body ? 'POST' : 'GET',
      headers: { 'x-api-key': process.env.APOLLO_API_KEY || '', 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 15000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`${p} ${res.status} ${(await res.text()).slice(0, 200)}`);
    return (await res.json()) as Record<string, unknown>;
  }
  throw new Error(`${p} rate limited`);
}

async function pageAll(p: string, key: string, body: Record<string, unknown>, max = 400) {
  const rows: Record<string, unknown>[] = [];
  for (let page = 1; page <= max; page++) {
    const d = await ap(p, { ...body, page, per_page: 100 });
    const batch = (d[key] as Record<string, unknown>[]) || [];
    rows.push(...batch);
    const pag = d.pagination as { total_pages?: number } | undefined;
    if (batch.length < 100 || (pag?.total_pages && page >= pag.total_pages)) break;
    if (page % 20 === 0) console.log(`  ${p} page ${page}, ${rows.length} rows`);
  }
  return rows;
}

function save(name: string, data: unknown) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data));
  console.log(`saved ${name} (${Array.isArray(data) ? data.length : 'obj'})`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const users = ((await ap('/users/search?per_page=100')).users as Record<string, unknown>[]).map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
  }));
  save('users.json', users);

  save('contact_stages.json', (await ap('/contact_stages')).contact_stages);
  save('account_stages.json', (await ap('/account_stages')).account_stages);

  const seqs = await pageAll('/emailer_campaigns/search', 'emailer_campaigns', {});
  save(
    'sequences.json',
    seqs.map((s) => {
      const keep: Record<string, unknown> = {};
      for (const k of Object.keys(s)) {
        if (/^(id|name|active|archived|created_at|last_used_at|user_id|num_steps|unique_.*|.*_rate)$/.test(k)) keep[k] = s[k];
      }
      return keep;
    })
  );

  const calls = await pageAll('/phone_calls/search', 'phone_calls', {}, 400);
  save(
    'calls.json',
    calls.map((c) => {
      const contact = (c.contact || {}) as Record<string, unknown>;
      return {
        id: c.id,
        user_id: c.user_id,
        account_id: c.account_id,
        contact_id: c.contact_id,
        outcome: c.phone_call_outcome_id,
        purpose: c.phone_call_purpose_id,
        start: c.start_time,
        end: c.end_time,
        logged: c.logged,
        inbound: c.inbound,
        status: c.status,
        dialer: Boolean(c.twilio_call_sid),
        to_country: c.to_country,
        to_number: typeof c.to_number === 'string' ? c.to_number.slice(0, 4) : null,
        note: typeof c.note_text === 'string' ? c.note_text.slice(0, 300) : null,
        org: contact.organization_name,
        title: contact.title,
        contact_stage: contact.contact_stage_id,
      };
    })
  );

  const msgs: Record<string, unknown>[] = [];
  for (const u of users) {
    const rows = await pageAll('/emailer_messages/search', 'emailer_messages', { user_ids: [u.id] }, 400);
    console.log(`  emails for ${u.email}: ${rows.length}`);
    msgs.push(...rows);
  }
  save(
    'emails.json',
    msgs.map((m) => ({
      id: m.id,
      user_id: m.user_id,
      status: m.status,
      type: m.type,
      created_at: m.created_at,
      completed_at: m.completed_at,
      due_at: m.due_at,
      campaign_id: m.emailer_campaign_id,
      campaign_name: m.campaign_name,
      contact_id: m.contact_id,
      account_id: m.account_id,
      replied: m.replied,
      reply_class: m.reply_class,
      bounce: m.bounce,
      demoed: m.demoed,
      not_sent_reason: m.not_sent_reason,
      to_domain: typeof m.to_email === 'string' ? m.to_email.split('@')[1] : null,
    }))
  );

  const stages = (await ap('/contact_stages')).contact_stages as Record<string, unknown>[];
  const positive = stages.filter((s) => ['Replied', 'Interested', 'Open Deal', 'Not Interested', 'Unqualified'].includes(String(s.name)));
  const posContacts: Record<string, unknown>[] = [];
  for (const s of positive) {
    const rows = await pageAll('/contacts/search', 'contacts', { contact_stage_ids: [s.id] }, 50);
    posContacts.push(...rows);
  }
  save(
    'stage_contacts.json',
    posContacts.map((c) => ({
      id: c.id,
      name: c.name,
      title: c.title,
      org: c.organization_name,
      stage: c.contact_stage_id,
      owner: c.owner_id,
      account_id: c.account_id,
      country: c.country,
      created_at: c.created_at,
      updated_at: c.updated_at,
      last_activity_date: c.last_activity_date,
      sf: c.salesforce_id || c.salesforce_contact_id || c.salesforce_lead_id,
      hubspot: c.hubspot_vid,
    }))
  );

  const accStages = (await ap('/account_stages')).account_stages as Record<string, unknown>[];
  const accountCounts: { owner: unknown; stage: unknown; count: unknown }[] = [];
  for (const u of users) {
    for (const s of accStages) {
      const d = await ap('/accounts/search', { owner_ids: [u.id], account_stage_ids: [s.id], page: 1, per_page: 1 });
      const total = (d.pagination as { total_entries?: number })?.total_entries || 0;
      if (total) accountCounts.push({ owner: u.email, stage: s.display_name || s.name, count: total });
    }
  }
  save('account_stage_counts.json', accountCounts);

  const activeOppStage = accStages.find((s) => /active opp/i.test(String(s.display_name || s.name)));
  if (activeOppStage) {
    const rows = await pageAll('/accounts/search', 'accounts', { account_stage_ids: [activeOppStage.id] }, 20);
    save(
      'active_opp_accounts.json',
      rows.map((a) => ({ id: a.id, name: a.name, domain: a.domain, owner: a.owner_id, country: a.country, hubspot: a.hubspot_id, sf: a.salesforce_id, updated_at: a.updated_at }))
    );
  }

  const tasks = await pageAll('/tasks/search', 'tasks', {}, 100);
  save(
    'tasks.json',
    tasks.map((t) => ({ id: t.id, user_id: t.user_id, type: t.type, status: t.status, created_at: t.created_at, completed_at: t.completed_at, due_at: t.due_at, campaign: t.emailer_campaign_id, account_id: t.account_id }))
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
