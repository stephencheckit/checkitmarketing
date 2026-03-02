import { inngest } from '@/lib/inngest';
import { Resend } from 'resend';
import {
  initializeNurtureTables,
  getNurtureSetting,
  getRecapData,
} from '@/lib/nurture-db';

export const nurtureDailyRecap = inngest.createFunction(
  { id: 'nurture-daily-recap', retries: 1 },
  { cron: '0 22 * * *' }, // 5 PM EST
  async ({ step }) => {
    await step.run('init-tables', async () => {
      await initializeNurtureTables();
    });

    const recipients = await step.run('get-recipients', async () => {
      const val = await getNurtureSetting('recap_recipients');
      return val || 'stephen.newman@checkit.net';
    });

    const recap = await step.run('gather-data', async () => {
      return await getRecapData();
    });

    const hasActivity = recap.emailsSent > 0
      || recap.newEnrollments > 0
      || recap.completed > 0
      || Object.keys(recap.events).length > 0;

    if (!hasActivity) {
      return { skipped: true, reason: 'No activity in last 24 hours' };
    }

    await step.run('send-recap', async () => {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) return { skipped: true, reason: 'No RESEND_API_KEY' };

      const resend = new Resend(resendApiKey);
      const globalPause = await getNurtureSetting('global_pause');

      const topEngagedRows = (recap.topEngaged || []).map((c: Record<string, any>) =>
        `<tr>
          <td style="padding: 6px 12px; border-bottom: 1px solid #e5e7eb;">${c.contact_name}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #e5e7eb;">${c.company_name || '—'}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${c.opens}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${c.clicks}</td>
        </tr>`
      ).join('');

      const issueRows = (recap.issues || []).map((i: Record<string, any>) =>
        `<tr>
          <td style="padding: 6px 12px; border-bottom: 1px solid #e5e7eb;">${i.contact_name}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #e5e7eb;">${i.company_name || '—'}</td>
          <td style="padding: 6px 12px; border-bottom: 1px solid #e5e7eb; color: #ef4444;">${i.event_type}</td>
        </tr>`
      ).join('');

      const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%); padding: 24px; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">Nurture Engine — Daily Recap</h1>
    <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0 0; font-size: 13px;">
      ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
  </div>

  ${globalPause === 'true' ? `
  <div style="background: #fef3c7; padding: 12px 24px; border-left: 4px solid #f59e0b;">
    <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">All sends are currently PAUSED</p>
  </div>
  ` : ''}

  <div style="padding: 24px; background: #ffffff;">
    <table style="width: 100%; margin-bottom: 24px;">
      <tr>
        <td style="text-align: center; padding: 12px;">
          <div style="font-size: 28px; font-weight: bold; color: #1e3a5f;">${recap.emailsSent}</div>
          <div style="font-size: 12px; color: #6b7280;">Emails Sent</div>
        </td>
        <td style="text-align: center; padding: 12px;">
          <div style="font-size: 28px; font-weight: bold; color: #1e3a5f;">${recap.events.opened || 0}</div>
          <div style="font-size: 12px; color: #6b7280;">Opens</div>
        </td>
        <td style="text-align: center; padding: 12px;">
          <div style="font-size: 28px; font-weight: bold; color: #2563eb;">${recap.events.clicked || 0}</div>
          <div style="font-size: 12px; color: #6b7280;">Clicks</div>
        </td>
        <td style="text-align: center; padding: 12px;">
          <div style="font-size: 28px; font-weight: bold; color: #1e3a5f;">${recap.activeEnrollments}</div>
          <div style="font-size: 12px; color: #6b7280;">Active</div>
        </td>
      </tr>
    </table>

    <table style="width: 100%; margin-bottom: 16px;">
      <tr>
        <td style="padding: 4px 0; color: #6b7280; font-size: 13px;">New enrollments (24h)</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #111827; font-size: 13px;">${recap.newEnrollments}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #6b7280; font-size: 13px;">Completed sequences (24h)</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #111827; font-size: 13px;">${recap.completed}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #6b7280; font-size: 13px;">Bounces (24h)</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 600; color: ${(recap.events.bounced || 0) > 0 ? '#ef4444' : '#111827'}; font-size: 13px;">${recap.events.bounced || 0}</td>
      </tr>
      <tr>
        <td style="padding: 4px 0; color: #6b7280; font-size: 13px;">Complaints (24h)</td>
        <td style="padding: 4px 0; text-align: right; font-weight: 600; color: ${(recap.events.complained || 0) > 0 ? '#ef4444' : '#111827'}; font-size: 13px;">${recap.events.complained || 0}</td>
      </tr>
    </table>

    ${topEngagedRows ? `
    <h3 style="font-size: 14px; color: #1e3a5f; margin: 24px 0 8px 0;">Most Engaged Contacts</h3>
    <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
      <tr style="background: #f9fafb;">
        <th style="padding: 6px 12px; text-align: left; color: #6b7280; font-weight: 600;">Name</th>
        <th style="padding: 6px 12px; text-align: left; color: #6b7280; font-weight: 600;">Company</th>
        <th style="padding: 6px 12px; text-align: center; color: #6b7280; font-weight: 600;">Opens</th>
        <th style="padding: 6px 12px; text-align: center; color: #6b7280; font-weight: 600;">Clicks</th>
      </tr>
      ${topEngagedRows}
    </table>
    ` : ''}

    ${issueRows ? `
    <h3 style="font-size: 14px; color: #ef4444; margin: 24px 0 8px 0;">Issues</h3>
    <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
      <tr style="background: #fef2f2;">
        <th style="padding: 6px 12px; text-align: left; color: #6b7280; font-weight: 600;">Name</th>
        <th style="padding: 6px 12px; text-align: left; color: #6b7280; font-weight: 600;">Company</th>
        <th style="padding: 6px 12px; text-align: left; color: #6b7280; font-weight: 600;">Issue</th>
      </tr>
      ${issueRows}
    </table>
    ` : ''}
  </div>

  <div style="padding: 16px 24px; background: #f3f4f6; border-radius: 0 0 8px 8px; text-align: center;">
    <p style="color: #6b7280; font-size: 12px; margin: 0;">
      Nurture Engine Daily Recap — Checkit GTM Tracker
    </p>
  </div>
</div>`;

      const recipientList = recipients.split(',').map((r: string) => r.trim()).filter(Boolean);

      await resend.emails.send({
        from: 'Checkit GTM <noreply@checkitv6.com>',
        to: recipientList,
        subject: `Nurture Recap: ${recap.emailsSent} sent, ${recap.events.clicked || 0} clicks — ${new Date().toLocaleDateString()}`,
        html,
        text: `Nurture Engine Daily Recap\n\nEmails Sent: ${recap.emailsSent}\nOpens: ${recap.events.opened || 0}\nClicks: ${recap.events.clicked || 0}\nActive Enrollments: ${recap.activeEnrollments}\nNew Enrollments: ${recap.newEnrollments}\nCompleted: ${recap.completed}\nBounces: ${recap.events.bounced || 0}\nComplaints: ${recap.events.complained || 0}`,
      });

      return { sent: true, recipients: recipientList };
    });

    return { success: true };
  }
);
