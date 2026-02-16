'use client';

import { forwardRef, useRef, ReactNode } from 'react';
import { useTiltEffect } from '@/hooks/useTiltEffect';
import styles from './TiltCard.module.scss';

export interface TiltCardProps {
    /** Content to render inside the card */
    children: ReactNode;
    /** Maximum tilt angle in degrees (default: 15) */
    maxTilt?: number;
    /** Perspective value in pixels (default: 1000) */
    perspective?: number;
    /** Scale on hover (default: 1.02) */
    scale?: number;
    /** Enable glare effect that follows cursor (default: false) */
    glare?: boolean;
    /** Maximum glare opacity (default: 0.3) */
    maxGlare?: number;
    /** Additional CSS class name */
    className?: string;
    /** Disable the tilt effect */
    disabled?: boolean;
    /** Callback when hover starts */
    onHoverStart?: () => void;
    /** Callback when hover ends */
    onHoverEnd?: () => void;
}

/**
 * TiltCard - A wrapper component that adds 3D tilt effect on hover.
 *
 * Cards tilt toward the cursor position using GSAP for smooth animations.
 * Includes optional glare effect and respects prefers-reduced-motion.
 * Automatically disabled on touch devices.
 *
 * @example
 * ```tsx
 * <TiltCard maxTilt={15} glare>
 *   <ProjectCard project={project} />
 * </TiltCard>
 * ```
 */
const TiltCard = forwardRef<HTMLDivElement, TiltCardProps>(
    (
        {
            children,
            maxTilt = 15,
            perspective = 1000,
            scale = 1.02,
            glare = false,
            maxGlare = 0.3,
            className = '',
            disabled = false,
            onHoverStart,
            onHoverEnd,
        },
        forwardedRef
    ) => {
        const internalRef = useRef<HTMLDivElement>(null);

        // Use forwarded ref if provided, otherwise use internal ref
        const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

        const { onMouseMove, onMouseEnter, onMouseLeave, state } = useTiltEffect(
            ref,
            {
                maxTilt,
                perspective,
                scale,
                glare,
                maxGlare,
            }
        );

        // Build class names
        const cardClasses = [
            styles.tiltCard,
            state.isHovering && styles.hovering,
            state.isTouchDevice && styles.touchDevice,
            disabled && styles.disabled,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!disabled) {
                onMouseEnter(e);
                onHoverStart?.();
            }
        };

        const handleMouseLeave = () => {
            if (!disabled) {
                onMouseLeave();
                onHoverEnd?.();
            }
        };

        const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
            if (!disabled) {
                onMouseMove(e);
            }
        };

        return (
            <div className={styles.tiltWrapper} style={{ perspective: `${perspective}px` }}>
                <div
                    ref={ref}
                    className={cardClasses}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                >
                    {children}
                </div>
            </div>
        );
    }
);

TiltCard.displayName = 'TiltCard';

export default TiltCard;

export { TiltCard };
