'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '@/lib/types/language';
import { EraMarker } from './EraMarker';
import { LanguageCard } from './LanguageCard';
import { EraGrid, Era } from '@/components/cards/EraCard';
import { StaggerContainer, StaggerItem } from '@/components/transitions/PageTransition';
import { AITypingAnimation } from '@/components/ai/AITypingAnimation';
import { useGroqAI } from '@/hooks/useGroqAI';
import { explainLanguageHistory } from '@/services/aiService';
import { useReducedMotion } from '@/hooks/useAnimations';

gsap.registerPlugin(ScrollTrigger);

interface HistoricalTimelineProps {
  languages: Language[];
  onLanguageSelect: (language: Language) => void;
}

export function HistoricalTimeline({ languages, onLanguageSelect }: HistoricalTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'eras' | 'timeline'>('eras');
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const { executeAIRequest, isLoading, error } = useGroqAI();
  const reducedMotion = useReducedMotion();

  // Group languages by decade
  const languagesByDecade = languages.reduce((acc, language) => {
    const decade = Math.floor(language.year / 10) * 10;
    if (!acc[decade]) {
      acc[decade] = [];
    }
    acc[decade].push(language);
    return acc;
  }, {} as Record<number, Language[]>);

  // Define eras
  const eras = [
    { name: 'Pre-Computer Age', start: 1840, end: 1950, color: '#8B4513' },
    { name: 'Mainframe Era', start: 1950, end: 1970, color: '#4169E1' },
    { name: 'Unix Era', start: 1970, end: 1990, color: '#0000FF' },
    { name: 'Web Era', start: 1990, end: 2010, color: '#F7DF1E' },
    { name: 'Modern Era', start: 2010, end: 2030, color: '#00ADD8' },
  ];

  useEffect(() => {
    if (timelineRef.current) {
      const cards = timelineRef.current.querySelectorAll('.language-card');
      
      gsap.fromTo(cards, 
        { 
          opacity: 0, 
          y: 100,
          scale: 0.8
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [languages]);

  const handleLanguageClick = async (language: Language) => {
    setSelectedLanguage(language);
    onLanguageSelect(language);
    
    // Get AI explanation
    const explanation = await executeAIRequest(
      explainLanguageHistory,
      'history',
      language.id,
      language.name,
      language.year
    );
    
    if (explanation) {
      setAiExplanation(explanation.content);
    }
  };

  const handleEraSelect = (era: Era) => {
    setSelectedEra(era);
    setViewMode('timeline');
  };

  const handleLanguageFromEra = (languageName: string) => {
    const language = languages.find(l => l.name === languageName);
    if (language) {
      handleLanguageClick(language);
    }
  };

  const handleAIExplain = async (content: string) => {
    const explanation = await executeAIRequest(
      explainLanguageHistory,
      'era',
      'era-explanation',
      content,
      0
    );
    
    if (explanation) {
      setAiExplanation(explanation.content);
    }
  };

  return (
    <div className="relative">
      {/* View Mode Toggle */}
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-black/50 backdrop-blur-lg rounded-lg p-1 border border-orange-500/30">
          <button
            onClick={() => setViewMode('eras')}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              viewMode === 'eras' 
                ? 'bg-orange-500 text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            ERA OVERVIEW
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-6 py-2 rounded-md transition-all duration-300 ${
              viewMode === 'timeline' 
                ? 'bg-orange-500 text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            DETAILED TIMELINE
          </button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {viewMode === 'eras' ? (
          <motion.div
            key="eras"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <EraGrid
              onEraSelect={handleEraSelect}
              onLanguageSelect={handleLanguageFromEra}
              onAIExplain={handleAIExplain}
            />
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-orange-400 to-orange-300 rounded-full"></div>
            
            {/* Era Markers */}
            <div className="absolute left-0 top-0 w-full">
              {eras.map((era, index) => (
                <EraMarker
                  key={era.name}
                  era={era}
                  index={index}
                  totalEras={eras.length}
                />
              ))}
            </div>

            {/* Timeline Content */}
            <div ref={timelineRef} className="relative z-10 ml-20 space-y-12">
              {Object.entries(languagesByDecade)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([decade, decadeLanguages]) => (
                  <StaggerItem key={decade} className="relative">
                    {/* Decade Header */}
                    <div className="sticky top-20 z-20 mb-8">
                      <div className="portfolio-card-glass p-4">
                        <h2 className="portfolio-large-text text-white">
                          {decade}s
                        </h2>
                        <p className="portfolio-base-text text-orange-400">
                          {decadeLanguages.length} language{decadeLanguages.length !== 1 ? 's' : ''} created
                        </p>
                      </div>
                    </div>

                    {/* Languages in this decade */}
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {decadeLanguages
                        .sort((a, b) => a.year - b.year)
                        .map((language) => (
                          <StaggerItem key={language.id}>
                            <LanguageCard
                              language={language}
                              onClick={() => handleLanguageClick(language)}
                              isSelected={selectedLanguage?.id === language.id}
                            />
                          </StaggerItem>
                        ))}
                    </StaggerContainer>
                  </StaggerItem>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Explanation Panel */}
      <AnimatePresence>
        {(selectedLanguage || aiExplanation) && (
          <motion.div 
            className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-orange-500/20 p-6 z-30"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          >
            <div className="container mx-auto max-w-4xl">
              <div className="flex items-start justify-between mb-4">
                <h3 className="portfolio-medium-text text-white">
                  AI HISTORICAL CONTEXT: {selectedLanguage?.name || 'ERA OVERVIEW'}
                </h3>
                <motion.button
                  onClick={() => {
                    setSelectedLanguage(null);
                    setAiExplanation(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>
              
              {isLoading ? (
                <div className="flex items-center space-x-2 text-orange-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-400"></div>
                  <span>AI is analyzing historical context...</span>
                </div>
              ) : error ? (
                <div className="text-red-400">
                  Error: {error}
                </div>
              ) : aiExplanation ? (
                <AITypingAnimation
                  text={aiExplanation}
                  speed={30}
                  className="text-gray-300 leading-relaxed"
                />
              ) : (
                <div className="text-gray-400">
                  Click on a language or era to get AI-powered historical context
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
