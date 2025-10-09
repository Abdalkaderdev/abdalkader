import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiClock, FiUsers, FiTag } from 'react-icons/fi';
import Link from 'next/link';
import SEOHead from '../../components/SEO/Head';
import JsonLd from '../../components/SEO/JsonLd';
import SearchBar from '../../components/SearchBar';
import { breadcrumbsJsonLd } from '../../utils/jsonld';
import { experiments, Experiment } from '../../data/experimentsData';

export default function ExperimentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const categories = ['all', ...Array.from(new Set(experiments.map(exp => exp.category)))];
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const statuses = ['all', 'active', 'coming-soon', 'deprecated'];

  const filteredExperiments = useMemo(() => {
    return experiments.filter(experiment => {
      const matchesSearch = searchQuery === '' || 
        experiment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        experiment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        experiment.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || experiment.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || experiment.difficulty === selectedDifficulty;
      const matchesStatus = selectedStatus === 'all' || experiment.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedStatus]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'coming-soon': return 'text-yellow-400 bg-yellow-500/20';
      case 'deprecated': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const breadcrumbs = [
    { name: 'AI Lab', item: '/' },
    { name: 'Experiments', item: '/experiments' }
  ];

  return (
    <>
      <SEOHead 
        title="AI Lab Experiments - Interactive Machine Learning Demos"
        description="Explore our collection of interactive AI experiments, machine learning demos, and computer vision applications. Hands-on learning with real-time visualizations and live coding environments."
        keywords={['AI Experiments', 'Machine Learning', 'Computer Vision', 'Interactive Demos', 'TensorFlow.js', 'Neural Networks']}
      />
      <JsonLd type="breadcrumbs" data={breadcrumbs} />
      
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
          <div className="container mx-auto px-4 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold gradient-text mb-4" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                AI Lab Experiments
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Explore interactive machine learning demos, computer vision experiments, and AI-powered tools. 
                Learn through hands-on experimentation with real-time visualizations.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lab-card p-6 mb-8"
          >
            <div className="space-y-4">
              {/* Search Bar */}
              <SearchBar 
                placeholder="Search experiments, technologies, or tags..."
                onResultSelect={(experiment) => {
                  // Navigate to experiment page
                  window.location.href = `/experiments/${experiment.id}`;
                }}
              />

              {/* Additional Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty === 'all' ? 'All Levels' : difficulty}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <p className="text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
              Showing {filteredExperiments.length} of {experiments.length} experiments
            </p>
          </motion.div>

          {/* Experiments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((experiment, index) => (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/experiments/${experiment.id}`}>
                  <div className="lab-card p-6 hover:scale-105 cursor-pointer h-full flex flex-col">
                    {/* Image Placeholder */}
                    <div className="aspect-video bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                          <FiTag className="w-6 h-6 text-orange-500" />
                        </div>
                        <p className="text-gray-400 text-sm">Preview</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                          {experiment.title}
                        </h3>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(experiment.status)}`}>
                            {experiment.status.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(experiment.difficulty)}`}>
                            {experiment.difficulty}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-4 flex-1" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                        {experiment.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            <span>{experiment.estimatedTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiUsers className="w-4 h-4" />
                            <span>{experiment.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="mt-4 flex flex-wrap gap-1">
                        {experiment.technologies.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                        {experiment.technologies.length > 3 && (
                          <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                            +{experiment.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredExperiments.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'var(--font-pp-medium)' }}>
                No experiments found
              </h3>
              <p className="text-gray-400" style={{ fontFamily: 'var(--font-pp-regular)' }}>
                Try adjusting your search criteria or browse all experiments.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}