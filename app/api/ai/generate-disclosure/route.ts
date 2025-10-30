import { NextRequest, NextResponse } from 'next/server'
import { generateRiskDisclosure, type RiskContext } from '@/lib/ai/content-generator'

export async function POST(req: NextRequest) {
  try {
    const context: RiskContext = await req.json()
    
    if (!context.holdings || !context.tolerance) {
      return NextResponse.json(
        { error: 'Missing required fields: holdings, tolerance' },
        { status: 400 }
      )
    }
    
    const disclosure = await generateRiskDisclosure(context)
    
    return NextResponse.json({ disclosure })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate risk disclosure' },
      { status: 500 }
    )
  }
}

