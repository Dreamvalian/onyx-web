"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Layers,
  Zap,
  Eye,
  Clock,
  Workflow,
  Database,
  Shield,
  ArrowRight,
  GitBranch,
  Lightbulb,
  Target,
  TrendingUp,
  RefreshCw,
  Sparkles,
  BookOpen,
} from "lucide-react"

const tiers = [
  {
    num: "01",
    name: "Constitution",
    system: "SOUL.md",
    role: "Operating principles",
    desc: "Immutable rules that govern every decision. Never stored in memory — always loaded fresh. The constitution of an autonomous agent.",
    color: "#94a99b",
  },
  {
    num: "02",
    name: "Executive",
    system: "Honcho",
    role: "Core brain & orchestration",
    desc: "The primary write target. Stores conclusions, identity facts, and orchestrates all other tiers. Every session writes here first.",
    color: "#a89e8f",
  },
  {
    num: "03",
    name: "Semantic",
    system: "Holographic",
    role: "Structured fact store",
    desc: "HRR vectors + FTS5 search. Facts with trust scores, injected every turn. The system's working knowledge.",
    color: "#7a7068",
  },
  {
    num: "04",
    name: "Episodic",
    system: "MemPalace",
    role: "Verbatim recall",
    desc: "ChromaDB-backed exact conversation recall. When the agent needs to remember what was actually said, not what it inferred.",
    color: "#5c5449",
  },
  {
    num: "05",
    name: "Reflective",
    system: "Hindsight",
    role: "Behavioral patterns",
    desc: "What happened and why. Tracks failure patterns, corrections, and behavioral trends across sessions.",
    color: "#3a352e",
  },
  {
    num: "06",
    name: "Evolution",
    system: "Dojo",
    role: "Self-improvement",
    desc: "What to train next. When a failure pattern repeats, Dojo patches skills, updates configs, and verifies the fix.",
    color: "#2a2520",
  },
  {
    num: "07",
    name: "Consolidation",
    system: "Dream Cycle",
    role: "Overnight synthesis",
    desc: "Nightly entity enrichment. The agent sleeps, synthesizes patterns, and writes enriched knowledge back to the executive tier.",
    color: "#1a1714",
  },
]

const decisions = [
  {
    question: "Why not just use longer context windows?",
    answer:
      "More context is a scaling problem disguised as a design problem. You pay more tokens for diminishing returns. Structured memory means the agent retrieves what matters, not everything it ever saw.",
    icon: Target,
  },
  {
    question: "Why is Honcho the primary store, not MemPalace?",
    answer:
      "MemPalace stores verbatim text — raw conversation. Useful for recall, terrible for reasoning. Honcho stores conclusions, decisions, compiled truths. The difference between remembering a conversation and understanding it.",
    icon: Brain,
  },
  {
    question: "Why separate Hindsight and Dojo?",
    answer:
      "Observation vs action. Hindsight asks 'what happened and why?' Dojo asks 'what do we train next?' Conflating them creates a system that diagnoses problems but never fixes them.",
    icon: Eye,
  },
  {
    question: "Why deprecate MEMORY.md?",
    answer:
      "A flat file can't represent the relationships, trust scores, or temporal validity of knowledge. MEMORY.md became a pointer — a bootstrap file. The real memory lives in systems designed for it.",
    icon: BookOpen,
  },
]

const stats = [
  { label: "Knowledge Entities", value: "245" },
  { label: "Relationship Triples", value: "271" },
  { label: "Installed Skills", value: "546" },
  { label: "Memory Tiers", value: "7" },
  { label: "Cron Jobs", value: "7" },
  { label: "Uptime", value: "24/7" },
]

