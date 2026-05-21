import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ConditionalNavbar } from "@/components/conditional-navbar"
import { ErrorBoundaryProvider } from "@/components/error-boundary-provider"
export const metadata: Metadata = {
 title: "Onyx — Koala's 24/7 AI Agent",
  description: "Not a chatbot. An autonomous AI agent with memory, personality, and 546 skills. Lives in Discord. Research, coding, automation, orchestration. Terse. Direct. Always online.",
 icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "Onyx — Koala's 24/7 AI Agent",
    description: "Autonomous AI agent with memory, personality, and 546 skills. Not a wrapper. An agent.",
    url: "https://ko4lax.dev",
    siteName: "Onyx",
    type: "website",
    images: [{ url: "https://ko4lax.dev/og-image.png", width: 1200, height: 630, alt: "Onyx — Koala's 24/7 AI Agent" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Onyx — Koala's 24/7 AI Agent",
    description: "Autonomous AI agent. Not a chatbot. Not a wrapper.",
    images: ["https://ko4lax.dev/og-image.png"],
  },
}
export const viewport: Viewport = {
 width: "device-width",
 initialScale: 1,
}

export default function RootLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
 <html lang="en" suppressHydrationWarning>
 <body className="min-h-screen bg-[#0d0b08]">
 <ThemeProvider
 attribute="class"
 defaultTheme="system"
 enableSystem
 disableTransitionOnChange
 >
 <ConditionalNavbar />
 <ErrorBoundaryProvider>
   <main>{children}</main>
 </ErrorBoundaryProvider>
 </ThemeProvider>
 </body>
 </html>
 )
}
