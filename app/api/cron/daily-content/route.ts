import { NextRequest, NextResponse } from 'next/server';
import {
  initializeAISearchTables,
  getAISearchQueries,
  saveAISearchResult,
  createAISearchScan,
  updateAISearchScan,
  getLatestAISearchResults,
  initializeContentDraftsTables,
  createContentDraft,
  updateDraftContent,
  updateDraftStatus,
  getContentDrafts,
} from '@/lib/db';
import {
  queryOpenAI,
  generateContentBrief,
  generateFullArticle,
} from '@/lib/ai-search';

// Verify cron secret to prevent unauthorized access
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  const log: string[] = [];
  
  try {
    log.push(`[${new Date().toISOString()}] Daily content pipeline started`);

    // Initialize tables
    await initializeAISearchTables();
    await initializeContentDraftsTables();

    // ============================================
    // STEP 1: Run AI Search Scan
    // ============================================
    log.push('Step 1: Running AI search scan...');
    
    const queries = await getAISearchQueries();
    const activeQueries = queries.filter(q => q.is_active);
    
    if (activeQueries.length === 0) {
      log.push('No active queries to scan. Pipeline complete.');
      return NextResponse.json({ success: true, log, duration: Date.now() - startTime });
    }

    // Create scan record
    const scan = await createAISearchScan(activeQueries.length);
    let scannedCount = 0;
    let errorCount = 0;

    for (const query of activeQueries) {
      try {
        const result = await queryOpenAI(query.query_text);
        await saveAISearchResult({
          queryId: query.id,
          queryText: query.query_text,
          response: result.response,
          checkitMentioned: result.checkitMentioned,
          checkitPosition: result.checkitPosition,
          competitorsMentioned: result.competitorsMentioned,
          brandsData: result.brandsData,
          source: 'openai-gpt4o-mini',
        });
        scannedCount++;
      } catch (err) {
        errorCount++;
        log.push(`Error scanning "${query.query_text}": ${err}`);
      }
    }

    await updateAISearchScan(scan.id, 'completed', scannedCount, errorCount);
    log.push(`Scanned ${scannedCount} queries (${errorCount} errors)`);

    // ============================================
    // STEP 2: Find Content Gaps
    // ============================================
    log.push('Step 2: Finding content gaps...');
    
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
    // STEP 3: Generate & Publish Content (max 10/day)
    // ============================================
    log.push('Step 3: Generating content for gaps (max 10)...');
    
    const toProcess = gaps.slice(0, 10);
    let articlesCreated = 0;

    for (const gap of toProcess) {
      try {
        log.push(`Processing: "${gap.query_text.substring(0, 50)}..."`);

        // Generate brief
        const brief = await generateContentBrief(
          gap.query_text,
          gap.competitors_mentioned || []
        );

        // Create draft record
        const draft = await createContentDraft({
          sourceQuery: gap.query_text,
          sourceQueryId: gap.query_id,
          title: brief.title,
          targetKeywords: brief.targetKeywords,
          outline: brief.outline,
          keyPoints: brief.keyPoints,
          faqQuestions: brief.faqQuestions,
        });

        // Generate full article
        const article = await generateFullArticle({
          title: brief.title,
          targetKeywords: brief.targetKeywords,
          outline: brief.outline,
          keyPoints: brief.keyPoints,
          faqQuestions: brief.faqQuestions,
        });

        // Update draft with content
        await updateDraftContent(draft.id, {
          content: article.content,
          metaDescription: article.metaDescription,
          excerpt: article.excerpt,
        });

        // Auto-publish
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
