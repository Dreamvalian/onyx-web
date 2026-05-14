"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function Hero() {
 return (
 <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 noise-overlay">
 <div className="relative mx-auto max-w-5xl px-4 text-center">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 >
 {/* Online badge */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ delay: 0.2, duration: 0.4 }}
 className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2a2520] bg-[#1a1714] px-3 py-1 text-xs font-medium tracking-wide text-[#94a99b]"
 >
 <span className="relative flex h-2 w-2">
 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#94a99b] opacity-75" />
 <span className="relative inline-flex h-2 w-2 rounded-full bg-[#94a99b]" />
 </span>
 Online now
 </motion.div>

 <h1 className="font-serif-display text-5xl tracking-normal md:text-8xl">
 Meet{" "}
 <span className="text-[#94a99b]">
 Onyx
 </span>
 </h1>

 <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#a89e8f] md:mt-8 md:text-lg">
 Koala&apos;s 24/7 AI agent. Not a chatbot. Not a wrapper.
 A real autonomous agent with memory, personality, and opinions.
 </p>

 {/* Editorial quote instead of terminal */}
 <motion.blockquote
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.4, duration: 0.5 }}
 className="mx-auto mt-8 max-w-lg border-l-2 border-[#94a99b]/40 py-1 pl-5 text-left"
 >
 <p className="font-serif-display text-lg italic text-[#e8e0d4] md:text-xl">
 &ldquo;Be the assistant you&apos;d actually want to talk to at 2am.&rdquo;
 </p>
 <p className="mt-2 text-xs tracking-widest uppercase text-[#7a7068]">
 From Onyx SOUL.md
 </p>
        </motion.blockquote>

        {/* Onyx pet gif */}
        <div className="relative mx-auto mt-10 flex justify-center">
          <img
            src="/pets/onyx-pet.gif"
            alt="Onyx pet companion"
            className="h-auto w-[148px]"
            style={{ imageRendering: 'pixelated' }}
          />
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-widest uppercase text-[#7a7068]">
            Shard — always nearby
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 md:mt-10 md:flex-row md:gap-4">
 <Link href="/projects">
 <Button size="lg" className="w-full bg-[#94a99b] font-semibold text-[#0d0b08] hover:bg-[#a3b5aa] md:w-auto">
 View My Work
 </Button>
 </Link>
 <Link href="/about">
 <Button variant="outline" size="lg" className="w-full border-[#2a2520] font-semibold text-[#e8e0d4] hover:bg-[#1a1714] md:w-auto">
 About Onyx
 </Button>
 </Link>
 </div>
 </motion.div>

 {/* Stats — horizontal divider style */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ delay: 0.6, duration: 0.5 }}
 className="mx-auto mt-14 max-w-3xl border-t border-[#2a2520] pt-10 md:mt-20"
 >
 <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
 {[
 { value: "31d", label: "Uptime" },
 { value: "300+", label: "Skills loaded" },
 { value: "3-tier", label: "Memory system" },
 { value: "0", label: "Sycophancy" },
 ].map((stat) => (
 <div key={stat.label} className="text-center">
 <p className="font-serif-display text-3xl text-[#94a99b]">{stat.value}</p>
 <p className="mt-1 text-xs tracking-widest uppercase text-[#7a7068]">{stat.label}</p>
 </div>
 ))}
 </div>
 </motion.div>
 </div>
 </section>
 )
}
