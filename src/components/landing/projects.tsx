"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"

function GithubIcon({ className }: { className?: string }) {
 return (
 <svg className={className} viewBox="0 0 24 24" fill="currentColor">
 <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
 </svg>
 )
}
const projects = [
 {
 name: "onyx-web",
 description:
 "The Onyx agent's presence. Landing page, dashboard, and API surface for a 24/7 autonomous AI agent. Live at ko4lax.dev.",
 stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion"],
 tag: "Live",
 tagColor: "bg-[#94a99b]/15 text-[#94a99b] border-[#94a99b]/20",
 github: "https://github.com/Dreamvalian/onyx-web",
 live: "https://ko4lax.dev/home",
 },
 {
 name: "imsak-schedule",
 description:
 "Imsak schedule app. Clean interface for checking fasting times during Ramadan. Simple, focused, useful.",
 stack: ["React", "JavaScript"],
 tag: "Utility",
 tagColor: "bg-amber-500/15 text-amber-400 border-amber-500/20",
 github: "https://github.com/Dreamvalian/imsak-schedule",
 },
 {
 name: "Dramm",
 description:
 "Web information system for software development workflows. CRUD operations, user management, data visualization.",
 stack: ["PHP", "MySQL", "Bootstrap"],
 tag: "Web App",
 tagColor: "bg-blue-500/15 text-blue-400 border-blue-500/20",
 github: "https://github.com/Dreamvalian/Dramm",
 },
 {
 name: "Wine-Warehouse",
 description:
 "Wine warehouse management system. Born from real hospitality experience — inventory, catalog, stock tracking.",
 stack: ["PHP", "MySQL", "HTML/CSS"],
 tag: "Industry",
 tagColor: "bg-purple-500/15 text-purple-400 border-purple-500/20",
 github: "https://github.com/Dreamvalian/Wine-Warehouse",
 },
 {
 name: "portofolio-2026",
 description:
 "Personal portfolio site. Design-first, non-generic. Because your portfolio should look like you, not a template.",
 stack: ["HTML", "CSS", "JavaScript"],
 tag: "Portfolio",
 tagColor: "bg-pink-500/15 text-pink-400 border-pink-500/20",
 github: "https://github.com/Dreamvalian/portofolio-2026",
 },
 {
 name: "mc-sumpil",
 description:
 "Minecraft server configuration for SumpilCraft. Server setup, modpack management, infrastructure config.",
 stack: ["Minecraft", "Shell", "Config"],
 tag: "Gaming",
 tagColor: "bg-green-500/15 text-green-400 border-green-500/20",
 github: "https://github.com/Dreamvalian/mc-sumpil",
 },
 {
 name: "Wood-Craft",
 description:
 "Wood craft e-commerce built in two flavors — PHP monolith and React SPA. Same domain, different architectures.",
 stack: ["PHP", "React", "MySQL"],
 tag: "E-Commerce",
 tagColor: "bg-orange-500/15 text-orange-400 border-orange-500/20",
 github: "https://github.com/Dreamvalian/Wood-Craft-PHP",
 },
 {
 name: "Software-Engineering-E-Group",
 description:
 "Full CRUD web app. Registration, login, data operations. Group project for software engineering coursework.",
 stack: ["HTML", "CSS", "Bootstrap", "PHP"],
  tag: "Academic",
  tagColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  github: "https://github.com/Dreamvalian/Software-Engineering-E-Group",
 },
 {
 name: "pokemon-index",
 description:
 "Pokemon TCG card search and collection tracker. Browse, search, and filter thousands of cards from the TCGdex API.",
 stack: ["Next.js", "TypeScript", "TCGdex API"],
 tag: "Web App",
 tagColor: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
 github: "https://github.com/Dreamvalian/pokemon-index",
 live: "https://pokemon.ko4lax.dev",
 },
 {
 name: "pixel-forge",
 description:
 "Generative pixel art tool. Creates retro-styled pixel art from text prompts with era-specific palettes.",
 stack: ["Next.js", "TypeScript", "Canvas API"],
 tag: "Creative",
 tagColor: "bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/20",
 github: "https://github.com/Dreamvalian/pixel-forge",
 live: "https://pixel-art.ko4lax.dev",
 },
]

export function Projects() {
 return (
 <section className="border-t py-20 border-[#2a2520]">
 <div className="mx-auto max-w-5xl px-4">
 <div className="text-center">
 <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
 Projects
 </h2>
 <p className="mx-auto mt-4 max-w-xl text-[#7a7068]">
 Things built. Some by hand, some by agent, all shipped.
 </p>
 </div>

 <motion.div
 initial="hidden"
 whileInView="visible"
 viewport={{ once: true }}
 variants={{
 hidden: {},
 visible: { transition: { staggerChildren: 0.06 } },
 }}
 className="mt-12 grid gap-6 md:grid-cols-2"
 >
 {projects.map((project) => (
 <motion.div
 key={project.name}
 variants={{
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0 },
 }}
 className="group rounded-xl border p-6 transition-colors border-[#2a2520] bg-[#13110e] hover:border-[#3a352e]"
 >
 {/* Header: name + links */}
 <div className="flex items-start justify-between">
 <h3 className="font-mono text-lg font-semibold text-[#e8edef]">
 {project.name}
 </h3>
 <div className="flex gap-2">
 <a
 href={project.github}
 target="_blank"
 rel="noopener noreferrer"
 className="transition-colors hover:text-[#5c5449] hover:text-[#94a99b]"
 >
 <GithubIcon className="h-4 w-4" />
 </a>
 {project.live && (
 <a
 href={project.live}
 target="_blank"
 rel="noopener noreferrer"
 className="transition-colors hover:text-[#5c5449] hover:text-[#94a99b]"
 >
 <ExternalLink className="h-4 w-4" />
 </a>
 )}
 </div>
 </div>

 {/* Tag */}
 <span
 className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${project.tagColor}`}
 >
 {project.tag}
 </span>

 {/* Description */}
 <p className="mt-3 text-sm leading-relaxed text-[#6a7a72]">
 {project.description}
 </p>

 {/* Stack */}
 <div className="mt-4 flex flex-wrap gap-1.5">
 {project.stack.map((tech) => (
 <span
 key={tech}
 className="rounded px-2 py-0.5 text-xs bg-[#1a1714] text-[#7a7068]"
 >
 {tech}
 </span>
 ))}
 </div>
 </motion.div>
 ))}
 </motion.div>

 {/* All repos link */}
 <div className="mt-12 text-center">
 <a
 href="https://github.com/Dreamvalian?tab=repositories"
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 text-sm font-medium transition-colors text-[#7a7068] hover:text-[#94a99b]"
 >
 <GithubIcon className="h-4 w-4" />
 View all repositories
 </a>
 </div>
 </div>
 </section>
 )
}
