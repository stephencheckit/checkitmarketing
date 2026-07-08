// Revenue calculator — vanilla JS port of RevenueCalculator.tsx
(function () {
  var PER_SITE_ANNUAL = 18000;
  var siteStops = [
    10, 25, 50, 100, 150, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 4000,
    6000, 8000, 12000, 18000, 25000, 41000,
  ];

  var range = document.getElementById('ck-calc-range');
  var sitesEl = document.getElementById('ck-calc-sites');
  var totalEl = document.getElementById('ck-calc-total');
  if (!range || !sitesEl || !totalEl) return;

  function formatGBP(n) {
    if (n >= 1000000) {
      var m = n / 1000000;
      return '\u00A3' + (m >= 100 ? Math.round(m) : m.toFixed(1)) + 'M';
    }
    if (n >= 1000) return '\u00A3' + Math.round(n / 1000) + 'k';
    return '\u00A3' + n;
  }

  function update() {
    var sites = siteStops[parseInt(range.value, 10)] || siteStops[0];
    sitesEl.textContent = sites.toLocaleString();
    totalEl.textContent = formatGBP(sites * PER_SITE_ANNUAL);
  }

  range.addEventListener('input', update);
  update();
})();
