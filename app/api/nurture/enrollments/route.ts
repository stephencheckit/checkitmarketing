import { NextRequest, NextResponse } from 'next/server';
import {
  initializeNurtureTables,
  getEnrollments,
  getNurtureStats,
} from '@/lib/nurture-db';
import { seedDefaultTrack } from '@/lib/nurture-seed';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeNurtureTables();
    await seedDefaultTrack();
    initialized = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeStats = searchParams.get('stats') === 'true';

    const { enrollments, total } = await getEnrollments({ status, search, limit, offset });

    let stats = null;
    if (includeStats) {
      stats = await getNurtureStats();
    }

    return NextResponse.json({ enrollments, total, stats });
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}
