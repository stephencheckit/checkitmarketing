import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getOutreachPlan } from '@/lib/gtm-outreach-data';

/** The outreach plan. Also read by the GTM map. */
export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { plan, lists, lastSync, hasData } = await getOutreachPlan();

  return NextResponse.json({
    lists,
    lastSync,
    planUpdatedBy: plan.updatedBy,
    planUpdatedAt: plan.updatedAt,
    canEdit: session.role === 'admin',
    hasData,
  });
}
