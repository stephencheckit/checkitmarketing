import { NextResponse } from 'next/server';
import {
  initializeNurtureTables,
  getNurtureTracks,
} from '@/lib/nurture-db';
import { seedDefaultTrack, seedIndustryTracks } from '@/lib/nurture-seed';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeNurtureTables();
    await seedDefaultTrack();
    await seedIndustryTracks();
    initialized = true;
  }
}

export async function GET() {
  try {
    await ensureInitialized();
    const tracks = await getNurtureTracks();
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: 'Failed to fetch tracks' }, { status: 500 });
  }
}
