/**
 * API Route Handler Utilities
 * Provides consistent error handling and response formatting for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from './logger'
import { ApiException, ApiResponse } from './types/api'
import { ZodError } from 'zod'

/**
 * Standardized API success response
 */
export function successResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      status: 'success',
      data,
    },
    { status }
  )
}

/**
 * Standardized API error response
 */
export function errorResponse(
  message: string,
  status = 500,
  error?: unknown
): NextResponse<ApiResponse> {
  // Log error
  if (error instanceof Error) {
    logger.error(message, error)
  } else {
    logger.error(message)
  }

  return NextResponse.json(
    {
      status: 'error',
      error: message,
    },
    { status }
  )
}

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  // ApiException (custom errors)
  if (error instanceof ApiException) {
    return errorResponse(error.message, error.statusCode, error)
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    const issues = error.issues.map(issue => 
      `${issue.path.join('.')}: ${issue.message}`
    ).join(', ')
    return errorResponse(`Validation error: ${issues}`, 400, error)
  }

  // Standard JavaScript errors
  if (error instanceof Error) {
    // Don't expose internal error messages in production
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'An internal error occurred'
    return errorResponse(message, 500, error)
  }

  // Unknown errors
  return errorResponse('An unexpected error occurred', 500, error)
}

/**
 * API route wrapper with error handling
 * Automatically catches and handles errors in API routes
 */
export function withErrorHandling<T = unknown>(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse<ApiResponse<T>>>
) {
  return async (req: NextRequest, context?: any): Promise<NextResponse<ApiResponse<T>>> => {
    try {
      return await handler(req, context)
    } catch (error) {
      return handleApiError(error) as NextResponse<ApiResponse<T>>
    }
  }
}

/**
 * Validate request method
 */
export function validateMethod(
  req: NextRequest, 
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(req.method)) {
    throw new ApiException(
      `Method ${req.method} not allowed. Allowed: ${allowedMethods.join(', ')}`,
      405,
      'METHOD_NOT_ALLOWED'
    )
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: Record<string, unknown>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => !body[field])
  
  if (missingFields.length > 0) {
    throw new ApiException(
      `Missing required fields: ${missingFields.join(', ')}`,
      400,
      'MISSING_FIELDS'
    )
  }
}

/**
 * Parse and validate JSON request body
 */
export async function parseRequestBody<T = Record<string, unknown>>(
  req: NextRequest
): Promise<T> {
  try {
    const body = await req.json()
    return body as T
  } catch (error) {
    throw new ApiException(
      'Invalid JSON in request body',
      400,
      'INVALID_JSON'
    )
  }
}

/**
 * Get query parameter with validation
 */
export function getQueryParam(
  req: NextRequest,
  param: string,
  required = false
): string | null {
  const { searchParams } = new URL(req.url)
  const value = searchParams.get(param)

  if (required && !value) {
    throw new ApiException(
      `Missing required query parameter: ${param}`,
      400,
      'MISSING_PARAM'
    )
  }

  return value
}

/**
 * Rate limiting helper (basic implementation)
 * In production, use a proper rate limiting solution like Upstash or Redis
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  limit = 100,
  windowMs = 60000 // 1 minute
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  // Clean up old records periodically
  if (rateLimitMap.size > 10000) {
    rateLimitMap.clear()
  }

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

/**
 * Apply rate limiting to request
 */
export function rateLimit(
  req: NextRequest,
  limit = 100,
  windowMs = 60000
): void {
  const identifier = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'

  if (!checkRateLimit(identifier, limit, windowMs)) {
    throw new ApiException(
      'Too many requests. Please try again later.',
      429,
      'RATE_LIMIT_EXCEEDED'
    )
  }
}

/**
 * CORS headers helper
 */
export function corsHeaders(origin?: string) {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*']
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0]

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

/**
 * Handle OPTIONS request for CORS
 */
export function handleOptions(req: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get('origin') || undefined),
  })
}

