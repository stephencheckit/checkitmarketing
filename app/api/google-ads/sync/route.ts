import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  initializeGoogleAdsTables,
  getGoogleAdsCampaigns,
  getGoogleAdsAds,
  getGoogleAdsKeywords,
  getGoogleAdsSummary,
  upsertGoogleAdsCampaign,
  upsertGoogleAdsAd,
  upsertGoogleAdsKeyword,
  createSyncLog,
  updateSyncLog,
  getLatestSyncLog,
} from '@/lib/db';
import {
  syncAllData,
  testConnection,
} from '@/lib/google-ads';

// GET - Return cached Google Ads data
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    await initializeGoogleAdsTables();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    // Test connection only
    if (type === 'test') {
      const result = await testConnection();
      return NextResponse.json(result);
    }

    // Get summary
    if (type === 'summary') {
      const summary = await getGoogleAdsSummary();
      return NextResponse.json(summary);
    }

    // Get campaigns
    if (type === 'campaigns') {
      const campaigns = await getGoogleAdsCampaigns();
      const lastSync = await getLatestSyncLog();
      return NextResponse.json({
        campaigns,
        lastSyncedAt: lastSync?.completed_at || lastSync?.started_at || null,
      });
    }

    // Get ads
    if (type === 'ads') {
      const campaignId = searchParams.get('campaignId') || undefined;
      const ads = await getGoogleAdsAds(campaignId);
      const lastSync = await getLatestSyncLog();
      return NextResponse.json({
        ads,
        lastSyncedAt: lastSync?.completed_at || lastSync?.started_at || null,
      });
    }

    // Get keywords
    if (type === 'keywords') {
      const campaignId = searchParams.get('campaignId') || undefined;
      const keywords = await getGoogleAdsKeywords(campaignId);
      const lastSync = await getLatestSyncLog();
      return NextResponse.json({
        keywords,
        lastSyncedAt: lastSync?.completed_at || lastSync?.started_at || null,
      });
    }

    // Get all data
    const [campaigns, ads, keywords, summary] = await Promise.all([
      getGoogleAdsCampaigns(),
      getGoogleAdsAds(),
      getGoogleAdsKeywords(),
      getGoogleAdsSummary(),
    ]);

    return NextResponse.json({
      campaigns,
      ads,
      keywords,
      summary,
    });
  } catch (error) {
    console.error('Error fetching Google Ads data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Google Ads data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Trigger sync from Google Ads API
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Initialize tables if needed
    try {
      await initializeGoogleAdsTables();
    } catch (dbError) {
      console.error('Database initialization error:', dbError);
      return NextResponse.json(
        { error: 'Database initialization failed', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      );
    }

    // Check for required environment variables
    const requiredEnvVars = [
      'GOOGLE_ADS_CLIENT_ID',
      'GOOGLE_ADS_CLIENT_SECRET',
      'GOOGLE_ADS_DEVELOPER_TOKEN',
      'GOOGLE_ADS_CUSTOMER_ID',
      'GOOGLE_ADS_REFRESH_TOKEN',
    ];

    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    if (missingVars.length > 0) {
      return NextResponse.json(
        { error: `Missing environment variables: ${missingVars.join(', ')}` },
        { status: 500 }
      );
    }

    // Test connection first
    console.log('Testing Google Ads API connection...');
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      console.error('Google Ads API connection failed:', connectionTest.error);
      return NextResponse.json(
        { 
          error: 'Google Ads API connection failed', 
          details: connectionTest.error,
          hint: 'This may be due to: (1) Developer token not approved yet, (2) Invalid credentials, (3) Account access issues'
        },
        { status: 500 }
      );
    }
    console.log('Connection successful, account:', connectionTest.accountName);

    // Create sync log
    const syncLog = await createSyncLog('full');

    try {
      // Fetch all data from Google Ads API
      console.log('Fetching Google Ads data...');
      const { campaigns, ads, keywords, errors } = await syncAllData();
      console.log(`Fetched: ${campaigns.length} campaigns, ${ads.length} ads, ${keywords.length} keywords`);

      // Save campaigns to database
      let campaignsSynced = 0;
      for (const campaign of campaigns) {
        try {
          await upsertGoogleAdsCampaign(campaign);
          campaignsSynced++;
        } catch (err) {
          console.error('Error saving campaign:', campaign.campaignId, err);
        }
      }

      // Save ads to database
      let adsSynced = 0;
      for (const ad of ads) {
        try {
          await upsertGoogleAdsAd(ad);
          adsSynced++;
        } catch (err) {
          console.error('Error saving ad:', ad.adId, err);
        }
      }

      // Save keywords to database
      let keywordsSynced = 0;
      for (const keyword of keywords) {
        try {
          await upsertGoogleAdsKeyword(keyword);
          keywordsSynced++;
        } catch (err) {
          console.error('Error saving keyword:', keyword.keywordId, err);
        }
      }

      // Update sync log
      const hasErrors = errors.length > 0;
      await updateSyncLog(syncLog.id, {
        status: hasErrors ? 'completed_with_errors' : 'completed',
        campaignsSynced,
        adsSynced,
        keywordsSynced,
        errorMessage: hasErrors ? errors.join('; ') : undefined,
      });

      return NextResponse.json({
        success: true,
        syncedAt: new Date().toISOString(),
        stats: {
          campaigns: campaignsSynced,
          ads: adsSynced,
          keywords: keywordsSynced,
        },
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (syncError) {
      // Update sync log with error
      const errorMessage = syncError instanceof Error ? syncError.message : 'Unknown sync error';
      await updateSyncLog(syncLog.id, {
        status: 'failed',
        errorMessage,
      });

      throw syncError;
    }
  } catch (error) {
    console.error('Error syncing Google Ads data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync Google Ads data', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
