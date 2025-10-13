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
      // Parse PowerPoint file
      const presentation = await parsePowerPoint(file)
      setParsed(presentation)
      setParsing(false)
      
      // Initialize replacements with original values
      const initialReplacements: Record<string, string> = {}
      presentation.detectedVariables.forEach(v => {
        initialReplacements[v.name] = v.value
      })
      setReplacements(initialReplacements)
      
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
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">ClientView Editor</h1>
            <p className="text-sm text-gray-600 mt-1">{fileName}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              {parsed.slides.length} slides parsed
            </div>
            <Button variant="outline" onClick={handleReset}>
              Upload New File
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Slide Preview */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Slides Preview
            </h2>
            <div className="grid gap-4">
              {parsed.slides.map((slide) => (
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border-2 border-gray-200 p-4 hover:border-green-500 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Slide Number */}
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-bold text-green-700">
                        {slide.index + 1}
                      </span>
                    </div>

                    {/* Slide Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {slide.title}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {slide.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {slide.textContent}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                        <span>{Object.keys(slide.variables).length} variables</span>
                        {slide.hasCharts && (
                          <span className="flex items-center gap-1">
                            📊 Contains charts
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Variable Editor */}
          <div className="w-96 border-l overflow-y-auto">
            <VariableEditor
              variables={parsed.detectedVariables}
              onReplacementsChange={setReplacements}
              onExport={handleExport}
              isExporting={exporting}
            />
          </div>
        </div>
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
