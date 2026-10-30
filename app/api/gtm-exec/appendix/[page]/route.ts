import { readFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { GTM_DECK_COOKIE, hasDeckAccess } from '@/lib/deck-auth';

// The FY28 plan PDF pages name customers and their ARR, so they live outside
// public/ and are served only to someone with the exec deck's cookie.
export async function GET(_req: Request, { params }: { params: Promise<{ page: string }> }) {
  if (process.env.NODE_ENV === 'production' && !(await hasDeckAccess(GTM_DECK_COOKIE))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { page } = await params;
  if (!/^\d{1,2}$/.test(page)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    const file = await readFile(path.join(process.cwd(), 'private', 'fy28-plan', `page-${page}.png`));
    return new NextResponse(new Uint8Array(file), {
      headers: { 'Content-Type': 'image/png', 'Cache-Control': 'private, max-age=3600' },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
