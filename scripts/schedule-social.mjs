#!/usr/bin/env node
/**
 * Schedule social posts to Buffer from a calendar JSON file.
 *
 * Usage:
 *   node scripts/schedule-social.mjs social/july-2026-calendar.json [--dry-run]
 *
 * Calendar format: array of slots:
 *   {
 *     "dueAt": "2026-07-09T11:30:00.000Z",
 *     "topic": "short label for logging",
 *     "variants": {
 *       "linkedin": { "text": "...", "image": "https://..." },
 *       "facebook": { "text": "...", "image": "https://..." },
 *       "twitter":  { "text": "...", "image": "https://..." }
 *     }
 *   }
 *
 * Requires BUFFER_API_TOKEN (reads .env.local if not set).
 */
import fs from 'node:fs';
import path from 'node:path';

const CHANNELS = {
  linkedin: '68372596d6d25b49a184beeb',
  facebook: '69b1667f7be9f8b1714531a4',
  twitter: '69b166eb7be9f8b1714532d9',
};

const calendarPath = process.argv[2];
const dryRun = process.argv.includes('--dry-run');
if (!calendarPath) {
  console.error('Usage: node scripts/schedule-social.mjs <calendar.json> [--dry-run]');
  process.exit(1);
}

let token = process.env.BUFFER_API_TOKEN;
if (!token) {
  const envFile = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envFile)) {
    const m = fs.readFileSync(envFile, 'utf8').match(/^BUFFER_API_TOKEN="?([^"\n]+)"?/m);
    if (m) token = m[1];
  }
}
if (!token) {
  console.error('BUFFER_API_TOKEN not set and not found in .env.local');
  process.exit(1);
}

const MUTATION = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess { post { id dueAt } }
      ... on MutationError { message }
    }
  }
`;

async function gql(query, variables) {
  const res = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 429) return { rateLimited: true };
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const calendar = JSON.parse(fs.readFileSync(calendarPath, 'utf8'));
const results = { ok: 0, failed: [] };

for (const slot of calendar) {
  for (const [platform, variant] of Object.entries(slot.variants)) {
    const channelId = CHANNELS[platform];
    if (!channelId) {
      results.failed.push(`${slot.dueAt} ${platform}: unknown platform`);
      continue;
    }
    const label = `${slot.dueAt} ${platform} — ${slot.topic || variant.text.slice(0, 50)}`;
    if (dryRun) {
      console.log(`[dry-run] ${label}`);
      results.ok++;
      continue;
    }

    const input = {
      channelId,
      text: variant.text,
      dueAt: slot.dueAt,
      schedulingType: 'automatic',
      mode: 'customScheduled',
      assets: variant.image ? [{ image: { url: variant.image } }] : [],
    };
    // Facebook requires an explicit post type
    if (platform === 'facebook') input.metadata = { facebook: { type: 'post' } };

    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      try {
        const data = await gql(MUTATION, { input });
        if (data.rateLimited) {
          console.log(`rate limited — waiting 15 min before retrying ${label}`);
          await sleep(15 * 60 * 1000);
          continue;
        }
        const r = data.createPost;
        if (r.post) {
          console.log(`ok ${label}`);
          results.ok++;
        } else {
          console.error(`FAILED ${label}: ${r.message}`);
          results.failed.push(`${label}: ${r.message}`);
        }
        break;
      } catch (err) {
        console.error(`ERROR ${label}: ${err.message}`);
        if (attempts >= 3) results.failed.push(`${label}: ${err.message}`);
        else await sleep(5000);
      }
    }
    await sleep(1500);
  }
}

console.log(`\nDone: ${results.ok} scheduled, ${results.failed.length} failed`);
if (results.failed.length) {
  for (const f of results.failed) console.log(' -', f);
  process.exit(1);
}
