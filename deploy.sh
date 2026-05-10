#!/bin/bash
set -e

APP="/root/projects/onyx-web"

echo "[$(date)] Starting deploy..."

# 1. Kill existing server
echo "[1/4] Stopping server..."
pm2 stop hermes-web 2>/dev/null || pkill -9 -f "next-server" 2>/dev/null || true
sleep 2

# 2. Build
echo "[2/4] Building..."
cd "$APP"
npm run build 2>&1 | tail -5
echo "     Build complete."

# 3. Copy static assets to standalone
echo "[3/4] Copying static assets..."
cp -r public .next/standalone/ 2>/dev/null
cp -r .next/static .next/standalone/.next/ 2>/dev/null

# 4. Start server via PM2
echo "[4/4] Starting server..."
pm2 delete hermes-web 2>/dev/null || true
pm2 start ecosystem.config.js
sleep 4

# 5. Verify
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/home")
if [ "$HTTP_CODE" = "200" ]; then
    echo "[OK] Deploy successful. Site live at ko4lax.dev (HTTP $HTTP_CODE)"
else
    echo "[FAIL] Server returned HTTP $HTTP_CODE"
    exit 1
fi
