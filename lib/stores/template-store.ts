/**
 * Canvas Template Storage
 * Manages canvas templates (saved presentations)
 */

import type { Slide } from '@/lib/types/canvas'

export interface CanvasTemplate {
  id: string
  name: string
  description?: string
  thumbnail?: string
  slides: Slide[]
  createdAt: string
  updatedAt: string
  tags?: string[]
}

// In-memory storage (replace with database in production)
const templateStore = new Map<string, CanvasTemplate>()

export function saveCanvasTemplate(template: Omit<CanvasTemplate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): string {
  const id = template.id || `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const now = new Date().toISOString()
  
  const existing = templateStore.get(id)
  
  templateStore.set(id, {
    ...template,
    id,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  })
  
  return id
}

export function getCanvasTemplate(id: string): CanvasTemplate | undefined {
  return templateStore.get(id)
}

export function getAllCanvasTemplates(): CanvasTemplate[] {
  return Array.from(templateStore.values()).sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function deleteCanvasTemplate(id: string): boolean {
  return templateStore.delete(id)
}

export function searchCanvasTemplates(query: string): CanvasTemplate[] {
  const lowerQuery = query.toLowerCase()
  return getAllCanvasTemplates().filter(template =>
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description?.toLowerCase().includes(lowerQuery) ||
    template.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

