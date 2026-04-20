import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { readFile, readdir, stat } from "fs/promises"
import { existsSync } from "fs"

export const dynamic = "force-dynamic"
export const revalidate = 0

const execAsync = promisify(exec)

// ── Tool Success Rates (from Dojo metrics) ──

async function getToolMetrics() {
  try {
    const metricsPath = "/root/.hermes/skills/hermes-dojo/data/metrics.json"
    if (!existsSync(metricsPath)) return { tools: [], overallSuccessRate: null, totalRuns: 0 }

    const raw = await readFile(metricsPath, "utf-8")
    const metrics = JSON.parse(raw)
    if (!Array.isArray(metrics) || metrics.length === 0)
      return { tools: [], overallSuccessRate: null, totalRuns: 0 }

    const latest = metrics[metrics.length - 1]
    const weakestTools = Array.isArray(latest.weakest_tools)
      ? latest.weakest_tools.map((t: { tool: string; success_rate: number }) => ({
          name: t.tool,
          successRate: Math.round(t.success_rate), // already 0-100 in Dojo metrics
          status:
            t.success_rate >= 90 ? "healthy" : t.success_rate >= 50 ? "degraded" : "critical",
        }))
      : []

    // Pull tool stats from session logs (last 7 days)
    let toolStats: Array<{ name: string; calls: number; errors: number; successRate: number }> = []
    try {
      const { stdout } = await execAsync(
        `cd /root/.hermes && find logs -name "*.jsonl" -mtime -7 2>/dev/null | head -20 | xargs grep -h '"tool_call"\|"tool_error"\|"tool_result"' 2>/dev/null | python3 -c "
import sys, json
from collections import Counter
calls = Counter()
errors = Counter()
for line in sys.stdin:
    try:
        obj = json.loads(line)
        if obj.get('type') == 'tool_call':
            name = obj.get('tool_name', obj.get('name', 'unknown'))
            calls[name] += 1
        elif obj.get('type') == 'tool_error':
            name = obj.get('tool_name', obj.get('name', 'unknown'))
            errors[name] += 1
    except: pass
result = []
for name, count in calls.most_common(15):
    err = errors.get(name, 0)
    success = count - err
    rate = round((success / count) * 100) if count > 0 else 100
    result.append({'name': name, 'calls': count, 'errors': err, 'successRate': min(rate, 100)})
print(json.dumps(result))
" 2>/dev/null`,
        { timeout: 15000 }
      )
      if (stdout.trim()) toolStats = JSON.parse(stdout.trim())
    } catch { /* fallback */ }

    // Merge: prefer session log data (has call counts), fall back to Dojo weakest tools
    const mergedTools = toolStats.length > 0 ? toolStats : weakestTools

    return {
      tools: mergedTools,
      overallSuccessRate: latest.overall_success_rate != null
        ? Math.round(latest.overall_success_rate) // already 0-100
        : null,
      totalRuns: metrics.length,
      sessionsAnalyzed: latest.sessions_analyzed ?? 0,
      totalErrors: latest.total_errors ?? 0,
      lastRun: latest.date ?? "never",
    }
  } catch {
    return { tools: [], overallSuccessRate: null, totalRuns: 0 }
  }
}

// ── Skill Freshness ──

async function getSkillFreshness() {
  try {
    const skillsDir = "/root/.hermes/skills"
    if (!existsSync(skillsDir)) return { total: 0, recentlyUpdated: 0, stale: 0, skills: [] }

    const dirs = await readdir(skillsDir)
    const now = Date.now()
    const DAY = 86400000
    const skills: Array<{ name: string; lastModified: string; daysSince: number; status: string }> = []

    for (const dir of dirs.slice(0, 50)) {
      const skillMd = `${skillsDir}/${dir}/SKILL.md`
      if (!existsSync(skillMd)) continue
      try {
        const s = await stat(skillMd)
        const daysSince = Math.floor((now - s.mtimeMs) / DAY)
        skills.push({
          name: dir,
          lastModified: s.mtime.toISOString(),
          daysSince,
          status: daysSince <= 7 ? "fresh" : daysSince <= 30 ? "ok" : "stale",
        })
      } catch { /* skip */ }
    }

    skills.sort((a, b) => a.daysSince - b.daysSince)

    return {
      total: skills.length,
      recentlyUpdated: skills.filter((s) => s.status === "fresh").length,
      stale: skills.filter((s) => s.status === "stale").length,
      skills: skills.slice(0, 20), // top 20
    }
  } catch {
    return { total: 0, recentlyUpdated: 0, stale: 0, skills: [] }
  }
}

