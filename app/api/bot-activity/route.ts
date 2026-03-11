import { NextRequest, NextResponse } from 'next/server';
import { getBotActivitySummary, initializeBotVisitsTables } from '@/lib/db';
import { getPageViewSummary } from '@/lib/ga4';

let tablesInitialized = false;

async function ensureTables() {
  if (!tablesInitialized) {
    await initializeBotVisitsTables();
    tablesInitialized = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureTables();

    const { searchParams } = new URL(request.url);
    const daysBack = parseInt(searchParams.get('days') || '30');

    const [botSummary, ga4Summary] = await Promise.allSettled([
      getBotActivitySummary(daysBack),
      getPageViewSummary(daysBack),
    ]);

    return NextResponse.json({
      bots: botSummary.status === 'fulfilled' ? botSummary.value : { total: 0, byBot: [], byDay: [], byPage: [], recent: [], byHour: [], firstVisit: null },
      pageviews: ga4Summary.status === 'fulfilled' ? ga4Summary.value : null,
      ga4Error: ga4Summary.status === 'rejected' ? ga4Summary.reason?.message || 'GA4 not configured' : null,
    });
  } catch (error) {
    console.error('Error fetching bot activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bot activity' },
      { status: 500 }
    );
  }
}
