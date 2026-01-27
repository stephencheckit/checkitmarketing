import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getSession } from '@/lib/session';

// POST /api/admin/set-role - Set a user's role (requires existing admin or first admin setup)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be: user or admin' }, { status: 400 });
    }

    // Check if any admins exist
    const adminCount = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'admin'`;
    const hasAdmins = Number(adminCount[0]?.count || 0) > 0;

    // If admins exist, require current user to be admin
    if (hasAdmins) {
      if (!session.isLoggedIn || session.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
      }
    }

    // Update the user's role
    const result = await sql`
      UPDATE users 
      SET role = ${role}
      WHERE email = ${email}
      RETURNING id, name, email, role
    `;

    if (result.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: `User ${email} role updated to ${role}`,
      user: result[0]
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}

// GET /api/admin/set-role - Get list of all users with roles (admin only)
export async function GET() {
  try {
    const session = await getSession();
    
    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const users = await sql`
      SELECT id, name, email, role, department, created_at
      FROM users
      ORDER BY role DESC, name ASC
    `;

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
