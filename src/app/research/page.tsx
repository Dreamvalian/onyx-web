"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import {
 Brain,
 BarChart3,
 Heart,
 Layers,
 Users,
 Clock,
 ChevronDown,
 ExternalLink,
 Sparkles,
 Target,
 Gauge,
 Smile,
 Zap,
 Crown,
 BookOpen,
} from "lucide-react"

const fadeUp = {
 initial: { opacity: 0, y: 24 },
 whileInView: { opacity: 1, y: 0 },
 viewport: { once: true },
 transition: { duration: 0.5 },
}

const uxTipsPragmatic = [
 "Aesthetics",
 "Utility",
 "Efficiency",
 "Feedback",
 "Learning & Ease of Use",
 "Control",
 "Physical Characteristics",
]

const uxTipsHedonic = [
 "Emotion",
 "Engagement",
 "Innovative",
 "Social",
 "Value-Added",
 "Satisfaction",
]

const samDimensions = [
 {
 icon: Smile,
 label: "Pleasure",
 desc: "Seberapa menyenangkan pengalaman menggunakan aplikasi ini?",
 level: "Visceral",
 },
 {
 icon: Zap,
 label: "Arousal",
 desc: "Seberapa aktif dan terstimulasi kamu merasa selama menggunakan?",
 level: "Behavioral",
 },
 {
 icon: Crown,
 label: "Dominance",
 desc: "Seberapa merasa mengendalikan pengalamanmu sendiri?",
 level: "Reflective",
 },
]

