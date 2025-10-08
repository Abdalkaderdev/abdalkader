'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './ProjectCard'
import FilterControls, { FilterState } from './FilterControls'

// Types
export interface Project {
  id: string
  title: string
  description: string
  category: 'Computer Vision' | 'NLP' | 'Generative AI' | 'Interactive ML' | 'Data Visualization' | 'Audio Processing'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  technologies: string[]
  imageUrl?: string
  demoUrl?: string
  githubUrl?: string
  status: 'Active' | 'Beta' | 'Coming Soon'
  featured: boolean
}

interface ProjectGridSimpleProps {
  projects?: Project[]
  showFilters?: boolean
  showSearch?: boolean
  className?: string
}

export default function ProjectGridSimple({ 
  projects = [], 
  showFilters = true, 
  showSearch = true,
  className = '' 
}: ProjectGridSimpleProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategory: 'all',
    selectedDifficulty: 'all',
    selectedStatus: 'all'
  })

  // Get unique values for filters
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(projects.map(project => project.category)))
    return ['all', ...uniqueCategories]
  }, [projects])

  const difficulties = useMemo(() => {
    const uniqueDifficulties = Array.from(new Set(projects.map(project => project.difficulty)))
    return ['all', ...uniqueDifficulties]
  }, [projects])

  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(projects.map(project => project.status)))
    return ['all', ...uniqueStatuses]
  }, [projects])

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = filters.searchTerm === '' || 
        project.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(filters.searchTerm.toLowerCase()))

      const matchesCategory = filters.selectedCategory === 'all' || project.category === filters.selectedCategory
      const matchesDifficulty = filters.selectedDifficulty === 'all' || project.difficulty === filters.selectedDifficulty
      const matchesStatus = filters.selectedStatus === 'all' || project.status === filters.selectedStatus

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus
    })
  }, [projects, filters])

  const handleViewDetails = (project: Project) => {
    // This would typically navigate to the project details page
    console.log('View details for:', project.title)
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Filters and Search */}
      <FilterControls
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        difficulties={difficulties}
        statuses={statuses}
        showSearch={showSearch}
        showFilters={showFilters}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-slate-400 text-sm">
          Showing {filteredProjects.length} of {projects.length} experiments
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-sm">Sort by:</span>
          <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="featured">Featured First</option>
            <option value="alphabetical">A-Z</option>
            <option value="difficulty">Difficulty</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        {filteredProjects.length > 0 ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="text-slate-400 text-lg mb-2">No experiments found</div>
            <p className="text-slate-500 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => setFilters({
                searchTerm: '',
                selectedCategory: 'all',
                selectedDifficulty: 'all',
                selectedStatus: 'all'
              })}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}