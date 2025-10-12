'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'

/**
 * Global Error Handler for App Router
 * This catches errors in Server and Client Components
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('App Error:', error)
    }

    // In production, log to error tracking service
    // Example: Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center mb-8">
          We apologize for the inconvenience. An unexpected error occurred while
          loading this page. Please try again.
        </p>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <h3 className="text-sm font-semibold text-red-900 mb-2">
              Error Details (Development Mode):
            </h3>
            <pre className="text-xs text-red-800 overflow-auto max-h-40 font-mono whitespace-pre-wrap">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>

          <Button
            onClick={() => (window.location.href = '/')}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            size="lg"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 text-center mt-8">
          If this problem persists, please contact support.
        </p>
      </div>
    </div>
  )
}

