import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  initializeSearchConsoleTables,
  upsertSearchConsoleQuery,
  upsertSearchConsolePage,
  upsertSearchConsoleTotals,
  getSearchConsoleQueries,
  getSearchConsolePages,
  getSearchConsoleSummary,
  createSearchConsoleSyncLog,
  updateSearchConsoleSyncLog,
} from '@/lib/db';
import {
  testConnection,
  getSites,
  syncAllData,
  getDateRange,
} from '@/lib/search-console';

// GET - Return cached Search Console data
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    await initializeSearchConsoleTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const siteUrl = searchParams.get('siteUrl') || 'sc-domain:checkit.net';

    // Test connection
    if (type === 'test') {
      const result = await testConnection();
      return NextResponse.json(result);
    }

    // Get sites
    if (type === 'sites') {
      try {
        const sites = await getSites();
        return NextResponse.json({ sites });
      } catch (error) {
        return NextResponse.json({ 
          sites: [], 
          error: error instanceof Error ? error.message : 'Failed to fetch sites' 
        });
      }
    }

    // Get queries
    if (type === 'queries') {
      const queries = await getSearchConsoleQueries(siteUrl);
      return NextResponse.json({ queries });
    }

    // Get pages
    if (type === 'pages') {
      const pages = await getSearchConsolePages(siteUrl);
      return NextResponse.json({ pages });
    }

    // Get summary
    if (type === 'summary') {
      const summary = await getSearchConsoleSummary(siteUrl);
      return NextResponse.json({ summary });
    }

    // Get all data
    const queries = await getSearchConsoleQueries(siteUrl, 50);
    const pages = await getSearchConsolePages(siteUrl, 50);
    const summary = await getSearchConsoleSummary(siteUrl);

    return NextResponse.json({
      queries,
      pages,
      summary,
      siteUrl,
    });
  } catch (error) {
    console.error('Search Console GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Search Console data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Trigger sync from Search Console API
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    await initializeSearchConsoleTables();

    const body = await request.json();
    const { siteUrl, days = 28 } = body;

    if (!siteUrl) {
      return NextResponse.json({ error: 'Site URL is required' }, { status: 400 });
    }

    // Check for API credentials
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        {
          error: 'Search Console API not configured',
          details: connectionTest.error,
          hint: 'Get a refresh token with the webmasters.readonly scope',
        },
        { status: 500 }
      );
    }

    // Create sync log
    const syncLog = await createSearchConsoleSyncLog(siteUrl, 'full');

    try {
      // Get date range
      const { startDate, endDate } = getDateRange(days);

      console.log(`Syncing Search Console data for ${siteUrl} from ${startDate} to ${endDate}`);

      // Fetch all data
      const { queries, pages, totals } = await syncAllData(siteUrl, startDate, endDate);

      console.log(`Fetched: ${queries.length} queries, ${pages.length} pages`);

      // Store queries
      for (const query of queries) {
        await upsertSearchConsoleQuery({
          siteUrl,
          query: query.query,
          clicks: query.clicks,
          impressions: query.impressions,
          ctr: query.ctr,
          position: query.position,
          dateRangeStart: startDate,
          dateRangeEnd: endDate,
        });
      }

      // Store pages
      for (const page of pages) {
        await upsertSearchConsolePage({
          siteUrl,
          pageUrl: page.page,
          clicks: page.clicks,
          impressions: page.impressions,
          ctr: page.ctr,
          position: page.position,
          dateRangeStart: startDate,
          dateRangeEnd: endDate,
        });
      }

      // Store totals
      await upsertSearchConsoleTotals({
        siteUrl,
        clicks: totals.clicks,
        impressions: totals.impressions,
        ctr: totals.ctr,
        position: totals.position,
        dateRangeStart: startDate,
        dateRangeEnd: endDate,
      });

      // Update sync log
      await updateSearchConsoleSyncLog(syncLog.id, {
        status: 'completed',
        queriesSynced: queries.length,
        pagesSynced: pages.length,
      });

      return NextResponse.json({
        success: true,
        queriesSynced: queries.length,
        pagesSynced: pages.length,
        totals,
        dateRange: { startDate, endDate },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await updateSearchConsoleSyncLog(syncLog.id, {
        status: 'failed',
        errorMessage,
      });
      throw error;
    }
  } catch (error) {
    console.error('Search Console POST error:', error);
    return NextResponse.json(
      { error: 'Failed to sync Search Console data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
