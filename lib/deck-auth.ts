import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { sql } from './db';

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

/** "Name=password,Name=password" from an env var: personal passwords, so logins can be told apart. */
function parseGuests(raw: string | undefined) {
  return (raw ?? '')
    .split(',')
    .map((pair) => pair.split('='))
    .filter((p) => p.length === 2 && p[0].trim() && p[1].trim())
    .map(([label, password]) => ({ label: label.trim(), password: password.trim() }));
}

async function recordDeckLogin(req: NextRequest, deck: string, label: string) {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS deck_logins (
        id SERIAL PRIMARY KEY,
        deck TEXT NOT NULL,
        label TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null;
    await sql`INSERT INTO deck_logins (deck, label, ip, user_agent) VALUES (${deck}, ${label}, ${ip}, ${req.headers.get('user-agent')})`;
  } catch (err) {
    console.error('Deck login logging failed:', err);
  }
}

/** Password check for a private deck: sets the deck's cookie and redirects back to it. */
export async function handleDeckLogin(
  req: NextRequest,
  opts: { cookie: string; password: string | undefined; path: string; guestPasswords?: string }
) {
  const form = await req.formData();
  const submitted = String(form.get('password') ?? '');
  const origin = new URL(req.url).origin;
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const mac = sign(opts.cookie, expires);

  const accepted = [...(opts.password ? [{ label: 'shared', password: opts.password }] : []), ...parseGuests(opts.guestPasswords)];
  const match = submitted ? accepted.find((a) => a.password === submitted) : undefined;
  if (!match || !mac) {
    return NextResponse.redirect(`${origin}${opts.path}?error=1`, { status: 303 });
  }
  await recordDeckLogin(req, opts.path, match.label);

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
