import { NextRequest, NextResponse } from "next/server"

const CLIENT_ID = process.env.DISCORD_CLIENT_ID ?? ""

export async function GET(req: NextRequest) {
  // Use X-Forwarded-Host (set by nginx) to detect the original subdomain
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? ""
  const isDashboard = host.includes("dashboard")
  const baseUrl = isDashboard ? "https://dashboard.ko4lax.dev" : "https://ko4lax.dev"
  const redirectUri = `${baseUrl}/api/auth/discord/callback`

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email",
  })

  return NextResponse.redirect(
    `https://discord.com/oauth2/authorize?${params}`
  )
}
