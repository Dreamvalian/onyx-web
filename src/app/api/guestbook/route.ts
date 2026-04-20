import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import { randomUUID } from 'crypto'

const REDIS_KEY = 'guestbook:entries'
const RATE_LIMIT_KEY_PREFIX = 'guestbook:ratelimit:'
const MAX_MESSAGE_LENGTH = 140
const MAX_NAME_LENGTH = 30
const RATE_LIMIT_WINDOW = 60 // seconds
const RATE_LIMIT_MAX = 3 // entries per window

interface GuestbookEntry {
  id: string
  name: string
  message: string
  timestamp: number
}

// GET — fetch entries with pagination
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const offset = (page - 1) * limit

  try {
    const total = await redis.zcard(REDIS_KEY)
    const raw = await redis.zrevrange(REDIS_KEY, offset, offset + limit - 1)
    const entries = raw.map(r => JSON.parse(r) as GuestbookEntry)
    
    return NextResponse.json({
      entries,
      total,
      page,
      hasMore: offset + limit < total
    })
  } catch (err) {
    return NextResponse.json({ entries: [], total: 0, error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST — create new entry
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    
    // Rate limiting
    const rateKey = RATE_LIMIT_KEY_PREFIX + ip
    const count = await redis.incr(rateKey)
    if (count === 1) await redis.expire(rateKey, RATE_LIMIT_WINDOW)
    if (count > RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: 'Slow down. 3 entries per minute.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const message = (body.message || '').trim()
    const name = (body.name || 'Anonymous').trim()

    // Validation
    if (!message) return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
    if (message.length > MAX_MESSAGE_LENGTH) return NextResponse.json({ error: `Max ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 })
    if (name.length > MAX_NAME_LENGTH) return NextResponse.json({ error: `Name max ${MAX_NAME_LENGTH} characters.` }, { status: 400 })
    
    // Block URLs
    if (/https?:\/\//i.test(message)) return NextResponse.json({ error: 'Links are not allowed.' }, { status: 400 })

    const entry: GuestbookEntry = {
      id: randomUUID(),
      name,
      message,
      timestamp: Date.now()
    }

    await redis.zadd(REDIS_KEY, entry.timestamp, JSON.stringify(entry))
    return NextResponse.json({ success: true, entry }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to save.' }, { status: 500 })
  }
}
