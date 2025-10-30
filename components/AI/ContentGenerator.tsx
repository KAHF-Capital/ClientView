'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

interface ContentGeneratorProps {
  type: 'summary' | 'commentary' | 'strategy' | 'disclosure' | 'analysis'
  context: any
  onGenerated: (content: string) => void
}

export function ContentGenerator({ type, context, onGenerated }: ContentGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const endpoint = {
    summary: '/api/ai/generate-summary',
    commentary: '/api/ai/generate-commentary',
    strategy: '/api/ai/generate-strategy',
    disclosure: '/api/ai/generate-disclosure',
    analysis: '/api/ai/analyze-portfolio'
  }[type]

  const labels = {
    summary: 'Executive Summary',
    commentary: 'Market Commentary',
    strategy: 'Investment Strategy',
    disclosure: 'Risk Disclosure',
    analysis: 'Portfolio Analysis'
  }[type]

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      })

      if (!res.ok) {
        throw new Error('Generation failed')
      }

      const data = await res.json()
      
      // Extract the generated content based on response structure
      const content = data.summary || data.commentary || data.strategy || data.disclosure || data.insights
      
      if (content) {
        onGenerated(content)
      } else {
        throw new Error('No content generated')
      }
    } catch (err) {
      console.error('AI generation error:', err)
      setError('Failed to generate content. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleGenerate}
        disabled={generating}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate {labels}
          </>
        )}
      </Button>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

