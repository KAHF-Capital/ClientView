'use client'

import { 
  calculateTotalReturn, 
  calculateAnnualizedReturn,
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateCAGR,
  calculatePortfolioValue,
  calculateAllocation,
  calculateBeta,
  calculateAlpha,
  calculateVaR,
  calculateCVaR,
  type PricePoint,
  type Holding
} from '@/lib/calculations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function CalculationsDemoPage() {
  // Sample price data
  const priceData: PricePoint[] = [
    { date: '2024-01-01', price: 100000 },
    { date: '2024-02-01', price: 102500 },
    { date: '2024-03-01', price: 101800 },
    { date: '2024-04-01', price: 105200 },
    { date: '2024-05-01', price: 104500 },
    { date: '2024-06-01', price: 108000 },
    { date: '2024-07-01', price: 109500 },
    { date: '2024-08-01', price: 107200 },
    { date: '2024-09-01', price: 110800 },
    { date: '2024-10-01', price: 112500 },
    { date: '2024-11-01', price: 115000 },
    { date: '2024-12-01', price: 118000 }
  ]

  // Sample holdings
  const holdings: Holding[] = [
    { symbol: 'AAPL', shares: 100, price: 175 },
    { symbol: 'MSFT', shares: 80, price: 380 },
    { symbol: 'GOOGL', shares: 50, price: 145 },
    { symbol: 'BND', shares: 200, price: 85 },
  ]

  // Calculate metrics
  const totalReturn = calculateTotalReturn(priceData)
  const annualizedReturn = calculateAnnualizedReturn(priceData)
  const maxDrawdown = calculateMaxDrawdown(priceData)
  const cagr = calculateCAGR(priceData[0].price, priceData[priceData.length - 1].price, 1)
  const portfolioValue = calculatePortfolioValue(holdings)
  const allocation = calculateAllocation(holdings)
  
  const sharpeRatio = calculateSharpeRatio(annualizedReturn, 3.0, 12.5)
  const portfolioReturns = [2.5, -0.7, 3.3, -1.2, 3.2, 3.2, 1.4, -2.1, 3.4, 1.5, 2.2, 2.6]
  const marketReturns = [2.0, -1.0, 2.5, -0.8, 2.8, 2.5, 1.0, -2.5, 3.0, 1.2, 2.0, 2.3]
  const beta = calculateBeta(portfolioReturns, marketReturns)
  const alpha = calculateAlpha(annualizedReturn, 3.0, beta, 12.0)
  
  const varResult = calculateVaR({
    prices: priceData,
    confidenceLevel: 0.95,
    holdingPeriod: 1
  })
  const cvarResult = calculateCVaR({
    prices: priceData,
    confidenceLevel: 0.95,
    holdingPeriod: 1
  })

  const metrics = [
    { label: 'Total Return', value: `${totalReturn.toFixed(2)}%`, color: 'text-green-600' },
    { label: 'Annualized Return', value: `${annualizedReturn.toFixed(2)}%`, color: 'text-green-600' },
    { label: 'CAGR', value: `${cagr.toFixed(2)}%`, color: 'text-green-600' },
    { label: 'Max Drawdown', value: `${maxDrawdown.toFixed(2)}%`, color: 'text-red-600' },
    { label: 'Sharpe Ratio', value: sharpeRatio.toFixed(2), color: 'text-blue-600' },
    { label: 'Beta', value: beta.toFixed(2), color: 'text-purple-600' },
    { label: 'Alpha', value: `${alpha.toFixed(2)}%`, color: 'text-orange-600' },
    { label: 'Portfolio Value', value: `$${portfolioValue.toLocaleString()}`, color: 'text-gray-900' },
    { label: 'VaR (95%)', value: `${varResult.toFixed(2)}%`, color: 'text-red-600' },
    { label: 'CVaR (95%)', value: `${cvarResult.toFixed(2)}%`, color: 'text-red-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Financial Calculations Demo
          </h1>
          <p className="text-gray-600">
            Professional portfolio metrics and risk analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <div className="text-sm font-medium text-gray-600 mb-1">
                  {metric.label}
                </div>
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Portfolio Holdings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Portfolio Holdings & Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Symbol</th>
                    <th className="text-right p-3">Shares</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-right p-3">Value</th>
                    <th className="text-right p-3">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map(holding => {
                    const value = holding.shares * holding.price
                    const percent = allocation[holding.symbol]
                    return (
                      <tr key={holding.symbol} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{holding.symbol}</td>
                        <td className="p-3 text-right">{holding.shares.toLocaleString()}</td>
                        <td className="p-3 text-right">${holding.price.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">
                          ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-3 text-right">
                          <span className="font-semibold text-green-600">
                            {percent.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2">
                    <td colSpan={3} className="p-3 font-bold">Total</td>
                    <td className="p-3 text-right font-bold">
                      ${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-right font-bold">100.00%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import {
  calculateTotalReturn,
  calculateAnnualizedReturn,
  calculateSharpeRatio,
  calculatePortfolioValue,
  calculateAllocation
} from '@/lib/calculations'

// Calculate metrics
const totalReturn = calculateTotalReturn(priceData)
const annualizedReturn = calculateAnnualizedReturn(priceData)
const sharpeRatio = calculateSharpeRatio(return, riskFreeRate, volatility)

// Portfolio calculations
const portfolioValue = calculatePortfolioValue(holdings)
const allocation = calculateAllocation(holdings)

// Risk metrics
const varResult = calculateVaR({ prices, confidenceLevel: 0.95, holdingPeriod: 1 })
const cvarResult = calculateCVaR({ prices, confidenceLevel: 0.95, holdingPeriod: 1 })`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



