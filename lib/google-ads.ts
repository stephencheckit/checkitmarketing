import { GoogleAdsApi } from 'google-ads-api';

// Initialize Google Ads API client
function getClient() {
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });

  return client;
}

// Get customer instance
function getCustomer() {
  const client = getClient();
  
  return client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
  });
}

// Convert micros to dollars
function microsToMoney(micros: number | string | null | undefined): number {
  if (micros === null || micros === undefined) return 0;
  const value = typeof micros === 'string' ? parseInt(micros, 10) : micros;
  return value / 1_000_000;
}

// Interfaces for returned data
export interface CampaignData {
  campaignId: string;
  name: string;
  status: string;
  budgetAmount: number;
  spendMtd: number;
  impressions: number;
  clicks: number;
  conversions: number;
  costPerConversion: number;
  ctr: number;
}

export interface AdData {
  adId: string;
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  headlines: string[];
  descriptions: string[];
  finalUrls: string[];
  path1: string;
  path2: string;
  adStrength: string;
  status: string;
  impressions: number;
  clicks: number;
  cost: number;
}

export interface KeywordData {
  keywordId: string;
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  keywordText: string;
  matchType: string;
  qualityScore: number | null;
  cpcBid: number;
  impressions: number;
  clicks: number;
  cost: number;
  conversions: number;
  ctr: number;
  status: string;
}

