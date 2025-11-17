'use client'

import { PortfolioAllocation, PerformanceChart, RiskMatrix, BarComparison } from '@/components/Charts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ChartsDemoPage() {
  // Sample data for portfolio allocation
  const allocationData = [
    { name: 'Equities', value: 60, color: '#16a34a' },
    { name: 'Fixed Income', value: 30, color: '#22c55e' },
    { name: 'Alternatives', value: 10, color: '#4ade80' }
  ]

  // Sample performance data
  const performanceData = [
    { date: 'Jan', portfolio: 2.5, benchmark: 1.8 },
    { date: 'Feb', portfolio: 4.2, benchmark: 3.1 },
    { date: 'Mar', portfolio: 6.1, benchmark: 4.3 },
    { date: 'Apr', portfolio: 7.8, benchmark: 5.2 },
    { date: 'May', portfolio: 9.5, benchmark: 6.7 },
    { date: 'Jun', portfolio: 11.2, benchmark: 8.1 }
  ]

  // Sample risk matrix data
  const riskData = [
    { name: 'Tech Stocks', risk: 18, return: 15 },
    { name: 'Bonds', risk: 5, return: 3 },
    { name: 'Real Estate', risk: 12, return: 8 },
    { name: 'Commodities', risk: 20, return: 10 }
  ]

  // Sample comparison data
  const comparisonData = [
    { name: '1Y', value: 12.5, benchmark: 10.2 },
    { name: '3Y', value: 38.7, benchmark: 32.1 },
    { name: '5Y', value: 65.4, benchmark: 54.8 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Financial Charts Demo
          </h1>
          <p className="text-gray-600">
            Demonstration of reusable chart components for investment proposals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Allocation Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation (Pie)</CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioAllocation data={allocationData} type="pie" height={350} />
            </CardContent>
          </Card>

          {/* Portfolio Allocation Donut Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Allocation (Donut)</CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioAllocation data={allocationData} type="donut" height={350} />
            </CardContent>
          </Card>

          {/* Performance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={performanceData} height={350} />
            </CardContent>
          </Card>

          {/* Risk Matrix */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Risk/Return Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskMatrix data={riskData} height={350} />
            </CardContent>
          </Card>

          {/* Bar Comparison */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Returns Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <BarComparison data={comparisonData} height={350} />
            </CardContent>
          </Card>
        </div>

        {/* Usage Example */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Example</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { PortfolioAllocation, PerformanceChart } from '@/components/Charts'

const data = [
  { name: 'Equities', value: 60, color: '#16a34a' },
  { name: 'Bonds', value: 30, color: '#22c55e' },
  { name: 'Alternatives', value: 10, color: '#4ade80' }
]

<PortfolioAllocation data={data} type="donut" height={300} />`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



