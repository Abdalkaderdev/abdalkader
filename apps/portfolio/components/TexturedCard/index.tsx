'use client';

import { forwardRef, useRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useTiltEffect } from '@/hooks/useTiltEffect';
import styles from './TexturedCard.module.scss';

export type TexturedCardTexture = 'noise' | 'brushed' | 'subtle' | 'none';
export type TexturedCardElevation = 'low' | 'medium' | 'high';
export type TexturedCardVariant = 'default' | 'primary' | 'dark' | 'glass';

export interface TexturedCardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
    /** Content to render inside the card */
    children: ReactNode;
    /** Texture overlay type */
    texture?: TexturedCardTexture;
    /** Shadow elevation */
    elevation?: TexturedCardElevation;
    /** Visual variant */
    variant?: TexturedCardVariant;
    /** Enable 3D tilt effect on hover */
    tilt?: boolean;
    /** Maximum tilt angle when tilt is enabled (default: 10) */
    maxTilt?: number;
    /** Enable glare effect when tilt is enabled */
    glare?: boolean;
    /** Enable hover lift effect */
    hoverLift?: boolean;
    /** Border radius size */
    rounded?: 'sm' | 'md' | 'lg';
    /** Padding size */
    padding?: 'sm' | 'md' | 'lg' | 'none';
    /** Header content */
    header?: ReactNode;
    /** Footer content */
    footer?: ReactNode;
    /** Additional CSS class name */
    className?: string;
    /** Disable all animations */
    disableAnimations?: boolean;
}

/**
 * TexturedCard - A card component with noise/grain overlay and multi-layer shadows.
 *
 * Features:
 * - Noise/grain texture overlay (SVG-based, no images)
 * - Multi-layer shadows for realistic depth
 * - Optional brushed metal effect
 * - Integrates with TiltCard for 3D effect
 * - Hover lift animation
 *
 * @example
 * ```tsx
 * <TexturedCard texture="noise" elevation="medium" tilt>
 *   <h3>Card Content</h3>
 * </TexturedCard>
 * ```
 */
const TexturedCard = forwardRef<HTMLDivElement, TexturedCardProps>(
    (
        {
            children,
            texture = 'noise',
            elevation = 'medium',
            variant = 'default',
            tilt = false,
            maxTilt = 10,
            glare = false,
            hoverLift = true,
            rounded = 'md',
            padding = 'md',
            header,
            footer,
            className = '',
            disableAnimations = false,
            ...motionProps
        },
        forwardedRef
    ) => {
        const internalRef = useRef<HTMLDivElement>(null);
        const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

        // Set up tilt effect if enabled
        const tiltHandlers = useTiltEffect(ref, {
            maxTilt: tilt ? maxTilt : 0,
            glare: tilt && glare,
            scale: tilt ? 1.02 : 1,
        });

        // Build class names
        const cardClasses = [
            styles.texturedCard,
            styles[`texture-${texture}`],
            styles[`elevation-${elevation}`],
            styles[variant],
            styles[`rounded-${rounded}`],
            styles[`padding-${padding}`],
            hoverLift && styles.hoverLift,
            tilt && styles.tiltEnabled,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        // Animation variants
        const hoverAnimations =
            !disableAnimations && hoverLift
                ? {
                      whileHover: {
                          y: -4,
                          transition: {
                              duration: 0.3,
                              ease: [0.19, 1, 0.22, 1],
                          },
                      },
                  }
                : {};

        const wrapperStyle = tilt ? { perspective: '1000px' } : {};

        const cardContent = (
            <motion.div
                ref={ref}
                className={cardClasses}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    ease: [0.19, 1, 0.22, 1],
                }}
                {...hoverAnimations}
                {...(tilt
                    ? {
                          onMouseEnter: tiltHandlers.onMouseEnter,
                          onMouseLeave: tiltHandlers.onMouseLeave,
                          onMouseMove: tiltHandlers.onMouseMove,
                      }
                    : {})}
                {...motionProps}
            >
                {/* Texture overlay */}
                <div className={styles.textureOverlay} aria-hidden="true" />

                {/* Light source highlight */}
                <div className={styles.lightSource} aria-hidden="true" />

                {/* Content */}
                {header && <div className={styles.header}>{header}</div>}
                <div className={styles.content}>{children}</div>
                {footer && <div className={styles.footer}>{footer}</div>}
            </motion.div>
        );

        // Wrap in perspective container if tilt is enabled
        if (tilt) {
            return <div style={wrapperStyle}>{cardContent}</div>;
        }

        return cardContent;
    }
);

TexturedCard.displayName = 'TexturedCard';

export default TexturedCard;

export { TexturedCard };
