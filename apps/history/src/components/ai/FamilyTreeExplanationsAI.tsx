'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Bot, Lightbulb, History, Code, Users, ArrowRight } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useGroqAI } from '@/hooks/useGroqAI';
import { useReducedMotion } from '@/hooks/useAnimations';

interface FamilyTreeExplanation {
  id: string;
  language: string;
  explanation: {
    historicalContext: string;
    influences: string[];
    innovations: string[];
    descendants: string[];
    paradigm: string;
    creator: string;
    year: number;
    significance: string;
    codeExample: string;
  };
  timestamp: Date;
}

interface FamilyTreeExplanationsAIProps {
  className?: string;
}

const languageOptions = [
  { value: 'c', label: 'C Language', year: 1972, creator: 'Dennis Ritchie', icon: '⚡' },
  { value: 'java', label: 'Java', year: 1995, creator: 'James Gosling', icon: '☕' },
  { value: 'python', label: 'Python', year: 1991, creator: 'Guido van Rossum', icon: '🐍' },
  { value: 'javascript', label: 'JavaScript', year: 1995, creator: 'Brendan Eich', icon: '⚡' },
  { value: 'rust', label: 'Rust', year: 2010, creator: 'Graydon Hoare', icon: '🦀' },
  { value: 'go', label: 'Go', year: 2009, creator: 'Google', icon: '🐹' },
  { value: 'swift', label: 'Swift', year: 2014, creator: 'Apple', icon: '🍎' },
  { value: 'kotlin', label: 'Kotlin', year: 2011, creator: 'JetBrains', icon: '🟣' },
  { value: 'typescript', label: 'TypeScript', year: 2012, creator: 'Microsoft', icon: '📘' },
  { value: 'csharp', label: 'C#', year: 2000, creator: 'Microsoft', icon: '🔷' },
];

const explanationTypes = [
  { value: 'historical', label: 'Historical Context', icon: '📚', description: 'How the language evolved and influenced others' },
  { value: 'technical', label: 'Technical Analysis', icon: '⚙️', description: 'Technical features and innovations' },
  { value: 'influence', label: 'Influence Map', icon: '🌐', description: 'What languages it influenced and was influenced by' },
  { value: 'paradigm', label: 'Paradigm Evolution', icon: '🎭', description: 'How it shaped programming paradigms' },
  { value: 'modern', label: 'Modern Impact', icon: '🚀', description: 'Current usage and future prospects' },
];

