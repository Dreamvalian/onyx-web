import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { readFile } from "fs/promises"
import { existsSync } from "fs"

export const dynamic = "force-dynamic"
export const revalidate = 0

const execAsync = promisify(exec)

async function parseMeminfo() {
  const raw = await readFile("/proc/meminfo", "utf-8")
  const lines = raw.split("\n")
  const get = (key: string) => {
    const line = lines.find((l) => l.startsWith(key))
    return line ? parseInt(line.match(/\d+/)![0]) : 0
  }
  const total = get("MemTotal")
  const available = get("MemAvailable")
  const used = total - available
  return {
    totalKb: total,
    usedKb: used,
    availableKb: available,
    percentUsed: Math.round((used / total) * 100),
  }
}

async function parseLoadavg() {
  const raw = await readFile("/proc/loadavg", "utf-8")
  const [m1, m5, m15] = raw.split(" ").slice(0, 3).map(Number)
  return { load1: m1, load5: m5, load15: m15 }
}

async function parseUptime() {
  const raw = await readFile("/proc/uptime", "utf-8")
  const seconds = parseFloat(raw.split(" ")[0])
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return { seconds, days, hours, minutes, formatted: `${days}d ${hours}h ${minutes}m` }
}

async function getDiskUsage() {
  try {
    const { stdout } = await execAsync("df -h / | tail -1", { timeout: 5000 })
    const parts = stdout.trim().split(/\s+/)
    return {
      filesystem: parts[0],
      size: parts[1],
      used: parts[2],
      available: parts[3],
      percentUsed: parseInt(parts[4]),
    }
  } catch {
    return null
  }
}

async function getCpuInfo() {
  try {
    const raw = await readFile("/proc/cpuinfo", "utf-8")
    const modelMatch = raw.match(/model name\s+:\s+(.+)/)
    const cores = (raw.match(/processor\s+:/g) || []).length
    return {
      model: modelMatch ? modelMatch[1].trim() : "Unknown",
      cores,
    }
  } catch {
    return { model: "Unknown", cores: 0 }
  }
}

async function getOsInfo() {
  try {
    if (existsSync("/etc/os-release")) {
      const raw = await readFile("/etc/os-release", "utf-8")
      const nameMatch = raw.match(/PRETTY_NAME="(.+)"/)
      return nameMatch ? nameMatch[1] : "Linux"
    }
    return "Linux"
  } catch {
    return "Linux"
  }
}

async function getPm2Processes() {
  try {
    const { stdout } = await execAsync("pm2 jlist 2>/dev/null", { timeout: 5000 })
    const processes = JSON.parse(stdout)
    return processes.map((p: any) => ({
      name: p.name,
      status: p.pm2_env?.status || "unknown",
      cpu: `${p.monit?.cpu || 0}%`,
      memory: p.monit?.memory ? `${Math.round(p.monit.memory / 1024 / 1024)}MB` : "0MB",
      uptime: p.pm2_env?.pm_uptime
        ? formatUptime((Date.now() - p.pm2_env.pm_uptime) / 1000)
        : "—",
      restarts: p.pm2_env?.restart_time || 0,
    }))
  } catch {
    return []
  }
}

async function getGatewayStatus() {
  try {
    const { stdout } = await execAsync(
      "pgrep -f 'gateway run' > /dev/null 2>&1 && echo active || echo inactive",
      { timeout: 3000 }
    )
    return stdout.trim() === "active"
  } catch {
    return false
  }
}

async function getNginxStatus() {
  try {
    const { stdout } = await execAsync(
      "pgrep -x nginx > /dev/null 2>&1 && echo active || echo inactive",
      { timeout: 3000 }
    )
    return stdout.trim() === "active"
  } catch {
    return false
  }
}

async function getActiveSkillCount() {
  try {
    const skillsDir = "/root/.hermes/skills"
    if (!existsSync(skillsDir)) return 0
    const { stdout } = await execAsync(
      `find ${skillsDir} -maxdepth 2 -name 'SKILL.md' ! -path '*/.archive/*' 2>/dev/null | wc -l`,
      { timeout: 5000 }
    )
    return parseInt(stdout.trim()) || 0
  } catch {
    return 0
  }
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export async function GET() {
  try {
    const [mem, load, uptime, disk, cpu, os, pm2, gateway, nginx] = await Promise.all([
      parseMeminfo(),
      parseLoadavg(),
      parseUptime(),
      getDiskUsage(),
      getCpuInfo(),
      getOsInfo(),
      getPm2Processes(),
      getGatewayStatus(),
      getNginxStatus(),
    ])

    const skillCount = await getActiveSkillCount()

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      system: {
        os,
        cpu,
        memory: {
          total: `${Math.round(mem.totalKb / 1024 / 1024)}GB`,
          used: `${Math.round(mem.usedKb / 1024 / 1024)}GB`,
          percentUsed: mem.percentUsed,
        },
        disk,
        uptime: uptime.formatted,
        load: load,
      },
      services: {
        gateway,
        nginx,
        pm2: pm2,
      },
      meta: {
        skillCount,
      },
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
