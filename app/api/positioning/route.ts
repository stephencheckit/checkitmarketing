import { NextResponse } from 'next/server';
import { 
  getCurrentPositioningData, 
  savePositioningVersion,
  initializePositioningTables 
} from '@/lib/db';

// GET - Fetch current positioning document
export async function GET() {
  try {
    await initializePositioningTables();
    const result = await getCurrentPositioningData();
    
    return NextResponse.json({
      data: result.data,
      current_version: result.current_version,
      versionCreatedAt: result.versionCreatedAt
    });
  } catch (error) {
    console.error('Error fetching positioning document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positioning document' },
      { status: 500 }
    );
  }
}

// POST - Save new version
export async function POST(request: Request) {
  try {
    const { data, changeNotes } = await request.json();
    
    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }
    
    const result = await savePositioningVersion(data, changeNotes);
    
    return NextResponse.json({
      success: true,
      version: result.version
    });
  } catch (error) {
    console.error('Error saving positioning document:', error);
    return NextResponse.json(
      { error: 'Failed to save positioning document' },
      { status: 500 }
    );
  }
}