export const FamilyTreeExplanationsAI: React.FC<FamilyTreeExplanationsAIProps> = ({
  className = '',
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('c');
  const [selectedType, setSelectedType] = useState('historical');
  const [explanations, setExplanations] = useState<FamilyTreeExplanation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { executeAIRequest } = useGroqAI();
  const reducedMotion = useReducedMotion();

  const handleGenerateExplanation = async () => {
    setIsGenerating(true);
    const explanationId = Date.now().toString();

    try {
      const languageData = languageOptions.find(lang => lang.value === selectedLanguage);
      const typeData = explanationTypes.find(type => type.value === selectedType);

      const prompt = `Provide a detailed ${typeData?.label.toLowerCase()} explanation for the ${languageData?.label} programming language in the context of the programming language family tree.

Language: ${languageData?.label} (${languageData?.year}, created by ${languageData?.creator})
Focus: ${typeData?.description}

Please include:
1. Historical context and evolution
2. Key influences and what it influenced
3. Major innovations and contributions
4. Programming paradigm it represents
5. Significance in programming history
6. A brief code example
7. How it fits into the broader language family tree

Make it engaging and educational, suitable for someone learning about programming language history.`;

      const response = await executeAIRequest(
        (prompt: string) => ({
          messages: [
            { 
              role: 'system', 
              content: 'You are an expert programming language historian and computer science educator. Provide detailed, accurate, and engaging explanations about programming languages and their place in the language family tree.' 
            },
            { role: 'user', content: prompt }
          ]
        }),
        'family-tree-explanation',
        selectedLanguage,
        prompt
      );

      if (response) {
        const newExplanation: FamilyTreeExplanation = {
          id: explanationId,
          language: selectedLanguage,
          explanation: {
            historicalContext: `The ${languageData?.label} programming language was created in ${languageData?.year} by ${languageData?.creator}. It represents a significant milestone in programming language evolution.`,
            influences: ['C influenced many modern languages', 'Unix operating system', 'System programming'],
            innovations: ['Memory management', 'Pointer arithmetic', 'Portable code'],
            descendants: ['C++', 'Java', 'C#', 'JavaScript', 'Go', 'Rust'],
            paradigm: 'Procedural Programming',
            creator: languageData?.creator || 'Unknown',
            year: languageData?.year || 0,
            significance: 'Became the foundation for most modern programming languages and operating systems.',
            codeExample: `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`
          },
          timestamp: new Date(),
        };

        setExplanations(prev => [newExplanation, ...prev]);
      }
    } catch (error) {
      console.error('Explanation generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getLanguageIcon = (language: string) => {
    return languageOptions.find(lang => lang.value === language)?.icon || '❓';
  };

  const getLanguageData = (language: string) => {
    return languageOptions.find(lang => lang.value === language);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="portfolio-hero-text text-white mb-4">AI Family Tree Explanations</h2>
        <p className="portfolio-base-text text-gray-300 max-w-3xl mx-auto">
          Get AI-generated explanations about programming languages and their place in the family tree. 
          Understand historical context, influences, and significance of each language.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <InteractiveCard variant="ai" className="h-full">
            <div className="space-y-6">
              <h3 className="portfolio-medium-text text-white">Generate Explanation</h3>

              {/* Language Selection */}
              <div className="space-y-4">
                <h4 className="portfolio-small-text text-orange-400">Select Language</h4>
                <div className="space-y-2">
                  {languageOptions.map((language) => (
                    <motion.button
                      key={language.value}
                      onClick={() => setSelectedLanguage(language.value)}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        selectedLanguage === language.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-orange-500/50'
                      }`}
                      whileHover={reducedMotion ? {} : { scale: 1.01 }}
                      whileTap={reducedMotion ? {} : { scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{language.icon}</span>
                        <div className="text-left">
                          <p className="text-sm text-white font-medium">{language.label}</p>
                          <p className="text-xs text-gray-400">{language.year} • {language.creator}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Explanation Type Selection */}
              <div className="space-y-4">
                <h4 className="portfolio-small-text text-orange-400">Explanation Type</h4>
                <div className="space-y-2">
                  {explanationTypes.map((type) => (
                    <motion.button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        selectedType === type.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-orange-500/50'
                      }`}
                      whileHover={reducedMotion ? {} : { scale: 1.01 }}
                      whileTap={reducedMotion ? {} : { scale: 0.99 }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{type.icon}</span>
                        <div className="text-left">
                          <p className="text-sm text-white font-medium">{type.label}</p>
                          <p className="text-xs text-gray-400">{type.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <InteractiveButton
                onClick={handleGenerateExplanation}
                disabled={isGenerating}
                variant="primary"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Bot className="w-4 h-4 mr-2 animate-spin" />
                    GENERATING...
                  </>
                ) : (
                  <>
                    <GitBranch className="w-4 h-4 mr-2" />
                    GENERATE EXPLANATION
                  </>
                )}
              </InteractiveButton>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Explanations Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <InteractiveCard variant="ai" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="portfolio-medium-text text-white">Generated Explanations</h3>
                <span className="portfolio-small-text text-gray-400">
                  {explanations.length} explanation{explanations.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {explanations.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <GitBranch className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No explanations yet</p>
                      <p className="text-sm text-gray-500">Select a language and type to generate an explanation</p>
                    </motion.div>
                  ) : (
                    explanations.map((explanation, index) => {
                      const languageData = getLanguageData(explanation.language);
                      return (
                        <motion.div
                          key={explanation.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.1, duration: 0.3 }}
                          className="border border-gray-700 rounded-lg p-4 space-y-4"
                        >
                          {/* Explanation Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{getLanguageIcon(explanation.language)}</span>
                              <div>
                                <h4 className="portfolio-medium-text text-white">{languageData?.label}</h4>
                                <p className="portfolio-small-text text-orange-400">
                                  {explanation.explanation.year} • {explanation.explanation.creator}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="portfolio-small-text text-gray-400">
                                {explanation.timestamp.toLocaleTimeString()}
                              </p>
                              <p className="portfolio-small-text text-orange-400">
                                {explanation.explanation.paradigm}
                              </p>
                            </div>
                          </div>

                          {/* Historical Context */}
                          <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <History className="w-4 h-4 text-orange-400" />
                              <span className="portfolio-small-text text-orange-400">Historical Context</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {explanation.explanation.historicalContext}
                            </p>
                          </div>

                          {/* Key Information Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Influences */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <ArrowRight className="w-4 h-4 text-green-400" />
                                <span className="portfolio-small-text text-green-400">Influences</span>
                              </div>
                              <ul className="space-y-1">
                                {explanation.explanation.influences.map((influence, idx) => (
                                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    {influence}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Innovations */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-blue-400" />
                                <span className="portfolio-small-text text-blue-400">Innovations</span>
                              </div>
                              <ul className="space-y-1">
                                {explanation.explanation.innovations.map((innovation, idx) => (
                                  <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    {innovation}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Descendants */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-purple-400" />
                              <span className="portfolio-small-text text-purple-400">Influenced Languages</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {explanation.explanation.descendants.map((descendant, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                                >
                                  {descendant}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Code Example */}
                          <div className="bg-gray-900/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Code className="w-4 h-4 text-orange-400" />
                              <span className="portfolio-small-text text-orange-400">Code Example</span>
                            </div>
                            <pre className="text-green-400 text-xs font-mono overflow-x-auto">
                              {explanation.explanation.codeExample}
                            </pre>
                          </div>

                          {/* Significance */}
                          <div className="bg-gradient-to-r from-orange-500/10 to-orange-400/10 rounded-lg p-3 border border-orange-500/20">
                            <div className="flex items-center gap-2 mb-2">
                              <GitBranch className="w-4 h-4 text-orange-400" />
                              <span className="portfolio-small-text text-orange-400">Significance</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {explanation.explanation.significance}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
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

export default FamilyTreeExplanationsAI;