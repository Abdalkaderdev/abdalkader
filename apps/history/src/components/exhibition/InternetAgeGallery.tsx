'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Code, Zap, Users, ArrowRight, Play } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { StaggerContainer, StaggerItem } from '@/components/transitions/PageTransition';
import { useReducedMotion } from '@/hooks/useAnimations';

interface WebLanguage {
  id: string;
  name: string;
  year: number;
  creator: string;
  description: string;
  purpose: string;
  innovations: string[];
  impact: string;
  color: string;
  icon: string;
  examples: string[];
  websites: string[];
}

const webLanguages: WebLanguage[] = [
  {
    id: 'html',
    name: 'HTML',
    year: 1991,
    creator: 'Tim Berners-Lee (CERN)',
    description: 'HyperText Markup Language - the foundation of the World Wide Web.',
    purpose: 'Web Content Structure',
    innovations: ['Hypertext', 'Markup Language', 'Web Standards', 'Accessibility'],
    impact: 'Created the foundation for all web content and enabled the information age.',
    color: '#E34F26',
    icon: '🌐',
    examples: ['<html>', '<head>', '<body>', '<div>'],
    websites: ['World Wide Web', 'Every Website', 'Web Standards'],
  },
  {
    id: 'css',
    name: 'CSS',
    year: 1996,
    creator: 'Håkon Wium Lie (W3C)',
    description: 'Cascading Style Sheets - separates content from presentation on the web.',
    purpose: 'Web Styling & Layout',
    innovations: ['Separation of Concerns', 'Cascading Rules', 'Responsive Design', 'Animations'],
    impact: 'Revolutionized web design and enabled beautiful, responsive websites.',
    color: '#1572B6',
    icon: '🎨',
    examples: ['color: red', 'margin: 10px', '@media queries', 'flexbox'],
    websites: ['All Modern Websites', 'Design Systems', 'Responsive Web'],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    year: 1995,
    creator: 'Brendan Eich (Netscape)',
    description: 'Dynamic programming language that brought interactivity to the web.',
    purpose: 'Web Interactivity',
    innovations: ['Dynamic Typing', 'Event Handling', 'DOM Manipulation', 'Asynchronous Programming'],
    impact: 'Made the web interactive and enabled modern web applications.',
    color: '#F7DF1E',
    icon: '⚡',
    examples: ['function()', 'addEventListener', 'fetch()', 'async/await'],
    websites: ['Interactive Web', 'Web Apps', 'Node.js Ecosystem'],
  },
  {
    id: 'php',
    name: 'PHP',
    year: 1995,
    creator: 'Rasmus Lerdorf',
    description: 'Server-side scripting language designed for web development.',
    purpose: 'Server-Side Web Development',
    innovations: ['Server-Side Scripting', 'Database Integration', 'Template Engine', 'Web Frameworks'],
    impact: 'Powering over 75% of all websites and enabling dynamic web content.',
    color: '#777BB4',
    icon: '🐘',
    examples: ['<?php', '$_POST', 'mysqli', 'WordPress'],
    websites: ['WordPress', 'Facebook', 'Wikipedia', 'Most Websites'],
  },
  {
    id: 'java',
    name: 'Java',
    year: 1995,
    creator: 'James Gosling (Sun Microsystems)',
    description: 'Write once, run anywhere - enterprise-grade programming language.',
    purpose: 'Enterprise & Web Applications',
    innovations: ['Platform Independence', 'Object-Oriented', 'Memory Management', 'Enterprise Features'],
    impact: 'Became the standard for enterprise applications and Android development.',
    color: '#007396',
    icon: '☕',
    examples: ['public class', 'System.out.println', 'Spring Framework', 'Android'],
    websites: ['Enterprise Apps', 'Android Apps', 'Web Services', 'Banking Systems'],
  },
  {
    id: 'python',
    name: 'Python',
    year: 1991,
    creator: 'Guido van Rossum',
    description: 'High-level, readable programming language that became the web\'s backend language.',
    purpose: 'Web Backend & Data Science',
    innovations: ['Readable Syntax', 'Rapid Development', 'Data Science', 'Web Frameworks'],
    impact: 'Became the most popular language for web backends and data science.',
    color: '#3776AB',
    icon: '🐍',
    examples: ['def function()', 'Django', 'Flask', 'pandas'],
    websites: ['YouTube', 'Instagram', 'Dropbox', 'Data Science'],
  },
];

export const InternetAgeGallery: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<WebLanguage | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  const purposes = [...new Set(webLanguages.map(lang => lang.purpose))];

  const filteredLanguages = selectedPurpose 
    ? webLanguages.filter(lang => lang.purpose === selectedPurpose)
    : webLanguages;

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
            className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-3xl shadow-lg"
            animate={reducedMotion ? {} : { scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌐
          </motion.div>
          <div>
            <h1 className="portfolio-hero-text text-white">INTERNET AGE GALLERY</h1>
            <p className="portfolio-large-text text-orange-400">1990s Web Languages</p>
          </div>
        </div>
        
        <p className="portfolio-base-text text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Step into the digital revolution that connected the world. These languages built the World Wide Web, 
          transformed how we communicate, and created the foundation for our digital society. From static pages 
          to dynamic applications, witness the birth of the internet age.
        </p>
      </motion.div>

      {/* Purpose Filter */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <InteractiveButton
          onClick={() => setSelectedPurpose(null)}
          variant={selectedPurpose === null ? 'primary' : 'ghost'}
          size="sm"
        >
          ALL PURPOSES
        </InteractiveButton>
        {purposes.map((purpose) => (
          <InteractiveButton
            key={purpose}
            onClick={() => setSelectedPurpose(purpose)}
            variant={selectedPurpose === purpose ? 'primary' : 'ghost'}
            size="sm"
          >
            {purpose.toUpperCase()}
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

              {/* Creator and Purpose */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <Users className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">{language.creator}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span className="text-sm">{language.purpose}</span>
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
                  <p className="portfolio-base-text text-gray-300">{selectedLanguage.purpose}</p>
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
                  <h3 className="portfolio-medium-text text-white mb-3">FAMOUS WEBSITES</h3>
                  <div className="space-y-2">
                    {selectedLanguage.websites.map((website, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <Globe className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{website}</span>
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

export default InternetAgeGallery;