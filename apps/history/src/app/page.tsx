'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Language } from '@/lib/types/language';
import { ProgrammingLanguageTimeline } from '@/components/timeline/ProgrammingLanguageTimeline';
import { CrossDomainProvider } from '@/components/ecosystem/CrossDomainProvider';
import { EcosystemAuthProvider } from '@/contexts/EcosystemAuthContext';
import PortfolioHeader from '@/components/shared/PortfolioHeader';
import { Hero } from '@/components/Hero';
import { PageTransition, SectionTransition, StaggerContainer } from '@/components/transitions/PageTransition';
import { ExhibitionLayout, ExhibitionSection } from '@/components/exhibition/ExhibitionLayout';
import { useGSAP, usePortfolioAnimations } from '@/hooks/useAnimations';
import languagesData from '@/lib/data/languages.json';

// Lazy load heavy components for better initial load performance
const HistoricalTimeline = dynamic(() => import('@/components/timeline/HistoricalTimeline').then(m => ({ default: m.HistoricalTimeline })), {
  loading: () => <LoadingPlaceholder text="Loading Timeline..." />,
});
const AnimatedLanguageFamilyTree = dynamic(() => import('@/components/visualization/AnimatedLanguageFamilyTree').then(m => ({ default: m.AnimatedLanguageFamilyTree })), {
  loading: () => <LoadingPlaceholder text="Loading Family Tree..." />,
});
const ParadigmEvolutionVisualization = dynamic(() => import('@/components/visualization/ParadigmEvolutionVisualization').then(m => ({ default: m.ParadigmEvolutionVisualization })), {
  loading: () => <LoadingPlaceholder text="Loading Visualization..." />,
});
const CodePlayground = dynamic(() => import('@/components/code/CodePlayground').then(m => ({ default: m.CodePlayground })), {
  loading: () => <LoadingPlaceholder text="Loading Playground..." />,
  ssr: false, // Monaco editor doesn't work with SSR
});
const EnhancedLanguageFamilyTree = dynamic(() => import('@/components/visualization/EnhancedLanguageFamilyTree').then(m => ({ default: m.EnhancedLanguageFamilyTree })), {
  loading: () => <LoadingPlaceholder text="Loading Family Tree..." />,
});
const AIAssistant = dynamic(() => import('@/components/ai/AIAssistant').then(m => ({ default: m.AIAssistant })), {
  loading: () => <LoadingPlaceholder text="Loading AI Assistant..." />,
});
const EnhancedAIIntegration = dynamic(() => import('@/components/ai/EnhancedAIIntegration').then(m => ({ default: m.EnhancedAIIntegration })), {
  loading: () => <LoadingPlaceholder text="Loading AI Features..." />,
});
const EcosystemMap = dynamic(() => import('@/components/ecosystem/EcosystemMap').then(m => ({ default: m.EcosystemMap })), {
  loading: () => <LoadingPlaceholder text="Loading Ecosystem..." />,
});
const ParadigmExplorer = dynamic(() => import('@/components/ParadigmExplorer').then(m => ({ default: m.ParadigmExplorer })), {
  loading: () => <LoadingPlaceholder text="Loading Paradigms..." />,
});

// Exhibition components - lazy loaded
const PioneersHall = dynamic(() => import('@/components/exhibition/PioneersHall').then(m => ({ default: m.PioneersHall })));
const RevolutionWing = dynamic(() => import('@/components/exhibition/RevolutionWing').then(m => ({ default: m.RevolutionWing })));
const InternetAgeGallery = dynamic(() => import('@/components/exhibition/InternetAgeGallery').then(m => ({ default: m.InternetAgeGallery })));
const ModernEraPavilion = dynamic(() => import('@/components/exhibition/ModernEraPavilion').then(m => ({ default: m.ModernEraPavilion })));
const ParadigmTheater = dynamic(() => import('@/components/exhibition/ParadigmTheater').then(m => ({ default: m.ParadigmTheater })));
const AITutorStudio = dynamic(() => import('@/components/exhibition/AITutorStudio').then(m => ({ default: m.AITutorStudio })));

// Loading placeholder component
function LoadingPlaceholder({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-400">{text}</p>
      </div>
    </div>
  );
}
// UI Components Integration
import { 
  Button, 
  Card, 
  Skeleton, 
  Spinner, 
  Progress, 
  CircularProgress,
  ErrorBoundary,
  Tabs,
  Modal,
  useModal,
  ThemeProvider,
  ThemeToggleButton
} from '@abdalkader/ui';

