import { inngest } from '@/lib/inngest';
import { Resend } from 'resend';
import {
  initializeNurtureTables,
  getSendByResendId,
  createNurtureEvent,
  updateEnrollmentStatus,
  addToSuppression,
  getEnrollment,
  getEventsForEnrollment,
} from '@/lib/nurture-db';

const FROM_EMAIL = 'Checkit <noreply@checkitv6.com>';

export const nurturResendWebhook = inngest.createFunction(
  { id: 'nurture-resend-webhook', retries: 2 },
  [
    { event: 'resend/email.delivered' },
    { event: 'resend/email.opened' },
    { event: 'resend/email.clicked' },
    { event: 'resend/email.bounced' },
    { event: 'resend/email.complained' },
  ],
  async ({ event, step }) => {
    await step.run('init-tables', async () => {
      await initializeNurtureTables();
    });

    const result = await step.run('process-event', async () => {
      const eventName = event.name;
      const eventType = eventName.replace('resend/email.', '');
      const data = event.data || {};

      const emailId = data.email_id || data.data?.email_id;
      if (!emailId) {
        return { skipped: true, reason: 'No email_id in event' };
      }

      const send = await getSendByResendId(emailId);
      if (!send) {
        return { skipped: true, reason: 'Send not found — may not be a nurture email' };
      }

      const clickedUrl = data.click?.link || data.data?.click?.link || undefined;

      await createNurtureEvent(send.id, emailId, eventType, clickedUrl);

      const enrollment = await getEnrollment(send.enrollment_id);

      if (eventType === 'bounced') {
        if (enrollment) {
          await updateEnrollmentStatus(enrollment.id, 'bounced');
          await addToSuppression(enrollment.contact_email, 'bounced');
        }
        return { processed: true, action: 'bounced — enrollment paused, added to suppression' };
      }

      if (eventType === 'complained') {
        if (enrollment) {
          await updateEnrollmentStatus(enrollment.id, 'unsubscribed');
          await addToSuppression(enrollment.contact_email, 'complained');
        }
        return { processed: true, action: 'complained — enrollment stopped, added to suppression' };
      }

      if ((eventType === 'opened' || eventType === 'clicked') && enrollment?.enrolled_by_email) {
        const recentEvents = await getEventsForEnrollment(enrollment.id);
        const sameTypeForSameSend = recentEvents.filter(
          (e) => e.send_id === send.id && e.event_type === eventType
        );
        if (sameTypeForSameSend.length <= 1) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const action = eventType === 'opened' ? 'opened' : 'clicked a link in';
            const subject = `${enrollment.contact_name} just ${action} your email`;
            const body = `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
  <p style="color: #374151; font-size: 15px; line-height: 1.7;">
    <strong>${enrollment.contact_name}</strong>${enrollment.company_name ? ` from ${enrollment.company_name}` : ''} just <strong>${action}</strong> the email:<br/>
    <em>"${send.subject_sent || 'Nurture email'}"</em>
  </p>
  ${clickedUrl ? `<p style="color: #6b7280; font-size: 13px;">Link clicked: <a href="${clickedUrl}" style="color: #2563eb;">${clickedUrl}</a></p>` : ''}
  <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">This is a good time to follow up.</p>
</div>`;
            await resend.emails.send({
              from: FROM_EMAIL,
              to: enrollment.enrolled_by_email,
              subject,
              html: body,
            });
          } catch (notifyError) {
            console.error('Failed to send rep notification:', notifyError);
          }
        }
      }

      return { processed: true, eventType };
    });

    return result;
  }
);
