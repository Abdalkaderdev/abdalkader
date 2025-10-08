'use client'

import { motion } from 'framer-motion'
import { Brain, Cpu, Eye, Zap } from 'lucide-react'

export default function TechStack() {
  const technologies = [
    {
      icon: <Brain className="w-8 h-8" />,
      name: "TensorFlow.js",
      description: "Machine learning in the browser",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      name: "Computer Vision",
      description: "Real-time image processing",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      name: "Machine Learning",
      description: "Neural networks & AI models",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      name: "Neural Networks",
      description: "Deep learning architectures",
      color: "from-purple-500 to-pink-500"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="ai-card"
      >
        <h2 className="text-3xl font-bold gradient-text mb-8 text-center">
          Powered by AI & Machine Learning Technologies
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${tech.color} flex items-center justify-center text-white shadow-lg`}>
                {tech.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-100 mb-2">
                {tech.name}
              </h3>
              <p className="text-sm text-slate-300">
                {tech.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}