'use client'

import { Search, Filter, X } from 'lucide-react'

export interface FilterState {
  searchTerm: string
  selectedCategory: string
  selectedDifficulty: string
  selectedStatus: string
}

interface FilterControlsProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  categories: string[]
  difficulties: string[]
  statuses: string[]
  showSearch?: boolean
  showFilters?: boolean
  className?: string
}

export default function FilterControls({
  filters,
  onFiltersChange,
  categories,
  difficulties,
  statuses,
  showSearch = true,
  showFilters = true,
  className = ''
}: FilterControlsProps) {
  const hasActiveFilters = 
    filters.searchTerm !== '' ||
    filters.selectedCategory !== 'all' ||
    filters.selectedDifficulty !== 'all' ||
    filters.selectedStatus !== 'all'

  const clearAllFilters = () => {
    onFiltersChange({
      searchTerm: '',
      selectedCategory: 'all',
      selectedDifficulty: 'all',
      selectedStatus: 'all'
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search experiments, technologies, or descriptions..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
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
            value={filters.selectedCategory}
            onChange={(e) => onFiltersChange({ ...filters, selectedCategory: e.target.value })}
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
            value={filters.selectedDifficulty}
            onChange={(e) => onFiltersChange({ ...filters, selectedDifficulty: e.target.value })}
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
            value={filters.selectedStatus}
            onChange={(e) => onFiltersChange({ ...filters, selectedStatus: e.target.value })}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status} className="capitalize">
                {status === 'all' ? 'All Status' : status}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center space-x-1 text-slate-400 hover:text-slate-300 text-sm transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}