import dotenv from 'dotenv';

dotenv.config({ path: '.env.vercel' });
dotenv.config({ path: '.env.local', override: true });

const limitFlag = process.argv.indexOf('--limit');
const limit = limitFlag >= 0 ? Number(process.argv[limitFlag + 1]) : 0;
const rewrite = process.argv.includes('--rewrite');

function todayInNewYork() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

  const db = await import('../lib/db');
  const { buildDailyNote, slugForNote } = await import('../lib/daily-notes');

  if (rewrite) {
    const rows = await db.sql`
      SELECT source_query FROM content_drafts
      WHERE source_query LIKE 'daily-note:%'
      ORDER BY source_query
    `;
    let updated = 0;
    for (const row of rows) {
      const date = String(row.source_query).slice('daily-note:'.length);
      const note = buildDailyNote(date);
      await db.sql`
        UPDATE content_drafts SET
          title = ${note.title},
          content = ${note.content},
          excerpt = ${note.excerpt},
          meta_description = ${note.metaDescription},
          target_keywords = ${JSON.stringify(note.keywords)},
          updated_at = NOW()
        WHERE source_query = ${row.source_query}
      `;
      updated++;
    }
    console.log(JSON.stringify({ updated }));
    return;
  }

  const start = await db.getEarliestPublishedDay();
  if (!start) {
    console.log('No published articles yet.');
    return;
  }

  const end = todayInNewYork();
  const missing = await db.listMissingPublishedDays(start, end);
  const dates = limit > 0 ? missing.slice(0, limit) : missing;
  console.log(`Missing days ${start} through ${end}: ${missing.length}. Publishing ${dates.length}.`);

  let created = 0;
  let failed = 0;
  for (const date of dates) {
    try {
      const note = buildDailyNote(date);
      const saved = await db.insertPublishedDailyNote({
        date,
        title: note.title,
        slug: slugForNote(note.title, date),
        content: note.content,
        metaDescription: note.metaDescription,
        excerpt: note.excerpt,
        keywords: note.keywords,
      });
      created += saved.created ? 1 : 0;
      const words = note.content.trim().split(/\s+/).length;
      console.log(`${saved.created ? 'OK' : 'SKIP'} ${date} (${words}w) ${note.title}`);
    } catch (error) {
      failed++;
      console.error(`FAIL ${date}: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(JSON.stringify({ created, failed, remaining: missing.length - dates.length }));
  if (failed > 0) process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
