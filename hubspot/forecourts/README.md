# HubSpot template: Forecourts market page

HubSpot CMS coded-template port of `/markets/forecourts`, built the same way as
`../coffee-shops` (see that README for the full approach). Differences:

- No revenue calculator (the forecourts page has no client components).
- The Next.js page hotlinks its hero (Autocar CDN), journey background
  (Unsplash), and platform image (checkitv6.com). Those are downloaded into
  `images/` and hosted in HubSpot instead — no third-party hotlinks on the
  published page.

## Files

- `template.html` — coded page template (extends the POWER THEME Checkit base
  layout for site header/footer)
- `forecourts.css` — compiled standalone stylesheet
- `images/hero.jpg`, `images/journey.jpg`, `images/platform.png`

Upload everything: `node hubspot/forecourts/upload.js` (uses
`HUBSPOT_ACCESS_TOKEN` from `.env.local`; needs the `content` scope).

All three CTAs open https://www.checkit.net/checkit-demo in a new tab
(`{% set demo_url %}` in the template).

## Regenerating after the Next.js page changes

With the dev server running:

```bash
cd hubspot/forecourts
curl -s -o _rendered.html http://localhost:3000/markets/forecourts
node extract.js
node build-template.js
npx @tailwindcss/cli@4 -i tailwind-input.css -o forecourts.css --minify
node build-preview.js   # optional local QA (serve repo root, open preview.html)
node upload.js          # from repo root: node hubspot/forecourts/upload.js
```
