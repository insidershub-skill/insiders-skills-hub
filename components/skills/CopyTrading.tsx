'use client'

import { useState } from 'react'
import { Users, TrendingUp, Shield, Zap, Star, CheckCircle, ChevronRight, PieChart } from 'lucide-react'

const traders = [
  {
    id: 1,
    name: 'InsiderEdge_Pro',
    avatar: 'I',
    avatarBg: 'linear-gradient(135deg, #ff4757, #ff8c00)',
    winRate: 76,
    roi: 198,
    activePositions: 12,
    risk: 'high',
    specialty: '政治事件',
    followers: 2840,
    volume: '$1.2M',
    streak: 14,
    topMarkets: ['美国大选', '国会立法', '国际关系'],
    monthlyReturn: [8.2, 12.4, -3.1, 15.8, 9.3, 21.4],
    verified: true,
  },
  {
    id: 2,
    name: 'CryptoOracle_88',
    avatar: 'C',
    avatarBg: 'linear-gradient(135deg, #a855f7, #4f88ff)',
    winRate: 73,
    roi: 145,
    activePositions: 8,
    risk: 'high',
    specialty: '加密资产',
    followers: 1920,
    volume: '$890K',
    streak: 9,
    topMarkets: ['ETH ETF', 'BTC价格', '稳定币监管'],
    monthlyReturn: [11.2, 8.7, 14.1, -2.3, 18.9, 12.6],
    verified: true,
  },
  {
    id: 3,
    name: 'DataDrivenAlpha',
    avatar: 'D',
    avatarBg: 'linear-gradient(135deg, #00d4aa, #4f88ff)',
    winRate: 71,
    roi: 112,
    activePositions: 15,
    risk: 'low',
    specialty: '宏观经济',
    followers: 3210,
    volume: '$2.1M',
    streak: 22,
    topMarkets: ['美联储利率', '通胀数据', 'GDP预测'],
    monthlyReturn: [5.8, 7.2, 9.1, 6.4, 8.8, 7.5],
    verified: true,
  },
  {
    id: 4,
    name: 'MarketWhisperer',
    avatar: 'M',
    avatarBg: 'linear-gradient(135deg, #ffa502, #ff4757)',
    winRate: 68,
    roi: 89,
    activePositions: 6,
    risk: 'medium',
    specialty: '科技事件',
    followers: 1450,
    volume: '$540K',
    streak: 6,
    topMarkets: ['AI监管', '科技IPO', '专利纠纷'],
    monthlyReturn: [9.4, -1.2, 12.8, 7.3, 5.6, 10.1],
    verified: false,
  },
  {
    id: 5,
    name: 'NewsMaster2024',
    avatar: 'N',
    avatarBg: 'linear-gradient(135deg, #06b6d4, #a855f7)',
    winRate: 65,
    roi: 67,
    activePositions: 9,
    risk: 'medium',
    specialty: '突发新闻',
    followers: 980,
    volume: '$320K',
    streak: 4,
    topMarkets: ['突发事件', '选举结果', '地缘政治'],
    monthlyReturn: [6.1, 8.9, 3.2, -4.8, 12.7, 8.4],
    verified: false,
  },
]

const riskConfig = {
  high: { label: '高风险', color: '#ff4757', bg: 'rgba(255,71,87,0.12)' },
  medium: { label: '中风险', color: '#ffa502', bg: 'rgba(255,165,2,0.12)' },
  low: { label: '低风险', color: '#00d4aa', bg: 'rgba(0,212,170,0.12)' },
}

