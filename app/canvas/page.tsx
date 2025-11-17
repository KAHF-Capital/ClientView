/**
 * Canvas Editor Page
 * Main page for the Canva-style editor
 */

'use client'

import { useEffect } from 'react'
import { DndContext } from '@dnd-kit/core'
import { useCanvasStore } from '@/lib/stores/canvas-store'
import ComponentLibrary from '@/components/canvas/ComponentLibrary'
import Canvas from '@/components/canvas/Canvas'
import PropertiesPanel from '@/components/canvas/PropertiesPanel'
import CanvasToolbar from '@/components/canvas/CanvasToolbar'
import SlideThumbnails from '@/components/canvas/SlideThumbnails'
import type { Slide } from '@/lib/types/canvas'

export default function CanvasEditorPage() {
  const { slides, activeSlideId, initialize, addSlide } = useCanvasStore()

  useEffect(() => {
    // Try to load from localStorage first (only in browser)
    if (typeof window === 'undefined') return
    const savedData = localStorage.getItem('canvas-data')
    if (savedData) {
      try {
        const parsedSlides = JSON.parse(savedData)
        if (Array.isArray(parsedSlides) && parsedSlides.length > 0) {
          initialize(parsedSlides)
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
  }, [])

  const handleSave = () => {
    // Save to localStorage for now (only in browser)
    if (typeof window === 'undefined') return
    const data = JSON.stringify(slides)
    localStorage.setItem('canvas-data', data)
    // Also save history
    const { history } = useCanvasStore.getState()
    localStorage.setItem('canvas-history', JSON.stringify(history))
    alert('Saved successfully!')
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

