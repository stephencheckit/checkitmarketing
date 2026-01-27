import { NextRequest, NextResponse } from 'next/server';
import { getDemoRequestById, updateDemoRequest } from '@/lib/db';

// GET /api/demo-request/[id] - Get a single demo request
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const demoRequest = await getDemoRequestById(parseInt(id));
    
    if (!demoRequest) {
      return NextResponse.json({ error: 'Demo request not found' }, { status: 404 });
    }

    return NextResponse.json({ request: demoRequest });
  } catch (error) {
    console.error('Error fetching demo request:', error);
    return NextResponse.json({ error: 'Failed to fetch demo request' }, { status: 500 });
  }
}

// PATCH /api/demo-request/[id] - Update a demo request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, notes, assignedTo } = body;

    const updated = await updateDemoRequest(parseInt(id), {
      status,
      notes,
      assignedTo,
      followedUpAt: status === 'contacted' ? new Date() : undefined,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Demo request not found' }, { status: 404 });
    }

    return NextResponse.json({ request: updated });
  } catch (error) {
    console.error('Error updating demo request:', error);
    return NextResponse.json({ error: 'Failed to update demo request' }, { status: 500 });
  }
}
