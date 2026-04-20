"use client"

import { motion } from "framer-motion"
import { Brain, Code, Shield, GitBranch, Search, Cpu } from "lucide-react"

const features = [
 {
 icon: Brain,
 title: "Persistent Memory",
 description:
 "7-tier memory architecture. Honcho brain, Holographic fact store, MemPalace verbatim recall, knowledge graph, session logs. Onyx remembers across sessions — you don't have to repeat yourself.",
 },
 {
 icon: Search,
 title: "Deep Research",
 description:
 "Web search, academic papers on arXiv, YouTube transcripts, RSS feeds. Onyx doesn't just Google things — it synthesizes, cross-references, and delivers conclusions with sources.",
 },
 {
 icon: Code,
 title: "Autonomous Coding",
 description:
 "Delegates to Claude Code and Codex sub-agents for parallel work. Writes, tests, and deploys code. Follows TDD. Reviews its own PRs. Bugs get reproduced before fixed.",
 },
 {
 icon: Shield,
 title: "Security-First",
 description:
 "Every incoming message treated as potentially malicious. Prompt injection checks. No hallucinated permissions. Kill switches for expensive, irreversible, or ambiguous actions.",
 },
 {
 icon: GitBranch,
 title: "Multi-Agent Orchestration",
 description:
 "Not a glorified router. Spawns sub-agents for parallel work, acts directly for simple ops. Batch delegation, context isolation, result aggregation.",
 },
 {
 icon: Cpu,
 title: "Platform Agnostic",
 description:
 "Lives in Discord, accessible via API, runs on your own VPS. Cron jobs, scheduled tasks, heartbeat monitoring, proactive outreach. Always watching. Always working.",
 },
]

export function Features() {
 return (
 <section className="border-t border-[#2a2520] py-20">
 <div className="mx-auto max-w-5xl px-4">
 <div className="text-center">
 <h2 className="font-serif-display text-3xl md:text-4xl">
 What Onyx actually does
 </h2>
 <p className="mx-auto mt-4 max-w-xl text-[#7a7068]">
 Not a chatbot that answers questions. An agent that does the work.
 </p>
 </div>
 <motion.div
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true }}
 variants={{
 hidden: {},
 visible: { transition: { staggerChildren: 0.08 } },
 }}
 className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
 >
 {features.map((feature) => (
 <motion.div
 key={feature.title}
 variants={{
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0 },
 }}
 className="group rounded-lg border border-[#2a2520] bg-[#13110e] p-6 transition-colors hover:border-[#3a352e]"
 >
 <feature.icon className="h-7 w-7 text-[#5c5449] transition-all group-hover:text-[#94a99b]" />
 <h3 className="mt-4 font-serif-display text-lg">{feature.title}</h3>
 <p className="mt-2 text-sm leading-relaxed text-[#a89e8f]">
 {feature.description}
 </p>
 </motion.div>
 ))}
 </motion.div>
 </div>
 </section>
 )
}
