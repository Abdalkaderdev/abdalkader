import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './ProjectModal.module.scss';
import { isReducedMotion } from '@/utils/motion';
import Button from '@/components/Button';

type ProjectModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    categories: string[];
    overview?: string;
    live?: string;
    github?: string;
    slug: string;
};

export default function ProjectModal({ isOpen, onClose, title, categories, overview, live, github, slug }: ProjectModalProps) {
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
                    {categories.map((c, i) => (
                        <span key={i}>{c}</span>
                    ))}
                </div>
                {overview && <p className={styles.overview}>{overview}</p>}
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

