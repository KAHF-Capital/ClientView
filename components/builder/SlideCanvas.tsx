'use client'

import { Loader2 } from 'lucide-react'

interface Slide {
  id: string
  index: number
  title: string
  category: string
  textContent: string
  thumbnailUrl: string
}

interface SlideCanvasProps {
  slide: Slide | null
  isGenerating: boolean
}

export default function SlideCanvas({ slide, isGenerating }: SlideCanvasProps) {
  if (!slide) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a slide from the library to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full p-8 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full aspect-video p-12 relative">
        {isGenerating && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-700">Applying AI changes...</p>
            </div>
          </div>
        )}

        {/* Slide Preview */}
        <div className="h-full flex flex-col">
          {/* Title */}
          {slide.title && (
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {slide.title}
            </h1>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="prose prose-lg max-w-none">
              {slide.textContent.split('\n').map((line, i) => (
                <p key={i} className="text-gray-700 mb-3">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Slide {slide.index + 1}</span>
              <span>{slide.category}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

