/**
 * Risk Analysis Calculations
 * Advanced risk metrics for portfolio analysis
 */

import { calculateVolatility, type PricePoint } from './portfolioMetrics'

export interface VaRInput {
  prices: PricePoint[]
  confidenceLevel: number // 0.95 for 95% VaR, 0.99 for 99% VaR
  holdingPeriod: number // Days
}

/**
 * Calculate Value at Risk (VaR) using historical method
 * VaR represents potential loss at a given confidence level
 */
export function calculateVaR(input: VaRInput): number {
  const { prices, confidenceLevel, holdingPeriod } = input
  
  if (prices.length < 30) return 0 // Need minimum data points
  
  // Calculate daily returns
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    const ret = (prices[i].price - prices[i-1].price) / prices[i-1].price
    returns.push(ret)
  }
  
  // Sort returns to find percentile
  const sortedReturns = [...returns].sort((a, b) => a - b)
  const percentileIndex = Math.floor(sortedReturns.length * (1 - confidenceLevel))
  const varReturn = sortedReturns[percentileIndex] * Math.sqrt(holdingPeriod)
  
  // Convert to percentage
  return Math.abs(varReturn * 100)
}

/**
 * Calculate Conditional VaR (CVaR) / Expected Shortfall
 * Average loss when VaR threshold is exceeded
 */
export function calculateCVaR(input: VaRInput): number {
  const { prices, confidenceLevel, holdingPeriod } = input
  
  if (prices.length < 30) return 0
  
  const returns: number[] = []
  for (let i = 1; i < prices.length; i++) {
    const ret = (prices[i].price - prices[i-1].price) / prices[i-1].price
    returns.push(ret)
  }
  
  const sortedReturns = [...returns].sort((a, b) => a - b)
  const varReturn = sortedReturns[Math.floor(sortedReturns.length * (1 - confidenceLevel))]
  
  // Average of all returns below VaR threshold
  const tailReturns = sortedReturns.filter(ret => ret <= varReturn)
  const cvarReturn = tailReturns.reduce((sum, ret) => sum + ret, 0) / tailReturns.length
  
  return Math.abs(cvarReturn * Math.sqrt(holdingPeriod) * 100)
}

/**
 * Calculate Portfolio Beta
 * Weighted average of individual asset betas
 */
export function calculatePortfolioBeta(
  assetBetas: Record<string, number>,
  allocation: Record<string, number>
): number {
  let portfolioBeta = 0
  
  Object.keys(allocation).forEach(asset => {
    const beta = assetBetas[asset] || 1
    const weight = allocation[asset] / 100 // Convert percentage to decimal
    portfolioBeta += beta * weight
  })
  
  return portfolioBeta
}

/**
 * Calculate correlation coefficient between two return series
 */
export function calculateCorrelation(returns1: number[], returns2: number[]): number {
  if (returns1.length !== returns2.length || returns1.length === 0) return 0
  
  const mean1 = returns1.reduce((a, b) => a + b, 0) / returns1.length
  const mean2 = returns2.reduce((a, b) => a + b, 0) / returns2.length
  
  let covariance = 0
  let variance1 = 0
  let variance2 = 0
  
  for (let i = 0; i < returns1.length; i++) {
    const diff1 = returns1[i] - mean1
    const diff2 = returns2[i] - mean2
    covariance += diff1 * diff2
    variance1 += diff1 * diff1
    variance2 += diff2 * diff2
  }
  
  const stdDev1 = Math.sqrt(variance1 / returns1.length)
  const stdDev2 = Math.sqrt(variance2 / returns2.length)
  
  if (stdDev1 === 0 || stdDev2 === 0) return 0
  return covariance / (returns1.length * stdDev1 * stdDev2)
}

/**
 * Calculate correlation matrix for multiple assets
 */
export function calculateCorrelationMatrix(returns: Record<string, number[]>): number[][] {
  const assets = Object.keys(returns)
  const matrix: number[][] = []
  
  assets.forEach(asset1 => {
    const row: number[] = []
    assets.forEach(asset2 => {
      row.push(calculateCorrelation(returns[asset1], returns[asset2]))
    })
    matrix.push(row)
  })
  
  return matrix
}

/**
 * Calculate diversification ratio
 * Measures effectiveness of diversification
 */
export function calculateDiversificationRatio(
  allocation: Record<string, number>,
  volatilities: Record<string, number>,
  correlationMatrix: number[][]
): number {
  const assets = Object.keys(allocation)
  
  // Weighted average volatility of individual assets
  let avgVolatility = 0
  assets.forEach(asset => {
    const weight = allocation[asset] / 100
    avgVolatility += volatilities[asset] * weight
  })
  
  // Portfolio volatility (considering correlations)
  let portfolioVariance = 0
  assets.forEach((asset1, i) => {
    assets.forEach((asset2, j) => {
      const weight1 = allocation[asset1] / 100
      const weight2 = allocation[asset2] / 100
      portfolioVariance += weight1 * weight2 * volatilities[asset1] * volatilities[asset2] * correlationMatrix[i][j]
    })
  })
  
  const portfolioVolatility = Math.sqrt(portfolioVariance)
  
  if (portfolioVolatility === 0) return 1
  return avgVolatility / portfolioVolatility
}

/**
 * Calculate portfolio duration (for bond portfolios)
 */
export function calculatePortfolioDuration(
  bonds: Array<{ maturity: number; yield: number; weight: number }>
): number {
  return bonds.reduce((total, bond) => {
    return total + bond.maturity * bond.weight
  }, 0)
}

/**
 * Stress test scenario analysis
 */
export interface StressScenario {
  asset: string
  shock: number // Percentage change
}

export function calculateStressTest(
  portfolioValue: number,
  allocation: Record<string, number>,
  scenarios: StressScenario[]
): number {
  let stressedValue = portfolioValue
  
  scenarios.forEach(scenario => {
    const weight = allocation[scenario.asset] / 100
    const valueImpact = portfolioValue * weight * (scenario.shock / 100)
    stressedValue += valueImpact
  })
  
  return stressedValue
}



