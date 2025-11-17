import { NextRequest, NextResponse } from 'next/server'
import { generateExecutiveSummary, type ProposalContext } from '@/lib/ai/content-generator'

export async function POST(req: NextRequest) {
  try {
    const context: ProposalContext = await req.json()
    
    if (!context.clientName || !context.portfolioValue) {
      return NextResponse.json(
        { error: 'Missing required fields: clientName, portfolioValue' },
        { status: 400 }
      )
    }
    
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



