'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { FileText, Sparkles, Upload, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
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
    
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', files[0])
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const { presentationId } = await response.json()
      router.push(`/analyze/${presentationId}`)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
      setUploading(false)
    }
  }

  if (uploading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-700">Uploading your presentation...</p>
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

