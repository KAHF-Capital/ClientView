'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Download, RefreshCw, User, Calendar, DollarSign, Percent } from 'lucide-react'
import type { DetectedVariable } from '@/lib/pptx-parser'

interface VariableEditorProps {
  variables: DetectedVariable[]
  onReplacementsChange: (replacements: Record<string, string>) => void
  onExport: () => void
  isExporting?: boolean
}

export default function VariableEditor({
  variables,
  onReplacementsChange,
  onExport,
  isExporting = false
}: VariableEditorProps) {
  const [replacements, setReplacements] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    const updated = { ...replacements, [name]: value }
    setReplacements(updated)
    onReplacementsChange(updated)
  }

  const handleReset = () => {
    setReplacements({})
    onReplacementsChange({})
  }

  const getIcon = (type: DetectedVariable['type']) => {
    switch (type) {
      case 'name':
        return <User className="w-4 h-4" />
      case 'date':
        return <Calendar className="w-4 h-4" />
      case 'currency':
        return <DollarSign className="w-4 h-4" />
      case 'percentage':
        return <Percent className="w-4 h-4" />
      default:
        return null
    }
  }

  const getPlaceholder = (variable: DetectedVariable) => {
    switch (variable.type) {
      case 'name':
        return 'John Smith'
      case 'date':
        return 'January 15, 2025'
      case 'currency':
        return '$2,500,000'
      case 'percentage':
        return '65%'
      default:
        return 'Enter new value'
    }
  }

  // Group variables by type
  const groupedVariables = variables.reduce((acc, variable) => {
    if (!acc[variable.type]) {
      acc[variable.type] = []
    }
    acc[variable.type].push(variable)
    return acc
  }, {} as Record<string, DetectedVariable[]>)

  const typeLabels = {
    name: 'Names',
    date: 'Dates',
    currency: 'Currency Amounts',
    percentage: 'Percentages',
    number: 'Numbers',
    text: 'Other Text'
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            Variable Editor
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={Object.keys(replacements).length === 0}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          {variables.length} variables detected
        </p>
      </div>

      {/* Variable List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {variables.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No variables detected in presentation.</p>
            <p className="text-sm mt-2">Upload a PowerPoint file to get started.</p>
          </div>
        ) : (
          Object.entries(groupedVariables).map(([type, vars]) => (
            <div key={type}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                {getIcon(type as DetectedVariable['type'])}
                {typeLabels[type as keyof typeof typeLabels]}
              </h3>
              <div className="space-y-4">
                {vars.map((variable) => (
                  <div key={variable.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={variable.name} className="text-sm font-medium">
                        {variable.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                      <span className="text-xs text-gray-500">
                        {variable.occurrences} occurrence{variable.occurrences > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">
                        Current: <span className="font-mono">{variable.value}</span>
                      </div>
                      <Input
                        id={variable.name}
                        value={replacements[variable.name] || ''}
                        onChange={(e) => handleChange(variable.name, e.target.value)}
                        placeholder={getPlaceholder(variable)}
                        className="font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="mt-6" />
            </div>
          ))
        )}
      </div>

      {/* Export Button */}
      <div className="p-6 border-t bg-gray-50">
        <Button
          onClick={onExport}
          disabled={isExporting || variables.length === 0}
          className="w-full bg-green-600 hover:bg-green-700"
          size="lg"
        >
          {isExporting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download Edited Presentation
            </>
          )}
        </Button>
        {Object.keys(replacements).length > 0 && (
          <p className="text-xs text-gray-600 mt-2 text-center">
            {Object.keys(replacements).length} variable{Object.keys(replacements).length > 1 ? 's' : ''} will be replaced
          </p>
        )}
      </div>
    </div>
  )
}

