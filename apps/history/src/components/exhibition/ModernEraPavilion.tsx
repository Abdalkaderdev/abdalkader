'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Code, Zap, Users, ArrowRight, Star, TrendingUp } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { StaggerContainer, StaggerItem } from '@/components/transitions/PageTransition';
import { useReducedMotion } from '@/hooks/useAnimations';

interface ModernLanguage {
  id: string;
  name: string;
  year: number;
  creator: string;
  description: string;
  category: string;
  innovations: string[];
  impact: string;
  color: string;
  icon: string;
  examples: string[];
  companies: string[];
  popularity: number;
  trend: 'rising' | 'stable' | 'declining';
}

const modernLanguages: ModernLanguage[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    year: 2012,
    creator: 'Microsoft',
    description: 'JavaScript with static type checking for large-scale application development.',
    category: 'Web Development',
    innovations: ['Static Typing', 'Type Inference', 'Modern JavaScript', 'Tooling'],
    impact: 'Became the standard for large-scale JavaScript applications and improved developer experience.',
    color: '#3178C6',
    icon: '📘',
    examples: ['interface', 'type', 'generics', 'strict mode'],
    companies: ['Microsoft', 'Google', 'Airbnb', 'Netflix'],
    popularity: 95,
    trend: 'rising',
  },
  {
    id: 'rust',
    name: 'Rust',
    year: 2010,
    creator: 'Mozilla',
    description: 'Systems programming language focused on safety, speed, and concurrency.',
    category: 'Systems Programming',
    innovations: ['Memory Safety', 'Zero-Cost Abstractions', 'Ownership', 'Concurrency'],
    impact: 'Revolutionizing systems programming with memory safety without garbage collection.',
    color: '#DEA584',
    icon: '🦀',
    examples: ['fn main()', 'let mut', 'match', 'async/await'],
    companies: ['Mozilla', 'Discord', 'Dropbox', 'Cloudflare'],
    popularity: 88,
    trend: 'rising',
  },
  {
    id: 'go',
    name: 'Go',
    year: 2009,
    creator: 'Google',
    description: 'Simple, efficient programming language for building reliable software.',
    category: 'Backend Development',
    innovations: ['Goroutines', 'Channels', 'Garbage Collection', 'Fast Compilation'],
    impact: 'Became the language of choice for cloud-native applications and microservices.',
    color: '#00ADD8',
    icon: '🐹',
    examples: ['func main()', 'goroutines', 'channels', 'interfaces'],
    companies: ['Google', 'Docker', 'Kubernetes', 'Uber'],
    popularity: 82,
    trend: 'stable',
  },
  {
    id: 'swift',
    name: 'Swift',
    year: 2014,
    creator: 'Apple',
    description: 'Modern programming language for iOS, macOS, and Apple ecosystem development.',
    category: 'Mobile Development',
    innovations: ['Memory Safety', 'Optionals', 'Protocols', 'Playgrounds'],
    impact: 'Transformed iOS development with modern language features and better performance.',
    color: '#FA7343',
    icon: '🍎',
    examples: ['var name', 'func', 'class', 'protocol'],
    companies: ['Apple', 'Uber', 'Airbnb', 'Instagram'],
    popularity: 78,
    trend: 'stable',
  },
  {
    id: 'kotlin',
    name: 'Kotlin',
    year: 2011,
    creator: 'JetBrains',
    description: 'Modern programming language that\'s 100% interoperable with Java.',
    category: 'Mobile Development',
    innovations: ['Null Safety', 'Coroutines', 'Extension Functions', 'Interoperability'],
    impact: 'Became the preferred language for Android development and modern Java applications.',
    color: '#7F52FF',
    icon: '🟣',
    examples: ['fun main()', 'val/var', 'data class', 'suspend fun'],
    companies: ['Google', 'JetBrains', 'Pinterest', 'Trello'],
    popularity: 85,
    trend: 'rising',
  },
  {
    id: 'zig',
    name: 'Zig',
    year: 2016,
    creator: 'Andrew Kelley',
    description: 'General-purpose programming language designed for robustness and optimality.',
    category: 'Systems Programming',
    innovations: ['Compile-time Execution', 'No Hidden Allocations', 'Error Handling', 'C Interop'],
    impact: 'Emerging as a modern alternative to C with better safety and performance.',
    color: '#F7A41D',
    icon: '⚡',
    examples: ['const', 'fn', 'comptime', 'error handling'],
    companies: ['Bun', 'TigerBeetle', 'OpenGL', 'Emerging'],
    popularity: 45,
    trend: 'rising',
  },
];

