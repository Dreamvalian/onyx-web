"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Cpu,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Database,
  GitBranch,
  Clock,
  HardDrive,
  Wifi,
  WifiOff,
} from "lucide-react"

interface SystemData {
  name: string
  status: "healthy" | "degraded" | "down"
  details: Record<string, unknown>
  lastChecked: string
}

interface MemoryApiResponse {
  overall: "healthy" | "degraded" | "down"
  summary: { healthy: number; degraded: number; down: number; total: number }
  systems: SystemData[]
  architecture: { name: string; description: string }
}

function StatusDot({ status }: { status: string }) {
  if (status === "healthy") return <span className="h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
  if (status === "degraded") return <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shrink-0 animate-pulse" />
  return <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
}

function StatusBadge({ status }: { status: string }) {
  if (status === "healthy") return (
    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/10 gap-1 text-xs">
      <CheckCircle2 className="h-3 w-3" /> Healthy
    </Badge>
  )
  if (status === "degraded") return (
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

function SystemCard({ system }: { system: SystemData }) {
  const d = system.details

  return (
    <Card className="border-[#2a2520] bg-[#0d0b08]">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            system.status === "healthy" ? "bg-green-500/10 text-green-500" :
            system.status === "degraded" ? "bg-yellow-500/10 text-yellow-500" :
            "bg-red-500/10 text-red-500"
          }`}>
            {system.name === "Honcho"
              ? <Brain className="h-5 w-5" />
              : <Cpu className="h-5 w-5" />
            }
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{system.name}</CardTitle>
            <p className="text-xs text-[#5c6662] mt-0.5">
              {system.name === "Honcho" ? "Executive Brain — T2" : "Skill Evolution — T??"}
            </p>
          </div>
        </div>
        <StatusBadge status={system.status} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(d)
            .filter(([, v]) => typeof v !== "object" || v === null)
            .slice(0, 8)
            .map(([key, value]) => (
              <div key={key} className="space-y-0.5">
                <p className="text-xs text-[#5c6662] capitalize">
                  {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ")}
                </p>
                <p className="text-sm font-medium truncate">
                  {value === null || value === undefined ? "—" :
                   typeof value === "boolean" ? (value ? "Yes" : "No") :
                   String(value)}
                </p>
              </div>
            ))
          }
        </div>

        {/* Nested arrays as tags */}
        {Array.isArray(d.directories) && d.directories.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#2a2520]">
            <p className="text-xs text-[#5c6662] mb-2">Drawers</p>
            <div className="flex flex-wrap gap-1.5">
              {(d.directories as string[]).map((drawer: string) => (
                <Badge key={drawer} variant="secondary" className="text-xs">
                  {drawer}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ArchitectureDiagram() {
  const tiers = [
    { name: "SOUL.md", tier: 0, desc: "Behavioral rules", color: "text-[#94a99b]" },
    { name: "USER + MEMORY + AGENTS", tier: 1, desc: "Profile + pointers", color: "text-[#94a99b]" },
    { name: "Honcho", tier: 2, desc: "Executive brain", color: "text-green-400" },
  ]

  const flows = [
    { from: "SOUL.md", to: "USER/MEMORY/AGENTS", label: "profile read", type: "realtime" },
    { from: "USER/MEMORY/AGENTS", to: "Honcho", label: "conclusions", type: "realtime" },
    { from: "Honcho", to: "Agent context", label: "prefetch", type: "realtime" },
  ]

  return (
    <Card className="border-[#2a2520] bg-[#0d0b08]">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Database className="h-4 w-4" />
          Memory Architecture
        </CardTitle>
        <p className="text-xs mt-1 text-[#5c6662]">Honcho-only since Apr 24, 2026</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3-tier stack */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          {tiers.map((tier, i) => (
            <div key={tier.name} className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-[#13110e] border border-[#2a2520] min-w-[120px]">
                <StatusDot status="healthy" />
                <span className="text-xs font-semibold text-[#e8e0d4]">{tier.name}</span>
                <span className="text-[10px] text-[#5c6662]">{tier.desc}</span>
                <span className="text-[9px] font-mono text-[#5c5449]">T{tier.tier}</span>
              </div>
              {i < tiers.length - 1 && (
                <div className="flex items-center gap-1 px-1">
                  <span className="text-green-400 text-sm">→</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Data flows */}
        <div className="border-t border-[#2a2520] pt-4">
          <p className="text-[11px] font-medium uppercase tracking-wider mb-2 text-[#5c6662]">Data Flow</p>
          <div className="space-y-1.5">
            {flows.map((flow, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-[#7a7068]">
                <span className="font-medium text-[#6a7a72]">{flow.from}</span>
                <span className="text-green-400">→</span>
                <span className="font-medium text-[#6a7a72]">{flow.to}</span>
                <span className="text-[#5c5449]">— {flow.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Removed systems */}
        <div className="border-t border-[#2a2520] pt-4">
          <p className="text-[11px] font-medium uppercase tracking-wider mb-2 text-[#5c6662]">Removed (Apr 24, 2026)</p>
          <div className="flex flex-wrap gap-2">
            {["MemPalace", "LCM", "Hindsight", "Dream Cycle", "KG", "Curiosity Engine"].map((name) => (
              <Badge key={name} variant="secondary" className="text-xs text-[#5c5449] line-through">
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MemoryStackDashboard() {
  const [data, setData] = useState<MemoryApiResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMemory = useCallback(async () => {
    try {
      const res = await fetch("/api/memory", { cache: "no-store" })
      if (res.ok) {
        const json: MemoryApiResponse = await res.json()
        setData(json)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMemory()
    const interval = setInterval(fetchMemory, 30000)
    return () => clearInterval(interval)
  }, [fetchMemory])

  return (
    <div className="min-h-screen bg-[#060b09] text-[#e8e0d4]">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Summary row */}
        {data && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-[#2a2520] bg-[#0d0b08]">
              <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-green-500">{data.summary.healthy}</p>
                  <p className="text-xs text-[#5c6662]">Healthy</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#2a2520] bg-[#0d0b08]">
              <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-yellow-500">{data.summary.degraded}</p>
                  <p className="text-xs text-[#5c6662]">Degraded</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#2a2520] bg-[#0d0b08]">
              <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-red-500">{data.summary.down}</p>
                  <p className="text-xs text-[#5c6662]">Down</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Architecture diagram */}
        <ArchitectureDiagram />

        {/* System cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && !data
            ? Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="border-[#2a2520] bg-[#0d0b08] animate-pulse">
                  <CardContent className="p-4">
                    <div className="h-4 bg-[#212926] rounded w-1/3 mb-4" />
                    <div className="h-3 bg-[#212926] rounded w-2/3 mb-2" />
                    <div className="h-3 bg-[#212926] rounded w-1/2" />
                  </CardContent>
                </Card>
              ))
            : data?.systems.map((system) => (
                <SystemCard key={system.name} system={system} />
              ))
          }
        </div>

        {/* Refresh */}
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchMemory}
            disabled={loading}
            className="text-[#94a99b] hover:bg-[#1a1714] hover:text-[#e8e0d4]"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  )
}
