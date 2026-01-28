import { NextRequest, NextResponse } from 'next/server';
import { 
  getInnovationIdeas, 
  initializeInnovationIdeasTable,
  markInnovationIdeaUsed,
  updateInnovationIdeaStatus,
  deleteInnovationIdea
} from '@/lib/db';

interface DBInnovationIdea {
  id: number;
  title: string;
  angle: string | null;
  competitor_insight: string | null;
  checkit_opportunity: string | null;
  target_audience: string | null;
  content_types: string[] | null;
  key_messages: string[] | null;
  used_at: string | null;
  created_at: string;
}

// GET - Fetch all innovation ideas
export async function GET() {
  try {
    await initializeInnovationIdeasTable();
    const ideas = await getInnovationIdeas('active') as DBInnovationIdea[];
    
    // Transform database format to frontend format
    const transformed = ideas.map((idea) => ({
      id: idea.id,
      title: idea.title,
      angle: idea.angle || '',
      competitorInsight: idea.competitor_insight || '',
      checkitOpportunity: idea.checkit_opportunity || '',
      targetAudience: idea.target_audience || '',
      contentTypes: idea.content_types || [],
      keyMessages: idea.key_messages || [],
      usedAt: idea.used_at,
      createdAt: idea.created_at,
    }));
    
    return NextResponse.json({ ideas: transformed });
  } catch (error) {
    console.error('Error fetching innovation ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch innovation ideas' },
      { status: 500 }
    );
  }
}

// PATCH - Mark idea as used or update status
export async function PATCH(request: NextRequest) {
  try {
    const { id, markUsed, status } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    if (markUsed) {
      const updated = await markInnovationIdeaUsed(id);
      return NextResponse.json({ idea: updated });
    }
    
    if (status) {
      const updated = await updateInnovationIdeaStatus(id, status);
      return NextResponse.json({ idea: updated });
    }
    
    return NextResponse.json({ error: 'No action specified' }, { status: 400 });
  } catch (error) {
    console.error('Error updating innovation idea:', error);
    return NextResponse.json(
      { error: 'Failed to update innovation idea' },
      { status: 500 }
    );
  }
}

// DELETE - Remove an idea
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    await deleteInnovationIdea(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting innovation idea:', error);
    return NextResponse.json(
      { error: 'Failed to delete innovation idea' },
      { status: 500 }
    );
  }
}
