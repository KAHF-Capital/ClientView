'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const CATEGORIES = [
  'Current Allocation',
  'Target Allocation', 
  'Performance',
  'Risk/Reward',
  'Pacing',
  'Fees',
  'Appendix',
  'Disclosures'
]

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

interface Slide {
  id: string
  index: number
  title: string
  category: string
  thumbnailUrl: string
  variables: string[]
  hasCharts: boolean
}

interface Template {
  name: string
  slideCount: number
  variableCount: number
  categoryCount: number
  slides: Slide[]
}

export default function TemplateReviewPage({ params }: { params: { id: string } }) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadTemplate()
  }, [])

  async function loadTemplate() {
    try {
      const res = await fetch(`/api/template/${params.id}`)
      const data = await res.json()
      setTemplate(data)
    } catch (error) {
      console.error('Error loading template:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSlides = selectedCategory === 'All'
    ? template?.slides
    : template?.slides.filter(s => s.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading template...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Template Library
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {template?.slideCount} slides · {template?.variableCount} variables · {template?.categoryCount} categories
              </p>
            </div>
            <Button
              onClick={() => router.push(`/builder/${params.id}`)}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Continue to Builder
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <CategoryButton
              label="All"
              active={selectedCategory === 'All'}
              onClick={() => setSelectedCategory('All')}
              count={template?.slideCount || 0}
            />
            {CATEGORIES.map(cat => (
              <CategoryButton
                key={cat}
                label={cat}
                active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                count={template?.slides?.filter(s => s.category === cat).length || 0}
                color={CATEGORY_COLORS[cat]}
              />
            ))}
          </div>
        </div>

        {/* Slide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSlides?.map((slide, index) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SlideCard({ slide, index }: { slide: Slide; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      {/* Slide Thumbnail */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <span className="text-4xl font-bold">{slide.index + 1}</span>
        </div>
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-sm font-medium text-gray-700">
          Slide {slide.index + 1}
        </div>
      </div>

      {/* Slide Info */}
      <div className="p-4">
        <Badge className={CATEGORY_COLORS[slide.category]}>
          {slide.category}
        </Badge>
        
        {slide.title && (
          <h3 className="mt-2 font-medium text-gray-900 line-clamp-2">
            {slide.title}
          </h3>
        )}

        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <span>{slide.variables.length} variables</span>
          {slide.hasCharts && (
            <span className="text-indigo-600">Contains charts</span>
          )}
        </div>

        {/* Variable Preview */}
        {slide.variables.length > 0 && (
          <div className="mt-3 pt-3 border-t">
            <div className="text-xs text-gray-500 mb-2">Variables:</div>
            <div className="flex flex-wrap gap-1">
              {slide.variables.slice(0, 3).map(v => (
                <Badge
                  key={v}
                  variant="outline"
                  className="text-xs"
                >
                  {v}
                </Badge>
              ))}
              {slide.variables.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{slide.variables.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CategoryButton({ 
  label, 
  active, 
  onClick, 
  count, 
  color = 'bg-gray-100 text-gray-700' 
}: { 
  label: string
  active: boolean
  onClick: () => void
  count: number
  color?: string
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all
        ${active 
          ? 'bg-indigo-600 text-white shadow-md' 
          : `${color} hover:shadow-md`
        }
      `}
    >
      {label}
      {count > 0 && (
        <span className="ml-2 opacity-75">({count})</span>
      )}
    </button>
  )
}

