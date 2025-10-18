'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, History, Code, GitBranch, Brain, Layers } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useReducedMotion } from '@/hooks/useAnimations';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  { id: 'timeline', label: 'Timeline', icon: History },
  { id: 'playground', label: 'Playground', icon: Code },
  { id: 'family-tree', label: 'Family Tree', icon: GitBranch },
  { id: 'paradigms', label: 'Paradigms', icon: Layers },
  { id: 'ai', label: 'AI Assistant', icon: Brain },
  { id: 'exhibitions', label: 'Exhibitions', icon: Layers },
];

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-orange-500/20"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={reducedMotion ? {} : { scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg flex items-center justify-center"
              whileHover={reducedMotion ? {} : { rotate: 360 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <Code className="w-6 h-6 text-black" />
            </motion.div>
            <span className="portfolio-medium-text text-white">
              Programming History Museum
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-orange-500 text-black shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.19, 1, 0.22, 1]
                  }}
                  whileHover={reducedMotion ? {} : { 
                    scale: 1.05,
                    y: -2,
                  }}
                  whileTap={reducedMotion ? {} : { scale: 0.95 }}
                >
                  <motion.div
                    animate={isActive ? { rotate: 360 } : {}}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                  <span className="portfolio-small-text">{item.label}</span>
                </motion.button>
              );
            })}
            
            {/* Theme Toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <ThemeToggle />
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            whileHover={reducedMotion ? {} : { scale: 1.1 }}
            whileTap={reducedMotion ? {} : { scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-orange-500/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        onSectionChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-orange-500 text-black'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.1,
                        ease: [0.19, 1, 0.22, 1]
                      }}
                      whileHover={reducedMotion ? {} : { x: 5 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="portfolio-base-text">{item.label}</span>
                    </motion.button>
                  );
                })}
                
                {/* Mobile Theme Toggle */}
                <motion.div
                  className="flex items-center justify-between px-4 py-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <span className="portfolio-small-text text-gray-300">Theme</span>
                  <ThemeToggle />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
