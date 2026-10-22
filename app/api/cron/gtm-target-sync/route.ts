import { NextRequest, NextResponse } from 'next/server';
import { syncTargetLists } from '@/lib/gtm-target-sync';

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const startTime = Date.now();
  const result = await syncTargetLists();
  return NextResponse.json({ ...result, duration: Date.now() - startTime }, { status: result.ok ? 200 : 500 });
}
