"use client"

import { useState } from "react"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

// Visceral demo data
const visceralPairs = [
 {
 id: 1,
 labelA: "Cool Tones",
 labelB: "Warm Tones",
 styleA: {
 bg: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900",
 accent: "bg-blue-400",
 text: "text-blue-100",
 card: "bg-blue-950/60 border-blue-800/40",
 },
 styleB: {
 bg: "bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900",
 accent: "bg-amber-400",
 text: "text-amber-100",
 card: "bg-amber-950/60 border-amber-800/40",
 },
 },
 {
 id: 2,
 labelA: "Rounded",
 labelB: "Sharp",
 styleA: { radius: "rounded-2xl", shadow: "shadow-lg shadow-blue-500/10" },
 styleB: { radius: "rounded-none", shadow: "shadow-lg shadow-neutral-500/10" },
 },
 {
 id: 3,
 labelA: "Minimal",
 labelB: "Dense",
 styleA: { density: "p-8 gap-6 text-lg", icon: "h-10 w-10" },
 styleB: { density: "p-3 gap-2 text-xs", icon: "h-4 w-4" },
 },
]

// Behavioral demo — two navigation patterns
const navItems = ["Home", "Products", "Settings", "Profile", "Help"]

// Reflective demo data
const brandCards = [
 {
 id: 1,
 name: "App A",
 tagline: "Built for speed.",
 values: ["Efficiency", "Performance", "Results"],
 color: "from-blue-600 to-cyan-500",
 },
 {
 id: 2,
 name: "App B",
 tagline: "Designed for you.",
 values: ["Warmth", "Care", "Connection"],
 color: "from-rose-500 to-orange-400",
 },
 {
 id: 3,
 name: "App C",
 tagline: "Think different.",
 values: ["Innovation", "Creativity", "Bold"],
 color: "from-purple-600 to-pink-500",
 },
]

// UX-Tips mapping
const uxTipsMapping = [
 { dimension: "Aesthetics", level: "visceral", description: "Look & feel, first impression visual" },
 { dimension: "Utility", level: "behavioral", description: "Function & usefulness during use" },
 { dimension: "Efficiency", level: "behavioral", description: "Speed & task efficiency" },
 { dimension: "Feedback", level: "behavioral", description: "System response to user actions" },
 { dimension: "Learning & Ease of Use", level: "behavioral", description: "Ease of learning & navigation" },
 { dimension: "Control", level: "behavioral", description: "User control over interaction" },
 { dimension: "Physical Characteristics", level: "behavioral", description: "Touch, gesture, physical interaction" },
 { dimension: "Emotion", level: "reflective", description: "Feelings after the experience" },
 { dimension: "Engagement", level: "reflective", description: "Connection with the product" },
 { dimension: "Innovative", level: "reflective", impression: "Innovation & differentiation" },
 { dimension: "Social", level: "reflective", description: "Social aspect & identity" },
 { dimension: "Value-Added", level: "reflective", description: "Perceived added value" },
 { dimension: "Satisfaction", level: "reflective", description: "Overall satisfaction" },
]

// Likert assessment — behavioral dimensions
const behavioralLikert = [
 { dimension: "Utility", items: [
 { id: "b_util_1", text: "This product meets my needs" },
 { id: "b_util_2", text: "I would use this regularly" },
 ]},
 { dimension: "Efficiency", items: [
 { id: "b_eff_1", text: "Tasks are completed quickly" },
 { id: "b_eff_2", text: "No wasted steps in the workflow" },
 ]},
 { dimension: "Feedback", items: [
 { id: "b_feed_1", text: "I always know what is happening" },
 { id: "b_feed_2", text: "Responses feel immediate" },
 ]},
 { dimension: "Learning & Ease", items: [
 { id: "b_learn_1", text: "Easy to learn without help" },
 { id: "b_learn_2", text: "Navigation feels natural" },
 ]},
 { dimension: "Control", items: [
 { id: "b_ctrl_1", text: "I feel in charge of the interaction" },
 { id: "b_ctrl_2", text: "I can undo mistakes easily" },
 ]},
 { dimension: "Physical", items: [
 { id: "b_phys_1", text: "Touch and click feel responsive" },
 { id: "b_phys_2", text: "Gestures and interactions are intuitive" },
 ]},
]

// Likert assessment — reflective dimensions
const reflectiveLikert = [
 { dimension: "Emotion", items: [
 { id: "r_emo_1", text: "I feel good after using this" },
 { id: "r_emo_2", text: "This experience made me smile" },
 ]},
 { dimension: "Engagement", items: [
 { id: "r_eng_1", text: "I lost track of time" },
 { id: "r_eng_2", text: "I want to come back" },
 ]},
 { dimension: "Innovative", items: [
 { id: "r_inn_1", text: "This feels new and different" },
 { id: "r_inn_2", text: "I have not seen this approach before" },
 ]},
 { dimension: "Social", items: [
 { id: "r_soc_1", text: "I would recommend this to others" },
 { id: "r_soc_2", text: "This reflects who I am" },
 ]},
 { dimension: "Value-Added", items: [
 { id: "r_val_1", text: "This is worth my time" },
 { id: "r_val_2", text: "I would pay for this" },
 ]},
 { dimension: "Satisfaction", items: [
 { id: "r_sat_1", text: "I am happy with the experience" },
 { id: "r_sat_2", text: "I would choose this over alternatives" },
 ]},
]

const likertLabels = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]

const levelColors: Record<string, string> = {
 visceral: "border-rose-500/30 bg-rose-500/5 text-rose-400",
 behavioral: "border-blue-500/30 bg-blue-500/5 text-blue-400",
 reflective: "border-purple-500/30 bg-purple-500/5 text-purple-400",
}

const levelLabels: Record<string, string> = {
 visceral: "Visceral",
 behavioral: "Behavioral",
 reflective: "Reflective",
}

// Design personality archetypes
interface Personality {
 name: string
 emoji: string
 color: string
 tagline: string
 description: string
 traits: string[]
}

const personalities: Record<string, Personality> = {
 precisionist: {
 name: "The Precisionist",
 emoji: "🎯",
 color: "from-slate-600 to-blue-500",
 tagline: "Clean. Sharp. Precise.",
 description:
 "You gravitate toward cool tones, clean lines, and functional density. Your design instinct is to remove noise and let the system speak. You value efficiency over warmth, structure over expression. Apple would hire you.",
 traits: ["Systems thinking", "Information hierarchy", "Visual clarity"],
 },
 humanist: {
 name: "The Humanist",
 emoji: "🫶",
 color: "from-rose-500 to-orange-400",
 tagline: "Warm. Rounded. Connected.",
 description:
 "You lead with warmth. Rounded corners, warm palettes, and human connection drive your design choices. You believe interfaces should feel like a conversation, not a command line. Duolingo energy.",
 traits: ["Emotional design", "User empathy", "Brand warmth"],
 },
 innovator: {
 name: "The Innovator",
 emoji: "⚡",
 color: "from-purple-600 to-pink-500",
 tagline: "Bold. Different. Forward.",
 description:
 "Sharp edges, cool tones, and a pull toward what's new. You're drawn to design that pushes boundaries — not for the sake of being different, but because you see what could be. Linear energy.",
 traits: ["Boundary pushing", "Future-focused", "Creative risk"],
 },
 minimalist: {
 name: "The Minimalist",
 emoji: "◻️",
 color: "from-neutral-500 to-slate-400",
 tagline: "Less. But better.",
 description:
 "You chose minimal density, round shapes, and cool palettes. Not because you lack imagination, but because you know restraint is the hardest design skill. Every pixel earns its place.",
 traits: ["Restraint", "Whitespace mastery", "Typography focus"],
 },
 maximalist: {
 name: "The Maximalist",
 emoji: "🎨",
 color: "from-amber-500 to-rose-500",
 tagline: "More is more.",
 description:
 "Warm tones, dense information, bold brand choices. You believe design should be expressive, rich, and unapologetically opinionated. Not every screen needs to breathe — some need to shout.",
 traits: ["Visual richness", "Brand expression", "Information density"],
 },
 pragmatist: {
 name: "The Pragmatist",
 emoji: "🔧",
 color: "from-teal-500 to-cyan-500",
 tagline: "Ship it.",
 description:
 "You care about what works. Not too warm, not too cold. Not too sparse, not too dense. You picked the sidebar because it's faster, not because it's prettier. Function ships. Form follows.",
 traits: ["Task efficiency", "Usability first", "Iteration speed"],
 },
 storyteller: {
 name: "The Storyteller",
 emoji: "📖",
 color: "from-violet-500 to-fuchsia-500",
 tagline: "Every interface tells a story.",
 description:
 "Warm palette, rounded shapes, and a preference for engagement over raw performance. You see interfaces as narratives — each screen a chapter, each interaction a plot point. Airbnb design energy.",
 traits: ["Narrative flow", "User journey", "Emotional pacing"],
 },
 architect: {
 name: "The Architect",
 emoji: "🏗️",
 color: "from-stone-500 to-zinc-600",
 tagline: "Structure is beauty.",
 description:
 "Cool tones, sharp lines, and you picked performance over personality. You design systems, not screens. Every component is a building block, every pattern a foundation. You think in grids and scales.",
 traits: ["Design systems", "Component thinking", "Scalability"],
 },
}

