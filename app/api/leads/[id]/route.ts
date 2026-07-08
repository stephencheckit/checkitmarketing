import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getLeadDetail, updateLeadTriageState, type LeadStatus } from '@/lib/db';

// GET /api/leads/[id] - single lead with all of its submissions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const detail = await getLeadDetail(parseInt(id, 10));
    if (!detail) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json(detail);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

// PATCH /api/leads/[id] - update triage state (status / notes / owner)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updates: {
      status?: LeadStatus;
      notes?: string;
      ownerId?: number | null;
      followedUpAt?: Date;
    } = {};

    if ('status' in body) updates.status = body.status;
    if ('notes' in body) updates.notes = body.notes;
    if ('ownerId' in body) {
      updates.ownerId = body.ownerId === null ? null : Number(body.ownerId);
    }
    // Stamp first follow-up time when a lead is first marked contacted.
    if (body.status === 'contacted') updates.followedUpAt = new Date();

    const updated = await updateLeadTriageState(parseInt(id, 10), updates);
    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ lead: updated });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
