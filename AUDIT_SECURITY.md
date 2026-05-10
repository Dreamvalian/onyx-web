# API Security Audit Report

**Project:** `/root/onyx-web/` — Next.js 14 app (dashboard.ko4lax.dev)
**Audited:** 24 API route files + middleware.ts + discord-auth.ts
**Date:** 2026-04-22

---

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 1 |
| 🟠 HIGH | 5 |
| 🟡 MEDIUM | 6 |
| 🟢 LOW / INFO | 5 |

**No SQL injection, no command injection, no path traversal, no SSRF was found.** However, there are significant concerns around missing authentication, verbose errors, and unsafe patterns.

---

## 1. CRITICAL Findings

### 🔴 `POST /api/deploy` — Arbitrary Command Execution via Webhook

**File:** `src/app/api/deploy/route.ts` (lines 1–30)

```typescript
const WEBHOOK_SECRET=proces...CRET ?? ""
// ...
const { action } = await req.json().catch(() => ({}))
if (action === "restart") {
  execSync("cd /root/claw-landing-new && npm run build 2>&1", { timeout: 120 })
}
if (action === "pull") {
  execSync("cd /root/claw-landing-new && git pull origin main 2>&1", { timeout: 60 })
}
```

**Issues:**
1. **Hardcoded shell commands with no input sanitization** — but `action` is validated against a fixed allowlist (`restart`, `pull`), so command injection is mitigated *if* the allowlist is exhaustive.
2. **`WEBHOOK_SECRET` comparison is case-sensitive naive string comparison** — timing attack possible (negligible here).
3. **No rate limiting** — an attacker with the secret can spam deploys.
4. **`execSync` output (stdout/stderr) is not sanitized before returning in JSON** — could leak filesystem/environment details.
5. **If `WEBHOOK_SECRET` env var is empty/null**, the route silently allows all requests (`"" !== "Bearer ...` always true).

**Recommendation:** Add secret length check, use `timingSafeEqual`, add rate limiting, sanitize exec output, and add an explicit `if (!WEBHOOK_SECRET) return 401` guard.

---

## 2. HIGH Findings

### 🟠 `POST /api/logs` — No Authentication on State-Changing Endpoint

**File:** `src/app/api/logs/route.ts` (lines 32–61)

```typescript
export async function POST(req: NextRequest) {
  const { command, response, server } = body
  // ...
  await redis.lpush("hermes:logs", JSON.stringify(entry))
  await redis.incr("hermes:metrics:commands_today")
  await redis.publish("hermes:logs:changed", ...)
}
```

Any unauthenticated caller can write arbitrary log entries to Redis, pollute metrics, and trigger SSE broadcasts.

**Also:** `DELETE /api/logs` (line 63) — no auth, deletes all logs.

### 🟠 `GET|POST|PUT|DELETE /api/session` — No Authentication

**File:** `src/app/api/session/route.ts`

```typescript
export async function GET(req: NextRequest) {
  const key = searchParams.get("key")
  const value = await redis.get(`hermes:session:${key}`)
  // ...
}
export async function DELETE(req: NextRequest) {
  const key = searchParams.get("key")
  await redis.del(`hermes:session:${key}`)
}
```

Arbitrary Redis key read/write/delete. No auth check. While keys are not directly guessable, the keyspace is exposed.

### 🟠 `GET|POST|PUT|DELETE /api/prompts` — No Authentication

**File:** `src/app/api/prompts/route.ts`

Full CRUD on `hermes:prompts` Redis hash — anyone can create, modify, or delete prompt templates used by the agent.

### 🟠 `GET /api/system-logs` — No Authentication + Path Exposure

**File:** `src/app/api/system-logs/route.ts` (lines 59–117)

```typescript
const hermesHome = process.env.HERMES_HOME ?? "/root/.hermes"
const logsDir = join(hermesHome, "logs")
// reads ALL .log files from /root/.hermes/logs/
```

Exposes the full contents of all hermes log files (including error messages, tracebacks, Discord bot internals, etc.) to unauthenticated callers.

### 🟠 `GET /api/memory/timeline` — No Authentication + Sensitive File Access

**File:** `src/app/api/memory/timeline/route.ts` (lines 242–293)

Reads and parses:
- `/root/.hermes/logs/agent.log`
- `/root/.hermes/logs/errors.log`
- `/root/.hermes/cron/jobs.json`
- `/root/.hermes/skills/hermes-dojo/data/metrics.json`
- `/root/.pm2/logs/hermes-web-error.log`

