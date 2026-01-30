import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  initializeContentDraftsTables,
  createContentDraft,
  updateDraftContent,
  updateDraftStatus,
  updateDraft,
  getContentDrafts,
  getContentDraft,
  deleteContentDraft,
  getContentDraftsSummary,
} from '@/lib/db';
import {
  generateContentBrief,
  generateFullArticle,
} from '@/lib/ai-search';

// GET - Return content drafts
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    await initializeContentDraftsTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status');
    const id = searchParams.get('id');

    // Get single draft by ID
    if (id) {
      const draft = await getContentDraft(parseInt(id));
      if (!draft) {
        return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
      }
      return NextResponse.json({ draft });
    }

    // Get summary
    if (type === 'summary') {
      const summary = await getContentDraftsSummary();
      return NextResponse.json({ summary });
    }

    // Get drafts by status or all
    const drafts = await getContentDrafts(status as any || undefined);
    const summary = await getContentDraftsSummary();

    return NextResponse.json({ drafts, summary });
  } catch (error) {
    console.error('Content generate GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content drafts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Generate content and manage drafts
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    await initializeContentDraftsTables();

    const body = await request.json();
    const { action } = body;

    // Generate content brief from a query
    if (action === 'generate_brief') {
      const { query, queryId, competitorsMentioned = [] } = body;
      if (!query) {
        return NextResponse.json({ error: 'Query is required' }, { status: 400 });
      }

      // Generate the brief using AI
      const brief = await generateContentBrief(query, competitorsMentioned);

      // Save as a draft
      const draft = await createContentDraft({
        sourceQuery: query,
        sourceQueryId: queryId,
        title: brief.title,
        targetKeywords: brief.targetKeywords,
        outline: brief.outline,
        keyPoints: brief.keyPoints,
        faqQuestions: brief.faqQuestions,
      });

      return NextResponse.json({
        success: true,
        draft,
        brief,
      });
    }

    // Generate full article from a brief
    if (action === 'generate_article') {
      const { draftId } = body;
      if (!draftId) {
        return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
      }

      // Get the draft
      const draft = await getContentDraft(draftId);
      if (!draft) {
        return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
      }

      // Generate full article
      const article = await generateFullArticle({
        title: draft.title,
        targetKeywords: draft.target_keywords as string[],
        outline: draft.outline as string[],
        keyPoints: draft.key_points as string[],
        faqQuestions: draft.faq_questions as string[],
      });

      // Update the draft with content
      const updatedDraft = await updateDraftContent(draftId, {
        content: article.content,
        metaDescription: article.metaDescription,
        excerpt: article.excerpt,
      });

      return NextResponse.json({
        success: true,
        draft: updatedDraft,
        article,
      });
    }

    // Update draft status
    if (action === 'update_status') {
      const { draftId, status, publishedUrl } = body;
      if (!draftId || !status) {
        return NextResponse.json({ error: 'Draft ID and status are required' }, { status: 400 });
      }

      const draft = await updateDraftStatus(draftId, status, publishedUrl);
      return NextResponse.json({ success: true, draft });
    }

    // Update draft content
    if (action === 'update_draft') {
      const { draftId, ...updates } = body;
      if (!draftId) {
        return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
      }

      const draft = await updateDraft(draftId, updates);
      return NextResponse.json({ success: true, draft });
    }

    // Delete draft
    if (action === 'delete_draft') {
      const { draftId } = body;
      if (!draftId) {
        return NextResponse.json({ error: 'Draft ID is required' }, { status: 400 });
      }

      await deleteContentDraft(draftId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Content generate POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
