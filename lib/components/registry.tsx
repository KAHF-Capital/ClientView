/**
 * Component Registry
 * Central registry for all canvas components
 */

import { PieChart, Type, BarChart3, Image, Square, Layout, FileText } from 'lucide-react'
import type { ComponentType, ChartType, CanvasComponent } from '@/lib/types/canvas'
import { nanoid } from 'nanoid'

export interface ComponentDefinition {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  category: 'charts' | 'text' | 'metrics' | 'layout' | 'media' | 'shapes' | 'investment'
  defaultProps: Partial<CanvasComponent>
  description?: string
}

export const componentRegistry: ComponentDefinition[] = [
  // Charts
  {
    id: 'portfolio-pie',
    name: 'Portfolio Allocation (Pie)',
    icon: PieChart,
    category: 'charts',
    description: 'Pie chart for portfolio allocation',
    defaultProps: {
      type: 'chart',
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      props: {
        chartType: 'pie',
        data: [
          { name: 'Stocks', value: 60 },
          { name: 'Bonds', value: 30 },
          { name: 'Cash', value: 10 },
        ],
      },
    },
  },
  {
    id: 'portfolio-donut',
    name: 'Portfolio Allocation (Donut)',
    icon: PieChart,
    category: 'charts',
    description: 'Donut chart for portfolio allocation',
    defaultProps: {
      type: 'chart',
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      props: {
        chartType: 'donut',
        data: [
          { name: 'Stocks', value: 60 },
          { name: 'Bonds', value: 30 },
          { name: 'Cash', value: 10 },
        ],
      },
    },
  },
  {
    id: 'performance-line',
    name: 'Performance Chart',
    icon: BarChart3,
    category: 'charts',
    description: 'Line chart for performance over time',
    defaultProps: {
      type: 'chart',
      position: { x: 100, y: 100 },
      size: { width: 600, height: 300 },
      props: {
        chartType: 'line',
        data: [
          { name: 'Q1', value: 100 },
          { name: 'Q2', value: 120 },
          { name: 'Q3', value: 115 },
          { name: 'Q4', value: 140 },
        ],
      },
    },
  },
  {
    id: 'bar-comparison',
    name: 'Bar Comparison',
    icon: BarChart3,
    category: 'charts',
    description: 'Bar chart for comparisons',
    defaultProps: {
      type: 'chart',
      position: { x: 100, y: 100 },
      size: { width: 500, height: 300 },
      props: {
        chartType: 'bar',
        data: [
          { name: 'Category A', value: 40 },
          { name: 'Category B', value: 60 },
          { name: 'Category C', value: 30 },
        ],
      },
    },
  },

  // Text
  {
    id: 'heading-1',
    name: 'Heading 1',
    icon: Type,
    category: 'text',
    description: 'Large heading text',
    defaultProps: {
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 600, height: 80 },
      style: { fontSize: 48, fontWeight: 'bold' },
      props: {
        content: 'Heading 1',
        fontSize: 48,
        fontWeight: 'bold',
      },
    },
  },
  {
    id: 'heading-2',
    name: 'Heading 2',
    icon: Type,
    category: 'text',
    description: 'Medium heading text',
    defaultProps: {
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 600, height: 60 },
      style: { fontSize: 36, fontWeight: 'bold' },
      props: {
        content: 'Heading 2',
        fontSize: 36,
        fontWeight: 'bold',
      },
    },
  },
  {
    id: 'body-text',
    name: 'Body Text',
    icon: Type,
    category: 'text',
    description: 'Regular paragraph text',
    defaultProps: {
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 600, height: 200 },
      style: { fontSize: 16 },
      props: {
        content: 'Body text content goes here. You can edit this text.',
        fontSize: 16,
      },
    },
  },
  {
    id: 'bullet-list',
    name: 'Bullet List',
    icon: Type,
    category: 'text',
    description: 'Bulleted list',
    defaultProps: {
      type: 'text',
      position: { x: 100, y: 100 },
      size: { width: 500, height: 200 },
      style: { fontSize: 16 },
      props: {
        content: '• Item 1\n• Item 2\n• Item 3',
        fontSize: 16,
        listType: 'bullet',
      },
    },
  },

  // Metrics
  {
    id: 'single-metric',
    name: 'Single Metric',
    icon: BarChart3,
    category: 'metrics',
    description: 'Single KPI/metric card',
    defaultProps: {
      type: 'metric',
      position: { x: 100, y: 100 },
      size: { width: 250, height: 150 },
      style: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 20 },
      props: {
        label: 'Total Assets',
        value: '$1,000,000',
        trend: '+5.2%',
      },
    },
  },
  {
    id: 'metric-grid',
    name: 'Metric Grid',
    icon: BarChart3,
    category: 'metrics',
    description: 'Grid of multiple metrics',
    defaultProps: {
      type: 'metric',
      position: { x: 100, y: 100 },
      size: { width: 800, height: 200 },
      style: { borderRadius: 12 },
      props: {
        layout: 'grid',
        columns: 3,
        metrics: [
          { label: 'Assets', value: '$1M' },
          { label: 'Returns', value: '+12%' },
          { label: 'Risk', value: 'Medium' },
        ],
      },
    },
  },

  // Layout
  {
    id: 'two-columns',
    name: 'Two Columns',
    icon: Layout,
    category: 'layout',
    description: 'Two column layout',
    defaultProps: {
      type: 'layout',
      position: { x: 100, y: 100 },
      size: { width: 800, height: 400 },
      props: {
        columns: 2,
        gap: 20,
      },
    },
  },
  {
    id: 'three-columns',
    name: 'Three Columns',
    icon: Layout,
    category: 'layout',
    description: 'Three column layout',
    defaultProps: {
      type: 'layout',
      position: { x: 100, y: 100 },
      size: { width: 900, height: 400 },
      props: {
        columns: 3,
        gap: 20,
      },
    },
  },

  // Media
  {
    id: 'image',
    name: 'Image',
    icon: Image,
    category: 'media',
    description: 'Image placeholder',
    defaultProps: {
      type: 'image',
      position: { x: 100, y: 100 },
      size: { width: 400, height: 300 },
      props: {
        src: '',
        alt: 'Image',
      },
    },
  },

  // Shapes
  {
    id: 'rectangle',
    name: 'Rectangle',
    icon: Square,
    category: 'shapes',
    description: 'Rectangle shape',
    defaultProps: {
      type: 'shape',
      position: { x: 100, y: 100 },
      size: { width: 200, height: 150 },
      style: { backgroundColor: '#e5e7eb', borderRadius: 8 },
      props: {
        shapeType: 'rectangle',
      },
    },
  },

  // Investment-specific
  {
    id: 'risk-disclosure',
    name: 'Risk Disclosure',
    icon: FileText,
    category: 'investment',
    description: 'Risk disclosure box',
    defaultProps: {
      type: 'disclosure',
      position: { x: 100, y: 100 },
      size: { width: 700, height: 200 },
      style: { backgroundColor: '#fef3c7', borderColor: '#f59e0b', borderWidth: 2, borderRadius: 8, padding: 16 },
      props: {
        title: 'Risk Disclosure',
        content: 'Investments involve risk. Past performance does not guarantee future results.',
      },
    },
  },
]

export const getComponentById = (id: string): ComponentDefinition | undefined => {
  return componentRegistry.find((c) => c.id === id)
}

export const getComponentsByCategory = (category: ComponentDefinition['category']) => {
  return componentRegistry.filter((c) => c.category === category)
}

export const createComponentFromDefinition = (
  definition: ComponentDefinition,
  position?: { x: number; y: number }
): CanvasComponent => {
  return {
    id: nanoid(),
    ...definition.defaultProps,
    position: position || definition.defaultProps.position || { x: 100, y: 100 },
  } as CanvasComponent
}

