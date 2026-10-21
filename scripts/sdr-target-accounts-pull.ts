/**
 * Pull the US Healthcare and Facilities Management target account lists from
 * Apollo (the lists mapped to those markets in lib/gtm-markets.ts) into
 * .sdr-data/ for the target-account export.
 *
 *   npx tsx --env-file=.env.local scripts/sdr-target-accounts-pull.ts
 */

import fs from 'fs';
import path from 'path';
import { GTM_MARKETS } from '../lib/gtm-markets';

const APOLLO_API = 'https://api.apollo.io/api/v1';
const OUT = path.join(process.cwd(), '.sdr-data');
const MARKETS = ['us-medical', 'us-facilities', 'uk-foodservice'];

async function ap(p: string, body: unknown): Promise<Record<string, unknown>> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await fetch(`${APOLLO_API}${p}`, {
      method: 'POST',
      headers: { 'x-api-key': process.env.APOLLO_API_KEY || '', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
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

async function main() {
  const rows: Record<string, unknown>[] = [];
  for (const market of GTM_MARKETS.filter((m) => MARKETS.includes(m.id))) {
    for (const list of market.apolloLists) {
      for (let page = 1; page <= 30; page++) {
        const d = await ap('/accounts/search', { account_label_ids: [list.id], page, per_page: 100 });
        const accounts = (d.accounts as Record<string, unknown>[]) || [];
        for (const a of accounts) {
          const org = (a.organization || {}) as Record<string, unknown>;
          rows.push({
            market: market.id,
            list: list.name,
            id: a.id,
            name: a.name,
            domain: a.domain || a.primary_domain,
            industry: a.industry || org.industry,
            employees: a.estimated_num_employees || org.estimated_num_employees,
            revenue: a.organization_revenue_printed || org.organization_revenue_printed,
            city: a.city || org.city,
            state: a.state || org.state,
            country: a.country || org.country,
            linkedin: a.linkedin_url,
            owner: a.owner_id,
            stage: a.account_stage_id,
            contacts: a.num_contacts,
            last_activity: a.last_activity_date,
            tally: a.contact_campaign_status_tally,
            keys: page === 1 && rows.length === 0 ? Object.keys(a) : undefined,
          });
        }
        const pag = d.pagination as { total_pages?: number } | undefined;
        if (accounts.length < 100 || !pag?.total_pages || page >= pag.total_pages) break;
      }
      console.log(`${market.id} · ${list.name}: ${rows.filter((r) => r.list === list.name).length}`);
    }
  }
  const domains = Array.from(new Set(rows.map((r) => r.domain).filter(Boolean) as string[]));
  const orgs: Record<string, Record<string, unknown>> = {};
  for (let i = 0; i < domains.length; i += 25) {
    const batch = domains.slice(i, i + 25);
    const d = await ap('/mixed_companies/search', { q_organization_domains_list: batch, page: 1, per_page: 100 });
    const found = [...((d.organizations as Record<string, unknown>[]) || []), ...((d.accounts as Record<string, unknown>[]) || [])];
    for (const o of found) {
      const dom = String(o.primary_domain || o.domain || '');
      if (dom && !orgs[dom]) orgs[dom] = o;
    }
  }
  const missing = domains.filter((dm) => !orgs[dm] || !orgs[dm].estimated_num_employees);
  for (let i = 0; i < missing.length; i += 10) {
    const d = await ap('/organizations/search', { q_organization_domains_list: missing.slice(i, i + 10), page: 1, per_page: 100 });
    for (const o of (d.organizations as Record<string, unknown>[]) || []) {
      const dom = String(o.primary_domain || '');
      if (dom) orgs[dom] = { ...(orgs[dom] || {}), ...o };
    }
  }
  for (const r of rows) {
    const o = orgs[String(r.domain)] || {};
    r.industry = o.industry || null;
    r.employees = o.estimated_num_employees || null;
    r.revenue = o.organization_revenue_printed || null;
    delete r.keys;
  }
  fs.writeFileSync(path.join(OUT, 'target_accounts.json'), JSON.stringify(rows));
  console.log('total', rows.length, 'enriched', rows.filter((r) => r.employees).length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
