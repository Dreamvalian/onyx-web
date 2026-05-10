import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { readFile, readdir, stat } from "fs/promises"
import { existsSync } from "fs"

export const dynamic = "force-dynamic"
export const revalidate = 0

const execAsync = promisify(exec)

interface SystemStatus {
  name: string
  status: "healthy" | "degraded" | "down"
  details: Record<string, unknown>
  lastChecked: string
}

async function checkHoncho(): Promise<SystemStatus> {
  const now = new Date().toISOString()
  try {
    const brainPath = "/root/.hermes-brain"
    const items = existsSync(brainPath) ? await readdir(brainPath) : []
    const dirItems = []
    for (const item of items) {
      if (item.startsWith(".")) continue
      const p = `${brainPath}/${item}`
      try {
        const s = await stat(p)
        dirItems.push({ name: item, isDir: s.isDirectory() })
      } catch { /* skip */ }
    }

    // Git backup status
    let gitStatus = "unknown"
    let lastCommit = ""
    try {
      const { stdout } = await execAsync(`cd ${brainPath} && git log --oneline -1 2>/dev/null`)
      lastCommit = stdout.trim()
      gitStatus = "clean"
    } catch {
      gitStatus = "no-git"
    }

    // Disk size
    let size = "0"
    try {
      const { stdout } = await execAsync(`du -sh ${brainPath} 2>/dev/null | cut -f1`)
      size = stdout.trim()
    } catch { /* ignore */ }

    // API health
    let apiStatus = "unknown"
    try {
      const controller = new AbortController()
      const t = setTimeout(() => controller.abort(), 3000)
      const res = await fetch("http://127.0.0.1:8001/health", { signal: controller.signal })
      clearTimeout(t)
      apiStatus = res.ok ? "ok" : "error"
    } catch {
      apiStatus = "down"
    }

    return {
      name: "Honcho",
      status: apiStatus === "ok" && existsSync(brainPath) ? "healthy" : apiStatus === "ok" ? "degraded" : "down",
      details: {
        path: brainPath,
        apiStatus,
        apiUrl: "http://127.0.0.1:8001",
        drawers: dirItems.length,
        directories: dirItems.filter((d) => d.isDir).map((d) => d.name),
        gitStatus,
        lastCommit,
        size,
      },
      lastChecked: now,
    }
  } catch (e) {
    return {
      name: "Honcho",
      status: "down",
      details: { error: String(e) },
      lastChecked: now,
    }
  }
}

async function checkDojo(): Promise<SystemStatus> {
  const now = new Date().toISOString()
  try {
    const metricsPath = "/root/.hermes/skills/hermes-dojo/data/metrics.json"
    let lastRun: Record<string, unknown> | null = null
    let totalRuns = 0

    if (existsSync(metricsPath)) {
      try {
        const raw = await readFile(metricsPath, "utf-8")
        const metrics = JSON.parse(raw)
        if (Array.isArray(metrics) && metrics.length > 0) {
          totalRuns = metrics.length
          lastRun = metrics[metrics.length - 1]
        } else if (metrics && typeof metrics === "object" && "timestamp" in metrics) {
          lastRun = metrics
          totalRuns = 1
        }
      } catch { /* ignore */ }
    }

    const latest = lastRun as Record<string, unknown> | null

    return {
      name: "Dojo",
      status: latest ? "healthy" : "degraded",
      details: {
        totalRuns,
        sessionsAnalyzed: latest?.sessions_analyzed ?? 0,
        successRate: latest?.overall_success_rate != null
          ? `${latest.overall_success_rate}%`
          : "—",
        totalErrors: latest?.total_errors ?? 0,
        userCorrections: latest?.user_corrections ?? 0,
        skillGaps: latest?.skill_gaps ?? 0,
        retryPatterns: latest?.retry_patterns ?? 0,
        lastRun: (latest?.timestamp ?? "never") as string,
      },
      lastChecked: now,
    }
  } catch (e) {
    return {
      name: "Dojo",
      status: "down",
      details: { error: String(e) },
      lastChecked: now,
    }
  }
}

export async function GET() {
  try {
    const [honcho, dojo] = await Promise.all([checkHoncho(), checkDojo()])

    const systems = [honcho, dojo]
    const healthy = systems.filter((s) => s.status === "healthy").length
    const degraded = systems.filter((s) => s.status === "degraded").length
    const down = systems.filter((s) => s.status === "down").length

    let overallStatus: "healthy" | "degraded" | "down" = "healthy"
    if (down > 0) overallStatus = "down"
    else if (degraded > 0) overallStatus = "degraded"

    return NextResponse.json({
      overall: overallStatus,
      summary: { healthy, degraded, down, total: systems.length },
      systems,
      architecture: {
        name: "Honcho-Only",
        description: "Tier 0: SOUL.md · Tier 1: USER+MEMORY+AGENTS · Tier 2: Honcho",
      },
    })
  } catch (e) {
    return NextResponse.json(
      {
        overall: "down",
        summary: { healthy: 0, degraded: 0, down: 2, total: 2 },
        systems: [],
        error: String(e),
      },
      { status: 500 }
    )
  }
}
