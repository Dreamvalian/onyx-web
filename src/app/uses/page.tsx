"use client"

import { motion } from "framer-motion"
import {
 Monitor,
 Code,
 Palette,
 Brain,
 Server,
 Terminal,
 type LucideIcon,
} from "lucide-react"
import { Footer } from "@/components/landing/footer"

interface UsesItem {
 name: string
 opinion: string
}

interface UsesSection {
 icon: LucideIcon
 title: string
 items: UsesItem[]
}

const usesSections: UsesSection[] = [
 {
 icon: Monitor,
 title: "Hardware",
 items: [
 {
 name: "MacBook Pro M-series",
 opinion: "Daily driver since 2023. Silent, fast, never fights me.",
 },
 {
 name: '27" 4K Monitor',
 opinion: "Pixel density matters. Once you go 4K, 1080p feels like a fax machine.",
 },
 ],
 },
 {
 icon: Code,
 title: "Development",
 items: [
 {
 name: "Next.js 15",
 opinion: "App router still fights me sometimes but SSR wins.",
 },
 {
 name: "TypeScript",
 opinion: "Non-negotiable. If it is JS, it is legacy.",
 },
 {
 name: "Tailwind CSS",
 opinion: "Utility-first converted me from custom CSS purgatory.",
 },
 {
 name: "VS Code",
 opinion: "Every other editor is a compromise.",
 },
 {
 name: "Git + GitHub",
 opinion: "Version control is not optional.",
 },
 ],
 },
 {
 icon: Palette,
 title: "Design",
 items: [
 {
 name: "Figma",
 opinion: "Where every project starts. Prototyping, handoff, chaos organization.",
 },
 {
 name: "Norman's 3-Level Model",
 opinion: "Visceral, Behavioral, Reflective. My design framework for everything.",
 },
 ],
 },
 {
 icon: Brain,
 title: "AI & Agent Stack",
 items: [
 {
 name: "Hermes Agent",
 opinion: "My 24/7 AI agent. Not a chatbot, an operator.",
 },
 {
 name: "Onyx",
 opinion: "The persona. Security-first, design-aware, terse.",
 },
 {
 name: "Claude",
 opinion: "Best reasoning model for complex tasks.",
 },
 ],
 },
 {
 icon: Server,
 title: "Infrastructure",
 items: [
 {
 name: "Ubuntu VPS",
 opinion: "Self-hosted. No Vercel, no Netlify. Full control.",
 },
 {
 name: "Nginx + PM2",
 opinion: "Reverse proxy + process management. Boring, reliable.",
 },
 {
 name: "Redis",
 opinion: "Sessions, caching, real-time features.",
 },
 {
 name: "Let's Encrypt",
 opinion: "Free SSL, auto-renewal. No excuses for HTTP.",
 },
 ],
 },
 {
 icon: Terminal,
 title: "Terminal",
 items: [
 {
 name: "tmux",
 opinion: "Session persistence. Close the laptop, everything stays.",
 },
 {
 name: "Fish shell",
 opinion: "Autosuggestions that actually work.",
 },
 {
 name: "Starship prompt",
 opinion: "Fast, pretty, zero config fatigue.",
 },
 ],
 },
]

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: {
 staggerChildren: 0.1,
 },
 },
}

const itemVariants = {
 hidden: { opacity: 0, y: 20 },
 visible: {
 opacity: 1,
 y: 0,
 transition: {
 duration: 0.5,
 },
 },
}

export default function UsesPage() {
 return (
 <div className="min-h-screen bg-[#0d0b08]">
 <main className="pt-24 pb-20">
 <div className="mx-auto max-w-4xl px-4">
 {/* Header */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="mb-16 text-center"
 >
 <h1 className="text-4xl font-bold tracking-tight text-[#e8edef] md:text-5xl">
 Uses
 </h1>
 <p className="mx-auto mt-4 max-w-xl text-base text-[#7a7068] md:text-lg">
 Tools, stack, and gear. Opinionated takes on what I actually use.
 </p>
 </motion.div>

 {/* Sections */}
 <motion.div
 variants={containerVariants}
 initial="hidden"
 whileInView="visible"
 viewport={{ once: false }}
 className="grid gap-6 md:grid-cols-2"
 >
 {usesSections.map((section) => (
 <motion.div
 key={section.title}
 variants={itemVariants}
 className="rounded-xl border p-6 border-[#2a2520] bg-[#1a1714]"
 >
 {/* Section Header */}
 <div className="mb-5 flex items-center gap-3">
 <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0d0b08]">
 <section.icon className="h-4 w-4 text-[#94a99b]" />
 </div>
 <h2 className="text-lg font-semibold text-[#e8edef]">
 {section.title}
 </h2>
 </div>

 {/* Items */}
 <div className="space-y-3">
 {section.items.map((item) => (
 <div
 key={item.name}
 className="flex flex-col gap-0.5"
 >
 <span className="text-sm font-medium text-[#e8edef]">
 {item.name}
 </span>
 <span className="text-sm text-[#7a7068]">
 {item.opinion}
 </span>
 </div>
 ))}
 </div>
 </motion.div>
 ))}
 </motion.div>
 </div>
 </main>
 <Footer />
 </div>
 )
}
