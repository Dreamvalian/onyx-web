"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Terminal, Settings, LogOut, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { signOut } from "@/lib/actions"

const navItems = [
 { href: "/", label: "Command Center", icon: LayoutDashboard },
 { href: "/memory", label: "Memory Stack", icon: Brain },
 { href: "/logs", label: "System Logs", icon: Terminal },
 { href: "/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
 const pathname = usePathname()

 return (
 <aside className="flex w-64 flex-col border-r border-[#2a2520] bg-[#0d0b08]">
 <div className="flex h-14 items-center border-b px-4 border-[#2a2520]">
 <Link href="/" className="text-lg font-bold text-[#94a99b]">
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
 className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:text-[#7a7068] hover:bg-[#13110e] hover:text-[#e8e0d4]"
 >
 <LogOut className="h-4 w-4" />
 Sign Out
 </button>
 </form>
 </div>
 </aside>
 )
}
