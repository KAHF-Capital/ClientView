# ClientView Pro - Implementation Plan

## Current State Analysis

### ✅ What Exists
1. **Basic PowerPoint Processing**
   - Client-side parsing with JSZip & xml2js
   - Server-side export with pptxgenjs
   - Variable detection (names, dates, currency, percentages)
   - Basic slide categorization

2. **UI Components**
   - Home page with drag-and-drop upload
   - Three-panel editor layout
   - Basic slide library
   - Variable editor
   - Chart editor (basic)

3. **Infrastructure**
   - Next.js 14 with App Router
   - TypeScript
   - Tailwind CSS + shadcn/ui
   - Vercel deployment ready

### ❌ Critical Gaps Identified
1. **PowerPoint Export** - Very basic, loses all formatting
2. **No Canvas Editor** - Just static views
3. **No Financial Charts** - ChartEditor exists but no real chart library
4. **Limited AI Integration** - No actual AI features implemented
5. **No Data Integration** - No real market data
6. **No Authentication** - No user management
7. **No Templates** - Template structure exists but no actual templates
8. **No Calculations** - No financial math

---

## Phase 1: Enhanced PowerPoint Engine (CRITICAL - Start Here)

### Week 1-2: Improve PowerPoint Export

**Current Problem**: 
The export API (```1:96:ClientViewV/app/api/export-pptx/route.ts```) creates very basic slides with no formatting, images, or charts.

**Solution**: Enhance pptxgenjs implementation

```typescript
// lib/pptx-exporter-enhanced.ts - NEW FILE TO CREATE
import PptxGenJS from 'pptxgenjs'

interface EnhancedExportOptions {
  slides: ParsedSlide[]
  replacements: VariableReplacement
  branding: BrandingConfig
  fileName: string
}

export async function exportEnhancedPresentation(options: EnhancedExportOptions): Promise<Buffer> {
  const pptx = new PptxGenJS()
  
  // Enhanced properties
  pptx.author = options.branding.author || 'ClientView'
  pptx.company = options.branding.company || ''
  pptx.title = options.fileName.replace('.pptx', '')
  pptx.subject = 'Investment Proposal'
  pptx.revision = 1
  
  // Define master layout
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 })
  pptx.layout = 'WIDE'
  
  // Slide backgrounds
  const bgColor = options.branding.backgroundColor || { color: 'ffffff' }
  
  for (const slideData of options.slides) {
    const slide = pptx.addSlide()
    
    // Apply background
    slide.background = bgColor
    
    // Add logo if exists
    if (options.branding.logo) {
      slide.addImage({
        data: options.branding.logo,
        x: 0.1,
        y: 0.1,
        w: 1.5,
        h: 0.5
      })
    }
    
    // Enhanced title with better formatting
    const title = applyReplacements(slideData.title, options.replacements, slideData.variables)
    slide.addText(title, {
      x: 0.5,
      y: 0.3,
      w: 10,
      h: 0.8,
      fontSize: 36,
      bold: true,
      color: '163020',
      fontFace: options.branding.fontFamily || 'Arial',
      align: 'left',
      valign: 'top'
    })
    
    // Enhanced content with bullet points
    const content = applyReplacements(slideData.textContent, options.replacements, slideData.variables)
    const lines = parseContentToBullets(content)
    
    slide.addText(lines, {
      x: 0.5,
      y: 1.5,
      w: 10,
      h: 5,
      fontSize: 18,
      color: '1f2937',
      fontFace: options.branding.fontFamily || 'Arial',
      bullet: { type: 'numbered' },
      valign: 'top'
    })
    
    // Add charts if data exists
    if (slideData.charts && slideData.charts.length > 0) {
      for (const chart of slideData.charts) {
        await addChartToSlide(slide, chart)
      }
    }
    
    // Add images if exist
    if (slideData.images && slideData.images.length > 0) {
      for (const img of slideData.images) {
        slide.addImage({
          data: img.data,
          x: img.x || 6,
          y: img.y || 1.5,
          w: img.width || 5,
          h: img.height || 5
        })
      }
    }
    
    // Footer with branding
    if (options.branding.footer) {
      slide.addText(options.branding.footer, {
        x: 0.5,
        y: 7,
        w: 12,
        h: 0.3,
        fontSize: 10,
        color: '6b7280',
        align: 'center'
      })
    }
    
    // Slide number
    slide.addText(`${slideData.index + 1}`, {
      x: 11.5,
      y: 7,
      w: 1,
      h: 0.3,
      fontSize: 12,
      color: '9ca3af',
      align: 'right'
    })
  }
  
  // Generate file
  const pptxData = await pptx.write({ outputType: 'base64' })
  return Buffer.from(pptxData as string, 'base64')
}

async function addChartToSlide(slide: any, chart: ChartData) {
  if (chart.type === 'pie') {
    slide.addChart(ppt.Charts.pie, chart.data, {
      x: 1,
      y: 1.5,
      w: 4,
      h: 3
    })
  } else if (chart.type === 'bar') {
    slide.addChart(ppt.Charts.bar, chart.data, {
      x: 1,
      y: 1.5,
      w: 6,
      h: 3.5
    })
  } else if (chart.type === 'line') {
    slide.addChart(ppt.Charts.line, chart.data, {
      x: 1,
      y: 1.5,
      w: 6,
      h: 3.5
    })
  }
}
```

