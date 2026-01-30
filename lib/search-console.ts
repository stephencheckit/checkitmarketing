// Google Search Console API client

interface SearchConsoleCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface SearchAnalyticsRow {
  keys: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchAnalyticsResponse {
  rows?: SearchAnalyticsRow[];
  responseAggregationType?: string;
}

export interface QueryData {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageData {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface CountryData {
  country: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface DeviceData {
  device: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

// Cache for access token
let cachedToken: { token: string; expiresAt: number } | null = null;

// Get credentials from environment
function getCredentials(): SearchConsoleCredentials {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID; // Reuse Google Ads OAuth client
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Search Console credentials not configured');
  }

  return { clientId, clientSecret, refreshToken };
}

// Get access token using refresh token
async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const { clientId, clientSecret, refreshToken } = getCredentials();

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data: AccessTokenResponse = await response.json();

  // Cache the token (expire 5 minutes early to be safe)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return data.access_token;
}

// Get list of sites in Search Console
export async function getSites(): Promise<string[]> {
  const token = await getAccessToken();

  const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get sites: ${error}`);
  }

  const data = await response.json();
  return (data.siteEntry || []).map((site: { siteUrl: string }) => site.siteUrl);
}

// Query search analytics data
async function querySearchAnalytics(
  siteUrl: string,
  options: {
    startDate: string;
    endDate: string;
    dimensions: string[];
    rowLimit?: number;
  }
): Promise<SearchAnalyticsRow[]> {
  const token = await getAccessToken();
  const encodedSiteUrl = encodeURIComponent(siteUrl);

  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: options.startDate,
        endDate: options.endDate,
        dimensions: options.dimensions,
        rowLimit: options.rowLimit || 1000,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Search analytics query failed: ${error}`);
  }

  const data: SearchAnalyticsResponse = await response.json();
  return data.rows || [];
}

// Get top queries
export async function getTopQueries(
  siteUrl: string,
  startDate: string,
  endDate: string,
  limit = 100
): Promise<QueryData[]> {
  const rows = await querySearchAnalytics(siteUrl, {
    startDate,
    endDate,
    dimensions: ['query'],
    rowLimit: limit,
  });

  return rows.map((row) => ({
    query: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));
}

// Get top pages
export async function getTopPages(
  siteUrl: string,
  startDate: string,
  endDate: string,
  limit = 100
): Promise<PageData[]> {
  const rows = await querySearchAnalytics(siteUrl, {
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: limit,
  });

  return rows.map((row) => ({
    page: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));
}

// Get performance by country
export async function getByCountry(
  siteUrl: string,
  startDate: string,
  endDate: string,
  limit = 50
): Promise<CountryData[]> {
  const rows = await querySearchAnalytics(siteUrl, {
    startDate,
    endDate,
    dimensions: ['country'],
    rowLimit: limit,
  });

  return rows.map((row) => ({
    country: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));
}

// Get performance by device
export async function getByDevice(
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<DeviceData[]> {
  const rows = await querySearchAnalytics(siteUrl, {
    startDate,
    endDate,
    dimensions: ['device'],
    rowLimit: 10,
  });

  return rows.map((row) => ({
    device: row.keys[0],
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));
}

// Get overall totals for a date range
export async function getTotals(
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<{ clicks: number; impressions: number; ctr: number; position: number }> {
  const token = await getAccessToken();
  const encodedSiteUrl = encodeURIComponent(siteUrl);

  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate,
        endDate,
        // No dimensions = aggregated totals
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Search analytics query failed: ${error}`);
  }

  const data: SearchAnalyticsResponse = await response.json();
  const row = data.rows?.[0];

  return {
    clicks: row?.clicks || 0,
    impressions: row?.impressions || 0,
    ctr: row?.ctr || 0,
    position: row?.position || 0,
  };
}

// Sync all data for a site
export async function syncAllData(
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<{
  queries: QueryData[];
  pages: PageData[];
  countries: CountryData[];
  devices: DeviceData[];
  totals: { clicks: number; impressions: number; ctr: number; position: number };
}> {
  const [queries, pages, countries, devices, totals] = await Promise.all([
    getTopQueries(siteUrl, startDate, endDate, 100),
    getTopPages(siteUrl, startDate, endDate, 100),
    getByCountry(siteUrl, startDate, endDate, 20),
    getByDevice(siteUrl, startDate, endDate),
    getTotals(siteUrl, startDate, endDate),
  ]);

  return { queries, pages, countries, devices, totals };
}

// Test connection
export async function testConnection(): Promise<{ success: boolean; error?: string; sites?: string[] }> {
  try {
    const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN;

    console.log('Search Console credentials check:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      hasRefreshToken: !!refreshToken && refreshToken !== 'your_refresh_token_here',
    });

    if (!refreshToken || refreshToken === 'your_refresh_token_here') {
      return { success: false, error: 'Search Console refresh token not configured' };
    }

    const sites = await getSites();
    return { success: true, sites };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { success: false, error: message };
  }
}

// Helper: Get date range for last N days
export function getDateRange(days: number): { startDate: string; endDate: string } {
  const end = new Date();
  end.setDate(end.getDate() - 1); // Yesterday (today's data not complete)
  
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  };
}
