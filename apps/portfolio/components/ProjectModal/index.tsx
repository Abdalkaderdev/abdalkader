import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from './ProjectModal.module.scss';
import { isReducedMotion } from '@/utils/motion';
import Button from '@/components/Button';

type ProjectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    project: {
        title: string;
        category: string[];
        overview: string;
        live?: string;
        github?: string;
        slug: string;
        // Enhanced fields
        problemSolved?: string;
        technicalChallenge?: string;
        resultsAchieved?: {
            metrics?: string[];
            businessImpact?: string;
            userFeedback?: string;
        };
    };
};

// Focus trap utility
const FOCUSABLE_SELECTORS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
    const { title, category, overview, live, github, slug, problemSolved, technicalChallenge, resultsAchieved } = project;
    const [copied, setCopied] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<Element | null>(null);

    // Focus trap handler
    const handleTabKey = useCallback((e: KeyboardEvent) => {
        if (!modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(FOCUSABLE_SELECTORS);
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement?.focus();
            }
        } else {
            if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement?.focus();
            }
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        // Store the currently focused element to restore later
        previousActiveElement.current = document.activeElement;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'Tab') handleTabKey(e);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        // Focus the first focusable element in the modal
        const timer = setTimeout(() => {
            if (modalRef.current) {
                const firstFocusable = modalRef.current.querySelector(FOCUSABLE_SELECTORS) as HTMLElement;
                firstFocusable?.focus();
            }
        }, 50);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            clearTimeout(timer);
            // Restore focus to the previously focused element
            if (previousActiveElement.current instanceof HTMLElement) {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen, onClose, handleTabKey]);

    if (!isOpen) return null;
    const root = typeof window !== 'undefined' ? document.body : null;
    if (!root) return null;

    const copyLink = async () => {
        try {
            const url = new URL(window.location.href);
            url.searchParams.set('project', slug);
            await navigator.clipboard.writeText(url.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // noop
        }
    };

    const content = (
        <div className={styles.backdrop} onClick={onClose}>
            <div
                ref={modalRef}
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                style={isReducedMotion() ? { transition: 'none' } : undefined}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className={styles.header}>
                    <h3 id="modal-title">{title}</h3>
                    <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
                </div>
                <div className={styles.meta}>
                    {category.map((c, i) => (
                        <span key={i}>{c}</span>
                    ))}
                </div>
                {overview && <p className={styles.overview}>{overview}</p>}
                
                {/* Enhanced Business Context */}
                {problemSolved && (
                    <div className={styles.section}>
                        <h4>Problem Solved</h4>
                        <p>{problemSolved}</p>
                    </div>
                )}
                
                {technicalChallenge && (
                    <div className={styles.section}>
                        <h4>Technical Challenge</h4>
                        <p>{technicalChallenge}</p>
                    </div>
                )}
                
                {resultsAchieved && (
                    <div className={styles.section}>
                        <h4>Results Achieved</h4>
                        {resultsAchieved.metrics && (
                            <div className={styles.metrics}>
                                {resultsAchieved.metrics.map((metric, i) => (
                                    <div key={i} className={styles.metric}>{metric}</div>
                                ))}
                            </div>
                        )}
                        {resultsAchieved.businessImpact && (
                            <p>{resultsAchieved.businessImpact}</p>
                        )}
                        {resultsAchieved.userFeedback && (
                            <p className={styles.feedback}>&ldquo;{resultsAchieved.userFeedback}&rdquo;</p>
                        )}
                    </div>
                )}
                
                <div className={styles.actions}>
                    {live && <Button text="Live" href={live} targetBlank />}
                    {github && <Button text="GitHub" href={github} targetBlank />}
                    <button className={styles.copy} onClick={copyLink}>{copied ? 'Copied' : 'Copy link'}</button>
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(content, root);
}

