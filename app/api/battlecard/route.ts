import { NextRequest, NextResponse } from 'next/server';
import { 
  getCurrentBattlecardData, 
  saveBattlecardVersion,
  initializeBattlecardTables 
} from '@/lib/db';
import { BattlecardData } from '@/lib/types';

// Initialize tables on first request
let tablesInitialized = false;

async function ensureTables() {
  if (!tablesInitialized) {
    await initializeBattlecardTables();
    tablesInitialized = true;
  }
}

// GET current battlecard
export async function GET() {
  try {
    await ensureTables();
    const battlecard = await getCurrentBattlecardData();
    return NextResponse.json(battlecard);
  } catch (error) {
    console.error('Error fetching battlecard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch battlecard' },
      { status: 500 }
    );
  }
}

// POST save new version
export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    const body = await request.json();
    const { data, changeNotes } = body as { 
      data: BattlecardData; 
      changeNotes?: string 
    };

    if (!data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }

    const result = await saveBattlecardVersion(data, changeNotes);
    return NextResponse.json({ 
      success: true, 
      version: result.version,
      message: `Saved as version ${result.version}`
    });
  } catch (error) {
    console.error('Error saving battlecard:', error);
    return NextResponse.json(
      { error: 'Failed to save battlecard' },
      { status: 500 }
    );
  }
}
