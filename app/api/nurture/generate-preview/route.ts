import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  initializeNurtureTables,
  getEnrollment,
  getTrackSteps,
  getNurtureContent,
} from '@/lib/nurture-db';
import { seedDefaultTrack, seedDefaultContent } from '@/lib/nurture-seed';

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
    const { enrollmentId, stepNumber } = body;

    if (!enrollmentId || !stepNumber) {
      return NextResponse.json({ error: 'enrollmentId and stepNumber are required' }, { status: 400 });
    }

    const enrollment = await getEnrollment(enrollmentId);
    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    const steps = await getTrackSteps(enrollment.track_id);
    const stepData = steps.find((s) => s.step_number === stepNumber);
    if (!stepData) {
      return NextResponse.json({ error: `Step ${stepNumber} not found` }, { status: 404 });
    }

    const contentTags = (stepData.content_tags as string[]) || [];
    let contentItems = await getNurtureContent({
      vertical: enrollment.vertical || undefined,
    });
    if (contentTags.length > 0) {
      const tagged = contentItems.filter((c) => {
        const cTopics = c.topic_tags as string[];
        return contentTags.some((tag) => cTopics.includes(tag));
      });
      if (tagged.length > 0) contentItems = tagged;
    }
    const contentBlock =
      contentItems
        .slice(0, 3)
        .map((c) => `- ${c.title}: ${c.description || ''}\n  ${c.url}`)
        .join('\n') || '- Checkit Platform Overview\n  https://checkitv6.com/platform';

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are writing a marketing email for Checkit, an operational compliance and automated monitoring platform.

This is a marketing-style email (not a 1-to-1 sales email). Keep the tone professional, informative, and value-driven — like a company newsletter or product update.

RECIPIENT:
- Name: ${enrollment.contact_name}
- Company: ${enrollment.company_name || 'their organization'}
- Vertical: ${enrollment.vertical || 'operations'}${enrollment.persona_type ? `\n- Role level: ${enrollment.persona_type}` : ''}${enrollment.persona_function ? `\n- Function: ${enrollment.persona_function}` : ''}
- Account context: ${enrollment.account_context || 'No additional context provided.'}

TEMPLATE SUBJECT: ${stepData.subject_template}

TEMPLATE BODY:
${stepData.body_template}

CONTENT TO REFERENCE (pick the most relevant):
${contentBlock}

Instructions:
- Replace {{contact_name}} with the recipient's first name
- Replace {{company_name}} with the company name
- Replace {{vertical}} with a natural industry name (e.g., "senior living" not "senior-living")
- Replace {{personalized_context}} with 1-2 sentences weaving in the account context naturally
- Replace {{content_block}} with a brief reference to the most relevant content piece(s)
- For links, put the URL on its own line like: https://example.com — do NOT use markdown link syntax like [text](url)
${enrollment.persona_type ? `- Tailor language for a ${enrollment.persona_type}-level reader (${enrollment.persona_type === 'exec' ? 'strategic, high-level, ROI-focused' : enrollment.persona_type === 'vp' ? 'strategic but with operational detail' : enrollment.persona_type === 'director' ? 'balanced strategic and tactical' : 'practical, tactical, implementation-focused'})` : '- Keep the marketing tone — informative, not salesy'}
${enrollment.persona_function ? `- Focus content on ${enrollment.persona_function.replace('_', ' ')} concerns and priorities` : ''}
- Keep the email under 250 words
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
      stepData.subject_template
        .replace(/\{\{contact_name\}\}/g, enrollment.contact_name)
        .replace(/\{\{company_name\}\}/g, enrollment.company_name || 'your organization')
        .replace(/\{\{vertical\}\}/g, enrollment.vertical?.replace('-', ' ') || 'your industry');

    const personalizedBody = bodyMatch?.[1]?.trim() || stepData.body_template;

    return NextResponse.json({
      subject: personalizedSubject,
      body: personalizedBody,
      stepNumber,
    });
  } catch (error) {
    console.error('Error generating preview:', error);
    return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
  }
}
