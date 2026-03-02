import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import OpenAI from 'openai';
import {
  initializeNurtureTables,
  getNurtureTracks,
  getTrackSteps,
  getNurtureContent,
} from '@/lib/nurture-db';
import { seedDefaultTrack, seedDefaultContent } from '@/lib/nurture-seed';

const PHYSICAL_ADDRESS = 'Checkit HQ - 385 Mariner Blvd. Spring Hill, FL 34609';
const FROM_EMAIL = 'Checkit <noreply@checkitv6.com>';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeNurtureTables();
    await seedDefaultTrack();
    await seedDefaultContent();
    initialized = true;
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureInitialized();

    const body = await request.json();
    const {
      stepNumber,
      testEmail,
      contactName,
      contactEmail,
      companyName,
      vertical,
      accountContext,
      lossReason,
    } = body;

    if (!testEmail || !stepNumber) {
      return NextResponse.json(
        { error: 'testEmail and stepNumber are required' },
        { status: 400 }
      );
    }

    const tracks = await getNurtureTracks();
    const active = tracks.find((t) => t.status === 'active');
    if (!active) {
      return NextResponse.json({ error: 'No active track found' }, { status: 404 });
    }

    const steps = await getTrackSteps(active.id);
    const stepData = steps.find((s) => s.step_number === stepNumber);
    if (!stepData) {
      return NextResponse.json({ error: `Step ${stepNumber} not found` }, { status: 404 });
    }

    const contentTags = (stepData.content_tags as string[]) || [];
    let contentItems = await getNurtureContent({
      vertical: vertical || undefined,
    });
    if (contentTags.length > 0) {
      contentItems = contentItems.filter((c) => {
        const cTopics = c.topic_tags as string[];
        return contentTags.some((tag) => cTopics.includes(tag));
      });
    }
    const contentBlock =
      contentItems
        .slice(0, 3)
        .map((c) => `- ${c.title}: ${c.description || ''}\n  ${c.url}`)
        .join('\n') || 'Visit checkitv6.com to learn more about our platform.';

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are writing a professional marketing email for Checkit, an operational compliance and automated monitoring platform.

Personalize this email template for the recipient. Keep the tone warm, professional, and consultative — not pushy. Replace template variables with appropriate content.

RECIPIENT:
- Name: ${contactName || 'there'}
- Company: ${companyName || 'their organization'}
- Vertical: ${vertical || 'operations'}
- Loss reason: ${lossReason || 'unknown'}
- Account context from the sales rep: ${accountContext || 'No additional context provided.'}

TEMPLATE SUBJECT: ${stepData.subject_template}

TEMPLATE BODY:
${stepData.body_template}

CONTENT TO REFERENCE (pick the most relevant):
${contentBlock}

SENDER NAME: The Checkit Team

Instructions:
- Replace {{contact_name}} with the recipient's first name
- Replace {{company_name}} with the company name
- Replace {{vertical}} with a natural industry name (e.g., "senior living" not "senior-living")
- Replace {{sender_name}} with the sender name
- Replace {{personalized_context}} with 1-2 sentences referencing the account context
- Replace {{content_block}} with a brief, natural reference to the most relevant content piece(s) — include the URL naturally
- Keep the email under 200 words
- Do NOT include subject line in the body
- Return ONLY the email body text, no markdown formatting

Also return a personalized subject line.

Format your response as:
SUBJECT: <the personalized subject line>
BODY:
<the personalized email body>`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || '';
    const subjectMatch = response.match(/SUBJECT:\s*(.+)/);
    const bodyMatch = response.match(/BODY:\s*([\s\S]+)/);

    const personalizedSubject =
      subjectMatch?.[1]?.trim() ||
      stepData.subject_template.replace('{{contact_name}}', contactName || 'there');
    const personalizedBody = bodyMatch?.[1]?.trim() || stepData.body_template;

    const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="padding: 12px 32px; background: #fef3c7; border-bottom: 1px solid #f59e0b;">
    <p style="color: #92400e; font-size: 12px; margin: 0; font-weight: 600;">
      TEST PREVIEW — Step ${stepNumber} of 6 • This is what ${contactName || 'the contact'} would receive
    </p>
  </div>
  <div style="padding: 32px; background: #ffffff;">
    ${personalizedBody
      .split('\n')
      .map((line: string) =>
        line.trim()
          ? `<p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 12px 0;">${line}</p>`
          : ''
      )
      .join('')}
  </div>
  <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 11px; line-height: 1.5; margin: 0;">
      ${PHYSICAL_ADDRESS}<br/>
      <a href="#" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> from these emails.
    </p>
  </div>
</div>`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const sendResult = await resend.emails.send({
      from: FROM_EMAIL,
      to: testEmail,
      subject: `[TEST] ${personalizedSubject}`,
      html: htmlBody,
      text: `[TEST PREVIEW — Step ${stepNumber} of 6]\n\n${personalizedBody}\n\n---\n${PHYSICAL_ADDRESS}`,
    });

    if (sendResult.error) {
      return NextResponse.json(
        { error: sendResult.error.message || 'Failed to send test email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: sendResult.data?.id,
      subject: personalizedSubject,
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}
