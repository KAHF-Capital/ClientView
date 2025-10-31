'use client'

import { useState } from 'react'
import { Loader2, Edit2, Type, BarChart3, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import ChartEditor from '@/components/ChartEditor'
import { PortfolioAllocation, PerformanceChart, RiskMatrix, BarComparison } from '@/components/Charts'

interface Slide {
  id: string
  index: number
  title: string
  textContent: string
  category: string
  thumbnailUrl: string
  hasCharts?: boolean
  charts?: any[]
  components?: any[]
}

interface SlideCanvasProps {
  slide: Slide | null
  isGenerating: boolean
  onUpdate?: (updates: Partial<Slide>) => void
}

export default function SlideCanvas({ slide, isGenerating, onUpdate }: SlideCanvasProps) {
  const [editMode, setEditMode] = useState<'title' | 'content' | 'chart' | null>(null)
  const [editedTitle, setEditedTitle] = useState('')
  const [editedContent, setEditedContent] = useState('')

  if (!slide) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <Edit2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium">Select a slide to edit</p>
          <p className="text-sm text-gray-400 mt-2">Choose a slide from the library</p>
        </div>
      </div>
    )
  }

  const handleTitleEdit = () => {
    setEditedTitle(slide.title)
    setEditMode('title')
  }

  const handleContentEdit = () => {
    setEditedContent(slide.textContent)
    setEditMode('content')
  }

  const handleSaveTitle = () => {
    if (onUpdate) {
      onUpdate({ title: editedTitle })
    }
    setEditMode(null)
  }

  const handleSaveContent = () => {
    if (onUpdate) {
      onUpdate({ textContent: editedContent })
    }
    setEditMode(null)
  }

  // Render chart based on type
  const renderChart = (chart: any) => {
    if (!chart || !chart.data) return null

    const { type, data, config } = chart
    
    // Handle string data (variable placeholders)
    if (typeof data === 'string') {
      return <div className="text-gray-400 italic">Chart: {data}</div>
    }

    // Sample data if needed
    const sampleData = Array.isArray(data) && data.length > 0 ? data : [
      { name: 'Sample 1', value: 40 },
      { name: 'Sample 2', value: 30 },
      { name: 'Sample 3', value: 30 }
    ]

    switch (type) {
      case 'pie':
      case 'donut':
        return <PortfolioAllocation data={sampleData} type={type as 'pie' | 'donut'} height={300} />
      case 'line':
        return <PerformanceChart data={sampleData} height={300} />
      case 'scatter':
        return <RiskMatrix data={sampleData} height={300} />
      case 'bar':
        return <BarComparison data={sampleData} height={300} />
      default:
        return <div className="text-gray-400 italic">Chart type: {type}</div>
    }
  }

  // Render metric component
  const renderMetric = (component: any) => {
    const { label, value, style } = component
    
    // Handle variable placeholders
    const displayValue = typeof value === 'string' && value.startsWith('{{') 
      ? value.replace('{{', '').replace('}}', '')
      : value || '$0.00'

    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
        <div className="text-sm font-medium text-gray-600 mb-1">{label || 'Metric'}</div>
        <div className="text-2xl font-bold text-green-600">{displayValue}</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Slide {slide.index + 1}</span>
          <span className="text-gray-300">•</span>
          <span className="text-sm text-gray-600">{slide.category}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleTitleEdit}
            size="sm"
            variant="outline"
            className="h-8 text-xs"
          >
            <Type className="w-3 h-3 mr-1" />
            Edit Title
          </Button>
          <Button
            onClick={handleContentEdit}
            size="sm"
            variant="outline"
            className="h-8 text-xs"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit Content
          </Button>
          {slide.hasCharts && (
            <Button
              onClick={() => setEditMode('chart')}
              size="sm"
              variant="outline"
              className="h-8 text-xs"
            >
              <BarChart3 className="w-3 h-3 mr-1" />
              Edit Chart
            </Button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 p-8 overflow-auto flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full aspect-video p-12 relative">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-xl z-10">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-700">Applying changes...</p>
              </div>
            </div>
          )}

          {/* Title */}
          {editMode === 'title' ? (
            <div className="mb-8">
              <Textarea
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-4xl font-bold resize-none min-h-[80px]"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSaveTitle} size="sm" className="bg-green-600 hover:bg-green-700">
                  Save
                </Button>
                <Button onClick={() => setEditMode(null)} size="sm" variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <h1 
              className="text-4xl font-bold text-gray-900 mb-8 cursor-pointer hover:bg-green-50 p-2 -ml-2 rounded transition-colors"
              onClick={handleTitleEdit}
            >
              {slide.title}
            </h1>
          )}

          {/* Content / Graphics */}
          {editMode === 'content' ? (
            <div>
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="text-lg resize-none min-h-[300px]"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={handleSaveContent} size="sm" className="bg-green-600 hover:bg-green-700">
                  Save
                </Button>
                <Button onClick={() => setEditMode(null)} size="sm" variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          ) : editMode === 'chart' ? (
            <ChartEditor
              slideId={slide.id}
              onSave={(data) => {
                console.log('Chart data saved:', data)
                setEditMode(null)
              }}
            />
          ) : (
            <div className="space-y-6">
              {/* Check if slide has components (graphics) */}
              {slide.components && slide.components.length > 0 ? (
                // Render structured components
                <div className="grid grid-cols-1 gap-6">
                  {slide.components.map((component: any, idx: number) => (
                    <div key={idx} className="border-2 border-dashed border-green-300 rounded-lg p-6">
                      {component.type === 'chart' && renderChart(component)}
                      {component.type === 'metric' && renderMetric(component)}
                      {component.type === 'text' && (
                        <div 
                          className="text-lg text-gray-700 whitespace-pre-wrap cursor-pointer hover:bg-green-50 p-2 -ml-2 rounded transition-colors"
                          onClick={handleContentEdit}
                        >
                          {component.content || slide.textContent}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // Fallback to plain text
                <div 
                  className="text-lg text-gray-700 whitespace-pre-wrap cursor-pointer hover:bg-green-50 p-2 -ml-2 rounded transition-colors"
                  onClick={handleContentEdit}
                >
                  {slide.textContent}
                </div>
              )}
            </div>
          )}

          {/* Slide Number */}
          <div className="absolute bottom-6 right-6 text-sm text-gray-400">
            Slide {slide.index + 1}
          </div>
        </div>
      </div>
    </div>
  )
}
