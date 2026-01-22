import { NextResponse } from 'next/server';
import { 
  getPositioningVersions, 
  restorePositioningVersion 
} from '@/lib/db';

// GET - Fetch version history
export async function GET() {
  try {
    const versions = await getPositioningVersions();
    return NextResponse.json(versions);
  } catch (error) {
    console.error('Error fetching positioning versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch version history' },
      { status: 500 }
    );
  }
}

// POST - Restore a specific version
export async function POST(request: Request) {
  try {
    const { versionNumber } = await request.json();
    
    if (!versionNumber) {
      return NextResponse.json(
        { error: 'Version number is required' },
        { status: 400 }
      );
    }
    
    const result = await restorePositioningVersion(versionNumber);
    
    return NextResponse.json({
      success: true,
      version: result.version
    });
  } catch (error) {
    console.error('Error restoring positioning version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}
