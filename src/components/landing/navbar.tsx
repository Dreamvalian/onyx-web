"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, ChevronDown } from "lucide-react"
import { useState } from "react"
import { Sheet } from "@/components/ui/sheet"

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/case-study", label: "Case Study" },
  { href: "/skills", label: "Skills" },
  {
    label: "Research",
    children: [
      { href: "/research", label: "Research" },
      { href: "/lab", label: "Lab" },
    ],
  },
  { href: "/uses", label: "Uses" },
  { href: "/guestbook", label: "Guestbook" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const pathname = usePathname()

  const isDropdownActive =
    pathname === "/research" || pathname === "/lab"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a2520] bg-[#0d0b08]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/home" className="font-serif-display text-2xl tracking-tight">
          <span className="text-[#94a99b]">Onyx</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => {
            if ("children" in item) {
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                      isDropdownActive
                        ? "text-[#94a99b]"
                        : "text-[#7a7068] hover:text-[#94a99b]"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full pt-1">
                      <div className="w-36 rounded-lg border border-[#2a2520] bg-[#13110e] py-1.5 shadow-lg">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setDropdownOpen(false)}
                            className={`block px-4 py-2 text-sm transition-colors hover:bg-[#1a1714] ${
                              pathname === child.href
                                ? "font-medium text-[#94a99b]"
                                : "text-[#7a7068]"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-[#94a99b]"
                    : "text-[#7a7068] hover:text-[#94a99b]"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setMobileOpen(true)} className="p-2">
            <Menu className="h-5 w-5 text-[#7a7068]" />
          </button>
        </div>
      </div>

      <Sheet open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <div className="mt-12 flex flex-col gap-4">
          {navLinks.map((item) => {
            if ("children" in item) {
              return (
                <div key={item.label} className="flex flex-col gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#7a7068]">
                    {item.label}
                  </span>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={`pl-3 text-lg font-medium transition-colors ${
                        pathname === child.href
                          ? "text-[#94a99b]"
                          : "text-[#7a7068] hover:text-[#94a99b]"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`text-lg font-medium transition-colors ${
                  pathname === item.href
                    ? "text-[#94a99b]"
                    : "text-[#7a7068] hover:text-[#94a99b]"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </Sheet>
    </nav>
  )
}
