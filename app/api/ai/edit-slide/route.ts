import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const { slideId, instruction, templateTheme } = await req.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      // Return mock response if no API key configured
      return NextResponse.json({
        id: slideId,
        title: 'Updated Title (Mock)',
        textContent: 'This is a mock response because no Anthropic API key is configured.\n\nInstruction received: ' + instruction,
        explanation: 'Mock response - configure ANTHROPIC_API_KEY to use real AI editing'
      })
    }

    // In production, fetch current slide data from database
    // For demo, we'll work with the instruction directly

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `You are an expert wealth management presentation designer. You maintain brand consistency while making requested edits.

TEMPLATE THEME:
- Primary Color: ${templateTheme.colors[0]}
- Secondary Color: ${templateTheme.colors[1]}
- Font Family: ${templateTheme.fontFamily}
- Font Sizes: Title ${templateTheme.titleSize}pt, Body ${templateTheme.bodySize}pt

USER INSTRUCTION:
${instruction}

RULES:
1. Maintain the exact color scheme provided
2. Keep the same font family and sizing
3. Preserve slide layout structure
4. Update only what's requested
5. For charts, return data in this format: { type: 'pie'|'bar'|'line', data: [], labels: [] }
6. Return complete updated slide in JSON format

Return ONLY valid JSON with this structure (no markdown formatting):
{
  "title": "updated title",
  "textContent": "updated text content",
  "charts": [],
  "variables": {},
  "explanation": "brief explanation of changes"
}`
      }]
    })

    // Parse Claude's response
    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '{}'
    
    let updatedSlide
    try {
      updatedSlide = JSON.parse(responseText)
    } catch (parseError) {
      // If Claude didn't return valid JSON, create a structured response
      updatedSlide = {
        title: 'Updated by AI',
        textContent: responseText,
        explanation: 'AI response received'
      }
    }

    // Add slide ID
    updatedSlide.id = slideId

    // In production: save to database here

    return NextResponse.json(updatedSlide)
  } catch (error) {
    console.error('AI edit error:', error)
    return NextResponse.json(
      { error: 'AI edit failed' }, 
      { status: 500 }
    )
  }
}

