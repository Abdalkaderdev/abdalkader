'use client';

import { forwardRef, ReactNode } from 'react';
import styles from './EmbossedText.module.scss';

export type EmbossedTextVariant = 'raised' | 'sunken' | 'subtle';
export type EmbossedTextSize = 'sm' | 'md' | 'lg' | 'xl';

export interface EmbossedTextProps {
    /** The HTML element to render as */
    as?: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div';
    /** Text content */
    children: ReactNode;
    /** Effect variant */
    variant?: EmbossedTextVariant;
    /** Text size preset */
    size?: EmbossedTextSize;
    /** Use gradient color */
    gradient?: boolean;
    /** Additional CSS class name */
    className?: string;
}

/**
 * EmbossedText - Text with embossed (raised) or debossed (sunken) effect.
 *
 * Uses light/shadow text-shadows to create the illusion of depth.
 * Embossed text appears to pop out from the surface.
 * Debossed text appears pressed into the surface.
 *
 * @example
 * ```tsx
 * // Raised heading
 * <EmbossedText as="h2" variant="raised" size="lg">
 *   Projects
 * </EmbossedText>
 *
 * // Sunken badge text
 * <EmbossedText variant="sunken" size="sm">
 *   Featured
 * </EmbossedText>
 * ```
 */
const EmbossedText = forwardRef<HTMLElement, EmbossedTextProps>(
    (
        {
            as: Component = 'span',
            children,
            variant = 'raised',
            size = 'md',
            gradient = false,
            className = '',
        },
        ref
    ) => {
        const textClasses = [
            styles.embossedText,
            styles[variant],
            styles[size],
            gradient && styles.gradient,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        // Use a type assertion to handle the dynamic component
        const Element = Component as keyof JSX.IntrinsicElements;

        return (
            // @ts-expect-error - Dynamic element with ref
            <Element ref={ref} className={textClasses}>
                {children}
            </Element>
        );
    }
);

EmbossedText.displayName = 'EmbossedText';

export default EmbossedText;

export { EmbossedText };
