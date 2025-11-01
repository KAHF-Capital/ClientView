'use client'

import { useState } from 'react'
import { Loader2, Edit2, Type, BarChart3, TrendingUp, Sparkles } from 'lucide-react'
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
  const renderChart = (chart: any, config: any = {}) => {
    if (!chart || !chart.data) return null

    const { type, data } = chart
    
    // Handle string data (variable placeholders)
    if (typeof data === 'string') {
      return (
        <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-400">
            <BarChart3 className="w-12 h-12 mx-auto mb-2" />
            <div className="text-sm">Chart: {data}</div>
          </div>
        </div>
      )
    }

    // Use provided data
    const sampleData = Array.isArray(data) && data.length > 0 ? data : [
      { name: 'Sample 1', value: 40 },
      { name: 'Sample 2', value: 30 },
      { name: 'Sample 3', value: 30 }
    ]

    switch (type) {
      case 'pie':
      case 'donut':
        return (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <PortfolioAllocation data={sampleData} type={type as 'pie' | 'donut'} height={config.height || 280} />
          </div>
        )
      case 'line':
        return (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <PerformanceChart data={sampleData} height={config.height || 280} />
          </div>
        )
      case 'scatter':
        return (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <RiskMatrix data={sampleData} height={config.height || 280} />
          </div>
        )
      case 'bar':
        return (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <BarComparison data={sampleData} height={config.height || 280} />
          </div>
        )
      default:
        return (
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <div className="text-sm">Chart type: {type}</div>
            </div>
          </div>
        )
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
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-sm font-medium text-gray-600 mb-2">{label || 'Metric'}</div>
        <div className="text-3xl font-bold text-green-600">{displayValue}</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Slide {slide.index + 1}</span>
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
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Slide Preview Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 relative">
            {isGenerating && (
              <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-2xl z-10">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">Applying changes...</p>
                </div>
              </div>
            )}

            {/* Title Section */}
            {editMode === 'title' ? (
              <div className="mb-10">
                <Textarea
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-5xl font-bold resize-none min-h-[100px] border-2 border-green-500"
                  autoFocus
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSaveTitle} size="sm" className="bg-green-600 hover:bg-green-700">
                    Save Title
                  </Button>
                  <Button onClick={() => setEditMode(null)} size="sm" variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mb-10">
                <h1 
                  className="text-5xl font-bold text-gray-900 mb-2 cursor-pointer hover:bg-green-50 p-3 -ml-3 rounded-lg transition-colors inline-block"
                  onClick={handleTitleEdit}
                >
                  {slide.title}
                </h1>
                <p className="text-xs text-gray-400 mt-2">Click title to edit</p>
              </div>
            )}

            {/* Content / Graphics */}
            {editMode === 'content' ? (
              <div>
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="text-lg resize-none min-h-[400px] border-2 border-green-500"
                  autoFocus
                />
                <div className="flex gap-2 mt-4">
                  <Button onClick={handleSaveContent} size="sm" className="bg-green-600 hover:bg-green-700">
                    Save Content
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
              <div className="space-y-8">
                {/* Check if slide has components (graphics) */}
                {slide.components && slide.components.length > 0 ? (
                  // Render structured components in a professional layout
                  <div className="space-y-8">
                    {slide.components.map((component: any, idx: number) => {
                      // Handle multiple charts in a row
                      if (component.type === 'chart' && idx > 0 && slide.components && slide.components[idx - 1]?.type === 'chart' && slide.components[idx - 1]) {
                        return (
                          <div key={idx} className="relative group">
                            {renderChart(component, component.config)}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="ghost" className="bg-white/90">
                                <Edit2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      }

                      // Handle metrics grid
                      if (component.type === 'metric' && slide.components) {
                        const metrics = slide.components.filter((c: any) => c.type === 'metric')
                        const metricIndex = metrics.indexOf(component)
                        
                        // Render first metric to trigger grid
                        if (metricIndex === 0) {
                          return (
                            <div key={`metrics-${idx}`} className="grid grid-cols-3 gap-6">
                              {metrics.map((metric: any, mIdx: number) => (
                                <div key={mIdx}>{renderMetric(metric)}</div>
                              ))}
                            </div>
                          )
                        }
                        return null // Already rendered
                      }

                      // Render charts
                      if (component.type === 'chart') {
                        return (
                          <div key={idx} className="relative group">
                            {renderChart(component, component.config)}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button size="sm" variant="ghost" className="bg-white/90">
                                <Edit2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        )
                      }

                      // Render text content
                      if (component.type === 'text') {
                        return (
                          <div 
                            key={idx}
                            className="prose prose-lg max-w-none cursor-pointer hover:bg-green-50 p-6 rounded-lg transition-colors"
                            onClick={handleContentEdit}
                          >
                            <p className="text-gray-700 leading-relaxed">{component.content || slide.textContent}</p>
                            <p className="text-xs text-gray-400 mt-2">Click to edit</p>
                          </div>
                        )
                      }

                      return null
                    })}
                  </div>
                ) : (
                  // Fallback to plain text with professional styling
                  <div 
                    className="prose prose-lg max-w-none cursor-pointer hover:bg-green-50 p-6 rounded-lg transition-colors"
                    onClick={handleContentEdit}
                  >
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{slide.textContent || 'No content yet. Click to add text.'}</p>
                    <p className="text-xs text-gray-400 mt-2">Click to edit</p>
                  </div>
                )}
              </div>
            )}

            {/* Slide Number */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 text-sm text-gray-400">
              <span>Slide {slide.index + 1}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
