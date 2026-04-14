import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { readFile, readdir, stat } from "fs/promises"
import { existsSync } from "fs"

// Force dynamic — never cache this route
export const dynamic = "force-dynamic"
export const revalidate = 0

const execAsync = promisify(exec)

interface TierStatus {
  name: string
  tier: number
  status: "healthy" | "degraded" | "down"
  details: Record<string, unknown>
  lastChecked: string
}

async function checkHoncho(): Promise<TierStatus> {
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

    // Check git status
    let gitStatus = "unknown"
    let lastCommit = ""
    try {
      const { stdout } = await execAsync(`cd ${brainPath} && git log --oneline -1 2>/dev/null`)
      lastCommit = stdout.trim()
      gitStatus = "clean"
    } catch {
      gitStatus = "no-git"
    }

    // Get disk size
    let size = "0"
    try {
      const { stdout } = await execAsync(`du -sh ${brainPath} 2>/dev/null | cut -f1`)
      size = stdout.trim()
    } catch { /* ignore */ }

    return {
      name: "Honcho",
      tier: 2,
      status: existsSync(brainPath) && dirItems.length > 0 ? "healthy" : existsSync(brainPath) ? "degraded" : "down",
      details: {
        path: brainPath,
        exists: existsSync(brainPath),
        itemCount: dirItems.length,
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
      tier: 2,
      status: "down",
      details: { error: String(e) },
      lastChecked: now,
    }
  }
}

async function checkMemPalace(): Promise<TierStatus> {
  const now = new Date().toISOString()
  try {
    // Call mempalace status via Python
    const { stdout } = await execAsync(
      `cd /root/.hermes && python3 -c "
import json, sys
sys.path.insert(0, '.')
try:
    from mcp_mempalace.mempalace import get_status, get_kg_stats
    status = get_status()
    kg = get_kg_stats()
    print(json.dumps({'status': status, 'kg': kg}))
except Exception as e:
    print(json.dumps({'error': str(e)}))
" 2>/dev/null`,
      { timeout: 10000 }
    )

    const data = JSON.parse(stdout.trim())
    if (data.error) throw new Error(data.error)

    return {
      name: "MemPalace",
      tier: 4,
      status: "healthy",
      details: {
        totalDrawers: data.status?.total_drawers ?? 0,
        wings: data.status?.wings ?? {},
        rooms: data.status?.rooms ?? {},
        kgEntities: data.kg?.entities ?? 0,
        kgTriples: data.kg?.triples ?? 0,
        kgCurrentFacts: data.kg?.current_facts ?? 0,
        kgExpiredFacts: data.kg?.expired_facts ?? 0,
        palacePath: data.status?.palace_path ?? "/root/.hermes/mempalace",
      },
      lastChecked: now,
    }
  } catch {
    // Fallback: check filesystem and SQLite
    try {
      const palPath = "/root/.hermes/mempalace"
      let drawerCount = 0
      let wingCount = 0
      let kgEntities = 0
      let kgTriples = 0
      if (existsSync(palPath)) {
        // Count drawers from ChromaDB SQLite
        try {
          const { stdout } = await execAsync(
            `sqlite3 ${palPath}/chroma.sqlite3 "SELECT COUNT(*) FROM embeddings;" 2>/dev/null`
          )
          drawerCount = parseInt(stdout.trim()) || 0
        } catch { /* fallback to file count */ }
        // Count KG stats from SQLite
        try {
          const { stdout } = await execAsync(
            `sqlite3 ${palPath}/knowledge_graph.sqlite3 "SELECT COUNT(*) FROM triples;" 2>/dev/null`
          )
          kgTriples = parseInt(stdout.trim()) || 0
        } catch { /* ignore */ }
        try {
          const { stdout } = await execAsync(
            `sqlite3 ${palPath}/knowledge_graph.sqlite3 "SELECT COUNT(*) FROM entities;" 2>/dev/null`
          )
          kgEntities = parseInt(stdout.trim()) || 0
        } catch { /* ignore */ }
      }
      let size = "0"
      try {
        const { stdout } = await execAsync(`du -sh ${palPath} 2>/dev/null | cut -f1`)
        size = stdout.trim()
      } catch { /* ignore */ }

      return {
        name: "MemPalace",
        tier: 4,
        status: drawerCount > 0 ? "healthy" : "degraded",
        details: {
          drawerCount,
          kgEntities,
          kgTriples,
          size,
          palacePath: palPath,
          storage: "ChromaDB + SQLite",
        },
        lastChecked: now,
      }
    } catch (e) {
      return {
        name: "MemPalace",
        tier: 4,
        status: "down",
        details: { error: String(e) },
        lastChecked: now,
      }
    }
  }
}