function computePersonality(
 visceralVotes: Record<number, string>,
 preferredNav: string | null,
 recommendPick: number | null
): Personality {
 // Score each archetype based on choices
 const scores: Record<string, number> = {}
 Object.keys(personalities).forEach((k) => (scores[k] = 0))

 // Visceral: color temperature
 if (visceralVotes[1] === "A") {
 // Cool → precisionist, innovator, minimalist, architect
 scores.precisionist += 2
 scores.innovator += 2
 scores.minimalist += 1
 scores.architect += 2
 } else if (visceralVotes[1] === "B") {
 // Warm → humanist, maximalist, storyteller, pragmatist
 scores.humanist += 2
 scores.maximalist += 2
 scores.storyteller += 2
 scores.pragmatist += 1
 }

 // Visceral: border radius
 if (visceralVotes[2] === "A") {
 // Rounded → humanist, minimalist, storyteller
 scores.humanist += 2
 scores.minimalist += 2
 scores.storyteller += 2
 scores.pragmatist += 1
 } else if (visceralVotes[2] === "B") {
 // Sharp → precisionist, innovator, architect, maximalist
 scores.precisionist += 2
 scores.innovator += 2
 scores.architect += 2
 scores.maximalist += 1
 }

 // Visceral: density
 if (visceralVotes[3] === "A") {
 // Minimal → minimalist, humanist, storyteller
 scores.minimalist += 2
 scores.humanist += 1
 scores.storyteller += 1
 scores.precisionist += 1
 } else if (visceralVotes[3] === "B") {
 // Dense → maximalist, pragmatist, architect, innovator
 scores.maximalist += 2
 scores.pragmatist += 2
 scores.architect += 2
 scores.innovator += 1
 }

 // Behavioral: preferred nav
 if (preferredNav === "sidebar") {
 scores.architect += 2
 scores.precisionist += 1
 scores.minimalist += 1
 } else if (preferredNav === "bottom") {
 scores.humanist += 1
 scores.storyteller += 1
 scores.pragmatist += 1
 }

 // Reflective: brand pick
 if (recommendPick === 1) {
 // Speed → precisionist, pragmatist, architect
 scores.precisionist += 2
 scores.pragmatist += 2
 scores.architect += 1
 } else if (recommendPick === 2) {
 // Connection → humanist, storyteller, minimalist
 scores.humanist += 2
 scores.storyteller += 2
 scores.minimalist += 1
 } else if (recommendPick === 3) {
 // Innovation → innovator, maximalist, architect
 scores.innovator += 2
 scores.maximalist += 1
 scores.architect += 1
 }

 // Find winner
 const winner = Object.entries(scores).reduce((a, b) =>
 a[1] >= b[1] ? a : b
 )

 return personalities[winner[0]]
}

