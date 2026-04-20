"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SheetProps {
 open: boolean
 onClose: () => void
 children: React.ReactNode
 className?: string
}

export function Sheet({ open, onClose, children, className }: SheetProps) {
 if (!open) return null

 return (
 <div className="fixed inset-0 z-50">
 <div
 className="absolute inset-0 bg-black/50 backdrop-blur-sm"
 onClick={onClose}
 />
 <div
 className={cn(
 "absolute right-0 top-0 h-full w-80 max-w-full bg-[#0d0b08] p-6 shadow-xl",
 className
 )}
 >
 <button
 onClick={onClose}
 className="absolute right-4 top-4 hover:text-[#faf6f0]"
 >
 ✕
 </button>
 {children}
 </div>
 </div>
 )
}
