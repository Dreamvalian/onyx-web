# Infrastructure & Deployment Security Audit
## dashboard.ko4lax.dev

**Audit Date:** 2026-04-22
**Auditor:** Hermes Agent Security Audit
**Target:** `/root/onyx-web/` — Next.js 14 standalone deployment

---

## 1. PM2 Configuration

**File:** `/root/onyx-web/ecosystem.config.js`

### ✅ Good
- `exec mode: cluster_mode` — single instance (`-i 1`) prevents memory leaks from clustering
- `watch & reload: ✘` — file watching disabled (correct for production)
- `NODE_ENV: production`

### 🔴 CRITICAL — Secrets Hardcoded in Source

The PM2 environment block contains **live secrets in plaintext** inside a JS file committed to disk:

```js
DISCORD_CLIENT_SECRET: "G61uOF3TewM88dEs5jxAh-8j8WC9ZzPK",
DEPLOY_WEBHOOK_SECRET: "hermes_deploy_secret_change_me",
```

| Secret | Risk |
|---|---|
| `DISCORD_CLIENT_SECRET` | Full Discord OAuth integration compromise — allows attacker to authenticate as the app |
| `DEPLOY_WEBHOOK_SECRET` | Unauthorized deploy execution — attacker can push arbitrary code |

**Fix:** Use `pm2 start --env` with env vars sourced from `/etc/environment` or a root-owned secrets file, or use PM2's built-in secret management.

### 🔴 CRITICAL — PM2 Running as Root

```
root  20934  PM2 v6.0.14: God Daemon
root  2170494 node server.js  (hermes-web)
```

The Node.js process runs as **UID 0 (root)**. If a remote code execution vulnerability exists in Next.js or any dependency, the attacker gains **full root access** to the server.

**Fix:** Create a dedicated `nextjs` user, set `sudo -u nextjs pm2 start ...`, and set `pm2 set pm2:user nextjs`.

---

## 2. File Permissions

| File | Mode | Owner | Risk |
|---|---|---|---|
| `.env.local` | `0644` (-rw-r--r--) | root | 🔴 WORLD-READABLE — any system user can read secrets |
| `.env.local.example` | `0644` | root | Low (example file) |
| `ecosystem.config.js` | `0644` | root | 🔴 WORLD-READABLE — secrets exposed |
| `deploy.sh` | `0755` (-rwxr-xr-x) | root | ⚠️ Executable by all — deploy script should be `0750` |

**Fix:**
```bash
chmod 600 /root/onyx-web/.env.local
chmod 600 /root/onyx-web/ecosystem.config.js
chmod 750 /root/onyx-web/deploy.sh
chown root:root /root/onyx-web/.env.local /root/onyx-web/ecosystem.config.js
```

---

## 3. SSL / TLS

**Certificate:** Let's Encrypt
- `CN = ko4lax.dev` (shared cert with main site — consider a SAN cert or dedicated)
- Valid: `Apr  3 15:54:31 2026 GMT` → `Jul  2 15:54:30 2026 GMT`
- Auto-renewal should be verified via `certbot renew --dry-run`

### ✅ Good
- `ssl_protocols TLSv1.2 TLSv1.3` — modern, no TLS 1.0/1.1
- `ssl_prefer_server_ciphers off` — client cipher preference (modern clients use AEAD)
- `ssl_ciphers` restricted to ECDHE AES-128-GCM — strong forward secrecy

### ⚠️ Missing
- **No HSTS header** — `Strict-Transport-Security` not set
  - Without HSTS, HTTP→HTTPS redirects are susceptible to SSL stripping
  - Should add: `add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;`
- **Certificate covers `ko4lax.dev` not `dashboard.ko4lax.dev`** — the SSL cert is a wildcard-style cert shared across domains. This is functional but means any subdomain gets the same cert. Consider whether `dashboard.ko4lax.dev` should be explicitly listed.

---

## 4. Security Headers

`curl -sI https://dashboard.ko4lax.dev/` — Headers received:

```
HTTP/1.1 307 Temporary Redirect
Server: nginx/1.24.0 (Ubuntu)
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
Vary: RSC, Next-Router-State-Tree, Next-Router-Prefetch, Accept-Encoding
X-Powered-By: Next.js
```

### 🔴 Missing Security Headers

| Header | Status | Recommended |
|---|---|---|
| `Strict-Transport-Security` | ❌ Not set | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | ❌ Not set | `nosniff` |
| `X-Frame-Options` | ❌ Not set | `DENY` or `SAMEORIGIN` |
| `Content-Security-Policy` | ❌ Not set | Restrict scripts, frames, connectors |
| `Referrer-Policy` | ❌ Not set | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | ❌ Not set | Disable unused browser features |
| `X-XSS-Protection` | ❌ Deprecated | Deprecated; CSP covers this |
| `Server:` | ✅ Suppressed | Reveals nginx version — OK |

