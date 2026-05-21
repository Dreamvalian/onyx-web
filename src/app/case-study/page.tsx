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
    role: "Immutable governing rules",
    desc: "The constitution of an autonomous agent. Loaded fresh every turn — never stored in memory. These rules define identity, priorities, and behavioral bounds. If a decision violates SOUL.md, it cannot be executed. Constitutional constraints that survive every restart.",
    color: "#94a99b",
  },
  {
    num: "02",
    system: "LCM",
    name: "Lossless Context",
    role: "Complete conversation graph",
    desc: "A DAG-based compaction engine that preserves every message with zero data loss. Every session is fully retrievable via session_search for FTS5 full-text search. Supports lcm_grep/lcm_expand for deep retrieval and LCM expansion. The system never forgets what was said.",
    color: "#a89e8f",
  },
  {
    num: "03",
    name: "Semantic Brain",
    system: "Honcho",
    role: "Durable fact & identity store",
    desc: "The primary write target for all persistent knowledge. Stores conclusions, identity facts, and user preferences via honcho_conclude. Supports semantic search (honcho_search) and reasoning (honcho_reasoning). The 'memory' tool is strictly forbidden — all persistence flows through Honcho.",
    color: "#7a7068",
  },
]

const supportingSystems = [
  {
    icon: BookOpen,
    name: "Skills (546 installed)",
    desc: "Procedural memory that defines what the agent can do. Loaded on-demand via skill triggers — pattern-matched from user intent. Each skill is a self-contained capability with its own tools, prompts, and side-effects.",
  },
  {
    icon: Database,
    name: "Session Search",
    desc: "FTS5-backed full-text search across past session transcripts. When the agent needs to recall something from a previous conversation, session_search finds the exact context — no DAG traversal required.",
  },
  {
    icon: Shield,
    name: "Kill Switches",
    desc: "Three-tier safety: constitutional (SOUL.md), behavioral (runtime guards), and protocol-level (MCP resource blocking). If any switch fires, the action is halted before it reaches execution.",
  },
]

const decisions = [
  {
    question: "Why is 'memory' tool strictly forbidden?",
    answer:
      "A raw write-to-memory tool bypasses all structure. Without constraints, the agent writes noise, duplicates, contradictions. Honcho imposes a schema — conclusions, facts, preferences — so every write is meaningful and retrievable. No memory tool means no memory pollution.",
    icon: Shield,
  },
  {
    question: "Why two storage systems (LCM + Honcho) instead of one?",
    answer:
      "They solve different problems. LCM is for lossless retrieval — 'what did I say three sessions ago about X?' Honcho is for semantic persistence — 'who is this user and what matters to them?' One is a searchable transcript; the other is a structured brain. Both are needed; neither replaces the other.",
    icon: GitBranch,
  },
  {
    question: "Why is SOUL.md loaded fresh every time instead of stored?",
    answer:
      "Immutability guarantees the agent never modifies its own constitution. If SOUL.md were in memory, a prompt injection or reasoning error could overwrite identity rules. By loading it fresh from disk every turn, the constitution is inviolable. This is digital separation of powers.",
    icon: Brain,
  },
  {
    question: "Why kill switches instead of just monitoring?",
    answer:
      "Monitoring detects problems. Kill switches prevent them. The difference between a log entry saying 'agent almost deleted the database' and a guard that makes deletion impossible. Three tiers (constitutional, behavioral, protocol) ensure defense in depth — any single failure is caught downstream.",
    icon: Zap,
  },
]

const stats = [
  { label: "Knowledge Entities", value: "245" },
  { label: "Installed Skills", value: "546" },
  { label: "Memory Tiers", value: "3" },
  { label: "Cron Jobs", value: "15" },
  { label: "Session Search Index", value: "∞" },
  { label: "Uptime", value: "24/7" },
]

const timeline = [
  {
    date: "Concept",
    title: "The Grand Vision",
    desc: "Designed a 7-tier cognitive architecture — constitution, executive, semantic, episodic, reflective, evolution, consolidation. A beautiful paper architecture that mirrored human memory stages.",
  },
  {
    date: "Reality",
    title: "The Contraction",
    desc: "Building 7 tiers meant maintaining 7 systems. Each tier introduced complexity, latency, and failure modes. Worse — some tiers overlapped in function. Episodic memory and semantic memory turned out to be one problem: retrieval.",
  },
  {
    date: "Consolidation",
    title: "3-Tier Architecture Emerges",
    desc: "The architecture collapsed into three: SOUL.md for constitution (immutable, always fresh), LCM for lossless context (DAG-based message compaction with FTS5 search), Honcho for semantic brain (conclusions, facts, identity). Every tier earned its place.",
  },
  {
    date: "Refinement",
    title: "Skills as Procedural Memory",
    desc: "Skills (546 installed) became the agent's procedural memory — loaded on-demand via skill triggers. The 'memory' tool was deprecated. All persistence routed through Honcho. LCM became the definitive conversation record.",
  },
  {
    date: "Production",
    title: "Always Online",
    desc: "24/7 operation on self-hosted VPS. Discord integration, multi-platform delivery, cron-driven proactive outreach. The architecture stopped being aspirational and started being what actually runs in production.",
  },
  {
    date: "Present",
    title: "Continuous Evolution",
    desc: "The 3-tier stack handles everything: constitutional governance (SOUL.md), complete transcript recall (LCM), and durable semantic knowledge (Honcho). New capabilities are added as skills, not new tiers. Simplicity wins.",
  },
]

