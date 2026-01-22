import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { 
  createCitation,
  getCitationsForVersion,
  getCitationsForSection,
  initializeContributionsTables,
  type TargetType
} from '@/lib/db';

// Initialize tables on first request
let tablesInitialized = false;

async function ensureTables() {
  if (!tablesInitialized) {
    await initializeContributionsTables();
    tablesInitialized = true;
  }
}

// GET /api/citations - Get citations for a version
// Query params: versionType, versionId, sectionId (optional)
export async function GET(request: NextRequest) {
  try {
    await ensureTables();
    
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const versionType = searchParams.get('versionType') as TargetType;
    const versionId = searchParams.get('versionId');
    const sectionId = searchParams.get('sectionId');

    if (!versionType || !versionId) {
      return NextResponse.json(
        { error: 'Missing required params: versionType, versionId' },
        { status: 400 }
      );
    }

    const versionIdNum = parseInt(versionId);
    if (isNaN(versionIdNum)) {
      return NextResponse.json({ error: 'Invalid versionId' }, { status: 400 });
    }

    let citations;
    if (sectionId) {
      citations = await getCitationsForSection(versionType, versionIdNum, sectionId);
    } else {
      citations = await getCitationsForVersion(versionType, versionIdNum);
    }

    // Format citations for display (handle anonymity)
    const formattedCitations = citations.map((c) => ({
      id: c.id,
      contributionId: c.contribution_id,
      clusterId: c.cluster_id,
      contributorName: c.is_anonymous ? null : c.contributor_name,
      isAnonymous: c.is_anonymous,
      content: c.contribution_content || c.cluster_summary,
      clusterName: c.cluster_name,
      createdAt: c.created_at
    }));

    return NextResponse.json({ citations: formattedCitations });
  } catch (error) {
    console.error('Error fetching citations:', error);
    return NextResponse.json({ error: 'Failed to fetch citations' }, { status: 500 });
  }
}

// POST /api/citations - Create a citation (admin only)
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
    const { contributionId, clusterId, versionType, versionId, sectionId } = body;

    // Validate required fields
    if (!versionType || !versionId) {
      return NextResponse.json(
        { error: 'Missing required fields: versionType, versionId' },
        { status: 400 }
      );
    }

    // Must have either contributionId or clusterId
    if (!contributionId && !clusterId) {
      return NextResponse.json(
        { error: 'Must provide either contributionId or clusterId' },
        { status: 400 }
      );
    }

    const citation = await createCitation({
      contributionId: contributionId || undefined,
      clusterId: clusterId || undefined,
      versionType,
      versionId,
      sectionId: sectionId || undefined
    });

    return NextResponse.json({ 
      citation,
      message: 'Citation created'
    });
  } catch (error) {
    console.error('Error creating citation:', error);
    return NextResponse.json({ error: 'Failed to create citation' }, { status: 500 });
  }
}
