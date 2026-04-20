"use client"

import { useState } from "react"

// WCAG contrast ratio calculation
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "")
  if (cleaned.length !== 6) return null
  const num = parseInt(cleaned, 16)
  if (isNaN(num)) return null
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(hex1: string, hex2: string): number | null {
  const rgb1 = hexToRgb(hex1)
  const rgb2 = hexToRgb(hex2)
  if (!rgb1 || !rgb2) return null
  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function getWcagGrade(ratio: number): {
  aa: boolean
  aaLarge: boolean
  aaa: boolean
  aaaLarge: boolean
} {
  return {
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
    aaaLarge: ratio >= 4.5,
  }
}

// Brand palette
const brandColors = [
  { name: "bg", hex: "#0D0B08", label: "Background" },
  { name: "surface", hex: "#13110E", label: "Surface" },
  { name: "elevated", hex: "#1A1714", label: "Elevated" },
  { name: "border", hex: "#2A2520", label: "Border" },
  { name: "text", hex: "#E8E0D4", label: "Text Primary" },
  { name: "secondary", hex: "#A89E8F", label: "Text Secondary" },
  { name: "muted", hex: "#7A7068", label: "Text Muted" },
  { name: "muted-dark", hex: "#5C5449", label: "Muted Dark" },
  { name: "accent", hex: "#94A99B", label: "Accent" },
  { name: "accent-hover", hex: "#A3B5AA", label: "Accent Hover" },
  { name: "warm", hex: "#C4A35A", label: "Warm" },
  { name: "danger", hex: "#8B3A3A", label: "Danger" },
]

const backgrounds = brandColors.filter((c) =>
  ["bg", "surface", "elevated"].includes(c.name)
)

const textColors = brandColors.filter((c) =>
  ["text", "secondary", "muted", "muted-dark", "accent", "warm", "danger"].includes(c.name)
)

function Badge({
  pass,
  label,
}: {
  pass: boolean
  label: string
}) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
        pass
          ? "bg-brand-accent/20 text-brand-accent"
          : "bg-brand-danger/20 text-brand-danger"
      }`}
    >
      {label}
    </span>
  )
}

export default function ContrastChecker() {
  const [fg, setFg] = useState("#E8E0D4")
  const [bg, setBg] = useState("#0D0B08")
  const [customFg, setCustomFg] = useState("")
  const [customBg, setCustomBg] = useState("")

  const activeFg = customFg && hexToRgb(customFg) ? customFg : fg
  const activeBg = customBg && hexToRgb(customBg) ? customBg : bg

  const ratio = contrastRatio(activeFg, activeBg)
  const grade = ratio ? getWcagGrade(ratio) : null

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif-display text-3xl md:text-4xl">
          Contrast Checker
        </h1>
        <p className="mt-2 text-sm text-brand-secondary">
          WCAG accessibility audit for the Onyx brand palette. Every text/background
          pair checked against AA and AAA standards.
        </p>
      </div>

      {/* Interactive checker */}
      <div className="mb-12 rounded-lg border border-brand-border bg-brand-surface p-6">
        <h2 className="font-serif-display text-lg mb-4">Interactive Checker</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-brand-muted-dark">
                Foreground (text)
              </label>
              <div className="mt-2 flex gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {textColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setFg(c.hex)
                        setCustomFg("")
                      }}
                      className={`h-7 w-7 rounded border transition-all ${
                        fg === c.hex && !customFg
                          ? "border-brand-accent scale-110"
                          : "border-brand-border hover:border-brand-border-hover"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
              <input
                type="text"
                value={customFg}
                onChange={(e) => setCustomFg(e.target.value)}
                placeholder="Custom hex: #ffffff"
                className="mt-2 w-full rounded-md border border-brand-border bg-brand-bg px-3 py-1.5 font-mono text-xs text-brand-text placeholder:text-brand-muted-dark focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-brand-muted-dark">
                Background
              </label>
              <div className="mt-2 flex gap-2">
                {backgrounds.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setBg(c.hex)
                      setCustomBg("")
                    }}
                    className={`h-7 w-7 rounded border transition-all ${
                      bg === c.hex && !customBg
                        ? "border-brand-accent scale-110"
                        : "border-brand-border hover:border-brand-border-hover"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  />
                ))}
              </div>
              <input
                type="text"
                value={customBg}
                onChange={(e) => setCustomBg(e.target.value)}
                placeholder="Custom hex: #000000"
                className="mt-2 w-full rounded-md border border-brand-border bg-brand-bg px-3 py-1.5 font-mono text-xs text-brand-text placeholder:text-brand-muted-dark focus:outline-none focus:ring-1 focus:ring-brand-accent"
              />
            </div>
          </div>

          {/* Preview + results */}
          <div>
            <div
              className="rounded-lg border border-brand-border p-5"
              style={{ backgroundColor: activeBg }}
            >
              <p
                className="font-serif-display text-2xl"
                style={{ color: activeFg }}
              >
                The quick brown fox
              </p>
              <p className="mt-2 text-sm" style={{ color: activeFg }}>
                Jumps over the lazy dog. This is body text at 14px — the
                standard for UI copy and descriptions.
              </p>
              <p className="mt-1 text-xs" style={{ color: activeFg }}>
                Small text at 12px — labels, timestamps, metadata.
              </p>
            </div>

            {ratio && grade && (
              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-2xl font-bold text-brand-text">
                    {ratio.toFixed(2)}:1
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge pass={grade.aaa} label="AAA" />
                  <Badge pass={grade.aa} label="AA" />
                  <Badge pass={grade.aaaLarge} label="AAA Large" />
                  <Badge pass={grade.aaLarge} label="AA Large" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Matrix */}
      <div>
        <h2 className="font-serif-display text-lg mb-4">
          Full Palette Matrix
        </h2>
        <p className="mb-6 text-sm text-brand-secondary">
          Every text color against every background. Green passes AA (4.5:1),
          red fails.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="sticky left-0 bg-brand-bg p-2 text-left text-brand-muted-dark">
                  Text ↓ / Bg →
                </th>
                {backgrounds.map((bg) => (
                  <th key={bg.name} className="p-2 text-center text-brand-muted-dark">
                    <div
                      className="mx-auto mb-1 h-4 w-4 rounded border border-brand-border"
                      style={{ backgroundColor: bg.hex }}
                    />
                    {bg.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {textColors.map((tc) => (
                <tr key={tc.name} className="border-t border-brand-border">
                  <td className="sticky left-0 bg-brand-bg p-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded"
                        style={{ backgroundColor: tc.hex }}
                      />
                      <span className="text-brand-secondary">{tc.label}</span>
                      <span className="font-mono text-brand-muted-dark">{tc.hex}</span>
                    </div>
                  </td>
                  {backgrounds.map((bgc) => {
                    const r = contrastRatio(tc.hex, bgc.hex)
                    const g = r ? getWcagGrade(r) : null
                    return (
                      <td key={bgc.name} className="p-2 text-center">
                        {r && g ? (
                          <div>
                            <span
                              className={`font-mono font-semibold ${
                                g.aa ? "text-brand-accent" : "text-brand-danger"
                              }`}
                            >
                              {r.toFixed(1)}
                            </span>
                            <div className="mt-0.5 flex justify-center gap-0.5">
                              <span
                                className={`inline-block h-1.5 w-1.5 rounded-full ${
                                  g.aa ? "bg-brand-accent" : "bg-brand-danger"
                                }`}
                              />
                              {g.aaLarge && (
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-accent/50" />
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-brand-muted-dark">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-brand-muted-dark">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-accent" />
            Passes AA (4.5:1)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-danger" />
            Fails AA
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-accent/50" />
            Passes Large Text (3:1)
          </span>
        </div>
      </div>
    </div>
  )
}
