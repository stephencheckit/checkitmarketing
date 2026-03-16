import { NextRequest, NextResponse } from 'next/server';
import {
  initializeAISearchTables,
  getAISearchQueries,
  createAISearchQuery,
  saveAISearchResult,
  createAISearchScan,
  updateAISearchScan,
  getLatestAISearchResults,
  initializeContentDraftsTables,
  createContentDraft,
  updateDraftContent,
  updateDraftStatus,
  getContentDrafts,
  initializeCompetitorFeedsTables,
  getDiscoveredCompetitors,
  syncDiscoveredCompetitors,
  getSearchConsoleQueries,
} from '@/lib/db';
import {
  queryOpenAI,
  generateContentBrief,
  generateFullArticle,
  generateQueryRecommendations,
  generateQueriesFromSearchTerms,
  isNonBrandedQuery,
} from '@/lib/ai-search';

export const maxDuration = 300;

const CRON_SECRET = process.env.CRON_SECRET;

const PARALLEL_BATCH_SIZE = 10;

async function processQueryBatch(
  batch: { id: number; query: string }[],
  log: string[]
): Promise<{ scanned: number; mentions: number }> {
  const results = await Promise.allSettled(
    batch.map(async (q) => {
      const result = await queryOpenAI(q.query);
      const brandsData: Record<string, { mentioned: boolean; context: string | null }> = {};
      for (const brand of result.brandsFound) {
        brandsData[brand.brand] = { mentioned: brand.mentioned, context: brand.context };
      }
      await saveAISearchResult({
        queryId: q.id,
        queryText: q.query,
        response: result.response,
        checkitMentioned: result.checkitMentioned,
        checkitPosition: result.checkitPosition,
        competitorsMentioned: result.competitorsMentioned,
        brandsData,
        source: 'openai-gpt4o-mini',
      });
      return result.checkitMentioned;
    })
  );

  let scanned = 0;
  let mentions = 0;
  for (let i = 0; i < results.length; i++) {
    if (results[i].status === 'fulfilled') {
      scanned++;
      if ((results[i] as PromiseFulfilledResult<boolean>).value) mentions++;
    } else {
      log.push(`Error scanning "${batch[i].query}": ${(results[i] as PromiseRejectedResult).reason}`);
    }
  }
  return { scanned, mentions };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const log: string[] = [];
  
  try {
    log.push(`[${new Date().toISOString()}] Daily content pipeline started`);

    await initializeAISearchTables();
    await initializeContentDraftsTables();
    await initializeCompetitorFeedsTables();

    // ============================================
    // STEP 1: Run AI Search Scan (parallel batches)
    // ============================================
    log.push('Step 1: Running AI search scan...');
    
    const queries = await getAISearchQueries();
    const activeQueries = queries.filter(q => q.is_active);
    
    if (activeQueries.length === 0) {
      log.push('No active queries to scan. Pipeline complete.');
      return NextResponse.json({ success: true, log, duration: Date.now() - startTime });
    }

    const scan = await createAISearchScan();
    let scannedCount = 0;
    let checkitMentions = 0;

    for (let i = 0; i < activeQueries.length; i += PARALLEL_BATCH_SIZE) {
      const batch = activeQueries.slice(i, i + PARALLEL_BATCH_SIZE);
      const { scanned, mentions } = await processQueryBatch(batch, log);
      scannedCount += scanned;
      checkitMentions += mentions;
    }

    await updateAISearchScan(scan.id, { status: 'completed', totalQueries: scannedCount, checkitMentions });
    log.push(`Scanned ${scannedCount} queries (${checkitMentions} mentioned Checkit)`);

    // ============================================
    // STEP 1.5: Discover & Add New Queries (max 5/day)
    // ============================================
    log.push('Step 1.5: Discovering new queries...');
    
    let newQueriesAdded = 0;
    const existingQueryTexts = new Set(activeQueries.map(q => q.query.toLowerCase()));
    
    try {
      // Source 1: AI recommendations based on gaps
      const recentResults = await getLatestAISearchResults(30);
      const contentGaps = recentResults
        .filter(r => !r.checkit_mentioned)
        .map(r => r.query_text);
      
      if (contentGaps.length > 0) {
        const recommendations = await generateQueryRecommendations(
          activeQueries.map(q => q.query),
          contentGaps
        );
        
        for (const rec of (recommendations.recommendations || []).slice(0, 3)) {
          // Filter out branded queries (containing "Checkit")
          if (!existingQueryTexts.has(rec.query.toLowerCase()) && 
              newQueriesAdded < 5 && 
              isNonBrandedQuery(rec.query)) {
            await createAISearchQuery(rec.query);
            existingQueryTexts.add(rec.query.toLowerCase());
            newQueriesAdded++;
            log.push(`+ Added AI recommendation: "${rec.query.substring(0, 50)}..."`);
          }
        }
      }
      
      // Source 2: Search Console queries
      const searchQueries = await getSearchConsoleQueries('sc-domain:checkit.net');
      if (searchQueries.length > 0) {
        const searchTerms = searchQueries.map(q => q.query as string).slice(0, 20);
        const fromSearchConsole = await generateQueriesFromSearchTerms(searchTerms);
        
        for (const q of (fromSearchConsole.queries || []).slice(0, 2)) {
          // Filter out branded queries (containing "Checkit")
          if (!existingQueryTexts.has(q.query.toLowerCase()) && 
              newQueriesAdded < 5 && 
              isNonBrandedQuery(q.query)) {
            await createAISearchQuery(q.query);
            existingQueryTexts.add(q.query.toLowerCase());
            newQueriesAdded++;
            log.push(`+ Added from Search Console: "${q.query.substring(0, 50)}..."`);
          }
        }
      }
      
      log.push(`Added ${newQueriesAdded} new queries to monitor`);
    } catch (err) {
      log.push(`Query discovery error (non-fatal): ${err}`);
    }

    // ============================================
    // STEP 2: Sync Discovered Competitors
    // ============================================
    log.push('Step 2: Syncing discovered competitors...');
    
    const discoveredCompetitors = await getDiscoveredCompetitors();
    const newCompetitors = await syncDiscoveredCompetitors(discoveredCompetitors);
    
    if (newCompetitors.length > 0) {
      log.push(`Added ${newCompetitors.length} new competitors: ${newCompetitors.join(', ')}`);
    } else {
      log.push(`No new competitors to add (tracking ${discoveredCompetitors.length} total)`);
    }

    // ============================================
    // STEP 3: Find Content Gaps
    // ============================================
    log.push('Step 3: Finding content gaps...');
    
    const results = await getLatestAISearchResults(100);
    const existingDrafts = await getContentDrafts();
    const existingQueries = new Set(existingDrafts.map(d => d.source_query));
    
    // Find gaps: results where Checkit wasn't mentioned AND no draft exists
    const gaps = results.filter(r => 
      !r.checkit_mentioned && !existingQueries.has(r.query_text)
    );
    
    log.push(`Found ${gaps.length} content gaps`);

    if (gaps.length === 0) {
      log.push('No new gaps to process. Pipeline complete.');
      return NextResponse.json({ 
        success: true, 
        log, 
        summary: { scanned: scannedCount, gaps: 0, articlesCreated: 0 },
        duration: Date.now() - startTime 
      });
    }

    // ============================================
    // STEP 4: Generate & Publish Content (max 3/day)
    // ============================================
    const elapsedSoFar = Date.now() - startTime;
    const TIME_LIMIT_MS = 270_000; // Leave 30s buffer before 300s max

    if (elapsedSoFar > TIME_LIMIT_MS) {
      log.push(`Step 4: Skipped - ${Math.round(elapsedSoFar / 1000)}s elapsed, not enough time for content generation.`);
      return NextResponse.json({
        success: true,
        log,
        summary: { scanned: scannedCount, gaps: gaps.length, articlesCreated: 0 },
        duration: Date.now() - startTime,
      });
    }

    log.push('Step 4: Generating content for gaps (max 3)...');
    
    const toProcess = gaps.slice(0, 3);
    let articlesCreated = 0;

    for (const gap of toProcess) {
      if (Date.now() - startTime > TIME_LIMIT_MS) {
        log.push(`Time limit approaching, stopping content generation after ${articlesCreated} articles.`);
        break;
      }

      try {
        log.push(`Processing: "${gap.query_text.substring(0, 50)}..."`);

        const brief = await generateContentBrief(
          gap.query_text,
          gap.competitors_mentioned || []
        );

        const draft = await createContentDraft({
          sourceQuery: gap.query_text,
          sourceQueryId: gap.query_id,
          title: brief.title,
          targetKeywords: brief.targetKeywords,
          outline: brief.outline,
          keyPoints: brief.keyPoints,
          faqQuestions: brief.faqQuestions,
        });

        const article = await generateFullArticle({
          title: brief.title,
          targetKeywords: brief.targetKeywords,
          outline: brief.outline,
          keyPoints: brief.keyPoints,
          faqQuestions: brief.faqQuestions,
        });

        await updateDraftContent(draft.id, {
          content: article.content,
          metaDescription: article.metaDescription,
          excerpt: article.excerpt,
        });

        await updateDraftStatus(draft.id, 'published', `/resources/${draft.slug}`);
        
        articlesCreated++;
        log.push(`✓ Published: "${brief.title}"`);

      } catch (err) {
        log.push(`✗ Failed: "${gap.query_text}" - ${err}`);
      }
    }

    log.push(`Pipeline complete! Created ${articlesCreated} articles.`);

    return NextResponse.json({
      success: true,
      log,
      summary: {
        scanned: scannedCount,
        gaps: gaps.length,
        articlesCreated,
      },
      duration: Date.now() - startTime,
    });

  } catch (error) {
    log.push(`Pipeline error: ${error}`);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        log,
        duration: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}

// Also allow POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
