import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest';

const RESEND_EVENT_MAP: Record<string, string> = {
  'email.delivered': 'resend/email.delivered',
  'email.opened': 'resend/email.opened',
  'email.clicked': 'resend/email.clicked',
  'email.bounced': 'resend/email.bounced',
  'email.complained': 'resend/email.complained',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const resendEventType = body.type;
    const inngestEvent = RESEND_EVENT_MAP[resendEventType];

    if (!inngestEvent) {
      return NextResponse.json({ ignored: true, type: resendEventType });
    }

    await inngest.send({
      name: inngestEvent,
      data: body.data || body,
    });

    return NextResponse.json({ ok: true, event: inngestEvent });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
