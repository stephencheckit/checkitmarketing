import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSession } from '@/lib/session';

const FROM = 'Stephen Newman <stephen@checkitv6.com>';
const REPLY_TO = 'stephen.newman@checkit.net';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }

  let to = 'stephen.p.newman@gmail.com';
  let subject = 'Test from Checkit Market Hub';
  let body =
    "Hey Stephen-\n\nThis is a quick test. If you're reading this, the send path works and replies should land in stephen.newman@checkit.net.\n\n-Stephen";

  try {
    const json = (await req.json().catch(() => ({}))) as {
      to?: string;
      subject?: string;
      body?: string;
    };
    if (json.to) to = json.to;
    if (json.subject) subject = json.subject;
    if (json.body) body = json.body;
  } catch {}

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM,
      to,
      replyTo: REPLY_TO,
      subject,
      text: body,
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message || 'Send failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: result.data?.id, to });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
