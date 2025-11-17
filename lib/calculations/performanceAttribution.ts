/**
 * Performance Attribution Analysis
 * Analyze sources of portfolio performance
 */

export interface AttributionPeriod {
  period: string
  portfolioReturn: number
  benchmarkReturn: number
  allocation: Record<string, number>
  assetReturns: Record<string, number>
}

/**
 * Calculate asset contribution to returns
 */
export function calculateAssetContribution(
  allocation: Record<string, number>,
  assetReturns: Record<string, number>
): Record<string, number> {
  const contribution: Record<string, number> = {}
  
  Object.keys(allocation).forEach(asset => {
    const weight = allocation[asset] / 100
    const return_ = assetReturns[asset] || 0
    contribution[asset] = weight * return_
  })
  
  return contribution
}

/**
 * Calculate allocation effect (how portfolio structure differs from benchmark)
 */
export function calculateAllocationEffect(
  portfolioAllocation: Record<string, number>,
  benchmarkAllocation: Record<string, number>,
  benchmarkReturns: Record<string, number>
): Record<string, number> {
  const effect: Record<string, number> = {}
  
  Object.keys(portfolioAllocation).forEach(asset => {
    const portfolioWeight = portfolioAllocation[asset] / 100
    const benchmarkWeight = benchmarkAllocation[asset] || 0
    const benchmarkReturn = benchmarkReturns[asset] || 0
    const benchmarkAvgReturn = Object.values(benchmarkReturns).reduce((a, b) => a + b, 0) / Object.keys(benchmarkReturns).length
    
    effect[asset] = (portfolioWeight - benchmarkWeight) * (benchmarkReturn - benchmarkAvgReturn)
  })
  
  return effect
}

/**
 * Calculate selection effect (how portfolio assets performed vs benchmark)
 */
export function calculateSelectionEffect(
  allocation: Record<string, number>,
  portfolioReturns: Record<string, number>,
  benchmarkReturns: Record<string, number>
): Record<string, number> {
  const effect: Record<string, number> = {}
  
  Object.keys(allocation).forEach(asset => {
    const weight = allocation[asset] / 100
    const portfolioReturn = portfolioReturns[asset] || 0
    const benchmarkReturn = benchmarkReturns[asset] || 0
    
    effect[asset] = weight * (portfolioReturn - benchmarkReturn)
  })
  
  return effect
}

/**
 * Calculate interaction effect
 */
export function calculateInteractionEffect(
  portfolioAllocation: Record<string, number>,
  benchmarkAllocation: Record<string, number>,
  portfolioReturns: Record<string, number>,
  benchmarkReturns: Record<string, number>
): Record<string, number> {
  const effect: Record<string, number> = {}
  
  Object.keys(portfolioAllocation).forEach(asset => {
    const portfolioWeight = portfolioAllocation[asset] / 100
    const benchmarkWeight = benchmarkAllocation[asset] || 0
    const portfolioReturn = portfolioReturns[asset] || 0
    const benchmarkReturn = benchmarkReturns[asset] || 0
    
    effect[asset] = (portfolioWeight - benchmarkWeight) * (portfolioReturn - benchmarkReturn)
  })
  
  return effect
}

/**
 * Calculate portfolio vs benchmark excess return
 */
export function calculateExcessReturn(
  portfolioReturn: number,
  benchmarkReturn: number
): number {
  return portfolioReturn - benchmarkReturn
}

/**
 * Calculate active share (how different portfolio is from benchmark)
 */
export function calculateActiveShare(
  portfolioAllocation: Record<string, number>,
  benchmarkAllocation: Record<string, number>
): number {
  const allAssets = new Set([...Object.keys(portfolioAllocation), ...Object.keys(benchmarkAllocation)])
  let activeShare = 0
  
  allAssets.forEach(asset => {
    const portfolioWeight = portfolioAllocation[asset] || 0
    const benchmarkWeight = benchmarkAllocation[asset] || 0
    activeShare += Math.abs(portfolioWeight - benchmarkWeight)
  })
  
  return activeShare / 200 // Divide by 2 since we're summing absolute differences
}

/**
 * Calculate tracking error (volatility of excess returns)
 */
export function calculateTrackingError(
  portfolioReturns: number[],
  benchmarkReturns: number[]
): number {
  if (portfolioReturns.length !== benchmarkReturns.length || portfolioReturns.length === 0) {
    return 0
  }
  
  const excessReturns = portfolioReturns.map((pr, i) => pr - benchmarkReturns[i])
  const mean = excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length
  const variance = excessReturns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / excessReturns.length
  
  return Math.sqrt(variance * 252) * 100 // Annualized
}

/**
 * Calculate information ratio
 */
export function calculateInformationRatio(
  excessReturn: number,
  trackingError: number
): number {
  if (trackingError === 0) return 0
  return excessReturn / trackingError
}



