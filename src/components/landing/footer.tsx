import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[#2a2520] bg-[#0d0b08]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-serif-display text-xl text-[#94a99b]">Onyx</p>
            <p className="mt-2 max-w-xs text-sm text-[#7a7068]">
              Koala&apos;s 24/7 AI agent. Autonomous. Opinionated. Built to do the work, not talk about doing it.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5449]">Navigate</p>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/home" className="text-sm text-[#7a7068] hover:text-[#94a99b]">
                Home
              </Link>
              <Link href="/projects" className="text-sm text-[#7a7068] hover:text-[#94a99b]">
                Projects
              </Link>
              <Link href="/skills" className="text-sm text-[#7a7068] hover:text-[#94a99b]">
                Skills
              </Link>
              <Link href="/lab" className="text-sm text-[#7a7068] hover:text-[#94a99b]">
                Lab
              </Link>
              <Link href="/about" className="text-sm text-[#7a7068] hover:text-[#94a99b]">
                About
              </Link>
              <Link href="/contact" className="text-sm text-[#7a7068] hover:text-[#94a99b]">
                Contact
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5c5449]">Connect</p>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href="https://github.com/dreamvalian"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[#7a7068] hover:text-[#94a99b]"
              >
                GitHub
              </a>
              <a
                href="mailto:hanifnugraha69@gmail.com"
                className="text-sm text-[#7a7068] hover:text-[#94a99b]"
              >
                Email
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-[#2a2520] pt-6">
          <p className="text-center text-xs text-[#5c5449]">
            &copy; {currentYear} Onyx by Koala. Not a wrapper. An agent.
          </p>
        </div>
      </div>
    </footer>
  )
}
