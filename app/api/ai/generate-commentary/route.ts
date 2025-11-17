import { NextRequest, NextResponse } from 'next/server'
import { generateMarketCommentary, type MarketContext } from '@/lib/ai/content-generator'

export async function POST(req: NextRequest) {
  try {
    const context: MarketContext = await req.json()
    
    if (!context.period || !context.sectors) {
      return NextResponse.json(
        { error: 'Missing required fields: period, sectors' },
        { status: 400 }
      )
    }
    
    const commentary = await generateMarketCommentary(context)
    
    return NextResponse.json({ commentary })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate market commentary' },
      { status: 500 }
    )
  }
}



