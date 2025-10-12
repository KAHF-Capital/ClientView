/**
 * Centralized Logging System
 * Provides structured logging with different levels
 * In production, integrate with services like Datadog, LogRocket, or Sentry
 */

import { env, isDevelopment, isProduction } from './env'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: unknown
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: Error
}

class Logger {
  private enabled: boolean

  constructor() {
    this.enabled = true
  }

  /**
   * Debug level - detailed information for debugging
   */
  debug(message: string, context?: LogContext) {
    if (isDevelopment()) {
      this.log('debug', message, context)
    }
  }

  /**
   * Info level - general informational messages
   */
  info(message: string, context?: LogContext) {
    this.log('info', message, context)
  }

  /**
   * Warning level - warning messages
   */
  warn(message: string, context?: LogContext) {
    this.log('warn', message, context)
  }

  /**
   * Error level - error messages
   */
  error(message: string, error?: Error, context?: LogContext) {
    this.log('error', message, { ...context, error })
    
    // In production, send to error tracking service
    if (isProduction() && error) {
      this.reportError(error, context)
    }
  }

  /**
   * Log API requests
   */
  apiRequest(method: string, url: string, context?: LogContext) {
    this.debug(`API Request: ${method} ${url}`, context)
  }

  /**
   * Log API responses
   */
  apiResponse(method: string, url: string, status: number, duration: number, context?: LogContext) {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info'
    this.log(level, `API Response: ${method} ${url} - ${status} (${duration}ms)`, context)
  }

  /**
   * Log user actions
   */
  userAction(action: string, context?: LogContext) {
    this.info(`User Action: ${action}`, context)
  }

  /**
   * Log performance metrics
   */
  performance(metric: string, value: number, context?: LogContext) {
    this.debug(`Performance: ${metric} = ${value}ms`, context)
  }

  /**
   * Core logging function
   */
  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.enabled) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    }

    // Console output with colors
    const styles = this.getStyles(level)
    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`

    if (isDevelopment()) {
      // Pretty print in development
      console[level === 'debug' ? 'log' : level](
        `%c${prefix}%c ${message}`,
        styles.prefix,
        styles.message,
        context || ''
      )
    } else {
      // Structured logging in production
      console[level === 'debug' ? 'log' : level](JSON.stringify(entry))
    }

    // Send to analytics in production
    if (isProduction()) {
      this.sendToAnalytics(entry)
    }
  }

  /**
   * Get console styles for different log levels
   */
  private getStyles(level: LogLevel) {
    const styles = {
      debug: {
        prefix: 'color: #6B7280; font-weight: bold',
        message: 'color: #6B7280',
      },
      info: {
        prefix: 'color: #3B82F6; font-weight: bold',
        message: 'color: #1F2937',
      },
      warn: {
        prefix: 'color: #F59E0B; font-weight: bold',
        message: 'color: #92400E',
      },
      error: {
        prefix: 'color: #EF4444; font-weight: bold',
        message: 'color: #991B1B',
      },
    }

    return styles[level]
  }

  /**
   * Send logs to analytics service (placeholder)
   */
  private sendToAnalytics(entry: LogEntry) {
    // In production, send to your analytics service
    // Examples:
    // - Google Analytics
    // - Amplitude
    // - Mixpanel
    // - Custom backend
    
    // Example implementation:
    // try {
    //   fetch('/api/analytics/log', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(entry),
    //   })
    // } catch (error) {
    //   // Fail silently - don't disrupt the app
    // }
  }

  /**
   * Report errors to error tracking service (placeholder)
   */
  private reportError(error: Error, context?: LogContext) {
    // In production, send to error tracking service
    // Examples:
    // - Sentry
    // - Rollbar
    // - Bugsnag
    // - Custom backend
    
    // Example with Sentry:
    // try {
    //   Sentry.captureException(error, {
    //     contexts: { custom: context },
    //   })
    // } catch (err) {
    //   // Fail silently
    // }
  }

  /**
   * Disable logging (useful for testing)
   */
  disable() {
    this.enabled = false
  }

  /**
   * Enable logging
   */
  enable() {
    this.enabled = true
  }
}

// Export singleton instance
export const logger = new Logger()

// Export convenience functions
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context),
  apiRequest: (method: string, url: string, context?: LogContext) => logger.apiRequest(method, url, context),
  apiResponse: (method: string, url: string, status: number, duration: number, context?: LogContext) => 
    logger.apiResponse(method, url, status, duration, context),
  userAction: (action: string, context?: LogContext) => logger.userAction(action, context),
  performance: (metric: string, value: number, context?: LogContext) => logger.performance(metric, value, context),
}

export default logger

