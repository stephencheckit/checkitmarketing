/**
 * Uploads the forecourts template package to HubSpot Design Manager.
 * Requires the private app to have the `content` scope.
 * Run from repo root: node hubspot/forecourts/upload.js
 */
const fs = require('fs');
const path = require('path');

const DEST_FOLDER = 'market-pages/forecourts';

const uploads = [
  { local: 'template.html', remote: `${DEST_FOLDER}/template.html` },
  { local: 'forecourts.css', remote: `${DEST_FOLDER}/forecourts.css` },
  { local: 'images/hero.jpg', remote: `${DEST_FOLDER}/images/hero.jpg` },
  { local: 'images/journey.jpg', remote: `${DEST_FOLDER}/images/journey.jpg` },
  { local: 'images/platform.png', remote: `${DEST_FOLDER}/images/platform.png` },
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
  console.log('\nDone. Template is in Design Manager under', DEST_FOLDER);
})();
