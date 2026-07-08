/**
 * One-off extraction script: takes the server-rendered coffee-shops page
 * (_rendered.html) and produces clean body markup (_body.html) for the
 * HubSpot template. Not needed at runtime.
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const html = fs.readFileSync(path.join(__dirname, '_rendered.html'), 'utf8');
const $ = cheerio.load(html);

// The page root is the first child of <main>
const root = $('main > div.min-h-screen.bg-white').first();
if (!root.length) {
  console.error('Could not find page root');
  process.exit(1);
}

// Remove any scripts/templates that leaked in
root.find('script, template').remove();

// Replace demo-request <button> elements with anchor placeholders.
// They are the only <button> elements apart from the calculator (which has none).
let ctaIndex = 0;
root.find('button').each(function () {
  const btn = $(this);
  const classes = btn.attr('class') || '';
  const label = btn.text().trim();
  ctaIndex += 1;
  const a = $('<a></a>')
    .attr('href', 'DEMO_URL_PLACEHOLDER')
    .attr('class', classes)
    .html(btn.html());
  btn.replaceWith(a);
  console.log(`CTA ${ctaIndex}: "${label}"`);
});

// Replace the revenue calculator (client component) with a placeholder.
// Its root is the div with class "mt-10 rounded-2xl".
const calc = root.find('div.mt-10.rounded-2xl').first();
if (calc.length) {
  calc.replaceWith('\n<!-- CALCULATOR_PLACEHOLDER -->\n');
  console.log('Calculator replaced with placeholder');
} else {
  console.warn('WARNING: calculator root not found');
}

fs.writeFileSync(path.join(__dirname, '_body.html'), root.prop('outerHTML'));
console.log('Wrote _body.html,', root.prop('outerHTML').length, 'chars');
