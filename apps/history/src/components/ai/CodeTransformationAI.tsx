'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, RotateCcw, Copy, Check, History, Zap, ArrowRight } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useGroqAI } from '@/hooks/useGroqAI';
import { useReducedMotion } from '@/hooks/useAnimations';

interface CodeTransformation {
  id: string;
  originalCode: string;
  transformedCode: string;
  sourceEra: string;
  targetEra: string;
  explanation: string;
  timestamp: Date;
}

interface CodeTransformationAIProps {
  className?: string;
}

const eraOptions = [
  { value: '1950s', label: '1950s (Assembly/FORTRAN)', icon: '⚙️', color: '#8B4513' },
  { value: '1960s', label: '1960s (ALGOL/C)', icon: '🏗️', color: '#1E90FF' },
  { value: '1970s', label: '1970s (Pascal/C)', icon: '📚', color: '#8B008B' },
  { value: '1980s', label: '1980s (C++/Object-Oriented)', icon: '🎯', color: '#FF6347' },
  { value: '1990s', label: '1990s (Java/Web)', icon: '🌐', color: '#32CD32' },
  { value: '2000s', label: '2000s (Modern Web)', icon: '🚀', color: '#9370DB' },
  { value: '2010s', label: '2010s (Functional/TypeScript)', icon: '⚡', color: '#20B2AA' },
  { value: '2020s', label: '2020s (AI-Assisted)', icon: '🤖', color: '#FF6B35' },
];

