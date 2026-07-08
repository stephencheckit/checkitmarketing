# HubSpot template: Coffee Shops market page

A HubSpot CMS coded-template port of `/markets/coffee-shops` from the Next.js site.
Near pixel-perfect: same markup, compiled Tailwind CSS, and a vanilla-JS rewrite of
the revenue calculator. Requires **Content Hub (CMS) Professional** or above.

The template extends `/POWER THEME Checkit/templates/layouts/base.html` — the same
base layout as the rest of checkit.net — so it inherits the live site header,
footer, favicon, fonts, and tracking automatically. The page CSS is compiled
without a global reset (a reset scoped to `.ck-coffee-page` is used instead, with
`!important` utilities) so it can't interfere with the theme header/footer and
vice versa.

## What to upload to HubSpot

Upload these four files into one folder in the Design Manager (e.g. `market-pages/`),
plus the three images into an `images/` subfolder next to the template:

| File | Purpose |
|---|---|
| `template.html` | The coded page template (HubL) |
| `coffee-shops.css` | Compiled standalone stylesheet |
| `calculator.js` | Revenue calculator logic |
| `images/hero.jpg`, `images/journey.jpg`, `images/platform.webp` | Copy from `public/markets/coffee-shops/` in this repo |

Three ways to upload:

1. **API script (fastest)** — `node hubspot/coffee-shops/upload.js` uploads and
   publishes all six files to `market-pages/coffee-shops` in the Design Manager.
   Uses `HUBSPOT_ACCESS_TOKEN` from `.env.local`; the private app must have the
   **content** scope (Settings > Integrations > Private Apps > your app > Scopes).
2. **Design Manager UI** — Marketing > Files and Templates > Design Tools, create the
   folder, upload the files.
3. **HubSpot CLI** — `npm i -g @hubspot/cli`, `hs init`, then from this folder:
   `hs upload . market-pages/coffee-shops`

The template resolves the CSS/JS/images with `get_asset_url("./...")`, so as long as
all files sit in the same Design Manager folder (images in `./images/`), no paths
need editing. If you arrange files differently, update the `{% set ... %}` block and
the `require_css` / `require_js` lines at the top/bottom of `template.html`.

## Creating the page

1. Marketing > Website > Website Pages > Create. Pick "Market Page - Coffee Shops"
   (it appears under coded templates).
2. Set the page title and meta description in page settings (the template reads
   `page_meta`).
3. All three CTA buttons open https://www.checkit.net/checkit-demo in a new tab.

## What changed vs. the Next.js page

- `DemoRequestButton` (React modal + `/api/demo-request`) is replaced by links to
  the site's existing demo page (`https://www.checkit.net/checkit-demo`), opening
  in a new tab. Change the URL via the `{% set demo_url %}` line in the template.
  Those leads land in HubSpot directly and won't flow through the Next.js lead
  pipeline (lead scoring, Inngest, etc.).
- Header and footer come from the checkit.net theme's global partials via the
  base layout.
- The "All Markets" back-link was removed (no equivalent page on checkit.net).
- The revenue calculator is plain JS (`calculator.js`), functionally identical.
- Fonts load from Google Fonts (League Spartan), same as the marketing app.

## Editing copy

Copy lives directly in `template.html` (it is not marketer-editable in the page
editor, apart from the form). To change copy: edit the HTML in the Design Manager,
or regenerate from the Next.js source (below). If marketer-editable copy becomes a
real need, the next step is converting sections to HubL modules with fields —
worth doing only if pages will be cloned/edited often without a developer.

## Regenerating after the Next.js page changes

With the dev server running (`npm run dev`):

```bash
cd hubspot/coffee-shops
curl -s -o _rendered.html http://localhost:3000/markets/coffee-shops
node extract.js          # -> _body.html (strips React bits, swaps CTAs)
node build-template.js   # -> template.html
npx @tailwindcss/cli@4 -i tailwind-input.css -o coffee-shops.css --minify
node build-preview.js    # -> preview.html for local visual QA (optional)
```

Then re-upload `template.html` and `coffee-shops.css`. If the calculator changed,
mirror the change in `calculator.html` + `calculator.js` manually.

`preview.html` is a HubL-free local build for QA — serve the repo root
(`python3 -m http.server`) and open it in a browser.
