import dotenv from 'dotenv';

dotenv.config({ path: '.env.vercel' });
dotenv.config({ path: '.env.local', override: true });

const limitFlag = process.argv.indexOf('--limit');
const limit = limitFlag >= 0 ? Number(process.argv[limitFlag + 1]) : 200;
const dryRun = process.argv.includes('--dry-run');

async function main() {
  const db = await import('../lib/db');
  const { publishToMemosBlog } = await import('../lib/hubspot-blog');
  const { articleMarkdownToHtml } = await import('../lib/memo-html');

  await db.initializeContentDraftsTables();
  const rows = await db.getPublishedMissingHubspot(limit);
  console.log(`Unsynced published articles: ${rows.length}`);
  if (rows.length === 0) return;

  if (dryRun) {
    const html = articleMarkdownToHtml(rows[0].content || '');
    console.log(`id=${rows[0].id} title=${rows[0].title}`);
    console.log(html.slice(0, 1800));
    console.log('---');
    console.log('meta heading leaked:', /meta description/i.test(html));
    console.log('html length:', html.length);
    return;
  }

  let ok = 0;
  let fail = 0;
  for (const draft of rows) {
    if (!draft.content) continue;
    try {
      const hs = await publishToMemosBlog({
        title: draft.title,
        slug: draft.slug,
        markdown: draft.content,
        metaDescription: draft.meta_description,
        excerpt: draft.excerpt,
        publishDate: draft.published_at,
      });
      await db.setDraftHubspot(draft.id, hs.postId, hs.url);
      ok++;
      console.log(`OK ${draft.id} ${hs.url}`);
    } catch (error) {
      fail++;
      console.error(`FAIL ${draft.id} ${draft.title}: ${error instanceof Error ? error.message : error}`);
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(JSON.stringify({ ok, fail }));
  if (fail > 0) process.exit(1);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
