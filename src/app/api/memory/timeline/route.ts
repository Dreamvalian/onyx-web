import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import { readFile } from "fs/promises"
import { existsSync } from "fs"

export const dynamic = "force-dynamic"
export const revalidate = 0

const execAsync = promisify(exec)

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

function parseTimestamp(line: string): string | null {
  // Match: 2026-04-14 08:31:30,075
  const match = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/)
  if (match) {
    return new Date(match[1].replace(",", ".") + "Z").toISOString()
  }
  return null
}

async function getAgentEvents(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = []
  const logPath = "/root/.hermes/logs/agent.log"
  if (!existsSync(logPath)) return events

  try {
    const { stdout } = await execAsync(`tail -200 ${logPath} 2>/dev/null`)
    const lines = stdout.split("\n")

    for (const line of lines) {
      const ts = parseTimestamp(line)
      if (!ts) continue

      // Inbound messages
      if (line.includes("inbound message:")) {
        const msgMatch = line.match(/user=(\S+) chat=\S+ msg='(.{0,80})/)
        if (msgMatch) {
          events.push({
            id: `msg-${ts}-${events.length}`,
            timestamp: ts,
            type: "message",
            source: "Gateway",
            summary: `${msgMatch[1]}: ${msgMatch[2]}${msgMatch[2].length >= 80 ? "..." : ""}`,
            severity: "info",
          })
        }
      }

      // Responses
      if (line.includes("response ready:")) {
        const respMatch = line.match(/time=([\d.]+)s api_calls=(\d+) response=(\d+) chars/)
        if (respMatch) {
          events.push({
            id: `resp-${ts}-${events.length}`,
            timestamp: ts,
            type: "response",
            source: "Agent",
            summary: `Response: ${respMatch[3]} chars in ${respMatch[1]}s (${respMatch[2]} API calls)`,
            severity: "info",
          })
        }
      }

      // Flushing messages
      if (line.includes("Flushing text batch")) {
        events.push({
          id: `flush-${ts}-${events.length}`,
          timestamp: ts,
          type: "system",
          source: "Discord",
          summary: "Message sent to Discord",
          severity: "info",
        })
      }
    }
  } catch { /* ignore */ }

  return events
}

async function getErrorEvents(): Promise<{ timeline: TimelineEvent[]; errors: ErrorEntry[] }> {
  const timeline: TimelineEvent[] = []
  const errors: ErrorEntry[] = []
  const logPath = "/root/.hermes/logs/errors.log"
  if (!existsSync(logPath)) return { timeline, errors }

  try {
    const { stdout } = await execAsync(`tail -300 ${logPath} 2>/dev/null`)
    const lines = stdout.split("\n")
    let currentError: ErrorEntry | null = null

    for (const line of lines) {
      const ts = parseTimestamp(line)

      if (ts && (line.includes(" ERROR ") || line.includes(" CRITICAL "))) {
        // Save previous error if exists
        if (currentError) errors.push(currentError)

        const level = line.includes("CRITICAL") ? "CRITICAL" : "ERROR"
        const sourceMatch = line.match(/\] (\S+):/)
        const msgMatch = line.match(/(?:ERROR|CRITICAL)\s+\S+:\s*(.+)/)

        currentError = {
          id: `err-${ts}-${errors.length}`,
          timestamp: ts,
          source: sourceMatch?.[1] ?? "unknown",
          level,
          message: msgMatch?.[1]?.slice(0, 200) ?? line.slice(0, 200),
        }

        timeline.push({
          id: `tl-err-${ts}-${timeline.length}`,
          timestamp: ts,
          type: "error",
          source: currentError.source,
          summary: currentError.message.slice(0, 100),
          severity: "error",
        })
      } else if (ts && line.includes(" WARNING ")) {
        if (currentError) {
          errors.push(currentError)
          currentError = null
        }

        const sourceMatch = line.match(/\] (\S+):/)
        const msgMatch = line.match(/WARNING\s+\S+:\s*(.+)/)

        timeline.push({
          id: `tl-warn-${ts}-${timeline.length}`,
          timestamp: ts,
          type: "warning",
          source: sourceMatch?.[1] ?? "unknown",
          summary: msgMatch?.[1]?.slice(0, 100) ?? "Warning",
          severity: "warning",
        })
      } else if (currentError && line.trim().startsWith("File ")) {
        // Traceback continuation
        currentError.traceback = (currentError.traceback ?? "") + line + "\n"
      } else if (currentError && line.trim().startsWith("discord.")) {
        currentError.traceback = (currentError.traceback ?? "") + line + "\n"
      } else if (currentError && ts) {
        // New log entry, save previous error
        errors.push(currentError)
        currentError = null
      }
    }

    if (currentError) errors.push(currentError)
  } catch { /* ignore */ }

  return { timeline, errors }
}