### Week 2: Enhanced PowerPoint Parser

**Current Problem**:
Parser doesn't extract images, charts, or formatting from original PowerPoint.

**Solution**: Parse and store additional data

```typescript
// lib/pptx-parser-enhanced.ts - ENHANCE EXISTING
// Add these types:
interface ImageData {
  id: string
  data: string // base64
  width: number
  height: number
  position: { x: number; y: number }
}

interface ChartData {
  id: string
  type: 'pie' | 'bar' | 'line' | 'donut'
  data: Array<{ label: string; value: number }>
}

interface SlideStyling {
  backgroundColor?: string
  titleFontSize?: number
  bodyFontSize?: number
  fontFamily?: string
  colorScheme?: string
}

// Enhanced ParsedSlide interface
interface ParsedSlide {
  id: string
  index: number
  title: string
  textContent: string
  category: string
  variables: Record<string, string>
  hasCharts: boolean
  charts: ChartData[]      // NEW
  hasImages: boolean
  images: ImageData[]      // NEW
  hasTables: boolean
  tables: TableData[]      // NEW
  styling: SlideStyling    // NEW
  rawXml: string
}

// Add image extraction
async function extractImages(zip: JSZip, slideIndex: number): Promise<ImageData[]> {
  const images: ImageData[] = []
  
  // Look for images in ppt/media/slideN_image*.png/jpg
  const mediaFiles = Object.keys(zip.files).filter(name => 
    name.startsWith(`ppt/media/slide${slideIndex + 1}_`) && 
    (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg'))
  )
  
  for (const imgPath of mediaFiles) {
    const imgFile = zip.files[imgPath]
    const arrayBuffer = await imgFile.async('arraybuffer')
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    
    images.push({
      id: nanoid(),
      data: `data:image/png;base64,${base64}`,
      width: 300, // Default, parse from actual image
      height: 200,
      position: { x: 0, y: 0 }
    })
  }
  
  return images
}
```

---

## Phase 2: Add Financial Charts (Week 3-4)

**Install Dependencies**:
```bash
npm install recharts d3 @types/d3
```

**Create Chart Components**:
```typescript
// components/Charts/PortfolioAllocation.tsx - NEW FILE
'use client'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface PortfolioAllocationProps {
  data: Array<{ name: string; value: number; color?: string }>
  type?: 'pie' | 'donut'
}

const DEFAULT_COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#dcfce7']

export default function PortfolioAllocation({ data, type = 'pie' }: PortfolioAllocationProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={type === 'donut' ? 60 : 0}
          outerRadius={120}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
```

```typescript
// components/Charts/PerformanceChart.tsx - NEW FILE
'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceChartProps {
  data: Array<{ date: string; portfolio: number; benchmark?: number }>
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="portfolio" stroke="#16a34a" strokeWidth={2} />
        {data[0]?.benchmark && (
          <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeWidth={2} />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
```

