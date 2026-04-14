"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  MemoryStick,
  Zap,
  MessageSquare,
  Send,
  AlertTriangle,
  Bug,
  Timer,
  Terminal,
  ArrowUpRight,
} from "lucide-react"

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
  architecture?: { name: string; description: string }
}

interface TimelineEvent {
  id: string
  timestamp: string
  type: "message" | "response" | "error" | "warning" | "cron" | "system" | "hindsight" | "dojo"
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
  stats: {
    totalEvents: number
    errorCount: number
    warningCount: number
    criticalCount: number
  }
}

function TierIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    Honcho: <Brain className="h-5 w-5" />,
    Holographic: <Database className="h-5 w-5" />,
    MemPalace: <Layers className="h-5 w-5" />,
    Hindsight: <Eye className="h-5 w-5" />,
    Dojo: <Cpu className="h-5 w-5" />,
    "Dream Cycle": <Zap className="h-5 w-5" />,
  }
  return <>{icons[name] ?? <MemoryStick className="h-5 w-5" />}</>
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

function TierCard({ tier }: { tier: TierData }) {
  const d = tier.details
  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v)

  return (
    <Card
      className={`transition-all ${
        tier.status === "down"
          ? "border-red-200 dark:border-red-900"
          : tier.status === "degraded"
          ? "border-yellow-200 dark:border-yellow-900"
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
                <span className="text-xs font-mono text-neutral-400">
                  T{tier.tier}
                </span>
              )}
            </CardTitle>
            <p className="text-xs text-neutral-400 mt-0.5">
                {tier.tier === 0
                ? "Infrastructure"
                : tier.tier === 2
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
            <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                {tier.tier === 2
                ? "Primary write target. Stores conclusions, identity facts, and orchestrates all other tiers. Every session reads and writes here."
                : tier.tier === 3
                ? "Structured facts with trust scores, injected every turn via prefetch. Fast lookup for things the agent needs to know right now."
                : tier.tier === 4
                ? "Verbatim conversation text stored in ChromaDB. Exact recall of what was said — the raw material other tiers process."
                : tier.tier === 5
                ? "Behavioral patterns from interactions. Learns what happened and why, feeds improvement signals to Dojo."
                : tier.tier === 6
                ? "Analyzes session logs, patches skills, closes gaps. The hands of the brain — turns insight into action."
                : tier.tier === 7
                ? "Nightly 10-step pipeline. Enriches entities, promotes facts between tiers, consolidates patterns while Koala sleeps."
                : ""}
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
                <p className="text-xs text-neutral-400 capitalize">
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

        {/* Show nested objects as tags */}
        {Object.entries(d)
          .filter(([, v]) => isObject(v))
          .map(([key, value]) => {
            const obj = value as Record<string, unknown>
            return (
              <div key={key} className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <p className="text-xs text-neutral-400 capitalize mb-2">
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

function ArchitectureDiagram({ tiers }: { tiers: TierData[] }) {
  const sorted = [...tiers].sort((a, b) => a.tier - b.tier)

  const tierDescriptions: Record<number, string> = {
    2: "Core brain",
    3: "Fact injection",
    4: "Raw capture",
    5: "Pattern extraction",
    6: "Skill patching",
    7: "Nightly consolidation",
  }

  const flowSteps = [
    { from: "Session", to: "MemPalace", label: "verbatim capture" },
    { from: "MemPalace", to: "Hindsight", label: "pattern extraction" },
    { from: "Hindsight", to: "Holographic", label: "structured facts" },
    { from: "Holographic", to: "Dojo", label: "improvement signals" },
    { from: "Dojo", to: "Dream Cycle", label: "overnight run" },
    { from: "Dream Cycle", to: "Honcho", label: "enriched conclusions" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          Architecture Flow
        </CardTitle>
        <p className="text-xs text-neutral-500 mt-1">
          Live interaction data flows down, knowledge flows back up
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Flow diagram — horizontal chain */}
        <div className="flex items-center justify-between gap-0.5 overflow-x-auto pb-2">
          {sorted.map((tier, i) => (
            <div key={tier.name} className="flex items-center gap-0.5 shrink-0">
              <div
                className={`flex flex-col items-center gap-1 p-2.5 rounded-lg min-w-[90px] ${
                  tier.status === "healthy"
                    ? "bg-green-500/5 border border-green-200 dark:border-green-900"
                    : tier.status === "degraded"
                    ? "bg-yellow-500/5 border border-yellow-200 dark:border-yellow-900"
                    : "bg-red-500/5 border border-red-200 dark:border-red-900"
                }`}
              >
                <StatusDot status={tier.status} />
                <span className="text-xs font-medium text-center leading-tight">
                  {tier.name}
                </span>
                {tier.tier > 0 && (
                  <span className="text-[10px] text-neutral-400 font-mono">
                    T{tier.tier}
                  </span>
                )}
                <span className="text-[10px] text-neutral-500 text-center leading-tight">
                  {tierDescriptions[tier.tier] ?? ""}
                </span>
              </div>
              {i < sorted.length - 1 && (
                <div className="flex flex-col items-center gap-0.5 px-1">
                  <span className="text-neutral-300 dark:text-neutral-600 text-sm">→</span>
                  <span className="text-[9px] text-neutral-400 whitespace-nowrap">
                    {flowSteps[i]?.label ?? ""}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Flow description list */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">Data Flow</p>
          <div className="grid gap-1.5">
            {flowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-neutral-500">
                <span className="font-medium text-neutral-600 dark:text-neutral-400">{step.from}</span>
                <span className="text-neutral-300 dark:text-neutral-600">→</span>
                <span className="font-medium text-neutral-600 dark:text-neutral-400">{step.to}</span>
                <span className="text-neutral-400">— {step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Promotion rules */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
          <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-2">Promotion Rules</p>
          <div className="grid gap-1.5 text-xs text-neutral-500">
            <div><span className="font-medium text-neutral-600 dark:text-neutral-400">MemPalace → Holographic:</span> repeated 3+ times → extract as structured fact</div>
            <div><span className="font-medium text-neutral-600 dark:text-neutral-400">Hindsight → Dojo:</span> failure pattern repeats → train to improve</div>
            <div><span className="font-medium text-neutral-600 dark:text-neutral-400">Dream → Honcho:</span> nightly enrichment → write enriched conclusions</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
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

function TimelineFeed({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-neutral-500 py-4 text-center">No recent activity</p>
    )
  }

  return (
    <div className="space-y-1">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex items-start gap-2.5 rounded-md px-2.5 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
        >
          <div
            className={`mt-0.5 shrink-0 ${
              event.severity === "error"
                ? "text-red-500"
                : event.severity === "warning"
                ? "text-yellow-500"
                : "text-neutral-400"
            }`}
          >
            <EventIcon type={event.type} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug line-clamp-2">{event.summary}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-neutral-400 font-mono">
                {timeAgoShort(event.timestamp)}
              </span>
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
            err.level === "CRITICAL"
              ? "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
              : "border-neutral-200 dark:border-neutral-800"
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
                <span className="text-xs text-neutral-400">{err.source}</span>
                <span className="text-xs text-neutral-400 font-mono">
                  {timeAgoShort(err.timestamp)}
                </span>
              </div>
              <p className="text-sm leading-snug">{err.message}</p>
            </div>
            {err.traceback && (
              <button
                onClick={() =>
                  setExpanded((e) => ({ ...e, [err.id]: !e[err.id] }))
                }
                className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 shrink-0"
              >
                {expanded[err.id] ? "hide" : "trace"}
              </button>
            )}
          </div>
          {expanded[err.id] && err.traceback && (
            <pre className="mt-2 text-[11px] text-neutral-500 font-mono overflow-x-auto whitespace-pre-wrap bg-neutral-100 dark:bg-neutral-900 rounded p-2 max-h-40">
              {err.traceback}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}

export default function MemoryStackDashboard() {
  const [data, setData] = useState<MemoryData | null>(null)
  const [timeline, setTimeline] = useState<TimelineData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timelineLoading, setTimelineLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchMemory = useCallback(async () => {
    try {
      const res = await fetch("/api/memory", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const payload = await res.json()
      setData(payload)
      setConnected(true)
    } catch {
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTimeline = useCallback(async () => {
    try {
      const res = await fetch("/api/memory/timeline", { cache: "no-store" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const payload = await res.json()
      setTimeline(payload)
    } catch {
      // ignore
    } finally {
      setTimelineLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMemory()
    fetchTimeline()
    pollRef.current = setInterval(() => {
      fetchMemory()
      fetchTimeline()
    }, 10000) // 10s polling
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [fetchMemory, fetchTimeline])

  const handleRefresh = useCallback(() => {
    setLoading(true)
    setTimelineLoading(true)
    fetchMemory()
    fetchTimeline()
  }, [fetchMemory, fetchTimeline])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Memory Stack</h1>
          <p className="mt-1 text-sm text-neutral-500 flex items-center gap-2">
            7-Tier Cognitive Architecture
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

      {/* Overall Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              Overall
            </CardTitle>
            <StatusDot status={data?.overall ?? "down"} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">
              {loading ? "—" : data?.overall ?? "—"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              Healthy
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {loading ? "—" : data?.summary.healthy ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              Degraded
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-500">
              {loading ? "—" : data?.summary.degraded ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              Down
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">
              {loading ? "—" : data?.summary.down ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Architecture Flow */}
      {data && data.tiers.length > 0 && <ArchitectureDiagram tiers={data.tiers} />}

      {/* Tier Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-5 w-32 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))
          : data?.tiers.map((tier) => <TierCard key={tier.name} tier={tier} />)}
      </div>

      {/* Activity Timeline & Error Feed */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Activity Timeline
              </CardTitle>
              <span className="text-xs text-neutral-400">
                {timelineLoading
                  ? "..."
                  : `${timeline?.stats.totalEvents ?? 0} events`}
              </span>
            </div>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            {timelineLoading ? (
              <div className="flex justify-center py-6">
                <RefreshCw className="h-5 w-5 animate-spin text-neutral-400" />
              </div>
            ) : (
              <TimelineFeed events={timeline?.timeline ?? []} />
            )}
          </CardContent>
        </Card>

        {/* Error Feed */}
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
            {timelineLoading ? (
              <div className="flex justify-center py-6">
                <RefreshCw className="h-5 w-5 animate-spin text-neutral-400" />
              </div>
            ) : (
              <ErrorFeed errors={timeline?.errors ?? []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
