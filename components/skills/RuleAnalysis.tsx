'use client'

import { useState } from 'react'
import {
  Brain, Search, AlertTriangle, CheckCircle, Clock,
  ChevronDown, ChevronUp, ExternalLink, Cpu, RefreshCw,
  Shield, FileText, Key, ClipboardPaste
} from 'lucide-react'

interface SettlementTime { original: string; utc8: string; description: string }
interface Uncertainty { clause: string; issue: string; severity: 'high' | 'medium' | 'low'; disputeExample: string }
interface Analysis {
  translatedRule: string
  settlementTimes: SettlementTime[]
  uncertainties: Uncertainty[]
  resolutionSource: string
  disputeRisks: string[]
  umaDisputePatterns: string[]
  overallClarity: number
  summary: string
}
interface MarketInfo { title: string; slug: string; endDate: string; volume: string; liquidity: string; url: string }
interface Result { market: MarketInfo; originalRule: string; analysis: Analysis }

const severityConfig = {
  high: { label: '高风险', color: '#ff4757', bg: 'rgba(255,71,87,0.12)', border: 'rgba(255,71,87,0.3)' },
  medium: { label: '中风险', color: '#ffa502', bg: 'rgba(255,165,2,0.12)', border: 'rgba(255,165,2,0.3)' },
  low: { label: '低风险', color: '#00d4aa', bg: 'rgba(0,212,170,0.12)', border: 'rgba(0,212,170,0.3)' },
}

const steps = ['获取市场数据', '翻译规则文本', '分析不确定性', '生成报告']

