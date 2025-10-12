'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Loader2 } from 'lucide-react'

const ANALYSIS_STEPS = [
  'Uploading presentation',
  'Extracting slides and content',
  'Detecting variables and placeholders',
  'Analyzing color scheme and fonts',
  'Categorizing slides',
  'Generating template'
]

interface AnalysisData {
  progress: number
  step: number
  complete: boolean
  analysis?: {
    slideCount: number
    variableCount: number
    categoryCount: number
  }
}

export default function AnalysisPage({ params }: { params: { id: string } }) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [analysis, setAnalysis] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Poll backend for analysis progress
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/analyze/${params.id}/progress`)
        const data: AnalysisData = await res.json()
        
        setProgress(data.progress)
        setCurrentStep(data.step)
        
        if (data.complete) {
          setAnalysis(data.analysis)
          clearInterval(interval)
          setTimeout(() => {
            router.push(`/template/${params.id}`)
          }, 1500)
        }
      } catch (error) {
        console.error('Error fetching progress:', error)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [params.id, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-12 max-w-2xl w-full"
      >
        {/* Animated Icon */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <Loader2 className="w-16 h-16 text-green-600" />
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Analyzing Your Presentation
        </h2>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step List */}
        <div className="space-y-4">
          {ANALYSIS_STEPS.map((step, index) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3"
            >
              {index < currentStep ? (
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
              ) : index === currentStep ? (
                <Loader2 className="w-6 h-6 text-green-600 animate-spin flex-shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />
              )}
              <span className={`
                text-lg
                ${index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400'}
              `}>
                {step}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Analysis Results (appears when complete) */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 bg-green-50 rounded-xl border border-green-200"
            >
              <h3 className="font-semibold text-green-900 mb-3">
                Analysis Complete!
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {analysis.slideCount}
                  </div>
                  <div className="text-sm text-green-600">Slides</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {analysis.variableCount}
                  </div>
                  <div className="text-sm text-green-600">Variables</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {analysis.categoryCount}
                  </div>
                  <div className="text-sm text-green-600">Categories</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