async function checkHindsight(): Promise<TierStatus> {
  const now = new Date().toISOString()
  try {
    // Health check
    const healthController = new AbortController()
    const healthTimeout = setTimeout(() => healthController.abort(), 5000)
    const healthRes = await fetch("http://localhost:8888/health", {
      signal: healthController.signal,
    })
    clearTimeout(healthTimeout)

    if (!healthRes.ok) throw new Error(`HTTP ${healthRes.status}`)
    const health = await healthRes.json()

    // Stats from dedicated endpoint (much faster than recall)
    let stats: Record<string, unknown> = {}
    try {
      const statsController = new AbortController()
      const statsTimeout = setTimeout(() => statsController.abort(), 5000)
      const statsRes = await fetch(
        "http://localhost:8888/v1/default/banks/onyx-koala/stats",
        { signal: statsController.signal }
      )
      clearTimeout(statsTimeout)
      if (statsRes.ok) stats = await statsRes.json()
    } catch { /* stats optional */ }

    return {
      name: "Hindsight",
      tier: 5,
      status: health.status === "healthy" ? "healthy" : "degraded",
      details: {
        apiStatus: health.status,
        database: health.database,
        totalNodes: stats.total_nodes ?? 0,
        totalLinks: stats.total_links ?? 0,
        totalDocuments: stats.total_documents ?? 0,
        observations: stats.total_observations ?? 0,
        pendingConsolidation: stats.pending_consolidation ?? 0,
        failedOperations: stats.failed_operations ?? 0,
        lastConsolidated: stats.last_consolidated_at
          ? new Date(stats.last_consolidated_at as string).toLocaleString()
          : "never",
        factTypes: stats.nodes_by_fact_type ?? {},
        apiUrl: "http://localhost:8888",
        mode: "local (Docker)",
      },
      lastChecked: now,
    }
  } catch (e) {
    return {
      name: "Hindsight",
      tier: 5,
      status: "down",
      details: { error: String(e), apiUrl: "http://localhost:8888" },
      lastChecked: now,
    }
  }
}

async function checkHolographic(): Promise<TierStatus> {
  const now = new Date().toISOString()
  try {
    // Holographic uses MemPalace's KG SQLite for structured facts
    const kgPath = "/root/.hermes/mempalace/knowledge_graph.sqlite3"
    let factCount = 0
    let entityCount = 0

    if (existsSync(kgPath)) {
      try {
        const { stdout } = await execAsync(
          `sqlite3 ${kgPath} "SELECT COUNT(*) FROM triples;" 2>/dev/null`
        )
        factCount = parseInt(stdout.trim()) || 0
      } catch { /* ignore */ }
      try {
        const { stdout } = await execAsync(
          `sqlite3 ${kgPath} "SELECT COUNT(DISTINCT subject) FROM triples;" 2>/dev/null`
        )
        entityCount = parseInt(stdout.trim()) || 0
      } catch { /* ignore */ }
    }

    return {
      name: "Holographic",
      tier: 3,
      status: factCount > 0 ? "healthy" : "degraded",
      details: {
        factCount,
        entityCount,
        storage: "Knowledge Graph (SQLite)",
        path: kgPath,
        exists: existsSync(kgPath),
      },
      lastChecked: now,
    }
  } catch (e) {
    return {
      name: "Holographic",
      tier: 3,
      status: "down",
      details: { error: String(e) },
      lastChecked: now,
    }
  }
}

