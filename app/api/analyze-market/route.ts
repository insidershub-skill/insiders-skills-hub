import { NextRequest, NextResponse } from 'next/server'

const SILICONFLOW_BASE = 'https://api.siliconflow.cn/v1'
const DEFAULT_MODEL = 'deepseek-ai/DeepSeek-V3'

function extractSlug(url: string): string {
  const eventMatch = url.match(/polymarket\.com\/event\/([^/?#]+)/)
  if (eventMatch) return eventMatch[1]
  const marketMatch = url.match(/polymarket\.com\/market\/([^/?#]+)/)
  if (marketMatch) return marketMatch[1]
  if (/^[a-z0-9-]+$/.test(url.trim())) return url.trim()
  throw new Error('无效的 Polymarket 链接')
}

async function fetchPolymarketEvent(slug: string) {
  const res = await fetch(`https://gamma-api.polymarket.com/events?slug=${slug}`, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`FETCH_FAILED`)
  const data = await res.json()
  if (!Array.isArray(data) || data.length === 0) throw new Error('未找到该市场')
  return data[0]
}

async function callSiliconFlow(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(`${SILICONFLOW_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
      temperature: 0.3,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`硅基流动 API 错误: ${err?.error?.message || res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

function buildPrompt(title: string, ruleText: string): string {
  return `你是一个专业的预测市场分析师，正在分析 Polymarket 的市场结算规则。

市场标题: ${title}
原始结算规则:
${ruleText}

请仔细分析以上规则，并严格按照以下 JSON 格式返回分析结果（只返回 JSON，不要有任何 markdown 代码块标记）：

{
  "translatedRule": "完整的中文翻译（忠实于原文，保持专业术语）",
  "settlementTimes": [
    {
      "original": "规则中原始的时间描述文字",
      "utc8": "转换后的 UTC+8 时间，格式为 YYYY-MM-DD HH:mm（UTC+8）",
      "description": "该时间节点的含义说明"
    }
  ],
  "uncertainties": [
    {
      "clause": "规则中具体的模糊措辞或条款（引用原文）",
      "issue": "为什么这处可能引发争议或有不确定性（中文）",
      "severity": "high 或 medium 或 low",
      "disputeExample": "历史上类似措辞引发的争议案例或场景描述，如无则写暂无已知案例"
    }
  ],
  "resolutionSource": "结算数据来源，如美联社、路透社、官方声明等",
  "disputeRisks": ["潜在争议风险描述1", "潜在争议风险描述2"],
  "umaDisputePatterns": ["可能触发 UMA 争议的情形1", "可能触发 UMA 争议的情形2"],
  "overallClarity": 0到100的整数（100为完全清晰无歧义）,
  "summary": "2-3句话的中文总结，说明该规则的核心要点和主要风险"
}

注意：
- ET 夏令时为 UTC-4，冬令时为 UTC-5，转 UTC+8 需加 12 或 13 小时
- 重点识别 official、widely reported、announced by、if applicable 等易引发争议的措辞
- UMA 争议模式重点关注结算数据来源不唯一、时间窗口模糊、条件定义不明确的情形`
}

export async function POST(req: NextRequest) {
  try {
    const { url, manualRule, manualTitle, apiKey } = await req.json()

    const key = apiKey || process.env.SILICONFLOW_API_KEY
    if (!key) return NextResponse.json({ error: 'NO_API_KEY' }, { status: 400 })

    // 手动粘贴模式
    if (manualRule) {
      const title = manualTitle || '手动输入的市场规则'
      const raw = await callSiliconFlow(key, buildPrompt(title, manualRule))
      let analysis
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        analysis = JSON.parse(jsonMatch ? jsonMatch[0] : raw)
      } catch {
        throw new Error('AI 分析结果解析失败，请重试')
      }
      return NextResponse.json({
        success: true,
        market: { title, slug: '', url: '', endDate: '', volume: '', liquidity: '' },
        originalRule: manualRule,
        analysis,
      })
    }

    // URL 自动抓取模式
    if (!url) return NextResponse.json({ error: '请输入链接或直接粘贴规则文本' }, { status: 400 })

    let event
    try {
      const slug = extractSlug(url)
      event = await fetchPolymarketEvent(slug)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ''
      const isBlocked = msg === 'FETCH_FAILED'
        || msg.includes('fetch')
        || msg.includes('timeout')
        || msg.includes('aborted')
        || msg.includes('ECONNREFUSED')
        || msg.includes('ENOTFOUND')
      if (isBlocked) {
        return NextResponse.json({ error: 'POLYMARKET_BLOCKED' }, { status: 503 })
      }
      throw e
    }

    const ruleText = event.description || event.rules || ''
    const title = event.title || url

    if (!ruleText)
      return NextResponse.json({ error: '该市场暂无可读取的结算规则' }, { status: 404 })

    const raw = await callSiliconFlow(key, buildPrompt(title, ruleText))

    let analysis
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/)
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : raw)
    } catch {
      throw new Error('AI 分析结果解析失败，请重试')
    }

    const slug = extractSlug(url)
    return NextResponse.json({
      success: true,
      market: {
        title: event.title || title,
        slug,
        endDate: event.endDateIso || event.endDate,
        volume: event.volume,
        liquidity: event.liquidity,
        url: `https://polymarket.com/event/${slug}`,
      },
      originalRule: ruleText,
      analysis,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : '分析失败，请重试'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
