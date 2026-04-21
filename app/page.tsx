'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import HeroStats from '@/components/HeroStats'
import SkillsGrid from '@/components/SkillsGrid'
import MarketsView from '@/components/MarketsView'
import RuleAnalysis from '@/components/skills/RuleAnalysis'
import ArbitrageQuery from '@/components/skills/ArbitrageQuery'
import NewsTrading from '@/components/skills/NewsTrading'
import CopyTrading from '@/components/skills/CopyTrading'
import LimitOrderStrategy from '@/components/skills/LimitOrderStrategy'
import SignalPush from '@/components/skills/SignalPush'

const skillMeta: Record<string, { name: string; nameEn: string; color: string; description: string }> = {
  rule: { name: '规则语义分析', nameEn: 'Rule Semantic Analysis', color: '#a855f7', description: '深度解析市场规则文本，提取条件、时间约束和风险因素' },
  arbitrage: { name: '套利市场查询', nameEn: 'Arbitrage Market Query', color: '#00d4aa', description: '跨平台价格比对，发现实时套利机会' },
  news: { name: '新闻刮刀交易', nameEn: 'News Scraper Trading', color: '#4f88ff', description: '实时抓取全球媒体，自动生成交易信号' },
  copy: { name: '智能跟单', nameEn: 'Smart Copy Trading', color: '#ffa502', description: '追踪顶级预测者，自动复制高收益策略' },
  limit: { name: '挂单积分策略', nameEn: 'Limit Order Point Strategy', color: '#ff4757', description: '优化挂单策略以最大化积分奖励' },
  signal: { name: '个性信号推送', nameEn: 'Personalized Signal Push', color: '#06b6d4', description: '定制化高置信度信号，多渠道实时通知' },
}

const skillComponents: Record<string, React.ComponentType> = {
  rule: RuleAnalysis,
  arbitrage: ArbitrageQuery,
  news: NewsTrading,
  copy: CopyTrading,
  limit: LimitOrderStrategy,
  signal: SignalPush,
}

type View = 'home' | 'markets' | string // string covers skill ids

export default function Home() {
  const [view, setView] = useState<View>('home')

  const goHome = () => setView('home')
  const goMarkets = () => setView('markets')

  const isSkill = view !== 'home' && view !== 'markets'
  const meta = isSkill ? skillMeta[view] : null
  const SkillComponent = isSkill ? skillComponents[view] : null

  return (
    <div className="min-h-screen" style={{
      background: '#080c14',
      backgroundImage: 'linear-gradient(rgba(79,136,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,136,255,0.03) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}>
      <Header
        onBack={view !== 'home' ? goHome : undefined}
        activeSkill={isSkill ? meta?.name : view === 'markets' ? '市场概览' : undefined}
        onMarketsClick={goMarkets}
        currentView={view}
      />

      {/* Home view */}
      {view === 'home' && (
        <main>
          <HeroStats onMarketsClick={goMarkets} />
          <SkillsGrid onSelectSkill={setView} />
          <footer className="px-6 py-6 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <span className="font-semibold" style={{ color: '#00d4aa' }}>INSIDERS</span>
                <span>Prediction Market Intelligence · Beta v0.1</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Polymarket</span><span>Kalshi</span><span>Manifold</span><span>Metaculus</span>
              </div>
            </div>
          </footer>
        </main>
      )}

      {/* Markets view */}
      {view === 'markets' && (
        <main className="animate-fade-in">
          <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-100">市场概览</h1>
                  <span className="text-sm px-2 py-0.5 rounded-lg"
                    style={{ background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)', color: '#00d4aa' }}>
                    Polymarket Live
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs"
                    style={{ background: 'rgba(0,212,170,0.08)', color: '#00d4aa' }}>
                    <span className="live-dot" style={{ width: '5px', height: '5px' }} />
                    LIVE
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">浏览全部 Polymarket 活跃市场 · 搜索 · 分页</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <MarketsView />
          </div>
        </main>
      )}

      {/* Skill view */}
      {isSkill && SkillComponent && (
        <main className="animate-fade-in">
          <div className="px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-slate-100">{meta?.name}</h1>
                  <span className="text-sm px-2 py-0.5 rounded-lg"
                    style={{ background: `${meta?.color}15`, border: `1px solid ${meta?.color}30`, color: meta?.color }}>
                    {meta?.nameEn}
                  </span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs"
                    style={{ background: 'rgba(0,212,170,0.08)', color: '#00d4aa' }}>
                    <span className="live-dot" style={{ width: '5px', height: '5px' }} />
                    LIVE
                  </div>
                </div>
                <p className="text-sm text-slate-500 mt-1">{meta?.description}</p>
              </div>
              {/* Quick skill switcher */}
              <div className="ml-auto hidden md:flex gap-2 flex-wrap">
                {Object.entries(skillMeta).map(([id, m]) => (
                  <button key={id} onClick={() => setView(id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs transition-all"
                    style={id === view
                      ? { background: `${m.color}15`, border: `1px solid ${m.color}35`, color: m.color }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#64748b' }}>
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <SkillComponent />
          </div>
        </main>
      )}
    </div>
  )
}
