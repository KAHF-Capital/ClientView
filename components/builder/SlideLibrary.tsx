'use client'

import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'

interface Slide {
  id: string
  index: number
  title: string
  category: string
  thumbnailUrl: string
  variables: Record<string, string>
}

interface SlideLibraryProps {
  slides: Slide[]
  selectedSlides: Slide[]
  activeSlide: Slide | null
  onSelectSlide: (slide: Slide) => void
  onReorder: (slides: Slide[]) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  'Current Allocation': 'bg-blue-100 text-blue-700',
  'Target Allocation': 'bg-green-100 text-green-700',
  'Performance': 'bg-purple-100 text-purple-700',
  'Risk/Reward': 'bg-orange-100 text-orange-700',
  'Pacing': 'bg-pink-100 text-pink-700',
  'Fees': 'bg-yellow-100 text-yellow-700',
  'Appendix': 'bg-gray-100 text-gray-700',
  'Disclosures': 'bg-red-100 text-red-700'
}

export default function SlideLibrary({
  slides,
  activeSlide,
  onSelectSlide
}: SlideLibraryProps) {
  return (
    <div className="h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Slide Library
          </h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {slides.length} slides available
        </p>
      </div>

      {/* Slide List */}
      <div className="p-4 space-y-3">
        {slides.map((slide) => (
          <div
            key={slide.id}
            onClick={() => onSelectSlide(slide)}
            className={`
              p-3 rounded-lg border-2 cursor-pointer transition-all
              ${activeSlide?.id === slide.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            {/* Thumbnail */}
            <div className="aspect-video bg-gray-100 rounded mb-2 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-400">
                {slide.index + 1}
              </span>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <Badge className={`${CATEGORY_COLORS[slide.category]} text-xs`}>
                {slide.category}
              </Badge>
              
              {slide.title && (
                <p className="text-sm font-medium text-gray-900 line-clamp-2">
                  {slide.title}
                </p>
              )}

              <p className="text-xs text-gray-500">
                {Object.keys(slide.variables).length} variables
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