All exposed to unauthenticated callers.

---

## 3. MEDIUM Findings

### 🟡 `GET /api/usage` — SQLite Query via `execSync` (Static SQL Only)

**File:** `src/app/api/usage/route.ts` (line 26)

```typescript
return execSync(`sqlite3 -json "${dbPath}" "${sql}"`, {
  encoding: "utf-8",
  timeout: 5000,
}).trim()
```

The `sql` parameter is constructed internally (lines 38–84) with **no external input**. Path is server-controlled. SQL is parameterized. However, the use of `execSync` with shell interpolation is a dangerous pattern — if this function is ever called with unsanitized input in the future, it's game over.

**Also:** `usage/route.ts` returns full session IDs (line 105: `.slice(0, 20)` only truncates in the recent list, but other queries may expose full IDs).

### 🟡 `GET /api/hermes` — No Authentication + Filesystem Path Enumeration

**File:** `src/app/api/hermes/route.ts` (lines 1–144)

```typescript
const hermesHome = process.env.HERMES_HOME ?? "/root/.hermes"
const skillsDir = join(hermesHome, "skills")
const pluginsDir = join(hermesHome, "plugins")
const openclawSkillsPath = "/root/.openclaw/workspace/skills"
```

Exposes server filesystem structure, skill names, plugin names, cron job details, and config contents to unauthenticated callers.

### 🟡 `GET /api/cron-jobs` — No Authentication + Full Job Configuration Exposed

**File:** `src/app/api/cron-jobs/route.ts` (lines 17–82)

Uses `execSync` to call `/root/.local/bin/hermes cron list --all`. Exposes:
- Full cron job schedules
- Delivery targets (including potentially sensitive webhook URLs)
- Last run status
- All cron job names and IDs

### 🟡 `GET /api/memory` — No Authentication + Git/Disk Info + Localhost SSRF

**File:** `src/app/api/memory/route.ts` (lines 356–396)

Exposes git last commit, disk usage, directory structure of `/root/.hermes-brain`, and makes HTTP fetch to `http://localhost:8888/health` (Hindsight API).

### 🟡 `GET /api/mcp` — No Authentication + execSync with Fixed Path

**File:** `src/app/api/mcp/route.ts` (lines 11–51)

```typescript
const raw: Buffer = execSync("/root/.local/bin/hermes mcp list 2>&1", {
  maxBuffer: 10 * 1024 * 1024,
  encoding: "utf-8",
  env,
})
```

Fixed command, but output parsing could reveal MCP server names/configs. No auth.

### 🟡 `GET /api/health` — No Authentication

**File:** `src/app/api/health/route.ts` (lines 251–272)

Exposes tool success rates, weakest tools, skill freshness, Honcho/Hindsight/Redis connection status, cron job list. Useful reconnaissance data for attackers.

---

## 4. LOW / INFO Findings

### 🟢 `GET /api/status` — Redis-only, No Sensitive Data

**File:** `src/app/api/status/route.ts` — Minimal exposure, only Redis latency/uptime. Acceptable.

### 🟢 `GET /api/metrics` — Hermes Metrics Only

**File:** `src/app/api/metrics/route.ts` — Commands today, last active, server count, uptime. Low sensitivity.

### 🟢 `GET /api/sessions` — No Auth, but Data is Aggregated

**File:** `src/app/api/sessions/route.ts` — Returns session list without full tokens. Some `chat_id`/`user_name` exposure. Acceptable for internal dashboard.

### 🟢 `GET /api/lab-results` — Minimal Personal data

**File:** `src/app/api/lab-results/route.ts` — Stores `userAgent` header on POST. GET only returns aggregates. Could store IP via `x-forwarded-for` if logged. Note: `userAgent` on lab results is minor PII.

### 🟢 `GET /api/guestbook` — Rate-Limited, Input Validated

**File:** `src/app/api/guestbook/route.ts` — Has rate limiting (3 POSTs/min per IP), message length limits, URL blocking. Well-hardened for a public endpoint.

---

## 5. Auth Flow Analysis

### `middleware.ts` — No API Auth Enforcement

**File:** `src/middleware.ts` (lines 1–26)

```typescript
export function middleware(request: NextRequest) {
  // Only does host-based routing (dashboard.ko4lax.dev vs ko4lax.dev)
  // No authentication check on any API route
}
```

**No API route is protected by middleware.ts.** The middleware only handles subdomain routing.

### `src/lib/discord-auth.ts` — Auth Implementation

