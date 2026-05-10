"use client"

import dynamic from "next/dynamic"

const DashboardHome = dynamic(
  () => import("@/components/dashboard/home").then(m => m.default),
  { ssr: false, loading: () => <div className="p-4">Loading...</div> }
)

export default DashboardHome
