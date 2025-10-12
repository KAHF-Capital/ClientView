/**
 * API Client with Enhanced Error Handling
 * Provides a centralized way to make API requests with proper error handling
 */

import { ApiResponse, ApiException } from './types/api'
import { logger } from './logger'

export interface FetchOptions extends RequestInit {
  timeout?: number
  retries?: number
  retryDelay?: number
}

/**
 * Enhanced fetch with timeout, retries, and error handling
 */
export async function apiClient<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = 30000, // 30 seconds default
    retries = 0,
    retryDelay = 1000,
    ...fetchOptions
  } = options

  const startTime = Date.now()
  logger.apiRequest(fetchOptions.method || 'GET', url)

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const duration = Date.now() - startTime
      logger.apiResponse(fetchOptions.method || 'GET', url, response.status, duration)

      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiException(
          errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.code || 'API_ERROR',
          errorData
        )
      }

      // Parse response
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const data = await response.json()
        return data as T
      }

      // Return blob for file downloads
      if (contentType?.includes('application/octet-stream') || 
          contentType?.includes('application/vnd.openxmlformats')) {
        return (await response.blob()) as unknown as T
      }

      // Return text for other content types
      return (await response.text()) as unknown as T

    } catch (error) {
      lastError = error as Error

      // Don't retry on client errors (4xx) or aborts
      if (error instanceof ApiException && error.statusCode >= 400 && error.statusCode < 500) {
        break
      }

      if ((error as Error).name === 'AbortError') {
        throw new ApiException(
          `Request timeout after ${timeout}ms`,
          408,
          'TIMEOUT_ERROR'
        )
      }

      // Retry with delay
      if (attempt < retries) {
        logger.warn(`Request failed, retrying (${attempt + 1}/${retries})...`, { url, error })
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        continue
      }
    }
  }

  // All retries failed
  logger.error(`Request failed after ${retries + 1} attempts`, lastError || undefined, { url })
  throw lastError || new ApiException('Request failed', 500, 'UNKNOWN_ERROR')
}

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  /**
   * GET request
   */
  get: <T = unknown>(url: string, options?: FetchOptions): Promise<T> =>
    apiClient<T>(url, { ...options, method: 'GET' }),

  /**
   * POST request
   */
  post: <T = unknown>(url: string, data?: unknown, options?: FetchOptions): Promise<T> =>
    apiClient<T>(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PUT request
   */
  put: <T = unknown>(url: string, data?: unknown, options?: FetchOptions): Promise<T> =>
    apiClient<T>(url, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * PATCH request
   */
  patch: <T = unknown>(url: string, data?: unknown, options?: FetchOptions): Promise<T> =>
    apiClient<T>(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    }),

  /**
   * DELETE request
   */
  delete: <T = unknown>(url: string, options?: FetchOptions): Promise<T> =>
    apiClient<T>(url, { ...options, method: 'DELETE' }),

  /**
   * Upload file with FormData
   */
  upload: <T = unknown>(url: string, formData: FormData, options?: FetchOptions): Promise<T> =>
    apiClient<T>(url, {
      ...options,
      method: 'POST',
      body: formData,
    }),
}

/**
 * Error handler helper for React components
 */
export function handleApiError(error: unknown): string {
  if (error instanceof ApiException) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred. Please try again.'
}

/**
 * Check if error is a specific HTTP status
 */
export function isHttpError(error: unknown, status: number): boolean {
  return error instanceof ApiException && error.statusCode === status
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return error.message.includes('fetch') || 
         error.message.includes('network') || 
         error.name === 'NetworkError'
}

export default api

