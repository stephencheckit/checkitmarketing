import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@/lib/session';
import { CONTACTS, findOpportunityForCompany, deriveFirstName } from '@/app/(portal)/admin/quick-send/data';

const STYLE_EXAMPLE = `Hey Adam-

This is Stephen with Checkit. Any temperature sensor or digital workflows needs I can assist with at Commonwealth heading into the summer?

-Stephen`;

const SYSTEM_PROMPT = `You write very short, plain-text prospecting emails for Stephen Newman at Checkit (a digital workflow + sensor company serving senior living, hospitality, and food service operators).

Voice rules (mirror these exactly):
- 2-4 sentences total. Short.
- Casual, human, lowercase OK in subject. No marketing speak.
- Open with "Hey {FirstName}-" (with the dash). If no first name is known, use "Hi there-".
- Always include "This is Stephen with Checkit." in the first or second sentence.
- Reference something specific from the account context (a person, a prior interaction, a current situation, a season/timing) — but keep it natural, never list multiple facts.
- End with a single soft question or low-pressure ask. No CTAs like "book a 15 min slot".
- Sign off with "-Stephen" on its own line.
- No greetings like "I hope this finds you well". No bullets. No links. No P.S.

Reference style example (do NOT copy verbatim, just match the tone/length):
"""
${STYLE_EXAMPLE}
"""

Return JSON: { "subject": string, "body": string }. Subject should be short (≤ 6 words), lowercase or sentence case, never sales-y.`;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY not configured' }, { status: 500 });
  }

  const { contactId, extraInstructions } = (await req.json().catch(() => ({}))) as {
    contactId?: string;
    extraInstructions?: string;
  };

  if (!contactId) {
    return NextResponse.json({ error: 'contactId required' }, { status: 400 });
  }

  const contact = CONTACTS.find((c) => c.id === contactId);
  if (!contact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  const opp = findOpportunityForCompany(contact.company);
  const firstName = deriveFirstName(contact.email);

  const userPrompt = `Write a short email to this person.

Recipient first name: ${firstName ?? '(unknown — use "Hi there-")'}
Recipient email: ${contact.email}
Company: ${contact.company}

${opp ? `Account context (internal sales notes — DO NOT quote directly, just use as background to make the message feel relevant):
- Opportunity: ${opp.oppName}
- Stage: ${opp.stage}
- Owner: ${opp.owner}
- Notes: ${opp.notes}` : `No opportunity notes on file. Keep the email very generic about Checkit's offering (temperature sensors, digital workflows for senior living / food service).`}

${extraInstructions ? `Additional instructions for this specific email:\n${extraInstructions}` : ''}

Return JSON with "subject" and "body".`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content) as { subject?: string; body?: string };

    if (!parsed.subject || !parsed.body) {
      return NextResponse.json({ error: 'Model returned incomplete draft', raw: content }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      subject: parsed.subject,
      body: parsed.body,
      firstName,
      opportunity: opp || null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
