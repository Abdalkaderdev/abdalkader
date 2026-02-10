import React, { useRef, forwardRef, ReactNode } from 'react';
import Link from 'next/link';
import { useMagneticEffect } from '@/hooks/useMagneticEffect';
import styles from './MagneticLink.module.scss';

interface MagneticLinkProps {
    /** URL or path to navigate to */
    href: string;
    /** Link content */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Whether to open link in new tab */
    external?: boolean;
    /** Custom magnetic effect strength (default: 0.3) */
    magneticStrength?: number;
    /** Whether to show underline animation on hover (default: true) */
    showUnderline?: boolean;
    /** Whether to apply scale effect on hover (default: true) */
    showScale?: boolean;
    /** Additional inline styles */
    style?: React.CSSProperties;
    /** Click handler */
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    /** Accessibility label */
    'aria-label'?: string;
}

/**
 * A link component with magnetic hover effect, underline reveal animation,
 * and subtle scale effect. Wraps Next.js Link for internal navigation
 * and uses regular anchor for external links.
 */
export const MagneticLink = forwardRef<HTMLAnchorElement, MagneticLinkProps>(
    (
        {
            href,
            children,
            className = '',
            external = false,
            magneticStrength = 0.3,
            showUnderline = true,
            showScale = true,
            style,
            onClick,
            'aria-label': ariaLabel,
        },
        forwardedRef
    ) => {
        const internalRef = useRef<HTMLAnchorElement>(null);
        const ref = (forwardedRef as React.RefObject<HTMLAnchorElement>) || internalRef;

        const { onMouseMove, onMouseLeave } = useMagneticEffect(ref, {
            strength: magneticStrength,
        });

        const combinedClassName = [
            styles.magneticLink,
            showUnderline && styles.withUnderline,
            showScale && styles.withScale,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const linkContent = (
            <span className={styles.content}>
                {children}
                {showUnderline && <span className={styles.underline} />}
            </span>
        );

        // Handle external vs internal links
        if (external || href.startsWith('http') || href.startsWith('mailto:')) {
            return (
                <a
                    ref={ref}
                    href={href}
                    className={combinedClassName}
                    style={style}
                    target={external || href.startsWith('http') ? '_blank' : undefined}
                    rel={external || href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    onClick={onClick}
                    aria-label={ariaLabel}
                >
                    {linkContent}
                </a>
            );
        }

        return (
            <Link
                ref={ref}
                href={href}
                className={combinedClassName}
                style={style}
                onMouseMove={onMouseMove}
                onMouseLeave={onMouseLeave}
                onClick={onClick}
                aria-label={ariaLabel}
            >
                {linkContent}
            </Link>
        );
    }
);

MagneticLink.displayName = 'MagneticLink';

export default MagneticLink;
