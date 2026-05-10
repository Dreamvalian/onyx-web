import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { existsSync } from "fs"

export const dynamic = "force-dynamic"
export const revalidate = 0

const execAsync = promisify(exec)

function parseBytes(val: string): number {
  const num = parseFloat(val)
  if (val.includes("TiB")) return num * 1024 * 1024 * 1024
  if (val.includes("GiB")) return num * 1024 * 1024
  if (val.includes("MiB")) return num * 1024
  if (val.includes("KiB")) return num
  if (val.includes("TB")) return num * 1000 * 1000 * 1000
  if (val.includes("GB")) return num * 1000 * 1000
  if (val.includes("MB")) return num * 1000
  if (val.includes("kB")) return num
  return num
}

async function getMemory(): Promise<VpsData["memory"]> {
  try {
    const { stdout } = await execAsync("free -m | grep Mem")
    const parts = stdout.trim().split(/\s+/)
    const total = parseInt(parts[1], 10)
    const used = parseInt(parts[2], 10)
    const free = parseInt(parts[3], 10)
    const available = parseInt(parts[6], 10)
    const percentage = Math.round((used / total) * 100)
    return { total, used, free, available, percentage }
  } catch {
    return { total: 0, used: 0, free: 0, available: 0, percentage: 0 }
  }
}

async function getDisk(): Promise<VpsData["disk"]> {
  try {
    const { stdout } = await execAsync("df -BM --output=source,size,used,avail,pcent,target | tail -n +2")
    const lines = stdout.trim().split("\n")
    const disks: VpsData["disk"] = []
    for (const line of lines) {
      const parts = line.trim().split(/\s+/)
      if (parts.length < 6) continue
      const total = parseInt(parts[1].replace("M", ""), 10)
      const used = parseInt(parts[2].replace("M", ""), 10)
      const free = parseInt(parts[3].replace("M", ""), 10)
      const percentage = parseInt(parts[4].replace("%", ""), 10)
      const mount = parts[5]
      if (mount.startsWith("/dev") || mount === "/" || mount.startsWith("/var") || mount.startsWith("/home")) {
        disks.push({ total, used, free, percentage, mount })
      }
    }
    return disks
  } catch {
    return []
  }
}

async function getCpu(): Promise<VpsData["cpu"]> {
  try {
    const [{ stdout: info }, { stdout: load }] = await Promise.all([
      execAsync("lscpu | grep -E 'Model name|CPU\\(s\\):'"),
      execAsync("cat /proc/loadavg"),
    ])
    const lines = info.trim().split("\n")
    const modelLine = lines.find((l) => l.includes("Model name"))
    const coresLine = lines.find((l) => l.includes("CPU(s):"))
    const model = modelLine ? modelLine.split(":")[1].trim() : "Unknown"
    const cores = coresLine ? parseInt(coresLine.split(":")[1].trim(), 10) : 1
    const loadParts = load.trim().split(" ")
    const load1 = parseFloat(loadParts[0])
    const load5 = parseFloat(loadParts[1])
    const load15 = parseFloat(loadParts[2])

    // Try to get CPU usage via top
    let usage: number | null = null
    try {
      const { stdout: topOut } = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1")
      usage = parseFloat(topOut.trim())
      if (isNaN(usage)) usage = null
    } catch { /* ignore */ }

    return { cores, model, load1, load5, load15, usage }
  } catch {
    return { cores: 1, model: "Unknown", load1: 0, load5: 0, load15: 0, usage: null }
  }
}

async function getNetwork(): Promise<VpsData["network"]> {
  try {
    const { stdout } = await execAsync("cat /proc/net/dev")
    const lines = stdout.trim().split("\n").slice(2)
    const interfaces = lines
      .map((line) => {
        const [name, stats] = line.split(":")
        if (!name || !stats) return null
        const iface = name.trim()
        if (iface === "lo") return null
        const parts = stats.trim().split(/\s+/)
        const rxBytes = parseInt(parts[0], 10)
        const txBytes = parseInt(parts[8], 10)
        const rxGB = (rxBytes / (1024 * 1024 * 1024)).toFixed(2)
        const txGB = (txBytes / (1024 * 1024 * 1024)).toFixed(2)
        return {
          name: iface,
          rx_bytes: rxBytes,
          tx_bytes: txBytes,
          rx_human: `${rxGB} GB`,
          tx_human: `${txGB} GB`,
        }
      })
      .filter(Boolean) as Array<{
        name: string
        rx_bytes: number
        tx_bytes: number
        rx_human: string
        tx_human: string
      }>
    return { interfaces }
  } catch {
    return { interfaces: [] }
  }
}

async function getCve(): Promise<VpsData["cve"]> {
  try {
    const trivyOut = "/tmp/trivy-summary.json"
    if (!existsSync(trivyOut)) return null
    const { stdout } = await execAsync(`cat ${trivyOut}`)
    const data = JSON.parse(stdout)
    return {
      critical: data.critical ?? 0,
      high: data.high ?? 0,
      images: data.images ?? [],
      lastScan: data.lastScan ?? null,
    }
  } catch {
    return null
  }
}

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
  } | null
}

export async function GET() {
  try {
    const [memory, disk, cpu, network, cve] = await Promise.all([
      getMemory(),
      getDisk(),
      getCpu(),
      getNetwork(),
      getCve(),
    ])

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      memory,
      disk,
      cpu,
      network,
      cve,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
