import { NextResponse } from "next/server"
import { execSync } from "child_process"

interface UsageRow {
  model: string
  sessions: number
  input_tokens: number
  output_tokens: number
  cache_read: number
  cache_write: number
  total_tokens: number
}

interface DailyRow {
  day: string
  sessions: number
  input_tokens: number
  output_tokens: number
}

function queryDB(sql: string): string {
  const dbPath = process.env.HERMES_HOME
    ? `${process.env.HERMES_HOME}/state.db`
    : "/root/.hermes/state.db"
  try {
    return execSync(`sqlite3 -json "${dbPath}" "${sql}"`, {
      encoding: "utf-8",
      timeout: 5000,
    }).trim()
  } catch {
    return "[]"
  }
}

export async function GET() {
  try {
    // Usage by model
    const modelRaw = queryDB(`
      SELECT model,
        COUNT(*) as sessions,
        COALESCE(SUM(input_tokens),0) as input_tokens,
        COALESCE(SUM(output_tokens),0) as output_tokens,
        COALESCE(SUM(cache_read_tokens),0) as cache_read,
        COALESCE(SUM(cache_write_tokens),0) as cache_write,
        COALESCE(SUM(input_tokens),0) + COALESCE(SUM(output_tokens),0) as total_tokens
      FROM sessions
      WHERE model IS NOT NULL AND model != ''
      GROUP BY model
      ORDER BY total_tokens DESC
    `)

    // Daily usage (last 14 days)
    const dailyRaw = queryDB(`
      SELECT DATE(started_at, 'unixepoch') as day,
        COUNT(*) as sessions,
        COALESCE(SUM(input_tokens),0) as input_tokens,
        COALESCE(SUM(output_tokens),0) as output_tokens
      FROM sessions
      WHERE started_at > strftime('%s', 'now', '-14 days')
      GROUP BY day
      ORDER BY day ASC
    `)

    // Totals
    const totalsRaw = queryDB(`
      SELECT
        COUNT(*) as total_sessions,
        COALESCE(SUM(input_tokens),0) as total_input,
        COALESCE(SUM(output_tokens),0) as total_output,
        COALESCE(SUM(cache_read_tokens),0) as total_cache_read,
        COALESCE(SUM(estimated_cost_usd),0) as total_cost
      FROM sessions
    `)

    // Recent sessions (last 10)
    const recentRaw = queryDB(`
      SELECT id, title, model,
        COALESCE(input_tokens,0) as input_tokens,
        COALESCE(output_tokens,0) as output_tokens,
        started_at
      FROM sessions
      ORDER BY started_at DESC
      LIMIT 10
    `)

    let byModel: UsageRow[] = []
    let daily: DailyRow[] = []
    let totals = { total_sessions: 0, total_input: 0, total_output: 0, total_cache_read: 0, total_cost: 0 }
    let recent: Array<{id: string, title: string, model: string, input_tokens: number, output_tokens: number, started_at: number}> = []

    try { byModel = JSON.parse(modelRaw) } catch {}
    try { daily = JSON.parse(dailyRaw) } catch {}
    try { const t = JSON.parse(totalsRaw); if (t[0]) totals = t[0] } catch {}
    try { recent = JSON.parse(recentRaw) } catch {}

    return NextResponse.json({
      byModel,
      daily,
      totals: {
        ...totals,
        total_tokens: totals.total_input + totals.total_output,
      },
      recent: recent.map(s => ({
        ...s,
        id: s.id?.slice(0, 20) ?? "?",
        started_at: s.started_at
          ? new Date(s.started_at * 1000).toISOString()
          : null,
      })),
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
