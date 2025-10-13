'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { BarChart3, PieChart, TrendingUp, Plus, Trash2 } from 'lucide-react'

interface ChartData {
  labels: string[]
  values: number[]
  type: 'bar' | 'pie' | 'line'
}

interface ChartEditorProps {
  slideId: string
  initialData?: ChartData
  onSave: (data: ChartData) => void
}

export default function ChartEditor({ slideId, initialData, onSave }: ChartEditorProps) {
  const [chartType, setChartType] = useState<ChartData['type']>(initialData?.type || 'bar')
  const [labels, setLabels] = useState<string[]>(initialData?.labels || ['Category 1', 'Category 2', 'Category 3'])
  const [values, setValues] = useState<number[]>(initialData?.values || [30, 45, 25])

  const addDataPoint = () => {
    setLabels([...labels, `Category ${labels.length + 1}`])
    setValues([...values, 0])
  }

  const removeDataPoint = (index: number) => {
    setLabels(labels.filter((_, i) => i !== index))
    setValues(values.filter((_, i) => i !== index))
  }

  const updateLabel = (index: number, value: string) => {
    const newLabels = [...labels]
    newLabels[index] = value
    setLabels(newLabels)
  }

  const updateValue = (index: number, value: string) => {
    const newValues = [...values]
    newValues[index] = parseFloat(value) || 0
    setValues(newValues)
  }

  const handleSave = () => {
    onSave({ labels, values, type: chartType })
  }

  const getIcon = (type: ChartData['type']) => {
    switch (type) {
      case 'bar':
        return <BarChart3 className="w-4 h-4" />
      case 'pie':
        return <PieChart className="w-4 h-4" />
      case 'line':
        return <TrendingUp className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Chart Type</Label>
        <div className="grid grid-cols-3 gap-2">
          {(['bar', 'pie', 'line'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`
                p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2
                ${chartType === type
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }
              `}
            >
              {getIcon(type)}
              <span className="text-xs font-medium capitalize">{type}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Data Points */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-semibold">Data Points</Label>
          <Button
            onClick={addDataPoint}
            size="sm"
            variant="outline"
            className="h-7 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          {labels.map((label, index) => (
            <div key={index} className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor={`label-${index}`} className="text-xs text-gray-600 mb-1">
                  Label
                </Label>
                <Input
                  id={`label-${index}`}
                  value={label}
                  onChange={(e) => updateLabel(index, e.target.value)}
                  className="h-8 text-sm"
                  placeholder="Category name"
                />
              </div>
              <div className="w-24">
                <Label htmlFor={`value-${index}`} className="text-xs text-gray-600 mb-1">
                  Value
                </Label>
                <Input
                  id={`value-${index}`}
                  type="number"
                  value={values[index]}
                  onChange={(e) => updateValue(index, e.target.value)}
                  className="h-8 text-sm"
                  placeholder="0"
                />
              </div>
              <Button
                onClick={() => removeDataPoint(index)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={labels.length <= 2}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Preview</Label>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="h-48 flex items-end justify-around gap-2">
            {chartType === 'bar' && values.map((value, index) => {
              const maxValue = Math.max(...values)
              const height = (value / maxValue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex-1 flex items-end w-full">
                    <div
                      className="w-full bg-green-500 rounded-t transition-all"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 truncate max-w-full">
                    {labels[index]}
                  </span>
                </div>
              )
            })}
            
            {chartType === 'pie' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <PieChart className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Pie chart preview</p>
                </div>
              </div>
            )}
            
            {chartType === 'line' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Line chart preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Save Button */}
      <Button
        onClick={handleSave}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Apply Changes
      </Button>
    </div>
  )
}

