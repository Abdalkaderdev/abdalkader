'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useReducedMotion } from '@/hooks/useAnimations';

interface HeroProps {
  title: string;
  subtitle: string;
  onExplore: () => void;
}

export function Hero({ title, subtitle, onExplore }: HeroProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="text-center py-20 px-4 relative overflow-hidden">
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-400/10"
        animate={reducedMotion ? {} : {
          background: [
            'linear-gradient(45deg, rgba(244, 78, 0, 0.1), rgba(250, 115, 0, 0.05))',
            'linear-gradient(135deg, rgba(250, 115, 0, 0.1), rgba(244, 78, 0, 0.05))',
            'linear-gradient(225deg, rgba(244, 78, 0, 0.1), rgba(250, 115, 0, 0.05))',
            'linear-gradient(315deg, rgba(250, 115, 0, 0.1), rgba(244, 78, 0, 0.05))',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating particles */}
      {!reducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            ease: [0.19, 1, 0.22, 1],
            type: 'spring',
            stiffness: 100,
            damping: 20,
          }}
        >
          <motion.div
            animate={reducedMotion ? {} : { rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-8 h-8 text-orange-400 mr-3" />
          </motion.div>
          <h1 className="portfolio-hero-text text-white mb-4 portfolio-gradient-text">
            {title}
          </h1>
          <motion.div
            animate={reducedMotion ? {} : { rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <Sparkles className="w-8 h-8 text-orange-400 ml-3" />
          </motion.div>
        </motion.div>
        
        <motion.p 
          className="portfolio-large-text text-gray-300 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.19, 1, 0.22, 1],
          }}
        >
          {subtitle}
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: [0.19, 1, 0.22, 1],
          }}
        >
          <InteractiveButton
            onClick={onExplore}
            variant="primary"
            size="lg"
            magnetic
            ripple
            className="group"
          >
            <span>START EXPLORING</span>
            <motion.div
              animate={reducedMotion ? {} : { x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ArrowRight className="w-5 h-5 ml-2" />
            </motion.div>
          </InteractiveButton>
          
          <div className="text-gray-400 text-sm">
            Powered by <span className="text-orange-400 font-semibold">Groq AI</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.9,
            ease: [0.19, 1, 0.22, 1],
          }}
        >
          {[
            { value: '180+', label: 'Years of History', color: 'text-orange-400' },
            { value: '25+', label: 'Programming Languages', color: 'text-orange-300' },
            { value: '5+', label: 'Programming Paradigms', color: 'text-orange-500' },
            { value: 'AI', label: 'Powered Explanations', color: 'text-orange-400' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="portfolio-card-glass p-4"
              whileHover={reducedMotion ? {} : { scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className={`text-2xl font-bold ${stat.color} mb-1`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: 1.2 + index * 0.1,
                  ease: [0.19, 1, 0.22, 1],
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
