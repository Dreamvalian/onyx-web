"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Database,
  Layers,
  Eye,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Clock,
  Cpu,
  Zap,
  Bug,
  Timer,
  Terminal,
  ArrowUpRight,
  Wrench,
  BookOpen,
  Activity,
  Server,
  MessageSquare,
  Send,
  AlertTriangle,
  Gauge,
} from "lucide-react"

// ── Shared with memory-stack ──

interface TierData {
  name: string
  tier: number
  status: "healthy" | "degraded" | "down"
  details: Record<string, unknown>
  lastChecked: string
}

interface MemoryData {
  overall: "healthy" | "degraded" | "down"
  summary: { healthy: number; degraded: number; down: number; total: number }
  tiers: TierData[]
}

interface ToolMetric {
  name: string
  calls?: number
  errors?: number
  successRate: number
  status?: string
}

interface SkillEntry {
  name: string
  lastModified: string
  daysSince: number
  status: string
}

interface CronJob {
  name: string
  schedule: string
  enabled: boolean
  lastRun: string | null
  nextRun: string | null
}

interface ConnectionStatus {
  connected: boolean
  status: string
  [key: string]: unknown
}

interface HealthData {
  timestamp: string
  toolMetrics: {
    tools: ToolMetric[]
    overallSuccessRate: number | null
    totalRuns: number
    sessionsAnalyzed?: number
    totalErrors?: number
    lastRun?: string
  }
  skillFreshness: {
    total: number
    recentlyUpdated: number
    stale: number
    skills: SkillEntry[]
  }
  connections: {
    honcho: ConnectionStatus
    hindsight: ConnectionStatus
    redis: ConnectionStatus
  }
  cron: {
    jobs: CronJob[]
    active: number
    total: number
  }
}

interface TimelineEvent {
  id: string
  timestamp: string
  type: string
  source: string
  summary: string
  severity: "info" | "warning" | "error"
}

interface ErrorEntry {
  id: string
  timestamp: string
  source: string
  level: "ERROR" | "WARNING" | "CRITICAL"
  message: string
  traceback?: string
}

interface TimelineData {
  timeline: TimelineEvent[]
  errors: ErrorEntry[]
  stats: { totalEvents: number; errorCount: number; warningCount: number; criticalCount: number }
}

// ── Helpers ──

function TierIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    Honcho: <Brain className="h-5 w-5" />,
    Holographic: <Database className="h-5 w-5" />,
    MemPalace: <Layers className="h-5 w-5" />,
    Hindsight: <Eye className="h-5 w-5" />,
    Dojo: <Cpu className="h-5 w-5" />,
    "Dream Cycle": <Zap className="h-5 w-5" />,
  }
  return <>{icons[name] ?? <Database className="h-5 w-5" />}</>
}

function StatusDot({ status }: { status: string }) {
  if (status === "healthy")
    return <span className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
  if (status === "degraded")
    return <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shrink-0 animate-pulse" />
  return <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
}

function StatusLabel({ status }: { status: string }) {
  if (status === "healthy")
    return (
      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/10 gap-1 text-xs">
        <CheckCircle2 className="h-3 w-3" /> Healthy
      </Badge>
    )
  if (status === "degraded")
    return (
      <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 gap-1 text-xs">
        <AlertCircle className="h-3 w-3" /> Degraded
      </Badge>
    )
  return (
    <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/10 gap-1 text-xs">
      <XCircle className="h-3 w-3" /> Down
    </Badge>
  )
}

function SuccessBar({ rate }: { rate: number }) {
  const color =
    rate >= 90 ? "bg-green-500" : rate >= 70 ? "bg-yellow-500" : rate >= 50 ? "bg-orange-500" : "bg-red-500"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#1a1714] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className="text-xs font-mono w-8 text-right">{rate}%</span>
    </div>
  )
}

function timeAgoShort(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime()
  const s = Math.floor(diff / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return `${Math.floor(h / 24)}d`
}

function EventIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    message: <MessageSquare className="h-3.5 w-3.5" />,
    response: <Send className="h-3.5 w-3.5" />,
    error: <XCircle className="h-3.5 w-3.5" />,
    warning: <AlertTriangle className="h-3.5 w-3.5" />,
    cron: <Timer className="h-3.5 w-3.5" />,
    system: <Terminal className="h-3.5 w-3.5" />,
    hindsight: <Eye className="h-3.5 w-3.5" />,
    dojo: <Cpu className="h-3.5 w-3.5" />,
  }
  return <>{icons[type] ?? <ArrowUpRight className="h-3.5 w-3.5" />}</>
}

