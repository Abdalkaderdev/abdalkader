'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, Play, Pause } from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useReducedMotion } from '@/hooks/useAnimations';

interface TimelineItem {
  id: string;
  year: number;
  title: string;
  description: string;
  era: string;
  color: string;
  icon: string;
}

interface TouchTimelineProps {
  items: TimelineItem[];
  activeItem?: string;
  onItemSelect?: (item: TimelineItem) => void;
  onPlay?: () => void;
  onPause?: () => void;
  isPlaying?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

export const TouchTimeline: React.FC<TouchTimelineProps> = ({
  items,
  activeItem,
  onItemSelect,
  onPlay,
  onPause,
  isPlaying = false,
  className = '',
  title,
  description,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const { 
    settings, 
    isMobile, 
    isTablet, 
    isDesktop, 
    getResponsiveClasses,
    getAccessibilityClasses,
    shouldAnimate,
    getTouchTargetSize,
    announceToScreenReader
  } = useAccessibility();
  const reducedMotion = useReducedMotion();

  // Sort items by year
  const sortedItems = [...items].sort((a, b) => a.year - b.year);

  // Find current index based on active item
  useEffect(() => {
    if (activeItem) {
      const index = sortedItems.findIndex(item => item.id === activeItem);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [activeItem, sortedItems]);

  // Handle item selection
  const handleItemSelect = useCallback((item: TimelineItem, index: number) => {
    setCurrentIndex(index);
    onItemSelect?.(item);
    announceToScreenReader(`Selected ${item.title} from ${item.year}`);
  }, [onItemSelect, announceToScreenReader]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (currentIndex > 0) {
          const newIndex = currentIndex - 1;
          setCurrentIndex(newIndex);
          onItemSelect?.(sortedItems[newIndex]);
          announceToScreenReader(`Moved to ${sortedItems[newIndex].title}`);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (currentIndex < sortedItems.length - 1) {
          const newIndex = currentIndex + 1;
          setCurrentIndex(newIndex);
          onItemSelect?.(sortedItems[newIndex]);
          announceToScreenReader(`Moved to ${sortedItems[newIndex].title}`);
        }
        break;
      case 'Home':
        e.preventDefault();
        setCurrentIndex(0);
        onItemSelect?.(sortedItems[0]);
        announceToScreenReader(`Moved to first item: ${sortedItems[0].title}`);
        break;
      case 'End':
        e.preventDefault();
        const lastIndex = sortedItems.length - 1;
        setCurrentIndex(lastIndex);
        onItemSelect?.(sortedItems[lastIndex]);
        announceToScreenReader(`Moved to last item: ${sortedItems[lastIndex].title}`);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onItemSelect?.(sortedItems[currentIndex]);
        break;
    }
  }, [currentIndex, sortedItems, onItemSelect, announceToScreenReader]);

  // Handle touch/mouse drag
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
    setDragOffset(0);
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - dragStartX;
    setDragOffset(offset);
  }, [isDragging, dragStartX]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine if we should move to next/previous item
    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0 && currentIndex > 0) {
        // Swipe right - go to previous
        const newIndex = currentIndex - 1;
        setCurrentIndex(newIndex);
        onItemSelect?.(sortedItems[newIndex]);
      } else if (dragOffset < 0 && currentIndex < sortedItems.length - 1) {
        // Swipe left - go to next
        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        onItemSelect?.(sortedItems[newIndex]);
      }
    }
    
