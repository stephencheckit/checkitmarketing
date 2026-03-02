import { NextRequest, NextResponse } from 'next/server';
import {
  initializeNurtureTables,
  getNurtureTracks,
  getTrackSteps,
} from '@/lib/nurture-db';
import { seedDefaultTrack } from '@/lib/nurture-seed';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeNurtureTables();
    await seedDefaultTrack();
    initialized = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('trackId');

    let resolvedTrackId: number;
    if (trackId) {
      resolvedTrackId = parseInt(trackId);
    } else {
      const tracks = await getNurtureTracks();
      const active = tracks.find((t) => t.status === 'active');
      if (!active) {
        return NextResponse.json({ error: 'No active track found' }, { status: 404 });
      }
      resolvedTrackId = active.id;
    }

    const steps = await getTrackSteps(resolvedTrackId);
    const tracks = await getNurtureTracks();
    const track = tracks.find((t) => t.id === resolvedTrackId);

    return NextResponse.json({
      track,
      steps: steps.map((s) => ({
        step_number: s.step_number,
        delay_days: s.delay_days,
        subject_template: s.subject_template,
        content_tags: s.content_tags,
      })),
    });
  } catch (error) {
    console.error('Error fetching preview:', error);
    return NextResponse.json({ error: 'Failed to fetch preview' }, { status: 500 });
  }
}
