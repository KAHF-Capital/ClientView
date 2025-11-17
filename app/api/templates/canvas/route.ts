/**
 * Canvas Templates API
 * Handles saving and loading canvas templates
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  saveCanvasTemplate,
  getCanvasTemplate,
  getAllCanvasTemplates,
  deleteCanvasTemplate,
  searchCanvasTemplates,
} from '@/lib/stores/template-store'

// GET - List all templates or search
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search')
    const id = searchParams.get('id')

    if (id) {
      // Get single template
      const template = getCanvasTemplate(id)
      if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 })
      }
      return NextResponse.json(template)
    }

    if (search) {
      // Search templates
      const templates = searchCanvasTemplates(search)
      return NextResponse.json({ templates })
    }

    // Get all templates
    const templates = getAllCanvasTemplates()
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Get templates error:', error)
    return NextResponse.json({ error: 'Failed to get templates' }, { status: 500 })
  }
}

// POST - Save a new template
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, slides, tags, id } = body

    if (!name || !slides) {
      return NextResponse.json(
        { error: 'Missing required fields: name, slides' },
        { status: 400 }
      )
    }

    const templateId = saveCanvasTemplate({
      id,
      name,
      description,
      slides,
      tags,
    })

    return NextResponse.json({ id: templateId, success: true })
  } catch (error) {
    console.error('Save template error:', error)
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
  }
}

// DELETE - Delete a template
export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing template id' }, { status: 400 })
    }

    const deleted = deleteCanvasTemplate(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete template error:', error)
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 })
  }
}

