#!/usr/bin/env bash
# Renders a flyer HTML to PDF using local Chrome.
#   ./build.sh [letter|a4] [index.html|index-v2.html]
set -euo pipefail
cd "$(dirname "$0")"

SIZE="${1:-letter}"
SRC="${2:-index.html}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

SUFFIX=""
case "$SRC" in index-*.html) SUFFIX="-${SRC#index-}"; SUFFIX="${SUFFIX%.html}";; esac
OUT="Checkit-CAM+-Medical-Monitoring-MSC-Expo-2026${SUFFIX}-${SIZE}.pdf"

# Swap the body class so the @page rule matches the requested paper size.
TMP="$(mktemp -d)"
cp qr-medical-monitoring.svg "$TMP/"
sed "s/<body class=\"letter\">/<body class=\"${SIZE}\">/" "$SRC" \
  | sed "s#\.\./\.\./public/#$(pwd)/../../public/#g" > "$TMP/index.html"

"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw --virtual-time-budget=3000 \
  --print-to-pdf="$(pwd)/$OUT" \
  "file://$TMP/index.html" 2>/dev/null

rm -rf "$TMP"
echo "wrote $OUT"
