import { Skeleton } from '@/components/ui/skeleton'

/**
 * Slide Card Skeleton
 * Loading placeholder for slide cards in the template library
 */
export function SlideCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
      {/* Thumbnail */}
      <Skeleton className="w-full h-48" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  )
}

/**
 * Template Library Skeleton
 * Loading state for the entire template library grid
 */
export function TemplateLibrarySkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-8">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <SlideCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

/**
 * Builder Skeleton
 * Loading state for the builder interface
 */
export function BuilderSkeleton() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r p-4 space-y-4">
          <Skeleton className="h-6 w-32 mb-4" />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>

        {/* Center Canvas */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
          <Skeleton className="w-full max-w-4xl h-[600px]" />
        </div>

        {/* Right Panel */}
        <div className="w-96 bg-white border-l p-6 space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Analysis Progress Skeleton
 * Loading state for analysis page
 */
export function AnalysisProgressSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>

        {/* Title */}
        <Skeleton className="h-8 w-64 mx-auto mb-4" />
        
        {/* Description */}
        <Skeleton className="h-4 w-96 mx-auto mb-8" />

        {/* Progress Bar */}
        <div className="mb-8">
          <Skeleton className="h-4 w-full rounded-full" />
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Generic Page Skeleton
 * Default loading state for pages
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="h-12 w-96 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Table Skeleton
 * Loading state for tables
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      
      {/* Rows */}
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4 py-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  )
}