    setDragOffset(0);
  }, [isDragging, dragOffset, currentIndex, sortedItems, onItemSelect]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || settings.reducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % sortedItems.length;
        onItemSelect?.(sortedItems[nextIndex]);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, sortedItems, onItemSelect, settings.reducedMotion]);

  // Get responsive classes
  const getTimelineClasses = () => {
    return getResponsiveClasses({
      mobile: 'h-32',
      tablet: 'h-40',
      desktop: 'h-48',
    });
  };

  const getItemClasses = () => {
    return getResponsiveClasses({
      mobile: 'min-w-[200px] h-24 p-3',
      tablet: 'min-w-[250px] h-32 p-4',
      desktop: 'min-w-[300px] h-40 p-6',
    });
  };

  // Animation variants
  const getAnimationVariants = () => {
    if (!shouldAnimate('card')) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };
    }

    return {
      initial: { opacity: 0, x: 50 },
      animate: { 
        opacity: 1, 
        x: 0,
        transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] }
      },
      exit: { 
        opacity: 0, 
        x: -50,
        transition: { duration: 0.3 }
      },
    };
  };

  const animationVariants = getAnimationVariants();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="text-center">
          {title && (
            <h2 className="portfolio-hero-text text-white mb-2">{title}</h2>
          )}
          {description && (
            <p className="portfolio-base-text text-gray-300">{description}</p>
          )}
        </div>
      )}

      {/* Timeline Container */}
      <div
        ref={timelineRef}
        className={`relative overflow-hidden rounded-lg bg-gray-900/50 backdrop-blur-lg border border-gray-700 ${getTimelineClasses()}`}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Timeline navigation"
        aria-live="polite"
      >
        {/* Timeline Line */}
        <div className="absolute left-8 top-1/2 w-1 h-1/2 bg-gradient-to-b from-orange-500 to-orange-400 transform -translate-y-1/2" />

        {/* Items Container */}
        <div className="relative h-full flex items-center overflow-x-auto scrollbar-hide">
          <div 
            className="flex items-center space-x-4 px-8"
            style={{
              transform: `translateX(${-currentIndex * 280 + dragOffset}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {sortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                ref={el => itemRefs.current[index] = el}
                className={`relative cursor-pointer transition-all duration-300 ${getItemClasses()} ${
                  index === currentIndex 
                    ? 'scale-105 z-10' 
                    : 'scale-100 opacity-70'
                }`}
                onClick={() => handleItemSelect(item, index)}
                variants={animationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                whileHover={settings.touchMode ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                role="button"
                tabIndex={0}
                aria-label={`${item.title} from ${item.year}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
              >
                {/* Timeline Node */}
                <div 
                  className={`absolute -left-8 top-1/2 w-4 h-4 rounded-full border-4 border-black transform -translate-y-1/2 ${
                    index === currentIndex ? 'scale-125' : 'scale-100'
                  }`}
                  style={{ backgroundColor: item.color }}
                />

                {/* Item Content */}
                <div className={`bg-black/50 backdrop-blur-lg rounded-lg p-4 border transition-all ${
                  index === currentIndex 
                    ? 'border-orange-500 bg-orange-500/10' 
                    : 'border-gray-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="portfolio-small-text text-orange-400">{item.year}</span>
                  </div>
                  <h3 className="portfolio-medium-text text-white mb-1">{item.title}</h3>
                  <p className="portfolio-small-text text-gray-300 line-clamp-2">{item.description}</p>
                  <div className="mt-2">
                    <span className="px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                      {item.era}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 ml-4">
            <InteractiveButton
              onClick={() => {
                if (currentIndex > 0) {
                  const newIndex = currentIndex - 1;
                  setCurrentIndex(newIndex);
                  onItemSelect?.(sortedItems[newIndex]);
                }
              }}
              disabled={currentIndex === 0}
              variant="ghost"
              size="sm"
              className={`${getTouchTargetSize()} pointer-events-auto`}
              aria-label="Previous item"
            >
              <ChevronLeft className="w-4 h-4" />
            </InteractiveButton>
          </div>

          <div className="flex items-center gap-2 mr-4">
            {(onPlay || onPause) && (
              <InteractiveButton
                onClick={isPlaying ? onPause : onPlay}
                variant="ghost"
                size="sm"
                className={`${getTouchTargetSize()} pointer-events-auto`}
                aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </InteractiveButton>
            )}
            
            <InteractiveButton
              onClick={() => {
                if (currentIndex < sortedItems.length - 1) {
                  const newIndex = currentIndex + 1;
                  setCurrentIndex(newIndex);
                  onItemSelect?.(sortedItems[newIndex]);
                }
              }}
              disabled={currentIndex === sortedItems.length - 1}
              variant="ghost"
              size="sm"
              className={`${getTouchTargetSize()} pointer-events-auto`}
              aria-label="Next item"
            >
              <ChevronRight className="w-4 h-4" />
            </InteractiveButton>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1">
            {sortedItems.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  onItemSelect?.(sortedItems[index]);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-orange-500 scale-125' 
                    : 'bg-gray-600 hover:bg-orange-400'
                }`}
                aria-label={`Go to item ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Current Item Details */}
      {sortedItems[currentIndex] && (
        <motion.div
          key={sortedItems[currentIndex].id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <p className="portfolio-small-text text-gray-400">
            {currentIndex + 1} of {sortedItems.length}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TouchTimeline;