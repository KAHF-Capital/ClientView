import { NextRequest, NextResponse } from 'next/server'
import { generateStrategyNarrative } from '@/lib/ai/content-generator'

export async function POST(req: NextRequest) {
  try {
    const { allocation, rationale } = await req.json()
    
    if (!allocation || !rationale) {
      return NextResponse.json(
        { error: 'Missing required fields: allocation, rationale' },
        { status: 400 }
      )
    }
    
    const strategy = await generateStrategyNarrative(allocation, rationale)
    
    return NextResponse.json({ strategy })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate strategy narrative' },
      { status: 500 }
    )
  }
}

