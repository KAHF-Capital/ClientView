/**
 * Home Page
 * Main landing page with template gallery and canvas editor access
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Sparkles, Plus, Trash2, Edit2, Download } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { CanvasTemplate } from '@/lib/stores/template-store'

export default function HomePage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<CanvasTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  async function loadTemplates() {
    try {
      const response = await fetch('/api/templates/canvas')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteTemplate(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`/api/templates/canvas?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setTemplates(templates.filter(t => t.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete template:', error)
      alert('Failed to delete template')
    }
  }

  function handleCreateNew() {
    router.push('/canvas')
  }

  function handleOpenTemplate(templateId: string) {
    router.push(`/canvas?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-green-600" />
            <h1 className="text-6xl font-bold text-gray-900">
              ClientView Pro
            </h1>
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-2xl text-gray-700 font-medium mb-2">
            Professional Investment Proposal Designer
          </p>
          <p className="text-lg text-gray-500 mb-8">
            Create stunning proposals with our drag-and-drop canvas editor
          </p>
          <Button
            onClick={handleCreateNew}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Proposal
          </Button>
        </motion.div>

        {/* Template Gallery */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Templates</h2>
            <Button
              onClick={handleCreateNew}
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-200">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No templates yet</h3>
              <p className="text-gray-500 mb-6">Create your first proposal to get started</p>
              <Button
                onClick={handleCreateNew}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Template
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => handleOpenTemplate(template.id)}
                >
                  {/* Thumbnail */}
                  <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    {template.thumbnail ? (
                      <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-16 h-16 text-green-600" />
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{template.description}</p>
                    )}
                    <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
                      <span>{template.slides.length} slide{template.slides.length !== 1 ? 's' : ''}</span>
                      <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-green-600 text-green-700 hover:bg-green-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenTemplate(template.id)
                      }}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={(e) => handleDeleteTemplate(template.id, e)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="Drag & Drop Editor"
            description="Intuitive canvas editor with 20+ component types. Design professional proposals with ease."
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8" />}
            title="Template Library"
            description="Save and reuse your best designs. Build a library of professional templates."
          />
          <FeatureCard
            icon={<Download className="w-8 h-8" />}
            title="Export to PowerPoint"
            description="Export your designs as professional PowerPoint presentations ready for client meetings."
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
    >
      <div className="text-green-600 mb-4 bg-green-50 rounded-lg p-3 inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
