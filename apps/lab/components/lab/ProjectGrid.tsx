'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
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

// Types for the project data
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

// Sample data for demonstration
const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Real-time Object Detection',
    description: 'Interactive computer vision demo using pre-trained models for real-time object detection in web browsers.',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    technologies: ['TensorFlow.js', 'WebRTC', 'Canvas API'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/object-detection',
    githubUrl: 'https://github.com/abdalkaderdev/object-detection',
    status: 'Active',
    featured: true
  },
  {
    id: '2',
    title: 'AI Code Generation',
    description: 'Generate React components and train machine learning models using natural language prompts.',
    category: 'Generative AI',
    difficulty: 'Advanced',
    technologies: ['OpenAI API', 'Transformers.js', 'React'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/ai-code-gen',
    githubUrl: 'https://github.com/abdalkaderdev/ai-code-gen',
    status: 'Beta',
    featured: true
  },
  {
    id: '3',
    title: 'Neural Network Visualization',
    description: 'Interactive neural network playground with real-time model visualization and training simulations.',
    category: 'Interactive ML',
    difficulty: 'Intermediate',
    technologies: ['TensorFlow.js', 'D3.js', 'WebGL'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/neural-viz',
    githubUrl: 'https://github.com/abdalkaderdev/neural-viz',
    status: 'Active',
    featured: true
  },
  {
    id: '4',
    title: 'Sentiment Analysis',
    description: 'Analyze text sentiment in real-time using state-of-the-art transformer models.',
    category: 'NLP',
    difficulty: 'Beginner',
    technologies: ['Transformers.js', 'BERT', 'React'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/sentiment-analysis',
    status: 'Active',
    featured: false
  },
  {
    id: '5',
    title: 'Style Transfer',
    description: 'Transform images using neural style transfer with artistic combinations using deep learning.',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    technologies: ['TensorFlow.js', 'CNN', 'WebGL'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/style-transfer',
    status: 'Beta',
    featured: false
  },
  {
    id: '6',
    title: 'Text-to-Image Generation',
    description: 'Generate images from text descriptions using diffusion models and create unique artwork.',
    category: 'Generative AI',
    difficulty: 'Beginner',
    technologies: ['Stable Diffusion', 'Transformers.js'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/text-to-image',
    status: 'Coming Soon',
    featured: false
  },
  {
    id: '7',
    title: 'Audio Classification',
    description: 'Classify audio samples and sounds using machine learning models in the browser.',
    category: 'Audio Processing',
    difficulty: 'Intermediate',
    technologies: ['TensorFlow.js', 'Web Audio API'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/audio-classification',
    status: 'Active',
    featured: false
  },
  {
    id: '8',
    title: 'Data Visualization Dashboard',
    description: 'Interactive dashboard for visualizing machine learning datasets and model performance.',
    category: 'Data Visualization',
    difficulty: 'Beginner',
    technologies: ['D3.js', 'React', 'Chart.js'],
    imageUrl: '/api/placeholder/400/300',
    demoUrl: '/demo/data-viz',
    status: 'Active',
    featured: false
  }
]

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

interface ProjectGridProps {
  projects?: Project[]
  showFilters?: boolean
  showSearch?: boolean
  className?: string
}

export default function ProjectGrid({ 
  projects = sampleProjects, 
  showFilters = true, 
  showSearch = true,
  className = '' 
}: ProjectGridProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(projects.map(project => project.category)))
    return ['all', ...uniqueCategories]
  }, [projects])

  // Get unique difficulties for filter
  const difficulties = useMemo(() => {
    const uniqueDifficulties = Array.from(new Set(projects.map(project => project.difficulty)))
    return ['all', ...uniqueDifficulties]
  }, [projects])

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const uniqueStatuses = Array.from(new Set(projects.map(project => project.status)))
    return ['all', ...uniqueStatuses]
  }, [projects])

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchTerm === '' || 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'all' || project.difficulty === selectedDifficulty
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus
    })
  }, [projects, searchTerm, selectedCategory, selectedDifficulty, selectedStatus])

  const ProjectCard = ({ project }: { project: Project }) => {
    const CategoryIcon = categoryIcons[project.category]
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="group"
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

              <button className="flex items-center space-x-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors ml-auto">
                <Eye className="w-3 h-3" />
                <span>Details</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Filters and Search */}
      {(showSearch || showFilters) && (
        <div className="space-y-4">
          {/* Search Bar */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search experiments, technologies, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Filter Controls */}
          {showFilters && (
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm font-medium">Filters:</span>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="capitalize">
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              {/* Difficulty Filter */}
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="capitalize">
                    {difficulty === 'all' ? 'All Levels' : difficulty}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status} className="capitalize">
                    {status === 'all' ? 'All Status' : status}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedDifficulty('all')
                    setSelectedStatus('all')
                    setSearchTerm('')
                  }}
                  className="text-slate-400 hover:text-slate-300 text-sm underline"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      )}

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
              <ProjectCard key={project.id} project={project} />
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
              onClick={() => {
                setSelectedCategory('all')
                setSelectedDifficulty('all')
                setSelectedStatus('all')
                setSearchTerm('')
              }}
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