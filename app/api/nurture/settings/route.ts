import { NextRequest, NextResponse } from 'next/server';
import {
  initializeNurtureTables,
  getAllNurtureSettings,
  setNurtureSetting,
} from '@/lib/nurture-db';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeNurtureTables();
    initialized = true;
  }
}

export async function GET() {
  try {
    await ensureInitialized();
    const settings = await getAllNurtureSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureInitialized();
    const body = await request.json();
    const { key, value } = body;

    const allowedKeys = ['global_pause', 'daily_send_cap', 'recap_recipients'];
    if (!allowedKeys.includes(key)) {
      return NextResponse.json({ error: `Invalid setting key. Allowed: ${allowedKeys.join(', ')}` }, { status: 400 });
    }

    await setNurtureSetting(key, String(value));
    const settings = await getAllNurtureSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
