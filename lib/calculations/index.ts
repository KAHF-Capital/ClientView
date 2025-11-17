/**
 * Financial Calculations Export
 * All calculation modules in one place
 */

// Portfolio Metrics
export {
  calculateTotalReturn,
  calculateAnnualizedReturn,
  calculateVolatility,
  calculateSharpeRatio,
  calculateSortinoRatio,
  calculateDownsideDeviation,
  calculateMaxDrawdown,
  calculateBeta,
  calculateAlpha,
  calculateCAGR,
  calculatePortfolioValue,
  calculateAllocation,
  type PricePoint,
  type Holding
} from './portfolioMetrics'

// Risk Analysis
export {
  calculateVaR,
  calculateCVaR,
  calculatePortfolioBeta,
  calculateCorrelation,
  calculateCorrelationMatrix,
  calculateDiversificationRatio,
  calculatePortfolioDuration,
  calculateStressTest,
  type VaRInput,
  type StressScenario
} from './riskAnalysis'

// Performance Attribution
export {
  calculateAssetContribution,
  calculateAllocationEffect,
  calculateSelectionEffect,
  calculateInteractionEffect,
  calculateExcessReturn,
  calculateActiveShare,
  calculateTrackingError,
  calculateInformationRatio,
  type AttributionPeriod
} from './performanceAttribution'



