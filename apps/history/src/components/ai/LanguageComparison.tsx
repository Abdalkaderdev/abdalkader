'use client';

import { useState } from 'react';
import { Language } from '@/lib/types/language';
import { useGroqAI } from '@/hooks/useGroqAI';
import { compareLanguages } from '@/services/aiService';
import { ArrowRight, Loader, AlertCircle } from 'lucide-react';

interface LanguageComparisonProps {
  languages: Language[];
}

export function LanguageComparison({ languages }: LanguageComparisonProps) {
  const [language1, setLanguage1] = useState<Language | null>(null);
  const [language2, setLanguage2] = useState<Language | null>(null);
  const [comparison, setComparison] = useState<string | null>(null);
  const { executeAIRequest, isLoading, error } = useGroqAI();

  const handleCompare = async () => {
    if (!language1 || !language2) return;

    const result = await executeAIRequest(
      compareLanguages,
      'comparison',
      'comparison',
      language1.name,
      language2.name
    );

    if (result) {
      setComparison(result.content);
    }
  };

  const handleSwapLanguages = () => {
    setLanguage1(language2);
    setLanguage2(language1);
    setComparison(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Language Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language 1 */}
        <div className="space-y-3">
          <label className="text-white font-semibold">First Language</label>
          <select
            value={language1?.id || ''}
            onChange={(e) => {
              const lang = languages.find(l => l.id === e.target.value);
              setLanguage1(lang || null);
              setComparison(null);
            }}
            className="w-full bg-slate-800/50 border border-purple-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">Select a language...</option>
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name} ({lang.year})
              </option>
            ))}
          </select>
          
          {language1 && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: language1.color }}
                ></div>
                <span className="font-semibold text-white">{language1.name}</span>
              </div>
              <div className="text-sm text-slate-300">
                <div>Created: {language1.year}</div>
                <div>Creator: {language1.creator}</div>
                <div>Paradigms: {language1.paradigm.join(', ')}</div>
              </div>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleSwapLanguages}
            disabled={!language1 || !language2}
            className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Language 2 */}
        <div className="space-y-3">
          <label className="text-white font-semibold">Second Language</label>
          <select
            value={language2?.id || ''}
            onChange={(e) => {
              const lang = languages.find(l => l.id === e.target.value);
              setLanguage2(lang || null);
              setComparison(null);
            }}
            className="w-full bg-slate-800/50 border border-purple-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
          >
            <option value="">Select a language...</option>
            {languages
              .filter(lang => lang.id !== language1?.id)
              .map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name} ({lang.year})
                </option>
              ))}
          </select>
          
          {language2 && (
            <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: language2.color }}
                ></div>
                <span className="font-semibold text-white">{language2.name}</span>
              </div>
              <div className="text-sm text-slate-300">
                <div>Created: {language2.year}</div>
                <div>Creator: {language2.creator}</div>
                <div>Paradigms: {language2.paradigm.join(', ')}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compare Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={!language1 || !language2 || isLoading}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Comparing...</span>
            </>
          ) : (
            <span>Compare Languages</span>
          )}
        </button>
      </div>

      {/* Comparison Result */}
      {comparison && (
        <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">
            AI Comparison: {language1?.name} vs {language2?.name}
          </h3>
          <div className="prose prose-invert max-w-none">
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {comparison}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
