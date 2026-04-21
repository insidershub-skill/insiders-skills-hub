'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Search, TrendingUp, Clock, DollarSign,
  ChevronLeft, ChevronRight, ExternalLink,
  RefreshCw, WifiOff, Tag, BarChart2
} from 'lucide-react'

interface PolyMarket {
  id: string
  question: string
  outcomePrices: string
  outcomes: string
  volume: string
}

interface PolyEvent {
  id: string
  title: string
  slug: string
  endDate: string
  volume: string
  liquidity: string
  active: boolean
  markets: PolyMarket[]
  tags?: { id: string; label: string }[]
}

const SORT_OPTIONS = [
  { value: 'volume', label: '成交量' },
  { value: 'liquidity', label: '流动性' },
  { value: 'startDate', label: '最新上线' },
  { value: 'endDate', label: '即将结算' },
]

function formatVolume(v: string | number): string {
  const n = typeof v === 'string' ? parseFloat(v) : v
  if (isNaN(n)) return '—'
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

function formatDate(d: string): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', year: '2-digit' })
}

function getYesPrice(market: PolyMarket): number | null {
  try {
    const prices = JSON.parse(market.outcomePrices)
    const outcomes = JSON.parse(market.outcomes)
    const yesIdx = outcomes.findIndex((o: string) => o.toLowerCase() === 'yes')
    const idx = yesIdx >= 0 ? yesIdx : 0
    return Math.round(parseFloat(prices[idx]) * 100)
  } catch {
    return null
  }
}

function MarketCard({ event }: { event: PolyEvent }) {
  const mainMarket = event.markets?.[0]
  const yesPrice = mainMarket ? getYesPrice(mainMarket) : null
  const noPrice = yesPrice !== null ? 100 - yesPrice : null
  const priceColor = yesPrice !== null
    ? yesPrice >= 70 ? '#00d4aa' : yesPrice >= 40 ? '#ffa502' : '#ff4757'
    : '#64748b'

  return (
    <a
      href={`https://polymarket.com/event/${event.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-xl p-4 transition-all cursor-pointer"
      style={{
        background: '#0d1421',
        border: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(79,136,255,0.3)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Title */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm text-slate-200 leading-snug font-medium line-clamp-2 flex-1"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {event.title}
        </p>
        <ExternalLink size={12} className="text-slate-600 flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {event.tags.slice(0, 2).map(tag => (
            <span key={tag.id} className="text-xs px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(79,136,255,0.1)', color: '#4f88ff', border: '1px solid rgba(79,136,255,0.2)' }}>
              {tag.label}
            </span>
          ))}
        </div>
      )}

      {/* Price bar */}
      {yesPrice !== null && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-semibold" style={{ color: priceColor }}>YES {yesPrice}%</span>
            <span className="text-slate-500">NO {noPrice}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,71,87,0.25)' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${yesPrice}%`, background: priceColor }} />
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between mt-auto pt-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <BarChart2 size={10} />
          <span>{formatVolume(event.volume)}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock size={10} />
          <span>{formatDate(event.endDate)}</span>
        </div>
      </div>
    </a>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 shimmer" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.07)', minHeight: '160px' }} />
  )
}

