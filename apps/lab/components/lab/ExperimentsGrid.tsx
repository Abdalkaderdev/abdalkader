'use client'

import { motion } from 'framer-motion'
import { experiments } from '@/data/projects/experiments'
import Link from 'next/link'
import { Clock, Users, Code } from 'lucide-react'

export default function ExperimentsGrid() {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl font-bold gradient-text mb-4">
          Featured Experiments
        </h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Interactive AI demonstrations powered by TensorFlow.js and modern web technologies
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experiments.slice(0, 6).map((experiment, index) => (
          <motion.div
            key={experiment.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link href={`/experiments/${experiment.slug}`}>
              <div className="ai-card hover:scale-105 cursor-pointer h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm text-slate-400">{experiment.category}</span>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">
                    {experiment.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-slate-100 mb-3">
                  {experiment.title}
                </h3>
                
                <p className="text-slate-300 mb-4 line-clamp-3">
                  {experiment.description}
                </p>

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{experiment.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{experiment.complexity}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {experiment.technologies.slice(0, 3).map((tech) => (
                    <span 
                      key={tech}
                      className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/experiments"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          View All Experiments
        </Link>
      </div>
    </div>
  )
}