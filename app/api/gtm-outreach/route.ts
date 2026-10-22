import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getLastTargetSync, getSharedPlan, getTargetAccounts, initializeGtmPlanTables } from '@/lib/gtm-plan-db';
import { buildCoverage, resolveOutreach, type SegmentCount } from '@/lib/gtm-plan';
import { TARGET_LISTS } from '@/lib/gtm-targets';

/**
 * The outreach plan: the shared plan's outreach settings applied to last
 * night's target-list snapshot. Also read by the GTM map.
 */
export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await initializeGtmPlanTables();
  const [plan, accounts, lastSync] = await Promise.all([getSharedPlan(), getTargetAccounts(), getLastTargetSync()]);
  const outreach = resolveOutreach(plan.outreach);

  const lists = TARGET_LISTS.map((list) => {
    const rows = accounts.filter((a) => a.listId === list.id);
    const targets = rows.filter((r) => r.status === 'target');
    const bySegment = new Map<string, SegmentCount>();
    for (const r of [...targets].sort((a, b) => (b.employees ?? 0) - (a.employees ?? 0))) {
      const seg = bySegment.get(r.segment) ?? { segment: r.segment, accounts: 0, enterprise: 0, examples: [] };
      seg.accounts++;
      if ((r.employees ?? 0) >= 1000) seg.enterprise++;
      if (seg.examples.length < 4 && r.name) seg.examples.push(r.name);
      bySegment.set(r.segment, seg);
    }
    return {
      coverage: buildCoverage(list, outreach[list.id], [...bySegment.values()]),
      customers: rows.filter((r) => r.status === 'customer').length,
      excluded: rows.filter((r) => r.status === 'excluded').length,
      worked: targets.filter((r) => r.lastActivity).length,
      withContacts: targets.filter((r) => (r.contacts ?? 0) > 0).length,
    };
  });

  return NextResponse.json({
    lists,
    lastSync,
    planUpdatedBy: plan.updatedBy,
    planUpdatedAt: plan.updatedAt,
    canEdit: session.role === 'admin',
    hasData: accounts.length > 0,
  });
}
