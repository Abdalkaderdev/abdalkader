'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Eye } from 'lucide-react'
import Link from 'next/link'

export default function LabHero() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Real-time Object Detection with TensorFlow.js",
      description: "Interactive computer vision demo using pre-trained models for real-time object detection in web browsers",
      href: "/experiments/object-detection",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Code Generation & ML Model Training",
      description: "Generate components and train machine learning models using natural language prompts and interactive interfaces",
      href: "/experiments/ai-code-gen",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Neural Network Visualization",
      description: "Interactive neural network playground with real-time model visualization and training simulations",
      href: "/experiments/neural-viz",
      color: "from-green-500 to-emerald-500"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-bold gradient-text mb-6">
          AI & Interactive Experiments Lab
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
          Explore cutting-edge AI experiments, machine learning demos, and interactive TensorFlow.js applications. 
          From real-time object detection to neural network visualizations.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/experiments"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Explore AI Experiments
          </Link>
          <Link
            href="/experiments/ai-code-gen"
            className="px-8 py-3 border border-slate-300 text-slate-300 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
          >
            Train ML Models
          </Link>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link href={feature.href}>
              <div className="ai-card hover:scale-105 cursor-pointer">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-300">
                  {feature.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}