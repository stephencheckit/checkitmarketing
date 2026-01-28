import { NextRequest, NextResponse } from 'next/server';
import { 
  getCompetitorResponses, 
  initializeCompetitorResponsesTable,
  markCompetitorResponseUsed,
  getCompetitorResponseBySourceUrl,
  deleteCompetitorResponse
} from '@/lib/db';

interface DBCompetitorResponse {
  id: number;
  competitor_name: string;
  source_article_title: string;
  source_article_url: string | null;
  source_article_snippet: string | null;
  response_title: string | null;
  response_description: string | null;
  response_key_points: string[] | null;
  response_linkedin_post: string | null;
  response_article: string | null;
  response_word_count: number | null;
  used_at: string | null;
  created_at: string;
}

// GET - Fetch all saved competitor responses
export async function GET() {
  try {
    await initializeCompetitorResponsesTable();
    const responses = await getCompetitorResponses() as DBCompetitorResponse[];
    
    // Transform database format to frontend format
    const transformed = responses.map((r) => ({
      id: r.id,
      competitorName: r.competitor_name,
      sourceArticleTitle: r.source_article_title,
      sourceArticleUrl: r.source_article_url,
      sourceArticleSnippet: r.source_article_snippet,
      response: {
        title: r.response_title || '',
        description: r.response_description || '',
        keyPoints: r.response_key_points || [],
        linkedinPost: r.response_linkedin_post || '',
        article: r.response_article || '',
        wordCount: r.response_word_count || 0,
      },
      usedAt: r.used_at,
      createdAt: r.created_at,
    }));
    
    return NextResponse.json({ responses: transformed });
  } catch (error) {
    console.error('Error fetching competitor responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch competitor responses' },
      { status: 500 }
    );
  }
}

// PATCH - Mark response as used
export async function PATCH(request: NextRequest) {
  try {
    const { id, markUsed } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    if (markUsed) {
      const updated = await markCompetitorResponseUsed(id);
      return NextResponse.json({ response: updated });
    }
    
    return NextResponse.json({ error: 'No action specified' }, { status: 400 });
  } catch (error) {
    console.error('Error updating competitor response:', error);
    return NextResponse.json(
      { error: 'Failed to update competitor response' },
      { status: 500 }
    );
  }
}

// DELETE - Remove a response
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    await deleteCompetitorResponse(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting competitor response:', error);
    return NextResponse.json(
      { error: 'Failed to delete competitor response' },
      { status: 500 }
    );
  }
}
