import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiFilter, FiClock } from 'react-icons/fi';
import { useSearch } from '../hooks/useSearch';
import { Experiment } from '../data/experimentsData';

interface SearchBarProps {
  onResultSelect?: (experiment: Experiment) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onResultSelect, 
  placeholder = "Search experiments...",
  className = "" 
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { 
    query, 
    filters, 
    results, 
    isLoading, 
    error, 
    updateQuery, 
    updateFilters, 
    clearSearch 
  } = useSearch({
    debounceMs: 300,
    minQueryLength: 1
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleResultClick = (experiment: Experiment) => {
    onResultSelect?.(experiment);
    setIsOpen(false);
    clearSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      clearSearch();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'coming-soon': return 'text-yellow-400';
      case 'deprecated': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <FiSearch className="w-5 h-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => updateQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-20 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 rounded transition-colors ${
              showFilters 
                ? 'bg-orange-500 text-black' 
                : 'hover:bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            <FiFilter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 p-4 bg-gray-800 border border-gray-700 rounded-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Interactive Development">Interactive Development</option>
                  <option value="AI Code Generation">AI Code Generation</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Visualization">Data Visualization</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => updateFilters({ difficulty: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilters({ status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="coming-soon">Coming Soon</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Results */}
      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                <p className="text-gray-400 text-sm">Searching...</p>
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            ) : results.results.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-400 text-sm">No experiments found</p>
              </div>
            ) : (
              <div className="py-2">
                {results.results.map((experiment) => (
                  <button
                    key={experiment.id}
                    onClick={() => handleResultClick(experiment)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                          {experiment.title}
                        </h4>
                        <p className="text-gray-400 text-sm truncate mt-1" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                          {experiment.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs ${getDifficultyColor(experiment.difficulty)}`}>
                            {experiment.difficulty}
                          </span>
                          <span className={`text-xs ${getStatusColor(experiment.status)}`}>
                            {experiment.status.replace('-', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {experiment.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                
                {results.total > results.results.length && (
                  <div className="px-4 py-2 border-t border-gray-700">
                    <p className="text-gray-400 text-sm text-center">
                      Showing {results.results.length} of {results.total} results
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}