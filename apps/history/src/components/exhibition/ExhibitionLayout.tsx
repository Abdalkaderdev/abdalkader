'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Home, Info } from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useReducedMotion } from '@/hooks/useAnimations';

export type ExhibitionSection = 
  | 'pioneers-hall'
  | 'revolution-wing' 
  | 'internet-gallery'
  | 'modern-pavilion'
  | 'paradigm-theater'
  | 'ai-tutor-studio';

interface ExhibitionLayoutProps {
  children: React.ReactNode;
  currentSection: ExhibitionSection;
  onSectionChange: (section: ExhibitionSection) => void;
  onBackToHome: () => void;
}

const exhibitionSections = [
  {
    id: 'pioneers-hall' as ExhibitionSection,
    title: 'The Pioneers Hall',
    subtitle: '1843-1950s Foundational Languages',
    description: 'Explore the birth of programming and the languages that started it all',
    icon: '⚙️',
    color: 'from-amber-500 to-orange-500',
    bgPattern: 'pioneers',
  },
  {
    id: 'revolution-wing' as ExhibitionSection,
    title: 'The Revolution Wing',
    subtitle: '1960s-1970s Paradigm Shifts',
    description: 'Witness the structured programming revolution and the rise of high-level languages',
    icon: '🏗️',
    color: 'from-blue-500 to-cyan-500',
    bgPattern: 'revolution',
  },
  {
    id: 'internet-gallery' as ExhibitionSection,
    title: 'Internet Age Gallery',
    subtitle: '1990s Web Languages',
    description: 'Discover the languages that built the World Wide Web and modern internet',
    icon: '🌐',
    color: 'from-green-500 to-emerald-500',
    bgPattern: 'internet',
  },
  {
    id: 'modern-pavilion' as ExhibitionSection,
    title: 'Modern Era Pavilion',
    subtitle: '2000s-Present Languages',
    description: 'Experience the cutting-edge languages of today and tomorrow',
    icon: '🚀',
    color: 'from-purple-500 to-pink-500',
    bgPattern: 'modern',
  },
  {
    id: 'paradigm-theater' as ExhibitionSection,
    title: 'Paradigm Theater',
    subtitle: 'Interactive Programming Concepts',
    description: 'Immerse yourself in different programming paradigms and concepts',
    icon: '🎭',
    color: 'from-indigo-500 to-purple-500',
    bgPattern: 'paradigm',
  },
  {
    id: 'ai-tutor-studio' as ExhibitionSection,
    title: 'AI Tutor Studio',
    subtitle: 'Groq-Powered Learning Area',
    description: 'Learn with AI assistance and explore programming concepts interactively',
    icon: '🤖',
    color: 'from-orange-500 to-red-500',
    bgPattern: 'ai',
  },
];

export const ExhibitionLayout: React.FC<ExhibitionLayoutProps> = ({
  children,
  currentSection,
  onSectionChange,
  onBackToHome,
}) => {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  const currentSectionData = exhibitionSections.find(s => s.id === currentSection);
  const currentIndex = exhibitionSections.findIndex(s => s.id === currentSection);

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % exhibitionSections.length;
    onSectionChange(exhibitionSections[nextIndex].id);
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex === 0 ? exhibitionSections.length - 1 : currentIndex - 1;
    onSectionChange(exhibitionSections[prevIndex].id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${currentSectionData?.bgPattern}-pattern`} />
      
      {/* Navigation Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-orange-500/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back to Home */}
            <motion.button
              onClick={onBackToHome}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              whileHover={reducedMotion ? {} : { x: -5 }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              <span className="portfolio-small-text">BACK TO MUSEUM</span>
            </motion.button>

            {/* Section Title */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="portfolio-large-text text-white">{currentSectionData?.title}</h1>
              <p className="portfolio-base-text text-orange-400">{currentSectionData?.subtitle}</p>
            </motion.div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setIsNavigationOpen(!isNavigationOpen)}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                whileHover={reducedMotion ? {} : { scale: 1.05 }}
                whileTap={reducedMotion ? {} : { scale: 0.95 }}
              >
                <Info className="w-5 h-5" />
                <span className="portfolio-small-text">SECTIONS</span>
              </motion.button>

              <div className="flex items-center gap-2">
                <InteractiveButton
                  onClick={goToPrevious}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </InteractiveButton>
                
                <InteractiveButton
                  onClick={goToNext}
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <ArrowRight className="w-4 h-4" />
                </InteractiveButton>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Section Navigation Overlay */}
      <AnimatePresence>
        {isNavigationOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsNavigationOpen(false)}
          >
            <motion.div
              className="container mx-auto px-4 py-20"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="portfolio-hero-text text-white text-center mb-12">
                EXPLORE EXHIBITIONS
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {exhibitionSections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => {
                      onSectionChange(section.id);
                      setIsNavigationOpen(false);
                    }}
                    className={`text-left p-6 rounded-xl border transition-all duration-300 ${
                      currentSection === section.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-gray-700 bg-gray-800/50 hover:border-orange-500/50'
                    }`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={reducedMotion ? {} : { scale: 1.02, y: -5 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${section.color} flex items-center justify-center text-2xl`}>
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="portfolio-medium-text text-white">{section.title}</h3>
                        <p className="portfolio-small-text text-orange-400">{section.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{section.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-8">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          className="container mx-auto px-4"
        >
          {children}
        </motion.div>
      </main>

      {/* Section Progress Indicator */}
      <motion.div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-lg rounded-full px-4 py-2 border border-orange-500/30">
          {exhibitionSections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentSection === section.id
                  ? 'bg-orange-500 scale-125'
                  : 'bg-gray-600 hover:bg-orange-400'
              }`}
              whileHover={reducedMotion ? {} : { scale: 1.2 }}
              whileTap={reducedMotion ? {} : { scale: 0.9 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export { exhibitionSections };