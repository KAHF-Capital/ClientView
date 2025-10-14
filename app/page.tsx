'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { FileText, Sparkles, Upload, Loader2, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import VariableEditor from '@/components/VariableEditor'
import { parsePowerPoint, type ParsedPresentation, type DetectedVariable } from '@/lib/pptx-parser'
import { exportPresentation } from '@/lib/pptx-exporter'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState<ParsedPresentation | null>(null)
  const [fileName, setFileName] = useState('')
  const [replacements, setReplacements] = useState<Record<string, string>>({})
  const [exporting, setExporting] = useState(false)
  const router = useRouter()
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    onDrop: handleUpload
  })

  async function handleUpload(files: File[]) {
    if (files.length === 0) return
    
    const file = files[0]
    setFileName(file.name)
    setUploading(true)
    setParsing(true)
    
    try {
      // Upload to server first
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }
      
      const { presentationId } = await uploadResponse.json()
      
      // Parse PowerPoint file client-side
      const presentation = await parsePowerPoint(file)
      
      // Save parsed template to server
      const saveResponse = await fetch('/api/save-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presentationId,
          template: {
            name: file.name,
            slides: presentation.slides,
            theme: presentation.theme,
            slideCount: presentation.slides.length,
            variableCount: presentation.detectedVariables.length,
            categoryCount: new Set(presentation.slides.map(s => s.category)).size
          }
        })
      })
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save template')
      }
      
      setParsed(presentation)
      setParsing(false)
      
      // Initialize replacements with original values
      const initialReplacements: Record<string, string> = {}
      presentation.detectedVariables.forEach(v => {
        initialReplacements[v.name] = v.value
      })
      setReplacements(initialReplacements)
      
      // Route to full editor after brief preview
      setTimeout(() => {
        router.push(`/builder/${presentationId}`)
      }, 1500)
      
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to parse PowerPoint file. Please try again.')
      setUploading(false)
      setParsing(false)
    }
  }

  async function handleExport() {
    if (!parsed) return
    
    setExporting(true)
    try {
      await exportPresentation(parsed.slides, replacements, fileName.replace('.pptx', '_edited.pptx'))
      alert('Presentation exported successfully!')
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export presentation. Please try again.')
    } finally {
      setExporting(false)
    }
  }

  function handleReset() {
    setUploading(false)
    setParsing(false)
    setParsed(null)
    setFileName('')
    setReplacements({})
  }

  if (parsing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white rounded-2xl shadow-2xl p-12 max-w-md"
        >
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Parsing Presentation
          </h2>
          <p className="text-gray-600">
            Extracting slides and detecting variables...
          </p>
        </motion.div>
      </div>
    )
  }

  if (uploading && parsed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
        >
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Presentation Parsed Successfully!
            </h2>
            <p className="text-gray-600">
              {fileName}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-700">
                {parsed.slides.length}
              </div>
              <div className="text-sm text-green-600">Slides</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-700">
                {parsed.detectedVariables.length}
              </div>
              <div className="text-sm text-green-600">Variables</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-700">
                {new Set(parsed.slides.map(s => s.category)).size}
              </div>
              <div className="text-sm text-green-600">Categories</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Detected Slides:</h3>
            <div className="space-y-2">
              {parsed.slides.slice(0, 5).map((slide, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{slide.title || 'Untitled'}</p>
                    <p className="text-xs text-gray-500">{slide.category}</p>
                  </div>
                </div>
              ))}
              {parsed.slides.length > 5 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                  +{parsed.slides.length - 5} more slides
                </p>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Opening editor...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-green-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    )
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
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ClientView
          </h1>
          <p className="text-xl text-gray-600">
            Transform your proposals with AI-powered intelligence
          </p>
        </motion.div>

        {/* Upload Zone */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div
            {...getRootProps()}
            className={`
              border-4 border-dashed rounded-2xl p-16
              transition-all duration-300 cursor-pointer
              ${isDragActive 
                ? 'border-green-500 bg-green-50 scale-105' 
                : 'border-gray-300 bg-white hover:border-green-400 hover:shadow-xl'
              }
            `}
          >
            <input {...getInputProps()} />
            
            <div className="text-center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="inline-block mb-6"
              >
                <FileText className="w-20 h-20 text-green-600" />
              </motion.div>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                Upload Your Proposal
              </h2>
              
              <p className="text-gray-600 mb-6">
                Drag & drop your PowerPoint here or click to browse
              </p>
              
              <div className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Choose File
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Supports .pptx files up to 50MB
              </p>
            </div>
          </div>
        </motion.div>

        {/* Demo Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-3xl mx-auto mt-8"
        >
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Or Try the Demo
            </h3>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => router.push('/template/demo')}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <FileText className="w-5 h-5 mr-2" />
                View Template Library
              </Button>
              <Button
                onClick={() => router.push('/builder/demo')}
                size="lg"
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Open Builder
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="AI Analysis"
            description="Automatically identifies variables and slide categories"
          />
          <FeatureCard
            icon={<FileText className="w-6 h-6" />}
            title="Smart Templates"
            description="Creates reusable templates from your proposals"
          />
          <FeatureCard
            icon={<Upload className="w-6 h-6" />}
            title="Brand Consistency"
            description="Maintains your colors, fonts, and style"
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
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="text-green-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </motion.div>
  )
}
