'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Language } from '@/lib/types/language';
import languagesData from '@/lib/data/languages.json';
import { Card, Badge, Button } from '@abdalkader/ui';
import { 
  Calendar, 
  User, 
  Sparkles, 
  Code, 
  TrendingUp,
  ArrowRight,
  ChevronDown,
  X
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Era {
  name: string;
  startYear: number;
  endYear: number;
  color: string;
  description: string;
}

interface LanguageNode extends Language {
  x?: number;
  y?: number;
  connections?: string[];
}

const ERAS: Era[] = [
  {
    name: 'The Dawn (1950s)',
    startYear: 1950,
    endYear: 1959,
    color: '#8B4513',
    description: 'The birth of high-level programming languages'
  },
  {
    name: 'The Revolution (1960s-1970s)',
    startYear: 1960,
    endYear: 1979,
    color: '#4169E1',
    description: 'Standardization and systems programming'
  },
  {
    name: 'The Expansion (1980s-1990s)',
    startYear: 1980,
    endYear: 1999,
    color: '#9370DB',
    description: 'Object-oriented programming and the web'
  },
  {
    name: 'The Modern Age (2000s-Present)',
    startYear: 2000,
    endYear: new Date().getFullYear(),
    color: '#00ADD8',
    description: 'Type safety, concurrency, and modern paradigms'
  }
];

export function ProgrammingLanguageTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [activeEra, setActiveEra] = useState<Era | null>(null);
  const [visibleLanguages, setVisibleLanguages] = useState<Set<string>>(new Set());
  const languages = languagesData as Language[];

  // Filter languages from 1950s onwards
  const filteredLanguages = useMemo(() => {
    return languages.filter(lang => lang.year >= 1950).sort((a, b) => a.year - b.year);
  }, []);

  // Group languages by era
  const languagesByEra = useMemo(() => {
    const grouped: Record<string, Language[]> = {};
    ERAS.forEach(era => {
      grouped[era.name] = filteredLanguages.filter(
        lang => lang.year >= era.startYear && lang.year <= era.endYear
      );
    });
    return grouped;
  }, [filteredLanguages]);

  // Calculate timeline position (0-100%)
  const getTimelinePosition = (year: number): number => {
    const minYear = 1950;
    const maxYear = new Date().getFullYear();
    return ((year - minYear) / (maxYear - minYear)) * 100;
  };

  // Get language connections
  const getLanguageConnections = (language: Language): { predecessors: Language[], successors: Language[] } => {
    const predecessors = language.predecessor
      .map(name => languages.find(l => l.name === name || l.id === name.toLowerCase().replace(/\s+/g, '-')))
      .filter((l): l is Language => l !== undefined && l.year < language.year);

    const successors = language.successor
      .map(name => languages.find(l => l.name === name || l.id === name.toLowerCase().replace(/\s+/g, '-')))
      .filter((l): l is Language => l !== undefined && l.year > language.year);

    return { predecessors, successors };
  };

  // Setup scroll-triggered animations
  useEffect(() => {
    if (!timelineRef.current) return;

    const languageCards = timelineRef.current.querySelectorAll('.language-timeline-card');
    const eraMarkers = timelineRef.current.querySelectorAll('.era-marker');

    // Animate language cards on scroll
    languageCards.forEach((card, index) => {
      const languageId = card.getAttribute('data-language-id');
      if (!languageId) return;

      gsap.fromTo(card,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotation: -5
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
            onEnter: () => {
              setVisibleLanguages(prev => new Set([...prev, languageId]));
            },
            onLeaveBack: () => {
              setVisibleLanguages(prev => {
                const next = new Set(prev);
                next.delete(languageId);
                return next;
              });
            }
          }
        }
      );
    });

    // Animate era markers
    eraMarkers.forEach((marker, index) => {
      gsap.fromTo(marker,
        {
          opacity: 0,
          scale: 0,
          y: -50
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: marker,
            start: 'top 90%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Animate timeline line
    const timelineLine = timelineRef.current.querySelector('.timeline-line');
    if (timelineLine) {
      gsap.fromTo(timelineLine,
        { scaleY: 0, transformOrigin: 'top' },
        {
          scaleY: 1,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [filteredLanguages]);

  // Handle language selection
  const handleLanguageClick = (language: Language) => {
    setSelectedLanguage(language);
  };

  // Get era for a given year
  const getEraForYear = (year: number): Era => {
    return ERAS.find(era => year >= era.startYear && year <= era.endYear) || ERAS[ERAS.length - 1];
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-300 bg-clip-text text-transparent">
            Evolution of Programming Languages
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Journey through the history of programming languages from the 1950s to the present day.
            Discover how each language influenced the next, shaping the digital world we know today.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div ref={timelineRef} className="relative">
          {/* Vertical Timeline Line */}
          <div className="timeline-line absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-yellow-400 to-orange-500 opacity-30 transform -translate-x-1/2" />

          {/* Languages Timeline */}
          <div className="space-y-24 md:space-y-32">
            {filteredLanguages.map((language, index) => {
              const era = getEraForYear(language.year);
              const { predecessors, successors } = getLanguageConnections(language);
              const isVisible = visibleLanguages.has(language.id);
              const isEven = index % 2 === 0;
              const timelinePos = getTimelinePosition(language.year);

              return (
                <div
                  key={language.id}
                  className="language-timeline-card relative"
                  data-language-id={language.id}
                  style={{ position: 'relative' }}
                >
                  {/* Era Marker */}
                  {index === 0 || filteredLanguages[index - 1].year < era.startYear ? (
                    <div className="era-marker absolute left-8 md:left-1/2 transform -translate-x-1/2 -translate-y-8 z-10">
                      <div
                        className="px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                        style={{ backgroundColor: era.color }}
                      >
                        {era.name}
                      </div>
                    </div>
                  ) : null}

                  {/* Language Card */}
                  <div
                    className={`flex items-center gap-8 mb-8 ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="relative flex-shrink-0 w-16 md:w-24">
                      <div
                        className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full border-4 border-gray-900 shadow-xl transition-all duration-500"
                        style={{
                          backgroundColor: language.color,
                          boxShadow: isVisible
                            ? `0 0 20px ${language.color}, 0 0 40px ${language.color}80`
                            : 'none'
                        }}
                      />
                      <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 -top-2 -bottom-2 w-0.5 bg-gradient-to-b from-transparent via-current to-transparent opacity-30"
                        style={{ color: language.color }}
                      />
                    </div>

                    {/* Language Content */}
                    <motion.div
                      className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'}`}
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <div
                        className="cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 rounded-lg border-2"
                        onClick={() => handleLanguageClick(language)}
                        style={{
                          borderColor: `${language.color}80`,
                          backgroundColor: 'rgba(17, 24, 39, 0.8)'
                        }}
                      >
                        <Card className="border-0 bg-transparent">
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: language.color }}>
                                {language.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {language.year}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {language.creator}
                                </span>
                              </div>
                            </div>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold"
                              style={{ backgroundColor: era.color, color: '#fff' }}
                            >
                              {era.name.split('(')[0].trim()}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-gray-300 mb-4 line-clamp-2">
                            {language.description}
                          </p>

                          {/* Key Features */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4" style={{ color: language.color }} />
                              <span className="text-sm font-semibold text-gray-400">Key Innovations</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {language.keyInnovations.slice(0, 3).map((innovation, idx) => (
                                <Badge key={idx} variant="secondary" size="sm">
                                  {innovation}
                                </Badge>
                              ))}
                              {language.keyInnovations.length > 3 && (
                                <Badge variant="secondary" size="sm">
                                  +{language.keyInnovations.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Connections */}
                          {(predecessors.length > 0 || successors.length > 0) && (
                            <div className="mt-4 pt-4 border-t border-gray-700">
                              <div className="flex flex-wrap gap-4 text-xs">
                                {predecessors.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Influenced by:</span>
                                    <div className="flex gap-1">
                                      {predecessors.slice(0, 2).map((pred, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="secondary"
                                          size="sm"
                                          className="text-xs"
                                        >
                                          {pred.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {successors.length > 0 && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500">Influenced:</span>
                                    <div className="flex gap-1">
                                      {successors.slice(0, 2).map((succ, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="secondary"
                                          size="sm"
                                          className="text-xs"
                                        >
                                          {succ.name}
                                        </Badge>
                                      ))}
                                      {successors.length > 2 && (
                                        <Badge variant="secondary" size="sm" className="text-xs">
                                          +{successors.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Paradigms */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            {language.paradigm.map((paradigm, idx) => (
                              <Badge key={idx} variant="secondary" size="sm">
                                {paradigm}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        </Card>
                      </div>
                    </motion.div>
                  </div>

                  {/* Connection Lines (Visual) */}
                  {isVisible && successors.length > 0 && (
                    <svg
                      className="absolute left-8 md:left-1/2 top-full w-full h-24 pointer-events-none opacity-30"
                      style={{ zIndex: 0 }}
                    >
                      {successors.slice(0, 3).map((successor, idx) => {
                        const succIndex = filteredLanguages.findIndex(l => l.id === successor.id);
                        if (succIndex === -1) return null;
                        const succPos = getTimelinePosition(successor.year);
                        const currPos = getTimelinePosition(language.year);
                        const distance = succPos - currPos;

                        return (
                          <motion.line
                            key={successor.id}
                            x1="0"
                            y1="0"
                            x2={isEven ? `${distance * 10}%` : `-${distance * 10}%`}
                            y2="100"
                            stroke={language.color}
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 0.4 }}
                            transition={{ duration: 1, delay: idx * 0.2 }}
                          />
                        );
                      })}
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Language Detail Modal */}
        <AnimatePresence>
          {selectedLanguage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedLanguage(null)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                style={{ borderColor: selectedLanguage.color, borderWidth: '2px' }}
              >
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-4xl font-bold mb-2" style={{ color: selectedLanguage.color }}>
                        {selectedLanguage.name}
                      </h2>
                      <div className="flex items-center gap-6 text-gray-400">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Born: {selectedLanguage.year}
                        </span>
                        <span className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          {selectedLanguage.creator}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedLanguage(null)}
                      className="flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Historical Context */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-300">Historical Context</h3>
                    <p className="text-gray-400">{selectedLanguage.historicalContext}</p>
                  </div>

                  {/* Key Innovations */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-300 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" style={{ color: selectedLanguage.color }} />
                      Key Innovations
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedLanguage.keyInnovations.map((innovation, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-gray-800 border border-gray-700"
                        >
                          <span className="text-gray-300">{innovation}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Language Family Tree */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-300 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" style={{ color: selectedLanguage.color }} />
                      Language Family Tree
                    </h3>
                    <div className="space-y-4">
                      {getLanguageConnections(selectedLanguage).predecessors.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Influenced By:</p>
                          <div className="flex flex-wrap gap-2">
                            {getLanguageConnections(selectedLanguage).predecessors.map((pred, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-sm py-1 px-3"
                              >
                                {pred.name} ({pred.year})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {getLanguageConnections(selectedLanguage).successors.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Influenced:</p>
                          <div className="flex flex-wrap gap-2">
                                      {getLanguageConnections(selectedLanguage).successors.map((succ, idx) => (
                                        <span
                                          key={idx}
                                          className="text-sm py-1 px-3 rounded-full border inline-flex items-center gap-1"
                                          style={{ backgroundColor: `${succ.color}20`, borderColor: succ.color, color: succ.color }}
                                        >
                                          {succ.name} ({succ.year})
                                          <ArrowRight className="w-3 h-3" />
                                        </span>
                                      ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hello World */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-300 flex items-center gap-2">
                      <Code className="w-5 h-5" style={{ color: selectedLanguage.color }} />
                      Hello, World!
                    </h3>
                    <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto border border-gray-700">
                      <code className="text-sm text-gray-300">{selectedLanguage.helloWorld}</code>
                    </pre>
                  </div>

                  {/* Paradigms */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-300">Programming Paradigms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLanguage.paradigm.map((paradigm, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{ backgroundColor: selectedLanguage.color, color: '#fff' }}
                        >
                          {paradigm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
