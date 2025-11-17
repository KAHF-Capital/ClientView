/**
 * Slide Thumbnails
 * Bottom bar showing slide thumbnails
 */

'use client'

import { useCanvasStore } from '@/lib/stores/canvas-store'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SlideThumbnails() {
  const { slides, activeSlideId, setActiveSlide, addSlide, deleteSlide } = useCanvasStore()

  return (
    <div className="bg-white border-t px-4 py-3 flex items-center gap-3 overflow-x-auto">
      {slides.map((slide) => (
        <div
          key={slide.id}
          onClick={() => setActiveSlide(slide.id)}
          className={`
            flex-shrink-0 w-32 h-20 rounded-lg border-2 cursor-pointer transition-all
            ${
              activeSlideId === slide.id
                ? 'border-green-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-2">
            <div className="text-xs font-medium text-gray-700 mb-1 truncate w-full text-center">
              {slide.title || `Slide ${slide.index + 1}`}
            </div>
            <div className="text-xs text-gray-500">
              {slide.components.length} components
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => addSlide()}
        className="flex-shrink-0 h-20 w-20 border-dashed"
      >
        <Plus className="w-5 h-5" />
      </Button>
    </div>
  )
}

