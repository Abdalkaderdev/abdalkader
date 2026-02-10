'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import styles from './GlassCard.module.scss';

export type GlassCardVariant = 'default' | 'primary' | 'dark';
export type GlassCardSize = 'sm' | 'md' | 'lg' | 'xl';

export interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  /** Content to render inside the card */
  children: ReactNode;
  /** Visual variant of the card */
  variant?: GlassCardVariant;
  /** Size of the card (affects padding and border-radius) */
  size?: GlassCardSize;
  /** Header content to render at the top */
  header?: ReactNode;
  /** Footer content to render at the bottom */
  footer?: ReactNode;
  /** Enable hover effects */
  hoverEffect?: boolean;
  /** Enable glow effect on hover */
  glowOnHover?: boolean;
  /** Make the card interactive (clickable) */
  interactive?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Custom cursor text for the cursor component */
  cursorText?: string;
  /** Whether to disable animations */
  disableAnimations?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      variant = 'default',
      size = 'md',
      header,
      footer,
      hoverEffect = false,
      glowOnHover = false,
      interactive = false,
      className = '',
      cursorText,
      disableAnimations = false,
      ...motionProps
    },
    ref
  ) => {
    // Build class names
    const cardClasses = [
      styles.glassCard,
      styles[variant],
      styles[size],
      hoverEffect && styles.hoverEffect,
      glowOnHover && styles.glowOnHover,
      interactive && styles.interactive,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    // Animation variants for framer-motion
    const hoverAnimations = !disableAnimations && (hoverEffect || interactive)
      ? {
          whileHover: {
            y: -4,
            scale: 1.01,
            transition: {
              duration: 0.3,
              ease: [0.19, 1, 0.22, 1],
            },
          },
          whileTap: interactive
            ? {
                scale: 0.98,
                transition: {
                  duration: 0.1,
                },
              }
            : undefined,
        }
      : {};

    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        data-cursor={interactive ? 'link' : undefined}
        data-cursor-text={cursorText}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.19, 1, 0.22, 1],
        }}
        {...hoverAnimations}
        {...motionProps}
      >
        {header && <div className={styles.header}>{header}</div>}
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;

// Named export for convenience
export { GlassCard };