// Fetch campaigns with performance metrics
export async function fetchCampaigns(): Promise<CampaignData[]> {
  const customer = getCustomer();
  
  // Get current month date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const formatDate = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
  
  const campaigns = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign_budget.amount_micros,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.conversions,
      metrics.cost_per_conversion,
      metrics.ctr
    FROM campaign
    WHERE segments.date >= '${formatDate(startOfMonth)}'
      AND segments.date <= '${formatDate(now)}'
      AND campaign.status != 'REMOVED'
  `);

  // Aggregate by campaign (since we're getting daily data)
  const campaignMap = new Map<string, CampaignData>();
  
  for (const row of campaigns) {
    const id = String(row.campaign?.id || '');
    const existing = campaignMap.get(id);
    
    if (existing) {
      existing.spendMtd += microsToMoney(row.metrics?.cost_micros);
      existing.impressions += Number(row.metrics?.impressions || 0);
      existing.clicks += Number(row.metrics?.clicks || 0);
      existing.conversions += Number(row.metrics?.conversions || 0);
    } else {
      campaignMap.set(id, {
        campaignId: id,
        name: String(row.campaign?.name || 'Unknown'),
        status: String(row.campaign?.status || 'UNKNOWN'),
        budgetAmount: microsToMoney(row.campaign_budget?.amount_micros),
        spendMtd: microsToMoney(row.metrics?.cost_micros),
        impressions: Number(row.metrics?.impressions || 0),
        clicks: Number(row.metrics?.clicks || 0),
        conversions: Number(row.metrics?.conversions || 0),
        costPerConversion: microsToMoney(row.metrics?.cost_per_conversion),
        ctr: Number(row.metrics?.ctr || 0),
      });
    }
  }

  // Recalculate derived metrics
  const results = Array.from(campaignMap.values());
  for (const campaign of results) {
    if (campaign.clicks > 0 && campaign.impressions > 0) {
      campaign.ctr = campaign.clicks / campaign.impressions;
    }
    if (campaign.conversions > 0 && campaign.spendMtd > 0) {
      campaign.costPerConversion = campaign.spendMtd / campaign.conversions;
    }
  }

  return results;
}

// Fetch responsive search ads
export async function fetchAds(): Promise<AdData[]> {
  const customer = getCustomer();
  
  // Get current month date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const formatDate = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
  
  const ads = await customer.query(`
    SELECT
      ad_group_ad.ad.id,
      ad_group_ad.ad.type,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.ad.responsive_search_ad.descriptions,
      ad_group_ad.ad.final_urls,
      ad_group_ad.ad.responsive_search_ad.path1,
      ad_group_ad.ad.responsive_search_ad.path2,
      ad_group_ad.ad_strength,
      ad_group_ad.status,
      ad_group.id,
      ad_group.name,
      campaign.id,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros
    FROM ad_group_ad
    WHERE segments.date >= '${formatDate(startOfMonth)}'
      AND segments.date <= '${formatDate(now)}'
      AND ad_group_ad.status != 'REMOVED'
      AND campaign.status != 'REMOVED'
  `);

  // Aggregate by ad
  const adMap = new Map<string, AdData>();
  
  for (const row of ads) {
    const id = String(row.ad_group_ad?.ad?.id || '');
    const existing = adMap.get(id);
    
    if (existing) {
      existing.impressions += Number(row.metrics?.impressions || 0);
      existing.clicks += Number(row.metrics?.clicks || 0);
      existing.cost += microsToMoney(row.metrics?.cost_micros);
    } else {
      // Extract headlines and descriptions from responsive search ad
      const rsa = row.ad_group_ad?.ad?.responsive_search_ad;
      const headlines: string[] = [];
      const descriptions: string[] = [];
      
      if (rsa?.headlines) {
        for (const h of rsa.headlines) {
          if (h.text) headlines.push(h.text);
        }
      }
      
      if (rsa?.descriptions) {
        for (const d of rsa.descriptions) {
          if (d.text) descriptions.push(d.text);
        }
      }
      
      adMap.set(id, {
        adId: id,
        campaignId: String(row.campaign?.id || ''),
        campaignName: String(row.campaign?.name || 'Unknown'),
        adGroupId: String(row.ad_group?.id || ''),
        adGroupName: String(row.ad_group?.name || 'Unknown'),
        headlines,
        descriptions,
        finalUrls: row.ad_group_ad?.ad?.final_urls || [],
        path1: rsa?.path1 || '',
        path2: rsa?.path2 || '',
        adStrength: String(row.ad_group_ad?.ad_strength || 'UNSPECIFIED'),
        status: String(row.ad_group_ad?.status || 'UNKNOWN'),
        impressions: Number(row.metrics?.impressions || 0),
        clicks: Number(row.metrics?.clicks || 0),
        cost: microsToMoney(row.metrics?.cost_micros),
      });
    }
  }

  return Array.from(adMap.values());
}

// Fetch keywords with performance metrics
export async function fetchKeywords(): Promise<KeywordData[]> {
  const customer = getCustomer();
  
  // Get current month date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const formatDate = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
  
  const keywords = await customer.query(`
    SELECT
      ad_group_criterion.criterion_id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.quality_info.quality_score,
      ad_group_criterion.effective_cpc_bid_micros,
      ad_group_criterion.status,
      ad_group.id,
      ad_group.name,
      campaign.id,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.ctr
    FROM keyword_view
    WHERE segments.date >= '${formatDate(startOfMonth)}'
      AND segments.date <= '${formatDate(now)}'
      AND ad_group_criterion.status != 'REMOVED'
      AND campaign.status != 'REMOVED'
  `);

  // Aggregate by keyword
  const keywordMap = new Map<string, KeywordData>();
  
  for (const row of keywords) {
    const id = String(row.ad_group_criterion?.criterion_id || '');
    const existing = keywordMap.get(id);
    
    if (existing) {
      existing.impressions += Number(row.metrics?.impressions || 0);
      existing.clicks += Number(row.metrics?.clicks || 0);
      existing.cost += microsToMoney(row.metrics?.cost_micros);
      existing.conversions += Number(row.metrics?.conversions || 0);
    } else {
      keywordMap.set(id, {
        keywordId: id,
        campaignId: String(row.campaign?.id || ''),
        campaignName: String(row.campaign?.name || 'Unknown'),
        adGroupId: String(row.ad_group?.id || ''),
        adGroupName: String(row.ad_group?.name || 'Unknown'),
        keywordText: String(row.ad_group_criterion?.keyword?.text || ''),
        matchType: String(row.ad_group_criterion?.keyword?.match_type || 'UNSPECIFIED'),
        qualityScore: row.ad_group_criterion?.quality_info?.quality_score ?? null,
        cpcBid: microsToMoney(row.ad_group_criterion?.effective_cpc_bid_micros),
        impressions: Number(row.metrics?.impressions || 0),
        clicks: Number(row.metrics?.clicks || 0),
        cost: microsToMoney(row.metrics?.cost_micros),
        conversions: Number(row.metrics?.conversions || 0),
        ctr: Number(row.metrics?.ctr || 0),
        status: String(row.ad_group_criterion?.status || 'UNKNOWN'),
      });
    }
  }

  // Recalculate CTR
  const results = Array.from(keywordMap.values());
  for (const keyword of results) {
    if (keyword.clicks > 0 && keyword.impressions > 0) {
      keyword.ctr = keyword.clicks / keyword.impressions;
    }
  }

  return results;
}

// Sync all data from Google Ads
export async function syncAllData(): Promise<{
  campaigns: CampaignData[];
  ads: AdData[];
  keywords: KeywordData[];
  errors: string[];
}> {
  const errors: string[] = [];
  let campaigns: CampaignData[] = [];
  let ads: AdData[] = [];
  let keywords: KeywordData[] = [];

  try {
    campaigns = await fetchCampaigns();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error fetching campaigns';
    errors.push(`Campaigns: ${message}`);
    console.error('Error fetching campaigns:', error);
  }

  try {
    ads = await fetchAds();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error fetching ads';
    errors.push(`Ads: ${message}`);
    console.error('Error fetching ads:', error);
  }

  try {
    keywords = await fetchKeywords();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error fetching keywords';
    errors.push(`Keywords: ${message}`);
    console.error('Error fetching keywords:', error);
  }

  return { campaigns, ads, keywords, errors };
}

// Test connection to Google Ads API
export async function testConnection(): Promise<{ success: boolean; error?: string; accountName?: string }> {
  try {
    // Log credentials (redacted) for debugging
    console.log('Google Ads credentials check:', {
      hasClientId: !!process.env.GOOGLE_ADS_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_ADS_CLIENT_SECRET,
      hasDeveloperToken: !!process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
      hasCustomerId: !!process.env.GOOGLE_ADS_CUSTOMER_ID,
      hasLoginCustomerId: !!process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
      hasRefreshToken: !!process.env.GOOGLE_ADS_REFRESH_TOKEN,
      customerId: process.env.GOOGLE_ADS_CUSTOMER_ID?.substring(0, 4) + '...',
    });

    const customer = getCustomer();
    
    // Simple query to test connection
    const result = await customer.query(`
      SELECT customer.id, customer.descriptive_name
      FROM customer
      LIMIT 1
    `);

    if (result && result.length > 0) {
      return {
        success: true,
        accountName: String(result[0].customer?.descriptive_name || 'Unknown Account'),
      };
    }

    return { success: true };
  } catch (error: unknown) {
    console.error('Google Ads API connection error:', error);
    
    // Extract more detailed error info
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
      
      // Check for common Google Ads API errors
      if (message.includes('DEVELOPER_TOKEN_NOT_APPROVED')) {
        message = 'Developer token is not approved. You need Basic or Standard access to make API calls. Apply at Google Ads API Center.';
      } else if (message.includes('OAUTH_TOKEN_INVALID')) {
        message = 'OAuth refresh token is invalid or expired. Please regenerate the refresh token.';
      } else if (message.includes('CUSTOMER_NOT_FOUND')) {
        message = 'Customer ID not found. Check that the Customer ID is correct and the account is linked to your manager account.';
      } else if (message.includes('USER_PERMISSION_DENIED')) {
        message = 'Permission denied. The authenticated user does not have access to this Google Ads account.';
      }
    }
    
    return { success: false, error: message };
  }
}
