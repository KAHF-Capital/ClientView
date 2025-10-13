'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Save } from 'lucide-react'
import SlideLibrary from '@/components/builder/SlideLibrary'
import SlideCanvas from '@/components/builder/SlideCanvas'
import AIEditPanel from '@/components/builder/AIEditPanel'

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

interface Template {
  name: string
  slides: Slide[]
  theme: {
    colors: string[]
    fontFamily: string
    titleSize: number
    bodySize: number
  }
}

export default function BuilderPage({ params }: { params: { id: string } }) {
  const [template, setTemplate] = useState<Template | null>(null)
  const [selectedSlides, setSelectedSlides] = useState<Slide[]>([])
  const [activeSlide, setActiveSlide] = useState<Slide | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplate()
  }, [])

  async function loadTemplate() {
    try {
      const res = await fetch(`/api/template/${params.id}`)
      const data = await res.json()
      setTemplate(data)
      // Pre-select all slides
      setSelectedSlides(data.slides)
      // Set first slide as active
      if (data.slides.length > 0) {
        setActiveSlide(data.slides[0])
      }
    } catch (error) {
      console.error('Error loading template:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleAIEdit(instruction: string) {
    if (!activeSlide || !template) return

    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai/edit-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slideId: activeSlide.id,
          instruction,
          templateTheme: template.theme
        })
      })

      if (!res.ok) {
        throw new Error('Edit failed')
      }

      const updatedSlide = await res.json()
      
      // Update the slide in selected slides
      setSelectedSlides(slides =>
        slides.map(s => s.id === activeSlide.id ? updatedSlide : s)
      )
      setActiveSlide(updatedSlide)
    } catch (error) {
      console.error('AI edit failed:', error)
      alert('Edit failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleDownload() {
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: params.id,
          slides: selectedSlides
        })
      })

      if (!res.ok) {
        throw new Error('Generation failed')
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${template?.name || 'presentation'}.pptx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading builder...</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            ClientView Builder
          </h1>
          <span className="text-gray-400">|</span>
          <span className="text-gray-600">{template?.name}</span>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          <Button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Presentation
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Slide Library */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <SlideLibrary
            slides={template?.slides || []}
            selectedSlides={selectedSlides}
            activeSlide={activeSlide}
            onSelectSlide={setActiveSlide}
            onReorder={setSelectedSlides}
          />
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          <SlideCanvas
            slide={activeSlide}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right: AI Edit Panel */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <AIEditPanel
            slide={activeSlide}
            onEdit={handleAIEdit}
            isGenerating={isGenerating}
            templateTheme={template?.theme}
          />
        </div>
      </div>
    </div>
  )
}