async function checkDojo(): Promise<TierStatus> {
  const now = new Date().toISOString()
  try {
    const metricsPath = "/root/.hermes/skills/hermes-dojo/data/metrics.json"
    let lastRun: Record<string, unknown> | null = null
    let totalRuns = 0
    let isActive = false

    if (existsSync(metricsPath)) {
      try {
        const raw = await readFile(metricsPath, "utf-8")
        const metrics = JSON.parse(raw)
        if (Array.isArray(metrics) && metrics.length > 0) {
          totalRuns = metrics.length
          lastRun = metrics[metrics.length - 1]
          isActive = true
        }
      } catch { /* ignore parse errors */ }
    }

    // Check if dojo cron is scheduled
    try {
      const { stdout } = await execAsync(
        `grep -ci "dojo\\|evolve" /root/.hermes/cron/jobs.json 2>/dev/null`
      )
      isActive = isActive || parseInt(stdout.trim()) > 0
    } catch { /* ignore */ }

    const latest = lastRun as Record<string, unknown> | null

    return {
      name: "Dojo",
      tier: 6,
      status: isActive ? "healthy" : "degraded",
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
        lastRun: latest?.date ?? "never",
        weakestTools: Array.isArray(latest?.weakest_tools)
          ? (latest.weakest_tools as Array<{ tool: string; success_rate: number }>)
              .map((t) => `${t.tool} (${(t.success_rate * 100).toFixed(0)}%)`)
              .join(", ")
          : "none",
      },
      lastChecked: now,
    }
  } catch (e) {
    return {
      name: "Dojo",
      tier: 6,
      status: "down",
      details: { error: String(e) },
      lastChecked: now,
    }
  }
}

async function checkDreamCycle(): Promise<TierStatus> {
  const now = new Date().toISOString()
  try {
    // Check if dream cycle cron exists
    let isActive = false
    try {
      const { stdout } = await execAsync(
        `grep -c "dream" /root/.hermes/cron/jobs.json 2>/dev/null`
      )
      isActive = parseInt(stdout.trim()) > 0
    } catch { /* ignore */ }

    // Check last run via log
    let lastRun = "unknown"
    try {
      const { stdout } = await execAsync(
        `ls -t /root/.hermes/logs/*dream* 2>/dev/null | head -1 | xargs stat -c %Y 2>/dev/null`
      )
      if (stdout.trim()) {
        lastRun = new Date(parseInt(stdout.trim()) * 1000).toISOString()
      }
    } catch { /* ignore */ }

    return {
      name: "Dream Cycle",
      tier: 7,
      status: isActive ? "healthy" : "degraded",
      details: {
        cronActive: isActive,
        lastRun,
      },
      lastChecked: now,
    }
  } catch (e) {
    return {
      name: "Dream Cycle",
      tier: 7,
      status: "down",
      details: { error: String(e) },
      lastChecked: now,
    }
  }
}

export async function GET() {
  try {
    const [honcho, mempalace, hindsight, holographic, dojo, dreamCycle] =
      await Promise.all([
        checkHoncho(),
        checkMemPalace(),
        checkHindsight(),
        checkHolographic(),
        checkDojo(),
        checkDreamCycle(),
      ])

    const tiers = [honcho, holographic, mempalace, hindsight, dojo, dreamCycle]
    const healthy = tiers.filter((t) => t.status === "healthy").length
    const degraded = tiers.filter((t) => t.status === "degraded").length
    const down = tiers.filter((t) => t.status === "down").length

    let overallStatus: "healthy" | "degraded" | "down" = "healthy"
    if (down > 0) overallStatus = "down"
    else if (degraded > 0) overallStatus = "degraded"

    return NextResponse.json({
      overall: overallStatus,
      summary: { healthy, degraded, down, total: tiers.length },
      tiers: tiers.sort((a, b) => a.tier - b.tier),
      architecture: {
        name: "7-Tier Cognitive Architecture",
        description: "Honcho + Holographic + MemPalace + Hindsight + Dojo + Dream Cycle",
      },
    })
  } catch (e) {
    return NextResponse.json(
      {
        overall: "down",
        summary: { healthy: 0, degraded: 0, down: 6, total: 6 },
        tiers: [],
        error: String(e),
      },
      { status: 500 }
    )
  }
}
