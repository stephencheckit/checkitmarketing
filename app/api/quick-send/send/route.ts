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

  const { to, subject, body } = (await req.json().catch(() => ({}))) as {
    to?: string;
    subject?: string;
    body?: string;
  };

  if (!to || !subject || !body) {
    return NextResponse.json({ error: 'to, subject, body are required' }, { status: 400 });
  }

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
