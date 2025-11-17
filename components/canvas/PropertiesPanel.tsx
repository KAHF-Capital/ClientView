/**
 * Properties Panel
 * Edit properties of selected components
 */

'use client'

import { useCanvasStore } from '@/lib/stores/canvas-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, Copy, Lock, Unlock } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function PropertiesPanel() {
  const {
    slides,
    activeSlideId,
    selectedComponentIds,
    updateComponent,
    deleteComponent,
    duplicateComponent,
    clearSelection,
  } = useCanvasStore()

  const activeSlide = slides.find((s) => s.id === activeSlideId)
  const selectedComponents =
    activeSlide?.components.filter((c) => selectedComponentIds.includes(c.id)) || []

  if (selectedComponents.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 p-8 text-center">
        <div>
          <p className="text-sm">No component selected</p>
          <p className="text-xs text-gray-400 mt-2">Click on a component to edit its properties</p>
        </div>
      </div>
    )
  }

  // For now, only edit the first selected component
  const component = selectedComponents[0]

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Properties</h3>
        {selectedComponents.length === 1 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => duplicateComponent(component.id)}
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteComponent(component.id)}
              title="Delete"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {selectedComponents.length > 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          {selectedComponents.length} components selected
        </div>
      )}

      <ComponentProperties component={component} onUpdate={updateComponent} />
    </div>
  )
}

function ComponentProperties({
  component,
  onUpdate,
}: {
  component: any
  onUpdate: (id: string, updates: any) => void
}) {
  const [localProps, setLocalProps] = useState(component.props || {})
  const [localStyle, setLocalStyle] = useState(component.style || {})
  const [localPosition, setLocalPosition] = useState(component.position || { x: 0, y: 0 })
  const [localSize, setLocalSize] = useState(component.size || { width: 0, height: 0 })

  useEffect(() => {
    setLocalProps(component.props || {})
    setLocalStyle(component.style || {})
    setLocalPosition(component.position || { x: 0, y: 0 })
    setLocalSize(component.size || { width: 0, height: 0 })
  }, [component.id])

  const handleUpdate = (updates: any) => {
    onUpdate(component.id, updates)
  }

  return (
    <div className="space-y-6">
      {/* Position & Size */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Position & Size</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">X</Label>
            <Input
              type="number"
              value={localPosition.x}
              onChange={(e) => {
                const x = parseInt(e.target.value) || 0
                setLocalPosition({ ...localPosition, x })
                handleUpdate({ position: { ...localPosition, x } })
              }}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Y</Label>
            <Input
              type="number"
              value={localPosition.y}
              onChange={(e) => {
                const y = parseInt(e.target.value) || 0
                setLocalPosition({ ...localPosition, y })
                handleUpdate({ position: { ...localPosition, y } })
              }}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Width</Label>
            <Input
              type="number"
              value={localSize.width}
              onChange={(e) => {
                const width = parseInt(e.target.value) || 0
                setLocalSize({ ...localSize, width })
                handleUpdate({ size: { ...localSize, width } })
              }}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Height</Label>
            <Input
              type="number"
              value={localSize.height}
              onChange={(e) => {
                const height = parseInt(e.target.value) || 0
                setLocalSize({ ...localSize, height })
                handleUpdate({ size: { ...localSize, height } })
              }}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Style */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700">Style</h4>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Background Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={localStyle.backgroundColor || '#ffffff'}
                onChange={(e) => {
                  const backgroundColor = e.target.value
                  setLocalStyle({ ...localStyle, backgroundColor })
                  handleUpdate({ style: { ...localStyle, backgroundColor } })
                }}
                className="h-8 w-16 p-1"
              />
              <Input
                type="text"
                value={localStyle.backgroundColor || '#ffffff'}
                onChange={(e) => {
                  const backgroundColor = e.target.value
                  setLocalStyle({ ...localStyle, backgroundColor })
                  handleUpdate({ style: { ...localStyle, backgroundColor } })
                }}
                className="h-8 text-sm flex-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Border Radius</Label>
            <Input
              type="number"
              value={localStyle.borderRadius || 0}
              onChange={(e) => {
                const borderRadius = parseInt(e.target.value) || 0
                setLocalStyle({ ...localStyle, borderRadius })
                handleUpdate({ style: { ...localStyle, borderRadius } })
              }}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Padding</Label>
            <Input
              type="number"
              value={localStyle.padding || 0}
              onChange={(e) => {
                const padding = parseInt(e.target.value) || 0
                setLocalStyle({ ...localStyle, padding })
                handleUpdate({ style: { ...localStyle, padding } })
              }}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Component-specific properties */}
      {component.type === 'text' && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Text</h4>
          <div>
            <Label className="text-xs">Content</Label>
            <Textarea
              value={localProps.content || ''}
              onChange={(e) => {
                const content = e.target.value
                setLocalProps({ ...localProps, content })
                handleUpdate({ props: { ...localProps, content } })
              }}
              className="text-sm min-h-[100px]"
            />
          </div>
          <div>
            <Label className="text-xs">Font Size</Label>
            <Input
              type="number"
              value={localProps.fontSize || 16}
              onChange={(e) => {
                const fontSize = parseInt(e.target.value) || 16
                setLocalProps({ ...localProps, fontSize })
                handleUpdate({ props: { ...localProps, fontSize } })
              }}
              className="h-8 text-sm"
            />
          </div>
        </div>
      )}

      {component.type === 'metric' && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Metric</h4>
          <div>
            <Label className="text-xs">Label</Label>
            <Input
              type="text"
              value={localProps.label || ''}
              onChange={(e) => {
                const label = e.target.value
                setLocalProps({ ...localProps, label })
                handleUpdate({ props: { ...localProps, label } })
              }}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Value</Label>
            <Input
              type="text"
              value={localProps.value || ''}
              onChange={(e) => {
                const value = e.target.value
                setLocalProps({ ...localProps, value })
                handleUpdate({ props: { ...localProps, value } })
              }}
              className="h-8 text-sm"
            />
          </div>
        </div>
      )}

      {component.type === 'chart' && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-700">Chart</h4>
          <div>
            <Label className="text-xs">Chart Type</Label>
            <Input
              type="text"
              value={localProps.chartType || ''}
              disabled
              className="h-8 text-sm bg-gray-100"
            />
          </div>
          <div>
            <Label className="text-xs">Data (JSON)</Label>
            <Textarea
              value={JSON.stringify(localProps.data || [], null, 2)}
              onChange={(e) => {
                try {
                  const data = JSON.parse(e.target.value)
                  setLocalProps({ ...localProps, data })
                  handleUpdate({ props: { ...localProps, data } })
                } catch (err) {
                  // Invalid JSON, don't update
                }
              }}
              className="text-xs min-h-[100px] font-mono"
            />
          </div>
        </div>
      )}
    </div>
  )
}

