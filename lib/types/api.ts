/**
 * Shared TypeScript Types for API Requests and Responses
 * Ensures type safety across frontend and backend communication
 */

// ============================================================================
// Common Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
  status: 'success' | 'error'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

// ============================================================================
// Slide Types
// ============================================================================

export interface SlideVariable {
  [key: string]: string | number
}

export interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'scatter'
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      color?: string
    }[]
  }
}

export interface Slide {
  id: string
  index: number
  title: string
  category: string
  textContent: string
  thumbnailUrl: string
  variables: SlideVariable
  hasCharts: boolean
  charts: ChartData[]
}

export type SlideCategory = 
  | 'Current Allocation'
  | 'Target Allocation'
  | 'Performance'
  | 'Risk/Reward'
  | 'Pacing'
  | 'Fees'
  | 'Appendix'
  | 'Disclosures'

// ============================================================================
// Template Types
// ============================================================================

export interface TemplateTheme {
  colors: string[]
  fontFamily: string
  titleSize: number
  bodySize: number
}

export interface Template {
  id: string
  name: string
  slideCount: number
  variableCount: number
  categoryCount: number
  theme: TemplateTheme
  slides: Slide[]
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// Upload API
// ============================================================================

export interface UploadRequest {
  file: File
}

export interface UploadResponse {
  presentationId: string
  blobUrl: string
  fileName: string
  fileSize: number
}

// ============================================================================
// Analysis API
// ============================================================================

export interface AnalysisRequest {
  fileUrl: string
  presentationId: string
}

export interface AnalysisProgress {
  step: number
  totalSteps: number
  currentStep: string
  percentComplete: number
  status: 'processing' | 'complete' | 'error'
  error?: string
}

export interface AnalysisResult {
  presentationId: string
  templateId: string
  slideCount: number
  variableCount: number
  categories: SlideCategory[]
  theme: TemplateTheme
  processingTime: number
}

export interface AnalysisProgressResponse extends ApiResponse<AnalysisProgress> {}

// ============================================================================
// Template API
// ============================================================================

export interface TemplateRequest {
  templateId: string
}

export interface TemplateResponse extends ApiResponse<Template> {}

export interface TemplateListResponse extends ApiResponse<Template[]> {}

// ============================================================================
// AI Edit API
// ============================================================================

export interface AIEditRequest {
  slideId: string
  instruction: string
  templateTheme: TemplateTheme
  preserveVariables?: boolean
  preserveCharts?: boolean
}

export interface AIEditResponse extends ApiResponse<Slide> {
  tokensUsed?: number
  editTime?: number
}

// ============================================================================
// Generate API
// ============================================================================

export interface GenerateRequest {
  templateId: string
  slides: Slide[]
  filename?: string
  format?: 'pptx' | 'pdf'
}

export interface GenerateResponse {
  downloadUrl: string
  filename: string
  fileSize: number
  expiresAt: string
}

// ============================================================================
// Error Types
// ============================================================================

export interface ApiError {
  message: string
  code: string
  statusCode: number
  details?: Record<string, unknown>
}

export class ApiException extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'ApiException'
  }

  toJSON(): ApiError {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    }
  }
}

// ============================================================================
// Validation Helpers
// ============================================================================

export function isValidSlideCategory(category: string): category is SlideCategory {
  const validCategories: SlideCategory[] = [
    'Current Allocation',
    'Target Allocation',
    'Performance',
    'Risk/Reward',
    'Pacing',
    'Fees',
    'Appendix',
    'Disclosures',
  ]
  return validCategories.includes(category as SlideCategory)
}

export function isValidChartType(type: string): type is ChartData['type'] {
  return ['bar', 'line', 'pie', 'scatter'].includes(type)
}

// ============================================================================
// Type Guards
// ============================================================================

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'code' in error &&
    'statusCode' in error
  )
}

export function isSlide(obj: unknown): obj is Slide {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'index' in obj &&
    'title' in obj &&
    'category' in obj
  )
}

export function isTemplate(obj: unknown): obj is Template {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj &&
    'slides' in obj &&
    'theme' in obj
  )
}

