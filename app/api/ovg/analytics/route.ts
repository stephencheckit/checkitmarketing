import { NextRequest, NextResponse } from 'next/server';
import { 
  recordOVGPageView,
  getOVGPageViews,
  getOVGAnalyticsSummary,
  initializeOVGTables
} from '@/lib/db';

// Initialize tables on first request
let tablesInitialized = false;

async function ensureTables() {
  if (!tablesInitialized) {
    await initializeOVGTables();
    tablesInitialized = true;
  }
}

// GET - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    await ensureTables();
    
    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'summary';
    const daysBack = parseInt(searchParams.get('days') || '30');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    if (view === 'summary') {
      const summary = await getOVGAnalyticsSummary(daysBack);
      return NextResponse.json(summary);
    }
    
    // Raw page views
    const pageViews = await getOVGPageViews({ limit, daysBack });
    return NextResponse.json({ pageViews });
  } catch (error) {
    console.error('Error fetching OVG analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

// POST - Record a page view
export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    
    const body = await request.json();
    
    // Get IP from headers (works with Vercel/Next.js)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const visitorIp = forwardedFor?.split(',')[0] || realIp || body.visitorIp;
    
    // Get geolocation from IP using free API
    let geoData: {
      city?: string;
      region?: string;
      country?: string;
      lat?: number;
      lon?: number;
    } = {};
    
    if (visitorIp && visitorIp !== '127.0.0.1' && visitorIp !== '::1') {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${visitorIp}?fields=status,city,regionName,country,lat,lon`);
        const geo = await geoRes.json();
        if (geo.status === 'success') {
          geoData = {
            city: geo.city,
            region: geo.regionName,
            country: geo.country,
            lat: geo.lat,
            lon: geo.lon,
          };
        }
      } catch (geoError) {
        console.log('Geolocation lookup failed:', geoError);
      }
    }
    
    const pageView = await recordOVGPageView({
      visitorIp,
      visitorCity: geoData.city || body.visitorCity,
      visitorRegion: geoData.region || body.visitorRegion,
      visitorCountry: geoData.country || body.visitorCountry,
      visitorLatitude: geoData.lat || body.visitorLatitude,
      visitorLongitude: geoData.lon || body.visitorLongitude,
      userAgent: request.headers.get('user-agent') || body.userAgent,
      referrer: request.headers.get('referer') || body.referrer,
      passwordUsed: body.passwordUsed,
      sessionId: body.sessionId,
      pagePath: body.pagePath || '/ovg-map',
    });
    
    return NextResponse.json({ 
      pageView,
      geoDetected: !!geoData.city 
    });
  } catch (error) {
    console.error('Error recording page view:', error);
    return NextResponse.json(
      { error: 'Failed to record page view' },
      { status: 500 }
    );
  }
}
