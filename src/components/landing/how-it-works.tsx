"use client"

import { motion } from "framer-motion"
import { Terminal, ArrowRight, CheckCircle2 } from "lucide-react"

const steps = [
 {
 number: "01",
 title: "Delegate",
 description:
 "Drop a task in Discord. Research, code, automation, whatever. Onyx picks it up — no special syntax, no command prefixes. Just say what you need.",
 examples: ["research the latest on DSPy", "fix the nginx config on port 443", "summarize this arXiv paper"],
 },
 {
 number: "02",
 title: "Watch it work",
 description:
 "Onyx assesses the task, picks the right approach, spawns sub-agents if needed. Reports progress in real-time. Asks before doing anything expensive or irreversible.",
 examples: null,
 },
 {
 number: "03",
 title: "Get results",
 description:
 "Done. Onyx delivers conclusions, not just data. Saves learnings as skills. Updates memory. Moves on to the next thing. You didn't have to micromanage any of it.",
 examples: null,
 },
]

export function HowItWorks() {
 return (
 <section className="py-20">
 <div className="mx-auto max-w-5xl px-4">
 <div className="text-center">
 <h2 className="font-serif-display text-3xl md:text-4xl">
 How it actually works
 </h2>
 <p className="mx-auto mt-4 max-w-xl text-[#7a7068]">
 No signup flow. No onboarding. Just ping Onyx in Discord.
 </p>
 </div>
 <div className="mt-12 space-y-12 md:space-y-16">
 {steps.map((step, index) => (
 <motion.div
 key={step.number}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 transition={{ delay: index * 0.1, duration: 0.4 }}
 className="flex flex-col items-start gap-4 md:flex-row md:gap-8"
 >
 {/* Step number */}
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#2a2520] font-mono text-lg font-bold text-[#94a99b]">
 {step.number}
 </div>
 {/* Content */}
 <div className="flex-1">
 <h3 className="font-serif-display text-xl">{step.title}</h3>
 <p className="mt-2 text-[#a89e8f]">
 {step.description}
 </p>
 {step.examples && (
 <div className="mt-3 flex flex-wrap gap-2">
 {step.examples.map((ex) => (
 <span
 key={ex}
 className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs border-[#2a2520] bg-[#1a1714] text-[#7a7068]"
 >
 <Terminal className="h-3 w-3 text-[#94a99b]" />
 {ex}
 </span>
 ))}
 </div>
 )}
 </div>
 {/* Arrow connector (except last) */}
 {index < steps.length - 1 && (
 <div className="hidden md:block">
 <ArrowRight className="h-5 w-5 text-[#3a352e]" />
 </div>
 )}
 </motion.div>
 ))}
 </div>
 </div>
 </section>
 )
}
