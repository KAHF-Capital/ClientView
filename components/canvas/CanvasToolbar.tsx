/**
 * Canvas Toolbar
 * Top bar with actions, zoom, and view controls
 */

'use client'

import { Button } from '@/components/ui/button'
import {
  Save,
  Download,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Grid,
  Maximize2,
  Copy,
  Trash2,
} from 'lucide-react'
import { useCanvasStore } from '@/lib/stores/canvas-store'

interface CanvasToolbarProps {
  onSave?: () => void
  onExport?: () => void
}

export default function CanvasToolbar({ onSave, onExport }: CanvasToolbarProps) {
  const {
    zoom,
    setZoom,
    showGrid,
    toggleGrid,
    snapToGrid,
    toggleSnapToGrid,
    undo,
    redo,
    history,
    historyIndex,
    selectedComponentIds,
    deleteSelected,
    duplicateSelected,
  } = useCanvasStore()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1
  const hasSelection = selectedComponentIds.length > 0

  return (
    <div className="bg-white border-b px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-gray-900">Canvas Editor</h1>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
        {hasSelection && (
          <>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={duplicateSelected}
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteSelected}
                title="Delete (Delete)"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* View Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleGrid}
            className={showGrid ? 'bg-green-50 text-green-700' : ''}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </Button>
          <div className="text-xs text-gray-500 px-2">
            {zoom}%
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.max(25, zoom - 25))}
            disabled={zoom <= 25}
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(100)}
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom(Math.min(200, zoom + 25))}
            disabled={zoom >= 200}
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <span className="text-gray-300">|</span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onSave && (
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}
          {onExport && (
            <Button
              size="sm"
              onClick={onExport}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

