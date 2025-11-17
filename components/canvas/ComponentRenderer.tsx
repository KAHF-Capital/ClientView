/**
 * Component Renderer
 * Renders different component types on the canvas
 */

import { PortfolioAllocation, PerformanceChart, BarComparison } from '@/components/Charts'
import type { CanvasComponent } from '@/lib/types/canvas'

interface ComponentRendererProps {
  component: CanvasComponent
  isSelected?: boolean
  onClick?: () => void
}

export default function ComponentRenderer({
  component,
  isSelected = false,
  onClick,
}: ComponentRendererProps) {
  const { type, props, style, position, size } = component

  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size.width}px`,
    height: `${size.height}px`,
    backgroundColor: style.backgroundColor,
    border: isSelected
      ? `2px solid #10b981`
      : style.borderWidth
        ? `${style.borderWidth}px solid ${style.borderColor || '#e5e7eb'}`
        : 'none',
    borderRadius: style.borderRadius ? `${style.borderRadius}px` : '0',
    padding: style.padding ? `${style.padding}px` : '0',
    opacity: style.opacity ?? 1,
    cursor: 'pointer',
    zIndex: style.zIndex || 1,
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.()
  }

  switch (type) {
    case 'chart':
      return (
        <div style={baseStyle} onClick={handleClick}>
          {renderChart(props)}
        </div>
      )

    case 'text':
      return (
        <div style={baseStyle} onClick={handleClick}>
          <div
            style={{
              fontSize: props.fontSize || 16,
              fontWeight: props.fontWeight || 'normal',
              color: style.color || '#000',
              whiteSpace: 'pre-wrap',
            }}
          >
            {props.content || 'Text'}
          </div>
        </div>
      )

    case 'metric':
      return (
        <div style={baseStyle} onClick={handleClick}>
          {renderMetric(props, style)}
        </div>
      )

    case 'image':
      return (
        <div style={baseStyle} onClick={handleClick}>
          {props.src ? (
            <img
              src={props.src}
              alt={props.alt || 'Image'}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f3f4f6',
                border: '2px dashed #d1d5db',
                color: '#9ca3af',
              }}
            >
              Image Placeholder
            </div>
          )}
        </div>
      )

    case 'shape':
      return (
        <div style={baseStyle} onClick={handleClick}>
          {/* Shape rendering */}
        </div>
      )

    case 'disclosure':
      return (
        <div style={baseStyle} onClick={handleClick}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{props.title || 'Disclosure'}</div>
          <div style={{ fontSize: 14 }}>{props.content || ''}</div>
        </div>
      )

    default:
      return (
        <div style={baseStyle} onClick={handleClick}>
          Unknown component type: {type}
        </div>
      )
  }
}

function renderChart(props: any) {
  const { chartType, data } = props

  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9ca3af',
        }}
      >
        No chart data
      </div>
    )
  }

  switch (chartType) {
    case 'pie':
    case 'donut':
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <PortfolioAllocation data={data} type={chartType} height={280} />
        </div>
      )
    case 'line':
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <PerformanceChart data={data} height={280} />
        </div>
      )
    case 'bar':
      return (
        <div style={{ width: '100%', height: '100%' }}>
          <BarComparison data={data} height={280} />
        </div>
      )
    default:
      return <div>Unsupported chart type: {chartType}</div>
  }
}

function renderMetric(props: any, style: any) {
  if (props.layout === 'grid' && props.metrics) {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`,
          gap: '16px',
          height: '100%',
        }}
      >
        {props.metrics.map((metric: any, idx: number) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#f0fdf4',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>{metric.label}</div>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#10b981' }}>{metric.value}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>{props.label || 'Metric'}</div>
      <div style={{ fontSize: 32, fontWeight: 'bold', color: '#10b981' }}>{props.value || '$0'}</div>
      {props.trend && (
        <div style={{ fontSize: 12, color: props.trend.startsWith('+') ? '#10b981' : '#ef4444', marginTop: 4 }}>
          {props.trend}
        </div>
      )}
    </div>
  )
}

