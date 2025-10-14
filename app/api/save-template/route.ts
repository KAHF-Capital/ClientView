import { NextRequest, NextResponse } from 'next/server'
import { saveTemplate, getTemplate } from '@/lib/template-store'

export async function POST(req: NextRequest) {
  try {
    const { presentationId, template } = await req.json()
    
    if (!presentationId || !template) {
      return NextResponse.json(
        { error: 'Missing presentationId or template' },
        { status: 400 }
      )
    }
    
    // Store template
    saveTemplate(presentationId, template)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save template error:', error)
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const presentationId = req.nextUrl.searchParams.get('id')
  
  if (!presentationId) {
    return NextResponse.json(
      { error: 'Missing presentationId' },
      { status: 400 }
    )
  }
  
  const template = getTemplate(presentationId)
  
  if (!template) {
    return NextResponse.json(
      { error: 'Template not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(template)
}
