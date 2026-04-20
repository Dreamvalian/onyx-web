'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageSquare, User, Heart, Sparkles } from 'lucide-react'
import { Footer } from '@/components/landing/footer'

interface GuestbookEntry {
 id: string
 name: string
 message: string
 timestamp: number
}

const MAX_MESSAGE_LENGTH = 140
const MAX_NAME_LENGTH = 30

function timeAgo(timestamp: number): string {
 const seconds = Math.floor((Date.now() - timestamp) / 1000)
 if (seconds < 60) return 'just now'
 const minutes = Math.floor(seconds / 60)
 if (minutes < 60) return `${minutes}m ago`
 const hours = Math.floor(minutes / 60)
 if (hours < 24) return `${hours}h ago`
 const days = Math.floor(hours / 24)
 return `${days}d ago`
}

function SkeletonCard() {
 return (
 <div className="rounded-xl border p-5 animate-pulse border-[#2a2520] bg-[#1a1714]">
 <div className="h-4 w-3/4 rounded bg-[#2a2520] bg-[#2a2520]" />
 <div className="mt-3 h-3 w-1/4 rounded bg-[#2a2520] bg-[#2a2520]" />
 </div>
 )
}

function EntryCard({ entry, index }: { entry: GuestbookEntry; index: number }) {
 return (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4, delay: index * 0.05 }}
 className="group rounded-xl border p-5 transition-colors hover:border-[#94a99b]/30 border-[#2a2520] bg-[#1a1714]"
 >
 <p className="text-sm leading-relaxed text-[#e8e0d4]">{entry.message}</p>
 <div className="mt-4 flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#2a2520]">
 <User className="h-3 w-3 text-[#94a99b]" />
 </div>
 <span className="text-xs font-medium text-[#94a99b]">{entry.name}</span>
 </div>
 <span className="text-xs text-[#7a7068]">{timeAgo(entry.timestamp)}</span>
 </div>
 </motion.div>
 )
}