async function getCronEvents(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = []
  try {
    const jobsRaw = await readFile("/root/.hermes/cron/jobs.json", "utf-8")
    const jobs = JSON.parse(jobsRaw)
    if (Array.isArray(jobs)) {
      for (const job of jobs) {
        if (job.last_run) {
          events.push({
            id: `cron-${job.id}-${job.last_run}`,
            timestamp: new Date(job.last_run).toISOString(),
            type: "cron",
            source: "Cron",
            summary: `${job.name ?? job.id}: ${job.last_status ?? "unknown"}`,
            severity: job.last_status === "ok" ? "info" : "error",
          })
        }
      }
    }
  } catch { /* ignore */ }
  return events
}

async function getDojoEvents(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = []
  try {
    const metricsRaw = await readFile(
      "/root/.hermes/skills/hermes-dojo/data/metrics.json",
      "utf-8"
    )
    const metrics = JSON.parse(metricsRaw)
    if (Array.isArray(metrics)) {
      for (const run of metrics.slice(-5)) {
        events.push({
          id: `dojo-${run.timestamp}`,
          timestamp: new Date(run.timestamp * 1000).toISOString(),
          type: "dojo",
          source: "Dojo",
          summary: `Analyzed ${run.sessions_analyzed} sessions, ${run.overall_success_rate}% success, ${run.skill_gaps} gaps`,
          severity: run.overall_success_rate < 80 ? "warning" : "info",
        })
      }
    }
  } catch { /* ignore */ }
  return events
}

async function getPM2Events(): Promise<TimelineEvent[]> {
  const events: TimelineEvent[] = []
  try {
    const { stdout } = await execAsync(
      `tail -30 /root/.pm2/logs/hermes-web-error.log 2>/dev/null`
    )
    const lines = stdout.split("\n")
    for (const line of lines) {
      if (!line.trim()) continue
      const ts = parseTimestamp(line) ?? new Date().toISOString()
      events.push({
        id: `pm2-${ts}-${events.length}`,
        timestamp: ts,
        type: "error",
        source: "PM2",
        summary: line.slice(0, 120),
        severity: "error",
      })
    }
  } catch { /* ignore */ }
  return events
}

export async function GET() {
  try {
    const [agentEvents, errorData, cronEvents, dojoEvents, pm2Events] =
      await Promise.all([
        getAgentEvents(),
        getErrorEvents(),
        getCronEvents(),
        getDojoEvents(),
        getPM2Events(),
      ])

    // Combine all timeline events
    const allEvents = [
      ...agentEvents,
      ...errorData.timeline,
      ...cronEvents,
      ...dojoEvents,
      ...pm2Events,
    ]

    // Sort by timestamp descending (newest first)
    allEvents.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    // Deduplicate errors (same message within 1s)
    const uniqueErrors: ErrorEntry[] = []
    for (const err of errorData.errors) {
      const isDuplicate = uniqueErrors.some(
        (e) =>
          e.message === err.message &&
          Math.abs(new Date(e.timestamp).getTime() - new Date(err.timestamp).getTime()) < 1000
      )
      if (!isDuplicate) uniqueErrors.push(err)
    }

    return NextResponse.json({
      timeline: allEvents.slice(0, 50),
      errors: uniqueErrors.slice(0, 20),
      stats: {
        totalEvents: allEvents.length,
        errorCount: uniqueErrors.filter((e) => e.level === "ERROR").length,
        warningCount: allEvents.filter((e) => e.severity === "warning").length,
        criticalCount: uniqueErrors.filter((e) => e.level === "CRITICAL").length,
      },
    })
  } catch (e) {
    return NextResponse.json(
      { timeline: [], errors: [], stats: { totalEvents: 0, errorCount: 0, warningCount: 0, criticalCount: 0 }, error: String(e) },
      { status: 500 }
    )
  }
}