const timeline = [
  {
    date: "Concept",
    title: "The Question",
    desc: "Can an AI agent develop something resembling genuine understanding? Not just pattern matching — actual comprehension built from layered memory.",
  },
  {
    date: "Architecture",
    title: "7-Tier Memory Stack",
    desc: "Designed cognitive tiers mirroring human memory: constitution, executive, semantic, episodic, reflective, evolution, consolidation.",
  },
  {
    date: "Autonomy",
    title: "Curiosity Engine",
    desc: "Self-directed gap detection and research. The agent identifies what it doesn't know and autonomously fills the gaps.",
  },
  {
    date: "Self-Improvement",
    title: "Dojo + Hindsight Loop",
    desc: "Behavioral pattern detection feeds into skill patching. The system watches itself fail, diagnoses why, and applies fixes.",
  },
  {
    date: "Overnight",
    title: "Dream Cycle",
    desc: "Nightly synthesis pipeline. Entity enrichment, knowledge graph expansion, cross-session pattern discovery. The agent sleeps and consolidates.",
  },
  {
    date: "Present",
    title: "Always Online",
    desc: "24/7 operation on self-hosted VPS. Discord integration, multi-platform delivery, autonomous research, self-improving skill library.",
  },
]

export default function CaseStudyPage() {
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
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="mr-1 h-3 w-3" />
            Case Study
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            7 Tiers of{" "}
            <span className="text-[#94a99b]">Memory</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#6a7a72] md:text-lg">
            Designing an AI agent that learns, not just responds.
            A cognitive architecture built from scratch, grounded in
            how memory actually works.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12"
        >
          <div className="grid grid-cols-3 gap-px rounded-2xl border border-[#2a2520] overflow-hidden md:grid-cols-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-[#13110e] px-4 py-5 text-center"
              >
                <p className="text-2xl font-bold tracking-tight text-[#94a99b] md:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-[#5c5449]">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-16"
        >
          <div className="relative rounded-2xl border p-8 border-[#2a2520] bg-[#13110e] md:p-10">
            <div className="absolute -top-3 left-6 rounded-full px-3 bg-[#0d0b08]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5c5449]">
                The Problem
              </span>
            </div>
            <div className="mt-2">
              <h2 className="text-2xl font-bold tracking-tight">
                AI agents are{" "}
                <span className="text-[#8b3a3a]">stateless</span> by default
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#6a7a72]">
                Every session starts from zero. Users repeat themselves. Context gets
                lost. The &quot;intelligence&quot; is an illusion — pattern matching on
                whatever fits in the current window.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#6a7a72]">
                Most solutions throw more context at the model. Longer windows. RAG.
                Vector databases bolted onto chatbots. That&apos;s a scaling problem
                disguised as a design problem.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#6a7a72]">
                The real question isn&apos;t{" "}
                <em>how much</em> the agent remembers. It&apos;s{" "}
                <em>how</em> it remembers — and whether that memory structure can
                produce something closer to understanding.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Norman's Lens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Don Norman&apos;s Three Levels
            </h2>
            <p className="mt-2 text-sm text-[#6a7a72]">
              Emotional Design applied to AI architecture
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                level: "Visceral",
                subtitle: "First impression",
                desc: "Does the agent feel right? Personality, tone, design of interactions. The gut reaction before you evaluate function.",
                icon: Eye,
              },
              {
                level: "Behavioral",
                subtitle: "Utility & function",
                desc: "Does it actually work? Memory persistence, task completion, tool use. The agent as a reliable instrument.",
                icon: Zap,
              },
              {
                level: "Reflective",
                subtitle: "Identity & meaning",
                desc: "Does it grow? Self-awareness, self-improvement, accumulated understanding. The agent as something that evolves with you.",
                icon: Brain,
              },
            ].map((item, i) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                className="group rounded-xl border p-6 transition-colors border-[#2a2520] bg-[#13110e] hover:border-[#3a352e]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#94a99b]/10">
                  <item.icon className="h-5 w-5 text-[#94a99b]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.level}</h3>
                <p className="mt-1 text-xs uppercase tracking-wider text-[#5c5449]">
                  {item.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#6a7a72]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* The Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-16"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              The Architecture
            </h2>
            <p className="mt-2 text-sm text-[#6a7a72]">
              Seven cognitive tiers, each with a distinct role
            </p>
          </div>
          <div className="space-y-3">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.04 }}
                className="group flex items-start gap-4 rounded-xl border p-5 transition-colors border-[#2a2520] bg-[#13110e] hover:border-[#3a352e]"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold"
                  style={{ backgroundColor: tier.color, color: i < 2 ? "#0d0b08" : "#a89e8f" }}
                >
                  {tier.num}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{tier.name}</h3>
                    <span className="text-xs text-[#5c5449]">—</span>
                    <span className="font-mono text-xs text-[#6a7a72]">
                      {tier.system}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-[#5c5449]">
                    {tier.role}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#6a7a72]">
                    {tier.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Data Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <div className="rounded-2xl border border-[#2a2520] bg-[#0a0f0d] p-8 md:p-10">
            <div className="flex items-center gap-2 mb-6">
              <Workflow className="h-5 w-5 text-[#94a99b]" />
              <h2 className="text-xl font-bold">Data Flow</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm md:gap-3">
              {["Session", "MemPalace", "Hindsight", "Holographic", "Dojo", "Dream Cycle", "Honcho"].map(
                (step, i, arr) => (
                  <div key={step} className="flex items-center gap-2 md:gap-3">
                    <span className="rounded-lg bg-[#13110e] px-3 py-1.5 font-mono text-xs text-[#94a99b]">
                      {step}
                    </span>
                    {i < arr.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-[#3a352e]" />
                    )}
                  </div>
                )
              )}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[#a89e8f]">
                  Promotion Rules
                </h3>
                <ul className="space-y-2 text-xs text-[#6a7a72]">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#5c5449]" />
                    <span>
                      <strong className="text-[#a89e8f]">MemPalace → Holographic:</strong>{" "}
                      Exact memory repeated 3+ times, extract as structured fact
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#5c5449]" />
                    <span>
                      <strong className="text-[#a89e8f]">Hindsight → Dojo:</strong>{" "}
                      Failure pattern repeats or measurable improvement exists
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#5c5449]" />
                    <span>
                      <strong className="text-[#a89e8f]">Dream → Honcho:</strong>{" "}
                      Nightly entity enrichment writes enriched conclusions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#5c5449]" />
                    <span>
                      <strong className="text-[#a89e8f]">Any tier → SOUL.md:</strong>{" "}
                      Only for permanent constitutional rules (extremely rare)
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-[#a89e8f]">
                  Separation of Concerns
                </h3>
                <ul className="space-y-2 text-xs text-[#6a7a72]">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#94a99b]" />
                    <span>
                      <strong className="text-[#a89e8f]">Hindsight</strong> = what happened and why (observation)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#94a99b]" />
                    <span>
                      <strong className="text-[#a89e8f]">Dojo</strong> = what to train next (action)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#94a99b]" />
                    <span>
                      <strong className="text-[#a89e8f]">Honcho</strong> = everything worth remembering (primary store)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b3a3a]" />
                    <span>
                      <strong className="text-[#a89e8f]">MEMORY.md</strong> = deprecated. Pointer only.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Autonomy Layer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-16"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              The Autonomy Layer
            </h2>
            <p className="mt-2 text-sm text-[#6a7a72]">
              Three systems that make Onyx self-directed
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Lightbulb,
                title: "Curiosity Engine",
                desc: "Scans the knowledge graph for gaps. Scores by relevance to your goals. Autonomously researches the top unknowns and enriches the graph.",
                stat: "245 entities, 271 triples",
              },
              {
                icon: Clock,
                title: "Dream Cycle",
                desc: "Overnight synthesis pipeline. Entity enrichment, pattern discovery, cross-session analysis. The agent sleeps and consolidates knowledge.",
                stat: "Runs nightly at 2 AM WIB",
              },
              {
                icon: RefreshCw,
                title: "Dojo Loop",
                desc: "Watches itself fail via Hindsight. Diagnoses root cause. Patches skills or updates configs. Verifies the fix worked.",
                stat: "Self-patching skill library",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 + i * 0.05 }}
                className="rounded-xl border p-6 border-[#2a2520] bg-[#13110e]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#94a99b]/10">
                  <item.icon className="h-5 w-5 text-[#94a99b]" />
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6a7a72]">
                  {item.desc}
                </p>
                <p className="mt-3 font-mono text-xs text-[#5c5449]">
                  {item.stat}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Design Decisions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Key Design Decisions
            </h2>
            <p className="mt-2 text-sm text-[#6a7a72]">
              Why it&apos;s built this way, not just how
            </p>
          </div>
          <div className="space-y-4">
            {decisions.map((d, i) => (
              <motion.div
                key={d.question}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                className="rounded-xl border p-6 border-[#2a2520] bg-[#13110e]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#94a99b]/10">
                    <d.icon className="h-4 w-4 text-[#94a99b]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{d.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6a7a72]">
                      {d.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-16"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Evolution
            </h2>
            <p className="mt-2 text-sm text-[#6a7a72]">
              From concept to always-online agent
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-[#2a2520] md:left-6" />
            <div className="space-y-6">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 + i * 0.05 }}
                  className="relative flex items-start gap-5 pl-2 md:gap-6"
                >
                  <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#2a2520] bg-[#0d0b08] md:h-10 md:w-10">
                    <div className="h-2.5 w-2.5 rounded-full bg-[#94a99b] md:h-3 md:w-3" />
                  </div>
                  <div className="pb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#5c5449]">
                      {item.date}
                    </p>
                    <h3 className="mt-1 font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#6a7a72]">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Technical Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16"
        >
          <div className="rounded-2xl border border-[#2a2520] bg-[#13110e]">
            <div className="border-b px-6 py-4 border-[#2a2520]">
              <h2 className="font-semibold">Technical Stack</h2>
            </div>
            <div className="grid gap-0 divide-y divide-[#2a2520] md:grid-cols-2 md:divide-y-0">
              {[
                { label: "Runtime", value: "Contabo VPS (Ubuntu)" },
                { label: "Frontend", value: "Next.js 14 + Tailwind" },
                { label: "AI Gateway", value: "Hermes Agent" },
                { label: "Memory", value: "Honcho + ChromaDB" },
                { label: "Knowledge", value: "SQLite Graph + HRR Vectors" },
                { label: "Deployment", value: "PM2 + Nginx + Let's Encrypt" },
                { label: "Interface", value: "Discord Bot (24/7)" },
                { label: "Orchestration", value: "Cron + Sub-agents" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between px-6 py-4 ${
                    i % 2 === 1 ? "md:border-l border-[#2a2520]" : ""
                  }`}
                >
                  <span className="text-sm text-[#6a7a72]">{item.label}</span>
                  <span className="font-medium text-sm">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Design Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-16"
        >
          <div className="rounded-2xl border p-8 border-[#2a2520] bg-[#0a0f0d] md:p-10">
            <h2 className="text-xl font-bold">Extracted Principles</h2>
            <p className="mt-2 text-sm text-[#6a7a72]">
              What this case study reveals about designing intelligent systems
            </p>
            <div className="mt-6 space-y-4">
              {[
                {
                  principle: "Memory isn't storage — it's cognition.",
                  detail: "A system that remembers everything understands nothing. Structured, purposeful memory with promotion rules is what separates recall from comprehension.",
                },
                {
                  principle: "Separation of concerns applies to memory, not just code.",
                  detail: "Observation (Hindsight) and action (Dojo) must be separate systems. Conflating them creates analysis paralysis — diagnosing without fixing.",
                },
                {
                  principle: "Self-improvement requires self-observation.",
                  detail: "The Hindsight → Dojo loop only works because failure patterns are detected independently from the patching mechanism. You can't improve what you don't measure.",
                },
                {
                  principle: "The best UX for an agent is invisible.",
                  detail: "Users shouldn't think about the memory architecture. They should just notice that the agent remembers, learns, and gets better — without being told how.",
                },
              ].map((item) => (
                <div
                  key={item.principle}
                  className="rounded-lg border p-5 border-[#2a2520] bg-[#13110e]"
                >
                  <p className="text-sm font-semibold text-[#94a99b]">
                    {item.principle}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#6a7a72]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[#5c5449]">
            Designed and built by{" "}
            <span className="font-medium text-[#3a352e]">Koala</span>{" "}
            — UX designer applying cognitive architecture to AI systems.
          </p>
          <p className="mt-1 text-xs text-[#3a352e]">
            Norman&apos;s Emotional Design → Agent Memory → Something New
          </p>
        </motion.div>
      </div>
    </main>
  )
}