// ── Sub-components ──

function ConnectionCard({
  name,
  data,
  icon,
}: {
  name: string
  data: ConnectionStatus
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#2a2520] bg-[#13110e] p-3">
      <div className="flex items-center gap-2.5">
        <div className="text-[#5c5449]">{icon}</div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-[11px] text-[#5c5449]">
            {data.connected
              ? `latency` in data && data.latency
                ? `${data.latency}ms`
                : "connected"
              : (data as Record<string, unknown>).error
                ? "unreachable"
                : "disconnected"}
          </p>
        </div>
      </div>
      <StatusDot status={data.status} />
    </div>
  )
}

function TierCard({ tier }: { tier: TierData }) {
  const d = tier.details
  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v)

  return (
    <Card
      className={`transition-all ${
        tier.status === "down"
          ? "border-red-900"
          : tier.status === "degraded"
            ? "border-yellow-900"
            : ""
      }`}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              tier.status === "healthy"
                ? "bg-green-500/10 text-green-500"
                : tier.status === "degraded"
                  ? "bg-yellow-500/10 text-yellow-500"
                  : "bg-red-500/10 text-red-500"
            }`}
          >
            <TierIcon name={tier.name} />
          </div>
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              {tier.name}
              {tier.tier > 0 && (
                <span className="text-xs font-mono text-[#5c5449]">T{tier.tier}</span>
              )}
            </CardTitle>
            <p className="text-xs mt-0.5">
              {tier.tier === 2
                ? "Executive Brain"
                : tier.tier === 3
                  ? "Structured Facts"
                  : tier.tier === 4
                    ? "Verbatim Recall"
                    : tier.tier === 5
                      ? "Pattern Learning"
                      : tier.tier === 6
                        ? "Self-Improvement"
                        : tier.tier === 7
                          ? "Overnight Synthesis"
                          : "Memory Layer"}
            </p>
          </div>
        </div>
        <StatusLabel status={tier.status} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(d)
            .filter(([, v]) => typeof v !== "object" || v === null)
            .slice(0, 6)
            .map(([key, value]) => (
              <div key={key} className="space-y-0.5">
                <p className="text-xs capitalize text-[#5c5449]">
                  {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                </p>
                <p className="text-sm font-medium truncate">
                  {value === null || value === undefined
                    ? "—"
                    : typeof value === "boolean"
                      ? value
                        ? "Yes"
                        : "No"
                      : String(value)}
                </p>
              </div>
            ))}
        </div>
        {Object.entries(d)
          .filter(([, v]) => isObject(v))
          .map(([key, value]) => {
            const obj = value as Record<string, unknown>
            return (
              <div key={key} className="mt-3 pt-3 border-t border-[#2a2520]">
                <p className="text-xs capitalize mb-2 text-[#5c5449]">
                  {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(obj)
                    .filter(([, v]) => typeof v === "number" && (v as number) > 0)
                    .map(([k, v]) => (
                      <Badge key={k} variant="secondary" className="text-xs">
                        {k.replace(/([A-Z])/g, " $1")}: {String(v)}
                      </Badge>
                    ))}
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}

function ToolSuccessRates({ data }: { data: HealthData["toolMetrics"] }) {
  const sortedTools = [...data.tools].sort((a, b) => a.successRate - b.successRate)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Tool Success Rates
          </CardTitle>
          {data.overallSuccessRate !== null && (
            <Badge
              variant="secondary"
              className={`text-xs ${
                data.overallSuccessRate >= 90
                  ? "text-green-500"
                  : data.overallSuccessRate >= 70
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {data.overallSuccessRate}% overall
            </Badge>
          )}
        </div>
        <p className="text-xs text-[#5c5449] mt-1">
          {data.sessionsAnalyzed ?? 0} sessions analyzed, {data.totalErrors ?? 0} total errors
        </p>
      </CardHeader>
      <CardContent>
        {sortedTools.length === 0 ? (
          <p className="text-sm text-[#5c5449] py-4 text-center">No tool metrics available yet</p>
        ) : (
          <div className="space-y-2.5">
            {sortedTools.map((tool) => (
              <div key={tool.name} className="flex items-center gap-3">
                <div className="min-w-[120px]">
                  <p className="text-sm font-medium truncate">{tool.name}</p>
                  {tool.calls !== undefined && (
                    <p className="text-[10px] text-[#5c5449]">
                      {tool.calls} calls{tool.errors ? `, ${tool.errors} err` : ""}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <SuccessBar rate={tool.successRate} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SkillFreshness({ data }: { data: HealthData["skillFreshness"] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Skill Freshness
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/10 text-[10px]">
              {data.recentlyUpdated} fresh
            </Badge>
            {data.stale > 0 && (
              <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 text-[10px]">
                {data.stale} stale
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-[#5c5449] mt-1">{data.total} skills tracked</p>
      </CardHeader>
      <CardContent>
        {data.skills.length === 0 ? (
          <p className="text-sm text-[#5c5449] py-4 text-center">No skills found</p>
        ) : (
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {data.skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between rounded-md px-2.5 py-1.5 hover:bg-[#13110e] transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <StatusDot
                    status={
                      skill.status === "fresh"
                        ? "healthy"
                        : skill.status === "ok"
                          ? "degraded"
                          : "down"
                    }
                  />
                  <p className="text-sm truncate">{skill.name}</p>
                </div>
                <span className="text-xs font-mono text-[#5c5449] shrink-0">
                  {skill.daysSince}d ago
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CronStatus({ data }: { data: HealthData["cron"] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Timer className="h-4 w-4" />
            Cron Jobs
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {data.active}/{data.total} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {data.jobs.length === 0 ? (
          <p className="text-sm text-[#5c5449] py-4 text-center">No cron jobs configured</p>
        ) : (
          <div className="space-y-1.5">
            {data.jobs.map((job) => (
              <div
                key={job.name}
                className="flex items-center justify-between rounded-md px-2.5 py-2 hover:bg-[#13110e] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <StatusDot status={job.enabled ? "healthy" : "down"} />
                  <div>
                    <p className="text-sm font-medium">{job.name}</p>
                    <p className="text-[10px] text-[#5c5449]">{job.schedule}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#5c5449]">
                  {job.lastRun ? timeAgoShort(job.lastRun) : "never"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TimelineFeed({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm py-4 text-center text-[#5c5449]">No recent activity</p>
  }
  return (
    <div className="space-y-1">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-start gap-2.5 rounded-md px-2.5 py-2 hover:bg-[#13110e] transition-colors"
        >
          <div
            className={`mt-0.5 shrink-0 ${
              event.severity === "error"
                ? "text-red-500"
                : event.severity === "warning"
                  ? "text-yellow-500"
                  : "text-[#5c5449]"
            }`}
          >
            <EventIcon type={event.type} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug line-clamp-2">{event.summary}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono">{timeAgoShort(event.timestamp)}</span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {event.source}
              </Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorFeed({ errors }: { errors: ErrorEntry[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  if (errors.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-green-500 gap-2">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm">No errors in recent logs</span>
      </div>
    )
  }

  return (
    <div className="space-y-1.5">
      {errors.map((err) => (
        <div
          key={err.id}
          className={`rounded-md border px-3 py-2.5 ${
            err.level === "CRITICAL" ? "border-red-900 bg-red-950/30" : "border-[#2a2520]"
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className={
                    err.level === "CRITICAL"
                      ? "bg-red-500/10 text-red-500 hover:bg-red-500/10 text-[10px]"
                      : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/10 text-[10px]"
                  }
                >
                  {err.level}
                </Badge>
                <span className="text-xs text-[#5c5449]">{err.source}</span>
                <span className="text-xs font-mono">{timeAgoShort(err.timestamp)}</span>
              </div>
              <p className="text-sm leading-snug">{err.message}</p>
            </div>
            {err.traceback && (
              <button
                onClick={() => setExpanded((e) => ({ ...e, [err.id]: !e[err.id] }))}
                className="text-xs hover:shrink-0"
              >
                {expanded[err.id] ? "hide" : "trace"}
              </button>
            )}
          </div>
          {expanded[err.id] && err.traceback && (
            <pre className="mt-2 text-[11px] font-mono overflow-x-auto whitespace-pre-wrap bg-[#0a0f0d] rounded p-2 max-h-40">
              {err.traceback}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Main Dashboard ──

export default function HealthDashboard() {
  const [memory, setMemory] = useState<MemoryData | null>(null)
  const [health, setHealth] = useState<HealthData | null>(null)
  const [timeline, setTimeline] = useState<TimelineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const [memRes, healthRes, tlRes] = await Promise.all([
        fetch("/api/memory", { cache: "no-store" }),
        fetch("/api/health", { cache: "no-store" }),
        fetch("/api/memory/timeline", { cache: "no-store" }),
      ])
      if (memRes.ok) setMemory(await memRes.json())
      if (healthRes.ok) setHealth(await healthRes.json())
      if (tlRes.ok) setTimeline(await tlRes.json())
      setConnected(memRes.ok)
    } catch {
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    pollRef.current = setInterval(fetchAll, 15000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [fetchAll])

  const handleRefresh = useCallback(() => {
    setLoading(true)
    fetchAll()
  }, [fetchAll])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">System Health</h1>
          <p className="mt-1 text-sm flex items-center gap-2">
            Unified dashboard
            <span
              className={`flex items-center gap-1 text-xs font-medium ${
                connected ? "text-green-500" : "text-orange-500"
              }`}
            >
              {connected ? (
                <>
                  <Wifi className="h-3 w-3" /> Live
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" /> Reconnecting...
                </>
              )}
            </span>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Top Row: Overall Status + Connections */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Overall</CardTitle>
            <Gauge className="h-4 w-4 text-[#5c5449]" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">
              {loading ? "—" : memory?.overall ?? "—"}
            </p>
            <p className="text-xs text-[#5c5449] mt-1">
              {memory
                ? `${memory.summary.healthy}/${memory.summary.total} tiers healthy`
                : "loading..."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Healthy</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {loading ? "—" : memory?.summary.healthy ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Degraded</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">
              {loading ? "—" : memory?.summary.degraded ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Down</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {loading ? "—" : memory?.summary.down ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Connections + Cron */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* API Connections */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Server className="h-4 w-4" />
                API Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-3">
                {health && (
                  <>
                    <ConnectionCard
                      name="Honcho"
                      data={health.connections.honcho}
                      icon={<Brain className="h-4 w-4" />}
                    />
                    <ConnectionCard
                      name="Hindsight"
                      data={health.connections.hindsight}
                      icon={<Eye className="h-4 w-4" />}
                    />
                    <ConnectionCard
                      name="Redis"
                      data={health.connections.redis}
                      icon={<Database className="h-4 w-4" />}
                    />
                  </>
                )}
                {!health && (
                  <div className="col-span-3 py-4 text-center text-sm text-[#5c5449]">
                    Loading connections...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cron Jobs */}
        {health && <CronStatus data={health.cron} />}
      </div>

      {/* Tool Success + Skill Freshness */}
      <div className="grid gap-4 md:grid-cols-2">
        {health && <ToolSuccessRates data={health.toolMetrics} />}
        {health && <SkillFreshness data={health.skillFreshness} />}
      </div>

      {/* Memory Tier Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Memory Tiers</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="h-5 w-32 bg-[#1a1714] rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-[#1a1714] rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-[#1a1714] rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : memory?.tiers.map((tier) => <TierCard key={tier.name} tier={tier} />)}
        </div>
      </div>

      {/* Activity Timeline + Error Feed */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Activity Timeline
              </CardTitle>
              <span className="text-xs text-[#5c5449]">
                {timeline ? `${timeline.stats.totalEvents} events` : "..."}
              </span>
            </div>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            {!timeline ? (
              <div className="flex justify-center py-6">
                <RefreshCw className="h-5 w-5 animate-spin text-[#5c5449]" />
              </div>
            ) : (
              <TimelineFeed events={timeline.timeline} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Error Feed
                {timeline && timeline.stats.errorCount > 0 && (
                  <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/10 text-[10px]">
                    {timeline.stats.errorCount} errors
                  </Badge>
                )}
                {timeline && timeline.stats.criticalCount > 0 && (
                  <Badge className="bg-red-600/10 text-red-600 hover:bg-red-600/10 text-[10px]">
                    {timeline.stats.criticalCount} critical
                  </Badge>
                )}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            {!timeline ? (
              <div className="flex justify-center py-6">
                <RefreshCw className="h-5 w-5 animate-spin text-[#5c5449]" />
              </div>
            ) : (
              <ErrorFeed errors={timeline.errors} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
