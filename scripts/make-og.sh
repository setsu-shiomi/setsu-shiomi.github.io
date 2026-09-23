#!/usr/bin/env bash
# Regenerate the Open Graph image from assets/og.svg.
set -euo pipefail
cd "$(dirname "$0")/.."
rsvg-convert -w 1200 -h 630 assets/og.svg -o public/og.png
echo "wrote public/og.png"
