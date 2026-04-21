'use client'

import { useState, useEffect } from 'react'
import { Layers, Plus, Minus, Trophy, Flame, TrendingUp, Target, Gift } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const pointsHistory = [
  { day: '4/14', points: 9840 },
  { day: '4/15', points: 10210 },
  { day: '4/16', points: 10580 },
  { day: '4/17', points: 10120 },
  { day: '4/18', points: 11340 },
  { day: '4/19', points: 12010 },
  { day: '4/20', points: 12450 },
]

const activeOrders = [
  { id: 'ORD-001', market: '特朗普2024大选', side: 'YES', price: 52, size: 200, pts: 24, status: 'pending' },
  { id: 'ORD-002', market: 'ETH ETF批准', side: 'YES', price: 68, size: 150, pts: 18, status: 'partial' },
  { id: 'ORD-003', market: 'Fed降息 Q2', side: 'NO', price: 71, size: 300, pts: 36, status: 'pending' },
  { id: 'ORD-004', market: '黄金突破2500', side: 'YES', price: 41, size: 100, pts: 12, status: 'pending' },
]

const tiers = [
  { name: 'Bronze', min: 0, max: 5000, color: '#cd7f32', multiplier: '1×' },
  { name: 'Silver', min: 5000, max: 10000, color: '#94a3b8', multiplier: '1.5×' },
  { name: 'Gold', min: 10000, max: 15000, color: '#ffa502', multiplier: '2×' },
  { name: 'Platinum', min: 15000, max: 25000, color: '#06b6d4', multiplier: '3×' },
  { name: 'Diamond', min: 25000, max: Infinity, color: '#a855f7', multiplier: '5×' },
]

const strategies = [
  { name: '深度挂单', desc: '在距市价5%以上挂单，获得额外积分', bonus: '+50%', active: true },
  { name: '双边挂单', desc: '同时挂出买卖两侧，提升流动性', bonus: '+30%', active: true },
  { name: '持续在场', desc: '连续7天每日挂单', bonus: '+连胜加成', active: false },
  { name: '大单策略', desc: '单笔超过$500的挂单', bonus: '+20%', active: true },
]

