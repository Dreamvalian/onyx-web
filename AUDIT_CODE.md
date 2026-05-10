# Code Quality Audit — onyx-web

**Project**: `/root/onyx-web` — Next.js 14 dashboard (dashboard.ko4lax.dev)
**Date**: 2026-04-22
**Total LOC**: ~12,536 lines (src/)

---

## 1. TypeScript Strictness ✅

```json
// tsconfig.json
"strict": true
```

**Verdict**: STRICT MODE ENABLED. Good. No `strictNullChecks`, `noUncheckedIndexedAccess`, or `exactOptionalPropertyTypes` exclusions found.

---

## 2. `any` Type Usage ✅

```
grep -rn ': any\|as any\|<any>' src/ --include='*.ts' --include='*.tsx'
```

**Count**: 1 instance total

| File | Line | Usage |
|------|------|-------|
| `src/components/landing/emotional-design-lab.tsx` | 348 | `useState<any>(null)` |

**Verdict**: MINIMAL. Only one `any` found in the emotional-design-lab component (line 348). This is in an aggregate state which is typed loosely — acceptable for now but should be typed properly.

---

## 3. `console.log` in Production ⚠️

```
grep -rn 'console.log' src/ --include='*.ts' --include='*.tsx'
```

**Count**: 0 instances

**Verdict**: CLEAN. No `console.log` statements found in source.

---

## 4. TODO / FIXME / HACK Comments ✅

```
grep -rni 'TODO\|FIXME\|HACK\|XXX' src/
```

**Count**: 0 instances

**Verdict**: CLEAN. No pending TODO/FIXME/HACK/XXX markers found.

---

## 5. next.config.mjs Security Headers ❌

```js
// next.config.mjs
const nextConfig = {
  images: { domains: ["cdn.discordapp.com"] },
  output: "standalone",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { cpus: 2, optimizeCss: false },
  swcMinify: false,
};
```

**Issues**:
- **No security headers** (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) — critical gap
- **`ignoreBuildErrors: true`** — TypeScript errors are silently ignored during build (dangerous for production)
- **`eslint: { ignoreDuringBuilds: true }`** — linting disabled at build time

**Verdict**: NEEDS ATTENTION. Add a `headers()` export with at minimum:
- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

---

## 6. React Error Boundaries ❌

```
grep -rni 'ErrorBoundary\|error boundary\|getDerivedStateFromError' src/
```

**Count**: 0 instances

**Verdict**: MISSING. No React error boundary component found anywhere in the app. Critical for preventing full-page crashes in production. Should have at least one root-level error boundary wrapping the dashboard content.

---

## 7. API Route Error Handling ⚠️

**Total API routes**: 24

Most routes properly wrap handlers in `try/catch`. Patterns observed:

| Route | try/catch | Notes |
|-------|-----------|-------|
| `api/system-logs/route.ts` | ✅ | Outer + inner nested try |
| `api/deploy/route.ts` | ✅ | `e: unknown` typed catch |
| `api/stream/hermes/route.ts` | ⚠️ | SSE stream — no outer try/catch on `GET()` |
| `api/stream/logs/route.ts` | ✅ | Has inner try, minor catch |
| `api/stream/sessions/route.ts` | ✅ | Has try/catch |
| `api/guestbook/route.ts` | ✅ | GET and POST both wrapped |
| `api/memory/route.ts` | ✅ | GET wrapped |
| `api/memory/timeline/route.ts` | ✅ | GET wrapped |
| `api/metrics/route.ts` | ✅ | Catch returns graceful fallback |
| `api/status/route.ts` | ✅ | Catch returns 500 |
| `api/sessions/route.ts` | ✅ | `e: unknown` typed |

**Issues**:
- SSE streams (`stream/hermes`) do async work in `start()` without a wrapping try/catch on the outer handler — Redis connection failures on startup will throw uncaught
- Some catches use bare `catch { }` without error logging (silent failures)

**Verdict**: MOSTLY GOOD. A few SSE routes need outer error wrapping.

---

## 8. Environment Files & .gitignore ✅

### `.gitignore`
```
node_modules/
.next/
out/
build/
dist/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.pem
*.tsbuildinfo
next-env.d.ts
.idea/
.vscode/
.vercel/
```

**Verdict**: COMPREHENSIVE. All standard patterns covered including `.env*` variants.

### Environment files
| File | Status |
|------|--------|
| `.env` | ✅ absent (correct — never committed) |
| `.env.local` | ✅ present locally only |
| `.env.local.example` | ✅ exists with template vars |

**Env vars in `.env.local.example`**:
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI`
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `NEXT_PUBLIC_BASE_URL`
- `DEPLOY_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY`

**Verdict**: GOOD. `.env` properly excluded, example file provided.

---

## 9. Lines of Code

```
find src/ -name '*.ts' -o -name '*.tsx' | xargs wc -l
```

| Metric | Value |
|--------|-------|
| Total src/ LOC | ~12,536 |
| Largest file | `emotional-design-lab.tsx` (1,684 lines) |
| API routes | 24 files |
| Components | ~35 files |

---

## Summary Table

| Check | Status | Notes |
|-------|--------|-------|
| TypeScript strict | ✅ PASS | `strict: true` enabled |
| `any` usage | ✅ PASS | Only 1 instance |
| `console.log` | ✅ PASS | None found |
| TODO/FIXME/HACK | ✅ PASS | None found |
| Security headers | ❌ FAIL | Missing CSP, X-Frame-Options, etc. |
| Error boundaries | ❌ FAIL | None implemented |
| API error handling | ⚠️ WARN | Most OK, SSE streams need fixes |
| .env / .gitignore | ✅ PASS | Well configured |
| LOC | ℹ️ INFO | 12,536 lines across 60+ files |

---

## Priority Fixes

1. **[HIGH]** Add security headers to `next.config.mjs`
2. **[HIGH]** Implement React error boundary (at minimum around dashboard content)
3. **[MED]** Wrap SSE stream handlers (`stream/hermes`, `stream/logs`) in outer try/catch
4. **[LOW]** Replace `useState<any>` in `emotional-design-lab.tsx` with a typed interface
5. **[LOW]** Consider enabling `typescript.ignoreBuildErrors: false` — currently hidden
