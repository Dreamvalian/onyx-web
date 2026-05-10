"use client"

import { Menu, Brain } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sheet } from "@/components/ui/sheet"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Terminal, LogOut, Globe } from "lucide-react"
import { signOut } from "@/lib/actions"
import { cn } from "@/lib/utils"
import type { DiscordUser } from "@/lib/discord-auth"

interface HeaderProps {
 user: DiscordUser
}

const navItems = [
  { href: "/", label: "Command Center", icon: LayoutDashboard },
  { href: "/memory", label: "Memory Stack", icon: Brain },
  { href: "/uptime", label: "Uptime", icon: Globe },
]

export function DashboardHeader({ user }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const avatarUrl = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/${Number(user.id) >> 22 % 6}.png`

  const initials = user.username.slice(0, 2).toUpperCase()

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-[#2a2520] bg-[#0d0b08] px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={user.username} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[#e8e0d4]">{user.username}</p>
            <p className="text-xs text-[#7a7068]">Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 hover:bg-[#1a1714] md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-[#7a7068]" />
          </button>
        </div>
      </header>

 {/* Mobile Sidebar Sheet */}
 <Sheet open={mobileOpen} onClose={() => setMobileOpen(false)}>
 <div className="flex h-full w-64 flex-col">
 <div className="flex h-14 items-center border-b px-4 border-[#2a2520]">
 <Link href="/" className="text-lg font-bold text-[#94a99b]" onClick={() => setMobileOpen(false)}>
 Onyx
 </Link>
 </div>
 <nav className="flex-1 overflow-y-auto p-3">
 <div className="space-y-1">
 {navItems.map((item) => {
 const isActive = pathname === item.href
 return (
 <Link
 key={item.href}
 href={item.href}
 onClick={() => setMobileOpen(false)}
 className={cn(
 "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
 isActive
 ? "bg-[#1a1714] text-[#94a99b]"
                : "text-[#7a7068] hover:bg-[#13110e] hover:text-[#e8e0d4]"
 )}
 >
 <item.icon className="h-4 w-4" />
 {item.label}
 </Link>
 )
 })}
 </div>
 </nav>
 <div className="border-t p-3 border-[#2a2520]">
 <form action={signOut}>
 <button
 type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[#7a7068] hover:bg-[#13110e] hover:text-[#e8e0d4]"
 >
 <LogOut className="h-4 w-4" />
 Sign Out
 </button>
 </form>
 </div>
 </div>
 </Sheet>
 </>
 )
}
