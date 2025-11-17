/**
 * Template Storage
 * In-memory storage for parsed templates
 * Replace with database in production
 */

export interface StoredTemplate {
  name: string
  slides: any[]
  theme: any
  slideCount: number
  variableCount: number
  categoryCount: number
  savedAt: string
}

// In-memory storage (will reset on server restart)
const templateStore = new Map<string, StoredTemplate>()

export function saveTemplate(presentationId: string, template: Omit<StoredTemplate, 'savedAt'>): void {
  templateStore.set(presentationId, {
    ...template,
    savedAt: new Date().toISOString()
  })
  console.log(`Template saved: ${presentationId}, ${template.slideCount} slides`)
}

export function getTemplate(presentationId: string): StoredTemplate | undefined {
  const template = templateStore.get(presentationId)
  if (template) {
    console.log(`Template retrieved: ${presentationId}`)
  } else {
    console.log(`Template not found: ${presentationId}`)
  }
  return template
}

export function hasTemplate(presentationId: string): boolean {
  return templateStore.has(presentationId)
}

export function getAllTemplateIds(): string[] {
  return Array.from(templateStore.keys())
}






