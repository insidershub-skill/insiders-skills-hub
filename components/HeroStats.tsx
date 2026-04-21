'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, Target, Zap, BarChart2, Users } from 'lucide-react'

const stats = [
  { icon: DollarSign, label: '总持仓价值', value: 4444, prefix: '$', suffix: '', color: '#00d4aa', change: '+12.4%' },
  { icon: Target, label: '活跃市场', value: 1427, prefix: '', suffix: ' 个', color: '#4f88ff', change: '+3' },
  { icon: TrendingUp, label: '今日胜率', value: 72.2, prefix: '', suffix: '%', color: '#a855f7', change: '+5.1%' },
  { icon: BarChart2, label: '7日收益', value: 18420, prefix: '+$', suffix: '', color: '#00d4aa', change: '+7.3%' },
  { icon: Zap, label: 'Skills 执行次数', value: 1284, prefix: '', suffix: ' 次', color: '#ffa502', change: '今日' },
  { icon: Users, label: '跟单用户数', value: 3621, prefix: '', suffix: '', color: '#4f88ff', change: '+124' },
]

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function StatItem({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const count = useCountUp(stat.value, 1200 + index * 100)
  const Icon = stat.icon

  return (
    <div
      className="relative overflow-hidden rounded-xl p-4 group cursor-default"
      style={{
        background: 'linear-gradient(135deg, #0d1421 0%, #0a1019 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        transition: 'all 0.25s ease',
        animationDelay: `${index * 80}ms`,
      }}
    >
      {/* Accent line top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}40, transparent)` }} />

      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
          <Icon size={15} style={{ color: stat.color }} />
        </div>
        <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,212,170,0.1)', color: '#00d4aa' }}>
          {stat.change}
        </span>
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'JetBrains Mono, monospace', color: stat.color }}>
          {stat.prefix}{stat.value % 1 !== 0 ? count.toFixed(1) : count.toLocaleString()}{stat.suffix}
        </div>
        <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" style={{ background: `radial-gradient(circle at 50% 0%, ${stat.color}06 0%, transparent 70%)` }} />
    </div>
  )
}

export default function HeroStats({ onMarketsClick }: { onMarketsClick?: () => void }) {
  return (
    <section className="px-6 pt-6 pb-2">
      {/* Title row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            Skills Hub{' '}
            <span className="gradient-text">Intelligence</span>
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">6 个 AI 技能模块 · 全天候预测市场分析</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa' }}>
            <span className="live-dot" style={{ width: '6px', height: '6px' }} />
            所有系统正常
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <div key={stat.label}
            onClick={stat.label === '活跃市场' ? onMarketsClick : undefined}
            style={{ cursor: stat.label === '活跃市场' ? 'pointer' : 'default' }}>
            <StatItem stat={stat} index={i} />
          </div>
        ))}
      </div>
    </section>
  )
}
