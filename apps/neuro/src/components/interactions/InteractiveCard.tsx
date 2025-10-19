'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useAnimations';

interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'timeline' | 'language' | 'paradigm' | 'code' | 'ai';
  tilt?: boolean;
  glow?: boolean;
  magnetic?: boolean;
  delay?: number;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  className = '',
  variant = 'timeline',
  tilt = true,
  glow = true,
  magnetic = false,
  delay = 0,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const reducedMotion = useReducedMotion();

  // 3D tilt effect values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  // Magnetic effect values
  const magneticX = useMotionValue(0);
  const magneticY = useMotionValue(0);
  const magneticSpringX = useSpring(magneticX, { stiffness: 200, damping: 25 });
  const magneticSpringY = useSpring(magneticY, { stiffness: 200, damping: 25 });

  const getVariantClasses = () => {
    switch (variant) {
      case 'timeline':
        return 'museum-card-timeline';
      case 'language':
        return 'museum-card-language';
      case 'paradigm':
        return 'museum-card-paradigm';
      case 'code':
        return 'museum-card-code';
      case 'ai':
        return 'museum-card-ai';
      default:
        return 'portfolio-card';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    if (tilt) {
      x.set(mouseX / 10);
      y.set(mouseY / 10);
    }

    if (magnetic) {
      magneticX.set(mouseX / 20);
      magneticY.set(mouseY / 20);
    }
  };

  const handleMouseLeave = () => {
    if (reducedMotion) return;
    
    x.set(0);
    y.set(0);
    magneticX.set(0);
    magneticY.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (reducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={`
        ${getVariantClasses()}
        ${className}
        relative overflow-hidden
        cursor-pointer
        transition-all duration-300
      `}
      style={{
        rotateX: tilt && !reducedMotion ? rotateX : 0,
        rotateY: tilt && !reducedMotion ? rotateY : 0,
        x: magnetic && !reducedMotion ? magneticSpringX : 0,
        y: magnetic && !reducedMotion ? magneticSpringY : 0,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: isPressed ? 0.98 : 1,
      }}
      whileHover={reducedMotion ? {} : { 
        scale: 1.02,
        y: -8,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.19, 1, 0.22, 1],
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
    >
      {/* Glow effect */}
      {glow && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-400/10 opacity-0 rounded-lg"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? ['0%', '100%'] : '0%',
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          transform: 'translateX(-100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover border effect */}
      <motion.div
        className="absolute inset-0 border border-orange-500/30 rounded-lg opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Press effect */}
      <motion.div
        className="absolute inset-0 bg-black/20 rounded-lg opacity-0"
        animate={{
          opacity: isPressed ? 1 : 0,
        }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

export default InteractiveCard;