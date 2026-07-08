/**
 * Assembles template.html (HubSpot coded page template) from _body.html.
 * Extends the POWER THEME Checkit base layout for site header/footer.
 * Run: node build-template.js
 */
const fs = require('fs');
const path = require('path');

let body = fs.readFileSync(path.join(__dirname, '_body.html'), 'utf8');

// CTAs open the site's canonical demo page in a new tab
body = body.replaceAll(
  'href="DEMO_URL_PLACEHOLDER"',
  'href="{{ demo_url }}" target="_blank" rel="noopener"'
);

// Remove the "All Markets" back-link (no equivalent page on checkit.net)
body = body.replace(/<a[^>]*href="\/industries"[\s\S]*?<\/a>/, '');

// Externally hotlinked images -> HubSpot-hosted copies.
// URLs live inside style="background-image:url(&quot;...&quot;)" — match up to
// (but not including) the closing &quot;) so the quote survives.
const unsplash = (id) =>
  new RegExp(`https:\\/\\/images\\.unsplash\\.com\\/${id}[^)]*?(?=&quot;\\))`, 'g');
body = body.replace(unsplash('photo-1579154204601'), '{{ hero_image }}');
body = body.replace(unsplash('photo-1451187580459'), '{{ narrative_image }}');
body = body.replace(unsplash('photo-1618005182384'), '{{ excursion_image }}');
body = body.replace(unsplash('photo-1476820865390'), '{{ journey_image }}');
body = body.replaceAll('https://checkitv6.com/checkit%20v6-1.webp', '{{ platform_image }}');

// Scope marker for the CSS reset (see tailwind-input.css)
body = body.replace(
  '<div class="min-h-screen bg-white">',
  '<div class="ck-coffee-page min-h-screen bg-white">'
);

const template = `<!--
  templateType: page
  isAvailableForNewContent: true
  label: Market Page - Pathology Networks
-->
{% extends "/POWER THEME Checkit/templates/layouts/base.html" %}
{% block body %}
{% set demo_url = "https://www.checkit.net/checkit-demo" %}
{% set hero_image = get_asset_url("./images/hero.jpg") %}
{% set narrative_image = get_asset_url("./images/narrative.jpg") %}
{% set excursion_image = get_asset_url("./images/excursion.jpg") %}
{% set journey_image = get_asset_url("./images/journey.jpg") %}
{% set platform_image = get_asset_url("./images/platform.png") %}
{{ require_css("https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700&display=swap") }}
{{ require_css(get_asset_url("./pathology.css")) }}
<main id="main-content" class="body-container-wrapper">
${body}
</main>
{% endblock body %}
`;

fs.writeFileSync(path.join(__dirname, 'template.html'), template);
console.log('Wrote template.html,', template.length, 'chars');
const leftover = body.match(/https:\/\/(images\.unsplash|checkitv6)[^"')]*/g);
console.log('leftover external images:', leftover ? leftover.length : 0);