export default function LimitOrderStrategy() {
  const [totalPoints, setTotalPoints] = useState(12450)
  const [streak, setStreak] = useState(7)
  const [animating, setAnimating] = useState(false)

  const currentTier = tiers.find(t => totalPoints >= t.min && totalPoints < t.max) || tiers[2]
  const nextTier = tiers[tiers.indexOf(currentTier) + 1]
  const progress = nextTier ? ((totalPoints - currentTier.min) / (nextTier.min - currentTier.min)) * 100 : 100

  const handleClaimPoints = () => {
    setAnimating(true)
    const bonus = Math.floor(Math.random() * 150) + 50
    setTimeout(() => {
      setTotalPoints(p => p + bonus)
      setAnimating(false)
    }, 800)
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Points card */}
        <div className="col-span-2 rounded-xl p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, rgba(255,165,2,0.12), rgba(255,71,87,0.08))`, border: '1px solid rgba(255,165,2,0.3)' }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-slate-400 mb-1">积分余额</div>
              <div className={`text-4xl font-bold font-mono transition-all ${animating ? 'scale-110' : 'scale-100'}`} style={{ color: '#ffa502', transition: 'transform 0.2s' }}>
                {totalPoints.toLocaleString()}
                <span className="text-lg ml-1 font-normal text-slate-400">pts</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Trophy size={12} style={{ color: currentTier.color }} />
                <span className="text-sm font-semibold" style={{ color: currentTier.color }}>{currentTier.name} 会员</span>
                <span className="text-xs text-slate-500">· {currentTier.multiplier} 积分倍数</span>
              </div>
            </div>
            <button
              onClick={handleClaimPoints}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
              style={{ background: 'rgba(255,165,2,0.2)', border: '1px solid rgba(255,165,2,0.4)', color: '#ffa502' }}
            >
              <Gift size={12} />
              领取奖励
            </button>
          </div>

          {/* Tier progress */}
          {nextTier && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">距 {nextTier.name} 还需</span>
                <span style={{ color: nextTier.color }}>{(nextTier.min - totalPoints).toLocaleString()} pts</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})` }} />
              </div>
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="rounded-xl p-4 flex flex-col items-center justify-center" style={{ background: '#0d1421', border: '1px solid rgba(255,71,87,0.2)' }}>
          <Flame size={24} style={{ color: '#ff4757' }} />
          <div className="text-3xl font-bold font-mono mt-1" style={{ color: '#ff4757' }}>{streak}</div>
          <div className="text-xs text-slate-500 mt-0.5">连续签到天</div>
          <div className="text-xs mt-1" style={{ color: '#ffa502' }}>+{streak * 10}% 加成</div>
        </div>

        {/* Today's earned */}
        <div className="rounded-xl p-4 flex flex-col items-center justify-center" style={{ background: '#0d1421', border: '1px solid rgba(0,212,170,0.2)' }}>
          <TrendingUp size={24} style={{ color: '#00d4aa' }} />
          <div className="text-3xl font-bold font-mono mt-1" style={{ color: '#00d4aa' }}>+245</div>
          <div className="text-xs text-slate-500 mt-0.5">今日获得</div>
          <div className="text-xs mt-1 text-slate-500">8 笔挂单</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Points chart */}
        <div className="lg:col-span-3 rounded-xl p-4" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-xs font-medium text-slate-400 mb-4">积分增长趋势（近7天）</div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={pointsHistory}>
              <defs>
                <linearGradient id="ptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ffa502" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ffa502" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                cursor={{ stroke: 'rgba(255,165,2,0.3)' }}
                formatter={(v: number) => [`${v.toLocaleString()} pts`, '积分']}
              />
              <Area type="monotone" dataKey="points" stroke="#ffa502" strokeWidth={2} fill="url(#ptGrad)" dot={{ fill: '#ffa502', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active strategies */}
        <div className="lg:col-span-2 rounded-xl p-4" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Target size={13} style={{ color: '#4f88ff' }} />
            <span className="text-xs font-medium text-slate-200">积分策略</span>
          </div>
          <div className="space-y-2">
            {strategies.map(s => (
              <div key={s.name} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: s.active ? 'rgba(0,212,170,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${s.active ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.05)'}` }}>
                <div className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" style={{ background: s.active ? '#00d4aa' : '#334155' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-300">{s.name}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{s.desc}</div>
                </div>
                <span className="text-xs font-semibold flex-shrink-0" style={{ color: '#ffa502' }}>{s.bonus}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active orders */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
          <span className="text-sm font-medium text-slate-200">当前挂单</span>
          <span className="text-xs text-slate-500">{activeOrders.length} 笔活跃</span>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {activeOrders.map(order => (
            <div key={order.id} className="flex items-center gap-4 px-4 py-3">
              <span className="text-xs font-mono text-slate-600">{order.id}</span>
              <span className="text-xs text-slate-300 flex-1">{order.market}</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: order.side === 'YES' ? 'rgba(0,212,170,0.12)' : 'rgba(255,71,87,0.12)', color: order.side === 'YES' ? '#00d4aa' : '#ff4757' }}>
                {order.side}
              </span>
              <span className="text-xs font-mono text-slate-400">{order.price}¢</span>
              <span className="text-xs text-slate-400">${order.size}</span>
              <span className="text-xs font-semibold" style={{ color: '#ffa502' }}>+{order.pts} pts</span>
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: order.status === 'partial' ? 'rgba(79,136,255,0.12)' : 'rgba(255,255,255,0.05)', color: order.status === 'partial' ? '#4f88ff' : '#64748b' }}>
                {order.status === 'partial' ? '部分成交' : '挂单中'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
