import { inngest } from '@/lib/inngest';
import { sql } from '@/lib/db';

export const nurturContactEnrolled = inngest.createFunction(
  { id: 'nurture-contact-enrolled' },
  { event: 'nurture/contact.enrolled' },
  async ({ event }) => {
    const { enrollmentId } = event.data;

    const enrollment = await sql`
      SELECT e.*, s.delay_days
      FROM nurture_enrollments e
      JOIN nurture_steps s ON s.track_id = e.track_id AND s.step_number = 1
      WHERE e.id = ${enrollmentId}
    `;

    if (!enrollment[0]) return { error: 'Enrollment not found' };

    const suppressed = await sql`
      SELECT id FROM nurture_suppression WHERE email = ${enrollment[0].contact_email}
    `;
    if (suppressed.length > 0) {
      await sql`UPDATE nurture_enrollments SET status = 'removed' WHERE id = ${enrollmentId}`;
      return { error: 'Contact is on suppression list' };
    }

    const nextSendAt = new Date();
    nextSendAt.setDate(nextSendAt.getDate() + enrollment[0].delay_days);

    await sql`
      UPDATE nurture_enrollments
      SET next_send_at = ${nextSendAt.toISOString()}, current_step = 1
      WHERE id = ${enrollmentId}
    `;

    return { success: true, nextSendAt };
  }
);
