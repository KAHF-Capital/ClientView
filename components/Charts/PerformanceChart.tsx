'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceChartProps {
  data: Array<{ date: string; portfolio: number; benchmark?: number }>
  height?: number
}

export default function PerformanceChart({ data, height = 300 }: PerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
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
        <Line 
          type="monotone" 
          dataKey="portfolio" 
          stroke="#16a34a" 
          strokeWidth={3}
          dot={{ r: 4 }}
          name="Portfolio"
        />
        {data.length > 0 && data[0]?.benchmark !== undefined && (
          <Line 
            type="monotone" 
            dataKey="benchmark" 
            stroke="#94a3b8" 
            strokeWidth={2}
            dot={{ r: 3 }}
            name="Benchmark"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}

