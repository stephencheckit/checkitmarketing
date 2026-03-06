import { inngest } from '@/lib/inngest';
import { sql } from '@/lib/db';

export const nurturContactEnrolled = inngest.createFunction(
  { id: 'nurture-contact-enrolled' },
  { event: 'nurture/contact.enrolled' },
  async ({ event }) => {
    const { enrollmentId, sendNow } = event.data;

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

    if (sendNow) {
      await inngest.send({
        name: 'nurture/immediate-send',
        data: { enrollmentId },
      });
      return { success: true, immediate: true };
    }

    return { success: true };
  }
);
