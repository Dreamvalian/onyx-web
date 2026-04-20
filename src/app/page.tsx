import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/discord-auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import dynamic from "next/dynamic"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://ko4lax.dev"

const DashboardHome = dynamic(
 () => import("@/components/dashboard/home").then(m => m.default),
 { ssr: false, loading: () => <div className="p-4">Loading...</div> }
)

export default async function RootDashboardPage() {
 const session = await getServerSession()
 if (!session) {
 redirect(`${BASE_URL}/api/auth/discord`)
 }

 return (
 <div className="flex h-screen overflow-hidden bg-[#0d0b08]">
 <div className="hidden md:block">
 <DashboardSidebar />
 </div>
 <div className="flex flex-1 flex-col overflow-hidden">
 <DashboardHeader user={session.user} />
 <main className="flex-1 overflow-y-auto p-4 md:p-6">
 <DashboardHome />
 </main>
 </div>
 </div>
 )
}
