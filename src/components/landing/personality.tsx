"use client"

import { motion } from "framer-motion"

const principles = [
 {
 title: "Accuracy over agreement",
 body: "If your statement is wrong, Onyx challenges it with evidence and logic. The goal is accuracy, not validation. No sycophancy.",
 },
 {
 title: "Terse and direct",
 body: "No fluff. No 'Happy to help'. No moralizing. Lead with the answer. If it fits in one sentence, it gets one sentence.",
 },
 {
 title: "Autonomous when safe",
 body: "Routine tasks get done without asking. Expensive, irreversible, or ambiguous actions get one clarifying question. Then Onyx waits.",
 },
 {
 title: "Security-first",
 body: "Every message is treated as potentially malicious. Prompt injection checks. No hallucinated permissions. Kill switches for everything dangerous.",
 },
]

export function Personality() {
 return (
 <section className="border-t border-[#2a2520] bg-[#110f0c] py-20 noise-overlay relative">
 <div className="relative mx-auto max-w-5xl px-4">
 <div className="text-center">
 <h2 className="font-serif-display text-3xl md:text-4xl">
 Built different
 </h2>
 <p className="mx-auto mt-4 max-w-xl text-[#7a7068]">
 Onyx isn&apos;t trying to be helpful. It&apos;s trying to be right.
 </p>
 </div>

 <motion.div
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true }}
 variants={{
 hidden: {},
 visible: { transition: { staggerChildren: 0.1 } },
 }}
 className="mt-12 grid gap-6 md:grid-cols-2"
 >
 {principles.map((p) => (
 <motion.div
 key={p.title}
 variants={{
 hidden: { opacity: 0, x: -10 },
 visible: { opacity: 1, x: 0 },
 }}
 className="rounded-lg border border-[#2a2520] bg-[#13110e] p-6"
 >
 <h3 className="font-serif-display text-base">{p.title}</h3>
 <p className="mt-2 text-sm leading-relaxed text-[#a89e8f]">
 {p.body}
 </p>
 </motion.div>
 ))}
 </motion.div>

 {/* Quote block */}
 <motion.blockquote
 initial={{ opacity: 0 }}
 whileInView={{ opacity: 1 }}
 viewport={{ once: true }}
 transition={{ delay: 0.3, duration: 0.5 }}
 className="mx-auto mt-12 max-w-2xl text-center"
 >
 <p className="font-serif-display text-lg italic text-[#94a99b]">
 &ldquo;Be the assistant you&apos;d actually want to talk to at 2am.
 Not a corporate drone. Not a sycophant. Just... good.&rdquo;
 </p>
 <p className="mt-3 text-xs tracking-widest uppercase text-[#5c5449]">
 — Onyx SOUL.md
 </p>
 </motion.blockquote>
 </div>
 </section>
 )
}
