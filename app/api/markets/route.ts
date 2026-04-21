import { NextRequest, NextResponse } from 'next/server'

const PAGE_SIZE = 20

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'volume'
  const offset = (page - 1) * PAGE_SIZE

  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    offset: String(offset),
    active: 'true',
    order: sort,
    ascending: 'false',
  })
  if (q) params.set('q', q)

  try {
    const res = await fetch(`https://gamma-api.polymarket.com/events?${params}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 30 },
    })
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()

    return NextResponse.json({
      success: true,
      markets: Array.isArray(data) ? data : [],
      page,
      pageSize: PAGE_SIZE,
      hasMore: Array.isArray(data) && data.length === PAGE_SIZE,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'failed'
    const isBlocked =
      msg.includes('timeout') || msg.includes('fetch') ||
      msg.includes('aborted') || msg.includes('ENOTFOUND')
    return NextResponse.json(
      { error: isBlocked ? 'BLOCKED' : msg },
      { status: isBlocked ? 503 : 500 }
    )
  }
}
