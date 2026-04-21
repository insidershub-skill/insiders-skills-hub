'use client'

import { useState, useEffect } from 'react'
import { Bell, BellRing, Settings, CheckCircle, X, Smartphone, Mail, MessageSquare, Zap, Clock, TrendingUp } from 'lucide-react'

const signals = [
  {
    id: 1,
    type: 'BUY',
    market: '以太坊 ETF 美国批准',
    platform: 'Kalshi',
    confidence: 91,
    currentPrice: 69,
    targetPrice: 82,
    timeframe: '7天内',
    reason: 'SEC内部文件显示倾向批准，多位委员公开支持',
    tags: ['加密', '监管', '高置信'],
    time: '2分钟前',
    urgent: true,
  },
  {
    id: 2,
    type: 'SELL',
    market: 'Fed 2024 Q2 降息预期',
    platform: 'Polymarket',
    confidence: 87,
    currentPrice: 34,
    targetPrice: 22,
    timeframe: '3天内',
    reason: '最新CPI数据超预期，鲍威尔讲话偏鹰派',
    tags: ['宏观', '美联储', '高置信'],
    time: '15分钟前',
    urgent: false,
  },
  {
    id: 3,
    type: 'BUY',
    market: '特朗普赢得2024总统大选',
    platform: 'Polymarket',
    confidence: 74,
    currentPrice: 57,
    targetPrice: 64,
    timeframe: '30天内',
    reason: '摇摆州最新民调改善，筹款数据领先',
    tags: ['政治', '大选', '中置信'],
    time: '1小时前',
    urgent: false,
  },
  {
    id: 4,
    type: 'WATCH',
    market: '黄金价格年内突破2500美元',
    platform: 'Manifold',
    confidence: 62,
    currentPrice: 41,
    targetPrice: 55,
    timeframe: '60天内',
    reason: '地缘政治风险升温，美元走弱趋势',
    tags: ['商品', '地缘', '中置信'],
    time: '2小时前',
    urgent: false,
  },
  {
    id: 5,
    type: 'BUY',
    market: 'OpenAI 2024年内IPO',
    platform: 'Metaculus',
    confidence: 68,
    currentPrice: 28,
    targetPrice: 38,
    timeframe: '90天内',
    reason: '最新估值谈判进展，投行路演传闻',
    tags: ['AI', '科技', '中置信'],
    time: '3小时前',
    urgent: false,
  },
]

const signalTypeConfig = {
  BUY: { color: '#00d4aa', bg: 'rgba(0,212,170,0.12)', border: 'rgba(0,212,170,0.35)', label: '做多' },
  SELL: { color: '#ff4757', bg: 'rgba(255,71,87,0.12)', border: 'rgba(255,71,87,0.35)', label: '做空' },
  WATCH: { color: '#ffa502', bg: 'rgba(255,165,2,0.12)', border: 'rgba(255,165,2,0.35)', label: '观望' },
}

const channels = [
  { icon: Smartphone, label: '手机推送', key: 'mobile', active: true },
  { icon: Mail, label: '邮件通知', key: 'email', active: true },
  { icon: MessageSquare, label: 'Telegram', key: 'telegram', active: false },
]

const filters = [
  { label: '最低置信度', options: ['50%', '65%', '75%', '85%'], selected: '65%' },
  { label: '信号类型', options: ['全部', 'BUY', 'SELL', 'WATCH'], selected: '全部' },
  { label: '平台', options: ['全部', 'Polymarket', 'Kalshi', 'Manifold'], selected: '全部' },
]

