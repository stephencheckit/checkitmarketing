import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { 
  createContribution, 
  getPendingContributions, 
  getUserContributions,
  getAllContributions,
  initializeContributionsTables,
  type TargetType,
  type ContributionType,
  type ContributionStatus
} from '@/lib/db';

// Initialize tables on first request
let tablesInitialized = false;

async function ensureTables() {
  if (!tablesInitialized) {
    await initializeContributionsTables();
    tablesInitialized = true;
  }
}

// GET /api/contributions - List contributions
// Query params: view=my|pending|all|approved-for-target, targetType, status
export async function GET(request: NextRequest) {
  try {
    await ensureTables();
    
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'my';
    const targetType = searchParams.get('targetType') as TargetType | null;
    const status = searchParams.get('status') as ContributionStatus | null;

    let contributions;

    if (view === 'my') {
      // User's own contributions
      contributions = await getUserContributions(session.userId);
    } else if (view === 'pending') {
      // Pending contributions for review
      // Note: Role check removed to match admin page behavior
      contributions = await getPendingContributions();
    } else if (view === 'approved-for-target') {
      // Get approved/auto-published contributions for a specific target type
      // This helps show what intel has been contributed for positioning/competitors/content
      if (!targetType) {
        return NextResponse.json({ error: 'targetType required for approved-for-target view' }, { status: 400 });
      }
      contributions = await getAllContributions({
        targetType,
        status: 'approved'
      });
      // Also get auto-published ones
      const autoPublished = await getAllContributions({
        targetType,
        status: 'auto_published'
      });
      contributions = [...contributions, ...autoPublished];
    } else if (view === 'all') {
      // All contributions with optional filters
      // Note: Role check removed to match admin page behavior
      contributions = await getAllContributions({
        targetType: targetType || undefined,
        status: status || undefined
      });
    } else {
      contributions = await getUserContributions(session.userId);
    }

    return NextResponse.json({ contributions });
  } catch (error) {
    console.error('Error fetching contributions:', error);
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 });
  }
}

// POST /api/contributions - Create a new contribution
export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    
    const session = await getSession();
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetType, targetSection, contributionType, content, isAnonymous } = body;

    // Validate required fields
    if (!targetType || !contributionType || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: targetType, contributionType, content' },
        { status: 400 }
      );
    }

    // Validate targetType
    const validTargetTypes: TargetType[] = ['positioning', 'competitors', 'content'];
    if (!validTargetTypes.includes(targetType)) {
      return NextResponse.json(
        { error: 'Invalid targetType. Must be: positioning, competitors, or content' },
        { status: 400 }
      );
    }

    // Validate contributionType
    const validContributionTypes: ContributionType[] = ['intel', 'suggestion', 'question', 'correction'];
    if (!validContributionTypes.includes(contributionType)) {
      return NextResponse.json(
        { error: 'Invalid contributionType. Must be: intel, suggestion, question, or correction' },
        { status: 400 }
      );
    }

    const contribution = await createContribution({
      userId: session.userId,
      targetType,
      targetSection: targetSection || undefined,
      contributionType,
      content,
      isAnonymous: isAnonymous || false
    });

    // Return status info so UI can show if it was auto-published
    return NextResponse.json({ 
      contribution,
      message: contribution.status === 'auto_published' 
        ? 'Intel auto-published to Competitors' 
        : 'Contribution submitted for review'
    });
  } catch (error) {
    console.error('Error creating contribution:', error);
    return NextResponse.json({ error: 'Failed to create contribution' }, { status: 500 });
  }
}
