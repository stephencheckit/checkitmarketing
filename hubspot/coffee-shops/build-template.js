/**
 * Assembles template.html (HubSpot coded page template) from:
 *   _body.html      — extracted server-rendered page markup
 *   calculator.html — static calculator markup (driven by calculator.js)
 *
 * The template extends the live site's POWER THEME Checkit base layout so it
 * inherits the real checkit.net header, footer, fonts, and tracking.
 * Run: node build-template.js
 */
const fs = require('fs');
const path = require('path');

const read = (f) => fs.readFileSync(path.join(__dirname, f), 'utf8');

let body = read('_body.html');
const calculator = read('calculator.html');

// CTAs open the site's canonical demo page in a new tab
body = body.replaceAll(
  'href="DEMO_URL_PLACEHOLDER"',
  'href="{{ demo_url }}" target="_blank" rel="noopener"'
);

// Remove the "All Markets" back-link (its target doesn't exist on checkit.net)
body = body.replace(/<a[^>]*href="\/industries"[\s\S]*?<\/a>/, '');

// Images become HubL variables (set inside the body block)
body = body.replaceAll('/markets/coffee-shops/hero.jpg', '{{ hero_image }}');
body = body.replaceAll('/markets/coffee-shops/journey.jpg', '{{ journey_image }}');
body = body.replaceAll('/markets/coffee-shops/platform.webp', '{{ platform_image }}');

// Drop the calculator back in
body = body.replace('<!-- CALCULATOR_PLACEHOLDER -->', calculator.trim());

// Secondary CTA: blue accents -> corporate teal
body = body
  .replaceAll('bg-blue-50!', 'bg-teal-50!')
  .replaceAll('text-blue-700!', 'text-teal-700!')
  .replaceAll('hover:bg-blue-100!', 'hover:bg-teal-100!');

// Scope marker for the CSS reset (see tailwind-input.css)
body = body.replace(
  '<div class="min-h-screen bg-white">',
  '<div class="ck-coffee-page min-h-screen bg-white">'
);

const template = `<!--
  templateType: page
  isAvailableForNewContent: true
  label: Market Page - Coffee Shops
-->
{% extends "/POWER THEME Checkit/templates/layouts/base.html" %}
{% block body %}
{% set demo_url = "https://www.checkit.net/checkit-demo" %}
{% set hero_image = get_asset_url("./images/hero.jpg") %}
{% set journey_image = get_asset_url("./images/journey.jpg") %}
{% set platform_image = get_asset_url("./images/platform.png") %}
{{ require_css("https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700&display=swap") }}
{{ require_css(get_asset_url("./coffee-shops.css")) }}
<main id="main-content" class="body-container-wrapper">
${body}
</main>
{{ require_js(get_asset_url("./calculator.js"), "footer") }}
{% endblock body %}
`;

fs.writeFileSync(path.join(__dirname, 'template.html'), template);
console.log('Wrote template.html,', template.length, 'chars');
