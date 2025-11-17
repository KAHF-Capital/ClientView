'use client'

import { useState } from 'react'
import { ContentGenerator } from '@/components/AI/ContentGenerator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function AIDemoPage() {
  const [executiveSummary, setExecutiveSummary] = useState('')
  const [marketCommentary, setMarketCommentary] = useState('')
  const [strategy, setStrategy] = useState('')
  const [disclosure, setDisclosure] = useState('')
  const [insights, setInsights] = useState('')

  // Sample context for generation
  const proposalContext = {
    clientName: 'Johnson Family Trust',
    portfolioValue: '$3,500,000',
    riskProfile: 'Moderate',
    objectives: ['Capital preservation', 'Income generation', 'Long-term growth'],
    recommendations: ['Rebalance to target allocation', 'Add municipal bonds', 'Consider REIT exposure'],
    timeHorizon: '15-20 years'
  }

  const marketContext = {
    period: 'Q4 2024',
    sectors: ['Technology', 'Healthcare', 'Financials', 'Real Estate'],
    marketPerformance: 'Strong gains in tech, mixed performance across sectors',
    keyEvents: ['Fed rate pause', 'AI boom', 'Housing market stabilization']
  }

  const strategyContext = {
    allocation: {
      'Large Cap Equity': 40,
      'Fixed Income': 35,
      'Small Cap Equity': 15,
      'Alternatives': 10
    },
    rationale: {
      'Large Cap Equity': 'Core growth driver with strong fundamentals',
      'Fixed Income': 'Income generation and capital preservation',
      'Small Cap Equity': 'Long-term growth potential',
      'Alternatives': 'Diversification and inflation hedge'
    }
  }

  const riskContext = {
    holdings: ['Large Cap Stock', 'Corporate Bonds', 'Municipal Bonds', 'REITs'],
    metrics: {
      'Beta': 0.85,
      'Sharpe Ratio': 1.2,
      'Volatility': 12.5
    },
    tolerance: 'Moderate'
  }

  const analysisContext = {
    allocation: {
      'Equities': 55,
      'Bonds': 35,
      'Cash': 10
    },
    performance: {
      '1 Year': 12.5,
      '3 Year': 9.8,
      '5 Year': 11.2
    },
    riskMetrics: {
      'Sharpe Ratio': 1.2,
      'Max Drawdown': 8.5
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Content Generation Demo
          </h1>
          <p className="text-gray-600">
            Powered by Anthropic Claude - Generate professional investment content
          </p>
        </div>

        <div className="space-y-6">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Executive Summary</CardTitle>
                <ContentGenerator
                  type="summary"
                  context={proposalContext}
                  onGenerated={setExecutiveSummary}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={executiveSummary}
                onChange={(e) => setExecutiveSummary(e.target.value)}
                placeholder="Generated executive summary will appear here..."
                rows={8}
                className="font-serif"
              />
            </CardContent>
          </Card>

          {/* Market Commentary */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Market Commentary</CardTitle>
                <ContentGenerator
                  type="commentary"
                  context={marketContext}
                  onGenerated={setMarketCommentary}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={marketCommentary}
                onChange={(e) => setMarketCommentary(e.target.value)}
                placeholder="Generated market commentary will appear here..."
                rows={6}
                className="font-serif"
              />
            </CardContent>
          </Card>

          {/* Investment Strategy */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Investment Strategy</CardTitle>
                <ContentGenerator
                  type="strategy"
                  context={strategyContext}
                  onGenerated={setStrategy}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                placeholder="Generated investment strategy will appear here..."
                rows={6}
                className="font-serif"
              />
            </CardContent>
          </Card>

          {/* Risk Disclosure */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Risk Disclosure</CardTitle>
                <ContentGenerator
                  type="disclosure"
                  context={riskContext}
                  onGenerated={setDisclosure}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={disclosure}
                onChange={(e) => setDisclosure(e.target.value)}
                placeholder="Generated risk disclosure will appear here..."
                rows={8}
                className="font-serif"
              />
            </CardContent>
          </Card>

          {/* Portfolio Analysis */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Portfolio Analysis</CardTitle>
                <ContentGenerator
                  type="analysis"
                  context={analysisContext}
                  onGenerated={setInsights}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={insights}
                onChange={(e) => setInsights(e.target.value)}
                placeholder="Generated portfolio insights will appear here..."
                rows={8}
                className="font-serif"
              />
            </CardContent>
          </Card>

          {/* API Usage */}
          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Generate Executive Summary
fetch('/api/ai/generate-summary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clientName: 'Johnson Family Trust',
    portfolioValue: '$3,500,000',
    riskProfile: 'Moderate',
    objectives: ['Capital preservation', 'Growth'],
    recommendations: ['Rebalance', 'Add bonds']
  })
})
.then(res => res.json())
.then(data => console.log(data.summary))`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}



