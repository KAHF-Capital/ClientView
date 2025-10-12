/**
 * Accessibility Utilities
 * Provides helpers for improving accessibility (a11y) in the application
 */

/**
 * Generate unique ID for ARIA attributes
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Trap focus within an element (useful for modals/dialogs)
 */
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Get contrast ratio between two colors
 * Returns ratio (1-21) where 21 is maximum contrast
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1)
  const l2 = getLuminance(color2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Get relative luminance of a color
 */
function getLuminance(color: string): number {
  // Remove # if present
  color = color.replace('#', '')

  // Convert to RGB
  const r = parseInt(color.substring(0, 2), 16) / 255
  const g = parseInt(color.substring(2, 4), 16) / 255
  const b = parseInt(color.substring(4, 6), 16) / 255

  // Apply gamma correction
  const [rg, gg, bg] = [r, g, b].map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  )

  // Calculate luminance
  return 0.2126 * rg + 0.7152 * gg + 0.0722 * bg
}

/**
 * Check if color combination meets WCAG AA standard
 */
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

/**
 * Check if color combination meets WCAG AAA standard
 */
export function meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background)
  return isLargeText ? ratio >= 4.5 : ratio >= 7
}

/**
 * Keyboard navigation helper
 */
export function handleArrowNavigation(
  e: KeyboardEvent,
  items: HTMLElement[],
  currentIndex: number,
  onChange: (newIndex: number) => void
) {
  let newIndex = currentIndex

  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      e.preventDefault()
      newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
      break

    case 'ArrowUp':
    case 'ArrowLeft':
      e.preventDefault()
      newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
      break

    case 'Home':
      e.preventDefault()
      newIndex = 0
      break

    case 'End':
      e.preventDefault()
      newIndex = items.length - 1
      break

    default:
      return
  }

  onChange(newIndex)
  items[newIndex]?.focus()
}

/**
 * Get skip link targets
 */
export function addSkipLinks() {
  if (typeof document === 'undefined') return

  const skipLinks = document.createElement('div')
  skipLinks.className = 'skip-links'
  skipLinks.innerHTML = `
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded">
      Skip to main content
    </a>
  `

  document.body.insertBefore(skipLinks, document.body.firstChild)
}

/**
 * Format file size for screen readers
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Format number for screen readers
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

/**
 * Format percentage for screen readers
 */
export function formatPercentage(num: number): string {
  return `${num} percent`
}

/**
 * Format date for screen readers
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-contrast: high)').matches
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default {
  generateAriaId,
  announceToScreenReader,
  trapFocus,
  getContrastRatio,
  meetsWCAGAA,
  meetsWCAGAAA,
  handleArrowNavigation,
  addSkipLinks,
  formatFileSize,
  formatNumber,
  formatPercentage,
  formatDate,
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkMode,
}

