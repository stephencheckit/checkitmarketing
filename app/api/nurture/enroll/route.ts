import { NextRequest, NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest';
import { sql } from '@/lib/db';
import {
  initializeNurtureTables,
  enrollContact,
  checkDuplicateEnrollment,
  isEmailSuppressed,
  getNurtureTracks,
  getNurtureSetting,
  getTrackSteps,
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

    const globalPause = await getNurtureSetting('global_pause');
    if (globalPause === 'true') {
      return NextResponse.json(
        { error: 'Nurture system is currently paused. Contact an admin to resume.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { contactName, contactEmail, companyName, vertical, accountContext, lossReason, trackId, enrolledByEmail, startDate } = body;

    if (!contactName || !contactEmail) {
      return NextResponse.json({ error: 'Contact name and email are required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const suppressed = await isEmailSuppressed(contactEmail);
    if (suppressed) {
      return NextResponse.json(
        { error: 'This email is on the suppression list (previously unsubscribed or bounced). Cannot enroll.' },
        { status: 409 }
      );
    }

    // Resolve track — use provided or default to first active track
    let resolvedTrackId = trackId;
    if (!resolvedTrackId) {
      const tracks = await getNurtureTracks();
      const active = tracks.find((t) => t.status === 'active');
      if (!active) {
        return NextResponse.json({ error: 'No active nurture track found' }, { status: 404 });
      }
      resolvedTrackId = active.id;
    }

    const duplicate = await checkDuplicateEnrollment(contactEmail, resolvedTrackId);
    if (duplicate) {
      return NextResponse.json(
        { error: 'This contact is already enrolled in this track', existing: duplicate },
        { status: 409 }
      );
    }

    const enrollment = await enrollContact({
      trackId: resolvedTrackId,
      contactEmail,
      contactName,
      companyName,
      vertical,
      accountContext,
      lossReason,
      enrolledByEmail,
    });

    const steps = await getTrackSteps(resolvedTrackId);
    const firstStep = steps.find((s) => s.step_number === 1);
    if (firstStep) {
      const baseDate = startDate ? new Date(startDate) : new Date();
      const nextSendAt = new Date(baseDate);
      nextSendAt.setDate(nextSendAt.getDate() + firstStep.delay_days);
      await sql`
        UPDATE nurture_enrollments
        SET current_step = 1, next_send_at = ${nextSendAt.toISOString()}
        WHERE id = ${enrollment.id}
      `;
      enrollment.current_step = 1;
      enrollment.next_send_at = nextSendAt.toISOString();
    }

    await inngest.send({
      name: 'nurture/contact.enrolled',
      data: { enrollmentId: enrollment.id },
    });

    return NextResponse.json({ success: true, enrollment });
  } catch (error) {
    console.error('Error enrolling contact:', error);
    return NextResponse.json({ error: 'Failed to enroll contact' }, { status: 500 });
  }
}
