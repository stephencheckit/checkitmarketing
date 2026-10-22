// Nightly sync of the GTM target lists from Apollo into gtm_target_accounts.
// Read-only against Apollo: it never changes lists or accounts.

import { sql } from './db';
import { getAccountStages, getTargetListAccounts, getUsers, lookupOrgSizes } from './apollo';
import { buildCustomerIndex, classify, TARGET_LISTS } from './gtm-targets';
import {
  cacheOrgs,
  finishTargetSync,
  getCachedOrgs,
  initializeGtmPlanTables,
  replaceTargetAccounts,
  startTargetSync,
  type TargetAccountRow,
} from './gtm-plan-db';

export async function syncTargetLists() {
  await initializeGtmPlanTables();
  const syncId = await startTargetSync();
  const summary: Record<string, unknown> = {};
  try {
    const [stages, users, customerRows] = await Promise.all([
      getAccountStages(),
      getUsers(),
      sql`SELECT company_name, domain, match_domain FROM customer_accounts WHERE COALESCE(status, 'active') <> 'churned'`.then(
        (rows) => rows as { company_name: string | null; domain: string | null; match_domain: string | null }[]
      ),
    ]);
    const stageName = new Map(stages.map((s) => [s.id, s.name]));
    const userName = new Map(users.map((u) => [u.id, u.name || u.email || u.id]));
    const customers = buildCustomerIndex(customerRows);

    const accountsByList = new Map<string, Awaited<ReturnType<typeof getTargetListAccounts>>>();
    for (const list of TARGET_LISTS) accountsByList.set(list.id, await getTargetListAccounts(list.id));

    const domains = Array.from(new Set([...accountsByList.values()].flat().map((a) => a.domain).filter(Boolean) as string[]));
    const cached = await getCachedOrgs(domains);
    const uncached = domains.filter((d) => !cached.has(d));
    const fetched = await lookupOrgSizes(uncached);
    await cacheOrgs(uncached.map((d) => ({ domain: d, employees: fetched.get(d)?.employees ?? null, industry: fetched.get(d)?.industry ?? null })));
    const orgs = new Map([...cached, ...fetched]);
    summary.orgLookups = uncached.length;

    for (const list of TARGET_LISTS) {
      const rows: TargetAccountRow[] = (accountsByList.get(list.id) || []).map((a) => {
        const org = a.domain ? orgs.get(a.domain) : undefined;
        const stage = a.accountStageId ? stageName.get(a.accountStageId) ?? null : null;
        const c = classify(
          list,
          { name: a.name, domain: a.domain, industry: org?.industry ?? null, employees: org?.employees ?? null, country: a.country, stageName: stage, labelIds: a.labelIds },
          customers
        );
        return {
          listId: list.id,
          accountId: a.id,
          name: a.name,
          domain: a.domain,
          industry: org?.industry ?? null,
          employees: org?.employees ?? null,
          country: a.country,
          state: a.state,
          city: a.city,
          stageName: stage,
          ownerName: a.ownerId ? userName.get(a.ownerId) ?? null : null,
          contacts: a.numContacts,
          lastActivity: a.lastActivityDate,
          segment: c.segment,
          status: c.status,
          reason: c.reason,
        };
      });
      await replaceTargetAccounts(list.id, rows);
      summary[list.name] = {
        accounts: rows.length,
        targets: rows.filter((r) => r.status === 'target').length,
        customers: rows.filter((r) => r.status === 'customer').length,
        excluded: rows.filter((r) => r.status === 'excluded').length,
      };
    }
    await finishTargetSync(syncId, true, summary);
    return { ok: true, summary };
  } catch (e) {
    summary.error = e instanceof Error ? e.message : String(e);
    await finishTargetSync(syncId, false, summary);
    return { ok: false, summary };
  }
}
