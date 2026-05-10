import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { getServerSession } from "@/lib/discord-auth"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import DashboardHome from "@/components/dashboard/home-client"
import Link from "next/link"

function getBaseUrl(): string {
  const headersList = headers()
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host") ?? ""
  if (host.includes("dashboard")) return "https://dashboard.ko4lax.dev"
  return "https://ko4lax.dev"
}

export default async function RootDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ auth_error?: string }>
}) {
  const session = await getServerSession()
  if (!session) {
    const params = await searchParams
    // If auth just failed, show an error instead of redirecting again
    if (params.auth_error) {
      const baseUrl = getBaseUrl()
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d0b08]">
          <div className="mx-auto max-w-md text-center">
            <h1 className="text-2xl font-bold text-white">Authentication Failed</h1>
            <p className="mt-2 text-neutral-400">
              Discord authentication could not be completed. This may happen if you denied
              access or the request timed out.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href={`${baseUrl}/api/auth/discord`}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Try Again
              </Link>
              <Link
                href={baseUrl}
                className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      )
    }
    redirect(`${getBaseUrl()}/api/auth/discord`)
  }

 return (
 <div className="flex h-screen overflow-hidden bg-[#0d0b08]">
 <div className="hidden md:block">
 <DashboardSidebar />
 </div>
 <div className="flex flex-1 flex-col overflow-hidden">
 <DashboardHeader user={session.user} />
 <main className="flex-1 overflow-y-auto p-4 md:px-6">
 <DashboardHome />
 </main>
 </div>
 </div>
 )
}
