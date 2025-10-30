'use client'

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface RiskData {
  name: string
  risk: number
  return: number
  color?: string
}

interface RiskMatrixProps {
  data: RiskData[]
  height?: number
}

const DEFAULT_COLOR = '#16a34a'

export default function RiskMatrix({ data, height = 300 }: RiskMatrixProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          type="number" 
          dataKey="risk" 
          name="Risk"
          stroke="#6b7280"
          fontSize={12}
          label={{ value: 'Risk', position: 'insideBottom', offset: -5 }}
        />
        <YAxis 
          type="number" 
          dataKey="return" 
          name="Return"
          stroke="#6b7280"
          fontSize={12}
          label={{ value: 'Return', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
          cursor={{ strokeDasharray: '3 3' }}
          formatter={(value: number, name: string) => {
            if (name === 'risk' || name === 'return') {
              return `${value.toFixed(2)}%`
            }
            return value
          }}
          labelFormatter={(label) => `Asset: ${label}`}
        />
        <Scatter name="Risk/Return" data={data} fill={DEFAULT_COLOR}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLOR} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}

