import { inngest } from '@/lib/inngest';
import { Resend } from 'resend';
import OpenAI from 'openai';
import {
  initializeNurtureTables,
  getNurtureSetting,
  getDueEnrollments,
  getStep,
  getNurtureContent,
  createNurtureSend,
  advanceEnrollmentStep,
  getTrackSteps,
  generateUnsubscribeToken,
} from '@/lib/nurture-db';
import { seedDefaultTrack, seedDefaultContent } from '@/lib/nurture-seed';

const PHYSICAL_ADDRESS = 'Checkit HQ - 385 Mariner Blvd. Spring Hill, FL 34609';
const FROM_EMAIL = 'Checkit <noreply@checkitv6.com>';

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://checkitv6.com';
}

export const nurtureDailySend = inngest.createFunction(
  { id: 'nurture-daily-send', retries: 1 },
  { cron: '0 14 * * *' }, // 9 AM EST
  async ({ step }) => {
    await step.run('init-tables', async () => {
      await initializeNurtureTables();
      await seedDefaultTrack();
      await seedDefaultContent();
    });

    const globalPause = await step.run('check-pause', async () => {
      return await getNurtureSetting('global_pause');
    });

    if (globalPause === 'true') {
      return { skipped: true, reason: 'Global pause is active' };
    }

    const sendCap = await step.run('get-cap', async () => {
      const cap = await getNurtureSetting('daily_send_cap');
      return parseInt(cap || '50');
    });

    const dueEnrollments = await step.run('get-due', async () => {
      return await getDueEnrollments(sendCap);
    });

    if (dueEnrollments.length === 0) {
      return { sent: 0, reason: 'No enrollments due' };
    }

    let sentCount = 0;
    const errors: string[] = [];

    for (const enrollment of dueEnrollments) {
      const result = await step.run(`send-${enrollment.id}`, async () => {
        try {
          const currentStep = enrollment.current_step;
          const stepData = await getStep(enrollment.track_id, currentStep);
          if (!stepData) {
            return { error: `Step ${currentStep} not found for track ${enrollment.track_id}` };
          }

          const allSteps = await getTrackSteps(enrollment.track_id);
          const nextStepData = allSteps.find((s) => s.step_number === currentStep + 1);

          // Fetch relevant content
          const contentTags = stepData.content_tags as string[] || [];
          let contentItems = await getNurtureContent({
            vertical: enrollment.vertical || undefined,
          });
          if (contentTags.length > 0) {
            contentItems = contentItems.filter((c) => {
              const cTopics = c.topic_tags as string[];
              return contentTags.some((tag) => cTopics.includes(tag));
            });
          }
          const contentBlock = contentItems.slice(0, 3).map((c) =>
            `- ${c.title}: ${c.description || ''}\n  ${c.url}`
          ).join('\n') || 'Visit checkitv6.com to learn more about our platform.';

          // Personalize via GPT
          const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

          const senderName = enrollment.enrolled_by_email
            ? enrollment.enrolled_by_email.split('@')[0].split('.').map((p: string) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
            : 'The Checkit Team';

          const prompt = `You are writing a professional marketing email for Checkit, an operational compliance and automated monitoring platform.

Personalize this email template for the recipient. Keep the tone warm, professional, and consultative — not pushy. Replace template variables with appropriate content.

RECIPIENT:
- Name: ${enrollment.contact_name}
- Company: ${enrollment.company_name || 'their organization'}
- Vertical: ${enrollment.vertical || 'operations'}
- Loss reason: ${enrollment.loss_reason || 'unknown'}
- Account context from the sales rep: ${enrollment.account_context || 'No additional context provided.'}

TEMPLATE SUBJECT: ${stepData.subject_template}

TEMPLATE BODY:
${stepData.body_template}

CONTENT TO REFERENCE (pick the most relevant):
${contentBlock}

SENDER NAME: ${senderName}

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

          const personalizedSubject = subjectMatch?.[1]?.trim() || stepData.subject_template.replace('{{contact_name}}', enrollment.contact_name);
          const personalizedBody = bodyMatch?.[1]?.trim() || stepData.body_template;

          // Generate unsubscribe link
          const token = generateUnsubscribeToken(enrollment.id, enrollment.contact_email);
          const baseUrl = getBaseUrl();
          const unsubscribeUrl = `${baseUrl}/api/nurture/unsubscribe?token=${token}`;

          // Build HTML email
          const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="padding: 32px; background: #ffffff;">
    ${personalizedBody.split('\n').map((line: string) =>
      line.trim()
        ? `<p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 12px 0;">${line}</p>`
        : ''
    ).join('')}
  </div>
  <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #e5e7eb;">
    <p style="color: #9ca3af; font-size: 11px; line-height: 1.5; margin: 0;">
      ${PHYSICAL_ADDRESS}<br/>
      <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe</a> from these emails.
    </p>
  </div>
</div>`;

          // Send via Resend
          const resend = new Resend(process.env.RESEND_API_KEY);
          const replyTo = enrollment.enrolled_by_email || undefined;

          const sendResult = await resend.emails.send({
            from: FROM_EMAIL,
            to: enrollment.contact_email,
            replyTo,
            subject: personalizedSubject,
            html: htmlBody,
            text: personalizedBody + `\n\n---\n${PHYSICAL_ADDRESS}\nUnsubscribe: ${unsubscribeUrl}`,
            headers: {
              'List-Unsubscribe': `<${unsubscribeUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          });

          const messageId = sendResult.data?.id || '';

          // Record the send
          await createNurtureSend(
            enrollment.id,
            stepData.id,
            messageId,
            personalizedSubject,
            personalizedBody
          );

          // Advance to next step
          if (nextStepData) {
            const nextSendAt = new Date();
            nextSendAt.setDate(nextSendAt.getDate() + (nextStepData.delay_days - stepData.delay_days));
            await advanceEnrollmentStep(enrollment.id, nextSendAt.toISOString());
          } else {
            await advanceEnrollmentStep(enrollment.id, null);
          }

          return { success: true, messageId };
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          return { error: message };
        }
      });

      if ('error' in result && result.error) {
        errors.push(`Enrollment ${enrollment.id}: ${result.error}`);
      } else {
        sentCount++;
      }
    }

    return { sent: sentCount, errors, total: dueEnrollments.length };
  }
);
