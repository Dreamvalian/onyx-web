import { NextRequest, NextResponse } from "next/server"
import { writeFile, readFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const DATA_FILE = path.join(DATA_DIR, "lab-results.json")

interface LabResult {
  id: string
  timestamp: string
  visceral: {
    colorTemp: string | null
    borderRadius: string | null
    density: string | null
  }
  behavioral: {
    sidebarMs: number | null
    bottomMs: number | null
    preferred: string | null
  }
  reflective: {
    brandPick: number | null
  }
  userAgent: string | null
}

async function ensureDataFile() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
  if (!existsSync(DATA_FILE)) {
    await writeFile(DATA_FILE, JSON.stringify([], null, 2))
  }
}

async function readResults(): Promise<LabResult[]> {
  await ensureDataFile()
  const raw = await readFile(DATA_FILE, "utf-8")
  return JSON.parse(raw)
}

async function writeResults(results: LabResult[]) {
  await ensureDataFile()
  await writeFile(DATA_FILE, JSON.stringify(results, null, 2))
}

// GET — return aggregate stats (no personal data)
export async function GET() {
  try {
    const results = await readResults()
    const total = results.length

    if (total === 0) {
      return NextResponse.json({
        total: 0,
        message: "No results yet. Be the first.",
      })
    }

    // Aggregate visceral choices
    const visceralCounts = {
      colorTemp: { "Cool Tones": 0, "Warm Tones": 0 },
      borderRadius: { Rounded: 0, Sharp: 0 },
      density: { Minimal: 0, Dense: 0 },
    }

    const behavioralTimes = { sidebar: [] as number[], bottom: [] as number[] }
    let behavioralPreferred = { sidebar: 0, bottom: 0 }

    const reflectivePicks = { 1: 0, 2: 0, 3: 0 }

    for (const r of results) {
      // Visceral
      if (r.visceral.colorTemp === "A") visceralCounts.colorTemp["Cool Tones"]++
      else if (r.visceral.colorTemp === "B") visceralCounts.colorTemp["Warm Tones"]++

      if (r.visceral.borderRadius === "A") visceralCounts.borderRadius.Rounded++
      else if (r.visceral.borderRadius === "B") visceralCounts.borderRadius.Sharp++

      if (r.visceral.density === "A") visceralCounts.density.Minimal++
      else if (r.visceral.density === "B") visceralCounts.density.Dense++

      // Behavioral
      if (r.behavioral.sidebarMs) behavioralTimes.sidebar.push(r.behavioral.sidebarMs)
      if (r.behavioral.bottomMs) behavioralTimes.bottom.push(r.behavioral.bottomMs)
      if (r.behavioral.preferred === "sidebar") behavioralPreferred.sidebar++
      else if (r.behavioral.preferred === "bottom") behavioralPreferred.bottom++

      // Reflective
      if (r.reflective.brandPick && r.reflective.brandPick in reflectivePicks) {
        reflectivePicks[r.reflective.brandPick as 1 | 2 | 3]++
      }
    }

    const avg = (arr: number[]) =>
      arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null

    return NextResponse.json({
      total,
      visceral: {
        colorTemp: visceralCounts.colorTemp,
        borderRadius: visceralCounts.borderRadius,
        density: visceralCounts.density,
      },
      behavioral: {
        avgSidebarMs: avg(behavioralTimes.sidebar),
        avgBottomMs: avg(behavioralTimes.bottom),
        preferred: behavioralPreferred,
      },
      reflective: {
        brandPicks: {
          "App A — Built for speed": reflectivePicks[1],
          "App B — Designed for you": reflectivePicks[2],
          "App C — Think different": reflectivePicks[3],
        },
      },
    })
  } catch {
    return NextResponse.json({ total: 0, error: "No data yet" })
  }
}

// POST — submit a new result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const result: LabResult = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      visceral: {
        colorTemp: body.visceral?.colorTemp ?? null,
        borderRadius: body.visceral?.borderRadius ?? null,
        density: body.visceral?.density ?? null,
      },
      behavioral: {
        sidebarMs: body.behavioral?.sidebarMs ?? null,
        bottomMs: body.behavioral?.bottomMs ?? null,
        preferred: body.behavioral?.preferred ?? null,
      },
      reflective: {
        brandPick: body.reflective?.brandPick ?? null,
      },
      userAgent: request.headers.get("user-agent"),
    }

    const results = await readResults()
    results.push(result)
    await writeResults(results)

    return NextResponse.json({
      ok: true,
      id: result.id,
      total: results.length,
    })
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 })
  }
}
