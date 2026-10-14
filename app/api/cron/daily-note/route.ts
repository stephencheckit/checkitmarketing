import { NextRequest, NextResponse } from 'next/server';
import {
  getEarliestPublishedDay,
  hasPublishedOnUtcDay,
  insertPublishedDailyNote,
  listMissingPublishedDays,
} from '@/lib/db';
import { buildDailyNote, slugForNote } from '@/lib/daily-notes';

export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET;
const BACKFILL_PER_RUN = 4;

function todayInNewYork() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function previousDay(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day));
  utc.setUTCDate(utc.getUTCDate() - 1);
  return utc.toISOString().slice(0, 10);
}

async function publishNote(date: string) {
  const note = buildDailyNote(date);
  return insertPublishedDailyNote({
    date,
    title: note.title,
    slug: slugForNote(note.title, date),
    content: note.content,
    metaDescription: note.metaDescription,
    excerpt: note.excerpt,
    keywords: note.keywords,
  });
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = todayInNewYork();
  const created: { date: string; slug: string; kind: 'new' | 'backfill' }[] = [];

  if (!(await hasPublishedOnUtcDay(today))) {
    const saved = await publishNote(today);
    if (saved.created) created.push({ date: today, slug: saved.slug, kind: 'new' });
  }

  const start = await getEarliestPublishedDay();
  const yesterday = previousDay(today);
  const missing = start && start <= yesterday
    ? await listMissingPublishedDays(start, yesterday)
    : [];
  const batch = missing.slice(0, BACKFILL_PER_RUN);

  for (const date of batch) {
    const saved = await publishNote(date);
    if (saved.created) created.push({ date, slug: saved.slug, kind: 'backfill' });
  }

  return NextResponse.json({
    success: true,
    created,
    backfillRemaining: Math.max(missing.length - batch.length, 0),
  });
}

export async function POST(request: NextRequest) {
  return GET(request);
}
