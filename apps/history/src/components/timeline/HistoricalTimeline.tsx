'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '@/lib/types/language';
import { EraMarker } from './EraMarker';
import { LanguageCard } from './LanguageCard';
import { useGroqAI } from '@/hooks/useGroqAI';
import { explainLanguageHistory } from '@/services/aiService';

gsap.registerPlugin(ScrollTrigger);

interface HistoricalTimelineProps {
  languages: Language[];
  onLanguageSelect: (language: Language) => void;
}

export function HistoricalTimeline({ languages, onLanguageSelect }: HistoricalTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const { executeAIRequest, isLoading, error } = useGroqAI();

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

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>
      
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
            <div key={decade} className="relative">
              {/* Decade Header */}
              <div className="sticky top-20 z-20 mb-8">
                <div className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white">
                    {decade}s
                  </h2>
                  <p className="text-slate-300">
                    {decadeLanguages.length} language{decadeLanguages.length !== 1 ? 's' : ''} created
                  </p>
                </div>
              </div>

              {/* Languages in this decade */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {decadeLanguages
                  .sort((a, b) => a.year - b.year)
                  .map((language) => (
                    <LanguageCard
                      key={language.id}
                      language={language}
                      onClick={() => handleLanguageClick(language)}
                      isSelected={selectedLanguage?.id === language.id}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>

      {/* AI Explanation Panel */}
      {selectedLanguage && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-purple-500/20 p-6 z-30">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                AI Historical Context: {selectedLanguage.name}
              </h3>
              <button
                onClick={() => setSelectedLanguage(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex items-center space-x-2 text-purple-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                <span>AI is analyzing historical context...</span>
              </div>
            ) : error ? (
              <div className="text-red-400">
                Error: {error}
              </div>
            ) : aiExplanation ? (
              <div className="text-slate-300 leading-relaxed">
                {aiExplanation}
              </div>
            ) : (
              <div className="text-slate-400">
                Click on a language to get AI-powered historical context
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
