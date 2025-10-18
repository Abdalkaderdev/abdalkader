'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useReducedMotion } from '@/hooks/useAnimations';

interface Era {
  id: string;
  name: string;
  decade: string;
  description: string;
  keyEvents: string[];
  languages: string[];
  paradigm: string;
  color: string;
  icon: string;
}

interface EraCardProps {
  era: Era;
  onEraSelect?: (era: Era) => void;
  onLanguageSelect?: (language: string) => void;
  onAIExplain?: (content: string) => void;
  className?: string;
  delay?: number;
}

const eraData: Era[] = [
  {
    id: '1840s-1950s',
    name: 'The Dawn of Computing',
    decade: '1840s-1950s',
    description: 'The foundational era where mathematical concepts and mechanical computing devices laid the groundwork for modern programming.',
    keyEvents: ['Analytical Engine (1843)', 'Turing Machine (1936)', 'ENIAC (1946)', 'Assembly Language (1949)'],
    languages: ['Assembly', 'FORTRAN', 'LISP', 'COBOL'],
    paradigm: 'Machine & Assembly',
    color: 'from-amber-500 to-orange-500',
    icon: '⚙️',
  },
  {
    id: '1960s-1970s',
    name: 'The Structured Revolution',
    decade: '1960s-1970s',
    description: 'The birth of high-level languages and structured programming principles that shaped modern software development.',
    keyEvents: ['ALGOL 60 (1960)', 'C Language (1972)', 'Unix OS (1970)', 'Structured Programming'],
    languages: ['C', 'Pascal', 'ALGOL', 'BASIC'],
    paradigm: 'Structured',
    color: 'from-blue-500 to-cyan-500',
    icon: '🏗️',
  },
  {
    id: '1980s-1990s',
    name: 'The Object-Oriented Era',
    decade: '1980s-1990s',
    description: 'The rise of object-oriented programming and the personal computer revolution that democratized programming.',
    keyEvents: ['C++ (1985)', 'Java (1995)', 'Python (1991)', 'World Wide Web (1991)'],
    languages: ['C++', 'Java', 'Python', 'JavaScript', 'Perl'],
    paradigm: 'Object-Oriented',
    color: 'from-green-500 to-emerald-500',
    icon: '🎯',
  },
  {
    id: '2000s-2010s',
    name: 'The Web & Mobile Age',
    decade: '2000s-2010s',
    description: 'The explosion of web technologies, mobile development, and functional programming paradigms.',
    keyEvents: ['iPhone (2007)', 'Node.js (2009)', 'React (2013)', 'TypeScript (2012)'],
    languages: ['JavaScript', 'TypeScript', 'Swift', 'Kotlin', 'Go', 'Rust'],
    paradigm: 'Multi-Paradigm',
    color: 'from-purple-500 to-pink-500',
    icon: '🌐',
  },
  {
    id: '2020s-present',
    name: 'The AI & Quantum Era',
    decade: '2020s-present',
    description: 'The current era of artificial intelligence, quantum computing, and advanced language models.',
    keyEvents: ['GPT-3 (2020)', 'ChatGPT (2022)', 'Quantum Computing', 'AI Code Generation'],
    languages: ['Python', 'Rust', 'Zig', 'Mojo', 'AI-Assisted Code'],
    paradigm: 'AI-Enhanced',
    color: 'from-orange-500 to-red-500',
    icon: '🤖',
  },
];

export const EraCard: React.FC<EraCardProps> = ({
  era,
  onEraSelect,
  onLanguageSelect,
  onAIExplain,
  className = '',
  delay = 0,
}) => {
  const reducedMotion = useReducedMotion();

  const handleEraClick = () => {
    onEraSelect?.(era);
  };

  const handleLanguageClick = (language: string) => {
    onLanguageSelect?.(language);
  };

  const handleAIExplain = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAIExplain?.(era.description);
  };

  return (
    <InteractiveCard
      variant="timeline"
      onClick={handleEraClick}
      className={`${className} group`}
      delay={delay}
      tilt
      glow
    >
      {/* Era Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            className={`w-16 h-16 rounded-xl bg-gradient-to-r ${era.color} flex items-center justify-center text-2xl shadow-lg`}
            whileHover={reducedMotion ? {} : { 
              scale: 1.1, 
              rotate: 5,
            }}
            transition={{ duration: 0.3 }}
          >
            {era.icon}
          </motion.div>
          <div>
            <h3 className="portfolio-large-text text-white mb-1">{era.name}</h3>
            <p className="portfolio-base-text text-orange-400">{era.decade}</p>
          </div>
        </div>
        
        <motion.button
          onClick={handleAIExplain}
          className="portfolio-small-text text-orange-400 hover:text-orange-300 transition-colors opacity-0 group-hover:opacity-100"
          whileHover={reducedMotion ? {} : { scale: 1.1 }}
          whileTap={reducedMotion ? {} : { scale: 0.9 }}
        >
          AI EXPLAIN
        </motion.button>
      </div>

      {/* Era Description */}
      <motion.p 
        className="text-sm text-gray-300 leading-relaxed mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: delay + 0.2, duration: 0.6 }}
      >
        {era.description}
      </motion.p>

      {/* Key Events */}
      <div className="mb-6">
        <h4 className="portfolio-small-text text-orange-400 mb-3">KEY EVENTS</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {era.keyEvents.map((event, index) => (
            <motion.div
              key={event}
              className="flex items-center gap-2 text-xs text-gray-400"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: delay + 0.3 + index * 0.1, 
                duration: 0.4 
              }}
            >
              <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
              <span>{event}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="mb-6">
        <h4 className="portfolio-small-text text-orange-400 mb-3">LANGUAGES</h4>
        <div className="flex flex-wrap gap-2">
          {era.languages.map((language, index) => (
            <motion.button
              key={language}
              onClick={(e) => {
                e.stopPropagation();
                handleLanguageClick(language);
              }}
              className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: delay + 0.4 + index * 0.05, 
                duration: 0.3,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={reducedMotion ? {} : { 
                scale: 1.05,
                y: -2,
              }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
            >
              {language}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Paradigm Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="portfolio-small-text text-gray-400">PARADIGM:</span>
          <motion.span 
            className="portfolio-base-text text-orange-400"
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
          >
            {era.paradigm}
          </motion.span>
        </div>
        
        <motion.div
          className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center"
          whileHover={reducedMotion ? {} : { 
            scale: 1.1,
            rotate: 360,
          }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-black text-xs font-bold">→</span>
        </motion.div>
      </div>
    </InteractiveCard>
  );
};

// Era Grid Component
export const EraGrid: React.FC<{
  onEraSelect?: (era: Era) => void;
  onLanguageSelect?: (language: string) => void;
  onAIExplain?: (content: string) => void;
}> = ({ onEraSelect, onLanguageSelect, onAIExplain }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {eraData.map((era, index) => (
        <EraCard
          key={era.id}
          era={era}
          onEraSelect={onEraSelect}
          onLanguageSelect={onLanguageSelect}
          onAIExplain={onAIExplain}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export { eraData };
export type { Era };