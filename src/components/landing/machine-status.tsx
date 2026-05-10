"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cpu, HardDrive, MemoryStickIcon as Memory, Clock, Activity, Server, Globe, Layers } from "lucide-react"

interface SystemStats {
  os: string
  cpu: { model: string; cores: number }
  memory: { total: string; used: string; percentUsed: number }
  disk: { size: string; used: string; available: string; percentUsed: number } | null
  uptime: string
  load: { load1: number; load5: number; load15: number }
}

interface Pm2Process {
  name: string
  status: string
  cpu: string
  memory: string
  uptime: string
  restarts: number
}

interface MachineData {
  timestamp: string
  system: SystemStats
  services: {
    gateway: boolean
    nginx: boolean
    pm2: Pm2Process[]
  }
  meta: { skillCount: number }
}

export function MachineStatus() {
  const [data, setData] = useState<MachineData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchData() {
      try {
        const res = await fetch("/api/machine")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (mounted) {
          setData(json)
          setError(null)
        }
      } catch (e: any) {
        if (mounted) setError(e.message)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  if (error && !data) {
    return (
      <section className="border-t border-[#2a2520] py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-[#7a7068]">Machine stats unavailable</p>
        </div>
      </section>
    )
  }

  if (!data) {
    return (
      <section className="border-t border-[#2a2520] py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="inline-block h-4 w-4 animate-pulse rounded-full bg-[#94a99b]" />
        </div>
      </section>
    )
  }

  const { system, services, meta } = data

  const specs = [
    {
      icon: Cpu,
      label: "CPU",
      value: system.cpu.model,
      sub: `${system.cpu.cores} vCPUs`,
    },
    {
      icon: Memory,
      label: "RAM",
      value: `${system.memory.used} / ${system.memory.total}`,
      sub: `${system.memory.percentUsed}% used`,
    },
    {
      icon: HardDrive,
      label: "Disk",
      value: system.disk ? `${system.disk.used} / ${system.disk.size}` : "—",
      sub: system.disk ? `${system.disk.percentUsed}% used · ${system.disk.available} free` : "—",
    },
    {
      icon: Clock,
      label: "Uptime",
      value: system.uptime,
      sub: `Load ${system.load.load1.toFixed(1)} / ${system.load.load5.toFixed(1)} / ${system.load.load15.toFixed(1)}`,
    },
  ]

  return (
    <section className="border-t border-[#2a2520] bg-[#110f0c] py-20 noise-overlay relative">
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="text-center">
          <h2 className="font-serif-display text-3xl md:text-4xl">
            The machine
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[#7a7068]">
            Contabo VPS · Singapore · Ubuntu 24.04
          </p>
        </div>

        {/* Spec cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {specs.map((spec) => (
            <motion.div
              key={spec.label}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              className="rounded-lg border border-[#2a2520] bg-[#13110e] p-5"
            >
              <div className="flex items-center gap-2">
                <spec.icon className="h-4 w-4 text-[#5c5449]" />
                <p className="text-xs tracking-widest uppercase text-[#7a7068]">
                  {spec.label}
                </p>
              </div>
              <p className="mt-3 font-serif-display text-lg text-[#e8e0d4]">
                {spec.value}
              </p>
              <p className="mt-1 text-xs text-[#5c5449]">{spec.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Service status bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 rounded-lg border border-[#2a2520] bg-[#13110e] p-5"
        >
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${
                  services.gateway ? "bg-[#94a99b]" : "bg-red-500/60"
                }`}
              />
              <span className="text-[#a89e8f]">Gateway</span>
              <span className="text-xs text-[#5c5449]">
                {services.gateway ? "running" : "down"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${
                  services.nginx ? "bg-[#94a99b]" : "bg-red-500/60"
                }`}
              />
              <span className="text-[#a89e8f]">Nginx</span>
              <span className="text-xs text-[#5c5449]">
                {services.nginx ? "running" : "down"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-3.5 w-3.5 text-[#5c5449]" />
              <span className="text-[#a89e8f]">
                PM2: {services.pm2.filter((p) => p.status === "online").length}/
                {services.pm2.length} online
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Layers className="h-3.5 w-3.5 text-[#5c5449]" />
              <span className="text-xs text-[#5c5449]">
                {meta.skillCount} skills · refreshes live
              </span>
            </div>
          </div>
        </motion.div>

        {/* PM2 process list */}
        {services.pm2.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-4 overflow-hidden rounded-lg border border-[#2a2520]"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#2a2520] bg-[#13110e]">
                    <th className="px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-[#7a7068]">
                      Service
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-[#7a7068]">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-[#7a7068]">
                      CPU
                    </th>
                    <th className="hidden px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-[#7a7068] sm:table-cell">
                      Memory
                    </th>
                    <th className="hidden px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-[#7a7068] md:table-cell">
                      Uptime
                    </th>
                    <th className="hidden px-4 py-2.5 text-xs font-medium tracking-wider uppercase text-[#7a7068] md:table-cell">
                      Restarts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {services.pm2.map((proc) => (
                    <tr
                      key={proc.name}
                      className="border-b border-[#1f1b17] last:border-0 hover:bg-[#1a1714] transition-colors"
                    >
                      <td className="px-4 py-2.5 font-mono text-xs text-[#e8e0d4]">
                        {proc.name}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${
                            proc.status === "online"
                              ? "bg-[#94a99b]/10 text-[#94a99b]"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              proc.status === "online" ? "bg-[#94a99b]" : "bg-red-400"
                            }`}
                          />
                          {proc.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-[#7a7068]">
                        {proc.cpu}
                      </td>
                      <td className="hidden px-4 py-2.5 text-xs text-[#7a7068] sm:table-cell">
                        {proc.memory}
                      </td>
                      <td className="hidden px-4 py-2.5 text-xs text-[#7a7068] md:table-cell">
                        {proc.uptime}
                      </td>
                      <td className="hidden px-4 py-2.5 text-xs text-[#7a7068] md:table-cell">
                        {proc.restarts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Live indicator */}
        <p className="mt-6 text-center text-xs text-[#5c5449]">
          Auto-refreshes every 30s · Last update{" "}
          {new Date(data.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </section>
  )
}
