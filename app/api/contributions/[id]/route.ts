import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { 
  getContribution, 
  reviewContribution, 
  deleteContribution,
  initializeContributionsTables
} from '@/lib/db';

// Initialize tables on first request
let tablesInitialized = false;

async function ensureTables() {
  if (!tablesInitialized) {
    await initializeContributionsTables();
    tablesInitialized = true;
  }
}

// GET /api/contributions/[id] - Get a single contribution
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contributionId = parseInt(id);
    if (isNaN(contributionId)) {
      return NextResponse.json({ error: 'Invalid contribution ID' }, { status: 400 });
    }

    const contribution = await getContribution(contributionId);
    if (!contribution) {
      return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
    }

    // Users can only see their own contributions, admins can see all
    if (session.role !== 'admin' && contribution.user_id !== session.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ contribution });
  } catch (error) {
    console.error('Error fetching contribution:', error);
    return NextResponse.json({ error: 'Failed to fetch contribution' }, { status: 500 });
  }
}

// PATCH /api/contributions/[id] - Review a contribution (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin only
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const contributionId = parseInt(id);
    if (isNaN(contributionId)) {
      return NextResponse.json({ error: 'Invalid contribution ID' }, { status: 400 });
    }

    const body = await request.json();
    const { status, reviewNotes } = body;

    // Validate status
    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: approved or rejected' },
        { status: 400 }
      );
    }

    const contribution = await reviewContribution(
      contributionId,
      session.userId,
      status,
      reviewNotes
    );

    if (!contribution) {
      return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      contribution,
      message: `Contribution ${status}`
    });
  } catch (error) {
    console.error('Error reviewing contribution:', error);
    return NextResponse.json({ error: 'Failed to review contribution' }, { status: 500 });
  }
}

// DELETE /api/contributions/[id] - Delete a contribution (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin only
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const contributionId = parseInt(id);
    if (isNaN(contributionId)) {
      return NextResponse.json({ error: 'Invalid contribution ID' }, { status: 400 });
    }

    await deleteContribution(contributionId);

    return NextResponse.json({ message: 'Contribution deleted' });
  } catch (error) {
    console.error('Error deleting contribution:', error);
    return NextResponse.json({ error: 'Failed to delete contribution' }, { status: 500 });
  }
}
