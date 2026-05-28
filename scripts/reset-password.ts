// Run with: npx tsx scripts/reset-password.ts <email> <new_password>
// Requires .env.local with DATABASE_URL (run `vercel env pull .env.local` first).
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL!);

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('Usage: npx tsx scripts/reset-password.ts <email> <new_password>');
    console.log('Example: npx tsx scripts/reset-password.ts stephen@checkit.net MyNewPass123!');
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.log('Password must be at least 8 characters');
    process.exit(1);
  }

  const hash = await bcrypt.hash(newPassword, 10);

  const result = await sql`
    UPDATE users
    SET password_hash = ${hash}
    WHERE email = ${email}
    RETURNING id, name, email, role
  `;

  if (result.length === 0) {
    console.log(`User with email ${email} not found`);
    process.exit(1);
  }

  const u = result[0];
  console.log(`Password reset for ${u.name} <${u.email}> (role: ${u.role})`);
}

resetPassword().catch((err) => {
  console.error(err);
  process.exit(1);
});
