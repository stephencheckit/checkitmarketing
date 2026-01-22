import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getUserById, getUserProgress, hasUserPassed } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await getUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const progress = await getUserProgress(session.userId);
    const certified = await hasUserPassed(session.userId);

    return NextResponse.json({
      user,
      progress,
      certified,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
