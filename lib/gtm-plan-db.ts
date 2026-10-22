// Storage for the shared GTM plan and the nightly target-list snapshot.

import { sql } from './db';
import type { OutreachSettings, SharedPlan } from './gtm-plan';
import type { TargetStatus } from './gtm-targets';

export async function initializeGtmPlanTables() {
  // One row: the plan everyone sees. Last save wins; updated_by shows whose.
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_plan (
      id TEXT PRIMARY KEY,
      planner JSONB,
      outreach JSONB,
      updated_by TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // Accounts on each target list as of the last nightly sync.
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_target_accounts (
      list_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      name TEXT,
      domain TEXT,
      industry TEXT,
      employees INTEGER,
      country TEXT,
      state TEXT,
      city TEXT,
      stage_name TEXT,
      owner_name TEXT,
      contacts INTEGER,
      last_activity TIMESTAMPTZ,
      segment TEXT,
      status TEXT,
      reason TEXT,
      synced_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (list_id, account_id)
    )
  `;

  // Apollo's account records carry no headcount or industry, so they come
  // from organisation search. Cached by domain so each is looked up once.
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_org_cache (
      domain TEXT PRIMARY KEY,
      employees INTEGER,
      industry TEXT,
      fetched_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS gtm_target_sync_log (
      id SERIAL PRIMARY KEY,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      finished_at TIMESTAMPTZ,
      ok BOOLEAN,
      summary JSONB
    )
  `;
}

// ---------------------------------------------------------------------------
// Shared plan

export async function getSharedPlan(): Promise<SharedPlan> {
  const rows = (await sql`SELECT planner, outreach, updated_by, updated_at FROM gtm_plan WHERE id = 'default'`) as {
    planner: Record<string, unknown> | null;
    outreach: Record<string, OutreachSettings> | null;
    updated_by: string | null;
    updated_at: string | null;
  }[];
  const row = rows[0];
  return {
    planner: row?.planner ?? null,
    outreach: row?.outreach ?? {},
    updatedBy: row?.updated_by ?? null,
    updatedAt: row?.updated_at ?? null,
  };
}

export async function saveSharedPlan(
  patch: { planner?: Record<string, unknown>; outreach?: Record<string, OutreachSettings> },
  updatedBy: string
) {
  const current = await getSharedPlan();
  const planner = patch.planner ?? current.planner;
  const outreach = patch.outreach ?? current.outreach;
  await sql`
    INSERT INTO gtm_plan (id, planner, outreach, updated_by, updated_at)
    VALUES ('default', ${JSON.stringify(planner)}::jsonb, ${JSON.stringify(outreach)}::jsonb, ${updatedBy}, NOW())
    ON CONFLICT (id) DO UPDATE SET
      planner = EXCLUDED.planner,
      outreach = EXCLUDED.outreach,
      updated_by = EXCLUDED.updated_by,
      updated_at = NOW()
  `;
}

// ---------------------------------------------------------------------------
// Target-list snapshot

export interface TargetAccountRow {
  listId: string;
  accountId: string;
  name: string | null;
  domain: string | null;
  industry: string | null;
  employees: number | null;
  country: string | null;
  state: string | null;
  city: string | null;
  stageName: string | null;
  ownerName: string | null;
  contacts: number | null;
  lastActivity: string | null;
  segment: string;
  status: TargetStatus;
  reason: string | null;
}

/** Replace a list's snapshot: rows not in this sync are removed. */
export async function replaceTargetAccounts(listId: string, rows: TargetAccountRow[]) {
  // Batched through jsonb_to_recordset: one round trip per chunk, not per row.
  for (let i = 0; i < rows.length; i += 250) {
    const chunk = rows.slice(i, i + 250).map((r) => ({
      list_id: r.listId,
      account_id: r.accountId,
      name: r.name,
      domain: r.domain,
      industry: r.industry,
      employees: r.employees,
      country: r.country,
      state: r.state,
      city: r.city,
      stage_name: r.stageName,
      owner_name: r.ownerName,
      contacts: r.contacts,
      last_activity: r.lastActivity,
      segment: r.segment,
      status: r.status,
      reason: r.reason,
    }));
    await sql`
      INSERT INTO gtm_target_accounts
        (list_id, account_id, name, domain, industry, employees, country, state, city,
         stage_name, owner_name, contacts, last_activity, segment, status, reason, synced_at)
      SELECT list_id, account_id, name, domain, industry, employees, country, state, city,
             stage_name, owner_name, contacts, last_activity, segment, status, reason, NOW()
      FROM jsonb_to_recordset(${JSON.stringify(chunk)}::jsonb) AS x(
        list_id TEXT, account_id TEXT, name TEXT, domain TEXT, industry TEXT, employees INTEGER,
        country TEXT, state TEXT, city TEXT, stage_name TEXT, owner_name TEXT, contacts INTEGER,
        last_activity TIMESTAMPTZ, segment TEXT, status TEXT, reason TEXT
      )
      ON CONFLICT (list_id, account_id) DO UPDATE SET
        name = EXCLUDED.name, domain = EXCLUDED.domain, industry = EXCLUDED.industry,
        employees = EXCLUDED.employees, country = EXCLUDED.country, state = EXCLUDED.state,
        city = EXCLUDED.city, stage_name = EXCLUDED.stage_name, owner_name = EXCLUDED.owner_name,
        contacts = EXCLUDED.contacts, last_activity = EXCLUDED.last_activity,
        segment = EXCLUDED.segment, status = EXCLUDED.status, reason = EXCLUDED.reason,
        synced_at = NOW()
    `;
  }
  const keep = rows.map((r) => r.accountId);
  await sql`DELETE FROM gtm_target_accounts WHERE list_id = ${listId} AND NOT (account_id = ANY(${keep}))`;
}

export async function getTargetAccounts(): Promise<(TargetAccountRow & { syncedAt: string })[]> {
  const rows = (await sql`
    SELECT list_id, account_id, name, domain, industry, employees, country, state, city,
           stage_name, owner_name, contacts, last_activity, segment, status, reason, synced_at
    FROM gtm_target_accounts
  `) as Record<string, unknown>[];
  return rows.map((r) => ({
    listId: String(r.list_id),
    accountId: String(r.account_id),
    name: (r.name as string) ?? null,
    domain: (r.domain as string) ?? null,
    industry: (r.industry as string) ?? null,
    employees: (r.employees as number) ?? null,
    country: (r.country as string) ?? null,
    state: (r.state as string) ?? null,
    city: (r.city as string) ?? null,
    stageName: (r.stage_name as string) ?? null,
    ownerName: (r.owner_name as string) ?? null,
    contacts: (r.contacts as number) ?? null,
    lastActivity: r.last_activity ? String(r.last_activity) : null,
    segment: String(r.segment),
    status: r.status as TargetStatus,
    reason: (r.reason as string) ?? null,
    syncedAt: String(r.synced_at),
  }));
}

export async function getCachedOrgs(domains: string[]) {
  if (domains.length === 0) return new Map<string, { employees: number | null; industry: string | null }>();
  const rows = (await sql`SELECT domain, employees, industry FROM gtm_org_cache WHERE domain = ANY(${domains})`) as {
    domain: string;
    employees: number | null;
    industry: string | null;
  }[];
  return new Map(rows.map((r) => [r.domain, { employees: r.employees, industry: r.industry }]));
}

export async function cacheOrgs(orgs: { domain: string; employees: number | null; industry: string | null }[]) {
  for (let i = 0; i < orgs.length; i += 500) {
    await sql`
      INSERT INTO gtm_org_cache (domain, employees, industry, fetched_at)
      SELECT domain, employees, industry, NOW()
      FROM jsonb_to_recordset(${JSON.stringify(orgs.slice(i, i + 500))}::jsonb) AS x(domain TEXT, employees INTEGER, industry TEXT)
      ON CONFLICT (domain) DO UPDATE SET employees = EXCLUDED.employees, industry = EXCLUDED.industry, fetched_at = NOW()
    `;
  }
}

export async function startTargetSync() {
  const rows = (await sql`INSERT INTO gtm_target_sync_log DEFAULT VALUES RETURNING id`) as { id: number }[];
  return rows[0].id;
}

export async function finishTargetSync(id: number, ok: boolean, summary: unknown) {
  await sql`UPDATE gtm_target_sync_log SET finished_at = NOW(), ok = ${ok}, summary = ${JSON.stringify(summary)}::jsonb WHERE id = ${id}`;
}

export async function getLastTargetSync() {
  const rows = (await sql`
    SELECT started_at, finished_at, ok, summary FROM gtm_target_sync_log
    WHERE finished_at IS NOT NULL ORDER BY id DESC LIMIT 1
  `) as { started_at: string; finished_at: string; ok: boolean; summary: unknown }[];
  return rows[0] ?? null;
}
