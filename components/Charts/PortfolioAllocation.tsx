'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface PortfolioAllocationProps {
  data: Array<{ name: string; value: number; color?: string }>
  type?: 'pie' | 'donut'
  height?: number
}

const DEFAULT_COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#dcfce7', '#bef264']

export default function PortfolioAllocation({ data, type = 'pie', height = 300 }: PortfolioAllocationProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={type === 'donut' ? 60 : 0}
          outerRadius={120}
          dataKey="value"
          label={(props: any) => {
            const { name, percent } = props
            return `${name} ${(percent * 100).toFixed(0)}%`
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => `${value.toFixed(2)}%`}
        />
        <Legend 
          formatter={(value, entry: any) => (
            <span style={{ color: entry.color }}>
              {`${value}: ${data.find(d => d.name === value)?.value.toFixed(2)}%`}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

