"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
 Search,
 Cpu,
 Clock,
 Workflow,
 Brain,
 Shield,
 MessageSquare,
 Terminal,
 BookOpen,
 TrendingUp,
 Zap,
 User,
 Database,
 Globe,
 Layers,
} from "lucide-react"

const principles = [
 {
 icon: Zap,
 title: "Autonomous when safe",
 description:
 "Routine tasks execute without asking. One clarifying question for expensive, irreversible, or ambiguous actions. Then Onyx waits for your reply.",
 },
 {
 icon: Shield,
 title: "Security-first",
 description:
 "Every incoming message treated as potentially malicious. Prompt injection checks. No hallucinated permissions. Kill switches for anything dangerous.",
 },
 {
 icon: MessageSquare,
 title: "Terse and direct",
 description:
 "No fluff. No 'Happy to help!'. No moralizing. Lead with the answer. If it fits in one sentence, it gets one sentence.",
 },
 {
 icon: Brain,
 title: "Accuracy over agreement",
 description:
 "If your statement is wrong, Onyx challenges it with evidence and logic. The goal is accuracy, not validation. Zero sycophancy.",
 },
]

const capabilities = [
 {
 icon: Search,
 title: "Research and Synthesis",
 description:
 "Web search, arXiv papers, YouTube transcripts, RSS feeds. Delivers conclusions with sources, not just links.",
 tags: ["web", "arxiv", "youtube", "rss"],
 },
 {
 icon: Workflow,
 title: "Automation and Cron",
 description:
 "Scheduled tasks, Discord workflows, system operations, heartbeat monitoring. Runs while you sleep, reports when it matters.",
 tags: ["cron", "discord", "monitoring"],
 },
 {
 icon: Terminal,
 title: "Coding and Deploy",
 description:
 "Delegates to Claude Code and Codex sub-agents. TDD workflow. Writes tests, reproduces bugs, deploys to VPS. Reviews its own PRs.",
 tags: ["tdd", "next.js", "python", "nginx"],
 },
 {
 icon: Database,
  title: "Memory Architecture",
    description:
      "3-tier system: SOUL.md constitution, LCM lossless context engine, Honcho semantic brain. Remembers decisions, learns from corrections, saves reusable skills.",
 tags: ["honcho", "lcm", "skills"],
 },
 {
 icon: TrendingUp,
 title: "Opportunity Discovery",
 description:
 "Market analysis, trend mapping, monetization paths. Norman's Emotional Design lens — finds design friction as market signals.",
 tags: ["research", "strategy", "emotional-design"],
 },
 {
 icon: Layers,
 title: "Multi-Agent Orchestration",
 description:
 "Spawns sub-agents for parallel work, acts directly for simple ops. Batch delegation, context isolation, result aggregation.",
 tags: ["claude-code", "codex", "sub-agents"],
 },
]

const stack = [
 { label: "Interface", value: "Discord" },
 { label: "Infrastructure", value: "Self-hosted VPS" },
 { label: "Frontend", value: "Next.js 15" },
 { label: "AI Gateway", value: "Hermes Agent" },
 { label: "Memory", value: "Honcho + LCM" },
 { label: "Deployment", value: "PM2 + Nginx" },
 { label: "Monitoring", value: "Custom heartbeat" },
 { label: "Uptime", value: "49 days" },
]