- `getServerSession()`: Reads `discord_session` httpOnly cookie, validates expiry, auto-refreshes tokens. ✅
- `exchangeCode()`: Exchanges OAuth code for tokens. ✅
- Session cookie: `httpOnly: true`, `sameSite: "lax"`, `secure` in production. ✅
- Discord tokens stored in client-side cookie (not in localStorage). ✅

**Problem:** The session cookie is only used by `getServerSession()` which is called by server-side page components — **no API route actually calls `getServerSession()` to protect itself**. All API routes are unauthenticated.

### `GET /api/auth/discord` — OAuth Redirect

**File:** `src/app/api/auth/discord/route.ts` — Redirects to Discord OAuth. No auth protection needed (it's the login entry point).

### `GET /api/auth/discord/callback` — OAuth Callback

**File:** `src/app/api/auth/discord/callback/route.ts` — Validates `code`/`error` params, sets session cookie, redirects to dashboard. Properly secured.

---

## 6. Command Injection Analysis

### Routes Using `exec`/`execSync`:

| Route | Method | Pattern | Risk |
|-------|--------|---------|------|
| `usage/route.ts` | GET | `execSync(sqlite3 ... "${sql}")` | SQL is static, hardcoded path. Low risk but dangerous pattern. |
| `memory/route.ts` | GET | `execAsync(git log ... du ... sqlite3 ...)` | Hardcoded paths. Low risk. |
| `health/route.ts` | GET | `execAsync(python3 -c "...", python3 scripts ... tail ...)` | Hardcoded paths. Low risk. |
| `memory/timeline/route.ts` | GET | `execAsync(tail ...)` | Hardcoded paths. Low risk. |
| `mcp/route.ts` | GET | `execSync("/root/.local/bin/hermes mcp list")` | Fixed command. Low risk. |
| `cron-jobs/route.ts` | GET | `execSync("/root/.local/bin/hermes cron list --all")` | Fixed command. Low risk. |
| `cron-debug/route.ts` | GET | `execSync("echo ... which hermes ... hermes cron list")` | Fixed commands. Low risk. |
| `deploy/route.ts` | POST | `execSync("cd /root/claw-landing-new && npm run build ... git pull ...")` | Action allowlisted but shell interpolation. Medium risk. |

**No command injection found** — all exec calls use hardcoded commands with no user-input interpolation.

---

## 7. CORS Analysis

**No CORS configuration found on any API route.** No `Access-Control-Allow-Origin` headers are set. This means:
- Browser-based attacks (CSRF, data exfiltration) are limited by SOP
- Non-browser clients (curl, server-to-server) are unaffected
- SSE streams (`/api/stream/hermes`, `/api/stream/sessions`, `/api/stream/logs`) work correctly without CORS

---

## 8. CSRF Analysis

**No CSRF protection on any state-changing endpoint.** All `POST`/`PUT`/`DELETE` routes lack:
- CSRF tokens
- `Origin` header validation
- `SameSite=Strict` cookies

However, most routes don't use cookie-based auth (no session cookies), so CSRF is less critical. The main concern is:
- `POST /api/logs` — could be CSRF'd to write fake entries
- `POST /api/deploy` — already protected by Bearer token (though weakly)
- `POST /api/prompts` / `PUT` / `DELETE` — no auth at all

---

## 9. Rate Limiting

| Route | Rate Limited? |
|-------|--------------|
| `POST /api/guestbook` | ✅ 3/min per IP |
| All other routes | ❌ No |

---

## 10. Sensitive Data Exposure via `grep` Results

**Files containing `password`, `secret`, `token`, `api_key` patterns:**

| File | Context | Risk |
|------|---------|------|
| `src/lib/discord-auth.ts` | `CLIENT_SECRET`, `access_token`, `refresh_token` | ✅ Secrets from env vars, not hardcoded |
| `src/app/api/deploy/route.ts` | `WEBHOOK_SECRET` env var | ✅ Loaded from env |
| `src/app/api/auth/discord/callback/route.ts` | `BASE_URL`, `DASHBOARD_URL` env vars | ✅ Loaded from env |
| `src/app/auth/discord/route.ts` | `CLIENT_ID`, `REDIRECT_URI` env vars | ✅ Loaded from env |
| Session/token fields throughout | TypeScript interfaces (`access_token`, `refresh_token`) | ✅ Interfaces only, no actual values |

**No hardcoded secrets, passwords, or API keys found in source code.**

---

## 11. SSRF Analysis

**No SSRF found.** External fetches are limited to:
- `http://localhost:8888/health` (Hindsight, line 186 in `memory/route.ts`)
- `http://127.0.0.1:8001/v3/workspaces/koala/conclusions/list` (Hindsight, line 132 in `health/route.ts`)
- `https://discord.com/api/v10/...` (Discord OAuth)

All are localhost or known-trusted APIs. No user-controlled URL fetch.

---

## 12. Recommendations (Priority Order)

1. **Add authentication to all API routes** — at minimum, check `getServerSession()` on all non-public routes
2. **Fix `deploy/route.ts`** — add explicit empty-secret guard, sanitize output, add rate limiting
3. **Add CSRF tokens** to `POST /api/logs`, `POST /api/prompts`, `PUT /api/prompts`, `DELETE /api/logs`
4. **Add rate limiting** to `POST /api/logs`, `POST /api/prompts`, `GET /api/system-logs`, `GET /api/memory`
5. **Sanitize error messages** — avoid returning raw `String(e)` in API responses
6. **Consider `sameSite: 'strict'`** on session cookies once API auth is in place
7. **Truncate session IDs consistently** in `usage/route.ts` (apply `.slice(0, 20)` everywhere)
8. **Remove `userAgent` storage** in `lab-results/route.ts` or anonymize it

---

## Route-by-Route Summary Table

| Route | Auth | SQL Inj | Cmd Inj | Rate Lim | SSRF | CORS | Sensitive Data |
|-------|------|---------|---------|----------|------|------|----------------|
| `GET /api/health` | ❌ | — | ✅ | ❌ | ✅ | N/A | ✅ tool metrics, skill freshness |
| `GET /api/status` | ❌ | — | — | ❌ | — | N/A | ✅ Redis latency |
| `GET /api/metrics` | ❌ | — | — | ❌ | — | N/A | ✅ Hermes metrics |
| `GET /api/usage` | ❌ | ✅ static | ✅ hardcoded | ❌ | — | N/A | ✅ session tokens, costs |
| `GET /api/sessions` | ❌ | — | — | ❌ | — | N/A | ✅ chat_id, user_name |
| `GET|POST /api/logs` | ❌ | — | — | ❌ | — | N/A | ✅ can write fake logs |
| `GET|POST|PUT|DELETE /api/prompts` | ❌ | — | — | ❌ | — | N/A | ✅ full prompt CRUD |
| `GET|POST|DELETE /api/session` | ❌ | — | — | ❌ | — | N/A | ✅ Redis key access |
| `GET /api/hermes` | ❌ | — | ✅ hardcoded | ❌ | — | N/A | ✅ filesystem paths |
| `GET /api/memory` | ❌ | — | ✅ hardcoded | ❌ | ✅ localhost | N/A | ✅ git, disk, memory stats |
| `GET /api/memory/timeline` | ❌ | — | ✅ hardcoded | ❌ | — | N/A | ✅ logs, errors, PM2 |
| `GET /api/system-logs` | ❌ | — | ✅ hardcoded | ❌ | — | N/A | ✅ full log contents |
| `GET /api/cron-jobs` | ❌ | — | ✅ hardcoded | ❌ | — | N/A | ✅ full job configs |
| `GET /api/mcp` | ❌ | — | ✅ hardcoded | ❌ | — | N/A | ✅ MCP server list |
| `GET /api/cron-debug` | ❌ | — | ✅ hardcoded | ❌ | — | N/A | ✅ system diagnostics |
| `GET|POST /api/lab-results` | ❌ | — | — | ❌ | — | N/A | ✅ userAgent stored |
| `GET|POST /api/guestbook` | ❌ | — | — | ✅ POST | — | N/A | ✅ public, minimal |
| `GET /api/stream/hermes` | ❌ | — | — | ❌ | — | N/A | ✅ SSE, same as /hermes |
| `GET /api/stream/sessions` | ❌ | — | — | ❌ | — | N/A | ✅ SSE, same as /sessions |
| `GET /api/stream/logs` | ❌ | — | — | ❌ | — | N/A | ✅ SSE, same as /logs |
| `GET /api/auth/discord` | N/A | — | — | ❌ | — | N/A | ✅ OAuth redirect |
| `GET /api/auth/discord/callback` | ✅ | — | — | ❌ | — | N/A | ✅ sets session cookie |
| `POST /api/deploy` | ⚠️ Bearer | ✅ allowlist | ⚠️ shell | ❌ | — | N/A | ✅ arbitrary deploy |
| `GET /api/cron` | ❌ | — | — | ❌ | — | N/A | ✅ heartbeat only |
