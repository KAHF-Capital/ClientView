'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BarComparisonProps {
  data: Array<{ name: string; value: number; benchmark?: number }>
  height?: number
  colors?: { primary: string; secondary: string }
}

export default function BarComparison({ data, height = 300, colors }: BarComparisonProps) {
  const primaryColor = colors?.primary || '#16a34a'
  const secondaryColor = colors?.secondary || '#94a3b8'
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="name" 
          stroke="#6b7280"
          fontSize={12}
        />
        <YAxis 
          stroke="#6b7280"
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}
          formatter={(value: number) => `${value.toFixed(2)}%`}
        />
        <Legend />
        <Bar dataKey="value" fill={primaryColor} name="Portfolio" />
        {data.length > 0 && data[0]?.benchmark !== undefined && (
          <Bar dataKey="benchmark" fill={secondaryColor} name="Benchmark" />
        )}
      </BarChart>
    </ResponsiveContainer>
  )
}



