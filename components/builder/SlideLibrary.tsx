'use client'

import { Badge } from '@/components/ui/badge'
import { FileText, BarChart3, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface Slide {
  id: string
  index: number
  title: string
  category: string
  textContent: string
  thumbnailUrl: string
  variables: Record<string, string>
  hasCharts: boolean
  charts: any[]
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
    <div className="h-full bg-white">
      {/* Header */}
      <div className="p-5 border-b bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="flex items-center space-x-2 mb-2">
          <div className="bg-green-600 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            Slide Library
          </h2>
        </div>
        <p className="text-sm text-gray-600 font-medium">
          {slides.length} slides • {activeSlide ? 'Currently editing' : 'Select to edit'}
        </p>
      </div>

      {/* Slide List */}
      <div className="p-4 space-y-3 overflow-y-auto">
        {slides.map((slide, idx) => (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onSelectSlide(slide)}
            className={`
              p-4 rounded-xl border-2 cursor-pointer transition-all
              ${activeSlide?.id === slide.id
                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-[1.02]'
                : 'border-gray-200 hover:border-green-300 hover:shadow-md bg-white'
              }
            `}
          >
            {/* Thumbnail */}
            <div className={`aspect-video rounded-lg mb-3 flex items-center justify-center relative overflow-hidden ${
              activeSlide?.id === slide.id ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-gray-100 to-gray-200'
            }`}>
              {slide.hasCharts ? (
                <BarChart3 className={`w-12 h-12 ${activeSlide?.id === slide.id ? 'text-white' : 'text-green-600'}`} />
              ) : (
                <span className={`text-3xl font-bold ${activeSlide?.id === slide.id ? 'text-white' : 'text-gray-400'}`}>
                  {slide.index + 1}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="space-y-2">
              <Badge className={`${CATEGORY_COLORS[slide.category]} text-xs font-semibold`}>
                {slide.category}
              </Badge>
              
              {slide.title && (
                <p className={`text-sm font-semibold line-clamp-2 ${
                  activeSlide?.id === slide.id ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {slide.title}
                </p>
              )}

              <div className="flex items-center gap-3 text-xs text-gray-500">
                {slide.hasCharts && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Charts</span>
                  </div>
                )}
                {Object.keys(slide.variables).length > 0 && (
                  <div className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    <span>{Object.keys(slide.variables).length} vars</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

