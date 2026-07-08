import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import {
  initializeLeadTriageTable,
  getLeads,
  getLeadStats,
  getAllUsers,
} from '@/lib/db';

let initialized = false;
async function ensureInitialized() {
  if (!initialized) {
    await initializeLeadTriageTable();
    initialized = true;
  }
}

// GET /api/leads - unified lead inbox (filters + stats + assignable owners)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    if (session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await ensureInitialized();

    const { searchParams } = new URL(request.url);
    const filters = {
      status: searchParams.get('status') || undefined,
      source: searchParams.get('source') || undefined,
      owner: searchParams.get('owner') || undefined,
      band: searchParams.get('band') || undefined,
      search: searchParams.get('search') || undefined,
      limit: parseInt(searchParams.get('limit') || '100', 10),
      offset: parseInt(searchParams.get('offset') || '0', 10),
    };

    const [{ leads, total }, stats, owners] = await Promise.all([
      getLeads(filters),
      getLeadStats(),
      getAllUsers(),
    ]);

    return NextResponse.json({
      leads,
      total,
      stats,
      owners: (owners as { id: number; name: string; email: string }[]).map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
      })),
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
