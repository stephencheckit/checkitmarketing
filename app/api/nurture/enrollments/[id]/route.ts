import { NextRequest, NextResponse } from 'next/server';
import {
  initializeNurtureTables,
  getEnrollmentDetail,
  updateEnrollmentStatus,
  addToSuppression,
  getTrackSteps,
} from '@/lib/nurture-db';

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    await initializeNurtureTables();
    initialized = true;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureInitialized();
    const { id } = await params;
    const detail = await getEnrollmentDetail(parseInt(id));
    if (!detail) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }
    const steps = await getTrackSteps(detail.enrollment.track_id);
    return NextResponse.json({ ...detail, steps });
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollment' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureInitialized();
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['active', 'paused', 'removed', 'unsubscribed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const updated = await updateEnrollmentStatus(parseInt(id), status);
    if (!updated) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    if (status === 'unsubscribed' || status === 'removed') {
      await addToSuppression(updated.contact_email, status);
    }

    return NextResponse.json({ success: true, enrollment: updated });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 });
  }
}
