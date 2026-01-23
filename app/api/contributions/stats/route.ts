import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { sql } from '@/lib/db';

// GET /api/contributions/stats - Get contribution statistics for leaderboard
export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get top contributors (approved + auto_published count)
    const topContributors = await sql`
      SELECT 
        u.id,
        u.name,
        u.department,
        COUNT(CASE WHEN c.status IN ('approved', 'auto_published') THEN 1 END) as accepted_count,
        COUNT(c.id) as total_count
      FROM users u
      LEFT JOIN contributions c ON u.id = c.user_id
      GROUP BY u.id, u.name, u.department
      HAVING COUNT(CASE WHEN c.status IN ('approved', 'auto_published') THEN 1 END) > 0
      ORDER BY accepted_count DESC, total_count DESC
      LIMIT 10
    `;

    // Get current user's stats and rank
    const userStats = await sql`
      SELECT 
        COUNT(CASE WHEN status IN ('approved', 'auto_published') THEN 1 END) as accepted_count,
        COUNT(*) as total_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count
      FROM contributions
      WHERE user_id = ${session.userId}
    `;

    // Calculate user's rank
    const userRankResult = await sql`
      WITH ranked_users AS (
        SELECT 
          u.id,
          COUNT(CASE WHEN c.status IN ('approved', 'auto_published') THEN 1 END) as accepted_count,
          RANK() OVER (ORDER BY COUNT(CASE WHEN c.status IN ('approved', 'auto_published') THEN 1 END) DESC) as rank
        FROM users u
        LEFT JOIN contributions c ON u.id = c.user_id
        GROUP BY u.id
        HAVING COUNT(CASE WHEN c.status IN ('approved', 'auto_published') THEN 1 END) > 0
      )
      SELECT rank FROM ranked_users WHERE id = ${session.userId}
    `;

    // Get this month's stats
    const thisMonthStats = await sql`
      SELECT 
        u.id,
        u.name,
        u.department,
        COUNT(CASE WHEN c.status IN ('approved', 'auto_published') THEN 1 END) as accepted_count
      FROM users u
      LEFT JOIN contributions c ON u.id = c.user_id 
        AND c.created_at >= date_trunc('month', CURRENT_DATE)
      GROUP BY u.id, u.name, u.department
      HAVING COUNT(CASE WHEN c.status IN ('approved', 'auto_published') THEN 1 END) > 0
      ORDER BY accepted_count DESC
      LIMIT 5
    `;

    return NextResponse.json({
      topContributors: topContributors.map(c => ({
        id: c.id,
        name: c.name,
        department: c.department,
        acceptedCount: Number(c.accepted_count),
        totalCount: Number(c.total_count)
      })),
      thisMonth: thisMonthStats.map(c => ({
        id: c.id,
        name: c.name,
        department: c.department,
        acceptedCount: Number(c.accepted_count)
      })),
      userStats: {
        acceptedCount: Number(userStats[0]?.accepted_count || 0),
        totalCount: Number(userStats[0]?.total_count || 0),
        pendingCount: Number(userStats[0]?.pending_count || 0),
        rank: userRankResult[0]?.rank ? Number(userRankResult[0].rank) : null
      }
    });
  } catch (error) {
    console.error('Error fetching contribution stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
