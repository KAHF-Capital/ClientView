/**
 * Canvas to PowerPoint Exporter
 * Exports canvas slides to PowerPoint format
 */

import PptxGenJS from 'pptxgenjs'
import type { Slide, CanvasComponent } from '@/lib/types/canvas'

export async function exportCanvasToPPTX(slides: Slide[], fileName: string = 'presentation.pptx'): Promise<Blob> {
  const pptx = new PptxGenJS()
  
  // Set slide size (16:9)
  pptx.layout = 'LAYOUT_WIDE'
  pptx.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 })
  pptx.layout = 'CUSTOM'

  for (const slide of slides) {
    const pptxSlide = pptx.addSlide()
    
    // Set slide background
    if (slide.backgroundColor && slide.backgroundColor !== '#ffffff') {
      pptxSlide.background = { color: slide.backgroundColor }
    }

    // Sort components by z-index (if available) or by order
    const sortedComponents = [...slide.components].sort((a, b) => {
      const aZ = a.style?.zIndex || 0
      const bZ = b.style?.zIndex || 0
      return aZ - bZ
    })

    // Convert canvas coordinates (1920x1080) to PowerPoint inches
    const canvasWidth = 1920
    const canvasHeight = 1080
    const pptxWidth = 10 // inches
    const pptxHeight = 5.625 // inches
    const scaleX = pptxWidth / canvasWidth
    const scaleY = pptxHeight / canvasHeight

    for (const component of sortedComponents) {
      if (component.style?.visible === false) continue

      const x = (component.position.x * scaleX).toFixed(2)
      const y = (component.position.y * scaleY).toFixed(2)
      const w = (component.size.width * scaleX).toFixed(2)
      const h = (component.size.height * scaleY).toFixed(2)

      const options: any = {
        x: parseFloat(x),
        y: parseFloat(y),
        w: parseFloat(w),
        h: parseFloat(h),
      }

      // Add styling
      if (component.style?.backgroundColor) {
        options.fill = { color: component.style.backgroundColor }
      }
      if (component.style?.borderColor && component.style?.borderWidth) {
        options.line = {
          color: component.style.borderColor,
          width: component.style.borderWidth,
        }
      }

      switch (component.type) {
        case 'text':
          const textOptions = {
            ...options,
            fontSize: component.props?.fontSize || 16,
            bold: component.props?.fontWeight === 'bold',
            color: component.style?.color || '363636',
            align: 'left' as const,
          }

          // Handle bullet lists
          if (component.props?.listType === 'bullet') {
            const lines = (component.props?.content || '').split('\n').filter((l: string) => l.trim())
            pptxSlide.addText(lines, {
              ...textOptions,
              bullet: true,
            })
          } else {
            pptxSlide.addText(component.props?.content || '', textOptions)
          }
          break

        case 'chart':
          await addChartToSlide(pptxSlide, component, options)
          break

        case 'metric':
          const metricText = `${component.props?.label || ''}\n${component.props?.value || ''}`
          pptxSlide.addText(metricText, {
            ...options,
            fontSize: component.props?.label ? 14 : 24,
            bold: true,
            color: '10b981',
            align: 'center' as const,
            valign: 'middle' as const,
          })
          break

        case 'image':
          if (component.props?.src) {
            try {
              pptxSlide.addImage({
                ...options,
                path: component.props.src,
              })
            } catch (error) {
              console.warn('Failed to add image:', error)
            }
          }
          break

        case 'disclosure':
          const disclosureText = `${component.props?.title || 'Disclosure'}\n\n${component.props?.content || ''}`
          pptxSlide.addText(disclosureText, {
            ...options,
            fontSize: 12,
            color: '363636',
            fill: { color: component.style?.backgroundColor || 'fef3c7' },
            align: 'left' as const,
          })
          break

        case 'shape':
          // Add rectangle shape - using text as fallback since shape API may vary
          pptxSlide.addText('', {
            ...options,
            fill: { color: component.style?.backgroundColor || 'e5e7eb' },
            line: component.style?.borderColor ? { color: component.style.borderColor, width: component.style.borderWidth || 1 } : undefined,
          })
          break
      }
    }

    // Add slide title if available
    if (slide.title) {
      pptxSlide.addText(slide.title, {
        x: 0.5,
        y: 0.2,
        w: 9,
        h: 0.5,
        fontSize: 36,
        bold: true,
        color: '363636',
      })
    }
  }

  // Generate blob
  const blob = await pptx.write({ outputType: 'blob' })
  return blob as Blob
}

async function addChartToSlide(slide: any, component: CanvasComponent, options: any) {
  const { chartType, data } = component.props || {}

  if (!data || !Array.isArray(data) || data.length === 0) {
    return
  }

  // Convert data format for pptxgenjs
  const chartData = data.map((item: any) => ({
    name: item.name || item.label || '',
    values: [item.value || 0],
  }))

  try {
    const PptxGenJS = (await import('pptxgenjs')).default
    switch (chartType) {
      case 'pie':
      case 'donut':
        slide.addChart(PptxGenJS.ChartType.pie, chartData, {
          ...options,
          holeSize: chartType === 'donut' ? 50 : 0,
        })
        break

      case 'line':
        slide.addChart(PptxGenJS.ChartType.line, chartData, options)
        break

      case 'bar':
        slide.addChart(PptxGenJS.ChartType.bar, chartData, options)
        break

      default:
        console.warn('Unsupported chart type:', chartType)
    }
  } catch (error) {
    console.warn('Failed to add chart:', error)
    // Fallback: add text representation
    slide.addText(`Chart: ${chartType}`, {
      ...options,
      fontSize: 14,
      color: '9ca3af',
      align: 'center' as const,
      valign: 'middle' as const,
    })
  }
}

