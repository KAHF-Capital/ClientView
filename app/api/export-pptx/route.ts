import { NextRequest, NextResponse } from 'next/server'
import { exportEnhancedPresentation, DEFAULT_BRANDING } from '@/lib/pptx-exporter-enhanced'
import { exportCanvasToPPTX } from '@/lib/exporters/canvas-to-pptx'
import type { Slide } from '@/lib/types/canvas'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { slides, replacements, fileName = 'presentation.pptx', branding, includeCharts, includeImages } = body
    
    // Check if this is canvas format (has components array)
    const isCanvasFormat = slides && slides.length > 0 && slides[0].components !== undefined
    
    if (isCanvasFormat) {
      // Use canvas exporter
      const blob = await exportCanvasToPPTX(slides as Slide[], fileName)
      const arrayBuffer = await blob.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)
      
      return new Response(uint8Array, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': `attachment; filename="${fileName}"`
        },
        status: 200
      })
    } else {
      // Use enhanced exporter with better formatting (legacy format)
      const pptxData = await exportEnhancedPresentation({
        slides,
        replacements,
        branding: branding || DEFAULT_BRANDING,
        fileName,
        includeCharts: includeCharts ?? true,
        includeImages: includeImages ?? true
      })
      
      // Convert Buffer to Uint8Array for NextResponse
      const uint8Array = new Uint8Array(pptxData)
      return new Response(uint8Array, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': `attachment; filename="${fileName}"`
        },
        status: 200
      })
    }
  } catch (error) {
    console.error('PowerPoint export error:', error)
    return NextResponse.json(
      { error: 'Failed to export PowerPoint file', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}




