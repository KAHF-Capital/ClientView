import { NextRequest, NextResponse } from 'next/server'
import { exportEnhancedPresentation, DEFAULT_BRANDING } from '@/lib/pptx-exporter-enhanced'

export async function POST(req: NextRequest) {
  try {
    const { 
      slides, 
      replacements, 
      fileName,
      branding,
      includeCharts,
      includeImages 
    } = await req.json()
    
    // Use enhanced exporter with better formatting
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
  } catch (error) {
    console.error('PowerPoint export error:', error)
    return NextResponse.json(
      { error: 'Failed to export PowerPoint file' },
      { status: 500 }
    )
  }
}




