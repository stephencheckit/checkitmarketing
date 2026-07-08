import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { fetchContacts, fetchDeals } from '@/lib/hubspot';

// GET - Pull contacts and/or deals from HubSpot for the admin dashboard.
// Admin-only: this exposes CRM data.
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'all';
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    if (type === 'contacts') {
      const result = await fetchContacts(limit);
      return NextResponse.json(result);
    }
    if (type === 'deals') {
      const result = await fetchDeals(limit);
      return NextResponse.json(result);
    }

    const [contacts, deals] = await Promise.all([fetchContacts(limit), fetchDeals(limit)]);
    return NextResponse.json({
      success: contacts.success || deals.success,
      contacts: contacts.contacts,
      deals: deals.deals,
      error: contacts.error || deals.error,
    });
  } catch (error) {
    console.error('Error fetching HubSpot data:', error);
    return NextResponse.json({ error: 'Failed to fetch HubSpot data' }, { status: 500 });
  }
}
