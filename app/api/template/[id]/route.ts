import { NextRequest, NextResponse } from 'next/server'
import { getTemplate } from '@/lib/template-store'

// Mock data for demo (fallback if no uploaded template found)
const mockTemplate = {
  name: 'Client Proposal Template',
  slideCount: 8,
  variableCount: 12,
  categoryCount: 5,
  theme: {
    colors: ['#1E40AF', '#6366F1', '#818CF8', '#C7D2FE'],
    fontFamily: 'Arial',
    titleSize: 32,
    bodySize: 18
  },
  slides: [
    {
      id: 'slide-1',
      index: 0,
      title: 'Current Portfolio Allocation',
      category: 'Current Allocation',
      textContent: 'Your current portfolio is allocated across multiple asset classes with a focus on growth equity.\n\nTotal Portfolio Value: {{portfolio_value}}\nEquity Allocation: {{equity_percentage}}%\nFixed Income: {{fixed_income_percentage}}%',
      thumbnailUrl: '',
      variables: {
        portfolio_value: '$2,500,000',
        equity_percentage: '65',
        fixed_income_percentage: '30'
      },
      hasCharts: true,
      charts: []
    },
    {
      id: 'slide-2',
      index: 1,
      title: 'Target Allocation Strategy',
      category: 'Target Allocation',
      textContent: 'We recommend adjusting your allocation to better align with your long-term goals and risk tolerance.\n\nTarget Equity: {{target_equity}}%\nTarget Fixed Income: {{target_fixed_income}}%\nTarget Alternative: {{target_alternative}}%',
      thumbnailUrl: '',
      variables: {
        target_equity: '55',
        target_fixed_income: '35',
        target_alternative: '10'
      },
      hasCharts: true,
      charts: []
    },
    {
      id: 'slide-3',
      index: 2,
      title: 'Historical Performance',
      category: 'Performance',
      textContent: 'Your portfolio has performed well over the past {{years}} years.\n\n1-Year Return: {{return_1y}}%\n3-Year Return: {{return_3y}}%\n5-Year Return: {{return_5y}}%',
      thumbnailUrl: '',
      variables: {
        years: '5',
        return_1y: '12.5',
        return_3y: '9.8',
        return_5y: '11.2'
      },
      hasCharts: true,
      charts: []
    },
    {
      id: 'slide-4',
      index: 3,
      title: 'Risk Analysis',
      category: 'Risk/Reward',
      textContent: 'Understanding the risk-reward profile of your portfolio is crucial for long-term success.\n\nPortfolio Volatility: {{volatility}}%\nSharpe Ratio: {{sharpe_ratio}}\nMax Drawdown: {{max_drawdown}}%',
      thumbnailUrl: '',
      variables: {
        volatility: '14.2',
        sharpe_ratio: '1.25',
        max_drawdown: '-18.5'
      },
      hasCharts: false,
      charts: []
    },
    {
      id: 'slide-5',
      index: 4,
      title: 'Implementation Timeline',
      category: 'Pacing',
      textContent: 'We recommend implementing the new strategy gradually over {{pacing_months}} months to minimize market timing risk.',
      thumbnailUrl: '',
      variables: {
        pacing_months: '6'
      },
      hasCharts: false,
      charts: []
    },
    {
      id: 'slide-6',
      index: 5,
      title: 'Fee Structure',
      category: 'Fees',
      textContent: 'Our advisory fee is {{advisory_fee}}% annually on assets under management.\n\nAnnual Fee: {{annual_fee_amount}}\nQuarterly Billing: {{quarterly_fee_amount}}',
      thumbnailUrl: '',
      variables: {
        advisory_fee: '0.75',
        annual_fee_amount: '$18,750',
        quarterly_fee_amount: '$4,687.50'
      },
      hasCharts: false,
      charts: []
    },
    {
      id: 'slide-7',
      index: 6,
      title: 'Additional Resources',
      category: 'Appendix',
      textContent: 'For more information, please refer to the following resources and documents included in this proposal.',
      thumbnailUrl: '',
      variables: {},
      hasCharts: false,
      charts: []
    },
    {
      id: 'slide-8',
      index: 7,
      title: 'Important Disclosures',
      category: 'Disclosures',
      textContent: 'Past performance is not indicative of future results. All investments carry risk, including potential loss of principal.',
      thumbnailUrl: '',
      variables: {},
      hasCharts: false,
      charts: []
    }
  ]
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to get uploaded template from store first
    const uploadedTemplate = getTemplate(params.id)
    
    if (uploadedTemplate) {
      // Return the uploaded template with its slides
      return NextResponse.json({
        name: uploadedTemplate.name,
        slideCount: uploadedTemplate.slideCount,
        variableCount: uploadedTemplate.variableCount,
        categoryCount: uploadedTemplate.categoryCount,
        theme: uploadedTemplate.theme,
        slides: uploadedTemplate.slides
      })
    }
    
    // Fall back to mock data for demo mode
    console.log('Using mock template for:', params.id)
    return NextResponse.json(mockTemplate)
  } catch (error) {
    console.error('Template fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to load template' }, 
      { status: 500 }
    )
  }
}

