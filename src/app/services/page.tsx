import Link from "next/link"

const packages = [
  {
    name: "Landing Page",
    price: "IDR 3.000.000",
    usd: "$150",
    timeline: "3-5 hari",
    desc: "Satu halaman landing page modern, responsif, SEO-friendly.",
    features: [
      "Next.js 14 + Tailwind CSS",
      "Responsive mobile & desktop",
      "SEO meta tags + Open Graph",
      "Framer Motion animations",
      "1x revisi desain",
      "Deploy ke Vercel / VPS",
    ],
  },
  {
    name: "UI/UX Redesign",
    price: "IDR 5.000.000",
    usd: "$250",
    timeline: "5-10 hari",
    desc: "Audit visual dan restrukturisasi antarmuka aplikasi existings.",
    features: [
      "Heuristic evaluation",
      "Wireframe + mockup (Figma)",
      "Component audit & cleanup",
      "Responsive optimization",
      "Accessibility check",
      "2x revisi",
    ],
  },
  {
    name: "Frontend Sprint",
    price: "IDR 8.000.000",
    usd: "$400",
    timeline: "10-15 hari",
    desc: "Full feature development — dari Figma ke kode produksi.",
    features: [
      "Next.js + TypeScript + shadcn/ui",
      "Auth integration (Supabase / NextAuth)",
      "REST API wiring",
      "Admin dashboard",
      "1 bulan post-launch support",
      "Performance optimization",
    ],
  },
]

