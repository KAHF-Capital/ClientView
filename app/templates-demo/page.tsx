'use client'

import { useState } from 'react'
import { 
  getAllTemplates, 
  getTemplateById, 
  getCategories,
  getTemplateMetadata,
  type Template 
} from '@/lib/template-manager'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TemplatesDemoPage() {
  const templates = getAllTemplates()
  const categories = getCategories()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredTemplates = activeCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Proposal Templates
          </h1>
          <p className="text-gray-600">
            Pre-built templates for common wealth management scenarios
          </p>
        </div>

        <div className="flex gap-6">
          {/* Templates List */}
          <div className="w-2/3">
            {/* Category Filter */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All ({templates.length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({templates.filter(t => t.category === category).length})
                </button>
              ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map(template => {
                const metadata = getTemplateMetadata(template.id)
                return (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{template.name}</CardTitle>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {template.category}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{template.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>{metadata.slideCount} slides</span>
                        <span>{metadata.variableCount} variables</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Template Details */}
          <div className="w-1/3">
            {selectedTemplate ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{selectedTemplate.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
                    <div className="space-y-2 mb-6">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Category: </span>
                        <span className="text-sm text-gray-900">{selectedTemplate.category}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Slides: </span>
                        <span className="text-sm text-gray-900">{selectedTemplate.slides.length}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Variables: </span>
                        <span className="text-sm text-gray-900">{selectedTemplate.variables.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Slides</h3>
                    <div className="space-y-2">
                      {selectedTemplate.slides.map((slide, index) => (
                        <div key={slide.id} className="flex items-center gap-2 text-sm">
                          <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span>{slide.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Variables</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map(variable => (
                        <span
                          key={variable}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Select a template to view details
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