const principles = [
  {
    principle: "Three tiers is enough.",
    detail: "Constitution (SOUL.md), context (LCM), and semantic memory (Honcho) cover every persistence need. Adding more tiers creates maintenance burden without proportional benefit. The best architecture is the one you don't have to think about.",
  },
  {
    principle: "Ban the memory tool.",
    detail: "Any system where the agent can write unstructured data to memory will accumulate noise. Structured persistence through Honcho (conclusions, facts, preferences) ensures every write has purpose and every read finds signal.",
  },
  {
    principle: "Immutability is a design choice, not a limitation.",
    detail: "SOUL.md loaded fresh every turn isn't a hack — it's a constitutional safeguard. The agent can't overwrite its own rules because it never holds the pen. This is the digital equivalent of separation of powers.",
  },
  {
    principle: "Kill switches beat monitoring every time.",
    detail: "Three tiers of safety (constitutional in SOUL.md, behavioral at runtime, protocol-level in MCP) ensure defense in depth. Any single failure is caught downstream. The agent is powerful by design and safe by architecture.",
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
            Memory{" "}
            <span className="text-[#94a99b]">Architecture</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#6a7a72] md:text-lg">
            Three tiers that actually run in production.
            SOUL.md, LCM, and Honcho — no more, no less.
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

        {/* The Architecture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              The Architecture
            </h2>
            <p className="mt-2 text-sm text-[#6a7a72]">
              Three tiers of memory, each with a distinct purpose
            </p>
          </div>
          <div className="space-y-3">
            {tiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.04 }}
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

        {/* Supporting Systems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-16"
        >
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Supporting Systems
            </h2>
            <p className="mt-2 text-sm text-[#6a7a72]">
              What wraps around the three tiers to make everything work
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {supportingSystems.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
                className="group rounded-xl border p-6 transition-colors border-[#2a2520] bg-[#13110e] hover:border-[#3a352e]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#94a99b]/10">
                  <item.icon className="h-5 w-5 text-[#94a99b]" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#6a7a72]">
                  {item.desc}
                </p>
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
              {["Session", "LCM", "Honcho"].map(
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
                  Persistence Rules
                </h3>
                <ul className="space-y-2 text-xs text-[#6a7a72]">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#5c5449]" />
                    <span>
                      <strong className="text-[#a89e8f]">Session → LCM:</strong>{" "}
                      Every message is stored. LCM compacts into a DAG with zero data loss. Full FTS5 search available via session_search.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#5c5449]" />
                    <span>
                      <strong className="text-[#a89e8f]">Session → Honcho:</strong>{" "}
                      Conclusions, user facts, and identity data written via honcho_conclude. Semantic search via honcho_search. Reasoning via honcho_reasoning.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#5c5449]" />
                    <span>
                      <strong className="text-[#a89e8f]">Session → SOUL.md:</strong>{" "}
                      Never. The constitution is loaded fresh every turn. Constitutional rules are never written by the agent — they are set once and enforced immutably.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-[#5c5449]" />
                    <span>
                      <strong className="text-[#a89e8f]">memory tool:</strong>{" "}
                      Strictly forbidden. All persistence goes through Honcho. No unstructured writes. No bypasses.
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
                      <strong className="text-[#a89e8f]">SOUL.md</strong> = constitution (immutable, always fresh)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#94a99b]" />
                    <span>
                      <strong className="text-[#a89e8f]">LCM</strong> = lossless context (complete transcript, DAG-based)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#94a99b]" />
                    <span>
                      <strong className="text-[#a89e8f]">Honcho</strong> = semantic brain (conclusions, facts, identity)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#94a99b]" />
                    <span>
                      <strong className="text-[#a89e8f]">Skills</strong> = procedural memory (loaded on demand via triggers)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8b3a3a]" />
                    <span>
                      <strong className="text-[#a89e8f]">memory tool</strong> = forbidden. All writes through Honcho.
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
              How the agent acts without being told
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Skill Triggers",
                desc: "User intent is pattern-matched against 546 installed skills. When a trigger fires, the corresponding skill is loaded and executed. No manual routing — the agent knows what to use based on context.",
                stat: "546 skills, pattern-matched",
              },
              {
                icon: Clock,
                title: "Cron Jobs",
                desc: "15 scheduled tasks run autonomously — data polling, user engagement checks, system maintenance. The agent doesn't wait for commands. It acts on a schedule.",
                stat: "Runs 24/7 on schedule",
              },
              {
                icon: RefreshCw,
                title: "Proactive Outreach",
                desc: "The agent doesn't just respond — it initiates. Follow-ups, check-ins, notifications. If a user hasn't engaged, the agent reaches out. The difference between a tool and a partner.",
                stat: "Self-initiated engagement",
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
              From 7 tiers to 3 — the honest story
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
                { label: "Frontend", value: "Next.js 15 + Tailwind" },
                { label: "AI Gateway", value: "Hermes Agent" },
                { label: "Constitution", value: "SOUL.md (loaded fresh)" },
                { label: "Context Store", value: "LCM (DAG + FTS5)" },
                { label: "Semantic Store", value: "Honcho (conclude/search/reason)" },
                { label: "Interface", value: "Discord Bot (24/7)" },
                { label: "Orchestration", value: "Cron + Skill Triggers" },
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
              {principles.map((item) => (
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
            Three Tiers → Production → Something That Works
          </p>
        </motion.div>
      </div>
    </main>
  )
}
