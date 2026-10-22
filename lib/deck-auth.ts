import { NextRequest, NextResponse } from 'next/server';

const MAX_AGE_SECONDS = 60 * 60 * 12;

/** Password check for a private deck: sets the deck's cookie and redirects back to it. */
export async function handleDeckLogin(req: NextRequest, opts: { cookie: string; password: string | undefined; path: string }) {
  const form = await req.formData();
  const submitted = String(form.get('password') ?? '');
  const origin = new URL(req.url).origin;

  if (!opts.password || submitted !== opts.password) {
    return NextResponse.redirect(`${origin}${opts.path}?error=1`, { status: 303 });
  }

  const res = NextResponse.redirect(`${origin}${opts.path}`, { status: 303 });
  res.cookies.set(opts.cookie, 'ok', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
  return res;
}
