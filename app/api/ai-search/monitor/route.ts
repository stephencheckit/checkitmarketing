import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  initializeAISearchTables,
  createAISearchQuery,
  getAISearchQueries,
  deleteAISearchQuery,
  saveAISearchResult,
  getLatestAISearchResults,
  getAISearchResultsByQuery,
  createAISearchScan,
  updateAISearchScan,
  getAISearchSummary,
  getQueryTrends,
  getBrandTrends,
  hasScannedToday,
  getLastScanDate,
  calculateAISearchProfileScores,
} from '@/lib/db';
import {
  queryOpenAI,
  DEFAULT_QUERIES,
  BRANDS_TO_TRACK,
  generateQueryRecommendations,
} from '@/lib/ai-search';

// GET - Return cached AI search data
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    await initializeAISearchTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // Get queries being monitored
    if (type === 'queries') {
      const queries = await getAISearchQueries();
      return NextResponse.json({ queries, defaultQueries: DEFAULT_QUERIES });
    }

    // Get latest results
    if (type === 'results') {
      const results = await getLatestAISearchResults(100);
      return NextResponse.json({ results });
    }

    // Get results for specific query
    if (type === 'query-results') {
      const queryId = searchParams.get('queryId');
      if (!queryId) {
        return NextResponse.json({ error: 'Query ID required' }, { status: 400 });
      }
      const results = await getAISearchResultsByQuery(parseInt(queryId));
      return NextResponse.json({ results });
    }

    // Get summary
    if (type === 'summary') {
      const summary = await getAISearchSummary();
      return NextResponse.json({ summary, brands: BRANDS_TO_TRACK });
    }

    // Get trend data
    if (type === 'trends') {
      try {
        const days = parseInt(searchParams.get('days') || '30');
        const queryTrends = await getQueryTrends(days);
        const brandTrends = await getBrandTrends(days);
        const scannedToday = await hasScannedToday();
        const lastScanDate = await getLastScanDate();
        
        return NextResponse.json({
          queryTrends,
          brandTrends,
          scannedToday,
          lastScanDate,
        });
      } catch (trendError) {
        console.error('Trends error:', trendError);
        // Return empty data if tables don't exist yet
        return NextResponse.json({
          queryTrends: [],
          brandTrends: [],
          scannedToday: false,
          lastScanDate: null,
        });
      }
    }

    // Get AI Search Profile Scores
    if (type === 'scores') {
      try {
        const scores = await calculateAISearchProfileScores();
        return NextResponse.json({ scores });
      } catch (err) {
        console.error('Scores error:', err);
        return NextResponse.json({ scores: [] });
      }
    }

    // Get recommendations
    if (type === 'recommendations') {
      const queries = await getAISearchQueries();
      const results = await getLatestAISearchResults(50);
      
      // Get content gaps (queries where Checkit wasn't mentioned)
      const contentGaps = results
        .filter(r => !r.checkit_mentioned)
        .map(r => r.query_text);
      
      const existingQueries = queries.map(q => q.query);
      const recommendations = await generateQueryRecommendations(existingQueries, contentGaps);
      
      return NextResponse.json(recommendations);
    }

    // Get all data
    const queries = await getAISearchQueries();
    const results = await getLatestAISearchResults(50);
    const summary = await getAISearchSummary();
    const scannedToday = await hasScannedToday();

    return NextResponse.json({
      queries,
      results,
      summary,
      brands: BRANDS_TO_TRACK,
      defaultQueries: DEFAULT_QUERIES,
      scannedToday,
    });
  } catch (error) {
    console.error('AI Search Monitor GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI search data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Manage queries and run scans
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    await initializeAISearchTables();

    const body = await request.json();
    const { action } = body;

    // Add a new query to monitor
    if (action === 'add_query') {
      const { query } = body;
      if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
      }
      const result = await createAISearchQuery(query);
      return NextResponse.json({ success: true, query: result });
    }

    // Delete a query
    if (action === 'delete_query') {
      const { queryId } = body;
      if (!queryId) {
        return NextResponse.json({ error: 'Query ID is required' }, { status: 400 });
      }
      await deleteAISearchQuery(queryId);
      return NextResponse.json({ success: true });
    }

    // Seed default queries
    if (action === 'seed_defaults') {
      for (const query of DEFAULT_QUERIES) {
        await createAISearchQuery(query);
      }
      const queries = await getAISearchQueries();
      return NextResponse.json({ success: true, queries });
    }

    // Run a single query scan
    if (action === 'scan_single') {
      const { queryId, queryText } = body;
      if (!queryText) {
        return NextResponse.json({ error: 'Query text is required' }, { status: 400 });
      }

      const result = await queryOpenAI(queryText);
      
      // Save result if we have a query ID
      if (queryId) {
        await saveAISearchResult({
          queryId,
          queryText,
          response: result.response,
          checkitMentioned: result.checkitMentioned,
          checkitPosition: result.checkitPosition,
          competitorsMentioned: result.competitorsMentioned,
          brandsData: result.brandsFound.reduce((acc, b) => {
            acc[b.brand] = { mentioned: b.mentioned, context: b.context };
            return acc;
          }, {} as Record<string, unknown>),
          source: 'openai',
        });
      }

      return NextResponse.json({
        success: true,
        result: {
          query: queryText,
          response: result.response,
          checkitMentioned: result.checkitMentioned,
          checkitPosition: result.checkitPosition,
          competitorsMentioned: result.competitorsMentioned,
          brandsFound: result.brandsFound,
        },
      });
    }

    // Run full scan on all queries
    if (action === 'scan_all') {
      const queries = await getAISearchQueries(true);
      
      if (queries.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'No queries to scan. Add queries first or seed defaults.',
        });
      }

      // Create scan record
      const scan = await createAISearchScan();
      let checkitMentions = 0;

      try {
        for (const q of queries) {
          try {
            const result = await queryOpenAI(q.query);
            
            await saveAISearchResult({
              queryId: q.id,
              queryText: q.query,
              response: result.response,
              checkitMentioned: result.checkitMentioned,
              checkitPosition: result.checkitPosition,
              competitorsMentioned: result.competitorsMentioned,
              brandsData: result.brandsFound.reduce((acc, b) => {
                acc[b.brand] = { mentioned: b.mentioned, context: b.context };
                return acc;
              }, {} as Record<string, unknown>),
              source: 'openai',
            });

            if (result.checkitMentioned) {
              checkitMentions++;
            }

            // Small delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (error) {
            console.error(`Error scanning query "${q.query}":`, error);
          }
        }

        await updateAISearchScan(scan.id, {
          status: 'completed',
          totalQueries: queries.length,
          checkitMentions,
        });

        return NextResponse.json({
          success: true,
          totalQueries: queries.length,
          checkitMentions,
          mentionRate: queries.length > 0 ? checkitMentions / queries.length : 0,
        });
      } catch (error) {
        await updateAISearchScan(scan.id, {
          status: 'failed',
        });
        throw error;
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('AI Search Monitor POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
