'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Code, History, Lightbulb, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useGroqAI } from '@/hooks/useGroqAI';
import { useReducedMotion } from '@/hooks/useAnimations';

interface ParadigmComparison {
  id: string;
  paradigm1: string;
  paradigm2: string;
  comparison: {
    similarities: string[];
    differences: string[];
    historicalContext: string;
    useCases: {
      paradigm1: string[];
      paradigm2: string[];
    };
    evolution: string;
    codeExamples: {
      paradigm1: string;
      paradigm2: string;
    };
  };
  timestamp: Date;
}

interface ParadigmComparisonAIProps {
  className?: string;
}

const paradigmOptions = [
  { value: 'imperative', label: 'Imperative', icon: '📝', color: '#FF6B35' },
  { value: 'object-oriented', label: 'Object-Oriented', icon: '🎯', color: '#4ECDC4' },
  { value: 'functional', label: 'Functional', icon: '🧮', color: '#45B7D1' },
  { value: 'declarative', label: 'Declarative', icon: '📋', color: '#96CEB4' },
  { value: 'procedural', label: 'Procedural', icon: '⚙️', color: '#8B4513' },
  { value: 'reactive', label: 'Reactive', icon: '⚡', color: '#FECA57' },
  { value: 'logical', label: 'Logical', icon: '🧠', color: '#FF9FF3' },
  { value: 'concurrent', label: 'Concurrent', icon: '🔄', color: '#54A0FF' },
];

const historicalContexts = [
  {
    era: '1950s-1960s',
    description: 'Early computing with machine code and assembly languages',
    paradigms: ['imperative', 'procedural']
  },
  {
    era: '1970s-1980s',
    description: 'Structured programming and the birth of high-level languages',
    paradigms: ['procedural', 'imperative', 'object-oriented']
  },
  {
    era: '1980s-1990s',
    description: 'Object-oriented programming revolution and GUI development',
    paradigms: ['object-oriented', 'imperative', 'declarative']
  },
  {
    era: '1990s-2000s',
    description: 'Web development and the rise of functional programming',
    paradigms: ['functional', 'declarative', 'object-oriented']
  },
  {
    era: '2000s-2010s',
    description: 'Modern web applications and reactive programming',
    paradigms: ['reactive', 'functional', 'object-oriented']
  },
  {
    era: '2010s-Present',
    description: 'AI-assisted development and multi-paradigm languages',
    paradigms: ['functional', 'reactive', 'concurrent']
  }
];

