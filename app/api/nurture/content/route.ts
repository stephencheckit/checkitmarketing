import { NextRequest, NextResponse } from 'next/server';
import {
  initializeNurtureTables,
  getNurtureContent,
  addNurtureContent,
} from '@/lib/nurture-db';
import { seedDefaultContent } from '@/lib/nurture-seed';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeNurtureTables();
    await seedDefaultContent();
    initialized = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    const vertical = searchParams.get('vertical') || undefined;
    const topic = searchParams.get('topic') || undefined;

    const content = await getNurtureContent({ vertical, topic });
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();

    const body = await request.json();
    const { title, url, source, verticalTags, topicTags, description } = body;

    if (!title || !url || !source) {
      return NextResponse.json(
        { error: 'Title, URL, and source are required' },
        { status: 400 }
      );
    }

    const content = await addNurtureContent(
      title,
      url,
      source,
      verticalTags || [],
      topicTags || [],
      description
    );

    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error('Error adding content:', error);
    return NextResponse.json({ error: 'Failed to add content' }, { status: 500 });
  }
}
