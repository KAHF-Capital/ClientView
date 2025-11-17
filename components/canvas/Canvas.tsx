/**
 * Canvas Component
 * Main drag-and-drop canvas for editing slides
 */

'use client'

import { useCallback, useRef, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { useCanvasStore } from '@/lib/stores/canvas-store'
import ComponentRenderer from './ComponentRenderer'
import type { CanvasComponent } from '@/lib/types/canvas'
import { createComponentFromDefinition } from '@/lib/components/registry'
import type { ComponentDefinition } from '@/lib/components/registry'

interface CanvasProps {
  slideId: string
  width?: number
  height?: number
}

function DroppableCanvas({ children, slideId }: { children: React.ReactNode; slideId: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `canvas-${slideId}`,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        relative bg-white border-2 border-dashed rounded-lg
        ${isOver ? 'border-green-500 bg-green-50' : 'border-gray-300'}
        transition-colors
      `}
      style={{ width: '100%', height: '100%', minHeight: '600px' }}
    >
      {children}
    </div>
  )
}

export default function Canvas({ slideId, width = 1920, height = 1080 }: CanvasProps) {
  const {
    slides,
    selectedComponentIds,
    selectComponent,
    clearSelection,
    addComponent,
    moveComponent,
    showGrid,
    snapToGrid,
    gridSize,
    zoom,
  } = useCanvasStore()

  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const slide = slides.find((s) => s.id === slideId)
  const activeComponent = activeId
    ? slide?.components.find((c) => c.id === activeId)
    : null

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)

    // If dragging a component from the library
    if (active.data.current?.type === 'component') {
      const definition = active.data.current.definition as ComponentDefinition
      // Store the definition for later use
      setActiveId(`new-${definition.id}`)
    } else {
      // If dragging an existing component
      const component = slide?.components.find((c) => c.id === active.id)
      if (component) {
        selectComponent(component.id)
      }
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    // If dragging a new component from library
    if (active.data.current?.type === 'component' && over.id === `canvas-${slideId}`) {
      const rect = (over.rect as any)?.getBoundingClientRect?.()
      const activatorEvent = (event as any).activatorEvent as MouseEvent | undefined
      if (rect && activatorEvent) {
        const x = activatorEvent.clientX - rect.left
        const y = activatorEvent.clientY - rect.top
        setDragOffset({ x, y })
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      setDragOffset(null)
      return
    }

    // If dropping a new component from library
    if (active.data.current?.type === 'component' && over.id === `canvas-${slideId}`) {
      const definition = active.data.current.definition as ComponentDefinition
      const canvasRect = (over.rect as any)?.getBoundingClientRect?.()
      const activatorEvent = (event as any).activatorEvent as MouseEvent | undefined

      if (canvasRect && activatorEvent) {
        const x = activatorEvent.clientX - canvasRect.left
        const y = activatorEvent.clientY - canvasRect.top

        // Snap to grid if enabled
        const snappedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x
        const snappedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y

        const component = createComponentFromDefinition(definition, {
          x: snappedX,
          y: snappedY,
        })

        addComponent(component)
      }
    }

    // If moving an existing component
    if (active.id.toString().startsWith('component-')) {
      const componentId = active.id.toString().replace('component-', '')
      const canvasRect = (over.rect as any)?.getBoundingClientRect?.()
      const activatorEvent = (event as any).activatorEvent as MouseEvent | undefined

      if (canvasRect && over.id === `canvas-${slideId}` && activatorEvent) {
        const x = activatorEvent.clientX - canvasRect.left
        const y = activatorEvent.clientY - canvasRect.top

        const snappedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x
        const snappedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y

        moveComponent(componentId, { x: snappedX, y: snappedY })
      }
    }

    setActiveId(null)
    setDragOffset(null)
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection()
    }
  }

  if (!slide) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Slide not found
      </div>
    )
  }

  const scale = zoom / 100

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex-1 overflow-auto bg-gray-100 p-8"
        onClick={handleCanvasClick}
        style={{ cursor: 'default' }}
      >
        <div className="flex items-center justify-center min-h-full">
          <div
            style={{
              width: `${width * scale}px`,
              height: `${height * scale}px`,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
            }}
          >
            <DroppableCanvas slideId={slideId}>
              {/* Grid background */}
              {showGrid && (
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                    `,
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                  }}
                />
              )}

              {/* Slide background */}
              <div
                className="absolute inset-0"
                style={{ backgroundColor: slide.backgroundColor || '#ffffff' }}
              />

              {/* Components */}
              {slide.components.map((component) => (
                <DraggableComponent
                  key={component.id}
                  component={component}
                  isSelected={selectedComponentIds.includes(component.id)}
                  onSelect={() => selectComponent(component.id)}
                />
              ))}

              {/* Drag overlay preview */}
              {activeId && activeId.startsWith('new-') && dragOffset && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${dragOffset.x}px`,
                    top: `${dragOffset.y}px`,
                    opacity: 0.5,
                    pointerEvents: 'none',
                  }}
                >
                  {activeComponent && (
                    <ComponentRenderer component={activeComponent} isSelected />
                  )}
                </div>
              )}
            </DroppableCanvas>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId && activeComponent && (
          <div style={{ opacity: 0.5 }}>
            <ComponentRenderer component={activeComponent} isSelected />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

function DraggableComponent({
  component,
  isSelected,
  onSelect,
}: {
  component: CanvasComponent
  isSelected: boolean
  onSelect: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${component.id}`,
    data: {
      type: 'existing-component',
      component,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <ComponentRenderer component={component} isSelected={isSelected} onClick={onSelect} />
    </div>
  )
}

