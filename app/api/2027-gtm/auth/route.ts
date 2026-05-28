import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'deck_2027_gtm';
const MAX_AGE_SECONDS = 60 * 60 * 12;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const submitted = String(form.get('password') ?? '');
  const expected = process.env.DECK_2027_GTM_PASSWORD;

  const origin = new URL(req.url).origin;

  if (!expected) {
    return NextResponse.redirect(`${origin}/2027-gtm?error=1`, { status: 303 });
  }

  if (submitted !== expected) {
    return NextResponse.redirect(`${origin}/2027-gtm?error=1`, { status: 303 });
  }

  const res = NextResponse.redirect(`${origin}/2027-gtm`, { status: 303 });
  res.cookies.set(COOKIE_NAME, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
  return res;
}