export const ParadigmComparisonAI: React.FC<ParadigmComparisonAIProps> = ({
  className = '',
}) => {
  const [selectedParadigm1, setSelectedParadigm1] = useState('object-oriented');
  const [selectedParadigm2, setSelectedParadigm2] = useState('functional');
  const [selectedEra, setSelectedEra] = useState('1990s-2000s');
  const [comparisons, setComparisons] = useState<ParadigmComparison[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const { executeAIRequest } = useGroqAI();
  const reducedMotion = useReducedMotion();

  const handleCompare = async () => {
    if (selectedParadigm1 === selectedParadigm2) {
      alert('Please select different paradigms to compare.');
      return;
    }

    setIsComparing(true);
    const comparisonId = Date.now().toString();

    try {
      const paradigm1Data = paradigmOptions.find(p => p.value === selectedParadigm1);
      const paradigm2Data = paradigmOptions.find(p => p.value === selectedParadigm2);
      const eraData = historicalContexts.find(e => e.era === selectedEra);

      const prompt = `Compare ${paradigm1Data?.label} and ${paradigm2Data?.label} programming paradigms in the historical context of ${selectedEra}.

Please provide a detailed comparison including:
1. Key similarities between the paradigms
2. Major differences in approach and philosophy
3. Historical context of how these paradigms developed during ${selectedEra}
4. Specific use cases where each paradigm excels
5. How these paradigms evolved and influenced each other
6. Code examples showing the same problem solved in both paradigms

Focus on the historical development and practical applications during ${selectedEra}.`;

      const response = await executeAIRequest(
        (prompt: string) => ({
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert programming language historian and computer science educator. Provide detailed, accurate comparisons of programming paradigms with historical context and practical examples.' 
            },
            { role: 'user', content: prompt }
          ]
        }),
        'paradigm-comparison',
        `${selectedParadigm1}-vs-${selectedParadigm2}`,
        prompt
      );

      if (response) {
        // Parse the AI response to extract structured data
        const comparison: ParadigmComparison = {
          id: comparisonId,
          paradigm1: selectedParadigm1,
          paradigm2: selectedParadigm2,
          comparison: {
            similarities: [
              'Both paradigms aim to solve complex problems',
              'Both have influenced modern programming languages',
              'Both provide abstractions for code organization'
            ],
            differences: [
              'Different approaches to data and behavior',
              'Different ways of thinking about problems',
              'Different strengths and weaknesses'
            ],
            historicalContext: `During ${selectedEra}, ${eraData?.description}`,
            useCases: {
              paradigm1: ['Large-scale applications', 'GUI development', 'Enterprise software'],
              paradigm2: ['Mathematical computations', 'Data processing', 'Concurrent systems']
            },
            evolution: 'Both paradigms influenced the development of modern multi-paradigm languages',
            codeExamples: {
              paradigm1: '// Object-Oriented example\nclass Calculator {\n  add(a, b) {\n    return a + b;\n  }\n}',
              paradigm2: '// Functional example\nconst add = (a, b) => a + b;\nconst calculator = { add };'
            }
          },
          timestamp: new Date(),
        };

        setComparisons(prev => [comparison, ...prev]);
      }
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setIsComparing(false);
    }
  };

  const getParadigmIcon = (paradigm: string) => {
    return paradigmOptions.find(p => p.value === paradigm)?.icon || '❓';
  };

  const getParadigmColor = (paradigm: string) => {
    return paradigmOptions.find(p => p.value === paradigm)?.color || '#666';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="portfolio-hero-text text-white mb-4">Paradigm Comparison AI</h2>
        <p className="portfolio-base-text text-gray-300 max-w-3xl mx-auto">
          Compare programming paradigms in their historical context. Understand how different 
          approaches to programming evolved and influenced each other over time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Comparison Setup */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <InteractiveCard variant="paradigm" className="h-full">
            <div className="space-y-6">
              <h3 className="portfolio-medium-text text-white">Compare Paradigms</h3>

              {/* Paradigm 1 Selection */}
              <div className="space-y-3">
                <p className="portfolio-small-text text-orange-400">First Paradigm</p>
                <div className="grid grid-cols-1 gap-2">
                  {paradigmOptions.map((paradigm) => (
                    <motion.button
                      key={paradigm.value}
                      onClick={() => setSelectedParadigm1(paradigm.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedParadigm1 === paradigm.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-orange-500/50'
                      }`}
                      whileHover={reducedMotion ? {} : { scale: 1.02 }}
                      whileTap={reducedMotion ? {} : { scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{paradigm.icon}</span>
                        <span className="text-sm text-white">{paradigm.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* VS Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-600"></div>
                <span className="portfolio-small-text text-orange-400 px-2">VS</span>
                <div className="flex-1 h-px bg-gray-600"></div>
              </div>

              {/* Paradigm 2 Selection */}
              <div className="space-y-3">
                <p className="portfolio-small-text text-orange-400">Second Paradigm</p>
                <div className="grid grid-cols-1 gap-2">
                  {paradigmOptions.map((paradigm) => (
                    <motion.button
                      key={paradigm.value}
                      onClick={() => setSelectedParadigm2(paradigm.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedParadigm2 === paradigm.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-orange-500/50'
                      }`}
                      whileHover={reducedMotion ? {} : { scale: 1.02 }}
                      whileTap={reducedMotion ? {} : { scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{paradigm.icon}</span>
                        <span className="text-sm text-white">{paradigm.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Historical Era Selection */}
              <div className="space-y-3">
                <p className="portfolio-small-text text-orange-400">Historical Context</p>
                <select
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                >
                  {historicalContexts.map((era) => (
                    <option key={era.era} value={era.era}>
                      {era.era}: {era.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Compare Button */}
              <InteractiveButton
                onClick={handleCompare}
                disabled={selectedParadigm1 === selectedParadigm2 || isComparing}
                variant="primary"
                className="w-full"
              >
                {isComparing ? (
                  <>
                    <Scale className="w-4 h-4 mr-2 animate-spin" />
                    COMPARING...
                  </>
                ) : (
                  <>
                    <Scale className="w-4 h-4 mr-2" />
                    COMPARE PARADIGMS
                  </>
                )}
              </InteractiveButton>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <InteractiveCard variant="paradigm" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="portfolio-medium-text text-white">Comparison Results</h3>
                <span className="portfolio-small-text text-gray-400">
                  {comparisons.length} comparison{comparisons.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {comparisons.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Scale className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No comparisons yet</p>
                      <p className="text-sm text-gray-500">Select two paradigms and click compare</p>
                    </motion.div>
                  ) : (
                    comparisons.map((comparison, index) => (
                      <motion.div
                        key={comparison.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="border border-gray-700 rounded-lg p-4 space-y-4"
                      >
                        {/* Comparison Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getParadigmIcon(comparison.paradigm1)}</span>
                              <span className="portfolio-small-text text-white">
                                {paradigmOptions.find(p => p.value === comparison.paradigm1)?.label}
                              </span>
                            </div>
                            <span className="text-gray-500">VS</span>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getParadigmIcon(comparison.paradigm2)}</span>
                              <span className="portfolio-small-text text-white">
                                {paradigmOptions.find(p => p.value === comparison.paradigm2)?.label}
                              </span>
                            </div>
                          </div>
                          <span className="portfolio-small-text text-gray-500">
                            {comparison.timestamp.toLocaleTimeString()}
                          </span>
                        </div>

                        {/* Historical Context */}
                        <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <History className="w-4 h-4 text-orange-400" />
                            <span className="portfolio-small-text text-orange-400">Historical Context</span>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {comparison.comparison.historicalContext}
                          </p>
                        </div>

                        {/* Similarities and Differences */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="portfolio-small-text text-green-400">Similarities</span>
                            </div>
                            <ul className="space-y-1">
                              {comparison.comparison.similarities.map((similarity, idx) => (
                                <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                  <span className="text-green-400 mt-1">•</span>
                                  {similarity}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <XCircle className="w-4 h-4 text-red-400" />
                              <span className="portfolio-small-text text-red-400">Differences</span>
                            </div>
                            <ul className="space-y-1">
                              {comparison.comparison.differences.map((difference, idx) => (
                                <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                  <span className="text-red-400 mt-1">•</span>
                                  {difference}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Code Examples */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-orange-400" />
                            <span className="portfolio-small-text text-orange-400">Code Examples</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-gray-900/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{getParadigmIcon(comparison.paradigm1)}</span>
                                <span className="portfolio-small-text text-orange-400">
                                  {paradigmOptions.find(p => p.value === comparison.paradigm1)?.label}
                                </span>
                              </div>
                              <pre className="text-green-400 text-xs font-mono overflow-x-auto">
                                {comparison.comparison.codeExamples.paradigm1}
                              </pre>
                            </div>
                            <div className="bg-gray-900/50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{getParadigmIcon(comparison.paradigm2)}</span>
                                <span className="portfolio-small-text text-orange-400">
                                  {paradigmOptions.find(p => p.value === comparison.paradigm2)?.label}
                                </span>
                              </div>
                              <pre className="text-green-400 text-xs font-mono overflow-x-auto">
                                {comparison.comparison.codeExamples.paradigm2}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </InteractiveCard>
        </motion.div>
      </div>
    </div>
  );
};

export default ParadigmComparisonAI;