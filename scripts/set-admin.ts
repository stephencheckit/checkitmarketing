// Run with: npx tsx scripts/set-admin.ts charlie@checkit.net
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL!);

async function setAdmin() {
  const email = process.argv[2];
  
  if (!email) {
    console.log('Usage: npx tsx scripts/set-admin.ts <email>');
    console.log('Example: npx tsx scripts/set-admin.ts charlie@checkit.net');
    process.exit(1);
  }

  // Check current admins
  const admins = await sql`SELECT email, role FROM users WHERE role = 'admin'`;
  console.log('Current admins:', admins.length ? admins.map(a => a.email).join(', ') : 'None');

  // Update the user
  const result = await sql`
    UPDATE users 
    SET role = 'admin' 
    WHERE email = ${email}
    RETURNING id, name, email, role
  `;

  if (result.length === 0) {
    console.log(`User with email ${email} not found`);
    process.exit(1);
  }

  console.log(`✓ Updated ${result[0].name} (${result[0].email}) to admin`);
  
  // Show all admins now
  const allAdmins = await sql`SELECT email, role FROM users WHERE role = 'admin'`;
  console.log('All admins now:', allAdmins.map(a => a.email).join(', '));
}

setAdmin().catch(console.error);