### ✅ Positive
- `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate` — good no-store on sensitive pages
- `Server: nginx/1.24.0` — version exposed but unavoidable with nginx

### Fix (nginx config)

Add to the `server` block in `/etc/nginx/sites-enabled/ko4lax-dashboard-ssl`:

```nginx
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
# CSP should be customized for the Next.js app:
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://discord.com https://*.discord.com;" always;
```

> ⚠️ CSP will need iterative tuning — 'unsafe-inline' and 'unsafe-eval' are currently required for Next.js but should be narrowed once the app is audited.

---

## 5. Exposed Config Files

`curl -s https://dashboard.ko4lax.dev/.env`

✅ **NOT EXPOSED** — returns a 404 page (Next.js 404 response), confirming `.env` is not served. This is correct behavior for a Next.js standalone build.

---

## 6. Node.js Version

```
v22.22.2
```

✅ **Acceptable** — Node 22.x is current (LTS is 22.x). v22.22.2 is recent as of April 2026.

---

## 7. Deploy Script Security

**File:** `/root/onyx-web/deploy.sh`

### ✅ Good
- `set -e` — exits on error
- Pulls latest code before build
- Health check after deploy (`curl -o /dev/null -w "%{http_code}"`)

### ⚠️ Issues

1. **Hardcoded path** — `APP="/root/onyx-web"` is fine but if the directory moves, the script breaks
2. **No git ref validation** — deploys whatever is currently on disk; no commit hash verification
3. **No rollback plan** — if health check fails, the old process is killed with no recovery
4. **Kills any `next-server`** — `pkill -9 -f "next-server"` is broad and could kill unrelated processes
5. **No concurrent deploy guard** — two deploys can race

---

## 8. PM2 Stability Concern

```
status:           online
restarts:         22
unstable restarts: 0
```

22 restarts since boot is notable. If `uptime` shows long uptime, this is likely from the original `pkill -9` during deploys. If restarts are spontaneous (not from deploys), investigate memory crashes.

---

## 9. Redis

```
REDIS_HOST: "localhost"
REDIS_PORT: "6379"
```

No authentication configured on Redis (typical default). Since it's localhost-only, this is acceptable for now, but note that any local user can `redis-cli` without auth.

**Fix if Redis is exposed externally:** Add `requirepass` to `/etc/redis/redis.conf` and update the env var.

---

## 10. nginx Reverse Proxy

### ✅ Good
- HTTP → HTTPS redirect (port 80 → 443)
- All standard proxy headers set (`Host`, `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto`)
- `proxy_cache_bypass $http_upgrade` — WebSocket-ready

### ⚠️ Missing
- `proxy_set_header X-Forwarded-Host` — not critical but good for multi-tenant
- Rate limiting on `/api/` endpoints not present
- No fail2ban or brute-force protection at nginx layer

---

## Summary of Findings

| # | Severity | Issue | Location |
|---|---|---|---|
| 1 | 🔴 CRITICAL | PM2 runs as **root** | `pm2 describe hermes-web` |
| 2 | 🔴 CRITICAL | **Secrets in plaintext** in `ecosystem.config.js` | `DISCORD_CLIENT_SECRET`, `DEPLOY_WEBHOOK_SECRET` |
| 3 | 🔴 HIGH | `.env.local` is **world-readable** (0644) | `/root/onyx-web/.env.local` |
| 4 | 🟠 MEDIUM | **Missing HSTS** header | nginx config |
| 5 | 🟠 MEDIUM | **Missing X-Content-Type-Options**, **X-Frame-Options**, **CSP**, **Referrer-Policy** | nginx config |
| 6 | 🟠 MEDIUM | `ecosystem.config.js` is **world-readable** (0644) | same file contains secrets |
| 7 | 🟠 MEDIUM | SSL cert is shared across all `ko4lax.dev` subdomains | Let's Encrypt cert |
| 8 | 🟡 LOW | Redis has no authentication | localhost:6379 |
| 9 | 🟡 LOW | `deploy.sh` has no rollback mechanism | `/root/onyx-web/deploy.sh` |
| 10 | 🟡 LOW | 22 PM2 restarts — confirm none are spontaneous | `pm2 describe hermes-web` |

---

## Recommended Immediate Actions (Priority Order)

1. **Create a non-root user for PM2** and restart the process under that user
2. **Move secrets out of `ecosystem.config.js`** into a root-owned env file or PM2 secret vault
3. **`chmod 600 .env.local ecosystem.config.js`** — remove world-readable permissions
4. **Add security headers to nginx** — HSTS, X-Content-Type-Options, X-Frame-Options minimum
5. **Verify PM2 restart reason** — check logs: `pm2 logs hermes-web --err --lines 50`
6. **Add Redis auth** if Redis is ever exposed beyond localhost
7. **Add HSTS preload directive** once headers are confirmed working
