// Run with: npx tsx scripts/list-users.ts [search]
// Lists users, optionally filtered by email/name substring.
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL!);

async function listUsers() {
  const search = process.argv[2];

  const rows = search
    ? await sql`SELECT id, name, email, role FROM users WHERE email ILIKE ${'%' + search + '%'} OR name ILIKE ${'%' + search + '%'} ORDER BY role DESC, email ASC`
    : await sql`SELECT id, name, email, role FROM users ORDER BY role DESC, email ASC LIMIT 100`;

  if (rows.length === 0) {
    console.log('No users found.');
    return;
  }

  console.log(`Found ${rows.length} user(s):\n`);
  for (const u of rows) {
    console.log(`  [${u.role || 'user'}] ${u.email}  —  ${u.name}  (id: ${u.id})`);
  }
}

listUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
