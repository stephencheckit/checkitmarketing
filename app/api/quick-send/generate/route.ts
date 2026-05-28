import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSession } from '@/lib/session';
import { CONTACTS, findOpportunityForCompany, deriveFirstName } from '@/app/(portal)/admin/quick-send/data';

const STYLE_EXAMPLE = `Hey Adam-

Stephen here with Checkit. Picking up Albert's accounts and trying to re-engage on the Commonwealth side without being annoying about it. I'll send a quick calendar placeholder in case it's easier to catch you live — no obligation, just trying to get creative.

-Stephen`;

const SYSTEM_PROMPT = `You write very short, plain-text re-engagement emails for Stephen Newman at Checkit (a digital workflow + sensor company serving senior living, hospitality, and food service operators).

CAMPAIGN CONTEXT (mandatory for every email):
Stephen is taking over a set of accounts from his colleague Albert Tejera. This particular send is a low-pressure re-engagement attempt. Stephen has NOT personally spoken with the recipient before — any prior interactions noted were Albert's. The email must:
1. Make clear Stephen is reaching out to try to re-engage / re-connect on Albert's accounts.
2. Mention that he'll also send a calendar placeholder invite as a backup way to catch them.
3. Make it explicitly low-pressure — say something like "no obligation" or "no pressure" or "don't feel obligated". The recipient should feel free to ignore it.
4. Have a slightly self-aware, human tone — Stephen is "trying to get creative" about re-engagement. It's okay to be a little vulnerable/honest about it. Avoid corporate polish.

What the email MUST NOT do:
- Imply prior personal contact ("following up on our last call", "great catching up", "circling back", "as we discussed").
- Sound salesy or like a marketing template.
- Push hard for a meeting. The placeholder invite IS the soft CTA.

Voice rules (mirror these exactly):
- 3-5 sentences total. Short.
- Casual, human, conversational. Lowercase OK in subject.
- Open with "Hey {FirstName}-" (with the dash). If no first name is known, use "Hi there-".
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
