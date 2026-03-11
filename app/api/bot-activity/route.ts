import { NextRequest, NextResponse } from 'next/server';
import { getBotActivitySummary, initializeBotVisitsTables } from '@/lib/db';

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

    const summary = await getBotActivitySummary(daysBack);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error fetching bot activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bot activity' },
      { status: 500 }
    );
  }
}
