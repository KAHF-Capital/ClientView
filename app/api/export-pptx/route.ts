import { NextRequest, NextResponse } from 'next/server'
import PptxGenJS from 'pptxgenjs'

export async function POST(req: NextRequest) {
  try {
    const { slides, replacements, fileName } = await req.json()
    
    const pptx = new PptxGenJS()
    
    // Set presentation properties
    pptx.author = 'ClientView'
    pptx.company = 'KAHF Capital'
    pptx.title = fileName.replace('.pptx', '')
    
    // Create slides
    for (const slideData of slides) {
      const slide = pptx.addSlide()
      
      // Apply replacements to content
      let content = slideData.textContent
      Object.entries(replacements).forEach(([key, value]) => {
        content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value as string)
        if (slideData.variables[key]) {
          content = content.replace(new RegExp(slideData.variables[key], 'g'), value as string)
        }
      })
      
      // Add title
      if (slideData.title) {
        let title = slideData.title
        Object.entries(replacements).forEach(([key, value]) => {
          title = title.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value as string)
          if (slideData.variables[key]) {
            title = title.replace(new RegExp(slideData.variables[key], 'g'), value as string)
          }
        })
        
        slide.addText(title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          fontSize: 32,
          bold: true,
          color: '166534',
          fontFace: 'Arial'
        })
      }
      
      // Add content
      const contentLines = content.split('\n').filter((line: string) => 
        line.trim() && line.trim() !== slideData.title
      )
      
      if (contentLines.length > 0) {
        slide.addText(contentLines.join('\n'), {
          x: 0.5,
          y: 2,
          w: 9,
          h: 4,
          fontSize: 18,
          color: '1f2937',
          fontFace: 'Arial',
          valign: 'top'
        })
      }
      
      // Add slide number
      slide.addText(`${slideData.index + 1}`, {
        x: 9.2,
        y: 7,
        w: 0.5,
        h: 0.3,
        fontSize: 12,
        color: '9ca3af',
        align: 'right'
      })
    }
    
    // Generate PowerPoint file as base64
    const pptxData = await pptx.write({ outputType: 'base64' })
    
    return new NextResponse(Buffer.from(pptxData as string, 'base64'), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    })
  } catch (error) {
    console.error('PowerPoint export error:', error)
    return NextResponse.json(
      { error: 'Failed to export PowerPoint file' },
      { status: 500 }
    )
  }
}

