'use client';

import { Language } from '@/lib/types/language';
import { Calendar, User, Code2 } from 'lucide-react';

interface LanguageCardProps {
  language: Language;
  onClick: () => void;
  isSelected: boolean;
}

export function LanguageCard({ language, onClick, isSelected }: LanguageCardProps) {
  return (
    <div
      className={`language-card cursor-pointer transform transition-all duration-300 hover:scale-105 ${
        isSelected ? 'ring-2 ring-purple-500 shadow-2xl' : 'hover:shadow-xl'
      }`}
      onClick={onClick}
    >
      <div 
        className="bg-slate-800/90 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 h-full"
        style={{ 
          borderLeftColor: language.color,
          borderLeftWidth: '4px'
        }}
      >
        {/* Language Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{language.name}</h3>
          <div 
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: language.color }}
          ></div>
        </div>

        {/* Year and Creator */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-slate-300">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{language.year}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-300">
            <User className="w-4 h-4" />
            <span className="text-sm">{language.creator}</span>
          </div>
        </div>

        {/* Paradigms */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {language.paradigm.map((paradigm) => (
              <span
                key={paradigm}
                className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full"
              >
                {paradigm}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
          {language.description}
        </p>

        {/* Key Innovations */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">Key Innovations</span>
          </div>
          <div className="space-y-1">
            {language.keyInnovations.slice(0, 2).map((innovation, index) => (
              <div key={index} className="text-slate-300 text-xs">
                • {innovation}
              </div>
            ))}
            {language.keyInnovations.length > 2 && (
              <div className="text-slate-500 text-xs">
                +{language.keyInnovations.length - 2} more...
              </div>
            )}
          </div>
        </div>

        {/* Era Badge */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">{language.era}</span>
          {isSelected && (
            <div className="text-purple-400 text-xs font-semibold">
              Selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
