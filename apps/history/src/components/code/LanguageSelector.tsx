'use client';

import { Language } from '@/lib/types/language';
import { ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language | null;
  onLanguageSelect: (language: Language) => void;
}

export function LanguageSelector({ 
  languages, 
  selectedLanguage, 
  onLanguageSelect 
}: LanguageSelectorProps) {
  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-purple-500/20">
      <h3 className="text-lg font-semibold text-white mb-3">Select Programming Language</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {languages.map((language) => (
          <button
            key={language.id}
            onClick={() => onLanguageSelect(language)}
            className={`p-3 rounded-lg border transition-all duration-200 text-left ${
              selectedLanguage?.id === language.id
                ? 'border-purple-500 bg-purple-600/20 text-white'
                : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-purple-400 hover:bg-purple-600/10 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: language.color }}
              ></div>
              <span className="font-semibold text-sm">{language.name}</span>
            </div>
            <div className="text-xs text-slate-400">
              {language.year} • {language.paradigm[0]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
