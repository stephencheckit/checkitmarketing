import { NextResponse } from 'next/server';
import { getSession, logout } from '@/lib/session';

export async function POST() {
  try {
    const session = await getSession();
    await logout(session);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
