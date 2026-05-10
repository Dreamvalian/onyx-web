"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Cpu,
  Database,
  TrendingUp,
  Zap,
  RefreshCw,
} from "lucide-react"

interface ModelUsage {
  model: string
  sessions: number
  input_tokens: number
  output_tokens: number
  cache_read: number
  total_tokens: number
}

interface DailyUsage {
  day: string
  sessions: number
  input_tokens: number
  output_tokens: number
}

interface Totals {
  total_sessions: number
  total_input: number
  total_output: number
  total_cache_read: number
  total_tokens: number
  total_cost: number
}

interface UsageData {
  byModel: ModelUsage[]
  daily: DailyUsage[]
  totals: Totals
  recent: Array<{
    id: string
    title: string
    model: string
    input_tokens: number
    output_tokens: number
    started_at: string | null
  }>
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

function formatDate(day: string): string {
  const d = new Date(day)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function shortenModel(model: string): string {
  return model.replace("xiaomi/", "").replace("MiniMax-", "")
}

const COLORS = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#ec4899"]

export default function UsageDashboard() {
  const [data, setData] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch("/api/usage")
        if (res.ok) {
          const d = await res.json()
          setData(d)
        }
      } catch {
        // ignore
      }
      setLoading(false)
    }
    fetchUsage()
    const interval = setInterval(fetchUsage, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-[#5c5449]" />
      </div>
    )
  }

  if (!data) {
    return <p className="text-sm text-[#7a7068] text-center py-8">Failed to load usage data</p>
  }

  const { byModel, daily, totals } = data

  // Prepare pie chart data
  const pieData = byModel.map((m) => ({
    name: shortenModel(m.model),
    value: m.total_tokens,
    full: m.model,
  }))

  // Prepare daily chart data
  const dailyChartData = daily.map((d) => ({
    ...d,
    label: formatDate(d.day),
    total: d.input_tokens + d.output_tokens,
  }))

  // Today's usage
  const today = daily[daily.length - 1]
  const todayTokens = today ? today.input_tokens + today.output_tokens : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Total Tokens</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNum(totals.total_tokens)}</p>
            <p className="text-xs text-[#5c5449]">
              {formatNum(totals.total_input)} in · {formatNum(totals.total_output)} out
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNum(todayTokens)}</p>
            <p className="text-xs text-[#5c5449]">
              {today?.sessions ?? 0} sessions today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Cache Hits</CardTitle>
            <Database className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatNum(totals.total_cache_read)}</p>
            <p className="text-xs text-[#5c5449]">
              {totals.total_tokens > 0
                ? `${((totals.total_cache_read / (totals.total_tokens + totals.total_cache_read)) * 100).toFixed(0)}% cache rate`
                : "no data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Total Sessions</CardTitle>
            <Cpu className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totals.total_sessions.toLocaleString()}</p>
            <p className="text-xs text-[#5c5449]">
              {byModel.length} models used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Token Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Daily Token Usage (14d)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyChartData}>
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: "#7a7068" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#7a7068" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => formatNum(v)}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1a1814",
                      border: "1px solid #2a2520",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number) => [formatNum(value), "Tokens"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Model Breakdown Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Usage by Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1a1814",
                      border: "1px solid #2a2520",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value: number, name: string) => [formatNum(value), name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-[#7a7068]">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Detail Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Model Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {byModel.map((m, i) => {
              const pct = totals.total_tokens > 0
                ? (m.total_tokens / totals.total_tokens) * 100
                : 0
              return (
                <div key={m.model} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="font-medium">{m.model}</span>
                      <Badge variant="secondary" className="text-xs">
                        {m.sessions} sessions
                      </Badge>
                    </div>
                    <span className="font-mono text-xs">
                      {formatNum(m.total_tokens)} tokens ({pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div
                      className="rounded-l bg-purple-500/60"
                      style={{ width: `${(m.input_tokens / m.total_tokens) * pct}%` }}
                      title={`Input: ${formatNum(m.input_tokens)}`}
                    />
                    <div
                      className="rounded-r bg-cyan-500/60"
                      style={{ width: `${(m.output_tokens / m.total_tokens) * pct}%` }}
                      title={`Output: ${formatNum(m.output_tokens)}`}
                    />
                    <div
                      className="bg-amber-500/30"
                      style={{ width: `${(m.cache_read / (m.total_tokens + m.cache_read)) * pct}%` }}
                      title={`Cache: ${formatNum(m.cache_read)}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-[#5c5449] mt-4">
            Purple = input · Cyan = output · Amber = cache reads
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