const sampleCode = [
  {
    title: 'Simple Function',
    code: `function add(a, b) {
  return a + b;
}`,
    description: 'A basic JavaScript function'
  },
  {
    title: 'Class Definition',
    code: `class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
  
  greet() {
    return \`Hello, \${this.name}!\`;
  }
}`,
    description: 'A JavaScript class with constructor and method'
  },
  {
    title: 'Array Operations',
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);`,
    description: 'Modern JavaScript array operations'
  }
];

export const CodeTransformationAI: React.FC<CodeTransformationAIProps> = ({
  className = '',
}) => {
  const [inputCode, setInputCode] = useState('');
  const [selectedEra, setSelectedEra] = useState('1980s');
  const [transformations, setTransformations] = useState<CodeTransformation[]>([]);
  const [isTransforming, setIsTransforming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { executeAIRequest } = useGroqAI();
  const reducedMotion = useReducedMotion();

  const handleTransform = async () => {
    if (!inputCode.trim()) return;

    setIsTransforming(true);
    const transformationId = Date.now().toString();

    try {
      const prompt = `Transform this modern JavaScript code to ${selectedEra} programming style and syntax. 
      
Original code:
\`\`\`javascript
${inputCode}
\`\`\`

Please provide:
1. The transformed code in the appropriate ${selectedEra} language/syntax
2. A detailed explanation of the changes made
3. Why certain modern features were replaced or adapted

Target era: ${selectedEra}`;

      const response = await executeAIRequest(
        async (prompt: string) => {
          const { groqClient } = await import('@/lib/groq/groqClient');
          const response = await groqClient.chat.completions.create({
            messages: [
              { 
                role: 'system', 
                content: 'You are an expert programming language historian. Transform modern code to historical programming styles, explaining the changes and historical context.' 
              },
              { role: 'user', content: prompt }
            ],
            model: 'llama3-8b-8192',
            temperature: 0.7,
            max_tokens: 1024
          });
          
          return {
            content: response.choices[0]?.message?.content || 'No response generated',
            model: 'llama3-8b-8192'
          };
        },
        'code-transform',
        selectedEra,
        inputCode
      );

      if (response) {
        const newTransformation: CodeTransformation = {
          id: transformationId,
          originalCode: inputCode,
          transformedCode: response.content,
          sourceEra: 'Modern',
          targetEra: selectedEra,
          explanation: response.content,
          timestamp: new Date(),
        };

        setTransformations(prev => [newTransformation, ...prev]);
      }
    } catch (error) {
      console.error('Transformation failed:', error);
    } finally {
      setIsTransforming(false);
    }
  };

  const handleSampleSelect = (sample: typeof sampleCode[0]) => {
    setInputCode(sample.code);
  };

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const clearHistory = () => {
    setTransformations([]);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="portfolio-hero-text text-white mb-4">Code Transformation AI</h2>
        <p className="portfolio-base-text text-gray-300 max-w-3xl mx-auto">
          Transform modern code to historical programming styles. See how the same logic would be written 
          in different eras of programming history.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <InteractiveCard variant="code" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="portfolio-medium-text text-white">Input Code</h3>
                <div className="flex gap-2">
                  <InteractiveButton
                    onClick={clearHistory}
                    variant="ghost"
                    size="sm"
                  >
                    <History className="w-4 h-4" />
                  </InteractiveButton>
                </div>
              </div>

              {/* Sample Code Buttons */}
              <div className="space-y-2">
                <p className="portfolio-small-text text-orange-400">Try these samples:</p>
                <div className="flex flex-wrap gap-2">
                  {sampleCode.map((sample, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSampleSelect(sample)}
                      className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 text-xs rounded-full transition-colors"
                      whileHover={reducedMotion ? {} : { scale: 1.05 }}
                      whileTap={reducedMotion ? {} : { scale: 0.95 }}
                    >
                      {sample.title}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Code Input */}
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Paste your modern JavaScript code here..."
                className="w-full h-48 bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm resize-none"
              />

              {/* Era Selection */}
              <div className="space-y-3">
                <p className="portfolio-small-text text-orange-400">Transform to:</p>
                <div className="grid grid-cols-2 gap-2">
                  {eraOptions.map((era) => (
                    <motion.button
                      key={era.value}
                      onClick={() => setSelectedEra(era.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedEra === era.value
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-600 hover:border-orange-500/50'
                      }`}
                      whileHover={reducedMotion ? {} : { scale: 1.02 }}
                      whileTap={reducedMotion ? {} : { scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{era.icon}</span>
                        <div className="text-left">
                          <p className="text-xs text-white font-medium">{era.label.split(' ')[0]}</p>
                          <p className="text-xs text-gray-400">{era.label.split(' ').slice(1).join(' ')}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Transform Button */}
              <InteractiveButton
                onClick={handleTransform}
                disabled={!inputCode.trim() || isTransforming}
                variant="primary"
                className="w-full"
              >
                {isTransforming ? (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                    TRANSFORMING...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    TRANSFORM CODE
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
        >
          <InteractiveCard variant="code" className="h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="portfolio-medium-text text-white">Transformation Results</h3>
                <span className="portfolio-small-text text-gray-400">
                  {transformations.length} transformation{transformations.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {transformations.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No transformations yet</p>
                      <p className="text-sm text-gray-500">Enter code and select an era to transform</p>
                    </motion.div>
                  ) : (
                    transformations.map((transformation, index) => (
                      <motion.div
                        key={transformation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="border border-gray-700 rounded-lg p-4 space-y-3"
                      >
                        {/* Transformation Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {eraOptions.find(e => e.value === transformation.targetEra)?.icon}
                            </span>
                            <span className="portfolio-small-text text-orange-400">
                              {transformation.sourceEra} → {transformation.targetEra}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="portfolio-small-text text-gray-500">
                              {transformation.timestamp.toLocaleTimeString()}
                            </span>
                            <InteractiveButton
                              onClick={() => copyToClipboard(transformation.transformedCode, transformation.id)}
                              variant="ghost"
                              size="sm"
                            >
                              {copiedId === transformation.id ? (
                                <Check className="w-3 h-3 text-green-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </InteractiveButton>
                          </div>
                        </div>

                        {/* Transformed Code */}
                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Code className="w-4 h-4 text-orange-400" />
                            <span className="portfolio-small-text text-orange-400">Transformed Code</span>
                          </div>
                          <pre className="text-green-400 text-xs font-mono overflow-x-auto">
                            {transformation.transformedCode}
                          </pre>
                        </div>

                        {/* Explanation */}
                        <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                          <div className="flex items-center gap-2 mb-2">
                            <ArrowRight className="w-4 h-4 text-orange-400" />
                            <span className="portfolio-small-text text-orange-400">Explanation</span>
                          </div>
                          <p className="text-gray-300 text-xs leading-relaxed">
                            {transformation.explanation}
                          </p>
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

export default CodeTransformationAI;