export default function CopyTrading() {
  const [following, setFollowing] = useState<Set<number>>(new Set())
  const [allocation, setAllocation] = useState(500)
  const [selectedTrader, setSelectedTrader] = useState<number | null>(null)

  const toggleFollow = (id: number) => {
    setFollowing(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selected = traders.find(t => t.id === selectedTrader)

  return (
    <div className="flex flex-col lg:flex-row gap-5 animate-fade-in">
      {/* Left: Leaderboard */}
      <div className="lg:w-7/12 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={14} style={{ color: '#ffa502' }} />
            <span className="text-sm font-medium text-slate-200">顶级预测者排行榜</span>
          </div>
          <div className="text-xs text-slate-500">
            正在跟单: <span className="font-semibold" style={{ color: '#ffa502' }}>{following.size}</span> 位
          </div>
        </div>

        {traders.map((trader, index) => {
          const risk = riskConfig[trader.risk as keyof typeof riskConfig]
          const isFollowing = following.has(trader.id)
          const isSelected = selectedTrader === trader.id

          return (
            <div
              key={trader.id}
              className="rounded-xl p-4 cursor-pointer transition-all"
              onClick={() => setSelectedTrader(isSelected ? null : trader.id)}
              style={{
                background: isSelected ? 'rgba(255,165,2,0.06)' : '#0d1421',
                border: isSelected ? '1px solid rgba(255,165,2,0.3)' : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-6 text-center">
                  {index === 0 ? (
                    <span className="text-base">🥇</span>
                  ) : index === 1 ? (
                    <span className="text-base">🥈</span>
                  ) : index === 2 ? (
                    <span className="text-base">🥉</span>
                  ) : (
                    <span className="text-xs text-slate-500 font-mono">#{index + 1}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: trader.avatarBg }}>
                  {trader.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-slate-200">{trader.name}</span>
                    {trader.verified && <CheckCircle size={11} style={{ color: '#4f88ff' }} />}
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: risk.bg, color: risk.color }}>{risk.label}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {trader.specialty} · 连胜 {trader.streak} 场 · {trader.followers.toLocaleString()} 关注
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono" style={{ color: '#00d4aa' }}>+{trader.roi}%</div>
                    <div className="text-xs text-slate-500">总ROI</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{trader.winRate}%</div>
                    <div className="text-xs text-slate-500">胜率</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); toggleFollow(trader.id) }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={
                      isFollowing
                        ? { background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.4)', color: '#00d4aa' }
                        : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }
                    }
                  >
                    {isFollowing ? '✓ 跟单中' : '+ 跟单'}
                  </button>
                </div>
              </div>

              {/* Mini chart */}
              {isSelected && selected && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-2">近6月收益率</div>
                      <div className="flex items-end gap-1 h-12">
                        {selected.monthlyReturn.map((v, i) => (
                          <div key={i} className="flex-1 rounded-sm" style={{ height: `${Math.abs(v) * 3}px`, background: v >= 0 ? '#00d4aa' : '#ff4757', minHeight: '4px' }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-2">擅长市场</div>
                      <div className="flex flex-col gap-1">
                        {selected.topMarkets.map(m => (
                          <div key={m} className="text-xs text-slate-400 flex items-center gap-1">
                            <ChevronRight size={10} style={{ color: '#ffa502' }} />
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Right: Portfolio config */}
      <div className="lg:w-5/12 flex flex-col gap-4">
        <div className="rounded-xl p-4" style={{ background: '#0d1421', border: '1px solid rgba(255,165,2,0.2)' }}>
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={14} style={{ color: '#ffa502' }} />
            <span className="text-sm font-medium text-slate-200">跟单配置</span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">跟单金额</span>
                <span className="font-mono" style={{ color: '#ffa502' }}>${allocation.toLocaleString()} USDC</span>
              </div>
              <input
                type="range"
                min={100}
                max={5000}
                step={100}
                value={allocation}
                onChange={e => setAllocation(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: '#ffa502' }}
              />
              <div className="flex justify-between text-xs text-slate-600 mt-0.5">
                <span>$100</span>
                <span>$5,000</span>
              </div>
            </div>

            <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-xs text-slate-500 mb-2">按跟单人数平均分配</div>
              {following.size > 0 ? (
                traders.filter(t => following.has(t.id)).map(t => (
                  <div key={t.id} className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: t.avatarBg, color: 'white' }}>{t.avatar}</div>
                      <span className="text-xs text-slate-400">{t.name}</span>
                    </div>
                    <span className="text-xs font-mono" style={{ color: '#00d4aa' }}>
                      ${Math.floor(allocation / following.size).toLocaleString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-600 py-3 text-center">选择跟单对象后自动分配</div>
              )}
            </div>
          </div>
        </div>

        {/* Estimated returns */}
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.2)' }}>
          <div className="text-xs text-slate-400 mb-3">预估收益（基于历史数据）</div>
          <div className="text-3xl font-bold" style={{ color: '#00d4aa', fontFamily: 'JetBrains Mono, monospace' }}>
            +${following.size > 0
              ? Math.floor(allocation * (traders.filter(t => following.has(t.id)).reduce((a, t) => a + t.roi, 0) / following.size / 100)).toLocaleString()
              : '---'}
          </div>
          <div className="text-xs text-slate-500 mt-1">预计年化（非财务建议）</div>
          {following.size > 0 && (
            <div className="mt-3 text-xs text-slate-400">
              平均胜率: <span className="font-semibold text-slate-200">
                {Math.floor(traders.filter(t => following.has(t.id)).reduce((a, t) => a + t.winRate, 0) / following.size)}%
              </span>
            </div>
          )}
        </div>

        <button
          disabled={following.size === 0}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: following.size > 0 ? 'linear-gradient(135deg, #ffa502, #ff4757)' : 'rgba(255,255,255,0.05)',
            color: following.size > 0 ? 'white' : '#64748b',
            cursor: following.size > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          {following.size > 0 ? `开始跟单 ${following.size} 位交易者` : '请先选择跟单对象'}
        </button>
      </div>
    </div>
  )
}
