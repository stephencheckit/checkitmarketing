/**
 * One-off extraction: takes the server-rendered forecourts page
 * (_rendered.html) and produces clean body markup (_body.html).
 */
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const html = fs.readFileSync(path.join(__dirname, '_rendered.html'), 'utf8');
const $ = cheerio.load(html);

const root = $('main > div.min-h-screen.bg-white').first();
if (!root.length) {
  console.error('Could not find page root');
  process.exit(1);
}

root.find('script, template').remove();

// Replace demo-request <button> elements with anchor placeholders
root.find('button').each(function () {
  const btn = $(this);
  const a = $('<a></a>')
    .attr('href', 'DEMO_URL_PLACEHOLDER')
    .attr('class', btn.attr('class') || '')
    .html(btn.html());
  btn.replaceWith(a);
  console.log(`CTA: "${btn.text().trim()}"`);
});

fs.writeFileSync(path.join(__dirname, '_body.html'), root.prop('outerHTML'));
console.log('Wrote _body.html,', root.prop('outerHTML').length, 'chars');
