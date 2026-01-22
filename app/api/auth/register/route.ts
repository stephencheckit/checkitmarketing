import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserByEmail, initializeDatabase } from '@/lib/db';
import { getSession, login } from '@/lib/session';

// Access code from environment variable (fallback for dev)
const VALID_ACCESS_CODES = (process.env.ACCESS_CODES || 'CHECKIT2026')
  .split(',')
  .map(code => code.trim().toUpperCase());

export async function POST(request: NextRequest) {
  try {
    // Initialize database tables if they don't exist
    await initializeDatabase();
    
    const { name, email, password, department, accessCode } = await request.json();

    // Validate input
    if (!name || !email || !password || !department || !accessCode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate access code
    if (!VALID_ACCESS_CODES.includes(accessCode.toUpperCase())) {
      return NextResponse.json(
        { error: 'Invalid access code. Contact your manager for access.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await createUser(name, email, passwordHash, department);

    // Create session
    const session = await getSession();
    await login(session, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
