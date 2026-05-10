import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getServerSession } from "@/lib/discord-auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default async function UptimeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()
  if (!session) {
    const headersList = headers()
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? ""
    const baseUrl = host.includes("dashboard") ? "https://dashboard.ko4lax.dev" : "https://ko4lax.dev"
    redirect(`${baseUrl}/api/auth/discord`)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0d0b08]">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
