"use client"

import Link from "next/link"
import { Footer } from "@/components/landing/footer"
import { Mail, MessageCircle, Code, ExternalLink } from "lucide-react"

const channels = [
 {
 icon: MessageCircle,
 label: "Discord",
 description: "Fastest way to reach Koala. Onyx is there too.",
 href: "https://discord.com/oauth2/authorize",
 primary: true,
 },
 {
 icon: Code,
 label: "GitHub",
 description: "Issues, PRs, code. Everything public lives here.",
 href: "https://github.com/dreamvalian",
 primary: false,
 },
 {
 icon: Mail,
 label: "Email",
 description: "For things that shouldn't be on a platform.",
 href: "mailto:hanifnugraha69@gmail.com",
 primary: false,
 },
]

export default function ContactPage() {
 return (
 <main className="pt-24 pb-20">
 <div className="mx-auto max-w-3xl px-4">
 {/* Header */}
 <div className="text-center">
 <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
 Contact
 </h1>
 <p className="mx-auto mt-4 max-w-lg text-base text-[#6a7a72]">
 Not a sales funnel. Not a support queue. Just the right channels
 to reach the person behind the agent.
 </p>
 </div>

 {/* Channels */}
 <div className="mt-12 space-y-4">
 {channels.map((ch) => (
 <a
 key={ch.label}
 href={ch.href}
 target={ch.href.startsWith("http") ? "_blank" : undefined}
 rel={ch.href.startsWith("http") ? "noopener noreferrer" : undefined}
 className={`group flex items-start gap-4 rounded-xl border p-5 transition-all hover:border-[#3a352e] ${
 ch.primary
 ? "border-[#94a99b]/30 bg-[#94a99b]/5 border-[#94a99b]/20 bg-[#94a99b]/5"
 : "border-[#2a2520]"
 }`}
 >
 <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
 ch.primary
 ? "bg-[#94a99b] text-[#0d0b08]"
 : "bg-[#1a1714] text-[#6a7a72]"
 }`}>
 <ch.icon className="h-4 w-4" />
 </div>
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <h2 className="font-semibold text-[#e8edef]">{ch.label}</h2>
 {ch.primary && (
 <span className="rounded-full bg-[#94a99b]/10 px-2 py-0.5 text-[10px] font-medium text-[#94a99b]">
 Preferred
 </span>
 )}
 <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
 </div>
 <p className="mt-0.5 text-sm text-[#7a7068]">
 {ch.description}
 </p>
 </div>
 </a>
 ))}
 </div>

 {/* Note */}
 <div className="mt-12 rounded-xl border p-6 border-[#2a2520] bg-[#13110e]">
 <p className="text-sm text-[#6a7a72]">
 <span className="font-semibold text-[#e8e0d4]">Response time:</span>{" "}
 Usually within hours during WIB daytime (UTC+7). Onyx monitors
 Discord 24/7, so even if Koala is asleep, something might get
 handled before he wakes up.
 </p>
 <p className="mt-3 text-sm text-[#6a7a72]">
 <span className="font-semibold text-[#e8e0d4]">What to reach out about:</span>{" "}
 Collaborations, UX/design projects, thesis discussions, tech
 questions, or just to say hi. Onyx will route it correctly.
 </p>
 </div>
 </div>
 <div className="mt-20">
 <Footer />
 </div>
 </main>
 )
}
