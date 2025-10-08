'use client'

import { useState } from 'react'
import { experiments } from '@/data/projects/experiments'
import Link from 'next/link'
import { Search, Filter, Clock, Users, Code } from 'lucide-react'

export default function ExperimentsList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  
  const categories = ['all', ...new Set(experiments.map(exp => exp.category))]
  
  const filteredExperiments = experiments.filter(experiment => {
    const matchesSearch = experiment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experiment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         experiment.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || experiment.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category} className="capitalize">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div className="text-slate-400">
        Showing {filteredExperiments.length} of {experiments.length} experiments
      </div>

      {/* Experiments Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExperiments.map((experiment) => (
          <Link key={experiment.slug} href={`/experiments/${experiment.slug}`}>
            <div className="ai-card hover:scale-105 cursor-pointer h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm text-slate-400 capitalize">{experiment.category}</span>
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

              <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{experiment.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{experiment.complexity}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {experiment.technologies.slice(0, 4).map((tech) => (
                  <span 
                    key={tech}
                    className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
                {experiment.technologies.length > 4 && (
                  <span className="text-xs text-slate-500">
                    +{experiment.technologies.length - 4} more
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredExperiments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">No experiments found</div>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}