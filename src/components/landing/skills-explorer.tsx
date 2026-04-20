"use client"

import { useState, useMemo } from "react"
import { Search, ChevronDown } from "lucide-react"
import skillsData from "@/data/skills.json"

const SKILLS = skillsData.skills
const CATEGORIES = skillsData.categories
const TOTAL = skillsData.total

const CAT_COLORS: Record<string, string> = {
 security: "bg-red-500/10 text-red-400 border-red-500/20",
 wondelai: "bg-purple-500/10 text-purple-400 border-purple-500/20",
 community: "bg-blue-500/10 text-blue-400 border-blue-500/20",
 mlops: "bg-green-500/10 text-green-400 border-green-500/20",
 devops: "bg-orange-500/10 text-orange-400 border-orange-500/20",
 memory: "bg-pink-500/10 text-pink-400 border-pink-500/20",
 "context-engineering": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
 research: "bg-amber-500/10 text-amber-400 border-amber-500/20",
 creative: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20",
 "software-development": "bg-teal-500/10 text-teal-400 border-teal-500/20",
 github: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

function getCatColor(cat: string): string {
 return CAT_COLORS[cat] || "bg-[#7a7068]/10 border-[#94a99b]/20"
}

export default function SkillsExplorer() {
 const [search, setSearch] = useState("")
 const [selectedCat, setSelectedCat] = useState<string | null>(null)
 const [expanded, setExpanded] = useState<string | null>(null)

 const filtered = useMemo(() => {
 let results = SKILLS
 if (selectedCat) {
 results = results.filter((s) => s.category === selectedCat)
 }
 if (search.trim()) {
 const q = search.trim().toLowerCase()
 results = results.filter(
 (s) =>
 s.name.toLowerCase().includes(q) ||
 s.description.toLowerCase().includes(q) ||
 s.tags.some((t) => t.toLowerCase().includes(q))
 )
 }
 return results
 }, [search, selectedCat])

 const catList = Object.entries(CATEGORIES)

 return (
 <section className="border-t py-20 border-[#2a2520]">
 <div className="mx-auto max-w-5xl px-4">
 <div className="text-center">
 <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
 Skill Explorer
 </h2>
 <p className="mx-auto mt-4 max-w-xl text-[#7a7068]">
 {TOTAL} skills loaded. Each one is specialized domain knowledge that
 Onyx can pull from on demand.
 </p>
 </div>

 {/* Search */}
 <div className="mx-auto mt-8 max-w-2xl">
 <div className="relative">
 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5c5449]" />
 <input
 type="text"
 placeholder="Search skills by name, description, or tag..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full rounded-xl border py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[#94a99b] border-[#2a2520] bg-[#13110e] text-[#e8edef] focus:border-[#94a99b]/50"
 />
 </div>
 </div>

 {/* Category pills */}
 <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
 <button
 onClick={() => setSelectedCat(null)}
 className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
 selectedCat === null
 ? "border-[#94a99b] bg-[#94a99b]/10 text-[#94a99b]"
 : "border-[#2a2520] text-[#7a7068] hover:border-[#3a352e]"
 }`}
 >
 All ({TOTAL})
 </button>
 {catList.map(([cat, count]) => (
 <button
 key={cat}
 onClick={() => setSelectedCat(selectedCat === cat ? null : cat)}
 className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
 selectedCat === cat
 ? "border-[#94a99b] bg-[#94a99b]/10 text-[#94a99b]"
 : "border-[#2a2520] text-[#7a7068] hover:border-[#3a352e]"
 }`}
 >
 {cat} ({count})
 </button>
 ))}
 </div>

 {/* Results count */}
 <p className="mt-4 text-center text-xs text-[#5c5449]">
 {filtered.length} skill{filtered.length !== 1 ? "s" : ""}
 {selectedCat ? ` in ${selectedCat}` : ""}
 {search ? ` matching "${search}"` : ""}
 </p>

 {/* Skill grid — no animation to prevent opacity=0 on re-render */}
 <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 {filtered.slice(0, 60).map((skill) => (
 <div
 key={skill.path}
 onClick={() => setExpanded(expanded === skill.path ? null : skill.path)}
 className="group cursor-pointer rounded-xl border p-4 transition-colors border-[#2a2520] bg-[#13110e] hover:border-[#3a352e]"
 >
 <div className="flex items-start justify-between">
 <h3 className="font-mono text-sm font-semibold leading-tight text-[#e8edef]">
 {skill.name}
 </h3>
 <ChevronDown
 className={`h-3.5 w-3.5 shrink-0 transition-transform ${
 expanded === skill.path ? "rotate-180" : ""
 }`}
 />
 </div>

 <span
 className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${getCatColor(
 skill.category
 )}`}
 >
 {skill.category}
 </span>

 {skill.description && (
 <p
 className={`mt-2 text-xs leading-relaxed text-[#6a7a72] ${
 expanded === skill.path ? "" : "line-clamp-2"
 }`}
 >
 {skill.description}
 </p>
 )}

 {expanded === skill.path && (
 <div className="mt-2 border-t pt-2 border-[#2a2520]">
 <p className="font-mono text-[10px] text-[#5c5449]">
 {skill.path}
 </p>
 {skill.version && (
 <p className="mt-0.5 text-[10px] text-[#5c5449]">
 v{skill.version}
 </p>
 )}
 </div>
 )}
 </div>
 ))}
 </div>

 {filtered.length > 60 && (
 <p className="mt-6 text-center text-xs text-[#5c5449]">
 Showing 60 of {filtered.length}. Refine your search to see more.
 </p>
 )}
 </div>
 </section>
 )
}