// ── Honcho API Status ──

async function getHonchoStatus() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    // Try the Honcho conclusions API
    const res = await fetch("http://127.0.0.1:8001/v3/workspaces/koala/conclusions/list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ limit: 1 }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return { connected: false, status: "down", error: `HTTP ${res.status}` }

    const data = await res.json()
    return {
      connected: true,
      status: "healthy",
      conclusionCount: data.total ?? data.items?.length ?? "unknown",
      endpoint: "http://127.0.0.1:8001",
    }
  } catch (e) {
    return { connected: false, status: "down", error: String(e) }
  }
}

// ── Cron Job Status ──

async function getCronStatus() {
  try {
    const jobsPath = "/root/.hermes/cron/jobs.json"
    if (!existsSync(jobsPath)) return { jobs: [], active: 0, total: 0 }

    const raw = await readFile(jobsPath, "utf-8")
    const parsed = JSON.parse(raw)
    const jobs = Array.isArray(parsed) ? parsed : Array.isArray(parsed.jobs) ? parsed.jobs : []

    const jobList = jobs.map(
          (j: {
            name?: string
            id?: string
            schedule?: string
            enabled?: boolean
            last_run?: string
            next_run?: string
          }) => ({
            name: j.name ?? j.id ?? "unnamed",
            schedule: typeof j.schedule === 'object' && j.schedule !== null
              ? (j.schedule as Record<string, string>).display ?? (j.schedule as Record<string, string>).expr ?? '—'
              : j.schedule ?? '—',
            enabled: j.enabled !== false,
            lastRun: j.last_run ?? null,
            nextRun: j.next_run ?? null,
          })
        )

    return {
      jobs: jobList,
      active: jobList.filter((j: { enabled: boolean }) => j.enabled).length,
      total: jobList.length,
    }
  } catch {
    return { jobs: [], active: 0, total: 0 }
  }
}

// ── Hindsight API Status ──

async function getHindsightStatus() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch("http://localhost:8888/health", { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) return { connected: false, status: "down" }
    const health = await res.json()

    let stats = {}
    try {
      const statsCtrl = new AbortController()
      const statsTimeout = setTimeout(() => statsCtrl.abort(), 5000)
      const statsRes = await fetch("http://localhost:8888/v1/default/banks/onyx-koala/stats", {
        signal: statsCtrl.signal,
      })
      clearTimeout(statsTimeout)
      if (statsRes.ok) stats = await statsRes.json()
    } catch { /* optional */ }

    return {
      connected: true,
      status: health.status === "healthy" ? "healthy" : "degraded",
      ...stats,
    }
  } catch {
    return { connected: false, status: "down" }
  }
}

// ── Redis Status ──

async function getRedisStatus() {
  try {
    const start = Date.now()
    const { stdout } = await execAsync("redis-cli ping 2>/dev/null")
    const latency = Date.now() - start

    if (stdout.trim() !== "PONG") return { connected: false, status: "down" }

    const { stdout: info } = await execAsync("redis-cli info server 2>/dev/null")
    const uptime = info.match(/uptime_in_seconds:(\d+)/)?.[1]
    const uptimeFormatted = uptime
      ? `${Math.floor(Number(uptime) / 86400)}d ${Math.floor((Number(uptime) % 86400) / 3600)}h`
      : "—"

    return { connected: true, status: "healthy", latency, uptime: uptimeFormatted }
  } catch {
    return { connected: false, status: "down" }
  }
}

// ── Main Handler ──

export async function GET() {
  try {
    const [tools, skills, honcho, cron, hindsight, redis] = await Promise.all([
      getToolMetrics(),
      getSkillFreshness(),
      getHonchoStatus(),
      getCronStatus(),
      getHindsightStatus(),
      getRedisStatus(),
    ])

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      toolMetrics: tools,
      skillFreshness: skills,
      connections: { honcho, hindsight, redis },
      cron,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
