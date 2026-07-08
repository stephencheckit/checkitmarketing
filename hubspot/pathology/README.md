# HubSpot template: Pathology Networks market page

HubSpot CMS coded-template port of `/markets/pathology`, built the same way as
`../forecourts` (see `../coffee-shops/README.md` for the full approach).
CAM+ positioning: medical monitoring and compliance for hub-and-spoke
pathology networks.

## Files

- `template.html` — coded page template (extends the POWER THEME Checkit base
  layout for site header/footer)
- `pathology.css` — compiled standalone stylesheet
- `images/hero.jpg` (lab), `images/journey.jpg` (ward), `images/platform.png`

Upload everything: `node hubspot/pathology/upload.js` (uses
`HUBSPOT_ACCESS_TOKEN` from `.env.local`; needs the `content` scope).

All three CTAs open https://www.checkit.net/checkit-demo in a new tab
(`{% set demo_url %}` in the template).

## Regenerating after the Next.js page changes

With the dev server running:

```bash
cd hubspot/pathology
curl -s -o _rendered.html http://localhost:3000/markets/pathology
node extract.js
node build-template.js
npx @tailwindcss/cli@4 -i tailwind-input.css -o pathology.css --minify
node upload.js          # from repo root: node hubspot/pathology/upload.js
```
