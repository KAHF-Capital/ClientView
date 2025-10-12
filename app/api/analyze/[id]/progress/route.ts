import { NextRequest, NextResponse } from 'next/server'

// In-memory store for demo (use database in production)
const analysisProgress = new Map<string, any>()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if analysis exists in our store
    let progress = analysisProgress.get(id)

    if (!progress) {
      // Initialize analysis progress
      progress = {
        progress: 0,
        step: 0,
        complete: false
      }
      analysisProgress.set(id, progress)
    }

    // Simulate progress (in production, check actual Python backend status)
    if (!progress.complete) {
      progress.progress = Math.min(progress.progress + 15, 95)
      progress.step = Math.floor(progress.progress / 16)

      // Complete after reaching ~90%
      if (progress.progress >= 90) {
        progress.progress = 100
        progress.step = 5
        progress.complete = true
        progress.analysis = {
          slideCount: 24,
          variableCount: 18,
          categoryCount: 6
        }
      }

      analysisProgress.set(id, progress)
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Progress check error:', error)
    return NextResponse.json(
      { error: 'Failed to check progress' }, 
      { status: 500 }
    )
  }
}

