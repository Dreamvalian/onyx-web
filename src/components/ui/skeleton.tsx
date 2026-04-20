import * as React from "react"
import { cn } from "@/lib/utils"

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-brand-border", className)}
      {...props}
    />
  )
}

// Preset skeleton patterns
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-lg border border-brand-border bg-brand-surface p-6", className)}>
      <Skeleton className="h-5 w-5 mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  )
}

function SkeletonListItem({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 p-4", className)}>
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn("text-center", className)}>
      <Skeleton className="h-8 w-16 mx-auto mb-2" />
      <Skeleton className="h-3 w-20 mx-auto" />
    </div>
  )
}

function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b border-brand-border">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, ri) => (
        <div key={ri} className="flex gap-4">
          {Array.from({ length: cols }).map((_, ci) => (
            <Skeleton key={ci} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export { Skeleton, SkeletonCard, SkeletonListItem, SkeletonStat, SkeletonTable }
