import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { startModule, completeModule, getUserProgress } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const progress = await getUserProgress(session.userId);
    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: 'Failed to get progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { moduleSlug, action } = await request.json();

    if (!moduleSlug) {
      return NextResponse.json(
        { error: 'Module slug is required' },
        { status: 400 }
      );
    }

    if (action === 'start') {
      await startModule(session.userId, moduleSlug);
    } else if (action === 'complete') {
      await completeModule(session.userId, moduleSlug);
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const progress = await getUserProgress(session.userId);
    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  }
}