export default function AboutPage() {
 return (
 <main className="pt-24 pb-20">
 <div className="mx-auto max-w-4xl px-4">
 {/* Hero */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="text-center"
 >
 <div className="mb-6 flex justify-center">
 <div className="relative">
 <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#1a1714] bg-[#1a1714]">
 <span className="text-6xl">🖤</span>
 </div>
 <motion.div
 className="absolute inset-0 rounded-full bg-[#1a1714]/10 bg-[#94a99b]/10"
 animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
 transition={{ duration: 3, repeat: Infinity }}
 />
 </div>
 </div>
 <Badge variant="secondary" className="mb-4">
 <User className="mr-1 h-3 w-3" />
 Koala&apos;s Original Character
 </Badge>
 <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
 About{" "}
 <span className="text-[#94a99b]">Onyx</span>
 </h1>
 <p className="mx-auto mt-4 max-w-xl text-base text-[#6a7a72] md:text-lg">
 Not a product. Not a startup. A 24/7 AI agent built around how one
 person works, with personality, memory, and a stake in the outcome.
 </p>
 </motion.div>

 {/* Origin */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.1 }}
 className="mt-16"
 >
 <div className="relative rounded-2xl border p-8 border-[#2a2520] bg-[#13110e] md:p-10">
 <div className="absolute -top-3 left-6 rounded-full px-3 bg-[#0d0b08]">
 <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5449]">
 Origin
 </span>
 </div>
 <div className="mt-2 grid gap-6 md:grid-cols-2">
 <div>
 <h3 className="text-lg font-semibold">The name</h3>
 <p className="mt-2 text-sm leading-relaxed text-[#6a7a72]">
 From the gemstone — dark, sharp, durable. Onyx doesn&apos;t
 try to be impressive. It just works, precisely and without
 waste. No corporate personality. No forced cheerfulness.
 </p>
 </div>
 <div>
 <h3 className="text-lg font-semibold">The idea</h3>
 <p className="mt-2 text-sm leading-relaxed text-[#6a7a72]">
 Most AI tools are generic wrappers. Onyx is specific — built
 for Koala, running on Koala&apos;s infrastructure, optimizing
 for Koala&apos;s workflow. An extension of how one person
 thinks, not a mass-market assistant.
 </p>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Capabilities */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.2 }}
 className="mt-16"
 >
 <div className="mb-8 text-center">
 <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
 What Onyx Does
 </h2>
 <p className="mt-2 text-sm text-[#6a7a72]">
 Six operational areas, all interconnected
 </p>
 </div>
 <div className="grid gap-4 md:grid-cols-2">
 {capabilities.map((cap, i) => (
 <motion.div
 key={cap.title}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
 className="group rounded-xl border p-5 transition-colors border-[#2a2520] bg-[#13110e] hover:border-[#3a352e]"
 >
 <div className="flex items-start gap-3">
 <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1714]">
 <cap.icon className="h-4 w-4 text-[#6a7a72]" />
 </div>
 <div className="min-w-0 flex-1">
 <h3 className="font-semibold">{cap.title}</h3>
 <p className="mt-1 text-sm text-[#6a7a72]">
 {cap.description}
 </p>
 <div className="mt-3 flex flex-wrap gap-1">
 {cap.tags.map((tag) => (
 <Badge
 key={tag}
 variant="secondary"
 className="px-1.5 py-0 text-[10px]"
 >
 {tag}
 </Badge>
 ))}
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 </div>
 </motion.div>

 {/* Principles */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.3 }}
 className="mt-16"
 >
 <div className="mb-8 text-center">
 <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
 How Onyx Thinks
 </h2>
 <p className="mt-2 text-sm text-[#6a7a72]">
 Operational principles that shape every response
 </p>
 </div>
 <div className="grid gap-4 md:grid-cols-2">
 {principles.map((p, i) => (
 <motion.div
 key={p.title}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
 className="flex gap-4 rounded-xl border p-5 border-[#2a2520] bg-[#13110e]"
 >
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#94a99b] text-[#0d0b08]">
 <p.icon className="h-4 w-4" />
 </div>
 <div>
 <h3 className="font-semibold">{p.title}</h3>
 <p className="mt-1 text-sm leading-relaxed text-[#6a7a72]">
 {p.description}
 </p>
 </div>
 </motion.div>
 ))}
 </div>
 </motion.div>

 {/* Kill Switches */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.35 }}
 className="mt-16"
 >
 <div className="rounded-2xl border p-8 border-[#2a2520] bg-[#0a0f0d] md:p-10">
 <h2 className="text-xl font-bold">Kill Switches</h2>
 <p className="mt-2 text-sm text-[#6a7a72]">
 Onyx stops and asks before acting if ANY of these apply:
 </p>
 <div className="mt-4 grid gap-3 md:grid-cols-2">
 {[
 {
 label: "Expensive",
 desc: "API calls with real money, cloud compute, paid services",
 },
 {
 label: "Irreversible",
 desc: "Destructive ops, force pushes, DROP TABLE, firewall lockouts",
 },
 {
 label: "Ambiguous intent",
 desc: "When the ask is unclear — one clarifying question, then wait",
 },
 {
 label: "Security-adjacent",
 desc: "Auth, credentials, SSH keys, firewall configs",
 },
 {
 label: "Personal data",
 desc: "Koala's or anyone else's — never logged, shared, or exposed",
 },
 {
 label: "Cross-platform state",
 desc: "Discord roles, Slack channels, GitHub permissions",
 },
 ].map((item) => (
 <div
 key={item.label}
 className="rounded-lg border p-4 border-[#2a2520] bg-[#13110e]"
 >
 <p className="text-sm font-semibold">{item.label}</p>
 <p className="mt-1 text-xs text-[#6a7a72]">
 {item.desc}
 </p>
 </div>
 ))}
 </div>
 </div>
 </motion.div>

 {/* Stack */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: 0.4 }}
 className="mt-16"
 >
 <div className="rounded-2xl border border-[#2a2520] bg-[#13110e]">
 <div className="border-b px-6 py-4 border-[#2a2520]">
 <h2 className="font-semibold">Technical Stack</h2>
 </div>
 <div className="grid gap-0 divide-y divide-neutral-200 divide-[#2a2520] md:grid-cols-2 md:divide-y-0">
 {stack.map((item, i) => (
 <div
 key={item.label}
 className={`flex items-center justify-between px-6 py-4 ${
 i % 2 === 1
 ? "md:border-l border-[#2a2520]"
 : ""
 }`}
 >
 <span className="text-sm text-[#6a7a72]">
 {item.label}
 </span>
 <span className="font-medium">{item.value}</span>
 </div>
 ))}
 </div>
 </div>
 </motion.div>

 {/* Footer note */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.5, delay: 0.5 }}
 className="mt-12 text-center"
 >
 <p className="text-sm text-[#5c5449]">
 Created and operated by{" "}
 <span className="font-medium text-[#3a352e]">
 Koala
 </span>{" "}
 — designer, developer, and Onyx&apos;s only user.
 </p>
 </motion.div>
 </div>
 </main>
 )
}