---

## Phase 3: Add AI Content Generation (Week 5-6)

**Enhance AI Integration**:
```typescript
// lib/ai/content-generator.ts - NEW FILE
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

interface ProposalContext {
  clientName: string
  portfolioValue: string
  riskProfile: string
  objectives: string[]
  recommendations: string[]
}

export async function generateExecutiveSummary(context: ProposalContext): Promise<string> {
  const prompt = `
Generate a professional executive summary for a wealth management proposal.

Client Information:
- Name: ${context.clientName}
- Portfolio Value: ${context.portfolioValue}
- Risk Profile: ${context.riskProfile}
- Investment Objectives: ${context.objectives.join(', ')}
- Key Recommendations: ${context.recommendations.join(', ')}

Requirements:
- Tone: Professional, clear, and client-focused
- Length: 3-4 paragraphs
- Focus: Highlight key opportunities and strategic considerations
- Include: Personalized insights and actionable recommendations

Generate the executive summary now:
  `.trim()
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
    
    return response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'Failed to generate summary'
  } catch (error) {
    console.error('AI generation error:', error)
    throw new Error('Failed to generate executive summary')
  }
}

export async function generateMarketCommentary(period: string, sectors: string[]): Promise<string> {
  const prompt = `
Write professional market commentary covering:

Period: ${period}
Key Sectors: ${sectors.join(', ')}

Requirements:
- Summarize current market conditions
- Discuss sector performance
- Include forward-looking outlook
- Identify key risks to monitor
- Tone: Balanced and professional
- Length: 2-3 paragraphs

Market commentary:
  `.trim()
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.7,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
    
    return response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'Failed to generate commentary'
  } catch (error) {
    console.error('AI generation error:', error)
    throw new Error('Failed to generate market commentary')
  }
}

export async function generateRiskDisclosure(portfolio: PortfolioData): Promise<string> {
  const prompt = `
Generate a comprehensive risk disclosure for an investment portfolio.

Portfolio Information:
- Holdings: ${portfolio.holdings.join(', ')}
- Asset Allocation: ${JSON.stringify(portfolio.allocation)}
- Risk Metrics: ${JSON.stringify(portfolio.metrics)}

Requirements:
- Ensure compliance with SEC regulations
- Cover all relevant risks
- Use standard disclosure language
- Include market, credit, and operational risks
- Length: 1-2 pages

Risk disclosure:
  `.trim()
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      temperature: 0.3, // Lower temp for compliance content
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
    
    return response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'Failed to generate risk disclosure'
  } catch (error) {
    console.error('AI generation error:', error)
    throw new Error('Failed to generate risk disclosure')
  }
}
```

**Create AI API Routes**:
```typescript
// app/api/ai/generate-summary/route.ts - NEW FILE
import { NextRequest, NextResponse } from 'next/server'
import { generateExecutiveSummary } from '@/lib/ai/content-generator'

export async function POST(req: NextRequest) {
  try {
    const context = await req.json()
    const summary = await generateExecutiveSummary(context)
    return NextResponse.json({ summary })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate executive summary' },
      { status: 500 }
    )
  }
}
```

---

## Phase 4: Financial Calculation Engine (Week 7-8)

