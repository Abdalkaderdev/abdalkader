'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Cpu, BookOpen, Lightbulb } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { StaggerContainer, StaggerItem } from '@/components/transitions/PageTransition';
import { useReducedMotion } from '@/hooks/useAnimations';

interface PioneerLanguage {
  id: string;
  name: string;
  year: number;
  creator: string;
  description: string;
  significance: string;
  innovations: string[];
  color: string;
  icon: string;
  era: string;
}

const pioneerLanguages: PioneerLanguage[] = [
  {
    id: 'analytical-engine',
    name: 'Analytical Engine',
    year: 1843,
    creator: 'Ada Lovelace',
    description: 'The first conceptual programming language, described by Ada Lovelace for Charles Babbage\'s Analytical Engine.',
    significance: 'First algorithm ever written for a machine, establishing the foundation of programming.',
    innovations: ['First Algorithm', 'Loop Concepts', 'Conditional Logic', 'Machine Instructions'],
    color: '#8B4513',
    icon: '⚙️',
    era: 'Pre-Computer Age',
  },
  {
    id: 'assembly',
    name: 'Assembly Language',
    year: 1949,
    creator: 'Kathleen Booth',
    description: 'Low-level programming language using symbolic representations of machine code instructions.',
    significance: 'Bridged the gap between machine code and human-readable programming.',
    innovations: ['Symbolic Instructions', 'Memory Management', 'Direct Hardware Control', 'Portable Code'],
    color: '#4169E1',
    icon: '🔧',
    era: 'Mainframe Era',
  },
  {
    id: 'fortran',
    name: 'FORTRAN',
    year: 1957,
    creator: 'John Backus (IBM)',
    description: 'Formula Translation - the first high-level programming language designed for scientific computing.',
    significance: 'Revolutionized scientific computing and proved that high-level languages could be efficient.',
    innovations: ['High-Level Syntax', 'Mathematical Expressions', 'Compiler Technology', 'Scientific Computing'],
    color: '#FF6B35',
    icon: '🧮',
    era: 'Mainframe Era',
  },
  {
    id: 'lisp',
    name: 'LISP',
    year: 1958,
    creator: 'John McCarthy (MIT)',
    description: 'List Processing language that became the foundation of artificial intelligence research.',
    significance: 'Introduced functional programming concepts and became the language of AI research.',
    innovations: ['Functional Programming', 'Symbolic Processing', 'Recursion', 'Dynamic Typing'],
    color: '#228B22',
    icon: '🧠',
    era: 'Mainframe Era',
  },
  {
    id: 'cobol',
    name: 'COBOL',
    year: 1959,
    creator: 'Grace Hopper & Committee',
    description: 'Common Business-Oriented Language designed for business data processing.',
    significance: 'Made programming accessible to business users and established data processing standards.',
    innovations: ['Business Logic', 'Data Processing', 'English-like Syntax', 'Portability'],
    color: '#8B008B',
    icon: '💼',
    era: 'Mainframe Era',
  },
];

export const PioneersHall: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<PioneerLanguage | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const reducedMotion = useReducedMotion();

  const handleLanguageSelect = (language: PioneerLanguage) => {
    setSelectedLanguage(language);
  };

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
            className="w-16 h-16 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-lg"
            animate={reducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            ⚙️
          </motion.div>
          <div>
            <h1 className="portfolio-hero-text text-white">THE PIONEERS HALL</h1>
            <p className="portfolio-large-text text-orange-400">1843-1950s Foundational Languages</p>
          </div>
        </div>
        
        <p className="portfolio-base-text text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Step into the dawn of programming history. These foundational languages established the core concepts 
          that every modern programmer relies on today. From Ada Lovelace's first algorithm to the birth of 
          high-level programming, witness the pioneering spirit that created our digital world.
        </p>
      </motion.div>

      {/* View Mode Toggle */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="bg-black/50 backdrop-blur-lg rounded-lg p-1 border border-orange-500/30">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              viewMode === 'timeline' 
                ? 'bg-orange-500 text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            TIMELINE VIEW
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              viewMode === 'grid' 
                ? 'bg-orange-500 text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            GRID VIEW
          </button>
        </div>
      </motion.div>

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-orange-400 rounded-full"></div>
          
          <StaggerContainer className="space-y-12">
            {pioneerLanguages.map((language, index) => (
              <StaggerItem key={language.id} className="relative">
                {/* Timeline Node */}
                <div className="absolute left-6 top-8 w-4 h-4 bg-orange-500 rounded-full border-4 border-black shadow-lg"></div>
                
                {/* Language Card */}
                <div className="ml-20">
                  <InteractiveCard
                    variant="timeline"
                    onClick={() => handleLanguageSelect(language)}
                    className="group"
                    tilt
                    glow
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-r ${language.color} flex items-center justify-center text-xl shadow-lg`}
                          whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {language.icon}
                        </motion.div>
                        <div>
                          <h3 className="portfolio-large-text text-white">{language.name}</h3>
                          <p className="portfolio-base-text text-orange-400">{language.year}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="portfolio-small-text text-gray-400">{language.era}</p>
                        <p className="portfolio-small-text text-orange-400">{language.creator}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {language.description}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="portfolio-small-text text-orange-400 mb-2">SIGNIFICANCE</h4>
                        <p className="text-xs text-gray-300">{language.significance}</p>
                      </div>
                      
                      <div>
                        <h4 className="portfolio-small-text text-orange-400 mb-2">KEY INNOVATIONS</h4>
                        <div className="flex flex-wrap gap-1">
                          {language.innovations.map((innovation, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full"
                            >
                              {innovation}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </InteractiveCard>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </motion.div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pioneerLanguages.map((language, index) => (
            <StaggerItem key={language.id}>
              <InteractiveCard
                variant="language"
                onClick={() => handleLanguageSelect(language)}
                className="group h-full"
                tilt
                glow
                delay={index * 0.1}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${language.color} flex items-center justify-center text-lg`}
                      whileHover={reducedMotion ? {} : { rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {language.icon}
                    </motion.div>
                    <div>
                      <h3 className="portfolio-medium-text text-white">{language.name}</h3>
                      <p className="portfolio-small-text text-orange-400">{language.year}</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">{language.creator}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span className="text-sm">{language.era}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {language.description}
                </p>

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
              </InteractiveCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

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
            className="bg-black/80 backdrop-blur-lg rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-orange-500/30"
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
                <h3 className="portfolio-medium-text text-white mb-3">HISTORICAL SIGNIFICANCE</h3>
                <p className="text-gray-300 leading-relaxed">{selectedLanguage.significance}</p>
              </div>

              <div>
                <h3 className="portfolio-medium-text text-white mb-3">KEY INNOVATIONS</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedLanguage.innovations.map((innovation, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Lightbulb className="w-4 h-4 text-orange-400" />
                      <span className="text-gray-300">{innovation}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default PioneersHall;