export default function GuestbookPage() {
 const [entries, setEntries] = useState<GuestbookEntry[]>([])
 const [total, setTotal] = useState(0)
 const [page, setPage] = useState(1)
 const [hasMore, setHasMore] = useState(false)
 const [loading, setLoading] = useState(true)
 const [submitting, setSubmitting] = useState(false)
 const [name, setName] = useState('')
 const [message, setMessage] = useState('')
 const [error, setError] = useState('')
 const [success, setSuccess] = useState(false)
 const [honeypot, setHoneypot] = useState('')
 const formRef = useRef<HTMLFormElement>(null)

 async function fetchEntries(pageNum: number, append = false) {
 try {
 const res = await fetch(`/api/guestbook?page=${pageNum}&limit=20`)
 const data = await res.json()
 if (append) {
 setEntries(prev => [...prev, ...data.entries])
 } else {
 setEntries(data.entries)
 }
 setTotal(data.total)
 setHasMore(data.hasMore)
 setPage(pageNum)
 } catch {
 // silent fail
 } finally {
 setLoading(false)
 }
 }

 useEffect(() => {
 fetchEntries(1)
 }, [])

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault()
 if (submitting) return

 // Honeypot check
 if (honeypot) return

 if (!message.trim()) {
 setError('Message is required.')
 return
 }
 if (message.length > MAX_MESSAGE_LENGTH) {
 setError(`Max ${MAX_MESSAGE_LENGTH} characters.`)
 return
 }
 if (name.length > MAX_NAME_LENGTH) {
 setError(`Name max ${MAX_NAME_LENGTH} characters.`)
 return
 }

 setError('')
 setSubmitting(true)

 try {
 const res = await fetch('/api/guestbook', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ name: name.trim() || 'Anonymous', message: message.trim() })
 })
 const data = await res.json()

 if (!res.ok) {
 setError(data.error || 'Failed to submit.')
 return
 }

 // Success: reset form, show animation, prepend new entry
 setMessage('')
 setName('')
 setSuccess(true)
 setTimeout(() => setSuccess(false), 2000)
 setEntries(prev => [data.entry, ...prev])
 setTotal(prev => prev + 1)
 } catch {
 setError('Failed to submit. Try again.')
 } finally {
 setSubmitting(false)
 }
 }

 return (
 <main className="pt-24 pb-20">
 <div className="mx-auto max-w-3xl px-4">
 {/* Header */}
 <div className="mb-10 text-center">
 <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 border-[#2a2520] bg-[#1a1714]">
 <MessageSquare className="h-3.5 w-3.5 text-[#94a99b]" />
 <span className="text-xs font-medium text-[#7a7068]">
 {loading ? '...' : `${total} ${total === 1 ? 'entry' : 'entries'}`}
 </span>
 </div>
 <h1 className="mb-2 text-3xl font-bold text-[#94a99b]">Guestbook</h1>
 <p className="text-sm text-[#7a7068]">Leave a trace. Say hi. No account needed.</p>
 </div>

 {/* Form */}
 <form
 ref={formRef}
 onSubmit={handleSubmit}
 className="mb-12 rounded-xl border p-6 border-[#2a2520] bg-[#1a1714]"
 >
 {/* Honeypot — hidden from humans */}
 <input
 type="text"
 name="website"
 value={honeypot}
 onChange={e => setHoneypot(e.target.value)}
 tabIndex={-1}
 autoComplete="off"
 className="absolute left-[-9999px] top-[-9999px]"
 />

 <div className="mb-4">
 <input
 type="text"
 placeholder="Name (optional)"
 value={name}
 onChange={e => setName(e.target.value)}
 maxLength={MAX_NAME_LENGTH}
 className="w-full rounded-lg border px-4 py-2 text-sm placeholder:outline-none transition-colors focus:border-[#94a99b]/50 border-[#2a2520] bg-[#0d0b08] text-[#e8e0d4] placeholder:text-[#7a7068]"
 />
 </div>

 <div className="mb-4">
 <textarea
 placeholder="Say something nice..."
 value={message}
 onChange={e => setMessage(e.target.value)}
 maxLength={MAX_MESSAGE_LENGTH}
 rows={3}
 className="w-full rounded-lg border px-4 py-3 text-sm placeholder:outline-none transition-colors focus:border-[#94a99b]/50 resize-none border-[#2a2520] bg-[#0d0b08] text-[#e8e0d4] placeholder:text-[#7a7068]"
 />
 <div className="mt-1.5 flex justify-end">
 <span className={`text-xs ${message.length > 120 ? (message.length >= MAX_MESSAGE_LENGTH ? 'text-red-400' : 'text-[#94a99b]') : 'text-[#7a7068]'}`}>
 {message.length}/{MAX_MESSAGE_LENGTH}
 </span>
 </div>
 </div>

 <AnimatePresence mode="wait">
 {success ? (
 <motion.div
 key="success"
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="flex items-center justify-center gap-2 rounded-lg bg-[#94a99b]/10 py-2.5"
 >
 <Sparkles className="h-4 w-4 text-[#94a99b]" />
 <span className="text-sm font-medium text-[#94a99b]">Entry added!</span>
 <Heart className="h-4 w-4 text-[#94a99b] animate-pulse" />
 </motion.div>
 ) : (
 <motion.div
 key="form"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="flex items-center gap-3"
 >
 {error && (
 <span className="text-xs text-red-400">{error}</span>
 )}
 <button
 type="submit"
 disabled={submitting}
 className="ml-auto flex items-center gap-2 rounded-lg bg-[#94a99b] px-5 py-2.5 text-sm font-medium transition-opacity hover:bg-[#2a2520] hover:opacity-90 disabled:opacity-50 bg-[#94a99b] text-[#0d0b08] hover:bg-[#2a2520]"
 >
 {submitting ? (
 'Sending...'
 ) : (
 <>
 <Send className="h-3.5 w-3.5" />
 Sign
 </>
 )}
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </form>

 {/* Entry Grid */}
 {loading ? (
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 {Array.from({ length: 6 }).map((_, i) => (
 <SkeletonCard key={i} />
 ))}
 </div>
 ) : entries.length === 0 ? (
 <div className="flex flex-col items-center gap-3 py-16 text-center">
 <MessageSquare className="h-10 w-10 text-[#2a2520]" />
 <p className="text-sm text-[#7a7068]">No entries yet. Be the first.</p>
 </div>
 ) : (
 <>
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
 <AnimatePresence initial={false}>
 {entries.map((entry, i) => (
 <EntryCard key={entry.id} entry={entry} index={i} />
 ))}
 </AnimatePresence>
 </div>

 {hasMore && (
 <div className="mt-8 flex justify-center">
 <button
 onClick={() => fetchEntries(page + 1, true)}
 className="rounded-lg border px-6 py-2.5 text-sm transition-colors hover:border-[#94a99b]/30 hover:text-[#94a99b] border-[#2a2520] bg-[#1a1714] text-[#7a7068]"
 >
 Load more
 </button>
 </div>
 )}
 </>
 )}
 </div>

 <div className="mt-20">
 <Footer />
 </div>
 </main>
 )
}
