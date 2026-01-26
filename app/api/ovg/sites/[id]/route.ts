import { NextRequest, NextResponse } from 'next/server';
import { 
  getOVGSiteById, 
  updateOVGSite, 
  deleteOVGSite,
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

// GET - Fetch single OVG site
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    const { id } = await params;
    
    const site = await getOVGSiteById(parseInt(id));
    
    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ site });
  } catch (error) {
    console.error('Error fetching OVG site:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site' },
      { status: 500 }
    );
  }
}

// PUT - Update OVG site
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    const { id } = await params;
    const body = await request.json();
    
    const site = await updateOVGSite(parseInt(id), {
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
    
    if (!site) {
      return NextResponse.json(
        { error: 'Site not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ site });
  } catch (error) {
    console.error('Error updating OVG site:', error);
    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    );
  }
}

// DELETE - Remove OVG site
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureTables();
    const { id } = await params;
    
    await deleteOVGSite(parseInt(id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting OVG site:', error);
    return NextResponse.json(
      { error: 'Failed to delete site' },
      { status: 500 }
    );
  }
}
