import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const MAX_AGE_SECONDS = 60 * 60 * 12;

export const GTM_DECK_COOKIE = 'deck_gtm_exec';

function sign(cookie: string, expires: number) {
  const secret = process.env.DECK_COOKIE_SECRET;
  if (!secret) return null;
  return createHmac('sha256', secret).update(`${cookie}.${expires}`).digest('hex');
}

/** A deck cookie is "<expiry>.<hmac>", so it can't be hand-made without the server secret. */
export function verifyDeckCookie(cookie: string, value: string | undefined) {
  if (!value) return false;
  const [exp, mac] = value.split('.');
  const expires = Number(exp);
  if (!Number.isFinite(expires) || expires < Date.now() / 1000 || !mac) return false;
  const expected = sign(cookie, expires);
  if (!expected || expected.length !== mac.length) return false;
  return timingSafeEqual(Buffer.from(expected), Buffer.from(mac));
}

export async function hasDeckAccess(cookie: string) {
  return verifyDeckCookie(cookie, (await cookies()).get(cookie)?.value);
}

/** Password check for a private deck: sets the deck's cookie and redirects back to it. */
export async function handleDeckLogin(req: NextRequest, opts: { cookie: string; password: string | undefined; path: string }) {
  const form = await req.formData();
  const submitted = String(form.get('password') ?? '');
  const origin = new URL(req.url).origin;
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const mac = sign(opts.cookie, expires);

  if (!opts.password || submitted !== opts.password || !mac) {
    return NextResponse.redirect(`${origin}${opts.path}?error=1`, { status: 303 });
  }

  const res = NextResponse.redirect(`${origin}${opts.path}`, { status: 303 });
  res.cookies.set(opts.cookie, `${expires}.${mac}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  });
  return res;
}
