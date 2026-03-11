// Google Analytics 4 Data API client
// Uses the same OAuth client as Search Console

interface GA4Credentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  propertyId: string;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

function getCredentials(): GA4Credentials {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ANALYTICS_REFRESH_TOKEN || process.env.GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN;
  const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

  if (!clientId || !clientSecret || !refreshToken || !propertyId) {
    throw new Error(
      'GA4 credentials not configured. Required: GOOGLE_ANALYTICS_PROPERTY_ID' +
      (refreshToken ? '' : ', GOOGLE_ANALYTICS_REFRESH_TOKEN or GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN')
    );
  }

  return { clientId, clientSecret, refreshToken, propertyId };
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const { clientId, clientSecret, refreshToken } = getCredentials();

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GA4 token refresh failed: ${error}`);
  }

  const data = await response.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 300) * 1000,
  };

  return data.access_token;
}

interface GA4RunReportRequest {
  dateRanges: Array<{ startDate: string; endDate: string }>;
  dimensions?: Array<{ name: string }>;
  metrics: Array<{ name: string }>;
  orderBys?: Array<{
    dimension?: { dimensionName: string; orderType?: string };
    metric?: { metricName: string };
    desc?: boolean;
  }>;
  limit?: number;
  dimensionFilter?: {
    filter?: {
      fieldName: string;
      stringFilter?: { matchType: string; value: string };
    };
    andGroup?: { expressions: Array<{ filter: { fieldName: string; stringFilter: { matchType: string; value: string } } }> };
  };
}

interface GA4Row {
  dimensionValues?: Array<{ value: string }>;
  metricValues?: Array<{ value: string }>;
}

interface GA4RunReportResponse {
  rows?: GA4Row[];
  totals?: GA4Row[];
  rowCount?: number;
}

async function runReport(request: GA4RunReportRequest): Promise<GA4RunReportResponse> {
  const { propertyId } = getCredentials();
  const token = await getAccessToken();

  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GA4 report failed: ${error}`);
  }

  return response.json();
}

export interface PageViewData {
  path: string;
  pageviews: number;
  users: number;
  sessions: number;
  avgEngagementTime: number;
}

export interface DailyPageViews {
  date: string;
  pageviews: number;
  users: number;
}

export interface TrafficSource {
  source: string;
  medium: string;
  sessions: number;
  users: number;
}

export interface GA4Summary {
  totalPageviews: number;
  totalUsers: number;
  totalSessions: number;
  avgEngagementTime: number;
  byPage: PageViewData[];
  byDay: DailyPageViews[];
  bySources: TrafficSource[];
}

export async function getPageViewSummary(daysBack: number = 30): Promise<GA4Summary> {
  const endDate = 'today';
  const startDate = `${daysBack}daysAgo`;
  const dateRange = { startDate, endDate };

  const [totalsRes, byPageRes, byDayRes, bySourceRes] = await Promise.all([
    runReport({
      dateRanges: [dateRange],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'userEngagementDuration' },
      ],
    }),
    runReport({
      dateRanges: [dateRange],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'userEngagementDuration' },
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 50,
    }),
    runReport({
      dateRanges: [dateRange],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'totalUsers' },
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    }),
    runReport({
      dateRanges: [dateRange],
      dimensions: [{ name: 'sessionSource' }, { name: 'sessionMedium' }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 20,
    }),
  ]);

  const totalsRow = totalsRes.rows?.[0];
  const totalPageviews = parseInt(totalsRow?.metricValues?.[0]?.value || '0');
  const totalUsers = parseInt(totalsRow?.metricValues?.[1]?.value || '0');
  const totalSessions = parseInt(totalsRow?.metricValues?.[2]?.value || '0');
  const totalEngagement = parseFloat(totalsRow?.metricValues?.[3]?.value || '0');
  const avgEngagementTime = totalSessions > 0 ? totalEngagement / totalSessions : 0;

  const byPage: PageViewData[] = (byPageRes.rows || []).map((row) => ({
    path: row.dimensionValues?.[0]?.value || '',
    pageviews: parseInt(row.metricValues?.[0]?.value || '0'),
    users: parseInt(row.metricValues?.[1]?.value || '0'),
    sessions: parseInt(row.metricValues?.[2]?.value || '0'),
    avgEngagementTime: parseInt(row.metricValues?.[3]?.value || '0') /
      Math.max(parseInt(row.metricValues?.[2]?.value || '1'), 1),
  }));

  const byDay: DailyPageViews[] = (byDayRes.rows || []).map((row) => {
    const raw = row.dimensionValues?.[0]?.value || '';
    const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
    return {
      date,
      pageviews: parseInt(row.metricValues?.[0]?.value || '0'),
      users: parseInt(row.metricValues?.[1]?.value || '0'),
    };
  });

  const bySources: TrafficSource[] = (bySourceRes.rows || []).map((row) => ({
    source: row.dimensionValues?.[0]?.value || '(direct)',
    medium: row.dimensionValues?.[1]?.value || '(none)',
    sessions: parseInt(row.metricValues?.[0]?.value || '0'),
    users: parseInt(row.metricValues?.[1]?.value || '0'),
  }));

  return {
    totalPageviews,
    totalUsers,
    totalSessions,
    avgEngagementTime,
    byPage,
    byDay,
    bySources,
  };
}

export async function testConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const creds = getCredentials();
    const token = await getAccessToken();
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${creds.propertyId}/metadata`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
