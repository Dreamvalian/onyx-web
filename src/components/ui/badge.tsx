import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
 "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#94a99b] focus:ring-offset-2",
 {
 variants: {
 variant: {
      default:
        "border-transparent bg-[#94a99b] text-[#0d0b08]",
      secondary:
        "border-transparent bg-[#1a1714] text-[#7a7068]",
      destructive:
        "border-transparent bg-red-600 text-[#faf6f0]",
      outline: "text-[#7a7068] border-[#3a352e]",
 },
 },
 defaultVariants: {
 variant: "default",
 },
 }
)

export interface BadgeProps
 extends React.HTMLAttributes<HTMLDivElement>,
 VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
 return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
