import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WelcomeModal.module.scss';

// Focus trap utility
const FOCUSABLE_SELECTORS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

interface WelcomeModalProps {
    onMusicToggle: (enabled: boolean) => void;
}

const MUSIC_PREF_KEY = 'portfolio-music-enabled';
const ENTERED_KEY = 'portfolio-entered';

// Bible verses for the welcome modal
const VERSES = [
    { text: "The Lord bless you and keep you", reference: "Numbers 6:24" },
    { text: "I can do all things through Christ who strengthens me", reference: "Philippians 4:13" },
    { text: "For I know the plans I have for you, declares the Lord", reference: "Jeremiah 29:11" },
    { text: "Trust in the Lord with all your heart", reference: "Proverbs 3:5" },
    { text: "Be strong and courageous. Do not be afraid", reference: "Joshua 1:9" },
    { text: "The Lord is my shepherd, I shall not want", reference: "Psalm 23:1" },
    { text: "God is our refuge and strength, an ever-present help", reference: "Psalm 46:1" },
    { text: "Let your light shine before others", reference: "Matthew 5:16" },
    { text: "With God all things are possible", reference: "Matthew 19:26" },
    { text: "Peace I leave with you; my peace I give you", reference: "John 14:27" },
];

export default function WelcomeModal({ onMusicToggle }: WelcomeModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [musicEnabled, setMusicEnabled] = useState(false);
    const [verse, setVerse] = useState(VERSES[0]);
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
        // Check if user has already entered (SSR-safe)
        if (typeof window !== 'undefined') {
            const hasEntered = localStorage.getItem(ENTERED_KEY);
            if (hasEntered) {
                // User has already entered, don't show modal
                // Load music preference and apply it
                const savedMusicPref = localStorage.getItem(MUSIC_PREF_KEY);
                if (savedMusicPref === 'true') {
                    onMusicToggle(true);
                }
                // Dispatch event so Hero knows to start its animation immediately
                window.dispatchEvent(new CustomEvent('welcomeModalClosed'));
                return;
            }
        }

        // Show modal on first visit with a small delay for better UX
        const timer = setTimeout(() => {
            // Pick a random verse
            setVerse(VERSES[Math.floor(Math.random() * VERSES.length)]);
            setIsOpen(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, [onMusicToggle]);

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
        // Save that user has entered (persistent across sessions)
        localStorage.setItem(ENTERED_KEY, 'true');
        localStorage.setItem(MUSIC_PREF_KEY, musicEnabled ? 'true' : 'false');
        onMusicToggle(musicEnabled);
        setIsOpen(false);
        // Dispatch event so Hero knows to start its animation
        window.dispatchEvent(new CustomEvent('welcomeModalClosed'));
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
                        {/* Cross Icon - White elegant cross */}
                        <div className={styles.crossIcon} aria-hidden="true">
                            ✝
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
                            &ldquo;{verse.text}&rdquo; &mdash; {verse.reference}
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
