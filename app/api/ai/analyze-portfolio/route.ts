import { NextRequest, NextResponse } from 'next/server'
import { analyzePortfolio, type PortfolioAnalysis } from '@/lib/ai/content-generator'

export async function POST(req: NextRequest) {
  try {
    const analysis: PortfolioAnalysis = await req.json()
    
    if (!analysis.allocation || !analysis.performance) {
      return NextResponse.json(
        { error: 'Missing required fields: allocation, performance' },
        { status: 400 }
      )
    }
    
    const insights = await analyzePortfolio(analysis)
    
    return NextResponse.json({ insights })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze portfolio' },
      { status: 500 }
    )
  }
}

