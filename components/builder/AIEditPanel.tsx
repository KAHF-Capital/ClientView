'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Wand2, Loader2, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'

interface Slide {
  id: string
  index: number
  title: string
  category: string
  variables: Record<string, string>
}

interface AIEditPanelProps {
  slide: Slide | null
  onEdit: (instruction: string) => void
  isGenerating: boolean
  templateTheme?: {
    colors: string[]
    fontFamily: string
  }
}

export default function AIEditPanel({ 
  slide, 
  onEdit, 
  isGenerating, 
  templateTheme 
}: AIEditPanelProps) {
  const [instruction, setInstruction] = useState('')
  const [variables, setVariables] = useState<Record<string, string>>(slide?.variables || {})

  const quickActions = [
    { 
      icon: TrendingUp, 
      label: 'Update all numbers by 5%', 
      instruction: 'Increase all numeric values by 5%' 
    },
    { 
      icon: BarChart3, 
      label: 'Change chart to pie chart', 
      instruction: 'Convert the current chart to a pie chart' 
    },
    { 
      icon: DollarSign, 
      label: 'Add currency formatting', 
      instruction: 'Format all numbers as currency with $ and commas' 
    },
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2 mb-2">
          <Wand2 className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            AI Editor
          </h2>
        </div>
        <p className="text-sm text-gray-600">
          {slide
            ? `Editing Slide ${slide.index + 1}: ${slide.category}`
            : 'Select a slide to edit'
          }
        </p>
      </div>

      {!slide ? (
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <p className="text-gray-500">
            Select a slide from the library to start editing
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* AI Instruction Input */}
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Tell AI what to change
              </Label>
              <Textarea
                placeholder="E.g., 'Change the title to focus on long-term growth' or 'Update the chart to show quarterly data'"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <Button
                onClick={() => {
                  onEdit(instruction)
                  setInstruction('')
                }}
                disabled={!instruction || isGenerating}
                className="w-full mt-3 bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Apply Changes
                  </>
                )}
              </Button>
            </div>

            <Separator />

            {/* Quick Actions */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Quick Actions
              </Label>
              <div className="space-y-2">
                {quickActions.map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => onEdit(action.instruction)}
                    disabled={isGenerating}
                  >
                    <action.icon className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Variables */}
            {slide.variables && Object.keys(slide.variables).length > 0 && (
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Variables
                </Label>
                <div className="space-y-3">
                  {Object.entries(slide.variables).map(([key, value]) => (
                    <div key={key}>
                      <Label className="text-xs text-gray-500 mb-1">
                        {formatVariableName(key)}
                      </Label>
                      <Input
                        value={value as string}
                        onChange={(e) => {
                          const newVars = { ...variables, [key]: e.target.value }
                          setVariables(newVars)
                          onEdit(`Update variable ${key} to ${e.target.value}`)
                        }}
                        placeholder={`Enter ${key}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Theme Colors */}
            {templateTheme && (
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Template Theme
                </Label>
                <div className="flex space-x-2">
                  {templateTheme.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  AI will maintain these colors in all edits
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function formatVariableName(name: string) {
  return name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

