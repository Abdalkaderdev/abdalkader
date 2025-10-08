'use client'

import { useState } from 'react'
import { experiments } from '@/data/projects/experiments'
import { ArrowLeft, ExternalLink, Github, Play, Pause, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface ExperimentViewerProps {
  experiment: typeof experiments[0]
}

export default function ExperimentViewer({ experiment }: ExperimentViewerProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const handleRun = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        href="/experiments" 
        className="inline-flex items-center space-x-2 text-slate-300 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Experiments</span>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="ai-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">
                  {experiment.title}
                </h1>
                <p className="text-slate-300 text-lg">
                  {experiment.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                  {experiment.difficulty}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {experiment.technologies.map((tech) => (
                <span 
                  key={tech}
                  className="text-sm bg-slate-800 text-slate-300 px-3 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Experiment Interface */}
          <div className="ai-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-100">
                Interactive Demo
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning && !isPaused}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunning && !isPaused ? 'Running' : 'Run'}</span>
                </button>
                
                {isRunning && (
                  <button
                    onClick={handlePause}
                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                )}
                
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Demo Area */}
            <div className="bg-slate-900 rounded-lg p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-700">
              <div className="text-center">
                <div className="text-slate-400 mb-4">
                  {experiment.category === 'Computer Vision' && '👁️'}
                  {experiment.category === 'NLP' && '🧠'}
                  {experiment.category === 'Generative AI' && '🎨'}
                  {experiment.category === 'Interactive ML' && '⚡'}
                  {experiment.category === 'Data Visualization' && '📊'}
                </div>
                <p className="text-slate-300 mb-2">
                  {isRunning ? 'Experiment is running...' : 'Click "Run" to start the experiment'}
                </p>
                <p className="text-sm text-slate-500">
                  Interactive demo will be implemented here
                </p>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="ai-card">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              How It Works
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 mb-4">
                This experiment demonstrates the power of modern web-based machine learning. 
                By leveraging TensorFlow.js and other cutting-edge technologies, we can run 
                sophisticated AI models directly in your browser.
              </p>
              <p className="text-slate-300">
                The implementation combines real-time processing, interactive visualizations, 
                and seamless user experience to showcase the potential of AI in web applications.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Experiment Info */}
          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Experiment Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-300 capitalize">{experiment.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="text-slate-300">{experiment.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Complexity:</span>
                <span className="text-slate-300">{experiment.complexity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Difficulty:</span>
                <span className="text-slate-300">{experiment.difficulty}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Actions
            </h3>
            <div className="space-y-3">
              {experiment.githubUrl && (
                <a
                  href={experiment.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>View Source Code</span>
                  <ExternalLink className="w-3 h-3 ml-auto" />
                </a>
              )}
              
              {experiment.demoUrl && (
                <a
                  href={experiment.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Related Experiments */}
          <div className="ai-card">
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Related Experiments
            </h3>
            <div className="space-y-2">
              {experiments
                .filter(exp => exp.category === experiment.category && exp.slug !== experiment.slug)
                .slice(0, 3)
                .map((relatedExp) => (
                  <Link
                    key={relatedExp.slug}
                    href={`/experiments/${relatedExp.slug}`}
                    className="block p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <div className="text-sm font-medium text-slate-100 mb-1">
                      {relatedExp.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {relatedExp.difficulty} • {relatedExp.duration}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}