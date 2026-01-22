import { NextRequest, NextResponse } from 'next/server';
import { 
  getBattlecardVersions, 
  getBattlecardVersion,
  restoreBattlecardVersion,
  initializeBattlecardTables 
} from '@/lib/db';

// Initialize tables on first request
let tablesInitialized = false;

async function ensureTables() {
  if (!tablesInitialized) {
    await initializeBattlecardTables();
    tablesInitialized = true;
  }
}

// GET all versions or specific version
export async function GET(request: NextRequest) {
  try {
    await ensureTables();
    const { searchParams } = new URL(request.url);
    const versionNumber = searchParams.get('version');

    if (versionNumber) {
      // Get specific version with full data
      const version = await getBattlecardVersion(parseInt(versionNumber));
      if (!version) {
        return NextResponse.json(
          { error: 'Version not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(version);
    }

    // Get all versions (without full data for list view)
    const versions = await getBattlecardVersions();
    return NextResponse.json(versions);
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}

// POST restore a specific version
export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    const body = await request.json();
    const { versionNumber } = body as { versionNumber: number };

    if (!versionNumber) {
      return NextResponse.json(
        { error: 'Version number is required' },
        { status: 400 }
      );
    }

    const result = await restoreBattlecardVersion(versionNumber);
    return NextResponse.json({ 
      success: true, 
      newVersion: result.version,
      message: `Restored from version ${versionNumber} as new version ${result.version}`
    });
  } catch (error) {
    console.error('Error restoring version:', error);
    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}
