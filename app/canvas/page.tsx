/**
 * Canvas Editor Page
 * Main page for the Canva-style editor
 */

'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { DndContext } from '@dnd-kit/core'
import { useCanvasStore } from '@/lib/stores/canvas-store'
import ComponentLibrary from '@/components/canvas/ComponentLibrary'
import Canvas from '@/components/canvas/Canvas'
import PropertiesPanel from '@/components/canvas/PropertiesPanel'
import CanvasToolbar from '@/components/canvas/CanvasToolbar'
import SlideThumbnails from '@/components/canvas/SlideThumbnails'
import type { Slide } from '@/lib/types/canvas'

function CanvasEditorContent() {
  const { slides, activeSlideId, initialize, addSlide } = useCanvasStore()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCanvas() {
      if (typeof window === 'undefined') return

      // Check if loading a template from URL
      const templateId = searchParams.get('template')
      if (templateId) {
        try {
          const response = await fetch(`/api/templates/canvas?id=${templateId}`)
          if (response.ok) {
            const template = await response.json()
            if (template.slides && Array.isArray(template.slides) && template.slides.length > 0) {
              initialize(template.slides)
              setLoading(false)
              return
            }
          }
        } catch (error) {
          console.warn('Failed to load template:', error)
        }
      }

      // Try to load from localStorage
      const savedData = localStorage.getItem('canvas-data')
      if (savedData) {
        try {
          const parsedSlides = JSON.parse(savedData)
          if (Array.isArray(parsedSlides) && parsedSlides.length > 0) {
            initialize(parsedSlides)
            setLoading(false)
            return
          }
        } catch (error) {
          console.warn('Failed to load saved canvas data:', error)
        }
      }

      // Initialize with a blank slide if no slides exist
      if (slides.length === 0) {
        const initialSlide: Slide = {
          id: 'slide-1',
          index: 0,
          title: 'Slide 1',
          components: [],
          backgroundColor: '#ffffff',
        }
        initialize([initialSlide])
      }
      setLoading(false)
    }

    loadCanvas()
  }, [searchParams])

  const handleSave = async () => {
    // Save to localStorage (only in browser)
    if (typeof window === 'undefined') return
    const data = JSON.stringify(slides)
    localStorage.setItem('canvas-data', data)
    // Also save history
    const { history } = useCanvasStore.getState()
    localStorage.setItem('canvas-history', JSON.stringify(history))
    
    // Save as template
    const templateName = prompt('Enter template name:') || `Template ${new Date().toLocaleDateString()}`
    if (templateName) {
      try {
        const response = await fetch('/api/templates/canvas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: templateName,
            slides,
          }),
        })
        
        if (response.ok) {
          const { id } = await response.json()
          alert(`Template "${templateName}" saved successfully!`)
        } else {
          throw new Error('Failed to save template')
        }
      } catch (error) {
        console.error('Save template error:', error)
        alert('Saved locally, but failed to save as template.')
      }
    }
  }

  const handleExport = async () => {
    // Export to PowerPoint
    try {
      const response = await fetch('/api/export-pptx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides }),
      })

      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'presentation.pptx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z / Cmd+Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        useCanvasStore.getState().undo()
      }
      // Ctrl+Shift+Z / Cmd+Shift+Z - Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        useCanvasStore.getState().redo()
      }
      // Ctrl+Y / Cmd+Y - Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        useCanvasStore.getState().redo()
      }
      // Delete - Delete selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault()
          useCanvasStore.getState().deleteSelected()
        }
      }
      // Ctrl+D / Cmd+D - Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        useCanvasStore.getState().duplicateSelected()
      }
      // Ctrl+A / Cmd+A - Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault()
          useCanvasStore.getState().selectAll()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    )
  }

  if (!activeSlideId) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No slides available</p>
          <button
            onClick={() => addSlide()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create First Slide
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-gray-50">
      <CanvasToolbar onSave={handleSave} onExport={handleExport} />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Component Library */}
        <div className="w-80 border-r bg-white">
          <ComponentLibrary />
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 overflow-hidden">
          <Canvas slideId={activeSlideId} />
        </div>

        {/* Right: Properties Panel */}
        <div className="w-80 border-l bg-white">
          <PropertiesPanel />
        </div>
      </div>

      {/* Bottom: Slide Thumbnails */}
      <SlideThumbnails />
    </div>
  )
}

export default function CanvasEditorPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    }>
      <CanvasEditorContent />
    </Suspense>
  )
}
