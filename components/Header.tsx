'use client'

import { useState, useEffect } from 'react'
import { Activity, Bell, ChevronDown, Settings, Zap } from 'lucide-react'

interface HeaderProps {
  onBack?: () => void
  activeSkill?: string | null
  onMarketsClick?: () => void
  currentView?: string
}

export default function Header({ onBack, activeSkill, onMarketsClick, currentView }: HeaderProps) {
  const [time, setTime] = useState('')
  const [notifications] = useState(3)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: 'rgba(8, 12, 20, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mr-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            返回 Hub
          </button>
        )}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00d4aa, #4f88ff)' }}
          >
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            INSIDERS
            <span className="ml-1 text-xs font-normal px-1.5 py-0.5 rounded" style={{ background: 'rgba(79,136,255,0.15)', color: '#4f88ff', border: '1px solid rgba(79,136,255,0.3)' }}>
              BETA
            </span>
          </span>
          {activeSkill && (
            <span className="text-slate-500 mx-2">/</span>
          )}
          {activeSkill && (
            <span className="text-sm text-slate-300">{activeSkill}</span>
          )}
        </div>
      </div>

      {/* Center: Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {[
          { label: 'Skills Hub', view: 'home' },
          { label: '市场概览', view: 'markets' },
          { label: '我的持仓', view: '' },
          { label: '绩效分析', view: '' },
        ].map(({ label, view }) => {
          const isActive = view === 'markets' ? currentView === 'markets' : view === 'home' ? currentView !== 'markets' : false
          return (
            <button
              key={label}
              onClick={view === 'markets' ? onMarketsClick : view === 'home' ? onBack : undefined}
              className="px-3 py-1.5 text-sm rounded-lg transition-colors"
              style={isActive ? { background: 'rgba(79,136,255,0.12)', color: '#4f88ff' } : { color: '#94a3b8' }}
            >
              {label}
            </button>
          )
        })}
      </nav>

      {/* Right: Status + User */}
      <div className="flex items-center gap-3">
        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.2)' }}>
          <span className="live-dot" />
          <span className="text-xs font-medium" style={{ color: '#00d4aa' }}>LIVE</span>
          <span className="text-xs text-slate-500 font-mono">{time}</span>
        </div>

        {/* Network */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
          <Activity size={12} style={{ color: '#00d4aa' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>Polymarket</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <Bell size={15} />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-xs font-bold rounded-full flex items-center justify-center" style={{ background: '#ff4757', color: 'white' }}>
              {notifications}
            </span>
          )}
        </button>

        {/* User */}
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #00d4aa, #4f88ff)' }}>
            I
          </div>
          <span className="hidden md:block text-sm text-slate-300">insider_01</span>
          <ChevronDown size={12} className="text-slate-500" />
        </button>
      </div>
    </header>
  )
}
