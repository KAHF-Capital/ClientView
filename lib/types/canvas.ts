/**
 * Canvas Component Types
 * Core types for the drag-and-drop canvas system
 */

export type ComponentType =
  | 'chart'
  | 'text'
  | 'metric'
  | 'image'
  | 'shape'
  | 'layout'
  | 'disclosure'

export type ChartType = 'pie' | 'donut' | 'line' | 'bar' | 'scatter' | 'waterfall' | 'heatmap'

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Style {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: number
  padding?: number
  opacity?: number
  zIndex?: number
}

export interface CanvasComponent {
  id: string
  type: ComponentType
  position: Position
  size: Size
  style: Style
  props: Record<string, any>
  locked?: boolean
  visible?: boolean
}

export interface Slide {
  id: string
  index: number
  title: string
  components: CanvasComponent[]
  backgroundColor?: string
}

export interface CanvasState {
  slides: Slide[]
  activeSlideId: string | null
  selectedComponentIds: string[]
  zoom: number
  showGrid: boolean
  snapToGrid: boolean
  gridSize: number
}

export interface HistoryState {
  slides: Slide[]
  timestamp: number
}

