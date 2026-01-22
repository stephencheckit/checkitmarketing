import { NextRequest, NextResponse } from 'next/server';
import { 
  getContentIdeas, 
  saveContentIdea, 
  saveContentIdeasBatch,
  updateContentIdea,
  deleteContentIdea,
  initializeContentIdeasTable 
} from '@/lib/db';

// GET - Fetch all saved content ideas
export async function GET(request: NextRequest) {
  try {
    await initializeContentIdeasTable();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    
    const ideas = await getContentIdeas(status);
    
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('Error fetching content ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content ideas' },
      { status: 500 }
    );
  }
}

// POST - Save content idea(s)
export async function POST(request: NextRequest) {
  try {
    await initializeContentIdeasTable();
    
    const body = await request.json();
    
    // Handle batch save (array of ideas)
    if (Array.isArray(body.ideas)) {
      const saved = await saveContentIdeasBatch(body.ideas);
      return NextResponse.json({ ideas: saved, count: saved.length });
    }
    
    // Handle single idea save
    if (body.title) {
      const saved = await saveContentIdea(body);
      return NextResponse.json({ idea: saved });
    }
    
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error saving content idea:', error);
    return NextResponse.json(
      { error: 'Failed to save content idea' },
      { status: 500 }
    );
  }
}

// PATCH - Update a content idea
export async function PATCH(request: NextRequest) {
  try {
    await initializeContentIdeasTable();
    
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    const updated = await updateContentIdea(id, updates);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Content idea not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ idea: updated });
  } catch (error) {
    console.error('Error updating content idea:', error);
    return NextResponse.json(
      { error: 'Failed to update content idea' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a content idea
export async function DELETE(request: NextRequest) {
  try {
    await initializeContentIdeasTable();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }
    
    await deleteContentIdea(parseInt(id, 10));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting content idea:', error);
    return NextResponse.json(
      { error: 'Failed to delete content idea' },
      { status: 500 }
    );
  }
}
