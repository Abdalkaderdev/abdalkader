'use client';

import { forwardRef, ReactNode, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import styles from './SkeuomorphicButton.module.scss';

export type SkeuomorphicButtonVariant = 'primary' | 'gold' | 'dark';
export type SkeuomorphicButtonSize = 'sm' | 'md' | 'lg';

export interface SkeuomorphicButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
    /** Button content */
    children: ReactNode;
    /** Visual variant */
    variant?: SkeuomorphicButtonVariant;
    /** Button size */
    size?: SkeuomorphicButtonSize;
    /** If provided, renders as a link */
    href?: string;
    /** Open link in new tab */
    targetBlank?: boolean;
    /** Full width button */
    fullWidth?: boolean;
    /** Additional CSS class name */
    className?: string;
    /** Loading state */
    loading?: boolean;
    /** Icon to display before text */
    iconBefore?: ReactNode;
    /** Icon to display after text */
    iconAfter?: ReactNode;
}

/**
 * SkeuomorphicButton - A 3D pressable button with realistic depth.
 *
 * Features:
 * - Gradient background (light → base → dark)
 * - Bottom shadow that creates 3D depth
 * - Top highlight shine
 * - Lifts on hover, pushes down on active
 * - Multiple color variants
 *
 * Visual representation:
 * ```
 * ┌────────────────────┐  ← Highlight shine
 * │    BUTTON TEXT     │  ← Gradient fill
 * └────────────────────┘
 *  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀   ← Bottom shadow (depth)
 * ```
 *
 * @example
 * ```tsx
 * <SkeuomorphicButton variant="primary" size="lg" href="/contact">
 *   Let's Talk
 * </SkeuomorphicButton>
 * ```
 */
const SkeuomorphicButton = forwardRef<
    HTMLButtonElement | HTMLAnchorElement,
    SkeuomorphicButtonProps
>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            href,
            targetBlank = false,
            fullWidth = false,
            className = '',
            loading = false,
            iconBefore,
            iconAfter,
            disabled,
            ...buttonProps
        },
        ref
    ) => {
        // Build class names
        const buttonClasses = [
            styles.skeuomorphicButton,
            styles[variant],
            styles[size],
            fullWidth && styles.fullWidth,
            loading && styles.loading,
            disabled && styles.disabled,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const content = (
            <>
                {loading && (
                    <span className={styles.spinner} aria-hidden="true">
                        <span className={styles.spinnerDot} />
                        <span className={styles.spinnerDot} />
                        <span className={styles.spinnerDot} />
                    </span>
                )}
                <span className={styles.content} style={{ opacity: loading ? 0 : 1 }}>
                    {iconBefore && <span className={styles.iconBefore}>{iconBefore}</span>}
                    <span className={styles.text}>{children}</span>
                    {iconAfter && <span className={styles.iconAfter}>{iconAfter}</span>}
                </span>
            </>
        );

        // Render as link if href is provided
        if (href) {
            return (
                <Link
                    href={href}
                    className={buttonClasses}
                    target={targetBlank ? '_blank' : undefined}
                    rel={targetBlank ? 'noopener noreferrer' : undefined}
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    aria-disabled={disabled || loading}
                >
                    {content}
                </Link>
            );
        }

        // Render as button
        return (
            <button
                type="button"
                className={buttonClasses}
                disabled={disabled || loading}
                ref={ref as React.Ref<HTMLButtonElement>}
                {...buttonProps}
            >
                {content}
            </button>
        );
    }
);

SkeuomorphicButton.displayName = 'SkeuomorphicButton';

export default SkeuomorphicButton;

export { SkeuomorphicButton };
