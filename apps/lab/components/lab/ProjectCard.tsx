'use client'

import { motion } from 'framer-motion'
import { 
  ExternalLink, 
  Play, 
  Code, 
  Eye,
  Brain,
  MessageSquare,
  Sparkles,
  Monitor,
  BarChart3,
  Volume2
} from 'lucide-react'

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

// Category icons mapping
const categoryIcons = {
  'Computer Vision': Monitor,
  'NLP': MessageSquare,
  'Generative AI': Sparkles,
  'Interactive ML': Brain,
  'Data Visualization': BarChart3,
  'Audio Processing': Volume2
}

// Difficulty color mapping
const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'Intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  'Advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
}

// Status color mapping
const statusColors = {
  'Active': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  'Beta': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  'Coming Soon': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
}

interface ProjectCardProps {
  project: Project
  onViewDetails?: (project: Project) => void
  className?: string
}

export default function ProjectCard({ 
  project, 
  onViewDetails,
  className = '' 
}: ProjectCardProps) {
  const CategoryIcon = categoryIcons[project.category]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`group ${className}`}
    >
      <div className="ai-card hover:scale-105 cursor-pointer h-full">
        {/* Image Preview */}
        <div className="relative mb-4 overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="aspect-video w-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <CategoryIcon className="w-16 h-16 text-slate-400 group-hover:text-blue-400 transition-colors" />
          </div>
          
          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Featured
              </span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[project.status]}`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <CategoryIcon className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-400 capitalize">{project.category}</span>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColors[project.difficulty]}`}>
              {project.difficulty}
            </span>
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>
            <p className="text-slate-300 text-sm line-clamp-3">
              {project.description}
            </p>
          </div>

          {/* Technology Badges */}
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <span 
                key={tech}
                className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded-md hover:bg-slate-700 transition-colors"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 3 && (
              <span className="text-xs text-slate-500 px-2 py-1">
                +{project.technologies.length - 3} more
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors group/btn"
              >
                <Play className="w-3 h-3" />
                <span>Demo</span>
              </a>
            )}
            
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors group/btn"
              >
                <Code className="w-3 h-3" />
                <span>Code</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              </a>
            )}

            <button 
              onClick={() => onViewDetails?.(project)}
              className="flex items-center space-x-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors ml-auto"
            >
              <Eye className="w-3 h-3" />
              <span>Details</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}