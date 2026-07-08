/**
 * Builds preview.html — local HubL-free version with the real checkit.net
 * theme CSS loaded first, to surface cascade conflicts.
 */
const fs = require('fs');
const path = require('path');

let t = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

t = t
  .replace(/<!--\s*templateType[\s\S]*?-->\n?/, '')
  .replace(/\{%\s*extends[^%]*%\}\n?/, '')
  .replace(/\{%\s*(end)?block[^%]*%\}\n?/g, '')
  .replace(/\{%\s*set[\s\S]*?%\}\n?/g, '')
  .replace(/\{\{\s*require_(css|js)\([\s\S]*?\)\s*\}\}\n?/g, '')
  .replaceAll('{{ demo_url }}', 'https://www.checkit.net/checkit-demo')
  .replaceAll('{{ hero_image }}', './images/hero.jpg')
  .replaceAll('{{ journey_image }}', './images/journey.jpg')
  .replaceAll('{{ platform_image }}', './images/platform.png');

const leftovers = t.match(/\{\{|\{%|\{#/g);
if (leftovers) {
  console.error('Unreplaced HubL remains:', leftovers.length);
  process.exit(1);
}

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Forecourts (theme-conflict preview)</title>
<link rel="stylesheet" href="https://www.checkit.net/hubfs/hub_generated/template_assets/1/49164635281/1782377134070/template_pwr.min.css">
<link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./forecourts.css">
</head>
<body>
<div class="body-wrapper">
<header style="background:#020233;color:#fff;padding:20px 40px;font-family:sans-serif">[checkit.net theme header renders here]</header>
${t}
<footer style="background:#020233;color:#fff;padding:40px;font-family:sans-serif">[checkit.net theme footer renders here]</footer>
</div>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'preview.html'), page);
console.log('Wrote preview.html');
