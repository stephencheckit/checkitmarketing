import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { syncTargetLists } from '@/lib/gtm-target-sync';

export const maxDuration = 300;

/** "Sync now" from the outreach page, for admins; the cron runs the same thing nightly. */
export async function POST() {
  const session = await getSession();
  if (!session.isLoggedIn) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.role !== 'admin') return NextResponse.json({ error: 'Admins only' }, { status: 403 });
  const result = await syncTargetLists();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