export default function EmotionalDesignLab() {
 // Visceral state
 const [visceralVotes, setVisceralVotes] = useState<Record<number, string>>({})
 const [visceralTimer, setVisceralTimer] = useState<Record<number, boolean>>({})

 // Behavioral state
 const [behavioralMode, setBehavioralMode] = useState<"sidebar" | "bottom">("sidebar")
 const [activeNav, setActiveNav] = useState("Home")
 const [taskStart, setTaskStart] = useState<Record<string, number>>({})
 const [taskDone, setTaskDone] = useState<Record<string, number>>({})

 // Reflective state
 const [recommendPick, setRecommendPick] = useState<number | null>(null)
 const [expandedLevel, setExpandedLevel] = useState<string | null>(null)

 // Submit state (data submission happens silently on reveal)
 const [aggregate, setAggregate] = useState<any>(null)
 const [preferredNav, setPreferredNav] = useState<string | null>(null)

 // Personality state
 const [personality, setPersonality] = useState<Personality | null>(null)
 const [revealed, setRevealed] = useState(false)

 // Assessment state
 const [assessmentActive, setAssessmentActive] = useState(false)
 const [assessmentStep, setAssessmentStep] = useState<"visceral" | "behavioral" | "reflective" | "results">("visceral")
 const [likertAnswers, setLikertAnswers] = useState<Record<string, number>>({})

 const handleLikertAnswer = (itemId: string, value: number) => {
 setLikertAnswers((p) => ({ ...p, [itemId]: value }))
 }

 const computeDimensionScore = (items: { id: string }[]): number => {
 const values = items.map(i => likertAnswers[i.id]).filter(v => v !== undefined)
 if (values.length === 0) return 0
 return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 20) // 1-5 → 20-100
 }

 const computeLevelScores = () => {
 const behavioralDims = behavioralLikert.map(d => ({
 dimension: d.dimension,
 score: computeDimensionScore(d.items)
 }))
 const reflectiveDims = reflectiveLikert.map(d => ({
 dimension: d.dimension,
 score: computeDimensionScore(d.items)
 }))
 const behavioralAvg = behavioralDims.length > 0
 ? Math.round(behavioralDims.reduce((a, b) => a + b.score, 0) / behavioralDims.length)
 : 0
 const reflectiveAvg = reflectiveDims.length > 0
 ? Math.round(reflectiveDims.reduce((a, b) => a + b.score, 0) / reflectiveDims.length)
 : 0
 // Visceral score: based on completion (binary choices mapped to ~60 for cool/minimal, ~80 for warm/dense)
 const visceralCompleted = visceralVotes[1] && visceralVotes[2] && visceralVotes[3]
 const visceralScore = visceralCompleted ? 70 : 0 // Default mid-high since it's gut reaction
 return {
 visceral: visceralScore,
 behavioral: behavioralAvg,
 reflective: reflectiveAvg,
 behavioralDims,
 reflectiveDims,
 }
 }

 const radarData = (() => {
 const scores = computeLevelScores()
 return [
 { level: "Visceral", score: scores.visceral, fullMark: 100 },
 { level: "Behavioral", score: scores.behavioral, fullMark: 100 },
 { level: "Reflective", score: scores.reflective, fullMark: 100 },
 ]
 })()

 const handleVisceralVote = (pairId: number, choice: string) => {
 if (!visceralTimer[pairId]) {
 // Start 5-second timer
 setVisceralTimer((p) => ({ ...p, [pairId]: true }))
 setTimeout(() => {
 setVisceralVotes((p) => ({ ...p, [pairId]: choice }))
 }, 5000)
 }
 }

 const handleTaskStart = (mode: string) => {
 setTaskStart((p) => ({ ...p, [mode]: Date.now() }))
 }

 const handleTaskDone = (mode: string) => {
 if (taskStart[mode]) {
 setTaskDone((p) => ({ ...p, [mode]: Date.now() - taskStart[mode] }))
 }
 }

 return (
 <section className="border-t py-20 border-[#2a2520]">
 <div className="mx-auto max-w-5xl px-4">
 {/* Header */}
 <div className="text-center">
 <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
 Emotional Design Lab
 </h2>
 <p className="mx-auto mt-4 max-w-xl text-[#7a7068]">
 Norman&apos;s 3-Level model applied to real interfaces. Not theory
 for theory&apos;s sake — this is how emotion drives design
 decisions.
 </p>
 </div>

 {/* Level overview cards */}
 <div className="mt-12 grid gap-4 md:grid-cols-3">
 {[
 {
 level: "visceral",
 title: "Visceral",
 timing: "~200ms",
 brain: "Amygdala",
 desc: "First sight. Before thinking. Look, feel, gut reaction.",
 color: "text-rose-400 border-rose-500/20 bg-rose-500/5",
 },
 {
 level: "behavioral",
 title: "Behavioral",
 timing: "During use",
 brain: "Cerebellum",
 desc: "How it works. Usability, efficiency, comfort.",
 color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
 },
 {
 level: "reflective",
 title: "Reflective",
 timing: "After use",
 brain: "Prefrontal cortex",
 desc: "What it means. Identity, self-expression, brand.",
 color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
 },
 ].map((item) => (
 <div
 key={item.level}
 onClick={() =>
 setExpandedLevel(
 expandedLevel === item.level ? null : item.level
 )
 }
 className={`cursor-pointer rounded-xl border p-5 transition-all ${item.color}`}
 >
 <div className="flex items-center justify-between">
 <h3 className="text-lg font-bold">{item.title}</h3>
 <span className="text-[10px] font-mono opacity-60">
 {item.timing}
 </span>
 </div>
 <p className="mt-1 text-xs opacity-70">{item.brain}</p>
 <p className="mt-3 text-sm opacity-80">{item.desc}</p>
 {expandedLevel === item.level && (
 <div className="mt-3 border-t border-current/10 pt-3">
 <p className="text-xs opacity-60">
 {item.level === "visceral" &&
 "Measured with: 5-second test, eye tracking, SAM valence, facial coding. UX-Tips dimension: Aesthetics."}
 {item.level === "behavioral" &&
 "Measured with: Think-aloud, SUS, task completion time, error rate. UX-Tips: Utility, Efficiency, Feedback, Learning, Control, Physical."}
 {item.level === "reflective" &&
 "Measured with: Interview, brand love scale, NPS, diary study. UX-Tips: Emotion, Engagement, Innovative, Social, Value-Added, Satisfaction."}
 </p>
 </div>
 )}
 </div>
 ))}
 </div>

 {/* === VISERAL DEMO === */}
 <div className="mt-20">
 <div className="flex items-center gap-3">
 <div className="h-8 w-1 rounded-full bg-rose-500" />
 <div>
 <h3 className="text-xl font-bold">Visceral: 5-Second Test</h3>
 <p className="text-sm text-[#7a7068]">
 Pick the design that &quot;feels right&quot; — don&apos;t think,
 just react. You have 5 seconds per pair.
 </p>
 </div>
 </div>

 <div className="mt-8 space-y-8">
 {/* Pair 1: Color */}
 <div>
 <p className="mb-3 text-xs font-medium text-[#5c5449]">
 Color Temperature
 </p>
 <div className="grid gap-4 md:grid-cols-2">
 {["A", "B"].map((side) => {
 const style =
 side === "A" ? visceralPairs[0].styleA : visceralPairs[0].styleB
 const label =
 side === "A" ? visceralPairs[0].labelA : visceralPairs[0].labelB
 const voted = visceralVotes[1]
 const selected = voted === side
 const waiting = visceralTimer[1] && !voted

 return (
 <button
 key={side}
 onClick={() => handleVisceralVote(1, side)}
 className={`relative overflow-hidden rounded-xl border p-6 text-left transition-all ${
 selected
 ? "border-[#94a99b] ring-2 ring-[#94a99b]/30"
 : "border-[#2a2520]"
 } ${style.bg}`}
 >
 <div className="relative z-10">
 <p className={`text-sm font-medium ${style.text}`}>
 {label}
 </p>
 <div className="mt-3 flex gap-3">
 <div className={`h-8 w-8 rounded-lg ${style.accent}`} />
 <div className={`h-8 w-8 rounded-lg ${style.accent} opacity-60`} />
 <div className={`h-8 w-8 rounded-lg ${style.accent} opacity-30`} />
 </div>
 <div className={`mt-3 rounded-lg border p-3 ${style.card}`}>
 <div className={`h-2 w-16 rounded ${style.accent} mb-2 opacity-40`} />
 <div className={`h-1.5 w-24 rounded ${style.accent} opacity-20`} />
 </div>
 </div>
 {waiting && (
 <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
 <span className="text-xs text-white font-medium animate-pulse">
 Wait 5 seconds...
 </span>
 </div>
 )}
 {selected && (
 <div className="absolute top-2 right-2 z-20 rounded-full bg-[#94a99b] px-2 py-0.5 text-[10px] font-medium text-[#0d0b08]">
 Picked
 </div>
 )}
 </button>
 )
 })}
 </div>
 </div>

 {/* Pair 2: Shape */}
 <div>
 <p className="mb-3 text-xs font-medium text-[#5c5449]">
 Border Radius
 </p>
 <div className="grid gap-4 md:grid-cols-2">
 {["A", "B"].map((side) => {
 const style =
 side === "A" ? visceralPairs[1].styleA : visceralPairs[1].styleB
 const label =
 side === "A" ? visceralPairs[1].labelA : visceralPairs[1].labelB
 const voted = visceralVotes[2]
 const selected = voted === side

 return (
 <button
 key={side}
 onClick={() =>
 setVisceralVotes((p) => ({ ...p, 2: side }))
 }
 className={`rounded-xl border p-6 text-left transition-all ${
 selected
 ? "border-[#94a99b] ring-2 ring-[#94a99b]/30"
 : "border-[#2a2520]"
 }`}
 >
 <p className="text-sm font-medium text-[#e8edef]">
 {label}
 </p>
 <div className="mt-3 flex gap-3">
 <div
 className={`h-12 w-12 bg-[#2a2520] bg-[#2a2520] ${style.radius} ${style.shadow}`}
 />
 <div
 className={`h-12 w-20 bg-[#2a2520] bg-[#2a2520] ${style.radius} ${style.shadow}`}
 />
 <div
 className={`h-12 w-12 bg-[#2a2520] bg-[#2a2520] ${style.radius} ${style.shadow}`}
 />
 </div>
 {selected && (
 <span className="mt-2 inline-block rounded-full bg-[#94a99b] px-2 py-0.5 text-[10px] font-medium text-[#0d0b08]">
 Picked
 </span>
 )}
 </button>
 )
 })}
 </div>
 </div>

 {/* Pair 3: Density */}
 <div>
 <p className="mb-3 text-xs font-medium text-[#5c5449]">
 Information Density
 </p>
 <div className="grid gap-4 md:grid-cols-2">
 {["A", "B"].map((side) => {
 const style =
 side === "A" ? visceralPairs[2].styleA : visceralPairs[2].styleB
 const label =
 side === "A" ? visceralPairs[2].labelA : visceralPairs[2].labelB
 const voted = visceralVotes[3]
 const selected = voted === side

 return (
 <button
 key={side}
 onClick={() =>
 setVisceralVotes((p) => ({ ...p, 3: side }))
 }
 className={`rounded-xl border p-6 text-left transition-all ${
 selected
 ? "border-[#94a99b] ring-2 ring-[#94a99b]/30"
 : "border-[#2a2520]"
 }`}
 >
 <p className="text-sm font-medium text-[#e8edef]">
 {label}
 </p>
 <div
 className={`mt-3 rounded-lg border border-[#2a2520] ${style.density}`}
 >
 <div className="flex items-center gap-3">
 <div
 className={`rounded-lg bg-[#2a2520] bg-[#2a2520] ${style.icon}`}
 />
 <div>
 <div className="h-2 w-20 rounded bg-[#2a2520] bg-[#2a2520]" />
 <div className="mt-1 h-1.5 w-14 rounded bg-[#1a1f1d]" />
 </div>
 </div>
 </div>
 {selected && (
 <span className="mt-2 inline-block rounded-full bg-[#94a99b] px-2 py-0.5 text-[10px] font-medium text-[#0d0b08]">
 Picked
 </span>
 )}
 </button>
 )
 })}
 </div>
 </div>
 </div>
 </div>

 {/* === BEHAVIORAL DEMO === */}
 <div className="mt-20">
 <div className="flex items-center gap-3">
 <div className="h-8 w-1 rounded-full bg-blue-500" />
 <div>
 <h3 className="text-xl font-bold">
 Behavioral: Navigation Task
 </h3>
 <p className="text-sm text-[#7a7068]">
 Find &quot;Settings&quot; in both layouts. Which is faster?
 </p>
 </div>
 </div>

 <div className="mt-6 flex gap-2">
 <button
 onClick={() => setBehavioralMode("sidebar")}
 className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
 behavioralMode === "sidebar"
 ? "border-blue-500 bg-blue-500/10 text-blue-400"
 : "border-[#2a2520] text-[#7a7068]"
 }`}
 >
 Sidebar Nav
 </button>
 <button
 onClick={() => setBehavioralMode("bottom")}
 className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
 behavioralMode === "bottom"
 ? "border-blue-500 bg-blue-500/10 text-blue-400"
 : "border-[#2a2520] text-[#7a7068]"
 }`}
 >
 Bottom Tab Nav
 </button>
 </div>

 <div className="mt-4 overflow-hidden rounded-xl border border-[#2a2520]">
 {behavioralMode === "sidebar" ? (
 // Sidebar layout
 <div className="flex h-64">
 <div className="w-40 border-r p-3 border-[#2a2520] bg-[#13110e]">
 <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#5c5449]">
 Menu
 </p>
 {navItems.map((item) => (
 <button
 key={item}
 onClick={() => {
 setActiveNav(item)
 handleTaskStart("sidebar")
 if (item === "Settings") handleTaskDone("sidebar")
 }}
 className={`mb-1 w-full rounded-lg px-3 py-2 text-left text-xs transition-colors ${
 activeNav === item
 ? "bg-[#94a99b]/10 text-[#94a99b] font-medium"
 : "hover:text-[#7a7068] hover:bg-[#1a1714]"
 }`}
 >
 {item}
 </button>
 ))}
 </div>
 <div className="flex-1 p-6">
 <p className="text-lg font-bold text-[#e8edef]">
 {activeNav}
 </p>
 <p className="mt-1 text-sm text-[#7a7068]">
 Content area for {activeNav}
 </p>
 {taskDone.sidebar && (
 <p className="mt-3 text-xs text-blue-400">
 Found Settings in {taskDone.sidebar}ms
 </p>
 )}
 </div>
 </div>
 ) : (
 // Bottom tab layout
 <div className="flex h-64 flex-col">
 <div className="flex-1 p-6">
 <p className="text-lg font-bold text-[#e8edef]">
 {activeNav}
 </p>
 <p className="mt-1 text-sm text-[#7a7068]">
 Content area for {activeNav}
 </p>
 {taskDone.bottom && (
 <p className="mt-3 text-xs text-blue-400">
 Found Settings in {taskDone.bottom}ms
 </p>
 )}
 </div>
 <div className="flex border-t border-[#2a2520] bg-[#13110e]">
 {navItems.map((item) => (
 <button
 key={item}
 onClick={() => {
 setActiveNav(item)
 handleTaskStart("bottom")
 if (item === "Settings") handleTaskDone("bottom")
 }}
 className={`flex-1 py-3 text-center text-[10px] transition-colors ${
 activeNav === item
 ? "text-[#94a99b] font-medium"
 : "text-[#5c5449]"
 }`}
 >
 {item}
 </button>
 ))}
 </div>
 </div>
 )}
 </div>

 {/* Preference declaration */}
 {(taskDone.sidebar || taskDone.bottom) && (
 <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
 <p className="text-xs font-medium text-blue-400">
 Which layout did you prefer?
 </p>
 <div className="mt-2 flex gap-2">
 <button
 onClick={() => setPreferredNav("sidebar")}
 className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
 preferredNav === "sidebar"
 ? "border-blue-500 bg-blue-500/10 text-blue-400"
 : "border-blue-500/20 text-blue-400/60 hover:text-blue-400"
 }`}
 >
 Sidebar
 </button>
 <button
 onClick={() => setPreferredNav("bottom")}
 className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
 preferredNav === "bottom"
 ? "border-blue-500 bg-blue-500/10 text-blue-400"
 : "border-blue-500/20 text-blue-400/60 hover:text-blue-400"
 }`}
 >
 Bottom Tab
 </button>
 </div>
 </div>
 )}
 </div>
 <div className="mt-20">
 <div className="flex items-center gap-3">
 <div className="h-8 w-1 rounded-full bg-purple-500" />
 <div>
 <h3 className="text-xl font-bold">
 Reflective: Brand Identity
 </h3>
 <p className="text-sm text-[#7a7068]">
 Which app would you recommend to a friend? Not which is
 &quot;best&quot; — which feels like you.
 </p>
 </div>
 </div>

 <div className="mt-6 grid gap-4 md:grid-cols-3">
 {brandCards.map((card) => (
 <button
 key={card.id}
 onClick={() => setRecommendPick(card.id)}
 className={`rounded-xl border p-5 text-left transition-all ${
 recommendPick === card.id
 ? "border-purple-500 ring-2 ring-purple-500/30"
 : "border-[#2a2520] hover:border-[#3a352e]"
 }`}
 >
 <div
 className={`h-2 w-16 rounded-full bg-gradient-to-r ${card.color} mb-3`}
 />
 <h4 className="font-bold text-[#e8edef]">{card.name}</h4>
 <p className="mt-0.5 text-sm text-[#6a7a72]">
 {card.tagline}
 </p>
 <div className="mt-3 flex flex-wrap gap-1.5">
 {card.values.map((v) => (
 <span
 key={v}
 className="rounded-full border px-2 py-0.5 text-[10px] border-[#2a2520] text-[#7a7068]"
 >
 {v}
 </span>
 ))}
 </div>
 {recommendPick === card.id && (
 <span className="mt-3 inline-block rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-medium text-purple-400">
 I&apos;d recommend this
 </span>
 )}
 </button>
 ))}
 </div>
 </div>

 {/* === UX-TIPS MAPPING === */}
 <div className="mt-20">
 <div className="text-center">
 <h3 className="text-xl font-bold">UX-Tips × Norman 3-Level</h3>
 <p className="mx-auto mt-2 max-w-lg text-sm text-[#7a7068]">
 13 UX-Tips dimensions mapped to Norman&apos;s framework. From the
 thesis: which dimensions predict brand loyalty?
 </p>
 </div>

 <div className="mt-8 space-y-2">
 {uxTipsMapping.map((item) => (
 <div
 key={item.dimension}
 className={`flex items-center justify-between rounded-lg border px-4 py-3 ${levelColors[item.level]}`}
 >
 <div>
 <span className="text-sm font-medium text-[#e8edef]">
 {item.dimension}
 </span>
 <span className="ml-2 text-xs opacity-60">
 {item.description || item.impression}
 </span>
 </div>
 <span
 className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${levelColors[item.level]}`}
 >
 {levelLabels[item.level]}
 </span>
 </div>
 ))}
 </div>

 {/* Hypothesis detail */}
 <div className="mt-10">
 <h4 className="text-center text-lg font-bold text-[#e8edef]">
 The 3 Hypotheses
 </h4>
 <p className="mx-auto mt-2 max-w-lg text-center text-sm text-[#7a7068]">
 Each level of Norman&apos;s model predicts a different aspect of
 brand loyalty. The thesis tests all three.
 </p>

 <div className="mt-6 space-y-4">
 {/* H1 */}
 <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
 <div className="flex items-start gap-4">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 font-bold text-sm">
 H1
 </div>
 <div>
 <p className="text-sm font-semibold text-rose-400">
 Visceral Design has a positive effect on Brand Loyalty
 </p>
 <p className="mt-1 text-xs text-[#7a7068]">
 First impression matters. When an app looks good
 immediately — colors, layout, visual harmony — users form
 a positive emotional bond before they even use it.
 Measured through the Aesthetics dimension (visual
 appeal, attractiveness, color harmony).
 </p>
 <div className="mt-2 flex flex-wrap gap-1.5">
 <span className="rounded-full border border-rose-500/20 px-2 py-0.5 text-[10px] text-rose-400/70">
 1 dimension
 </span>
 <span className="rounded-full border border-rose-500/20 px-2 py-0.5 text-[10px] text-rose-400/70">
 3 items measured
 </span>
 <span className="rounded-full border border-rose-500/20 px-2 py-0.5 text-[10px] text-rose-400/70">
 5-second test + eye tracking
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* H2 */}
 <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
 <div className="flex items-start gap-4">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 font-bold text-sm">
 H2
 </div>
 <div>
 <p className="text-sm font-semibold text-blue-400">
 Behavioral Design has a positive effect on Brand Loyalty
 </p>
 <p className="mt-1 text-xs text-[#7a7068]">
 Does the app work well? Can you do things fast? Does it
 respond when you tap? The behavioral level covers
 usability, efficiency, and physical interaction. If
 using the app feels effortless, loyalty follows.
 </p>
 <div className="mt-2 flex flex-wrap gap-1.5">
 {["Utility", "Efficiency", "Feedback", "Learning & Ease", "Control", "Physical"].map((dim) => (
 <span key={dim} className="rounded-full border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400/70">
 {dim}
 </span>
 ))}
 <span className="rounded-full border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400/70">
 16 items measured
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* H3 */}
 <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5">
 <div className="flex items-start gap-4">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 font-bold text-sm">
 H3
 </div>
 <div>
 <p className="text-sm font-semibold text-purple-400">
 Reflective Design has a positive effect on Brand Loyalty
 </p>
 <p className="mt-1 text-xs text-[#7a7068]">
 The strongest predictor. How does the app make you feel
 about yourself? Does it align with your identity? Would
 you recommend it? The reflective level captures meaning,
 self-expression, and the emotional residue after the
 interaction ends.
 </p>
 <div className="mt-2 flex flex-wrap gap-1.5">
 {["Emotion", "Engagement", "Innovative", "Social", "Value-Added", "Satisfaction"].map((dim) => (
 <span key={dim} className="rounded-full border border-purple-500/20 px-2 py-0.5 text-[10px] text-purple-400/70">
 {dim}
 </span>
 ))}
 <span className="rounded-full border border-purple-500/20 px-2 py-0.5 text-[10px] text-purple-400/70">
 10 items measured
 </span>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Summary stats */}
 <div className="mt-6 grid gap-3 md:grid-cols-3">
 <div className="rounded-lg border p-4 text-center border-[#2a2520] bg-[#13110e]">
 <p className="text-2xl font-bold text-[#e8edef]">13</p>
 <p className="text-xs text-[#7a7068]">Total dimensions</p>
 </div>
 <div className="rounded-lg border p-4 text-center border-[#2a2520] bg-[#13110e]">
 <p className="text-2xl font-bold text-[#e8edef]">29</p>
 <p className="text-xs text-[#7a7068]">Survey items (UX-Tips)</p>
 </div>
 <div className="rounded-lg border p-4 text-center border-[#2a2520] bg-[#13110e]">
 <p className="text-2xl font-bold text-[#e8edef]">2</p>
 <p className="text-xs text-[#7a7068]">SAM dimensions (valence + arousal)</p>
 </div>
 </div>
 </div>
 </div>

 {/* === INTERACTIVE ASSESSMENT === */}
 <div className="mt-20">
 <div className="text-center">
 <div className="flex items-center justify-center gap-3">
 <div className="h-8 w-1 rounded-full bg-[#94a99b]" />
 <h3 className="text-xl font-bold">Take the Full Assessment</h3>
 </div>
 <p className="mx-auto mt-2 max-w-lg text-sm text-[#7a7068]">
 24 Likert-scale items across 12 dimensions. Rate statements about a product you recently used, then see your emotional design profile on a radar chart.
 </p>
 </div>

 {!assessmentActive ? (
 <div className="mt-8 text-center">
 <button
 onClick={() => setAssessmentActive(true)}
 className="rounded-lg bg-[#94a99b] px-8 py-3 text-sm font-semibold text-[#0d0b08] transition-colors hover:bg-[#a3b5aa]"
 >
 Start Assessment
 </button>
 <p className="mt-3 text-xs text-[#5c5449]">
 ~3 minutes. Think about a product you recently used while answering.
 </p>
 </div>
 ) : (
 <div className="mt-8">
 {/* Progress bar */}
 <div className="mb-8">
 <div className="flex justify-between text-xs text-[#7a7068] mb-2">
 <span className={assessmentStep === "visceral" ? "text-rose-400 font-medium" : ""}>1. Visceral</span>
 <span className={assessmentStep === "behavioral" ? "text-blue-400 font-medium" : ""}>2. Behavioral</span>
 <span className={assessmentStep === "reflective" ? "text-purple-400 font-medium" : ""}>3. Reflective</span>
 <span className={assessmentStep === "results" ? "text-[#94a99b] font-medium" : ""}>4. Results</span>
 </div>
 <div className="h-1 rounded-full bg-[#2a2520] bg-[#2a2520]">
 <div
 className="h-1 rounded-full bg-[#94a99b] transition-all duration-500"
 style={{
 width: assessmentStep === "visceral" ? "25%"
 : assessmentStep === "behavioral" ? "50%"
 : assessmentStep === "reflective" ? "75%"
 : "100%"
 }}
 />
 </div>
 </div>

 {/* Step 1: Visceral */}
 {assessmentStep === "visceral" && (
 <div>
 <div className="flex items-center gap-2 mb-6">
 <div className="h-6 w-1 rounded-full bg-rose-500" />
 <h4 className="text-lg font-bold">Visceral: First Impressions</h4>
 </div>
 <p className="text-sm text-[#7a7068] mb-6">
 Pick the design that feels right. Don&apos;t overthink it — gut reaction only.
 </p>
 <div className="space-y-6">
 {visceralPairs.map((pair) => (
 <div key={pair.id}>
 <p className="mb-2 text-xs font-medium text-[#5c5449]">
 {pair.id === 1 ? "Color Temperature" : pair.id === 2 ? "Border Radius" : "Information Density"}
 </p>
 <div className="grid gap-3 md:grid-cols-2">
 {["A", "B"].map((side) => {
 const style = side === "A" ? pair.styleA : pair.styleB
 const label = side === "A" ? pair.labelA : pair.labelB
 const selected = visceralVotes[pair.id] === side
 const isColorPair = pair.id === 1
 return (
 <button
 key={side}
 onClick={() => setVisceralVotes((p) => ({ ...p, [pair.id]: side }))}
 className={`rounded-xl border p-4 text-left transition-all ${
 selected
 ? "border-rose-500 ring-2 ring-rose-500/30"
 : "border-[#2a2520]"
 } ${isColorPair ? style.bg : ""}`}
 >
 <p className={`text-sm font-medium ${isColorPair ? style.text : "text-[#e8edef]"}`}>{label}</p>
 {isColorPair && (
 <div className="mt-2 flex gap-2">
 <div className={`h-6 w-6 rounded ${style.accent}`} />
 <div className={`h-6 w-6 rounded ${style.accent} opacity-50`} />
 </div>
 )}
 {!isColorPair && pair.id === 2 && (
 <div className="mt-2 flex gap-2">
 <div className={`h-8 w-8 bg-[#2a2520] bg-[#2a2520] ${style.radius} ${style.shadow}`} />
 <div className={`h-8 w-12 bg-[#2a2520] bg-[#2a2520] ${style.radius} ${style.shadow}`} />
 </div>
 )}
 {!isColorPair && pair.id === 3 && (
 <div className={`mt-2 rounded border border-[#2a2520] ${style.density}`}>
 <div className="flex items-center gap-2">
 <div className={`rounded bg-[#2a2520] bg-[#2a2520] ${style.icon}`} />
 <div className="h-2 w-16 rounded bg-[#2a2520] bg-[#2a2520]" />
 </div>
 </div>
 )}
 {selected && (
 <span className="mt-2 inline-block rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium text-rose-400">Selected</span>
 )}
 </button>
 )
 })}
 </div>
 </div>
 ))}
 </div>
 <div className="mt-8 text-right">
 <button
 onClick={() => setAssessmentStep("behavioral")}
 disabled={!visceralVotes[1] || !visceralVotes[2] || !visceralVotes[3]}
 className="rounded-lg bg-[#94a99b] px-6 py-2 text-sm font-semibold text-[#0d0b08] transition-colors hover:bg-[#a3b5aa] disabled:opacity-40 disabled:cursor-not-allowed"
 >
 Next: Behavioral
 </button>
 </div>
 </div>
 )}

 {/* Step 2: Behavioral Likert */}
 {assessmentStep === "behavioral" && (
 <div>
 <div className="flex items-center gap-2 mb-6">
 <div className="h-6 w-1 rounded-full bg-blue-500" />
 <h4 className="text-lg font-bold">Behavioral: How It Works</h4>
 </div>
 <p className="text-sm text-[#7a7068] mb-6">
 Think about the product while rating. How strongly do you agree with each statement?
 </p>
 <div className="space-y-8">
 {behavioralLikert.map((dim) => (
 <div key={dim.dimension}>
 <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">{dim.dimension}</p>
 <div className="space-y-4">
 {dim.items.map((item) => (
 <div key={item.id} className="rounded-lg border border-[#2a2520] p-4">
 <p className="text-sm text-[#e8edef] mb-3">{item.text}</p>
 <div className="flex gap-1 sm:gap-2">
 {[1, 2, 3, 4, 5].map((val) => (
 <button
 key={val}
 onClick={() => handleLikertAnswer(item.id, val)}
 className={`flex-1 rounded-md py-2 text-xs font-medium transition-all ${
 likertAnswers[item.id] === val
 ? "bg-blue-500 text-white"
 : "bg-[#1a1714] text-[#7a7068] hover:bg-blue-500/10"
 }`}
 >
 <span className="hidden sm:inline">{likertLabels[val - 1]}</span>
 <span className="sm:hidden">{val}</span>
 </button>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 <div className="mt-8 flex justify-between">
 <button onClick={() => setAssessmentStep("visceral")} className="text-sm hover:text-[#94a99b] transition-colors">
 Back
 </button>
 <button
 onClick={() => setAssessmentStep("reflective")}
 disabled={behavioralLikert.some(d => d.items.some(i => likertAnswers[i.id] === undefined))}
 className="rounded-lg bg-[#94a99b] px-6 py-2 text-sm font-semibold text-[#0d0b08] transition-colors hover:bg-[#a3b5aa] disabled:opacity-40 disabled:cursor-not-allowed"
 >
 Next: Reflective
 </button>
 </div>
 </div>
 )}

 {/* Step 3: Reflective Likert */}
 {assessmentStep === "reflective" && (
 <div>
 <div className="flex items-center gap-2 mb-6">
 <div className="h-6 w-1 rounded-full bg-purple-500" />
 <h4 className="text-lg font-bold">Reflective: What It Means</h4>
 </div>
 <p className="text-sm text-[#7a7068] mb-6">
 Now think about how you feel after using the product. The emotional residue.
 </p>
 <div className="space-y-8">
 {reflectiveLikert.map((dim) => (
 <div key={dim.dimension}>
 <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-3">{dim.dimension}</p>
 <div className="space-y-4">
 {dim.items.map((item) => (
 <div key={item.id} className="rounded-lg border border-[#2a2520] p-4">
 <p className="text-sm text-[#e8edef] mb-3">{item.text}</p>
 <div className="flex gap-1 sm:gap-2">
 {[1, 2, 3, 4, 5].map((val) => (
 <button
 key={val}
 onClick={() => handleLikertAnswer(item.id, val)}
 className={`flex-1 rounded-md py-2 text-xs font-medium transition-all ${
 likertAnswers[item.id] === val
 ? "bg-purple-500 text-white"
 : "bg-[#1a1714] text-[#7a7068] hover:bg-purple-500/10"
 }`}
 >
 <span className="hidden sm:inline">{likertLabels[val - 1]}</span>
 <span className="sm:hidden">{val}</span>
 </button>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 <div className="mt-8 flex justify-between">
 <button onClick={() => setAssessmentStep("behavioral")} className="text-sm hover:text-[#94a99b] transition-colors">
 Back
 </button>
 <button
 onClick={() => {
 setAssessmentStep("results")
 // Also trigger personality computation
 const result = computePersonality(visceralVotes, preferredNav, recommendPick)
 setPersonality(result)
 setRevealed(true)
 // Submit data
 const behavPreferred = preferredNav ??
 (taskDone.sidebar && taskDone.bottom
 ? (taskDone.sidebar <= taskDone.bottom ? "sidebar" : "bottom")
 : null)
 fetch("/api/lab-results", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 visceral: {
 colorTemp: visceralVotes[1] ?? null,
 borderRadius: visceralVotes[2] ?? null,
 density: visceralVotes[3] ?? null,
 },
 behavioral: {
 sidebarMs: taskDone.sidebar ?? null,
 bottomMs: taskDone.bottom ?? null,
 preferred: behavPreferred,
 },
 reflective: { brandPick: recommendPick },
 }),
 }).then(() => fetch("/api/lab-results")).then(r => r.json()).then(setAggregate).catch(() => {})
 }}
 disabled={reflectiveLikert.some(d => d.items.some(i => likertAnswers[i.id] === undefined))}
 className="rounded-lg bg-[#94a99b] px-6 py-2 text-sm font-semibold text-[#0d0b08] transition-colors hover:bg-[#a3b5aa] disabled:opacity-40 disabled:cursor-not-allowed"
 >
 See Results
 </button>
 </div>
 </div>
 )}

 {/* Step 4: Results with Radar Chart */}
 {assessmentStep === "results" && (
 <div>
 <div className="flex items-center gap-2 mb-6">
 <div className="h-6 w-1 rounded-full bg-[#94a99b]" />
 <h4 className="text-lg font-bold">Your Emotional Design Profile</h4>
 </div>

 {/* Radar Chart */}
 <div className="rounded-xl border border-[#2a2520] p-6 bg-[#13110e]">
 <ResponsiveContainer width="100%" height={300}>
 <RadarChart data={radarData}>
 <PolarGrid stroke="#2a2520" />
 <PolarAngleAxis dataKey="level" tick={{ fill: "#7a7068", fontSize: 12 }} />
 <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#5c5449", fontSize: 10 }} />
 <Radar
 name="Score"
 dataKey="score"
 stroke="#94a99b"
 fill="#94a99b"
 fillOpacity={0.2}
 strokeWidth={2}
 />
 </RadarChart>
 </ResponsiveContainer>
 </div>

 {/* Score Bars */}
 <div className="mt-6 grid gap-4 md:grid-cols-3">
 {[
 { label: "Visceral", score: computeLevelScores().visceral, color: "bg-rose-500", textColor: "text-rose-400" },
 { label: "Behavioral", score: computeLevelScores().behavioral, color: "bg-blue-500", textColor: "text-blue-400" },
 { label: "Reflective", score: computeLevelScores().reflective, color: "bg-purple-500", textColor: "text-purple-400" },
 ].map((item) => (
 <div key={item.label} className="rounded-lg border border-[#2a2520] p-4">
 <div className="flex items-center justify-between mb-2">
 <span className={`text-xs font-semibold uppercase tracking-wider ${item.textColor}`}>{item.label}</span>
 <span className="text-lg font-bold text-[#e8edef]">{item.score}</span>
 </div>
 <div className="h-2 rounded-full bg-[#1a1714]">
 <div className={`h-2 rounded-full ${item.color} transition-all duration-700`} style={{ width: `${item.score}%` }} />
 </div>
 </div>
 ))}
 </div>

 {/* Dimension Breakdown */}
 <div className="mt-6 grid gap-6 md:grid-cols-2">
 <div>
 <p className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-3">Behavioral Dimensions</p>
 <div className="space-y-2">
 {computeLevelScores().behavioralDims.map((d) => (
 <div key={d.dimension} className="flex items-center gap-3">
 <span className="text-xs text-[#7a7068] w-24 shrink-0">{d.dimension}</span>
 <div className="flex-1 h-1.5 rounded-full bg-[#1a1714]">
 <div className="h-1.5 rounded-full bg-blue-500 transition-all" style={{ width: `${d.score}%` }} />
 </div>
 <span className="text-xs font-medium text-[#e8edef] w-8 text-right">{d.score}</span>
 </div>
 ))}
 </div>
 </div>
 <div>
 <p className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-3">Reflective Dimensions</p>
 <div className="space-y-2">
 {computeLevelScores().reflectiveDims.map((d) => (
 <div key={d.dimension} className="flex items-center gap-3">
 <span className="text-xs text-[#7a7068] w-24 shrink-0">{d.dimension}</span>
 <div className="flex-1 h-1.5 rounded-full bg-[#1a1714]">
 <div className="h-1.5 rounded-full bg-purple-500 transition-all" style={{ width: `${d.score}%` }} />
 </div>
 <span className="text-xs font-medium text-[#e8edef] w-8 text-right">{d.score}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* Personality Card (if revealed) */}
 {personality && (
 <div className={`mt-8 relative overflow-hidden rounded-2xl border border-[#2a2520]`}>
 <div className={`bg-gradient-to-r ${personality.color} p-6 text-white`}>
 <p className="text-4xl">{personality.emoji}</p>
 <h3 className="mt-2 text-xl font-bold">{personality.name}</h3>
 <p className="mt-1 text-sm opacity-90">{personality.tagline}</p>
 </div>
 <div className="p-5 bg-[#13110e]">
 <p className="text-sm leading-relaxed text-[#6a7a72]">{personality.description}</p>
 <div className="mt-3 flex flex-wrap gap-2">
 {personality.traits.map((trait) => (
 <span key={trait} className="rounded-full border px-3 py-1 text-xs font-medium border-[#2a2520] bg-[#1a1714] text-[#e8e0d4]">{trait}</span>
 ))}
 </div>
 </div>
 </div>
 )}

 {/* Aggregate comparison */}
 {aggregate && aggregate.total > 1 && (
 <div className="mt-4 rounded-xl border p-4 border-[#2a2520]">
 <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5c5449]">
 How you compare ({aggregate.total} responses)
 </p>
 <div className="mt-3 grid gap-3 md:grid-cols-3">
 {aggregate.visceral && (
 <div>
 <p className="text-[10px] font-medium text-rose-400/60">Color pref</p>
 <div className="mt-1 flex gap-2">
 {Object.entries(aggregate.visceral.colorTemp).map(([k, v]) => (
 <span key={k} className="text-xs text-[#7a7068]">
 {k}: <span className="font-medium text-[#e8edef]">{v as number}</span>
 </span>
 ))}
 </div>
 </div>
 )}
 {aggregate.behavioral && (
 <div>
 <p className="text-[10px] font-medium text-blue-400/60">Avg times</p>
 <div className="mt-1 flex gap-2">
 <span className="text-xs text-[#7a7068]">
 Sidebar: <span className="font-medium text-[#e8edef]">{aggregate.behavioral.avgSidebarMs ?? "—"}ms</span>
 </span>
 <span className="text-xs text-[#7a7068]">
 Bottom: <span className="font-medium text-[#e8edef]">{aggregate.behavioral.avgBottomMs ?? "—"}ms</span>
 </span>
 </div>
 </div>
 )}
 {aggregate.reflective && (
 <div>
 <p className="text-[10px] font-medium text-purple-400/60">Brand picks</p>
 <div className="mt-1 flex gap-2">
 {Object.entries(aggregate.reflective.brandPicks).map(([k, v]) => (
 <span key={k} className="text-xs text-[#7a7068]">
 {k.split(" ")[0]}: <span className="font-medium text-[#e8edef]">{v as number}</span>
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 )}

 {/* Restart */}
 <div className="mt-6 text-center">
 <button
 onClick={() => {
 setAssessmentActive(false)
 setAssessmentStep("visceral")
 setLikertAnswers({})
 setRevealed(false)
 setPersonality(null)
 }}
 className="text-sm hover:text-[#94a99b] transition-colors"
 >
 Retake Assessment
 </button>
 </div>
 </div>
 )}
 </div>
 )}
 </div>

 {/* === YOUR DESIGN PERSONALITY (Legacy — kept for non-assessment visitors) === */}
 {!assessmentActive && (
 <div className="mt-20">
 <div className="flex items-center gap-3">
 <div className="h-8 w-1 rounded-full bg-[#94a99b]" />
 <div>
 <h3 className="text-xl font-bold">Your Design Personality</h3>
 <p className="text-sm text-[#7a7068]">
 Based on your visceral gut reactions, navigation performance,
 and brand identity pick. Norman&apos;s 3 levels, decoded.
 </p>
 </div>
 </div>

 {/* Completion check */}
 {(!visceralVotes[1] || !visceralVotes[2] || !visceralVotes[3] || !recommendPick) ? (
 <div className="mt-8 rounded-xl border border-dashed border-[#3a352e] border-[#2a2520] p-8 text-center">
 <p className="text-sm text-[#7a7068]">
 Complete all three demos above to unlock your personality.
 </p>
 <div className="mt-3 flex flex-wrap justify-center gap-2">
 {!visceralVotes[1] && (
 <span className="rounded-full border border-rose-500/20 px-2 py-0.5 text-[10px] text-rose-400/60">
 Color Temperature
 </span>
 )}
 {!visceralVotes[2] && (
 <span className="rounded-full border border-rose-500/20 px-2 py-0.5 text-[10px] text-rose-400/60">
 Border Radius
 </span>
 )}
 {!visceralVotes[3] && (
 <span className="rounded-full border border-rose-500/20 px-2 py-0.5 text-[10px] text-rose-400/60">
 Density
 </span>
 )}
 {(!taskDone.sidebar && !taskDone.bottom) && (
 <span className="rounded-full border border-blue-500/20 px-2 py-0.5 text-[10px] text-blue-400/60">
 Navigation Task
 </span>
 )}
 {!recommendPick && (
 <span className="rounded-full border border-purple-500/20 px-2 py-0.5 text-[10px] text-purple-400/60">
 Brand Pick
 </span>
 )}
 </div>
 </div>
 ) : !revealed ? (
 <div className="mt-8 text-center">
 <p className="text-sm text-[#7a7068]">
 All demos complete. Ready to see who you are?
 </p>
 <button
 onClick={async () => {
 const result = computePersonality(visceralVotes, preferredNav, recommendPick)
 setPersonality(result)
 setRevealed(true)
 // Submit data in background
 try {
 const behavPreferred = preferredNav ??
 (taskDone.sidebar && taskDone.bottom
 ? (taskDone.sidebar <= taskDone.bottom ? "sidebar" : "bottom")
 : null)
 await fetch("/api/lab-results", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({
 visceral: {
 colorTemp: visceralVotes[1] ?? null,
 borderRadius: visceralVotes[2] ?? null,
 density: visceralVotes[3] ?? null,
 },
 behavioral: {
 sidebarMs: taskDone.sidebar ?? null,
 bottomMs: taskDone.bottom ?? null,
 preferred: behavPreferred,
 },
 reflective: { brandPick: recommendPick },
 }),
 })
 const aggRes = await fetch("/api/lab-results")
 setAggregate(await aggRes.json())
 } catch { /* silent */ }
 }}
 className="mt-4 rounded-lg bg-[#94a99b] px-6 py-2.5 text-sm font-semibold text-[#0d0b08] transition-colors hover:bg-[#a3b5aa]"
 >
 Reveal My Design Personality
 </button>
 </div>
 ) : personality ? (
 <div className="mt-8">
 {/* Personality card */}
 <div className={`relative overflow-hidden rounded-2xl border border-[#2a2520]`}>
 {/* Gradient header */}
 <div className={`bg-gradient-to-r ${personality.color} p-8 text-white`}>
 <p className="text-5xl">{personality.emoji}</p>
 <h3 className="mt-3 text-2xl font-bold">{personality.name}</h3>
 <p className="mt-1 text-sm opacity-90">{personality.tagline}</p>
 </div>

 {/* Body */}
 <div className="p-6 bg-[#13110e]">
 <p className="text-sm leading-relaxed text-[#6a7a72]">
 {personality.description}
 </p>

 {/* Traits */}
 <div className="mt-4 flex flex-wrap gap-2">
 {personality.traits.map((trait) => (
 <span
 key={trait}
 className="rounded-full border px-3 py-1 text-xs font-medium border-[#2a2520] bg-[#1a1714] text-[#e8e0d4]"
 >
 {trait}
 </span>
 ))}
 </div>

 {/* Choices breakdown */}
 <div className="mt-6 border-t border-[#2a2520] pt-4">
 <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5c5449]">
 What led here
 </p>
 <div className="mt-2 grid grid-cols-3 gap-3 text-xs">
 <div>
 <p className="font-medium text-rose-400">Visceral</p>
 <p className="mt-0.5 text-[#7a7068]">
 {visceralVotes[1] === "A" ? "Cool" : "Warm"},{" "}
 {visceralVotes[2] === "A" ? "Rounded" : "Sharp"},{" "}
 {visceralVotes[3] === "A" ? "Minimal" : "Dense"}
 </p>
 </div>
 <div>
 <p className="font-medium text-blue-400">Behavioral</p>
 <p className="mt-0.5 text-[#7a7068]">
 Preferred {preferredNav === "sidebar" ? "sidebar" : preferredNav === "bottom" ? "bottom tab" : "—"}
 </p>
 </div>
 <div>
 <p className="font-medium text-purple-400">Reflective</p>
 <p className="mt-0.5 text-[#7a7068]">
 App {recommendPick ? String.fromCharCode(64 + recommendPick) : "—"} — {" "}
 {recommendPick === 1 ? "speed" : recommendPick === 2 ? "connection" : "innovation"}
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Aggregate comparison */}
 {aggregate && aggregate.total > 1 && (
 <div className="mt-4 rounded-xl border p-4 border-[#2a2520]">
 <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5c5449]">
 How you compare ({aggregate.total} responses)
 </p>
 <div className="mt-3 grid gap-3 md:grid-cols-3">
 {aggregate.visceral && (
 <div>
 <p className="text-[10px] font-medium text-rose-400/60">Color pref</p>
 <div className="mt-1 flex gap-2">
 {Object.entries(aggregate.visceral.colorTemp).map(([k, v]) => (
 <span key={k} className="text-xs text-[#7a7068]">
 {k}: <span className="font-medium text-[#e8edef]">{v as number}</span>
 </span>
 ))}
 </div>
 </div>
 )}
 {aggregate.behavioral && (
 <div>
 <p className="text-[10px] font-medium text-blue-400/60">Avg times</p>
 <div className="mt-1 flex gap-2">
 <span className="text-xs text-[#7a7068]">
 Sidebar: <span className="font-medium text-[#e8edef]">{aggregate.behavioral.avgSidebarMs ?? "—"}ms</span>
 </span>
 <span className="text-xs text-[#7a7068]">
 Bottom: <span className="font-medium text-[#e8edef]">{aggregate.behavioral.avgBottomMs ?? "—"}ms</span>
 </span>
 </div>
 </div>
 )}
 {aggregate.reflective && (
 <div>
 <p className="text-[10px] font-medium text-purple-400/60">Brand picks</p>
 <div className="mt-1 flex gap-2">
 {Object.entries(aggregate.reflective.brandPicks).map(([k, v]) => (
 <span key={k} className="text-xs text-[#7a7068]">
 {k.split(" ")[0]}: <span className="font-medium text-[#e8edef]">{v as number}</span>
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 )}
 </div>
 ) : null}
 </div>
 )}

 {/* Thesis connection */}
 <div className="mt-16 rounded-xl border p-6 border-[#2a2520] bg-[#13110e]">
 <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5449]">
 From the thesis
 </p>
 <p className="mt-2 text-sm leading-relaxed text-[#6a7a72]">
 This isn&apos;t just visual preference. Norman&apos;s 3-level model,
 measured through UX-Tips (13 dimensions, 29 items) and SAM scale
 (valence + arousal), predicts brand loyalty in Indonesian mobile
 apps. The reflective level — how an app makes you feel about
 yourself — is the strongest predictor. Not how it looks. Not how it
 works. What it means.
 </p>
 <p className="mt-3 text-xs text-[#5c5449]">
 Koala — 2025. Mixed-method, PLS-SEM + Thematic
 Analysis.
 </p>
 </div>
 </div>
 </section>
 )
}