**Create Calculation Library**:
```typescript
// lib/calculations/portfolioMetrics.ts - NEW FILE

interface PricePoint {
  date: string
  price: number
}

export function calculateTotalReturn(prices: PricePoint[]): number {
  if (prices.length < 2) return 0
  const startPrice = prices[0].price
  const endPrice = prices[prices.length - 1].price
  return ((endPrice - startPrice) / startPrice) * 100
}

export function calculateAnnualizedReturn(prices: PricePoint[]): number {
  const totalReturn = calculateTotalReturn(prices)
  const days = (new Date(prices[prices.length - 1].date).getTime() - 
                new Date(prices[0].date).getTime()) / (1000 * 60 * 60 * 24)
  const years = days / 365
  
  if (years <= 0) return 0
  return ((1 + totalReturn / 100) ** (1 / years) - 1) * 100
}

export function calculateVolatility(prices: PricePoint[]): number {
  const returns = []
  for (let i = 1; i < prices.length; i++) {
    const ret = (prices[i].price - prices[i-1].price) / prices[i-1].price
    returns.push(ret)
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length
  return Math.sqrt(variance * 252) * 100 // Annualized
}

export function calculateSharpeRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (volatility === 0) return 0
  return ((portfolioReturn - riskFreeRate) / 100) / (volatility / 100)
}

export function calculateMaxDrawdown(prices: PricePoint[]): number {
  let maxDrawdown = 0
  let peak = prices[0].price
  
  for (const point of prices) {
    if (point.price > peak) {
      peak = point.price
    }
    const drawdown = ((peak - point.price) / peak) * 100
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }
  
  return maxDrawdown
}

export function calculateBeta(
  portfolioReturns: number[],
  marketReturns: number[]
): number {
  if (portfolioReturns.length !== marketReturns.length) return 1
  
  const portfolioMean = portfolioReturns.reduce((a, b) => a + b, 0) / portfolioReturns.length
  const marketMean = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length
  
  let covariance = 0
  let marketVariance = 0
  
  for (let i = 0; i < portfolioReturns.length; i++) {
    covariance += (portfolioReturns[i] - portfolioMean) * (marketReturns[i] - marketMean)
    marketVariance += Math.pow(marketReturns[i] - marketMean, 2)
  }
  
  return covariance / marketVariance
}
```

---

## Phase 5: Template System (Week 9)

**Create Template Definitions**:
```typescript
// lib/templates/quarterlyReview.json - NEW FILE
{
  "id": "quarterly-review",
  "name": "Quarterly Investment Review",
  "category": "review",
  "description": "Comprehensive quarterly performance review template",
  "slides": [
    {
      "title": "Executive Summary",
      "category": "overview",
      "components": [
        { "type": "text", "content": "{{executive_summary}}" },
        { "type": "metric", "label": "Portfolio Value", "value": "{{portfolio_value}}" }
      ]
    },
    {
      "title": "Portfolio Performance",
      "category": "performance",
      "components": [
        { "type": "chart", "chartType": "line", "data": "{{performance_data}}" }
      ]
    },
    {
      "title": "Current Allocation",
      "category": "allocation",
      "components": [
        { "type": "chart", "chartType": "pie", "data": "{{allocation_data}}" }
      ]
    },
    {
      "title": "Recommendations",
      "category": "strategy",
      "components": [
        { "type": "text", "content": "{{recommendations}}" }
      ]
    }
  ],
  "variables": [
    "client_name",
    "portfolio_value",
    "quarter",
    "executive_summary",
    "performance_data",
    "allocation_data",
    "recommendations"
  ]
}
```

---

## Phase 6: Add Authentication (Week 10-11)

**Install Dependencies**:
```bash
npm install next-auth @auth/prisma-adapter
```

**Setup Authentication**:
```typescript
// lib/auth.ts - NEW FILE
import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Implement actual authentication logic
        // This is a placeholder
        if (credentials?.email && credentials?.password) {
          return {
            id: '1',
            email: credentials.email,
            name: 'Demo User',
            role: 'advisor'
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt'
  }
}

export default NextAuth(authOptions)
```

---

## Implementation Priority Order

1. **Week 1-2**: Enhanced PowerPoint export (CRITICAL - users need working download)
2. **Week 3-4**: Financial charts (HIGH - core feature)
3. **Week 5-6**: AI content generation (HIGH - differentiator)
4. **Week 7-8**: Financial calculations (MEDIUM)
5. **Week 9**: Template system (MEDIUM)
6. **Week 10-11**: Authentication (HIGH - security)
7. **Week 12+**: Advanced features (collaboration, mobile, etc.)

---

## Next Steps

1. Review this plan
2. Set up development environment
3. Start with Week 1-2: Enhanced PowerPoint export
4. Weekly progress reviews
5. User testing after MVP (Week 8)

---

*This plan focuses on MVP features. Advanced features can be added after MVP is complete and tested.*

