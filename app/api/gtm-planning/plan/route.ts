import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { GTM_DECK_COOKIE, hasDeckAccess } from '@/lib/deck-auth';
import { getSharedPlan, initializeGtmPlanTables, saveSharedPlan } from '@/lib/gtm-plan-db';
import { resolveOutreach, type OutreachSettings } from '@/lib/gtm-plan';

/** The shared GTM plan: everyone logged in reads it, admins save it. */
export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn && !(await hasDeckAccess(GTM_DECK_COOKIE))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await initializeGtmPlanTables();
  const plan = await getSharedPlan();
  return NextResponse.json({
    planner: plan.planner,
    outreach: resolveOutreach(plan.outreach),
    updatedBy: plan.updatedBy,
    updatedAt: plan.updatedAt,
    canEdit: session.role === 'admin',
  });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Only admins can change the shared plan' }, { status: 403 });

  const body = (await request.json()) as { planner?: Record<string, unknown>; outreach?: Record<string, OutreachSettings> };
  if (body.outreach) {
    for (const [id, s] of Object.entries(body.outreach)) {
      if (!Number.isFinite(s.perWeek) || s.perWeek < 1 || s.perWeek > 200) {
        return NextResponse.json({ error: `Pace for ${id} must be between 1 and 200 a week` }, { status: 400 });
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(s.startDate)) {
        return NextResponse.json({ error: `Start date for ${id} must be YYYY-MM-DD` }, { status: 400 });
      }
    }
  }
  await initializeGtmPlanTables();
  await saveSharedPlan({ planner: body.planner, outreach: body.outreach }, session.name || session.email || 'admin');
  const plan = await getSharedPlan();
  return NextResponse.json({
    planner: plan.planner,
    outreach: resolveOutreach(plan.outreach),
    updatedBy: plan.updatedBy,
    updatedAt: plan.updatedAt,
    canEdit: true,
  });
}
