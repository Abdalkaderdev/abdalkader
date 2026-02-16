'use client';

import Link from 'next/link';
import styles from './SlideButton.module.scss';

export type SlideButtonVariant = 'primary' | 'secondary' | 'outline' | 'gold';
export type SlideButtonSize = 'sm' | 'md' | 'lg';

interface SlideButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: SlideButtonVariant;
    size?: SlideButtonSize;
    className?: string;
    external?: boolean;
    disabled?: boolean;
}

export default function SlideButton({
    children,
    href,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    external = false,
    disabled = false,
}: SlideButtonProps) {
    const buttonClasses = [
        styles.slideButton,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const content = (
        <span className={styles.textWrapper}>
            <span className={styles.textInner}>
                <span className={styles.text}>{children}</span>
                <span className={styles.text}>{children}</span>
            </span>
        </span>
    );

    if (href && !disabled) {
        if (external) {
            return (
                <a
                    href={href}
                    className={buttonClasses}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {content}
                </a>
            );
        }
        return (
            <Link href={href} className={buttonClasses}>
                {content}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className={buttonClasses}
            disabled={disabled}
        >
            {content}
        </button>
    );
}

export { SlideButton };
