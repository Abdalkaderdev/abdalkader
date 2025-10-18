'use client';

import { useState } from 'react';
import { Language } from '@/lib/types/language';
import { useGroqAI } from '@/hooks/useGroqAI';
import { explainParadigm } from '@/services/aiService';
import { Layers, Loader, AlertCircle } from 'lucide-react';

interface ParadigmExplorerProps {
  languages: Language[];
  onLanguageSelect?: (language: Language) => void;
}

const paradigms = [
  {
    name: 'Imperative',
    description: 'Programming based on giving commands to the computer',
    color: '#3B82F6',
    icon: '⚡',
    languages: ['C', 'FORTRAN', 'COBOL', 'Pascal', 'Go', 'Rust']
  },
  {
    name: 'Object-Oriented',
    description: 'Programming based on objects and classes',
    color: '#8B5CF6',
    icon: '🏗️',
    languages: ['C++', 'Java', 'C#', 'Python', 'Ruby', 'Smalltalk', 'JavaScript', 'Swift', 'Kotlin']
  },
  {
    name: 'Functional',
    description: 'Programming based on mathematical functions',
    color: '#10B981',
    icon: '🧮',
    languages: ['LISP', 'Haskell', 'Clojure', 'F#', 'Scala', 'JavaScript', 'Python', 'Ruby']
  },
  {
    name: 'Procedural',
    description: 'Programming based on procedures and functions',
    color: '#F59E0B',
    icon: '📋',
    languages: ['C', 'FORTRAN', 'COBOL', 'Pascal', 'ALGOL', 'Go']
  },
  {
    name: 'Declarative',
    description: 'Programming that describes what should be done, not how',
    color: '#EF4444',
    icon: '📝',
    languages: ['SQL', 'Prolog', 'HTML', 'CSS']
  }
];

export function ParadigmExplorer({ languages, onLanguageSelect }: ParadigmExplorerProps) {
  const [selectedParadigm, setSelectedParadigm] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const { executeAIRequest, isLoading, error } = useGroqAI();

  const handleParadigmClick = async (paradigmName: string) => {
    setSelectedParadigm(paradigmName);
    
    const result = await executeAIRequest(
      explainParadigm,
      'paradigm',
      'paradigm',
      paradigmName
    );

    if (result) {
      setExplanation(result.content);
    }
  };

  const getLanguagesForParadigm = (paradigmName: string) => {
    return languages.filter(lang => 
      lang.paradigm.some(p => p.toLowerCase().includes(paradigmName.toLowerCase()))
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Paradigm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paradigms.map((paradigm) => {
          const paradigmLanguages = getLanguagesForParadigm(paradigm.name);
          const isSelected = selectedParadigm === paradigm.name;
          
          return (
            <div
              key={paradigm.name}
              onClick={() => handleParadigmClick(paradigm.name)}
              className={`cursor-pointer rounded-xl p-6 border transition-all duration-200 ${
                isSelected
                  ? 'border-purple-500 bg-purple-600/20'
                  : 'border-slate-600 bg-slate-800/50 hover:border-purple-400 hover:bg-purple-600/10'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{paradigm.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{paradigm.name}</h3>
                  <div className="text-sm text-slate-400">
                    {paradigmLanguages.length} languages
                  </div>
                </div>
              </div>
              
              <p className="text-slate-300 text-sm mb-4">
                {paradigm.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {paradigmLanguages.slice(0, 3).map((lang) => (
                  <span
                    key={lang.id}
                    className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded"
                    style={{ borderLeftColor: lang.color, borderLeftWidth: '3px' }}
                  >
                    {lang.name}
                  </span>
                ))}
                {paradigmLanguages.length > 3 && (
                  <span className="px-2 py-1 text-slate-500 text-xs">
                    +{paradigmLanguages.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Explanation */}
      {selectedParadigm && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-2 mb-4">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-semibold text-white">
              AI Explanation: {selectedParadigm} Programming
            </h3>
          </div>
          
          {isLoading ? (
            <div className="flex items-center space-x-2 text-purple-400">
              <Loader className="w-5 h-5 animate-spin" />
              <span>AI is explaining {selectedParadigm} programming...</span>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>Error: {error}</span>
            </div>
          ) : explanation ? (
            <div className="prose prose-invert max-w-none">
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {explanation}
              </div>
            </div>
          ) : (
            <div className="text-slate-400">
              Click on a paradigm to get AI-powered explanation
            </div>
          )}

          {/* Language Examples */}
          {selectedParadigm && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">
                Languages using {selectedParadigm} Programming
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {getLanguagesForParadigm(selectedParadigm).map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => onLanguageSelect?.(lang)}
                    className="p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600 hover:border-purple-400 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: lang.color }}
                      ></div>
                      <span className="font-semibold text-white text-sm">{lang.name}</span>
                    </div>
                    <div className="text-xs text-slate-400">{lang.year}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