export default function ResearchPage() {
 return (
 <main className="pt-24 pb-20">
 <div className="mx-auto max-w-4xl px-4">
 {/* ─── VIScERAL LAYER: First Impression ─── */}
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="text-center"
 >
 <Badge variant="secondary" className="mb-4">
 <BookOpen className="mr-1 h-3 w-3" />
 Skripsi — ITENAS 2026
 </Badge>
 <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
 Pengaruh{" "}
 <span className="text-[#94a99b]">Emotional Design</span>{" "}
 terhadap UX dan Brand Loyalty
 </h1>
 <p className="mx-auto mt-4 max-w-2xl text-base text-[#6a7a72] md:text-lg">
 Studi Kasus: TikTok Shop di Indonesia
 </p>
 <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#7a7068]">
 Pernah penasaran kenapa beberapa aplikasi terasa &quot;pas&quot; dan
 yang lain bikin frustrasi? Penelitian ini menguji bagaimana desain
 emosi pada tiga level pemrosesan (Norman, 2005) memengaruhi
 pengalaman pengguna dan loyalitas terhadap merek.
 </p>

 <motion.div
 animate={{ y: [0, 6, 0] }}
 transition={{ duration: 2, repeat: Infinity }}
 className="mt-8 flex justify-center"
 >
 <ChevronDown className="h-5 w-5 text-[#5c5449]" />
 </motion.div>
 </motion.div>

 {/* ─── Norman 3-Level Framework ─── */}
 <motion.div {...fadeUp} className="mt-20">
 <div className="mb-8 text-center">
 <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
 Kerangka Norman 3-Level
 </h2>
 <p className="mt-2 text-sm text-[#6a7a72]">
 Donald Norman (2005) — Emotional Design: Why We Love (or Hate)
 Everyday Things
 </p>
 </div>

 <div className="grid gap-4 md:grid-cols-3">
 {[
 {
 level: "Visceral",
 icon: Sparkles,
 color: "text-rose-400",
 bg: "bg-rose-400/10",
 desc: "Respons pertama terhadap penampilan — warna, bentuk, estetika. Terjadi dalam milidetik.",
 example:
 "Badge diskon merah mencolok, harga dicoret, video produk autoplay",
 },
 {
 level: "Behavioral",
 icon: Gauge,
 color: "text-amber-400",
 bg: "bg-amber-400/10",
 desc: "Kesesuaian antara keterampilan pengguna dan tuntutan tugas. Kontrol, efisiensi, kepuasan fungsi.",
 example:
 "Checkout dalam beberapa klik, 23 kategori produk, social proof rating",
 },
 {
 level: "Reflective",
 icon: Brain,
 color: "text-[#94a99b]",
 bg: "bg-[#94a99b]/10",
 desc: "Evaluasi kognitif tentang makna dan self-image. Membangun hubungan jangka panjang.",
 example:
 "Apakah pembelian ini worth it? Apakah produk sesuai ekspektasi?",
 },
 ].map((item, i) => (
 <div
 key={item.level}
 className="rounded-xl border p-5 border-[#2a2520] bg-[#13110e]"
 >
 <div
 className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${item.bg}`}
 >
 <item.icon className={`h-5 w-5 ${item.color}`} />
 </div>
 <h3 className="font-semibold">{item.level}</h3>
 <p className="mt-1 text-sm text-[#6a7a72]">
 {item.desc}
 </p>
 <p className="mt-3 rounded-lg p-3 text-xs bg-[#0d0b08] text-[#7a7068]">
 Contoh: {item.example}
 </p>
 </div>
 ))}
 </div>
 </motion.div>

 {/* ─── BEHAVIORAL LAYER: Research Method ─── */}
 <motion.div {...fadeUp} className="mt-20">
 <div className="mb-8 text-center">
 <Badge variant="secondary" className="mb-4">
 <BarChart3 className="mr-1 h-3 w-3" />
 Metode Penelitian
 </Badge>
 <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
 Pendekatan Kuantitatif
 </h2>
 <p className="mx-auto mt-2 max-w-xl text-sm text-[#6a7a72]">
 Data dikumpulkan dari minimal 150 responden dan dianalisis
 menggunakan PLS-SEM (Partial Least Squares Structural Equation
 Modeling).
 </p>
 </div>

 {/* SAM Scale */}
 <div className="rounded-2xl border p-6 border-[#2a2520] bg-[#13110e] md:p-8">
 <div className="flex items-center gap-2">
 <Heart className="h-5 w-5 text-[#94a99b]" />
 <h3 className="text-lg font-semibold">SAM Scale</h3>
 </div>
 <p className="mt-2 text-sm text-[#6a7a72]">
 Self-Assessment Manikin (Bradley &amp; Lang, 1994) mengukur tiga
 dimensi afektif menggunakan Affective Slider (Betella &amp;
 Verschure, 2016) untuk perangkat mobile.
 </p>
 <div className="mt-5 grid gap-3 md:grid-cols-3">
 {samDimensions.map((dim) => (
 <div
 key={dim.label}
 className="rounded-lg border p-4 border-[#2a2520] bg-[#0d0b08]"
 >
 <div className="flex items-center gap-2">
 <dim.icon className="h-4 w-4 text-[#94a99b]" />
 <span className="font-medium">{dim.label}</span>
 <Badge
 variant="secondary"
 className="ml-auto px-1.5 py-0 text-[10px]"
 >
 {dim.level}
 </Badge>
 </div>
 <p className="mt-2 text-xs text-[#7a7068]">
 {dim.desc}
 </p>
 </div>
 ))}
 </div>

 {/* SAM Example */}
 <div className="mt-5 rounded-lg border border-dashed p-5 border-[#2a2520]">
 <p className="text-xs font-semibold uppercase tracking-wider text-[#7a7068]">
 Contoh Item Kuesioner
 </p>
 <p className="mt-2 text-xs text-[#7a7068]">
 Setiap dimensi menggunakan skala 9 poin berbasis gambar manikin
 (Affective Slider). Kamu menggeser slider untuk menunjukkan
 perasaanmu.
 </p>
 <div className="mt-4 space-y-4">
 <div className="rounded-lg p-4 bg-[#13110e]">
 <p className="text-sm font-medium">
 &quot;Saat menggunakan TikTok Shop, saya merasa...&quot;
 </p>
 <div className="mt-3 space-y-3">
 <div>
 <p className="text-xs text-[#7a7068]">
 😊 <span className="font-medium">Pleasure</span> —
 Tidak menyenangkan sampai Sangat menyenangkan
 </p>
 <div className="mt-1.5 flex items-center gap-1">
 {["☹️", "😕", "😐", "🙂", "😊"].map((emoji, i) => (
 <div
 key={i}
 className={`flex h-8 flex-1 items-center justify-center rounded text-xs ${
 i === 0 || i === 4
 ? "border border-[#2a2520]"
 : "bg-[#0d0b08]"
 }`}
 >
 {emoji}
 </div>
 ))}
 </div>
 </div>
 <div>
 <p className="text-xs text-[#7a7068]">
 ⚡ <span className="font-medium">Arousal</span> —
 Tenang/rileks sampai Bersemangat/aktif
 </p>
 <div className="mt-1.5 flex items-center gap-1">
 {["😴", "😌", "😐", "😃", "🤩"].map((emoji, i) => (
 <div
 key={i}
 className={`flex h-8 flex-1 items-center justify-center rounded text-xs ${
 i === 0 || i === 4
 ? "border border-[#2a2520]"
 : "bg-[#0d0b08]"
 }`}
 >
 {emoji}
 </div>
 ))}
 </div>
 </div>
 <div>
 <p className="text-xs text-[#7a7068]">
 👑 <span className="font-medium">Dominance</span> —
 Tidak mengendalikan sampai Sangat mengendalikan
 </p>
 <div className="mt-1.5 flex items-center gap-1">
 {["😰", "😟", "😐", "😏", "💪"].map((emoji, i) => (
 <div
 key={i}
 className={`flex h-8 flex-1 items-center justify-center rounded text-xs ${
 i === 0 || i === 4
 ? "border border-[#2a2520]"
 : "bg-[#0d0b08]"
 }`}
 >
 {emoji}
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* UX-Tips */}
 <div className="mt-6 rounded-2xl border p-6 border-[#2a2520] bg-[#13110e] md:p-8">
 <div className="flex items-center gap-2">
 <Target className="h-5 w-5 text-[#94a99b]" />
 <h3 className="text-lg font-semibold">UX-Tips</h3>
 </div>
 <p className="mt-2 text-sm text-[#6a7a72]">
 User eXperience Technique for Interactive ProductS (Marques et
 al., 2021). 13 dimensi, 29 evaluative items. Memisahkan aspek
 pragmatic dan hedonic untuk identifikasi akar masalah UX secara
 presisi.
 </p>

 <div className="mt-5 grid gap-4 md:grid-cols-2">
 <div className="rounded-lg border p-4 border-[#2a2520] bg-[#0d0b08]">
 <h4 className="text-sm font-semibold text-[#94a99b]">
 Pragmatic (7 dimensi)
 </h4>
 <p className="mt-1 text-xs text-[#7a7068]">
 Efisiensi, kontrol, kemudahan yang mendorong penyelesaian
 tugas
 </p>
 <div className="mt-3 flex flex-wrap gap-1.5">
 {uxTipsPragmatic.map((dim) => (
 <Badge
 key={dim}
 variant="secondary"
 className="px-1.5 py-0 text-[10px]"
 >
 {dim}
 </Badge>
 ))}
 </div>
 </div>
 <div className="rounded-lg border p-4 border-[#2a2520] bg-[#0d0b08]">
 <h4 className="text-sm font-semibold text-[#94a99b]">
 Hedonic (6 dimensi)
 </h4>
 <p className="mt-1 text-xs text-[#7a7068]">
 Emosi, keterlibatan, stimulasi yang membangun keterikatan
 emosional
 </p>
 <div className="mt-3 flex flex-wrap gap-1.5">
 {uxTipsHedonic.map((dim) => (
 <Badge
 key={dim}
 variant="secondary"
 className="px-1.5 py-0 text-[10px]"
 >
 {dim}
 </Badge>
 ))}
 </div>
 </div>
 </div>

 {/* UX-Tips Example */}
 <div className="mt-5 rounded-lg border border-dashed p-5 border-[#2a2520]">
 <p className="text-xs font-semibold uppercase tracking-wider text-[#7a7068]">
 Contoh Item Kuesioner
 </p>
 <p className="mt-2 text-xs text-[#7a7068]">
 Setiap item menggunakan skala Likert 1–5 (Sangat Tidak Setuju
 sampai Sangat Setuju). Berikut beberapa contoh dari masing-masing
 kategori:
 </p>
 <div className="mt-4 grid gap-3 md:grid-cols-2">
 <div className="rounded-lg p-4 bg-[#13110e]">
 <h5 className="text-xs font-semibold text-[#94a99b]">
 Pragmatic
 </h5>
 <div className="mt-3 space-y-3">
 <div className="rounded p-3 bg-[#0d0b08]">
 <p className="text-xs font-medium">
 EST1 — Aesthetics
 </p>
 <p className="mt-1 text-xs text-[#7a7068]">
 &quot;Tampilan visual TikTok Shop menarik secara
 estetika.&quot;
 </p>
 </div>
 <div className="rounded p-3 bg-[#0d0b08]">
 <p className="text-xs font-medium">
 EFC1 — Efficiency
 </p>
 <p className="mt-1 text-xs text-[#7a7068]">
 &quot;Saya dapat menyelesaikan proses belanja dengan
 cepat.&quot;
 </p>
 </div>
 <div className="rounded p-3 bg-[#0d0b08]">
 <p className="text-xs font-medium">
 CTL1 — Control
 </p>
 <p className="mt-1 text-xs text-[#7a7068]">
 &quot;Saya merasa memiliki kendali penuh saat menjelajahi
 produk.&quot;
 </p>
 </div>
 </div>
 </div>
 <div className="rounded-lg p-4 bg-[#13110e]">
 <h5 className="text-xs font-semibold text-[#94a99b]">
 Hedonic
 </h5>
 <div className="mt-3 space-y-3">
 <div className="rounded p-3 bg-[#0d0b08]">
 <p className="text-xs font-medium">
 EMT1 — Emotion
 </p>
 <p className="mt-1 text-xs text-[#7a7068]">
 &quot;Menggunakan TikTok Shop membuat saya merasa
 senang.&quot;
 </p>
 </div>
 <div className="rounded p-3 bg-[#0d0b08]">
 <p className="text-xs font-medium">
 EGG1 — Engagement
 </p>
 <p className="mt-1 text-xs text-[#7a7068]">
 &quot;Saya merasa tertarik dan terlibat saat menggunakan
 aplikasi ini.&quot;
 </p>
 </div>
 <div className="rounded p-3 bg-[#0d0b08]">
 <p className="text-xs font-medium">
 SAT1 — Satisfaction
 </p>
 <p className="mt-1 text-xs text-[#7a7068]">
 &quot;Secara keseluruhan, saya puas dengan pengalaman
 menggunakan TikTok Shop.&quot;
 </p>
 </div>
 </div>
 </div>
 </div>
 <div className="mt-3 flex items-center gap-2 rounded p-3 bg-[#0d0b08]">
 <span className="text-xs text-[#5c5449]">
 Skala:
 </span>
 {[1, 2, 3, 4, 5].map((n) => (
 <span
 key={n}
 className="flex h-6 w-6 items-center justify-center rounded border text-[10px] border-[#2a2520]"
 >
 {n}
 </span>
 ))}
 <span className="ml-1 text-[10px] text-[#5c5449]">
 1 = Sangat Tidak Setuju → 5 = Sangat Setuju
 </span>
 </div>
 </div>
 </div>
 <div className="mt-6 rounded-2xl border p-6 border-[#2a2520] bg-[#13110e] md:p-8">
 <div className="flex items-center gap-2">
 <Layers className="h-5 w-5 text-[#94a99b]" />
 <h3 className="text-lg font-semibold">Brand Loyalty</h3>
 </div>
 <p className="mt-2 text-sm text-[#6a7a72]">
 Diukur sebagai variabel outcome. Molinillo et al. (2022)
 menemukan bahwa dimensi afektif memiliki pengaruh paling besar
 terhadap loyalitas pelanggan, melampaui kualitas utilitarian.
 </p>
 <div className="mt-4 rounded-lg p-4 bg-[#0d0b08]">
 <p className="font-mono text-xs text-[#7a7068]">
 App Design Quality → Affective Experience → Satisfaction →
 Loyalty
 </p>
 <p className="mt-2 text-xs text-[#5c5449]">
 Kerangka causal Molinillo et al. (2022) — mediasi melalui
 pengalaman afektif menjelaskan mengapa desain yang hanya
 berfokus pada fungsionalitas belum cukup untuk membangun
 loyalitas jangka panjang.
 </p>
 </div>

 {/* Brand Loyalty Example */}
 <div className="mt-5 rounded-lg border border-dashed p-5 border-[#2a2520]">
 <p className="text-xs font-semibold uppercase tracking-wider text-[#7a7068]">
 Contoh Item Kuesioner
 </p>
 <p className="mt-2 text-xs text-[#7a7068]">
 Menggunakan skala Likert 1–5. Mengukur kecenderungan loyalitas
 pengguna terhadap TikTok Shop sebagai platform.
 </p>
 <div className="mt-4 space-y-3">
 <div className="rounded-lg p-4 bg-[#13110e]">
 <div className="space-y-3">
 <div className="rounded p-3 bg-[#0d0b08]">
 <p className="text-xs font-medium">Loy1 — Repurchase Intention</p>
 <p className="mt-1 text-xs text-[#7a7068]">
 &quot;Saya berniat untuk terus menggunakan TikTok Shop di masa
 mendatang.&quot;
 </p>
 </div>
 <div className="rounded p-3 bg-[#0d0b08]">
 <p className="text-xs font-medium">Loy2 — Recommendation</p>
 <p className="mt-1 text-xs text-[#7a7068]">
 &quot;Saya akan merekomendasikan TikTok Shop kepada teman atau
 keluarga.&quot;
 </p>
 </div>
 <div className="rounded p-3 bg-[#0d0b08]">
 <p className="text-xs font-medium">Loy3 — Resistance to Switching</p>
 <p className="mt-1 text-xs text-[#7a7068]">
 &quot;Meskipun ada aplikasi belanja lain yang serupa, saya tetap
 memilih TikTok Shop.&quot;
 </p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </motion.div>

 {/* ─── Sample & Criteria ─── */}
 <motion.div {...fadeUp} className="mt-16">
 <div className="rounded-2xl border p-6 border-[#2a2520] bg-[#0a0f0d] md:p-8">
 <div className="flex items-center gap-2">
 <Users className="h-5 w-5 text-[#94a99b]" />
 <h3 className="text-lg font-semibold">Kriteria Partisipan</h3>
 </div>
 <div className="mt-4 grid gap-3 md:grid-cols-2">
 {[
 {
 label: "Pengguna aktif TikTok Shop",
 detail: "Minimal 3 bulan penggunaan",
 },
 {
 label: "Frekuensi penggunaan",
 detail: "Minimal 3 kali per minggu",
 },
 { label: "Usia", detail: "17 tahun atau lebih" },
 {
 label: "Target responden",
 detail: "150–180 responden",
 },
 ].map((item) => (
 <div
 key={item.label}
 className="rounded-lg border p-4 border-[#2a2520] bg-[#13110e]"
 >
 <p className="text-sm font-medium">{item.label}</p>
 <p className="mt-1 text-xs text-[#6a7a72]">
 {item.detail}
 </p>
 </div>
 ))}
 </div>
 </div>
 </motion.div>

 {/* ─── REFLECTIVE LAYER: CTA ─── */}
 <motion.div {...fadeUp} className="mt-20">
 <div className="rounded-2xl border border-[#94a99b]/20 bg-gradient-to-b from-[#94a99b]/5 to-transparent p-8 text-center border-[#2a2520] md:p-12">
 <Heart className="mx-auto h-8 w-8 text-[#94a99b]" />
 <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
 Kontribusi untuk Riset Desain Emosi
 </h2>
 <p className="mx-auto mt-3 max-w-lg text-sm text-[#6a7a72]">
 Kesempatanmu berkontribusi pada penelitian tentang bagaimana
 desain emosi memengaruhi pengalaman dan loyalitas pengguna di
 Indonesia. Kuesioner memakan waktu sekitar 5–8 menit.
 </p>

 <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
 <a
 href="https://forms.gle/REPLACE_WITH_YOUR_FORM_LINK"
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 rounded-lg bg-[#94a99b] px-6 py-3 text-sm font-semibold text-[#0d0b08] transition-colors hover:bg-[#a8bfb2]"
 >
 Isi Kuesioner
 <ExternalLink className="h-4 w-4" />
 </a>
 </div>

 <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[#5c5449]">
 <span className="flex items-center gap-1">
 <Clock className="h-3 w-3" />
 5–8 menit
 </span>
 <span>·</span>
 <span>Anonim</span>
 <span>·</span>
 <span>Untuk keperluan akademik</span>
 </div>
 </div>
 </motion.div>

 {/* ─── Researcher Info ─── */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.5, delay: 0.4 }}
 className="mt-12 text-center"
 >
 <div className="rounded-xl border p-6 border-[#2a2520] bg-[#13110e]">
 <p className="text-sm font-medium">Hanif Nahriya Nugraha</p>
 <p className="text-xs text-[#7a7068]">
 NRP 162021003 · Program Studi Sistem Informasi · Fakultas
 Teknologi Industri · Institut Teknologi Nasional Bandung · 2026
 </p>
 <p className="mt-3 text-xs text-[#5c5449]">
 Email: hanifnugraha69@gmail.com
 </p>
 </div>
 </motion.div>
 </div>
 </main>
 )
}
