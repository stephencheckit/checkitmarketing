# HubSpot template: Hospital Pharmacies market page

HubSpot CMS coded-template port of `/markets/pharmacies`, built the same way as
`../forecourts` (see `../coffee-shops/README.md` for the full approach).
CAM+ positioning: medical monitoring and compliance for hospital pharmacy
medicine storage.

## Files

- `template.html` — coded page template (extends the POWER THEME Checkit base
  layout for site header/footer)
- `pharmacies.css` — compiled standalone stylesheet
- `images/hero.jpg` (pharmacy), `images/journey.jpg` (blister packs),
  `images/platform.png`

Upload everything: `node hubspot/pharmacies/upload.js` (uses
`HUBSPOT_ACCESS_TOKEN` from `.env.local`; needs the `content` scope).

All three CTAs open https://www.checkit.net/checkit-demo in a new tab
(`{% set demo_url %}` in the template).

## Regenerating after the Next.js page changes

With the dev server running:

```bash
cd hubspot/pharmacies
curl -s -o _rendered.html http://localhost:3000/markets/pharmacies
node extract.js
node build-template.js
npx @tailwindcss/cli@4 -i tailwind-input.css -o pharmacies.css --minify
node upload.js          # from repo root: node hubspot/pharmacies/upload.js
```
