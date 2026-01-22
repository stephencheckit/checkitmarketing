import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { 
  createCluster, 
  getClusterWithContributions,
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

// POST /api/contributions/cluster - Create a cluster from multiple contributions
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, summary, contributionIds } = body;

    // Validate required fields
    if (!summary || !contributionIds || !Array.isArray(contributionIds) || contributionIds.length < 2) {
      return NextResponse.json(
        { error: 'Missing required fields. Need: summary, contributionIds (array with at least 2 IDs)' },
        { status: 400 }
      );
    }

    const cluster = await createCluster({
      name: name || undefined,
      summary,
      contributionIds,
      createdBy: session.userId
    });

    // Get the cluster with its contributions for the response
    const fullCluster = await getClusterWithContributions(cluster.id);

    return NextResponse.json({ 
      cluster: fullCluster,
      message: `Created cluster with ${contributionIds.length} contributions`
    });
  } catch (error) {
    console.error('Error creating cluster:', error);
    return NextResponse.json({ error: 'Failed to create cluster' }, { status: 500 });
  }
}
