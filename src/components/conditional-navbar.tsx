"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/landing/navbar"

// Dashboard routes that should NOT show the landing navbar
const DASHBOARD_ROUTES = ["/", "/memory", "/logs", "/settings", "/servers", "/prompts"]

export function ConditionalNavbar() {
 const pathname = usePathname()

 // Don't render landing navbar on dashboard pages
 if (DASHBOARD_ROUTES.includes(pathname)) return null

 return <Navbar />
}