export default function MarketsView() {
  const [markets, setMarkets] = useState<PolyEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [sort, setSort] = useState('volume')
  const [query, setQuery] = useState('')
  const [inputValue, setInputValue] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [totalFetched, setTotalFetched] = useState(0)

  const fetchMarkets = useCallback(async (p: number, q: string, s: string) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page: String(p), sort: s })
      if (q) params.set('q', q)
      const res = await fetch(`/api/markets?${params}`)
      const data = await res.json()
      if (!res.ok) {
        if (data.error === 'BLOCKED') {
          setError('BLOCKED')
        } else {
          setError(data.error || '加载失败')
        }
        return
      }
      setMarkets(data.markets)
      setHasMore(data.hasMore)
      setTotalFetched(prev => p === 1 ? data.markets.length : prev + data.markets.length)
    } catch {
      setError('网络请求失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarkets(page, query, sort)
  }, [page, query, sort, fetchMarkets])

  const handleSearch = (val: string) => {
    setInputValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setQuery(val)
      setPage(1)
    }, 400)
  }

  const handleSort = (s: string) => {
    setSort(s)
    setPage(1)
  }

  const handlePrev = () => { if (page > 1) setPage(p => p - 1) }
  const handleNext = () => { if (hasMore) setPage(p => p + 1) }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search size={14} className="text-slate-500 flex-shrink-0" />
          <input
            type="text"
            value={inputValue}
            onChange={e => handleSearch(e.target.value)}
            placeholder="搜索市场..."
            className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder-slate-600"
          />
          {inputValue && (
            <button onClick={() => { setInputValue(''); setQuery(''); setPage(1) }}
              className="text-slate-600 hover:text-slate-400 transition-colors text-xs">✕</button>
          )}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {SORT_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => handleSort(opt.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={sort === opt.value
                ? { background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.35)', color: '#00d4aa' }
                : { background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      {!error && (
        <div className="flex items-center gap-4 text-xs text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <span className="live-dot" style={{ width: '5px', height: '5px' }} />
            Polymarket 实时数据
          </span>
          {!loading && markets.length > 0 && (
            <span>第 {page} 页 · 共 {markets.length} 个结果</span>
          )}
        </div>
      )}

      {/* Blocked error */}
      {error === 'BLOCKED' && (
        <div className="rounded-xl p-8 flex flex-col items-center gap-3 text-center"
          style={{ background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.2)' }}>
          <WifiOff size={32} style={{ color: '#ff4757' }} />
          <div>
            <div className="text-sm font-medium" style={{ color: '#ff4757' }}>Polymarket API 在当前网络不可访问</div>
            <div className="text-xs text-slate-500 mt-1">部署到 Vercel 后可正常使用，本地开发需要代理</div>
          </div>
          <button onClick={() => fetchMarkets(page, query, sort)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{ background: 'rgba(255,71,87,0.12)', border: '1px solid rgba(255,71,87,0.3)', color: '#ff4757' }}>
            <RefreshCw size={11} /> 重试
          </button>
        </div>
      )}

      {/* Other error */}
      {error && error !== 'BLOCKED' && (
        <div className="rounded-xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.25)' }}>
          <span className="text-sm" style={{ color: '#ff4757' }}>{error}</span>
          <button onClick={() => fetchMarkets(page, query, sort)} className="ml-auto">
            <RefreshCw size={13} style={{ color: '#ff4757' }} />
          </button>
        </div>
      )}

      {/* Grid */}
      {!error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {loading
              ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={i} />)
              : markets.map(event => <MarketCard key={event.id} event={event} />)
            }
          </div>

          {/* Empty */}
          {!loading && markets.length === 0 && (
            <div className="rounded-xl p-12 text-center"
              style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)' }}>
              <Search size={32} className="mx-auto mb-3 opacity-20 text-slate-400" />
              <div className="text-sm text-slate-500">未找到匹配的市场</div>
            </div>
          )}

          {/* Pagination */}
          {!loading && markets.length > 0 && (
            <div className="flex items-center justify-between pt-2">
              <button onClick={handlePrev} disabled={page === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={page === 1
                  ? { background: 'rgba(255,255,255,0.03)', color: '#334155', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.05)' }
                  : { background: '#0d1421', color: '#94a3b8', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}>
                <ChevronLeft size={15} /> 上一页
              </button>

              <div className="flex items-center gap-2">
                {[...Array(Math.min(5, page + 2))].map((_, i) => {
                  const p = Math.max(1, page - 2) + i
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className="w-8 h-8 rounded-lg text-xs font-medium transition-all"
                      style={p === page
                        ? { background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.35)', color: '#00d4aa' }
                        : { background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
                      {p}
                    </button>
                  )
                })}
              </div>

              <button onClick={handleNext} disabled={!hasMore}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={!hasMore
                  ? { background: 'rgba(255,255,255,0.03)', color: '#334155', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.05)' }
                  : { background: '#0d1421', color: '#94a3b8', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}>
                下一页 <ChevronRight size={15} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
