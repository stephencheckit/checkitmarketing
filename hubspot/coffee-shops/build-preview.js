/**
 * Builds preview.html — a local, HubL-free version of template.html for
 * visual QA. Loads the real checkit.net theme CSS BEFORE our stylesheet to
 * surface any cascade conflicts the page will face inside the theme layout.
 * Run: node build-preview.js, then serve the repo root and open it.
 */
const fs = require('fs');
const path = require('path');

let t = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

// Strip template annotation and HubL block/extends wrappers
t = t
  .replace(/<!--\s*templateType[\s\S]*?-->\n?/, '')
  .replace(/\{%\s*extends[^%]*%\}\n?/, '')
  .replace(/\{%\s*(end)?block[^%]*%\}\n?/g, '')
  .replace(/\{%\s*set[\s\S]*?%\}\n?/g, '')
  .replace(/\{\{\s*require_(css|js)\([\s\S]*?\)\s*\}\}\n?/g, '')
  .replaceAll('{{ demo_url }}', 'https://www.checkit.net/checkit-demo')
  .replaceAll('{{ hero_image }}', '../../public/markets/coffee-shops/hero.jpg')
  .replaceAll('{{ journey_image }}', '../../public/markets/coffee-shops/journey.jpg')
  .replaceAll('{{ platform_image }}', '../../public/markets/coffee-shops/platform.webp');

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
<title>Coffee Shops (theme-conflict preview)</title>
<!-- Real theme CSS from checkit.net, loaded first like on the live site -->
<link rel="stylesheet" href="https://www.checkit.net/hubfs/hub_generated/template_assets/1/49164635281/1782377134070/template_pwr.min.css">
<link href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="./coffee-shops.css">
</head>
<body>
<div class="body-wrapper">
<header style="background:#020233;color:#fff;padding:20px 40px;font-family:sans-serif">[checkit.net theme header renders here]</header>
${t}
<footer style="background:#020233;color:#fff;padding:40px;font-family:sans-serif">[checkit.net theme footer renders here]</footer>
</div>
<script src="./calculator.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'preview.html'), page);
console.log('Wrote preview.html');
