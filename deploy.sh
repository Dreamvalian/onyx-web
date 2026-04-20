#!/bin/bash
set -e

APP="/root/onyx-web"

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

# 3. Start server via PM2
echo "[3/4] Starting server..."
pm2 delete hermes-web 2>/dev/null || true
cd "$APP/.next/standalone"
pm2 start server.js --name hermes-web -i 1 --time
sleep 4

# 4. Verify
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/home")
if [ "$HTTP_CODE" = "200" ]; then
    echo "[OK] Deploy successful. Site live at ko4lax.dev (HTTP $HTTP_CODE)"
else
    echo "[FAIL] Server returned HTTP $HTTP_CODE"
    exit 1
fi
