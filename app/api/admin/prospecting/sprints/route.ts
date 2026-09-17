import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  initializeProspectingTables,
  createProspectingSprint,
  getProspectingSprints,
} from '@/lib/db';
import { getLabels } from '@/lib/apollo';

// GET /api/admin/prospecting/sprints
// Existing sprints, plus the Apollo account lists available to build one from.
export async function GET() {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await initializeProspectingTables();

    const [sprints, labels] = await Promise.all([getProspectingSprints(), getLabels()]);

    return NextResponse.json({
      sprints,
      accountLists: labels.filter((l) => l.modality === 'accounts'),
    });
  } catch (error) {
    console.error('Error fetching prospecting sprints:', error);
    return NextResponse.json({ error: 'Failed to fetch sprints' }, { status: 500 });
  }
}

// POST /api/admin/prospecting/sprints
// Registers an Apollo account list as a tracked sprint. The nightly snapshot
// picks it up from here; no accounts are copied at create time.
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { name, apolloLabelId, startsOn, endsOn } = body;

    if (!name || !apolloLabelId || !startsOn || !endsOn) {
      return NextResponse.json(
        { error: 'name, apolloLabelId, startsOn and endsOn are required' },
        { status: 400 }
      );
    }

    if (endsOn < startsOn) {
      return NextResponse.json({ error: 'endsOn must be on or after startsOn' }, { status: 400 });
    }

    await initializeProspectingTables();

    const labels = await getLabels();
    const label = labels.find((l) => l.id === apolloLabelId);
    if (!label) {
      return NextResponse.json({ error: 'Apollo list not found' }, { status: 404 });
    }
    if (label.modality !== 'accounts') {
      return NextResponse.json(
        { error: `"${label.name}" is a ${label.modality} list — an account list is required` },
        { status: 400 }
      );
    }

    const sprint = await createProspectingSprint({
      name,
      apolloLabelId,
      apolloLabelName: label.name,
      startsOn,
      endsOn,
    });

    return NextResponse.json({ sprint, accountsInList: label.cachedCount });
  } catch (error) {
    console.error('Error creating prospecting sprint:', error);
    return NextResponse.json({ error: 'Failed to create sprint' }, { status: 500 });
  }
}
