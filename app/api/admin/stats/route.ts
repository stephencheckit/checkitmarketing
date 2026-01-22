import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getAllUsers, getAllProgress, getCertificationStats } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Optional: Add admin role check
    // if (session.role !== 'admin') {
    //   return NextResponse.json(
    //     { error: 'Not authorized' },
    //     { status: 403 }
    //   );
    // }

    const users = await getAllUsers();
    const progress = await getAllProgress();
    const certStats = await getCertificationStats();

    return NextResponse.json({
      users,
      progress,
      certStats,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
