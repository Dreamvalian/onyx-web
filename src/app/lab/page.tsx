"use client"

import { useState } from "react"
import EmotionalDesignLab from "@/components/landing/emotional-design-lab"
import ContrastChecker from "@/components/landing/contrast-checker"
import { Footer } from "@/components/landing/footer"

const tabs = [
  { id: "emotional", label: "Emotional Design" },
  { id: "contrast", label: "Contrast Checker" },
]

export default function LabPage() {
  const [active, setActive] = useState("emotional")

  return (
    <main className="pt-24 pb-20">
      {/* Tab bar */}
      <div className="mx-auto max-w-5xl px-4 mb-10">
        <div className="flex gap-1 border-b border-brand-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                active === tab.id
                  ? "border-b-2 border-brand-accent text-brand-accent"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {active === "emotional" && <EmotionalDesignLab />}
      {active === "contrast" && <ContrastChecker />}

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  )
}
