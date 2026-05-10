"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
  RefreshCw,
  Server,
} from "lucide-react"

interface VpsData {
  timestamp: string
  memory: {
    total: number
    used: number
    free: number
    available: number
    percentage: number
  }
  disk: Array<{
    total: number
    used: number
    free: number
    percentage: number
    mount: string
  }>
  cpu: {
    cores: number
    model: string
    load1: number
    load5: number
    load15: number
    usage: number | null
  }
  network: {
    interfaces: Array<{
      name: string
      rx_bytes: number
      tx_bytes: number
      rx_human: string
      tx_human: string
    }>
  }

  cve: {
    critical: number
    high: number
    images: Array<{
      image: string
      critical: number
      high: number
    }>
    lastScan: string | null
  } | null}

function formatMB(mb: number): string {
  if (mb >= 1024 * 1024) return `${(mb / (1024 * 1024)).toFixed(1)} PB`
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`
  return `${mb} MB`
}

function ProgressBar({ value, colorClass }: { value: number; colorClass: string }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export default function VpsHealthCard() {
  const [data, setData] = useState<VpsData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/vps-health")
      if (res.ok) {
        const d = await res.json()
        setData(d)
      }
    } catch {
      // ignore
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000)
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
    return <p className="text-sm text-[#7a7068] text-center py-8">Failed to load VPS health data</p>
  }

  const { memory, disk, cpu, network } = data
  const mainDisk = disk[0] ?? { total: 0, used: 0, free: 0, percentage: 0, mount: "/" }

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Memory</CardTitle>
            <MemoryStick className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{memory.percentage}%</p>
            <p className="text-xs text-[#5c5449]">
              {formatMB(memory.used)} / {formatMB(memory.total)}
            </p>
            <ProgressBar
              value={memory.percentage}
              colorClass={memory.percentage > 90 ? "bg-red-500" : memory.percentage > 70 ? "bg-amber-500" : "bg-purple-500"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Disk</CardTitle>
            <HardDrive className="h-4 w-4 text-cyan-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mainDisk.percentage}%</p>
            <p className="text-xs text-[#5c5449]">
              {formatMB(mainDisk.used)} / {formatMB(mainDisk.total)} ({mainDisk.mount})
            </p>
            <ProgressBar
              value={mainDisk.percentage}
              colorClass={mainDisk.percentage > 90 ? "bg-red-500" : mainDisk.percentage > 70 ? "bg-amber-500" : "bg-cyan-500"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">CPU</CardTitle>
            <Cpu className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {cpu.usage !== null ? `${cpu.usage.toFixed(1)}%` : `${cpu.load1.toFixed(2)}`}
            </p>
            <p className="text-xs text-[#5c5449]">
              {cpu.cores} cores · {cpu.model.split(" ").slice(0, 3).join(" ")}
            </p>
            <ProgressBar
              value={cpu.usage ?? Math.min((cpu.load1 / cpu.cores) * 100, 100)}
              colorClass={(cpu.usage ?? (cpu.load1 / cpu.cores) * 100) > 80 ? "bg-red-500" : "bg-green-500"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#7a7068]">Network</CardTitle>
            <Network className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{network.interfaces.length}</p>
            <p className="text-xs text-[#5c5449]">
              {network.interfaces[0]?.name ?? "—"} active
            </p>
            <div className="mt-2 flex gap-2 text-xs text-[#7a7068]">
              <span>↓ {network.interfaces[0]?.rx_human ?? "—"}</span>
              <span>↑ {network.interfaces[0]?.tx_human ?? "—"}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Info */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Load Average */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Server className="h-4 w-4" />
              Load Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{cpu.load1.toFixed(2)}</p>
                <p className="text-xs text-[#7a7068]">1 min</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{cpu.load5.toFixed(2)}</p>
                <p className="text-xs text-[#7a7068]">5 min</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{cpu.load15.toFixed(2)}</p>
                <p className="text-xs text-[#7a7068]">15 min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disk Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Disk Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {disk.map((d) => (
                <div key={d.mount} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{d.mount}</span>
                    <span className="text-xs text-[#7a7068]">
                      {formatMB(d.used)} / {formatMB(d.total)}
                    </span>
                  </div>
                  <ProgressBar
                    value={d.percentage}
                    colorClass={d.percentage > 90 ? "bg-red-500" : d.percentage > 70 ? "bg-amber-500" : "bg-cyan-500"}
                  />
                  <p className="text-xs text-[#5c5449]">{d.percentage}% used · {formatMB(d.free)} free</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Interfaces */}
      {network.interfaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Network className="h-4 w-4" />
              Network Interfaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {network.interfaces.map((iface) => (
                <div
                  key={iface.name}
                  className="flex items-center justify-between rounded-md border px-3 py-2 border-[#2a2520]"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-mono">
                      {iface.name}
                    </Badge>
                  </div>
                  <div className="flex gap-4 text-xs text-[#7a7068]">
                    <span className="flex items-center gap-1">
                      <span className="text-green-500">↓</span> {iface.rx_human}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-blue-500">↑</span> {iface.tx_human}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}