/**
 * AI Content Generation Service
 * Powered by Anthropic Claude for generating professional financial content
 */

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

export interface ProposalContext {
  clientName: string
  portfolioValue: string
  riskProfile: string
  objectives: string[]
  recommendations: string[]
  timeHorizon?: string
}

export interface MarketContext {
  period: string
  sectors: string[]
  marketPerformance?: string
  keyEvents?: string[]
}

export interface RiskContext {
  holdings: string[]
  metrics: Record<string, number>
  tolerance: string
}

export interface PortfolioAnalysis {
  allocation: Record<string, number>
  performance: Record<string, number>
  riskMetrics: Record<string, number>
}

/**
 * Generate executive summary for investment proposal
 */
export async function generateExecutiveSummary(context: ProposalContext): Promise<string> {
  const prompt = `
Generate a professional executive summary for a wealth management proposal.

Client Information:
- Name: ${context.clientName}
- Portfolio Value: ${context.portfolioValue}
- Risk Profile: ${context.riskProfile}
- Investment Objectives: ${context.objectives.join(', ')}
- Key Recommendations: ${context.recommendations.join(', ')}
${context.timeHorizon ? `- Time Horizon: ${context.timeHorizon}` : ''}

Requirements:
- Tone: Professional, clear, and client-focused
- Length: 3-4 paragraphs
- Focus: Highlight key opportunities and strategic considerations
- Include: Personalized insights and actionable recommendations
- Style: Executive-level language that is accessible yet sophisticated

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

/**
 * Generate market commentary section
 */
export async function generateMarketCommentary(context: MarketContext): Promise<string> {
  const prompt = `
Write professional market commentary covering:

Period: ${context.period}
Key Sectors: ${context.sectors.join(', ')}
${context.marketPerformance ? `Market Performance: ${context.marketPerformance}` : ''}
${context.keyEvents?.length ? `Key Events: ${context.keyEvents.join(', ')}` : ''}

Requirements:
- Summarize current market conditions
- Discuss sector performance and trends
- Include forward-looking outlook
- Identify key risks to monitor
- Tone: Balanced and professional
- Length: 2-3 paragraphs
- Style: Suitable for client-facing materials

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

/**
 * Generate risk disclosure statement
 */
export async function generateRiskDisclosure(context: RiskContext): Promise<string> {
  const metricsStr = Object.entries(context.metrics)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n')
  
  const prompt = `
Generate a comprehensive risk disclosure for an investment portfolio.

Portfolio Information:
- Holdings: ${context.holdings.join(', ')}
- Risk Metrics:
${metricsStr}
- Client Risk Tolerance: ${context.tolerance}

Requirements:
- Ensure compliance with SEC regulations
- Cover all relevant risks (market, credit, operational, etc.)
- Use standard disclosure language
- Include appropriate disclaimers
- Length: 1-2 pages
- Format: Paragraph form suitable for presentations
- Tone: Professional and regulatory-compliant

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

/**
 * Generate investment strategy narrative
 */
export async function generateStrategyNarrative(
  allocation: Record<string, number>,
  rationale: Record<string, string>
): Promise<string> {
  const allocationStr = Object.entries(allocation)
    .map(([asset, percent]) => `- ${asset}: ${percent}%`)
    .join('\n')
  
  const rationaleStr = Object.entries(rationale)
    .map(([asset, reason]) => `- ${asset}: ${reason}`)
    .join('\n')
  
  const prompt = `
Write a professional investment strategy narrative explaining the portfolio allocation and rationale.

Asset Allocation:
${allocationStr}

Investment Rationale:
${rationaleStr}

Requirements:
- Explain the strategic allocation decisions
- Connect allocation to client objectives
- Demonstrate investment philosophy
- Tone: Professional and confidence-inspiring
- Length: 2-3 paragraphs
- Style: Suitable for client presentations

Investment strategy narrative:
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
      : 'Failed to generate strategy narrative'
  } catch (error) {
    console.error('AI generation error:', error)
    throw new Error('Failed to generate strategy narrative')
  }
}

/**
 * Analyze portfolio and provide insights
 */
export async function analyzePortfolio(analysis: PortfolioAnalysis): Promise<string> {
  const allocationStr = Object.entries(analysis.allocation)
    .map(([asset, percent]) => `- ${asset}: ${percent}%`)
    .join('\n')
  
  const performanceStr = Object.entries(analysis.performance)
    .map(([period, returnPct]) => `- ${period}: ${returnPct}%`)
    .join('\n')
  
  const riskStr = Object.entries(analysis.riskMetrics)
    .map(([metric, value]) => `- ${metric}: ${value}`)
    .join('\n')
  
  const prompt = `
Analyze this portfolio and provide key insights.

Asset Allocation:
${allocationStr}

Performance:
${performanceStr}

Risk Metrics:
${riskStr}

Requirements:
- Highlight strengths and opportunities
- Identify potential concerns
- Provide actionable recommendations
- Tone: Professional and analytical
- Length: 3-4 paragraphs
- Style: Executive summary format

Portfolio analysis:
  `.trim()
  
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      temperature: 0.6,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
    
    return response.content[0].type === 'text' 
      ? response.content[0].text 
      : 'Failed to analyze portfolio'
  } catch (error) {
    console.error('AI generation error:', error)
    throw new Error('Failed to analyze portfolio')
  }
}

