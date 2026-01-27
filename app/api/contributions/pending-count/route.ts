import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';

// GET /api/contributions/pending-count - Get count of pending contributions (admin only)
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins should see pending review count
    if (session.role !== 'admin') {
      return NextResponse.json({ count: 0 });
    }

    const result = await sql`
      SELECT COUNT(*) as count
      FROM contributions
      WHERE status = 'pending'
    `;

    return NextResponse.json({ 
      count: Number(result[0]?.count || 0) 
    });
  } catch (error) {
    console.error('Error fetching pending count:', error);
    return NextResponse.json({ error: 'Failed to fetch count' }, { status: 500 });
  }
}