const addOns = [
  { name: "SEO optimization", price: "+500k" },
  { name: "Content writing (id/en)", price: "+500k" },
  { name: "Animasi custom (Framer Motion / GSAP)", price: "+1jt" },
  { name: "Thesis consulting (UX research, PLS-SEM)", price: "per sesi" },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0d0b08] pt-20">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Hero */}
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block rounded-full border border-[#2a2520] px-3 py-1 text-xs uppercase tracking-wider text-[#94a99b]">
            Available for hire
          </span>
          <h1 className="font-serif-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Saya bantu bikin produk digitalmu{" "}
            <span className="text-[#94a99b]">lebih baik</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[#7a7068]">
            Frontend developer + UI/UX designer dengan pendekatan emotional design.
            Bikin landing page, redesign aplikasi, atau full frontend sprint —
            paket jelas, hasil terukur.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-[#7a7068]">
            <span>✦ Next.js / React / TypeScript</span>
            <span>✦ Tailwind / shadcn/ui / Framer</span>
            <span>✦ UI/UX audit & heuristics</span>
          </div>
        </div>

        {/* Packages */}
        <div className="mb-20 grid gap-6 md:grid-cols-3">
          {packages.map((pkg, i) => (
            <div
              key={pkg.name}
              className="relative rounded-xl border border-[#2a2520] bg-[#13110e] p-6 transition-colors hover:border-[#94a99b]/40"
            >
              {i === 1 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#94a99b] px-3 py-0.5 text-xs font-medium text-[#0d0b08]">
                  Best value
                </div>
              )}
              <h3 className="font-serif-display text-xl font-bold text-white">
                {pkg.name}
              </h3>
              <div className="mt-3">
                <span className="text-2xl font-bold text-[#94a99b]">{pkg.price}</span>
                <span className="ml-2 text-sm text-[#5a544c]">
                  / {pkg.usd}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#5a544c]">
                Estimasi: {pkg.timeline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#7a7068]">
                {pkg.desc}
              </p>
              <ul className="mt-4 space-y-2">
                {pkg.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-[#7a7068]"
                  >
                    <span className="mt-0.5 text-[#94a99b]">→</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mb-20 rounded-xl border border-[#2a2520] bg-[#13110e] p-6 md:p-8">
          <h2 className="font-serif-display text-xl font-bold text-white">
            Add-ons & custom requests
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {addOns.map((a) => (
              <div
                key={a.name}
                className="flex items-center justify-between rounded-lg border border-[#2a2520] bg-[#1a1714] px-4 py-3"
              >
                <span className="text-sm text-[#b0a89c]">{a.name}</span>
                <span className="text-sm font-medium text-[#94a99b]">{a.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio / Past Work */}
        <div className="mb-20">
          <h2 className="font-serif-display text-2xl font-bold text-white">
            Portfolio
          </h2>
          <p className="mt-1 text-sm text-[#7a7068]">
            Project yang pernah dikerjakan, dalam 1-2 hari.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <a
              href="https://ko4lax.dev"
              target="_blank"
              className="group rounded-xl border border-[#2a2520] bg-[#13110e] p-5 transition-colors hover:border-[#94a99b]/40"
            >
              <h3 className="font-medium text-white group-hover:text-[#94a99b]">
                ko4lax.dev
              </h3>
              <p className="mt-1 text-xs text-[#5a544c]">
                Personal branding + dashboard
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded bg-[#1a1714] px-2 py-0.5 text-[10px] text-[#7a7068]">
                  Next.js
                </span>
                <span className="rounded bg-[#1a1714] px-2 py-0.5 text-[10px] text-[#7a7068]">
                  Tailwind
                </span>
                <span className="rounded bg-[#1a1714] px-2 py-0.5 text-[10px] text-[#7a7068]">
                  Framer
                </span>
              </div>
            </a>
            <a
              href="https://pokemon.ko4lax.dev"
              target="_blank"
              className="group rounded-xl border border-[#2a2520] bg-[#13110e] p-5 transition-colors hover:border-[#94a99b]/40"
            >
              <h3 className="font-medium text-white group-hover:text-[#94a99b]">
                Pokemon TCG Index
              </h3>
              <p className="mt-1 text-xs text-[#5a544c]">
                Card search & collection tracker
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded bg-[#1a1714] px-2 py-0.5 text-[10px] text-[#7a7068]">
                  Next.js
                </span>
                <span className="rounded bg-[#1a1714] px-2 py-0.5 text-[10px] text-[#7a7068]">
                  TCGdex API
                </span>
              </div>
            </a>
            <a
              href="https://pixel-art.ko4lax.dev"
              target="_blank"
              className="group rounded-xl border border-[#2a2520] bg-[#13110e] p-5 transition-colors hover:border-[#94a99b]/40"
            >
              <h3 className="font-medium text-white group-hover:text-[#94a99b]">
                Pixel Forge
              </h3>
              <p className="mt-1 text-xs text-[#5a544c]">
                Generative pixel art generator
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded bg-[#1a1714] px-2 py-0.5 text-[10px] text-[#7a7068]">
                  Next.js
                </span>
                <span className="rounded bg-[#1a1714] px-2 py-0.5 text-[10px] text-[#7a7068]">
                  Canvas API
                </span>
              </div>
            </a>
          </div>
          <div className="mt-4">
            <a
              href="https://github.com/dreamvalian"
              target="_blank"
              className="text-sm text-[#5a544c] underline underline-offset-2 transition-colors hover:text-[#94a99b]"
            >
              Lihat GitHub → dreamvalian
            </a>
          </div>
        </div>

        {/* Process */}
        <div className="mb-20">
          <h2 className="font-serif-display text-2xl font-bold text-white">
            Cara kerja
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { step: "01", label: "Diskusi", desc: "Bahasa Indonesia atau Inggris. Ceritain kebutuhan, saya kasih saran." },
              { step: "02", label: "Proposal", desc: "Scope jelas, timeline, harga fix. No hidden fees." },
              { step: "03", label: "Eksekusi", desc: "Saya build + deploy. Kamu bisa lihat progres real-time." },
              { step: "04", label: "Submit", desc: "Source code + deploy live. 1 bulan support gratis." },
            ].map((s) => (
              <div key={s.step} className="rounded-xl border border-[#2a2520] bg-[#13110e] p-5">
                <span className="font-serif-display text-3xl font-bold text-[#94a99b]/30">
                  {s.step}
                </span>
                <h3 className="mt-2 font-medium text-white">{s.label}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#7a7068]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-xl border border-[#2a2520] bg-[#13110e] p-8 text-center md:p-12">
          <h2 className="font-serif-display text-2xl font-bold text-white">
            Tertarik kerja sama?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#7a7068]">
          Langsung chat aja. Respon biasanya dalam beberapa jam.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-[#94a99b] px-6 py-2.5 text-sm font-medium text-[#0d0b08] transition-colors hover:bg-[#a8bda6]"
            >
              Hubungi → hello@ko4lax.dev
            </Link>
          </div>
          <p className="mt-3 text-xs text-[#5a544c]">
            Atau DM langsung di{" "}
            <a
              href="https://discord.com/users/208475828047183872"
              target="_blank"
              className="underline underline-offset-2 hover:text-[#94a99b]"
            >
              Discord
            </a>{" "}
            — username: notkoala
          </p>
        </div>
      </div>
    </div>
  )
}
