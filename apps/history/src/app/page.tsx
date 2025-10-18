'use client';

import { useState, useEffect } from 'react';
import { Language } from '@/lib/types/language';
import { HistoricalTimeline } from '@/components/timeline/HistoricalTimeline';
import { CodePlayground } from '@/components/code/CodePlayground';
import { EnhancedLanguageFamilyTree } from '@/components/visualization/EnhancedLanguageFamilyTree';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ParadigmExplorer } from '@/components/ParadigmExplorer';
import { PageTransition, SectionTransition, StaggerContainer, StaggerItem } from '@/components/transitions/PageTransition';
import { useGSAP, usePortfolioAnimations } from '@/hooks/useAnimations';
import languagesData from '@/lib/data/languages.json';

export default function Home() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [activeSection, setActiveSection] = useState<'timeline' | 'playground' | 'family-tree' | 'paradigms' | 'ai'>('timeline');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { staggerCards } = usePortfolioAnimations();

  useEffect(() => {
    setLanguages(languagesData as Language[]);
  }, []);

  // GSAP animations for page load
  useGSAP(() => {
    // Stagger cards animation
    staggerCards('.museum-card', 0.1);
  }, [languages]);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const handleSectionChange = (section: typeof activeSection) => {
    // Add page transition effect
    setActiveSection(section);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'timeline':
        return (
          <SectionTransition delay={0.2}>
            <HistoricalTimeline
              languages={languages}
              onLanguageSelect={handleLanguageSelect}
            />
          </SectionTransition>
        );
      case 'playground':
        return (
          <SectionTransition delay={0.2}>
            <CodePlayground
              languages={languages}
              selectedLanguage={selectedLanguage}
              onLanguageSelect={handleLanguageSelect}
            />
          </SectionTransition>
        );
      case 'family-tree':
        return (
          <SectionTransition delay={0.2}>
            <EnhancedLanguageFamilyTree
              languages={languages}
              onLanguageSelect={handleLanguageSelect}
            />
          </SectionTransition>
        );
      case 'paradigms':
        return (
          <SectionTransition delay={0.2}>
            <ParadigmExplorer
              languages={languages}
              onLanguageSelect={handleLanguageSelect}
            />
          </SectionTransition>
        );
      case 'ai':
        return (
          <SectionTransition delay={0.2}>
            <AIAssistant
              languages={languages}
              selectedLanguage={selectedLanguage}
            />
          </SectionTransition>
        );
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black light:from-white light:via-gray-50 light:to-gray-100">
        <Navigation
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
        />
        
        <main className="container mx-auto px-4 py-8 pt-24">
          {activeSection === 'timeline' && (
            <SectionTransition delay={0}>
              <Hero
                title="Programming Language History Museum"
                subtitle="Explore the evolution of programming languages from 1843 to present"
                onExplore={() => setActiveSection('timeline')}
              />
            </SectionTransition>
          )}
          
          <StaggerContainer className="w-full" staggerDelay={0.1}>
            {renderActiveSection()}
          </StaggerContainer>
        </main>
      </div>
    </PageTransition>
  );
}
