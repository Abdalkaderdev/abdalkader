'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Language } from '@/lib/types/language';
import { usePortfolioAnimations, useReducedMotion } from '@/hooks/useAnimations';

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
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const reducedMotion = useReducedMotion();
  const { cardHoverIn, cardHoverOut, buttonPress } = usePortfolioAnimations();

  // Framer Motion values for 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) / 10);
    y.set((e.clientY - centerY) / 10);
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    
    x.set(0);
    y.set(0);
    setIsHovered(false);
    
    if (cardRef.current) {
      cardHoverOut(cardRef.current);
    }
  };

  const handleMouseEnter = () => {
    if (reducedMotion) return;
    
    setIsHovered(true);
    
    if (cardRef.current) {
      cardHoverIn(cardRef.current);
    }
  };

  const handleButtonClick = (e: React.MouseEvent, callback?: () => void) => {
    e.stopPropagation();
    setIsPressed(true);
    
    if (cardRef.current) {
      buttonPress(cardRef.current);
    }
    
    setTimeout(() => {
      setIsPressed(false);
      callback?.();
    }, 200);
  };

  const renderTimelineCard = () => (
    <motion.div
      ref={cardRef}
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={reducedMotion ? {} : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.19, 1, 0.22, 1],
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div 
            className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            animate={isHovered ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
          />
          <span className="portfolio-small-text text-orange-400">{decade || year}</span>
        </motion.div>
        <motion.button
          onClick={(e) => handleButtonClick(e, () => handleAIExplain(e))}
          className="portfolio-small-text text-orange-400 hover:text-orange-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          AI EXPLAIN
        </motion.button>
      </div>
      
      <motion.h3 
        className="portfolio-medium-text text-white mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {title}
      </motion.h3>
      
      {subtitle && (
        <motion.p 
          className="portfolio-base-text text-gray-300 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {subtitle}
        </motion.p>
      )}
      
      {description && (
        <motion.p 
          className="text-sm text-gray-400 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {description}
        </motion.p>
      )}
      
      {children}
    </motion.div>
  );

  const renderLanguageCard = () => (
    <motion.div
      ref={cardRef}
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={reducedMotion ? {} : { scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.19, 1, 0.22, 1],
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h3 className="portfolio-large-text text-white mb-2">{title}</h3>
          {subtitle && <p className="portfolio-base-text text-orange-400 mb-3">{subtitle}</p>}
        </motion.div>
        <motion.button
          onClick={(e) => handleButtonClick(e, () => handleAIExplain(e))}
          className="portfolio-small-text text-orange-400 hover:text-orange-300 transition-colors ml-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          AI
        </motion.button>
      </div>
      
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {creator && (
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="portfolio-small-text text-gray-400">CREATOR:</span>
            <span className="portfolio-base-text text-white">{creator}</span>
          </motion.div>
        )}
        
        {year && (
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="portfolio-small-text text-gray-400">YEAR:</span>
            <span className="portfolio-base-text text-white">{year}</span>
          </motion.div>
        )}
        
        {paradigm && (
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="portfolio-small-text text-gray-400">PARADIGM:</span>
            <motion.span 
              className="portfolio-base-text text-orange-400"
              whileHover={{ scale: 1.05 }}
            >
              {paradigm}
            </motion.span>
          </motion.div>
        )}
        
        {description && (
          <motion.p 
            className="text-sm text-gray-300 leading-relaxed mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {description}
          </motion.p>
        )}
      </motion.div>
      
      {children}
    </motion.div>
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