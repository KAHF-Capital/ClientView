/**
 * Template Manager
 * Load and manage proposal templates
 */

import quarterlyReview from './templates/quarterlyReview.json'
import newClientOnboarding from './templates/newClientOnboarding.json'
import portfolioRebalancing from './templates/portfolioRebalancing.json'

export interface Template {
  id: string
  name: string
  category: string
  description: string
  thumbnail: string
  slides: TemplateSlide[]
  variables: string[]
}

export interface TemplateSlide {
  id: string
  title: string
  category: string
  order: number
  components: TemplateComponent[]
}

export interface TemplateComponent {
  type: 'text' | 'chart' | 'table' | 'metric'
  position: { x: number; y: number; w: number; h: number }
  content?: string
  data?: any
  label?: string
  value?: string
  chartType?: string
  config?: any
  style?: Record<string, any>
}

const templates: Template[] = [
  quarterlyReview as Template,
  newClientOnboarding as Template,
  portfolioRebalancing as Template
]

/**
 * Get all templates
 */
export function getAllTemplates(): Template[] {
  return templates
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): Template | undefined {
  return templates.find(t => t.id === id)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): Template[] {
  return templates.filter(t => t.category === category)
}

/**
 * Search templates by name or description
 */
export function searchTemplates(query: string): Template[] {
  const lowerQuery = query.toLowerCase()
  return templates.filter(t => 
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery)
  )
}

/**
 * Get all unique categories
 */
export function getCategories(): string[] {
  const categories = new Set(templates.map(t => t.category))
  return Array.from(categories)
}

/**
 * Load template with variable replacements
 */
export function loadTemplate(id: string, variables: Record<string, any>): any {
  const template = getTemplateById(id)
  if (!template) return null
  
  // Deep clone the template
  const loadedTemplate = JSON.parse(JSON.stringify(template))
  
  // Replace variables in slides
  loadedTemplate.slides.forEach((slide: any) => {
    // Replace variables in title
    slide.title = replaceVariables(slide.title, variables)
    
    // Replace variables in components
    slide.components.forEach((component: any) => {
      if (component.content) {
        component.content = replaceVariables(component.content, variables)
      }
      if (component.value) {
        component.value = replaceVariables(component.value, variables)
      }
      if (component.label) {
        component.label = replaceVariables(component.label, variables)
      }
      if (component.data && typeof component.data === 'string') {
        component.data = replaceVariables(component.data, variables)
      }
    })
  })
  
  return loadedTemplate
}

/**
 * Replace variables in string
 */
function replaceVariables(text: string, variables: Record<string, any>): string {
  let result = text
  
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    result = result.replace(new RegExp(placeholder, 'g'), String(value))
  })
  
  return result
}

/**
 * Get template metadata (without full content)
 */
export function getTemplateMetadata(id: string): any {
  const template = getTemplateById(id)
  if (!template) return null
  
  return {
    id: template.id,
    name: template.name,
    category: template.category,
    description: template.description,
    thumbnail: template.thumbnail,
    slideCount: template.slides.length,
    variableCount: template.variables.length
  }
}

export default {
  getAllTemplates,
  getTemplateById,
  getTemplatesByCategory,
  searchTemplates,
  getCategories,
  loadTemplate,
  getTemplateMetadata
}