export const ModernEraPavilion: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<ModernLanguage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'year' | 'popularity' | 'trend'>('popularity');
  const reducedMotion = useReducedMotion();

  const categories = [...new Set(modernLanguages.map(lang => lang.category))];

  const filteredLanguages = selectedCategory 
    ? modernLanguages.filter(lang => lang.category === selectedCategory)
    : modernLanguages;

  const sortedLanguages = [...filteredLanguages].sort((a, b) => {
    switch (sortBy) {
      case 'year':
        return b.year - a.year;
      case 'popularity':
        return b.popularity - a.popularity;
      case 'trend':
        const trendOrder = { rising: 3, stable: 2, declining: 1 };
        return trendOrder[b.trend] - trendOrder[a.trend];
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.div
            className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg"
            animate={reducedMotion ? {} : { rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            🚀
          </motion.div>
          <div>
            <h1 className="portfolio-hero-text text-white">MODERN ERA PAVILION</h1>
            <p className="portfolio-large-text text-orange-400">2000s-Present Languages</p>
          </div>
        </div>
        
        <p className="portfolio-base-text text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Experience the cutting-edge of programming today. These modern languages represent the latest 
          innovations in software development, from memory safety to concurrency, from mobile apps to 
          cloud computing. Discover the tools that are shaping our digital future.
        </p>
      </motion.div>

      {/* Filters and Sorting */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <InteractiveButton
            onClick={() => setSelectedCategory(null)}
            variant={selectedCategory === null ? 'primary' : 'ghost'}
            size="sm"
          >
            ALL CATEGORIES
          </InteractiveButton>
          {categories.map((category) => (
            <InteractiveButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'primary' : 'ghost'}
              size="sm"
            >
              {category.toUpperCase()}
            </InteractiveButton>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex gap-2">
          <InteractiveButton
            onClick={() => setSortBy('popularity')}
            variant={sortBy === 'popularity' ? 'primary' : 'ghost'}
            size="sm"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            POPULARITY
          </InteractiveButton>
          <InteractiveButton
            onClick={() => setSortBy('year')}
            variant={sortBy === 'year' ? 'primary' : 'ghost'}
            size="sm"
          >
            YEAR
          </InteractiveButton>
          <InteractiveButton
            onClick={() => setSortBy('trend')}
            variant={sortBy === 'trend' ? 'primary' : 'ghost'}
            size="sm"
          >
            TREND
          </InteractiveButton>
        </div>
      </motion.div>

      {/* Languages Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedLanguages.map((language, index) => (
          <StaggerItem key={language.id}>
            <InteractiveCard
              variant="language"
              onClick={() => setSelectedLanguage(language)}
              className="group h-full"
              tilt
              glow
              delay={index * 0.1}
            >
              {/* Language Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${language.color} flex items-center justify-center text-xl`}
                    whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {language.icon}
                  </motion.div>
                  <div>
                    <h3 className="portfolio-medium-text text-white">{language.name}</h3>
                    <p className="portfolio-small-text text-orange-400">{language.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <motion.div
                    animate={language.trend === 'rising' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Star className={`w-4 h-4 ${
                      language.trend === 'rising' ? 'text-green-400' : 
                      language.trend === 'stable' ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                  </motion.div>
                </div>
              </div>

              {/* Creator and Category */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">{language.creator}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Code className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">{language.category}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {language.description}
              </p>

              {/* Popularity Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="portfolio-small-text text-orange-400">POPULARITY</span>
                  <span className="portfolio-small-text text-gray-300">{language.popularity}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${language.popularity}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </div>

              {/* Key Innovations */}
              <div className="space-y-2">
                <h4 className="portfolio-small-text text-orange-400">INNOVATIONS</h4>
                <div className="flex flex-wrap gap-1">
                  {language.innovations.slice(0, 3).map((innovation, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full"
                    >
                      {innovation}
                    </span>
                  ))}
                  {language.innovations.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-full">
                      +{language.innovations.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Hover indicator */}
              <motion.div
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={reducedMotion ? {} : { x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-4 h-4 text-orange-400" />
              </motion.div>
            </InteractiveCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Selected Language Detail Modal */}
      {selectedLanguage && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedLanguage(null)}
        >
          <motion.div
            className="bg-black/80 backdrop-blur-lg rounded-xl p-8 max-w-5xl w-full max-h-[80vh] overflow-y-auto border border-orange-500/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${selectedLanguage.color} flex items-center justify-center text-3xl`}>
                  {selectedLanguage.icon}
                </div>
                <div>
                  <h2 className="portfolio-hero-text text-white">{selectedLanguage.name}</h2>
                  <p className="portfolio-large-text text-orange-400">{selectedLanguage.year} • {selectedLanguage.creator}</p>
                  <p className="portfolio-base-text text-gray-300">{selectedLanguage.category}</p>
                </div>
              </div>
              <InteractiveButton
                onClick={() => setSelectedLanguage(null)}
                variant="ghost"
                size="sm"
              >
                ✕
              </InteractiveButton>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="portfolio-medium-text text-white mb-3">DESCRIPTION</h3>
                <p className="text-gray-300 leading-relaxed">{selectedLanguage.description}</p>
              </div>

              <div>
                <h3 className="portfolio-medium-text text-white mb-3">CURRENT IMPACT</h3>
                <p className="text-gray-300 leading-relaxed">{selectedLanguage.impact}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <h3 className="portfolio-medium-text text-white mb-3">KEY INNOVATIONS</h3>
                  <div className="space-y-2">
                    {selectedLanguage.innovations.map((innovation, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <Zap className="w-4 h-4 text-orange-400" />
                        <span className="text-gray-300">{innovation}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="portfolio-medium-text text-white mb-3">CODE EXAMPLES</h3>
                  <div className="space-y-2">
                    {selectedLanguage.examples.map((example, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <Code className="w-4 h-4 text-orange-400" />
                        <code className="text-orange-300 font-mono text-sm">{example}</code>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="portfolio-medium-text text-white mb-3">USED BY</h3>
                  <div className="space-y-2">
                    {selectedLanguage.companies.map((company, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <Rocket className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{company}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ModernEraPavilion;