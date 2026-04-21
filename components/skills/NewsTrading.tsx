'use client'

import { useState, useEffect } from 'react'
import { Newspaper, RefreshCw, TrendingUp, TrendingDown, Minus, Cpu, ExternalLink, Clock } from 'lucide-react'

const newsItems = [
  {
    id: 1,
    headline: '美联储主席鲍威尔：通胀仍高于目标，短期内不考虑降息',
    source: 'Reuters',
    time: '2分钟前',
    sentiment: -0.78,
    sentimentLabel: '强烈看跌',
    markets: ['Fed降息预期市场', '美元指数市场'],
    signal: 'SELL',
    confidence: 89,
    category: '宏观',
    impact: 'HIGH',
  },
  {
    id: 2,
    headline: 'SEC批准首批以太坊现货ETF，预计下周开始交易',
    source: 'Bloomberg',
    time: '8分钟前',
    sentiment: 0.92,
    sentimentLabel: '极度看涨',
    markets: ['ETH ETF批准市场', '以太坊价格市场'],
    signal: 'BUY',
    confidence: 94,
    category: '加密',
    impact: 'VERY HIGH',
  },
  {
    id: 3,
    headline: '最新民调：特朗普领先拜登4个百分点，关键摇摆州支持率持平',
    source: 'AP News',
    time: '15分钟前',
    sentiment: 0.31,
    sentimentLabel: '轻微看涨',
    markets: ['2024总统大选市场'],
    signal: 'WATCH',
    confidence: 67,
    category: '政治',
    impact: 'MEDIUM',
  },
  {
    id: 4,
    headline: '黄金价格突破2400美元历史新高，避险情绪升温',
    source: 'FT',
    time: '22分钟前',
    sentiment: 0.65,
    sentimentLabel: '看涨',
    markets: ['黄金价格突破市场', '商品市场'],
    signal: 'BUY',
    confidence: 81,
    category: '商品',
    impact: 'HIGH',
  },
  {
    id: 5,
    headline: 'OpenAI发布GPT-5，多项基准测试超越人类专家水平',
    source: 'TechCrunch',
    time: '35分钟前',
    sentiment: 0.85,
    sentimentLabel: '强烈看涨',
    markets: ['AI监管市场', 'GPT商业化市场'],
    signal: 'BUY',
    confidence: 76,
    category: 'AI',
    impact: 'HIGH',
  },
  {
    id: 6,
    headline: '乌克兰拒绝俄罗斯停火提案，欧盟承诺追加军事援助',
    source: 'CNN',
    time: '48分钟前',
    sentiment: -0.55,
    sentimentLabel: '看跌',
    markets: ['乌克兰停战市场', '欧盟援助市场'],
    signal: 'SELL',
    confidence: 72,
    category: '政治',
    impact: 'MEDIUM',
  },
]

const signalColors: Record<string, string> = { BUY: '#00d4aa', SELL: '#ff4757', WATCH: '#ffa502' }
const impactColors: Record<string, string> = { 'VERY HIGH': '#ff4757', HIGH: '#ffa502', MEDIUM: '#4f88ff', LOW: '#64748b' }
const sourceColors: Record<string, string> = {
  Reuters: '#ff8c00', Bloomberg: '#4f88ff', 'AP News': '#00d4aa', FT: '#ff4757', TechCrunch: '#a855f7', CNN: '#cc0000'
}

export default function NewsTrading() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const [filter, setFilter] = useState('全部')
  const [newSignalFlash, setNewSignalFlash] = useState<number | null>(null)

  const categories = ['全部', '宏观', '加密', '政治', '商品', 'AI']
  const filtered = filter === '全部' ? newsItems : newsItems.filter(n => n.category === filter)

  const handleScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setNewSignalFlash(2)
          setTimeout(() => setNewSignalFlash(null), 2000)
          return 100
        }
        return p + 3
      })
    }, 40)
  }

  const getSentimentBar = (score: number) => {
    const abs = Math.abs(score)
    const color = score > 0 ? '#00d4aa' : '#ff4757'
    const width = abs * 100
    return { width, color }
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
              style={
                filter === cat
                  ? { background: 'rgba(79,136,255,0.15)', border: '1px solid rgba(79,136,255,0.4)', color: '#4f88ff' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: isScanning ? 'rgba(79,136,255,0.2)' : 'rgba(79,136,255,0.15)',
              border: '1px solid rgba(79,136,255,0.4)',
              color: '#4f88ff',
            }}
          >
            {isScanning ? <Cpu size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            {isScanning ? `扫描中 ${scanProgress}%` : '立即扫描'}
          </button>
        </div>
      </div>

      {/* Scanning banner */}
      {isScanning && (
        <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{ width: `${scanProgress}%`, background: 'linear-gradient(90deg, #4f88ff, #00d4aa)', transition: 'width 0.1s linear' }}
          />
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: '今日扫描', value: '2,847', color: '#4f88ff' },
          { label: 'BUY 信号', value: '18', color: '#00d4aa' },
          { label: 'SELL 信号', value: '9', color: '#ff4757' },
          { label: '信号胜率', value: '79%', color: '#a855f7' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* News feed */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {filtered.slice(0, visibleCount).map((item) => {
          const { width: sentWidth, color: sentColor } = getSentimentBar(item.sentiment)
          return (
            <div
              key={item.id}
              className="rounded-xl p-4 transition-all"
              style={{
                background: item.id === newSignalFlash ? `rgba(${item.signal === 'BUY' ? '0,212,170' : '255,71,87'},0.08)` : '#0d1421',
                border: item.id === newSignalFlash ? `1px solid rgba(${item.signal === 'BUY' ? '0,212,170' : '255,71,87'},0.4)` : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-start gap-3">
                {/* Signal badge */}
                <div
                  className="mt-0.5 px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0"
                  style={{ background: `${signalColors[item.signal]}15`, border: `1px solid ${signalColors[item.signal]}40`, color: signalColors[item.signal], minWidth: '48px', textAlign: 'center' }}
                >
                  {item.signal}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Headline */}
                  <div className="text-sm text-slate-200 leading-snug mb-2">{item.headline}</div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-xs font-semibold" style={{ color: sourceColors[item.source] || '#64748b' }}>
                      {item.source}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={10} /> {item.time}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${impactColors[item.impact]}18`, color: impactColors[item.impact] }}>
                      {item.impact}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Sentiment bar */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-500 w-12">情感</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${sentWidth}%`, background: sentColor, marginLeft: item.sentiment < 0 ? `${100 - sentWidth}%` : 0 }} />
                    </div>
                    <span className="text-xs" style={{ color: sentColor }}>{item.sentimentLabel}</span>
                  </div>

                  {/* Related markets */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">关联市场:</span>
                    {item.markets.map(m => (
                      <span key={m} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,136,255,0.1)', border: '1px solid rgba(79,136,255,0.2)', color: '#4f88ff' }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Confidence */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold font-mono" style={{ color: signalColors[item.signal] }}>{item.confidence}%</div>
                  <div className="text-xs text-slate-500">置信度</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {visibleCount < filtered.length && (
        <button
          onClick={() => setVisibleCount(v => v + 3)}
          className="w-full py-2.5 rounded-xl text-xs font-medium transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
        >
          加载更多 ({filtered.length - visibleCount} 条)
        </button>
      )}
    </div>
  )
}
