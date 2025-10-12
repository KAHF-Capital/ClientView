/**
 * Security Utilities
 * Provides input validation, sanitization, and security helpers
 */

import { NextRequest } from 'next/server'
import { ApiException } from './types/api'

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validate file upload
 */
export interface FileValidationOptions {
  maxSize?: number // in bytes
  allowedTypes?: string[]
  allowedExtensions?: string[]
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): void {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
    allowedExtensions = ['.pptx'],
  } = options

  // Check file size
  if (file.size > maxSize) {
    throw new ApiException(
      `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
      400,
      'FILE_TOO_LARGE'
    )
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    throw new ApiException(
      `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
      400,
      'INVALID_FILE_TYPE'
    )
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!allowedExtensions.includes(extension)) {
    throw new ApiException(
      `File extension ${extension} is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
      400,
      'INVALID_FILE_EXTENSION'
    )
  }
}

/**
 * Validate URL
 */
export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check if request is from allowed origin
 */
export function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true // Same-origin requests don't have origin header

  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*']
  
  if (allowedOrigins.includes('*')) return true
  
  return allowedOrigins.some(allowed => 
    allowed === origin || origin.endsWith(allowed)
  )
}

/**
 * Generate secure random string
 */
export function generateSecureToken(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomValues[i] % chars.length)
  }
  
  return result
}

/**
 * Hash string (for non-cryptographic purposes)
 */
export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Content Security Policy headers
 */
export function getCSPHeaders(): Record<string, string> {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval/inline
    "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  return {
    'Content-Security-Policy': csp,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}

/**
 * Validate API key format
 */
export function validateApiKey(key: string, prefix: string): boolean {
  return key.startsWith(prefix) && key.length > prefix.length + 10
}

/**
 * Check for SQL injection patterns (basic)
 */
export function containsSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\bunion\b.*\bselect\b)/i,
    /(\bselect\b.*\bfrom\b)/i,
    /(\binsert\b.*\binto\b)/i,
    /(\bupdate\b.*\bset\b)/i,
    /(\bdelete\b.*\bfrom\b)/i,
    /(\bdrop\b.*\btable\b)/i,
    /(\bexec\b.*\(/i,
    /(;.*--)/,
    /('.*or.*'.*=.*')/i,
  ]

  return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * Check for path traversal attempts
 */
export function containsPathTraversal(input: string): boolean {
  const pathPatterns = [
    /\.\./,
    /%2e%2e/i,
    /\.\.%2f/i,
    /%2e%2e%2f/i,
  ]

  return pathPatterns.some(pattern => pattern.test(input))
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/^\.+/, '')
    .substring(0, 255) // Max filename length
}

/**
 * Validate input length
 */
export function validateLength(
  input: string,
  min: number,
  max: number,
  fieldName = 'Input'
): void {
  if (input.length < min) {
    throw new ApiException(
      `${fieldName} must be at least ${min} characters`,
      400,
      'INPUT_TOO_SHORT'
    )
  }

  if (input.length > max) {
    throw new ApiException(
      `${fieldName} must be at most ${max} characters`,
      400,
      'INPUT_TOO_LONG'
    )
  }
}

/**
 * Security middleware for API routes
 */
export function validateSecurity(req: NextRequest): void {
  // Check origin
  if (!isAllowedOrigin(req)) {
    throw new ApiException(
      'Origin not allowed',
      403,
      'ORIGIN_NOT_ALLOWED'
    )
  }

  // Add more security checks as needed
  // - Check for suspicious patterns
  // - Validate authentication tokens
  // - Check IP whitelist/blacklist
  // etc.
}

export default {
  sanitizeInput,
  validateFile,
  validateUrl,
  validateEmail,
  isAllowedOrigin,
  generateSecureToken,
  hashString,
  getCSPHeaders,
  validateApiKey,
  containsSQLInjection,
  containsPathTraversal,
  sanitizeFilename,
  validateLength,
  validateSecurity,
}