export default function RuleAnalysis() {
  const [mode, setMode] = useState<'url' | 'manual'>('url')
  const [url, setUrl] = useState('')
  const [manualRule, setManualRule] = useState('')
  const [manualTitle, setManualTitle] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [showOriginal, setShowOriginal] = useState(false)
  const [expandedUncertainty, setExpandedUncertainty] = useState<number | null>(null)

  const canSubmit = mode === 'url' ? !!url.trim() : !!manualRule.trim()

  const handleAnalyze = async () => {
    if (!canSubmit) return
    setLoading(true)
    setError('')
    setResult(null)
    setCurrentStep(0)

    const stepTimers = [600, 1200, 2000].map((delay, i) =>
      setTimeout(() => setCurrentStep(i + 1), delay)
    )

    try {
      const body = mode === 'url'
        ? { url: url.trim(), apiKey: apiKey.trim() || undefined }
        : { manualRule: manualRule.trim(), manualTitle: manualTitle.trim() || undefined, apiKey: apiKey.trim() || undefined }

      const res = await fetch('/api/analyze-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      stepTimers.forEach(clearTimeout)

      if (!res.ok) {
        if (data.error === 'NO_API_KEY') {
          setError('请填写硅基流动 API Key（点击右上角「API Key」展开输入）')
          setShowApiKey(true)
        } else if (data.error === 'POLYMARKET_BLOCKED') {
          setError('⚠️ Polymarket API 在当前网络无法访问（被墙）。请切换到「手动粘贴」模式，直接粘贴规则文本进行分析。')
          setMode('manual')
        } else {
          setError(data.error || '分析失败，请重试')
        }
        setLoading(false)
        setCurrentStep(-1)
        return
      }

      setCurrentStep(3)
      await new Promise(r => setTimeout(r, 300))
      setResult(data)
    } catch {
      stepTimers.forEach(clearTimeout)
      setError('网络请求失败，请检查连接后重试')
    } finally {
      setLoading(false)
      setCurrentStep(-1)
    }
  }

  const clarityColor = (score: number) =>
    score >= 75 ? '#00d4aa' : score >= 50 ? '#ffa502' : '#ff4757'

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Input card */}
      <div className="rounded-xl p-5" style={{ background: '#0d1421', border: '1px solid rgba(168,85,247,0.25)' }}>
        <div className="flex items-center justify-between mb-4">
          {/* Mode tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <button
              onClick={() => setMode('url')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={mode === 'url'
                ? { background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }
                : { color: '#64748b' }}
            >
              <Search size={11} /> URL 链接
            </button>
            <button
              onClick={() => setMode('manual')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={mode === 'manual'
                ? { background: 'rgba(168,85,247,0.2)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }
                : { color: '#64748b' }}
            >
              <ClipboardPaste size={11} /> 手动粘贴
            </button>
          </div>

          <button
            onClick={() => setShowApiKey(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all"
            style={showApiKey
              ? { background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }
              : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}
          >
            <Key size={11} /> API Key
          </button>
        </div>

        {/* URL mode */}
        {mode === 'url' && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <Search size={14} className="text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                  placeholder="https://polymarket.com/event/will-trump-win-2024"
                  className="flex-1 bg-transparent text-sm text-slate-200 outline-none placeholder-slate-600"
                />
                {url && <button onClick={() => setUrl('')} className="text-slate-600 hover:text-slate-400">✕</button>}
              </div>
              <AnalyzeButton loading={loading} disabled={!canSubmit} onClick={handleAnalyze} />
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-600">示例：</span>
              {[
                ['特朗普2024', 'https://polymarket.com/event/presidential-election-winner-2024'],
                ['Fed降息', 'https://polymarket.com/event/fed-cut-50-bps-in-september-2024'],
              ].map(([label, link]) => (
                <button key={label} onClick={() => setUrl(link)}
                  className="text-xs px-2 py-0.5 rounded transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Manual mode */}
        {mode === 'manual' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <input
                type="text"
                value={manualTitle}
                onChange={e => setManualTitle(e.target.value)}
                placeholder="市场标题（可选）"
                className="flex-1 bg-transparent text-sm text-slate-300 outline-none placeholder-slate-600"
              />
            </div>
            <textarea
              value={manualRule}
              onChange={e => setManualRule(e.target.value)}
              placeholder="粘贴 Polymarket 市场的 Resolution Rule 原文（英文）..."
              rows={6}
              className="w-full px-3 py-2.5 rounded-xl text-xs text-slate-300 outline-none resize-none leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">{manualRule.length} 字符</span>
              <AnalyzeButton loading={loading} disabled={!canSubmit} onClick={handleAnalyze} />
            </div>
          </div>
        )}

        {/* API Key input */}
        {showApiKey && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mt-3 animate-fade-in" style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <Key size={13} style={{ color: '#a855f7' }} className="flex-shrink-0" />
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-xxxx（留空则使用服务端 .env.local 中的 Key）"
              className="flex-1 bg-transparent text-sm text-slate-300 outline-none placeholder-slate-600"
            />
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl p-4 animate-fade-in" style={{ background: '#0d1421', border: '1px solid rgba(168,85,247,0.2)' }}>
          <div className="flex items-center gap-3 mb-4">
            <Cpu size={14} className="animate-spin" style={{ color: '#a855f7' }} />
            <span className="text-sm text-slate-300">正在分析市场规则...</span>
          </div>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{
                  background: i < currentStep ? 'rgba(0,212,170,0.2)' : i === currentStep ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${i < currentStep ? 'rgba(0,212,170,0.5)' : i === currentStep ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)'}`,
                }}>
                  {i < currentStep
                    ? <CheckCircle size={11} style={{ color: '#00d4aa' }} />
                    : i === currentStep
                    ? <Cpu size={11} className="animate-spin" style={{ color: '#a855f7' }} />
                    : <span className="text-xs text-slate-600">{i + 1}</span>}
                </div>
                <span className="text-xs" style={{ color: i < currentStep ? '#00d4aa' : i === currentStep ? '#a855f7' : '#475569' }}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl p-4 flex items-start gap-3 animate-fade-in" style={{ background: 'rgba(255,71,87,0.08)', border: '1px solid rgba(255,71,87,0.3)' }}>
          <AlertTriangle size={15} style={{ color: '#ff4757' }} className="flex-shrink-0 mt-0.5" />
          <span className="text-sm leading-relaxed" style={{ color: '#ff4757' }}>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          {/* Market header */}
          <div className="rounded-xl p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(79,136,255,0.06))', border: '1px solid rgba(168,85,247,0.25)' }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-base font-semibold text-slate-100 mb-2 leading-snug">{result.market.title}</div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                  {result.market.endDate && (
                    <span className="flex items-center gap-1"><Clock size={10} />结算日: {new Date(result.market.endDate).toLocaleDateString('zh-CN')}</span>
                  )}
                  {result.market.volume && (
                    <span>成交量: ${Number(result.market.volume).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  )}
                  {result.analysis.resolutionSource && (
                    <span className="flex items-center gap-1"><Shield size={10} />数据源: {result.analysis.resolutionSource}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="text-3xl font-bold font-mono" style={{ color: clarityColor(result.analysis.overallClarity) }}>
                  {result.analysis.overallClarity}
                </div>
                <div className="text-xs text-slate-500">清晰度</div>
                <div className="w-12 progress-bar mt-1">
                  <div className="progress-fill" style={{ width: `${result.analysis.overallClarity}%`, background: clarityColor(result.analysis.overallClarity) }} />
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-slate-400 leading-relaxed p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {result.analysis.summary}
            </div>
            {result.market.url && (
              <a href={result.market.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs hover:opacity-80 transition-opacity" style={{ color: '#a855f7' }}>
                <ExternalLink size={11} /> 在 Polymarket 查看
              </a>
            )}
          </div>

          {/* Translated rule */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setShowOriginal(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
              style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <FileText size={13} style={{ color: '#4f88ff' }} />
                <span className="text-sm font-medium text-slate-200">规则中文翻译</span>
              </div>
              {showOriginal ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
            </button>
            <div className="px-4 py-3">
              <p className="text-sm text-slate-300 leading-relaxed">{result.analysis.translatedRule}</p>
            </div>
            {showOriginal && (
              <div className="px-4 pb-3 pt-0">
                <div className="text-xs text-slate-500 mb-1">原文</div>
                <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{result.originalRule}</p>
              </div>
            )}
          </div>

          {/* Settlement times */}
          {result.analysis.settlementTimes?.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,165,2,0.2)' }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(255,165,2,0.05)', borderBottom: '1px solid rgba(255,165,2,0.15)' }}>
                <Clock size={13} style={{ color: '#ffa502' }} />
                <span className="text-sm font-medium" style={{ color: '#ffa502' }}>结算时间（UTC+8）</span>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {result.analysis.settlementTimes.map((t, i) => (
                  <div key={i} className="px-4 py-3 flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-500 mb-1">原文: <span className="italic">{t.original}</span></div>
                      <div className="text-xs text-slate-400">{t.description}</div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-sm font-bold font-mono" style={{ color: '#ffa502' }}>{t.utc8}</div>
                      <div className="text-xs text-slate-600">UTC+8</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uncertainties */}
          {result.analysis.uncertainties?.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <AlertTriangle size={13} style={{ color: '#ff4757' }} />
                <span className="text-sm font-medium text-slate-200">不确定性分析</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,71,87,0.12)', color: '#ff4757' }}>
                  {result.analysis.uncertainties.length} 处
                </span>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {result.analysis.uncertainties.map((u, i) => {
                  const sev = severityConfig[u.severity] || severityConfig.medium
                  const isExpanded = expandedUncertainty === i
                  return (
                    <div key={i}>
                      <button onClick={() => setExpandedUncertainty(isExpanded ? null : i)}
                        className="w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 mt-0.5"
                          style={{ background: sev.bg, border: `1px solid ${sev.border}`, color: sev.color }}>
                          {sev.label}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-400 italic mb-1">"{u.clause}"</div>
                          <div className="text-xs text-slate-300">{u.issue}</div>
                        </div>
                        {isExpanded ? <ChevronUp size={12} className="text-slate-600 flex-shrink-0" /> : <ChevronDown size={12} className="text-slate-600 flex-shrink-0" />}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-3 ml-16 animate-fade-in">
                          <div className="text-xs p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                            <span className="font-medium text-slate-400">历史争议参考：</span> {u.disputeExample}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* UMA dispute patterns */}
          {result.analysis.umaDisputePatterns?.length > 0 && (
            <div className="rounded-xl p-4" style={{ background: 'rgba(79,136,255,0.06)', border: '1px solid rgba(79,136,255,0.2)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={13} style={{ color: '#4f88ff' }} />
                <span className="text-sm font-medium" style={{ color: '#4f88ff' }}>UMA 争议风险预测</span>
              </div>
              <div className="space-y-2">
                {result.analysis.umaDisputePatterns.map((p, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: 'rgba(79,136,255,0.2)', color: '#4f88ff' }}>{i + 1}</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={() => { setResult(null); setUrl(''); setManualRule(''); setManualTitle('') }}
            className="text-xs text-slate-500 flex items-center gap-1 hover:text-slate-300 transition-colors">
            <RefreshCw size={11} /> 分析新规则
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !result && !error && (
        <div className="rounded-xl p-12 flex flex-col items-center justify-center text-center"
          style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.06)' }}>
          <Brain size={40} className="mb-4 opacity-20" style={{ color: '#a855f7' }} />
          <div className="text-sm text-slate-500 mb-1">
            {mode === 'url' ? '输入 Polymarket 链接开始分析' : '粘贴 Resolution Rule 原文开始分析'}
          </div>
          <div className="text-xs text-slate-600">自动翻译规则 · 提取结算时间 · 识别争议风险</div>
        </div>
      )}
    </div>
  )
}

function AnalyzeButton({ loading, disabled, onClick }: { loading: boolean; disabled: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex-shrink-0"
      style={{
        background: disabled ? 'rgba(168,85,247,0.2)' : 'linear-gradient(135deg, #a855f7, #7c3aed)',
        color: disabled ? 'rgba(255,255,255,0.4)' : 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}>
      {loading ? <Cpu size={14} className="animate-spin" /> : <Brain size={14} />}
      {loading ? '分析中' : '开始分析'}
    </button>
  )
}
