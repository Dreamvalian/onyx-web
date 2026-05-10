import { NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import { existsSync } from "fs"

export const dynamic = "force-dynamic"
export const revalidate = 0

interface Subdomain {
  name: string
  hostname: string
  port: number
  type: "http" | "dns"
  note?: string
}

interface UptimeStatus {
  name: string
  hostname: string
  port: number | null
  type: "http" | "dns"
  status: "up" | "down" | "unknown"
  responseTime: number | null
  statusCode: number | null
  note?: string
  created?: string
  ip?: string
}

const SUBDOMAINS: Subdomain[] = [
  { name: "ko4lax.dev", hostname: "127.0.0.1", port: 3000, type: "http" },
  { name: "dashboard.ko4lax.dev", hostname: "127.0.0.1", port: 3000, type: "http" },
  { name: "atelier.ko4lax.dev", hostname: "127.0.0.1", port: 5000, type: "http" },
  { name: "pixel-art.ko4lax.dev", hostname: "127.0.0.1", port: 3457, type: "http" },
  { name: "pokemon.ko4lax.dev", hostname: "127.0.0.1", port: 3458, type: "http" },
  { name: "files.ko4lax.dev", hostname: "127.0.0.1", port: 8080, type: "http" },
  { name: "webui.ko4lax.dev", hostname: "127.0.0.1", port: 8788, type: "http" },
  { name: "honcho.ko4lax.dev", hostname: "127.0.0.1", port: 3001, type: "http" },
]

const VPS_IP = "129.212.227.58"

async function checkHttp(name: string, hostname: string, port: number): Promise<UptimeStatus> {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)
    const res = await fetch(`http://${hostname}:${port}/`, {
      signal: controller.signal,
      redirect: "manual",
    })
    clearTimeout(timeout)
    return {
      name,
      hostname,
      port,
      type: "http",
      status: res.status < 500 ? "up" : "down",
      responseTime: Date.now() - start,
      statusCode: res.status,
    }
  } catch {
    return {
      name,
      hostname,
      port,
      type: "http",
      status: "down",
      responseTime: null,
      statusCode: null,
    }
  }
}

export async function GET() {
  const results = await Promise.all(
    SUBDOMAINS.map((s) => checkHttp(s.name, s.hostname, s.port))
  )

  const summary = {
    total: results.length,
    up: results.filter((r) => r.status === "up").length,
    down: results.filter((r) => r.status === "down").length,
    unknown: results.filter((r) => r.status === "unknown").length,
  }

  return NextResponse.json({ timestamp: new Date().toISOString(), summary, services: results })
}
