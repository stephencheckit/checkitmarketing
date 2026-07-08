import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { inngest } from '@/lib/inngest';
import { initializeLeadTriageTable, getLeadEmailsToScore } from '@/lib/db';

// POST /api/leads/score - enqueue (re)scoring of leads.
// Body: { all?: boolean, limit?: number }. Default scores only unscored leads.
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await initializeLeadTriageTable();

    const body = await request.json().catch(() => ({}));
    const all = !!body.all;
    const limit = Math.min(parseInt(String(body.limit ?? 1000), 10) || 1000, 2000);

    const emails = await getLeadEmailsToScore(limit, all);
    if (emails.length > 0) {
      await inngest.send(
        emails.map((email) => ({
          name: 'lead/score.requested',
          data: { email },
        }))
      );
    }

    return NextResponse.json({ enqueued: emails.length });
  } catch (error) {
    console.error('Error enqueueing lead scoring:', error);
    return NextResponse.json({ error: 'Failed to enqueue scoring' }, { status: 500 });
  }
}
