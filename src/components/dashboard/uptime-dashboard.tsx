"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Globe, CheckCircle2, XCircle, Clock, Zap } from "lucide-react"

interface UptimeService {
  name: string
  hostname: string
  port: number | null
  type: "http" | "dns"
  status: "up" | "down" | "unknown"
  responseTime: number | null
  statusCode: number | null
  note?: string
}

interface UptimeData {
  timestamp: string
  summary: { total: number; up: number; down: number; unknown: number }
  services: UptimeService[]
}

export default function UptimeDashboard() {
  const [data, setData] = useState<UptimeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchUptime = useCallback(async () => {
    try {
      const res = await fetch("/api/uptime", { cache: "no-store" })
      if (res.ok) {
        const json: UptimeData = await res.json()
        setData(json)
        setLastRefresh(new Date())
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUptime()
    const interval = setInterval(fetchUptime, 30000)
    return () => clearInterval(interval)
  }, [fetchUptime])

  function StatusBadge({ status }: { status: UptimeService["status"] }) {
    if (status === "up") {
      return (
        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/10 gap-1 text-xs">
          <CheckCircle2 className="h-3 w-3" />
          Up
        </Badge>
      )
    }
    if (status === "down") {
      return (
        <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/10 gap-1 text-xs">
          <XCircle className="h-3 w-3" />
          Down
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/10 gap-1 text-xs">
        <Clock className="h-3 w-3" />
        Unknown
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-[#060b09] text-[#e8e0d4]">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Summary Cards */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-[#212926] bg-[#0d0b08]">
              <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-[#94a99b]/10 flex items-center justify-center shrink-0">
                  <Globe className="h-4 w-4 md:h-5 md:w-5 text-[#94a99b]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl md:text-2xl font-bold text-[#e8e0d4]">{data.summary.total}</p>
                  <p className="text-xs text-[#5c6662] truncate">Total</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#212926] bg-[#0d0b08]">
              <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl md:text-2xl font-bold text-green-500">{data.summary.up}</p>
                  <p className="text-xs text-[#5c6662]">Online</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#212926] bg-[#0d0b08]">
              <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                  <XCircle className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl md:text-2xl font-bold text-red-500">{data.summary.down}</p>
                  <p className="text-xs text-[#5c6662]">Offline</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#212926] bg-[#0d0b08]">
              <CardContent className="p-3 md:p-4 flex items-center gap-2 md:gap-3">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-[#94a99b]/10 flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4 md:h-5 md:w-5 text-[#94a99b]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xl md:text-2xl font-bold text-[#94a99b]">
                    {data.summary.total > 0
                      ? Math.round((data.summary.up / data.summary.total) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-[#5c6662]">Uptime</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading && !data
            ? Array.from({ length: 8 }).map((_, i) => (
                <Card
                  key={i}
                  className="border-[#212926] bg-[#0d0b08] animate-pulse"
                >
                  <CardContent className="p-4">
                    <div className="h-4 bg-[#212926] rounded w-1/2 mb-3" />
                    <div className="h-3 bg-[#212926] rounded w-3/4" />
                  </CardContent>
                </Card>
              ))
            : data?.services.map((svc) => (
                <Card
                  key={svc.name}
                  className="border-[#212926] bg-[#0d0b08] hover:border-[#94a99b]/30 transition-colors"
                >
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-start justify-between mb-3 gap-2 min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <Globe className="h-4 w-4 text-[#94a99b] shrink-0" />
                        <span className="font-medium text-[#e8e0d4] text-xs md:text-sm truncate">
                          {svc.name}
                        </span>
                      </div>
                      <StatusBadge status={svc.status} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#5c6662]">Port</span>
                        <span className="text-xs text-[#6a7a72] font-mono">
                          {svc.port ?? "—"}
                        </span>
                      </div>
                      {svc.statusCode && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#5c6662]">Status</span>
                          <span
                            className={`text-xs font-mono ${
                              svc.statusCode < 400
                                ? "text-green-500"
                                : svc.statusCode < 500
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          >
                            {svc.statusCode}
                          </span>
                        </div>
                      )}
                      {svc.responseTime !== null && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#5c6662]">Response</span>
                          <span className="text-xs text-[#6a7a72] font-mono">
                            {svc.responseTime}ms
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* VPS Info */}
        <Card className="border-[#212926] bg-[#0d0b08]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-[#5c6662]">VPS Infrastructure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[#5c6662]">IP Address</span>
                <p className="font-mono text-[#94a99b] mt-0.5 break-all">129.212.227.58</p>
              </div>
              <div>
                <span className="text-[#5c6662]">Provider</span>
                <p className="text-[#6a7a72] mt-0.5">Singapore VPS</p>
              </div>
              <div>
                <span className="text-[#5c6662]">Subdomains</span>
                <p className="text-[#6a7a72] mt-0.5">
                  {data?.summary.total ?? "—"} tracked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
