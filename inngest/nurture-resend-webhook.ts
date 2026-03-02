import { inngest } from '@/lib/inngest';
import {
  initializeNurtureTables,
  getSendByResendId,
  createNurtureEvent,
  updateEnrollmentStatus,
  addToSuppression,
  getEnrollment,
} from '@/lib/nurture-db';

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

      if (eventType === 'bounced') {
        const enrollment = await getEnrollment(send.enrollment_id);
        if (enrollment) {
          await updateEnrollmentStatus(enrollment.id, 'bounced');
          await addToSuppression(enrollment.contact_email, 'bounced');
        }
        return { processed: true, action: 'bounced — enrollment paused, added to suppression' };
      }

      if (eventType === 'complained') {
        const enrollment = await getEnrollment(send.enrollment_id);
        if (enrollment) {
          await updateEnrollmentStatus(enrollment.id, 'unsubscribed');
          await addToSuppression(enrollment.contact_email, 'complained');
        }
        return { processed: true, action: 'complained — enrollment stopped, added to suppression' };
      }

      return { processed: true, eventType };
    });

    return result;
  }
);
