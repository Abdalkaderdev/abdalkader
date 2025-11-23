import React, { useEffect, useState } from 'react';
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

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
    const { title, category, overview, live, github, slug, problemSolved, technicalChallenge, resultsAchieved } = project;
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

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
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                style={isReducedMotion() ? { transition: 'none' } : undefined}
            >
                <div className={styles.header}>
                    <h3>{title}</h3>
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