export default function Home() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'unified-timeline' | 'timeline' | 'playground' | 'family-tree' | 'animated-family-tree' | 'paradigm-evolution' | 'paradigms' | 'ai' | 'ai-enhanced' | 'exhibitions' | 'ecosystem'>('unified-timeline');
  const [exhibitionSection, setExhibitionSection] = useState<ExhibitionSection>('pioneers-hall');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const { staggerCards } = usePortfolioAnimations();
  const modal = useModal();

  useEffect(() => {
    // Simulate loading for better UX
    const loadingTimer = setTimeout(() => {
      setLanguages(languagesData as Language[]);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimer);
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
    setActiveSection('unified-timeline');
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
      case 'unified-timeline':
        return (
          <SectionTransition delay={0.2}>
            <ProgrammingLanguageTimeline />
          </SectionTransition>
        );
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
      case 'animated-family-tree':
        return (
          <SectionTransition delay={0.2}>
            <AnimatedLanguageFamilyTree />
          </SectionTransition>
        );
      case 'paradigm-evolution':
        return (
          <SectionTransition delay={0.2}>
            <ParadigmEvolutionVisualization />
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
      case 'ai-enhanced':
        return (
          <SectionTransition delay={0.2}>
            <EnhancedAIIntegration />
          </SectionTransition>
        );
      case 'ecosystem':
        return (
          <SectionTransition delay={0.2}>
            <EcosystemMap showStats showInactive />
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
    <ThemeProvider>
      <ErrorBoundary
        customMessage="Something went wrong with the Programming Museum. Please try refreshing the page."
        showRetry={true}
        showHome={true}
      >
        <EcosystemAuthProvider>
          <CrossDomainProvider>
            <PageTransition>
              <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black dark:from-black dark:via-gray-900 dark:to-black light:from-white light:via-gray-50 light:to-gray-100">
              {/* Portfolio Style Header */}
              <PortfolioHeader 
                appName="Programming Museum"
                appDescription="Explore the evolution of programming languages from 1843 to present"
                currentApp="Programming Museum"
              />
              
              <main className="container mx-auto px-4 py-8 pt-32">
                {activeSection === 'timeline' && (
                  <SectionTransition delay={0}>
                    {isLoading ? (
                      <div className="text-center py-20">
                        <CircularProgress size="lg" value={75} showLabel />
                        <div className="mt-4">
                          <Skeleton variant="text" lines={2} />
                        </div>
                      </div>
                    ) : (
                      <Hero
                        title="Programming Language History Museum"
                        subtitle="Explore the evolution of programming languages from 1843 to present"
                        onExplore={() => setActiveSection('timeline')}
                      />
                    )}
                  </SectionTransition>
                )}
                
                <StaggerContainer className="w-full" staggerDelay={0.1}>
                  {renderActiveSection()}
                </StaggerContainer>

                {/* Enhanced Navigation with UI Components */}
                <div className="fixed bottom-8 right-8 z-50">
                  <Button 
                    variant="primary" 
                    onClick={modal.open}
                    className="shadow-lg"
                  >
                    Quick Tour
                  </Button>
                </div>
              </main>
            </div>
          </PageTransition>
        </CrossDomainProvider>
      </EcosystemAuthProvider>
      
      {/* Quick Tour Modal */}
      <Modal 
        isOpen={modal.isOpen} 
        onClose={modal.close} 
        title="Programming Museum Quick Tour"
      >
        <div className="space-y-4">
          <p>Discover the evolution of programming languages through interactive timelines, code playgrounds, and AI-powered insights.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <h3 className="font-semibold mb-2">📚 Historical Timeline</h3>
              <p className="text-sm text-gray-600">Explore languages from Ada Lovelace to modern AI</p>
            </Card>
            <Card>
              <h3 className="font-semibold mb-2">💻 Code Playground</h3>
              <p className="text-sm text-gray-600">Try code examples from different eras</p>
            </Card>
            <Card>
              <h3 className="font-semibold mb-2">🤖 AI Assistant</h3>
              <p className="text-sm text-gray-600">Chat with our AI about programming history</p>
            </Card>
            <Card>
              <h3 className="font-semibold mb-2">🎭 Exhibitions</h3>
              <p className="text-sm text-gray-600">Interactive museum-style galleries</p>
            </Card>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button onClick={modal.close}>Start Exploring</Button>
          </div>
        </div>
      </Modal>
    </ErrorBoundary>
    
    {/* Theme Toggle Button */}
    <ThemeToggleButton />
  </ThemeProvider>
  );
}
