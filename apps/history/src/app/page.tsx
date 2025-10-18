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
import { ExhibitionLayout, ExhibitionSection } from '@/components/exhibition/ExhibitionLayout';
import { PioneersHall } from '@/components/exhibition/PioneersHall';
import { RevolutionWing } from '@/components/exhibition/RevolutionWing';
import { InternetAgeGallery } from '@/components/exhibition/InternetAgeGallery';
import { ModernEraPavilion } from '@/components/exhibition/ModernEraPavilion';
import { ParadigmTheater } from '@/components/exhibition/ParadigmTheater';
import { AITutorStudio } from '@/components/exhibition/AITutorStudio';
import { useGSAP, usePortfolioAnimations } from '@/hooks/useAnimations';
import languagesData from '@/lib/data/languages.json';

export default function Home() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [activeSection, setActiveSection] = useState<'timeline' | 'playground' | 'family-tree' | 'paradigms' | 'ai' | 'exhibitions'>('timeline');
  const [exhibitionSection, setExhibitionSection] = useState<ExhibitionSection>('pioneers-hall');
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

  const handleExhibitionChange = (section: ExhibitionSection) => {
    setExhibitionSection(section);
  };

  const handleBackToHome = () => {
    setActiveSection('timeline');
  };

  const renderExhibitionSection = () => {
    switch (exhibitionSection) {
      case 'pioneers-hall':
        return <PioneersHall />;
      case 'revolution-wing':
        return <RevolutionWing />;
      case 'internet-gallery':
        return <InternetAgeGallery />;
      case 'modern-pavilion':
        return <ModernEraPavilion />;
      case 'paradigm-theater':
        return <ParadigmTheater />;
      case 'ai-tutor-studio':
        return <AITutorStudio />;
      default:
        return <PioneersHall />;
    }
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
      case 'exhibitions':
        return (
          <ExhibitionLayout
            currentSection={exhibitionSection}
            onSectionChange={handleExhibitionChange}
            onBackToHome={handleBackToHome}
          >
            {renderExhibitionSection()}
          </ExhibitionLayout>
        );
      default:
        return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black light:from-white light:via-gray-50 light:to-gray-100">
        {activeSection !== 'exhibitions' && (
          <Navigation
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
          />
        )}
        
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
