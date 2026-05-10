import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { exchangeCode } from "@/lib/discord-auth"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://ko4lax.dev"
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://dashboard.ko4lax.dev"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  // Detect calling domain first for all redirects
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? ""
  const isDashboard = host.includes("dashboard")
  const baseUrl = isDashboard ? "https://dashboard.ko4lax.dev" : "https://ko4lax.dev"

  if (error || !code) {
    return NextResponse.redirect(new URL("/?auth_error=1", baseUrl))
  }

  const redirectUri = `${baseUrl}/api/auth/discord/callback`
  const session = await exchangeCode(code, redirectUri)

  if (!session) {
    return NextResponse.redirect(new URL("/?auth_error=1", baseUrl))
  }

  const cookieStore = await cookies()
  // Set cookie on root domain so dashboard subdomain can read it
  const IS_SECURE = Boolean(true)

  cookieStore.set("discord_session", JSON.stringify(session), {
    httpOnly: true,
    secure: IS_SECURE,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    domain: ".ko4lax.dev",
  })

  // Redirect to dashboard subdomain after successful auth
  return NextResponse.redirect(new URL("/", baseUrl))
}
