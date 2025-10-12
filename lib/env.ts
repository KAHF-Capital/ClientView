/**
 * Environment Variable Validation
 * Validates and types environment variables at build/runtime
 */

import { z } from 'zod'

const envSchema = z.object({
  // Anthropic API
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required').optional(),
  
  // Vercel Blob Storage
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'BLOB_READ_WRITE_TOKEN is required').optional(),
  
  // Python Backend
  PYTHON_API_URL: z.string().url('PYTHON_API_URL must be a valid URL').optional(),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse({
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
      PYTHON_API_URL: process.env.PYTHON_API_URL,
      NODE_ENV: process.env.NODE_ENV,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => 
        `${issue.path.join('.')}: ${issue.message}`
      ).join('\n')
      
      console.warn('⚠️  Environment variable validation warnings:\n', issues)
      console.warn('⚠️  Some features may not work correctly. See ENVIRONMENT_SETUP.md')
      
      // Return partial env for development
      return {
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
        PYTHON_API_URL: process.env.PYTHON_API_URL,
        NODE_ENV: (process.env.NODE_ENV as any) || 'development',
      }
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Helper functions
export function isProduction() {
  return env.NODE_ENV === 'production'
}

export function isDevelopment() {
  return env.NODE_ENV === 'development'
}

export function hasAnthropicKey() {
  return !!env.ANTHROPIC_API_KEY && env.ANTHROPIC_API_KEY.startsWith('sk-ant-')
}

export function hasBlobToken() {
  return !!env.BLOB_READ_WRITE_TOKEN
}

export function hasPythonBackend() {
  return !!env.PYTHON_API_URL
}

// Feature flags based on environment
export const features = {
  fileUpload: hasBlobToken(),
  aiEditing: hasAnthropicKey(),
  pptProcessing: hasPythonBackend(),
} as const

