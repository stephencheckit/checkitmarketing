import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { 
  getContribution, 
  reviewContribution, 
  deleteContribution,
  initializeContributionsTables,
  createCitation,
  getCurrentPositioningData,
  getCurrentBattlecardData,
  savePositioningVersion,
  saveBattlecardVersion,
  getUserById,
  type TargetType
} from '@/lib/db';

// Interface for contributed insights stored in document versions
interface ContributedInsight {
  contributionId: number;
  contributorName: string | null;
  isAnonymous: boolean;
  content: string;
  contributionType: string;
  targetSection: string | null;
  addedAt: string;
}

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

    // If approved, create a new version with the contribution incorporated
    let citation = null;
    let newVersion = null;
    if (status === 'approved') {
      try {
        const targetType = contribution.target_type as TargetType;
        
        // Get contributor name for the insight
        let contributorName: string | null = null;
        if (!contribution.is_anonymous && contribution.user_id) {
          const contributor = await getUserById(contribution.user_id);
          contributorName = contributor?.name || null;
        }
        
        // Create the insight object to add to the document
        const newInsight: ContributedInsight = {
          contributionId: contribution.id,
          contributorName: contribution.is_anonymous ? null : contributorName,
          isAnonymous: contribution.is_anonymous,
          content: contribution.content,
          contributionType: contribution.contribution_type,
          targetSection: contribution.target_section,
          addedAt: new Date().toISOString()
        };
        
        // Generate change notes
        const contributorLabel = contribution.is_anonymous 
          ? 'Anonymous' 
          : (contributorName || 'Team member');
        const changeNotes = `Added ${contribution.contribution_type} from ${contributorLabel}${
          contribution.target_section ? ` for ${contribution.target_section}` : ''
        }`;
        
        if (targetType === 'positioning') {
          const posData = await getCurrentPositioningData();
          const currentData = posData.data || { companyName: 'Checkit', sections: [] };
          
          // Add contributedInsights array if it doesn't exist
          const updatedData = {
            ...currentData,
            contributedInsights: [
              ...(currentData.contributedInsights || []),
              newInsight
            ]
          };
          
          // Save new version
          const result = await savePositioningVersion(updatedData, changeNotes);
          newVersion = result.version;
          
          // Create citation linking to the new version
          citation = await createCitation({
            contributionId: contribution.id,
            versionType: targetType,
            versionId: newVersion,
            sectionId: contribution.target_section || undefined
          });
          
        } else if (targetType === 'competitors') {
          const battlecard = await getCurrentBattlecardData();
          const currentData = battlecard.data || { ourCompany: {}, competitors: [], categories: [] };
          
          // Add contributedInsights array if it doesn't exist
          const updatedData = {
            ...currentData,
            contributedInsights: [
              ...(currentData.contributedInsights || []),
              newInsight
            ]
          };
          
          // Save new version
          const result = await saveBattlecardVersion(updatedData, changeNotes);
          newVersion = result.version;
          
          // Create citation linking to the new version
          citation = await createCitation({
            contributionId: contribution.id,
            versionType: targetType,
            versionId: newVersion,
            sectionId: contribution.target_section || undefined
          });
        }
        // Note: 'content' type doesn't have versioning yet - just approve without version
        
      } catch (versionError) {
        console.error('Failed to create new version with contribution:', versionError);
        // Don't fail the approval if version creation fails, but log it
      }
    }

    return NextResponse.json({ 
      contribution,
      citation,
      newVersion,
      message: status === 'approved' 
        ? `Contribution approved${newVersion ? ` and added to version ${newVersion}` : ''}`
        : `Contribution ${status}`
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
