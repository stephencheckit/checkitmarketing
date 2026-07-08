/**
 * Uploads the coffee-shops template package to HubSpot Design Manager
 * via the CMS Source Code API. Requires the private app to have the
 * `content` scope.
 *
 * Run from repo root: node hubspot/coffee-shops/upload.js
 */
const fs = require('fs');
const path = require('path');

const DEST_FOLDER = 'market-pages/coffee-shops';

const uploads = [
  { local: 'template.html', remote: `${DEST_FOLDER}/template.html` },
  { local: 'coffee-shops.css', remote: `${DEST_FOLDER}/coffee-shops.css` },
  { local: 'calculator.js', remote: `${DEST_FOLDER}/calculator.js` },
  { local: '../../public/markets/coffee-shops/hero.jpg', remote: `${DEST_FOLDER}/images/hero.jpg` },
  { local: '../../public/markets/coffee-shops/journey.jpg', remote: `${DEST_FOLDER}/images/journey.jpg` },
  // Design Manager rejects .webp — converted copy (sips -s format png)
  { local: '/tmp/platform.png', remote: `${DEST_FOLDER}/images/platform.png` },
];

function getToken() {
  if (process.env.HUBSPOT_ACCESS_TOKEN) return process.env.HUBSPOT_ACCESS_TOKEN.trim();
  const envFile = path.join(__dirname, '../../.env.local');
  const m = fs.readFileSync(envFile, 'utf8').match(/^HUBSPOT_ACCESS_TOKEN=(.*)$/m);
  if (!m) throw new Error('HUBSPOT_ACCESS_TOKEN not found');
  return m[1].replace(/["']/g, '').trim();
}

async function uploadFile(token, localPath, remotePath) {
  const abs = path.resolve(__dirname, localPath);
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(abs)]), path.basename(remotePath));

  // "published" environment uploads AND publishes in one call
  const res = await fetch(
    `https://api.hubapi.com/cms/v3/source-code/published/content/${remotePath}`,
    { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: form }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${remotePath}: HTTP ${res.status} — ${body}`);
  }
  console.log(`Uploaded ${remotePath}`);
}

(async () => {
  const token = getToken();
  for (const u of uploads) {
    await uploadFile(token, u.local, u.remote);
  }
  console.log('\nDone. The template should now appear in Design Manager under', DEST_FOLDER);
  console.log('Create a page: Marketing > Website > Website Pages > Create, pick "Market Page - Coffee Shops".');
})();
