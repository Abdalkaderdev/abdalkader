'use client';

import { motion } from 'framer-motion';
import { Language } from '@/lib/types/language';
import { Calendar, User, Code2, Sparkles } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { useReducedMotion } from '@/hooks/useAnimations';

interface LanguageCardProps {
  language: Language;
  onClick: () => void;
  isSelected: boolean;
}

export function LanguageCard({ language, onClick, isSelected }: LanguageCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <InteractiveCard
      variant="language"
      onClick={onClick}
      className={`group ${isSelected ? 'ring-2 ring-orange-500 shadow-2xl' : ''}`}
      tilt
      glow
    >
      {/* Language Header */}
      <motion.div 
        className="flex items-center justify-between mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="portfolio-large-text text-white">{language.name}</h3>
        <motion.div 
          className="relative"
          whileHover={reducedMotion ? {} : { scale: 1.2, rotate: 180 }}
          transition={{ duration: 0.3 }}
        >
          <div 
            className="w-6 h-6 rounded-full shadow-lg"
            style={{ backgroundColor: language.color }}
          />
          {isSelected && (
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Year and Creator */}
      <motion.div 
        className="space-y-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
      >
        <motion.div 
          className="flex items-center space-x-3 text-gray-300"
          whileHover={reducedMotion ? {} : { x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <Calendar className="w-4 h-4 text-orange-400" />
          <span className="portfolio-base-text">{language.year}</span>
        </motion.div>
        <motion.div 
          className="flex items-center space-x-3 text-gray-300"
          whileHover={reducedMotion ? {} : { x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <User className="w-4 h-4 text-orange-400" />
          <span className="portfolio-base-text">{language.creator}</span>
        </motion.div>
      </motion.div>

      {/* Paradigms */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h4 className="portfolio-small-text text-orange-400 mb-3">PARADIGMS</h4>
        <div className="flex flex-wrap gap-2">
          {language.paradigm.map((paradigm, index) => (
            <motion.span
              key={paradigm}
              className="px-3 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full border border-orange-500/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.3 + index * 0.1, 
                duration: 0.3,
                type: 'spring',
                stiffness: 200,
              }}
              whileHover={reducedMotion ? {} : { 
                scale: 1.05,
                backgroundColor: 'rgba(244, 78, 0, 0.3)',
              }}
            >
              {paradigm}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Description */}
      <motion.p 
        className="text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {language.description}
      </motion.p>

      {/* Key Innovations */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex items-center space-x-2 mb-3">
          <Code2 className="w-4 h-4 text-orange-400" />
          <span className="portfolio-small-text text-orange-400">KEY INNOVATIONS</span>
        </div>
        <div className="space-y-2">
          {language.keyInnovations.slice(0, 2).map((innovation, index) => (
            <motion.div 
              key={index} 
              className="flex items-start space-x-2 text-gray-300 text-xs"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            >
              <motion.span 
                className="text-orange-400 mt-1"
                animate={reducedMotion ? {} : { scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
              >
                •
              </motion.span>
              <span>{innovation}</span>
            </motion.div>
          ))}
          {language.keyInnovations.length > 2 && (
            <motion.div 
              className="text-gray-500 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              +{language.keyInnovations.length - 2} more innovations...
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Era Badge and Status */}
      <motion.div 
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <span className="portfolio-small-text text-gray-500">{language.era}</span>
        {isSelected && (
          <motion.div 
            className="flex items-center space-x-1 text-orange-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: 'spring', 
              stiffness: 200, 
              damping: 10 
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span className="portfolio-small-text font-semibold">SELECTED</span>
          </motion.div>
        )}
      </motion.div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-400/5 opacity-0 rounded-lg"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </InteractiveCard>
  );
}
