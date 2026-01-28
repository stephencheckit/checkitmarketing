import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// GET /api/admin/access-codes - Get current access codes (admin only)
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Get access codes from environment
    const accessCodes = (process.env.ACCESS_CODES || 'CHECKIT2026')
      .split(',')
      .map(code => code.trim().toUpperCase())
      .filter(code => code.length > 0);

    return NextResponse.json({ 
      accessCodes,
      note: 'Access codes are set via ACCESS_CODES environment variable (comma-separated)'
    });
  } catch (error) {
    console.error('Error fetching access codes:', error);
    return NextResponse.json({ error: 'Failed to fetch access codes' }, { status: 500 });
  }
}
