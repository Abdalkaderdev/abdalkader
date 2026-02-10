'use client';

import { motion } from 'framer-motion';
import styles from './PillBadge.module.scss';

interface PillBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  cursorText?: string;
}

export default function PillBadge({
  children,
  variant = 'default',
  size = 'md',
  icon,
  href,
  onClick,
  className = '',
  cursorText,
}: PillBadgeProps) {
  const Component = href ? motion.a : motion.span;
  const isInteractive = href || onClick;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${styles.pill} ${styles[variant]} ${styles[size]} ${
        isInteractive ? styles.interactive : ''
      } ${className}`}
      data-cursor={isInteractive ? 'link' : undefined}
      data-cursor-text={cursorText}
      whileHover={isInteractive ? { scale: 1.05 } : undefined}
      whileTap={isInteractive ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.text}>{children}</span>
    </Component>
  );
}

// Grouped pills component
interface PillGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function PillGroup({ children, className = '' }: PillGroupProps) {
  return (
    <div className={`${styles.pillGroup} ${className}`}>
      {children}
    </div>
  );
}
