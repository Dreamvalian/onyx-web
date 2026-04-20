"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ArrowUpDown, ChevronDown, ChevronUp, ListFilter, RefreshCw } from "lucide-react"

interface Skill {
 name: string
 source: string
}

type SortMode = "name-asc" | "name-desc"

export function SkillsExplorer({ skills, plugins, loading }: {
 skills: Skill[]
 plugins: { name: string }[]
 loading: boolean
}) {
 const [search, setSearch] = useState("")
 const [sort, setSort] = useState<SortMode>("name-asc")
 const [filter, setFilter] = useState<string>("all")
 const [showSortMenu, setShowSortMenu] = useState(false)
 const [expanded, setExpanded] = useState<string | null>(null)

 // Extract sources
 const sources = useMemo(() => {
 const counts: Record<string, number> = {}
 skills.forEach((s) => {
 const src = s.source || "local"
 counts[src] = (counts[src] || 0) + 1
 })
 return Object.entries(counts).sort((a, b) => b[1] - a[1])
 }, [skills])

 // Filter + search + sort
 const filtered = useMemo(() => {
 if (!skills || skills.length === 0) return []

 let result = [...skills]

 if (filter !== "all") {
 result = result.filter((s) => (s.source || "local") === filter)
 }

 if (search.trim()) {
 const q = search.trim().toLowerCase()
 result = result.filter((s) => s.name.toLowerCase().includes(q))
 }

 result.sort((a, b) =>
 sort === "name-asc"
 ? a.name.localeCompare(b.name)
 : b.name.localeCompare(a.name)
 )

 return result
 }, [skills, search, sort, filter])

 const totalItems = skills.length + plugins.length

 return (
 <Card>
 <CardHeader>
 <div className="flex items-center justify-between">
 <CardTitle className="text-sm font-medium flex items-center gap-2">
 <ListFilter className="h-4 w-4" />
 Skills & Plugins
 </CardTitle>
 <span className="text-xs text-[#7a7068]">
 {loading && totalItems === 0 ? "—" : `${totalItems} installed`}
 </span>
 </div>
 </CardHeader>
 <CardContent className="space-y-3">
 {loading && totalItems === 0 ? (
 <div className="flex justify-center py-4">
 <RefreshCw className="h-5 w-5 animate-spin text-[#7a7068]" />
 </div>
 ) : totalItems === 0 ? (
 <p className="text-sm text-[#6a7a72]">No skills or plugins found</p>
 ) : (
 <>
 {/* Search */}
 <div className="relative">
 <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#5c5449]" />
 <input
 type="text"
 placeholder="Search skills..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 className="w-full rounded-lg border bg-transparent py-2 pl-9 pr-4 text-xs outline-none transition-colors focus:border-[#94a99b] border-[#2a2520] bg-[#0d0b08] text-[#e8edef] focus:border-[#94a99b]/50"
 />
 </div>

 {/* Filter + Sort row */}
 <div className="flex items-center gap-2 flex-wrap">
 <div className="flex flex-wrap gap-1.5 flex-1">
 <button
 onClick={() => setFilter("all")}
 className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
 filter === "all"
 ? "border-[#94a99b] bg-[#94a99b]/10 text-[#94a99b]"
 : "border-[#2a2520] text-[#7a7068]"
 }`}
 >
 All
 </button>
 {sources.slice(0, 5).map(([src, count]) => (
 <button
 key={src}
 onClick={() => setFilter(filter === src ? "all" : src)}
 className={`rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition-colors ${
 filter === src
 ? "border-[#94a99b] bg-[#94a99b]/10 text-[#94a99b]"
 : "border-[#2a2520] text-[#7a7068]"
 }`}
 >
 {src} ({count})
 </button>
 ))}
 </div>
 <div className="relative shrink-0">
 <Button
 variant="outline"
 size="sm"
 onClick={() => setShowSortMenu(!showSortMenu)}
 className="h-7 gap-1 px-2 text-[10px]"
 >
 <ArrowUpDown className="h-3 w-3" />
 {sort === "name-asc" ? "A-Z" : "Z-A"}
 {showSortMenu ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
 </Button>
 {showSortMenu && (
 <div className="absolute right-0 top-8 z-10 w-28 rounded-lg border p-1 shadow-lg border-[#2a2520] bg-[#13110e]">
 {(["name-asc", "name-desc"] as SortMode[]).map((mode) => (
 <button
 key={mode}
 onClick={() => { setSort(mode); setShowSortMenu(false) }}
 className={`w-full rounded-md px-2 py-1.5 text-left text-xs transition-colors ${
 sort === mode
 ? "bg-[#94a99b]/10 text-[#94a99b]"
 : "hover:text-[#6a7a72] hover:bg-[#1a1714]"
 }`}
 >
 {mode === "name-asc" ? "Name A-Z" : "Name Z-A"}
 </button>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* Count */}
 <p className="text-[10px] text-[#5c5449]">
 {filtered.length} of {skills.length} skills
 {filter !== "all" ? ` · ${filter}` : ""}
 {search ? ` · "${search}"` : ""}
 </p>

 {/* List */}
 <div className="space-y-1 max-h-72 overflow-y-auto">
 {filtered.map((s) => (
 <div
 key={`${s.name}-${s.source}`}
 onClick={() => setExpanded(expanded === s.name ? null : s.name)}
 className="group cursor-pointer rounded-md border px-3 py-2 transition-colors hover:border-[#2a2520] hover:border-[#3a352e]"
 >
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2 min-w-0">
 <span className="text-xs font-medium font-mono truncate text-[#e8edef]">
 {s.name}
 </span>
 <Badge variant="secondary" className="text-[9px] shrink-0 px-1.5 py-0">
 {s.source || "local"}
 </Badge>
 </div>
 {expanded === s.name ? (
 <ChevronUp className="h-3 w-3 shrink-0 text-[#5c5449]" />
 ) : (
 <ChevronDown className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
 )}
 </div>
 {expanded === s.name && (
 <div className="mt-1.5 border-t pt-1.5 border-[#2a2520]">
 <p className="text-[10px] font-mono text-[#5c5449]">
 source: {s.source || "local"}
 </p>
 </div>
 )}
 </div>
 ))}
 {filtered.length === 0 && search && (
 <p className="py-4 text-center text-xs text-[#5c5449]">
 No skills match &quot;{search}&quot;
 </p>
 )}
 </div>

 {/* Plugins */}
 {plugins.length > 0 && (
 <div className="border-t pt-3 border-[#2a2520]">
 <p className="text-[10px] font-semibold uppercase tracking-widest mb-2">
 Plugins
 </p>
 <div className="flex flex-wrap gap-1.5">
 {plugins.map((p) => (
 <Badge key={`plugin-${p.name}`} variant="outline" className="text-[10px]">
 {p.name}
 </Badge>
 ))}
 </div>
 </div>
 )}
 </>
 )}
 </CardContent>
 </Card>
 )
}
