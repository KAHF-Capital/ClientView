/**
 * PowerPoint Exporter Service
 * Client-side wrapper for server-side export
 */

import type { ParsedSlide } from './pptx-parser'

export interface VariableReplacement {
  [key: string]: string
}

/**
 * Export presentation with variable replacements (calls API)
 */
export async function exportPresentation(
  slides: ParsedSlide[],
  replacements: VariableReplacement,
  fileName: string = 'presentation.pptx'
): Promise<void> {
  try {
    const response = await fetch('/api/export-pptx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slides, replacements, fileName })
    })
    
    if (!response.ok) {
      throw new Error('Export failed')
    }
    
    // Download file
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('PowerPoint export error:', error)
    throw new Error('Failed to export PowerPoint file')
  }
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
 * Create preview of presentation with replacements (returns slide texts)
 */
export function previewWithReplacements(
  slides: ParsedSlide[],
  replacements: VariableReplacement
): ParsedSlide[] {
  return slides.map(slide => ({
    ...slide,
    title: applyReplacements(slide.title, replacements, slide.variables),
    textContent: applyReplacements(slide.textContent, replacements, slide.variables)
  }))
}