export default function SignalPush() {
  const [dismissed, setDismissed] = useState<Set<number>>(new Set())
  const [activeChannels, setActiveChannels] = useState(new Set(['mobile', 'email']))
  const [showSettings, setShowSettings] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const showToast = (msg: string) => {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const toggleChannel = (key: string) => {
    setActiveChannels(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      showToast(next.has(key) ? `已开启 ${key} 推送` : `已关闭 ${key} 推送`)
      return next
    })
  }

  const visibleSignals = signals.filter(s => !dismissed.has(s.id))

  return (
    <div className="flex flex-col gap-5 animate-fade-in relative">
      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl toast-enter" style={{ background: '#111827', border: '1px solid rgba(0,212,170,0.3)', color: '#00d4aa' }}>
          ✓ {toastMsg}
        </div>
      )}

      {/* Header controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)', color: '#00d4aa' }}>
            <span className="live-dot" style={{ width: '6px', height: '6px' }} />
            实时推送
          </div>
          <span className="text-sm text-slate-400">今日推送 <span className="font-semibold text-slate-200">23</span> 条</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Channel toggles */}
          {channels.map(ch => {
            const Icon = ch.icon
            const isActive = activeChannels.has(ch.key)
            return (
              <button
                key={ch.key}
                onClick={() => toggleChannel(ch.key)}
                title={ch.label}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                style={
                  isActive
                    ? { background: 'rgba(79,136,255,0.15)', border: '1px solid rgba(79,136,255,0.3)', color: '#4f88ff' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#475569' }
                }
              >
                <Icon size={12} />
                <span className="hidden sm:inline">{ch.label}</span>
              </button>
            )
          })}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
            style={{ background: showSettings ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${showSettings ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.08)'}`, color: showSettings ? '#a855f7' : '#64748b' }}
          >
            <Settings size={12} />
            筛选器
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showSettings && (
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl animate-slide-up" style={{ background: '#0d1421', border: '1px solid rgba(168,85,247,0.2)' }}>
          {filters.map(f => (
            <div key={f.label}>
              <div className="text-xs text-slate-500 mb-2">{f.label}</div>
              <div className="flex flex-wrap gap-1">
                {f.options.map(opt => (
                  <button
                    key={opt}
                    className="px-2 py-1 rounded-lg text-xs transition-all"
                    style={
                      opt === f.selected
                        ? { background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }
                        : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'BUY 信号', value: '3', color: '#00d4aa' },
          { label: 'SELL 信号', value: '1', color: '#ff4757' },
          { label: 'WATCH 信号', value: '1', color: '#ffa502' },
          { label: '平均置信度', value: '76%', color: '#a855f7' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Signals list */}
      <div className="space-y-3">
        {visibleSignals.map(signal => {
          const cfg = signalTypeConfig[signal.type as keyof typeof signalTypeConfig]
          const priceChange = signal.targetPrice - signal.currentPrice
          const pctChange = ((priceChange / signal.currentPrice) * 100).toFixed(1)

          return (
            <div
              key={signal.id}
              className="rounded-xl p-4 relative transition-all"
              style={{
                background: signal.urgent ? `${cfg.bg.replace('0.12', '0.08')}` : '#0d1421',
                border: signal.urgent ? `1px solid ${cfg.border}` : '1px solid rgba(255,255,255,0.07)',
              }}
            >
              {signal.urgent && (
                <div className="absolute top-3 left-3">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                    🔔 紧急
                  </span>
                </div>
              )}

              <button
                onClick={() => setDismissed(prev => new Set(prev).add(signal.id))}
                className="absolute top-3 right-3 text-slate-600 hover:text-slate-400 transition-colors"
              >
                <X size={14} />
              </button>

              <div className={`flex items-start gap-4 ${signal.urgent ? 'mt-7' : ''}`}>
                {/* Signal type */}
                <div
                  className="w-14 text-center py-2 rounded-xl flex-shrink-0"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                  <div className="text-sm font-bold" style={{ color: cfg.color }}>{signal.type}</div>
                  <div className="text-xs" style={{ color: cfg.color, opacity: 0.7 }}>{cfg.label}</div>
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <div className="font-semibold text-sm text-slate-100">{signal.market}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{signal.platform} · {signal.time}</div>
                    </div>
                    {/* Price target */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-slate-500">目标价</div>
                      <div className="font-bold font-mono" style={{ color: cfg.color }}>{signal.targetPrice}¢</div>
                      <div className="text-xs" style={{ color: priceChange > 0 ? '#00d4aa' : '#ff4757' }}>
                        {priceChange > 0 ? '+' : ''}{pctChange}%
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="text-xs text-slate-400 leading-relaxed mb-2">{signal.reason}</div>

                  {/* Bottom row */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Tags */}
                    {signal.tags.map(tag => (
                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={10} /> {signal.timeframe}
                    </span>
                    {/* Confidence */}
                    <div className="ml-auto flex items-center gap-2">
                      <div className="w-16 progress-bar">
                        <div className="progress-fill" style={{ width: `${signal.confidence}%`, background: signal.confidence >= 85 ? '#00d4aa' : signal.confidence >= 70 ? '#ffa502' : '#64748b' }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: signal.confidence >= 85 ? '#00d4aa' : signal.confidence >= 70 ? '#ffa502' : '#64748b', fontFamily: 'monospace' }}>
                        {signal.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {visibleSignals.length === 0 && (
          <div className="rounded-xl p-12 text-center" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Bell size={32} className="mx-auto mb-3 text-slate-600" />
            <div className="text-sm text-slate-500">所有信号已查看</div>
            <button onClick={() => setDismissed(new Set())} className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              重置
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
