/**
 * Portfolio Metrics Calculations
 * Financial calculations for investment proposals
 */

export interface PricePoint {
  date: string
  price: number
}

export interface Holding {
  symbol: string
  shares: number
  price: number
}

/**
 * Calculate total return percentage
 */
export function calculateTotalReturn(prices: PricePoint[]): number {
  if (prices.length < 2) return 0
  const startPrice = prices[0].price
  const endPrice = prices[prices.length - 1].price
  return ((endPrice - startPrice) / startPrice) * 100
}

/**
 * Calculate annualized return
 */
export function calculateAnnualizedReturn(prices: PricePoint[]): number {
  const totalReturn = calculateTotalReturn(prices)
  const days = (new Date(prices[prices.length - 1].date).getTime() - 
                new Date(prices[0].date).getTime()) / (1000 * 60 * 60 * 24)
  const years = days / 365
  
  if (years <= 0) return 0
  return ((1 + totalReturn / 100) ** (1 / years) - 1) * 100
}

/**
 * Calculate portfolio volatility (annualized standard deviation)
 */
export function calculateVolatility(prices: PricePoint[]): number {
  if (prices.length < 2) return 0
  
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    const ret = (prices[i].price - prices[i-1].price) / prices[i-1].price
    returns.push(ret)
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length
  return Math.sqrt(variance * 252) * 100 // Annualized (252 trading days)
}

/**
 * Calculate Sharpe Ratio
 * Measures risk-adjusted return
 */
export function calculateSharpeRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  volatility: number
): number {
  if (volatility === 0) return 0
  return ((portfolioReturn - riskFreeRate) / 100) / (volatility / 100)
}

/**
 * Calculate Sortino Ratio
 * Measures downside risk-adjusted return
 */
export function calculateSortinoRatio(
  portfolioReturn: number,
  riskFreeRate: number,
  downsideDeviation: number
): number {
  if (downsideDeviation === 0) return 0
  return ((portfolioReturn - riskFreeRate) / 100) / (downsideDeviation / 100)
}

/**
 * Calculate downside deviation
 */
export function calculateDownsideDeviation(prices: PricePoint[]): number {
  if (prices.length < 2) return 0
  
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    const ret = (prices[i].price - prices[i-1].price) / prices[i-1].price
    returns.push(ret)
  }
  
  // Only consider negative returns (downside)
  const downsideReturns = returns.filter(ret => ret < 0)
  if (downsideReturns.length === 0) return 0
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length
  const downsideVariance = downsideReturns.reduce(
    (sum, ret) => sum + Math.pow(ret - mean, 2), 
    0
  ) / downsideReturns.length
  
  return Math.sqrt(downsideVariance * 252) * 100 // Annualized
}

/**
 * Calculate maximum drawdown
 */
export function calculateMaxDrawdown(prices: PricePoint[]): number {
  if (prices.length < 2) return 0
  
  let maxDrawdown = 0
  let peak = prices[0].price
  
  for (const point of prices) {
    if (point.price > peak) {
      peak = point.price
    }
    const drawdown = ((peak - point.price) / peak) * 100
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown
    }
  }
  
  return maxDrawdown
}

/**
 * Calculate Beta
 * Measures portfolio sensitivity to market movements
 */
export function calculateBeta(
  portfolioReturns: number[],
  marketReturns: number[]
): number {
  if (portfolioReturns.length !== marketReturns.length || portfolioReturns.length === 0) {
    return 1 // Default neutral
  }
  
  const portfolioMean = portfolioReturns.reduce((a, b) => a + b, 0) / portfolioReturns.length
  const marketMean = marketReturns.reduce((a, b) => a + b, 0) / marketReturns.length
  
  let covariance = 0
  let marketVariance = 0
  
  for (let i = 0; i < portfolioReturns.length; i++) {
    covariance += (portfolioReturns[i] - portfolioMean) * (marketReturns[i] - marketMean)
    marketVariance += Math.pow(marketReturns[i] - marketMean, 2)
  }
  
  if (marketVariance === 0) return 1
  return covariance / marketVariance
}

/**
 * Calculate Alpha
 * Measures excess return above benchmark
 */
export function calculateAlpha(
  portfolioReturn: number,
  riskFreeRate: number,
  beta: number,
  marketReturn: number
): number {
  const expectedReturn = riskFreeRate + beta * (marketReturn - riskFreeRate)
  return portfolioReturn - expectedReturn
}

/**
 * Calculate Compound Annual Growth Rate (CAGR)
 */
export function calculateCAGR(
  startingValue: number,
  endingValue: number,
  years: number
): number {
  if (years <= 0 || startingValue <= 0) return 0
  return ((endingValue / startingValue) ** (1 / years) - 1) * 100
}

/**
 * Calculate portfolio value from holdings
 */
export function calculatePortfolioValue(holdings: Holding[]): number {
  return holdings.reduce((total, holding) => {
    return total + (holding.shares * holding.price)
  }, 0)
}

/**
 * Calculate portfolio allocation percentages
 */
export function calculateAllocation(holdings: Holding[]): Record<string, number> {
  const totalValue = calculatePortfolioValue(holdings)
  const allocation: Record<string, number> = {}
  
  holdings.forEach(holding => {
    const value = holding.shares * holding.price
    allocation[holding.symbol] = totalValue > 0 ? (value / totalValue) * 100 : 0
  })
  
  return allocation
}

