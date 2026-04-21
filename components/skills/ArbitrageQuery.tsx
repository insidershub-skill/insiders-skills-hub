'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, RefreshCw, DollarSign, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const markets = [
  { name: '特朗普赢得2024总统大选', category: '美国政治', hot: true },
  { name: 'Fed 2024年内降息超3次', category: '宏观经济', hot: false },
  { name: '以太坊 ETF 在美国批准', category: '加密货币', hot: true },
  { name: '乌克兰停战协议 2024', category: '地缘政治', hot: false },
]

const platforms: Record<string, { yes: number; no: number; volume: string; fee: number }[]> = {
  '特朗普赢得2024总统大选': [
    { yes: 58.3, no: 41.7, volume: '$4.2M', fee: 2 },
    { yes: 56.1, no: 43.9, volume: '$1.8M', fee: 1.5 },
    { yes: 61.2, no: 38.8, volume: '$820K', fee: 0 },
    { yes: 55.0, no: 45.0, volume: '$640K', fee: 3 },
  ],
  'Fed 2024年内降息超3次': [
    { yes: 34.7, no: 65.3, volume: '$2.1M', fee: 2 },
    { yes: 36.2, no: 63.8, volume: '$980K', fee: 1.5 },
    { yes: 31.5, no: 68.5, volume: '$340K', fee: 0 },
    { yes: 35.0, no: 65.0, volume: '$210K', fee: 3 },
  ],
  '以太坊 ETF 在美国批准': [
    { yes: 72.4, no: 27.6, volume: '$3.6M', fee: 2 },
    { yes: 69.8, no: 30.2, volume: '$1.2M', fee: 1.5 },
    { yes: 75.0, no: 25.0, volume: '$560K', fee: 0 },
    { yes: 71.0, no: 29.0, volume: '$430K', fee: 3 },
  ],
  '乌克兰停战协议 2024': [
    { yes: 22.1, no: 77.9, volume: '$1.4M', fee: 2 },
    { yes: 24.5, no: 75.5, volume: '$620K', fee: 1.5 },
    { yes: 20.3, no: 79.7, volume: '$180K', fee: 0 },
    { yes: 23.0, no: 77.0, volume: '$95K', fee: 3 },
  ],
}

const platformNames = ['Polymarket', 'Kalshi', 'Manifold', 'PredictIt']
const platformColors = ['#00d4aa', '#4f88ff', '#a855f7', '#ffa502']

export default function ArbitrageQuery() {
  const [selectedMarket, setSelectedMarket] = useState(markets[0].name)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState('刚刚')

  const data = platforms[selectedMarket]
  const prices = data.map(d => d.yes)
  const maxYes = Math.max(...prices)
  const minYes = Math.min(...prices)
  const spread = (maxYes - minYes).toFixed(1)
  const hasArb = parseFloat(spread) > 3

  const chartData = platformNames.map((name, i) => ({
    name,
    YES: data[i].yes,
    NO: data[i].no,
  }))

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdate('刚刚')
    }, 1200)
  }

  const bestBuy = data.reduce((min, d, i) => d.yes < data[min].yes ? i : min, 0)
  const bestSell = data.reduce((max, d, i) => d.yes > data[max].yes ? i : max, 0)

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Market selector */}
      <div className="flex flex-wrap gap-2">
        {markets.map(m => (
          <button
            key={m.name}
            onClick={() => setSelectedMarket(m.name)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all"
            style={
              selectedMarket === m.name
                ? { background: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.4)', color: '#00d4aa' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }
            }
          >
            {m.hot && <span style={{ color: '#ff4757' }}>🔥</span>}
            {m.name}
          </button>
        ))}
      </div>

      {/* Arbitrage alert */}
      {hasArb && (
        <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: 'rgba(0,212,170,0.08)', border: '1px solid rgba(0,212,170,0.3)' }}>
          <Zap size={16} style={{ color: '#00d4aa' }} />
          <div className="flex-1">
            <span className="text-sm font-semibold" style={{ color: '#00d4aa' }}>套利机会检测到！</span>
            <span className="text-xs text-slate-400 ml-2">
              最大价差 <span className="font-mono font-bold" style={{ color: '#00d4aa' }}>{spread}¢</span>
              ，在 {platformNames[bestSell]} 买 YES，在 {platformNames[bestBuy]} 买 NO
            </span>
          </div>
          <div className="text-sm font-bold" style={{ color: '#00d4aa' }}>
            +{(parseFloat(spread) * 10).toFixed(0)} USDC/100 shares
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Table */}
        <div className="lg:col-span-3 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <span className="text-sm font-medium text-slate-200">多平台价格对比</span>
            <button onClick={handleRefresh} className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
              <RefreshCw size={11} className={isRefreshing ? 'animate-spin' : ''} />
              {lastUpdate}更新
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <th className="text-left px-4 py-2 text-xs font-medium text-slate-500">平台</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">YES 价</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">NO 价</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">成交量</th>
                <th className="text-right px-4 py-2 text-xs font-medium text-slate-500">手续费</th>
              </tr>
            </thead>
            <tbody>
              {platformNames.map((name, i) => {
                const row = data[i]
                const isBest = i === bestSell
                const isWorst = i === bestBuy
                return (
                  <tr
                    key={name}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: isBest ? 'rgba(0,212,170,0.05)' : isWorst ? 'rgba(255,71,87,0.04)' : 'transparent',
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: platformColors[i] }} />
                        <span className="text-sm text-slate-300">{name}</span>
                        {isBest && <span className="text-xs px-1 rounded" style={{ background: 'rgba(0,212,170,0.15)', color: '#00d4aa' }}>最高</span>}
                        {isWorst && <span className="text-xs px-1 rounded" style={{ background: 'rgba(255,71,87,0.12)', color: '#ff4757' }}>最低</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm font-semibold" style={{ color: '#00d4aa' }}>{row.yes}¢</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-mono text-sm" style={{ color: '#ff4757' }}>{row.no}¢</span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-slate-400">{row.volume}</td>
                    <td className="px-4 py-3 text-right text-xs text-slate-400">{row.fee}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 rounded-xl p-4" style={{ background: '#0d1421', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="text-xs font-medium text-slate-400 mb-4">YES 价格分布</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 80]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                formatter={(v: number) => [`${v}¢`, 'YES Price']}
              />
              <Bar dataKey="YES" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={platformColors[i]} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-xs text-slate-500">最大价差</div>
              <div className="text-lg font-bold font-mono" style={{ color: hasArb ? '#00d4aa' : '#ffa502' }}>{spread}¢</div>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <div className="text-xs text-slate-500">估算利润</div>
              <div className="text-lg font-bold font-mono" style={{ color: '#4f88ff' }}>
                {(parseFloat(spread) * 10).toFixed(0)}¢
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
