'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Users, Zap, BookOpen, ArrowRight } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { StaggerContainer, StaggerItem } from '@/components/transitions/PageTransition';
import { useReducedMotion } from '@/hooks/useAnimations';

interface RevolutionLanguage {
  id: string;
  name: string;
  year: number;
  creator: string;
  description: string;
  paradigm: string;
  innovations: string[];
  impact: string;
  color: string;
  icon: string;
  examples: string[];
}

const revolutionLanguages: RevolutionLanguage[] = [
  {
    id: 'algol',
    name: 'ALGOL 60',
    year: 1960,
    creator: 'IFIP Working Group',
    description: 'Algorithmic Language - the first language to use block structure and formal syntax definition.',
    paradigm: 'Structured Programming',
    innovations: ['Block Structure', 'Formal Syntax', 'Recursion', 'Parameter Passing'],
    impact: 'Established the foundation for modern programming language design principles.',
    color: '#1E90FF',
    icon: '🏗️',
    examples: ['procedure', 'begin/end blocks', 'if-then-else', 'for loops'],
  },
  {
    id: 'c',
    name: 'C Language',
    year: 1972,
    creator: 'Dennis Ritchie (Bell Labs)',
    description: 'System programming language that combined high-level features with low-level control.',
    paradigm: 'Procedural Programming',
    innovations: ['Pointers', 'Memory Management', 'Portability', 'Efficiency'],
    impact: 'Became the foundation for Unix, Linux, and most modern operating systems.',
    color: '#0000FF',
    icon: '⚡',
    examples: ['int main()', 'printf()', 'malloc()', 'struct'],
  },
  {
    id: 'pascal',
    name: 'Pascal',
    year: 1970,
    creator: 'Niklaus Wirth',
    description: 'Educational language designed to teach structured programming concepts.',
    paradigm: 'Structured Programming',
    innovations: ['Type Safety', 'Strong Typing', 'Educational Design', 'Readability'],
    impact: 'Revolutionized computer science education and influenced modern language design.',
    color: '#8B008B',
    icon: '📚',
    examples: ['program', 'var', 'begin/end', 'type definitions'],
  },
  {
    id: 'simula',
    name: 'Simula',
    year: 1967,
    creator: 'Ole-Johan Dahl & Kristen Nygaard',
    description: 'First object-oriented programming language, introducing classes and objects.',
    paradigm: 'Object-Oriented Programming',
    innovations: ['Classes', 'Objects', 'Inheritance', 'Simulation'],
    impact: 'Pioneered object-oriented programming concepts that dominate modern development.',
    color: '#FF6347',
    icon: '🎯',
    examples: ['class', 'object', 'inheritance', 'simulation'],
  },
  {
    id: 'smalltalk',
    name: 'Smalltalk',
    year: 1972,
    creator: 'Alan Kay (Xerox PARC)',
    description: 'Pure object-oriented language that popularized OOP concepts and GUI programming.',
    paradigm: 'Pure Object-Oriented',
    innovations: ['Pure OOP', 'Message Passing', 'Dynamic Typing', 'GUI Programming'],
    impact: 'Influenced modern OOP languages and introduced graphical user interfaces.',
    color: '#32CD32',
    icon: '🖥️',
    examples: ['Object subclass', 'message passing', 'MVC pattern', 'GUI components'],
  },
];

export const RevolutionWing: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<RevolutionLanguage | null>(null);
  const [selectedParadigm, setSelectedParadigm] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const paradigms = [...new Set(revolutionLanguages.map(lang => lang.paradigm))];

  const filteredLanguages = selectedParadigm 
    ? revolutionLanguages.filter(lang => lang.paradigm === selectedParadigm)
    : revolutionLanguages;

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
            className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg"
            animate={reducedMotion ? {} : { rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            🏗️
          </motion.div>
          <div>
            <h1 className="portfolio-hero-text text-white">THE REVOLUTION WING</h1>
            <p className="portfolio-large-text text-orange-400">1960s-1970s Paradigm Shifts</p>
          </div>
        </div>
        
        <p className="portfolio-base-text text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Experience the programming revolution that changed everything. From structured programming to 
          object-oriented design, these languages introduced concepts that still define how we write code today. 
          Witness the birth of modern software engineering principles.
        </p>
      </motion.div>

      {/* Paradigm Filter */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <InteractiveButton
          onClick={() => setSelectedParadigm(null)}
          variant={selectedParadigm === null ? 'primary' : 'ghost'}
          size="sm"
        >
          ALL PARADIGMS
        </InteractiveButton>
        {paradigms.map((paradigm) => (
          <InteractiveButton
            key={paradigm}
            onClick={() => setSelectedParadigm(paradigm)}
            variant={selectedParadigm === paradigm ? 'primary' : 'ghost'}
            size="sm"
          >
            {paradigm.toUpperCase()}
          </InteractiveButton>
        ))}
      </motion.div>

      {/* Languages Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLanguages.map((language, index) => (
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
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              </div>

              {/* Creator and Paradigm */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">{language.creator}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Code2 className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">{language.paradigm}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {language.description}
              </p>

              {/* Impact */}
              <div className="mb-4">
                <h4 className="portfolio-small-text text-orange-400 mb-2">IMPACT</h4>
                <p className="text-xs text-gray-300 line-clamp-2">{language.impact}</p>
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
                  <p className="portfolio-base-text text-gray-300">{selectedLanguage.paradigm}</p>
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
                <h3 className="portfolio-medium-text text-white mb-3">HISTORICAL IMPACT</h3>
                <p className="text-gray-300 leading-relaxed">{selectedLanguage.impact}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <Code2 className="w-4 h-4 text-orange-400" />
                        <code className="text-orange-300 font-mono text-sm">{example}</code>
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

export default RevolutionWing;