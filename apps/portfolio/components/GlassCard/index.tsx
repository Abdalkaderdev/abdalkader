'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, ReactNode, useRef } from 'react';
import { useTiltEffect } from '@/hooks/useTiltEffect';
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
  /** Enable 3D tilt effect on hover */
  tilt?: boolean;
  /** Maximum tilt angle when tilt is enabled (default: 10) */
  maxTilt?: number;
  /** Enable texture overlay */
  textured?: boolean;
  /** Texture type when textured is enabled */
  textureType?: 'noise' | 'brushed' | 'subtle';
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
      tilt = false,
      maxTilt = 10,
      textured = false,
      textureType = 'noise',
      ...motionProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

    // Set up tilt effect if enabled
    const tiltHandlers = useTiltEffect(ref, {
      maxTilt: tilt && !disableAnimations ? maxTilt : 0,
      scale: tilt ? 1.02 : 1,
    });

    // Build class names
    const cardClasses = [
      styles.glassCard,
      styles[variant],
      styles[size],
      hoverEffect && styles.hoverEffect,
      glowOnHover && styles.glowOnHover,
      interactive && styles.interactive,
      tilt && styles.tiltEnabled,
      textured && styles.textured,
      textured && styles[`texture-${textureType}`],
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

    const tiltProps = tilt && !disableAnimations
      ? {
          onMouseEnter: tiltHandlers.onMouseEnter,
          onMouseLeave: tiltHandlers.onMouseLeave,
          onMouseMove: tiltHandlers.onMouseMove,
        }
      : {};

    const cardContent = (
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
        {...tiltProps}
        {...motionProps}
      >
        {/* Texture overlay when textured is enabled */}
        {textured && <div className={styles.textureOverlay} aria-hidden="true" />}

        {header && <div className={styles.header}>{header}</div>}
        <div className={styles.content}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </motion.div>
    );

    // Wrap in perspective container if tilt is enabled
    if (tilt && !disableAnimations) {
      return <div style={{ perspective: '1000px' }}>{cardContent}</div>;
    }

    return cardContent;
  }
);

GlassCard.displayName = 'GlassCard';

export default GlassCard;

// Named export for convenience
export { GlassCard };
