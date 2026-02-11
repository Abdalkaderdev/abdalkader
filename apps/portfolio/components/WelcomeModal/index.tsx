import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WelcomeModal.module.scss';

// Focus trap utility
const FOCUSABLE_SELECTORS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface WelcomeModalProps {
    onMusicToggle: (enabled: boolean) => void;
}

const STORAGE_KEY = 'portfolio-welcomed';
const MUSIC_PREF_KEY = 'portfolio-music-enabled';

export default function WelcomeModal({ onMusicToggle }: WelcomeModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [musicEnabled, setMusicEnabled] = useState(false);
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
        // Check if user has visited before
        const hasVisited = localStorage.getItem(STORAGE_KEY);
        if (!hasVisited) {
            // Small delay for better UX after page load
            const timer = setTimeout(() => setIsOpen(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Focus trap effect
    useEffect(() => {
        if (!isOpen) return;

        // Store the currently focused element to restore later
        previousActiveElement.current = document.activeElement;

        const handleKeyDown = (e: KeyboardEvent) => {
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
    }, [isOpen, handleTabKey]);

    const handleMusicToggle = useCallback(() => {
        setMusicEnabled(prev => !prev);
    }, []);

    const handleEnter = useCallback(() => {
        localStorage.setItem(STORAGE_KEY, 'true');
        localStorage.setItem(MUSIC_PREF_KEY, musicEnabled ? 'true' : 'false');
        onMusicToggle(musicEnabled);
        setIsOpen(false);
    }, [musicEnabled, onMusicToggle]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleEnter();
        }
    }, [handleEnter]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <motion.div
                        ref={modalRef}
                        className={styles.modal}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="welcome-title"
                        onKeyDown={handleKeyDown}
                    >
                        {/* Cross Icon */}
                        <div className={styles.crossIcon} aria-hidden="true">
                            <svg viewBox="0 0 100 100" width="40" height="40">
                                <line x1="50" y1="15" x2="50" y2="85" stroke="currentColor" strokeWidth="2" />
                                <line x1="25" y1="38" x2="75" y2="38" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </div>

                        <h2 id="welcome-title" className={styles.title}>Welcome</h2>

                        <p className={styles.greeting}>
                            Peace be with you. Thank you for visiting my portfolio.
                            May you find inspiration in the work shared here.
                        </p>

                        <div className={styles.musicToggle}>
                            <label className={styles.toggleLabel}>
                                <span className={styles.toggleText}>Enable ambient music</span>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={musicEnabled}
                                    className={`${styles.toggle} ${musicEnabled ? styles.active : ''}`}
                                    onClick={handleMusicToggle}
                                >
                                    <span className={styles.toggleThumb} />
                                </button>
                            </label>
                            <span className={styles.toggleHint}>
                                Soft worship instrumental for a peaceful experience
                            </span>
                        </div>

                        <button
                            type="button"
                            className={styles.enterButton}
                            onClick={handleEnter}
                        >
                            Enter
                        </button>

                        <p className={styles.verse}>
                            &ldquo;The Lord bless you and keep you&rdquo; &mdash; Numbers 6:24
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
