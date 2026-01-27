import { NextRequest, NextResponse } from 'next/server';
import { 
  getPageContent, 
  upsertPageContent,
  initializePageContentTable 
} from '@/lib/db';
import { getSession } from '@/lib/session';

// GET - Fetch all content for a page
export async function GET(request: NextRequest) {
  try {
    await initializePageContentTable();
    
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    
    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId is required' },
        { status: 400 }
      );
    }
    
    const content = await getPageContent(pageId);
    
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page content' },
      { status: 500 }
    );
  }
}

// PATCH - Update a single content field
export async function PATCH(request: NextRequest) {
  try {
    await initializePageContentTable();
    
    // Check if user is admin
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }
    
    const { pageId, fieldId, content } = await request.json();
    
    if (!pageId || !fieldId || content === undefined) {
      return NextResponse.json(
        { error: 'pageId, fieldId, and content are required' },
        { status: 400 }
      );
    }
    
    const result = await upsertPageContent(
      pageId, 
      fieldId, 
      content, 
      session.userId
    );
    
    return NextResponse.json({
      success: true,
      updated: result
    });
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json(
      { error: 'Failed to update page content' },
      { status: 500 }
    );
  }
}
