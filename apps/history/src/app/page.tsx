'use client';

import { useState, useEffect } from 'react';
import { Language } from '@/lib/types/language';
import { HistoricalTimeline } from '@/components/timeline/HistoricalTimeline';
import { CodePlayground } from '@/components/code/CodePlayground';
import { LanguageFamilyTree } from '@/components/visualization/LanguageFamilyTree';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { ParadigmExplorer } from '@/components/ParadigmExplorer';
import languagesData from '@/lib/data/languages.json';

export default function Home() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [activeSection, setActiveSection] = useState<'timeline' | 'playground' | 'family-tree' | 'paradigms' | 'ai'>('timeline');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  useEffect(() => {
    setLanguages(languagesData as Language[]);
  }, []);

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'timeline':
        return (
          <HistoricalTimeline
            languages={languages}
            onLanguageSelect={handleLanguageSelect}
          />
        );
      case 'playground':
        return (
          <CodePlayground
            languages={languages}
            selectedLanguage={selectedLanguage}
            onLanguageSelect={handleLanguageSelect}
          />
        );
      case 'family-tree':
        return (
          <LanguageFamilyTree
            languages={languages}
            onLanguageSelect={handleLanguageSelect}
          />
        );
      case 'paradigms':
        return (
          <ParadigmExplorer
            languages={languages}
            onLanguageSelect={handleLanguageSelect}
          />
        );
      case 'ai':
        return (
          <AIAssistant
            languages={languages}
            selectedLanguage={selectedLanguage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {activeSection === 'timeline' && (
          <Hero
            title="Programming Language History Museum"
            subtitle="Explore the evolution of programming languages from 1843 to present"
            onExplore={() => setActiveSection('timeline')}
          />
        )}
        
        {renderActiveSection()}
      </main>
    </div>
  );
}
