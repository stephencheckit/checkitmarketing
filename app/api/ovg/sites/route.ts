import { NextRequest, NextResponse } from 'next/server';
import { 
  getOVGSites, 
  createOVGSite, 
  bulkInsertOVGSites,
  initializeOVGTables,
  OVGSiteStatus 
} from '@/lib/db';

// Initialize tables on first request
let tablesInitialized = false;

async function ensureTables() {
  if (!tablesInitialized) {
    await initializeOVGTables();
    tablesInitialized = true;
  }
}

// GET - Fetch all OVG sites
export async function GET(request: NextRequest) {
  try {
    await ensureTables();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as OVGSiteStatus | null;
    
    const sites = await getOVGSites(status || undefined);
    
    return NextResponse.json({ sites });
  } catch (error) {
    console.error('Error fetching OVG sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites' },
      { status: 500 }
    );
  }
}

// POST - Create new OVG site(s)
export async function POST(request: NextRequest) {
  try {
    await ensureTables();
    
    const body = await request.json();
    
    // Check if bulk insert
    if (Array.isArray(body.sites)) {
      const sites = await bulkInsertOVGSites(body.sites);
      return NextResponse.json({ sites, count: sites.length });
    }
    
    // Single site creation
    const site = await createOVGSite({
      name: body.name,
      venueType: body.venueType,
      address: body.address,
      city: body.city,
      state: body.state,
      zip: body.zip,
      country: body.country,
      latitude: body.latitude,
      longitude: body.longitude,
      status: body.status,
      notes: body.notes,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
    });
    
    return NextResponse.json({ site });
  } catch (error) {
    console.error('Error creating OVG site:', error);
    return NextResponse.json(
      { error: 'Failed to create site' },
      { status: 500 }
    );
  }
}
