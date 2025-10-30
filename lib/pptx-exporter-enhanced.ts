/**
 * Enhanced PowerPoint Exporter
 * Provides better formatting, images, charts, and branding support
 */

import PptxGenJS from 'pptxgenjs'
import type { ParsedSlide } from './pptx-parser'
import type { BrandingConfig } from './types/branding'
import { DEFAULT_BRANDING } from './types/branding'

declare global {
  var pptx: typeof PptxGenJS
}

export interface VariableReplacement {
  [key: string]: string
}

export interface ChartData {
  id: string
  type: 'pie' | 'bar' | 'line' | 'donut'
  data: Array<{ label: string; value: number; color?: string }>
  title?: string
  position?: {
    x: number
    y: number
    w: number
    h: number
  }
}

export interface ImageData {
  id: string
  data: string // base64 or data URL
  width?: number
  height?: number
  position?: {
    x: number
    y: number
  }
}

export interface EnhancedExportOptions {
  slides: ParsedSlide[]
  replacements: VariableReplacement
  branding: BrandingConfig
  fileName: string
  includeCharts?: boolean
  includeImages?: boolean
}

/**
 * Apply variable replacements to text
 */
function applyReplacements(
  text: string,
  replacements: VariableReplacement,
  slideVariables: Record<string, string>
): string {
  let result = text
  
  Object.entries(replacements).forEach(([key, value]) => {
    // Replace {{key}} patterns
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
    
    // Replace direct variable matches
    if (slideVariables[key]) {
      result = result.replace(new RegExp(slideVariables[key], 'g'), value)
    }
  })
  
  return result
}

/**
 * Parse content to bullet points
 */
function parseContentToBullets(content: string): string[] {
  // Split by lines and filter empty
  const lines = content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
  
  // If already looks like bullets, return as is
  if (lines.length > 0 && (lines[0].startsWith('•') || lines[0].startsWith('-') || lines[0].startsWith('*'))) {
    return lines.map(line => line.replace(/^[•\-\*]\s*/, ''))
  }
  
  // Otherwise split by periods for sentences
  return lines
    .join(' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 200) // Filter out very short/long items
}

/**
 * Add chart to slide using pptxgenjs
 */
async function addChartToSlide(slide: any, chart: ChartData, pptxInstance: any) {
  try {
    const chartData = chart.data.map(item => ({
      name: item.label,
      values: [item.value]
    }))
    
    const chartOptions: any = {
      x: chart.position?.x || 1,
      y: chart.position?.y || 1.5,
      w: chart.position?.w || 5,
      h: chart.position?.h || 4
    }
    
    switch (chart.type) {
      case 'pie':
        slide.addChart(pptxInstance.ChartType.pie, chartData, chartOptions)
        break
      case 'donut':
        slide.addChart(pptxInstance.ChartType.doughnut, chartData, chartOptions)
        break
      case 'bar':
        slide.addChart(pptxInstance.ChartType.bar, chartData, chartOptions)
        break
      case 'line':
        slide.addChart(pptxInstance.ChartType.line, chartData, chartOptions)
        break
    }
  } catch (error) {
    console.error('Failed to add chart:', error)
  }
}

/**
 * Enhanced PowerPoint export with better formatting and branding
 */
export async function exportEnhancedPresentation(
  options: EnhancedExportOptions
): Promise<Buffer> {
  const pptx = new PptxGenJS()
  
  // Set presentation properties
  pptx.author = options.branding.author || 'ClientView'
  pptx.company = options.branding.company || 'KAHF Capital'
  pptx.title = options.fileName.replace('.pptx', '')
  pptx.subject = 'Investment Proposal'
  pptx.revision = '1'
  
  // Define layout for better aspect ratio
  pptx.defineLayout({ 
    name: 'WIDE', 
    width: 13.33, 
    height: 7.5 
  })
  pptx.layout = 'WIDE'
  
  // Slide backgrounds
  const bgColor = options.branding.backgroundColor || '#ffffff'
  
  // Create slides
  for (const slideData of options.slides) {
    const slide = pptx.addSlide()
    
    // Apply background color
    slide.background = { color: bgColor }
    
    // Add logo if exists
    if (options.branding.logo) {
      try {
        // Convert base64 to buffer
        const logoData = options.branding.logo.includes('base64') 
          ? options.branding.logo.split(',')[1] 
          : options.branding.logo
        
        slide.addImage({
          data: `data:image/png;base64,${logoData}`,
          x: 0.1,
          y: 0.1,
          w: 1.5,
          h: 0.5,
          sizing: { type: 'contain', w: 1.5, h: 0.5 }
        })
      } catch (error) {
        console.error('Failed to add logo:', error)
      }
    }
    
    // Enhanced title with better formatting
    const title = applyReplacements(slideData.title, options.replacements, slideData.variables)
    slide.addText(title, {
      x: 0.5,
      y: 0.3,
      w: 10,
      h: 0.8,
      fontSize: 36,
      bold: true,
      color: options.branding.primaryColor || '163020',
      fontFace: options.branding.fontFamily || 'Arial',
      align: 'left',
      valign: 'top',
      rectRadius: 0.05,
      fill: { color: 'f3f4f6' },
      margin: 0.05
    })
    
    // Enhanced content with bullet points
    const content = applyReplacements(slideData.textContent, options.replacements, slideData.variables)
    const bullets = parseContentToBullets(content)
    
    if (bullets.length > 0) {
      slide.addText(bullets.join('\n'), {
        x: 0.5,
        y: 1.5,
        w: 6,
        h: 5,
        fontSize: 18,
        color: '1f2937',
        fontFace: options.branding.fontFamily || 'Arial',
        bullet: { type: 'bullet' },
        valign: 'top'
      })
    }
    
    // Add charts if they exist and flag is set
    if (options.includeCharts && (slideData as any).charts) {
      const charts = (slideData as any).charts as ChartData[]
      for (const chart of charts) {
        await addChartToSlide(slide, chart, pptx)
      }
    }
    
    // Add images if they exist and flag is set
    if (options.includeImages && (slideData as any).images) {
      const images = (slideData as any).images as ImageData[]
      for (const img of images) {
        try {
          slide.addImage({
            data: img.data,
            x: img.position?.x || 7,
            y: img.position?.y || 1.5,
            w: img.width ? img.width / 100 : 4,
            h: img.height ? img.height / 100 : 3
          })
        } catch (error) {
          console.error('Failed to add image:', error)
        }
      }
    }
    
    // Footer with branding
    if (options.branding.footer) {
      slide.addText(options.branding.footer, {
        x: 0.5,
        y: 7,
        w: 12,
        h: 0.3,
        fontSize: 10,
        color: '6b7280',
        align: 'center'
      })
    }
    
    // Slide number in bottom right
    slide.addText(`${slideData.index + 1}`, {
      x: 12,
      y: 7,
      w: 1,
      h: 0.3,
      fontSize: 12,
      color: '9ca3af',
      align: 'right'
    })
  }
  
  // Generate PowerPoint file as base64
  const pptxData = await pptx.write({ outputType: 'base64' })
  // Convert base64 string to Buffer for NextResponse
  return Buffer.from(pptxData as string, 'base64')
}

// Return type for compatibility with NextResponse
export type ExportResult = Buffer

// Re-export types and constants for convenience
export type { BrandingConfig } from './types/branding'
export { DEFAULT_BRANDING }

