'use client';

import React from 'react';
import { Language } from '@/lib/types/language';

export type MuseumCardVariant = 'timeline' | 'language' | 'paradigm' | 'code' | 'ai';

export interface MuseumCardProps {
  variant: MuseumCardVariant;
  title: string;
  subtitle?: string;
  description?: string;
  year?: string;
  decade?: string;
  language?: Language;
  paradigm?: string;
  creator?: string;
  code?: string;
  onLanguageSelect?: (language: Language) => void;
  onParadigmSelect?: (paradigm: string) => void;
  onCodeExecute?: (code: string) => void;
  onAIExplain?: (content: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const MuseumCard: React.FC<MuseumCardProps> = ({
  variant,
  title,
  subtitle,
  description,
  year,
  decade,
  language,
  paradigm,
  creator,
  code,
  onLanguageSelect,
  onParadigmSelect,
  onCodeExecute,
  onAIExplain,
  className = '',
  children,
}) => {
  const baseClasses = 'portfolio-card museum-card-entrance interactive-hover';
  const variantClasses = `museum-card-${variant}`;
  
  const handleCardClick = () => {
    if (language && onLanguageSelect) {
      onLanguageSelect(language);
    } else if (paradigm && onParadigmSelect) {
      onParadigmSelect(paradigm);
    } else if (code && onCodeExecute) {
      onCodeExecute(code);
    }
  };

  const handleAIExplain = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAIExplain) {
      const content = description || title;
      onAIExplain(content);
    }
  };

  const renderTimelineCard = () => (
    <div className={`${baseClasses} ${variantClasses} ${className}`} onClick={handleCardClick}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></div>
          <span className="portfolio-small-text text-orange-400">{decade || year}</span>
        </div>
        <button
          onClick={handleAIExplain}
          className="portfolio-small-text text-orange-400 hover:text-orange-300 transition-colors"
        >
          AI EXPLAIN
        </button>
      </div>
      
      <h3 className="portfolio-medium-text text-white mb-2">{title}</h3>
      {subtitle && <p className="portfolio-base-text text-gray-300 mb-3">{subtitle}</p>}
      {description && <p className="text-sm text-gray-400 leading-relaxed">{description}</p>}
      
      {children}
    </div>
  );

  const renderLanguageCard = () => (
    <div className={`${baseClasses} ${variantClasses} ${className}`} onClick={handleCardClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="portfolio-large-text text-white mb-2">{title}</h3>
          {subtitle && <p className="portfolio-base-text text-orange-400 mb-3">{subtitle}</p>}
        </div>
        <button
          onClick={handleAIExplain}
          className="portfolio-small-text text-orange-400 hover:text-orange-300 transition-colors ml-4"
        >
          AI
        </button>
      </div>
      
      <div className="space-y-3">
        {creator && (
          <div className="flex items-center gap-2">
            <span className="portfolio-small-text text-gray-400">CREATOR:</span>
            <span className="portfolio-base-text text-white">{creator}</span>
          </div>
        )}
        
        {year && (
          <div className="flex items-center gap-2">
            <span className="portfolio-small-text text-gray-400">YEAR:</span>
            <span className="portfolio-base-text text-white">{year}</span>
          </div>
        )}
        
        {paradigm && (
          <div className="flex items-center gap-2">
            <span className="portfolio-small-text text-gray-400">PARADIGM:</span>
            <span className="portfolio-base-text text-orange-400">{paradigm}</span>
          </div>
        )}
        
        {description && (
          <p className="text-sm text-gray-300 leading-relaxed mt-4">{description}</p>
        )}
      </div>
      
      {children}
    </div>
  );

  const renderParadigmCard = () => (
    <div className={`${baseClasses} ${variantClasses} ${className}`} onClick={handleCardClick}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="portfolio-large-text text-white mb-2">{title}</h3>
          {subtitle && <p className="portfolio-base-text text-orange-400 mb-3">{subtitle}</p>}
        </div>
        <button
          onClick={handleAIExplain}
          className="portfolio-small-text text-orange-400 hover:text-orange-300 transition-colors ml-4"
        >
          AI
        </button>
      </div>
      
      {description && (
        <p className="text-sm text-gray-300 leading-relaxed mb-4">{description}</p>
      )}
      
      <div className="flex flex-wrap gap-2">
        {language && (
          <span className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30">
            {language.name}
          </span>
        )}
        {year && (
          <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
            {year}
          </span>
        )}
      </div>
      
      {children}
    </div>
  );

  const renderCodeCard = () => (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="portfolio-large-text text-white mb-2">{title}</h3>
          {subtitle && <p className="portfolio-base-text text-orange-400 mb-3">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => code && onCodeExecute?.(code)}
            className="portfolio-small-text text-orange-400 hover:text-orange-300 transition-colors"
          >
            RUN
          </button>
          <button
            onClick={handleAIExplain}
            className="portfolio-small-text text-orange-400 hover:text-orange-300 transition-colors"
          >
            AI
          </button>
        </div>
      </div>
      
      {code && (
        <div className="bg-black/50 rounded-lg p-4 mb-4 font-mono text-sm">
          <pre className="text-green-400 overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      )}
      
      {description && (
        <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
      )}
      
      {children}
    </div>
  );

  const renderAICard = () => (
    <div className={`${baseClasses} ${variantClasses} ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full flex items-center justify-center">
          <span className="text-black text-sm font-bold">AI</span>
        </div>
        <h3 className="portfolio-medium-text text-white">AI EXPLANATION</h3>
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
        
        <div className="flex gap-2">
          <button
            onClick={() => onAIExplain?.(title)}
            className="portfolio-small-text text-orange-400 hover:text-orange-300 transition-colors"
          >
            LEARN MORE
          </button>
          <button
            onClick={() => onAIExplain?.(description || '')}
            className="portfolio-small-text text-gray-400 hover:text-gray-300 transition-colors"
          >
            DETAILS
          </button>
        </div>
      </div>
      
      {children}
    </div>
  );

  switch (variant) {
    case 'timeline':
      return renderTimelineCard();
    case 'language':
      return renderLanguageCard();
    case 'paradigm':
      return renderParadigmCard();
    case 'code':
      return renderCodeCard();
    case 'ai':
      return renderAICard();
    default:
      return null;
  }
};

export default MuseumCard;