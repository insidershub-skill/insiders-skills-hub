'use client'

import { useState } from 'react'
import {
  Brain, TrendingUp, Newspaper, Copy, Layers, Bell,
  ChevronRight, Star, Cpu, Wifi
} from 'lucide-react'

const skills = [
  {
    id: 'rule',
    icon: Brain,
    name: '规则语义分析',
    nameEn: 'Rule Semantic Analysis',
    description: 'AI 深度解析预测市场规则，提取关键条件、时间限制和风险因素，自动评估规则模糊度。',
    color: '#a855f7',
    gradientFrom: '#a855f720',
    gradientTo: '#7c3aed10',
    status: 'active',
    accuracy: 94,
    tags: ['NLP', 'AI', '风险评估'],
    metrics: { label: '今日分析', value: '128 条' },
  },
  {
    id: 'arbitrage',
    icon: TrendingUp,
    name: '套利市场查询',
    nameEn: 'Arbitrage Market Query',
    description: '实时比对 Polymarket、Kalshi、Predict.fun 等多平台价格差异，发现套利机会并计算利润空间。',
    color: '#00d4aa',
    gradientFrom: '#00d4aa20',
    gradientTo: '#06b68a10',
    status: 'active',
    accuracy: 87,
    tags: ['多平台', '实时', '套利'],
    metrics: { label: '套利机会', value: '7 个' },
  },
  {
    id: 'news',
    icon: Newspaper,
    name: '新闻刮刀交易',
    nameEn: 'News Scraper Trading',
    description: '实时抓取路透社、彭博、X等媒体信息流，自动生成情感评分并触发相关市场交易信号。',
    color: '#4f88ff',
    gradientFrom: '#4f88ff20',
    gradientTo: '#3b6fe010',
    status: 'scanning',
    accuracy: 79,
    tags: ['实时', '情感分析', '自动化'],
    metrics: { label: '今日扫描', value: '2,847 条' },
  },
  {
    id: 'copy',
    icon: Copy,
    name: '智能跟单',
    nameEn: 'Smart Copy Trading',
    description: '追踪顶级预测者的交易行为，基于历史胜率、风险偏好和仓位大小，自动复制高收益策略。',
    color: '#ffa502',
    gradientFrom: '#ffa50220',
    gradientTo: '#f59e0b10',
    status: 'active',
    accuracy: 91,
    tags: ['社交', '策略', '跟单'],
    metrics: { label: '跟单收益', value: '+34.2%' },
  },
  {
    id: 'limit',
    icon: Layers,
    name: '挂单积分策略',
    nameEn: 'Limit Order Point Strategy',
    description: '智能挂单策略优化器，通过精准布点获取平台积分奖励，最大化每笔资金的综合回报率。',
    color: '#ff4757',
    gradientFrom: '#ff475720',
    gradientTo: '#dc262610',
    status: 'active',
    accuracy: 88,
    tags: ['积分', '挂单', '优化'],
    metrics: { label: '积分余额', value: '12,450 pts' },
  },
  {
    id: 'signal',
    icon: Bell,
    name: '个性信号推送',
    nameEn: 'Personalized Signal Push',
    description: '根据用户风险偏好和历史交易行为，定制化推送市场信号，支持多渠道实时通知。',
    color: '#06b6d4',
    gradientFrom: '#06b6d420',
    gradientTo: '#0891b210',
    status: 'active',
    accuracy: 85,
    tags: ['推送', '个性化', '信号'],
    metrics: { label: '今日推送', value: '23 条' },
  },
]

const statusConfig = {
  active: { label: 'ACTIVE', color: '#00d4aa', bg: 'rgba(0,212,170,0.1)' },
  scanning: { label: 'SCANNING', color: '#4f88ff', bg: 'rgba(79,136,255,0.1)' },
  paused: { label: 'PAUSED', color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
}

interface SkillsGridProps {
  onSelectSkill: (id: string) => void
}

export default function SkillsGrid({ onSelectSkill }: SkillsGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section className="px-6 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-slate-200">技能模块</h2>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,136,255,0.12)', color: '#4f88ff', border: '1px solid rgba(79,136,255,0.2)' }}>
            6 / 6 在线
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Wifi size={12} />
          <span>实时同步</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, index) => {
          const Icon = skill.icon
          const status = statusConfig[skill.status as keyof typeof statusConfig]
          const isHovered = hoveredId === skill.id

          return (
            <div
              key={skill.id}
              className="skill-card rounded-2xl p-5 cursor-pointer relative overflow-hidden"
              style={{ animationDelay: `${index * 60}ms` }}
              onClick={() => onSelectSkill(skill.id)}
              onMouseEnter={() => setHoveredId(skill.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Background gradient */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 20% 20%, ${skill.gradientFrom}, ${skill.gradientTo}, transparent 70%)`,
                  opacity: isHovered ? 1 : 0,
                }}
              />

              {/* Top row */}
              <div className="flex items-start justify-between mb-4 relative">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${skill.color}15`, border: `1px solid ${skill.color}30` }}
                  >
                    <Icon size={20} style={{ color: skill.color }} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-100">{skill.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{skill.nameEn}</div>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium"
                  style={{ background: status.bg, color: status.color }}
                >
                  {skill.status === 'scanning' ? (
                    <Cpu size={10} className="animate-spin" />
                  ) : (
                    <span className="live-dot" style={{ width: '6px', height: '6px', background: status.color }} />
                  )}
                  {status.label}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 leading-relaxed mb-4 relative">{skill.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4 relative">
                {skill.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-3">
                  {/* Accuracy bar */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500">准确率</span>
                      <span className="text-xs font-semibold" style={{ color: skill.color }}>{skill.accuracy}%</span>
                    </div>
                    <div className="w-20 progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${skill.accuracy}%`, background: skill.color }}
                      />
                    </div>
                  </div>
                  {/* Metric */}
                  <div className="pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-xs text-slate-500">{skill.metrics.label}</div>
                    <div className="text-xs font-semibold text-slate-200">{skill.metrics.value}</div>
                  </div>
                </div>

                {/* Launch button */}
                <div
                  className="flex items-center gap-1 text-xs font-medium transition-all"
                  style={{ color: isHovered ? skill.color : '#64748b' }}
                >
                  启动
                  <ChevronRight size={12} />
                </div>
              </div>

              {/* Corner star for top performers */}
              {skill.accuracy >= 90 && (
                <div className="absolute top-3 right-12">
                  <Star size={10} style={{ color: '#ffa502', fill: '#ffa502' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
