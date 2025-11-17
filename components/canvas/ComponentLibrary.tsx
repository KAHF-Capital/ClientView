/**
 * Component Library Sidebar
 * Displays draggable components organized by category
 */

'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { componentRegistry, getComponentsByCategory } from '@/lib/components/registry'
import type { ComponentDefinition } from '@/lib/components/registry'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface DraggableComponentItemProps {
  definition: ComponentDefinition
}

function DraggableComponentItem({ definition }: DraggableComponentItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${definition.id}`,
    data: {
      type: 'component',
      definition,
    },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined

  const Icon = definition.icon

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        p-3 rounded-lg border border-gray-200 bg-white cursor-grab active:cursor-grabbing
        hover:border-green-500 hover:shadow-md transition-all
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-50 rounded-lg">
          <Icon className="w-5 h-5 text-green-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-gray-900 truncate">{definition.name}</div>
          {definition.description && (
            <div className="text-xs text-gray-500 truncate">{definition.description}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ComponentLibrary() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredRegistry = searchQuery
    ? componentRegistry.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : componentRegistry

  const categories: Array<{ id: ComponentDefinition['category']; label: string }> = [
    { id: 'charts', label: 'Charts' },
    { id: 'text', label: 'Text' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'layout', label: 'Layout' },
    { id: 'media', label: 'Media' },
    { id: 'shapes', label: 'Shapes' },
    { id: 'investment', label: 'Investment' },
  ]

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Components</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="charts" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-2 grid grid-cols-2 w-auto">
          {categories.map((cat) => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          {categories.map((cat) => {
            const components = searchQuery
              ? filteredRegistry.filter((c) => c.category === cat.id)
              : getComponentsByCategory(cat.id)

            return (
              <TabsContent key={cat.id} value={cat.id} className="p-4 space-y-2 mt-0">
                {components.length === 0 ? (
                  <div className="text-center text-sm text-gray-500 py-8">
                    No components found
                  </div>
                ) : (
                  components.map((def) => <DraggableComponentItem key={def.id} definition={def} />)
                )}
              </TabsContent>
            )
          })}
        </div>
      </Tabs>
    </div>
  )
}

