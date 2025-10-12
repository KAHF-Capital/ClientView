import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { nanoid } from 'nanoid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' }, 
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.name.endsWith('.pptx')) {
      return NextResponse.json(
        { error: 'Only .pptx files are supported' }, 
        { status: 400 }
      )
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' }, 
        { status: 400 }
      )
    }

    const presentationId = nanoid()

    // Upload to blob storage
    const blob = await put(`presentations/${presentationId}.pptx`, file, {
      access: 'public',
    })

    // Trigger Python backend analysis
    const pythonApiUrl = process.env.PYTHON_API_URL
    if (pythonApiUrl) {
      try {
        await fetch(`${pythonApiUrl}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            fileUrl: blob.url,
            presentationId 
          })
        })
      } catch (error) {
        console.error('Error triggering analysis:', error)
        // Continue anyway - we'll use mock data
      }
    }

    return NextResponse.json({ 
      presentationId,
      blobUrl: blob.url
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' }, 
      { status: 500 }
    )
  }
}

