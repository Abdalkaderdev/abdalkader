import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Signpost.module.scss';

interface Verse {
    text: string;
    reference: string;
}

const verses: Verse[] = [
    {
        text: "Lead me, O Lord, in your righteousness. Make your way straight before my eyes.",
        reference: "Psalm 5:8"
    },
    {
        text: "Trust in the Lord with all your heart and lean not on your own understanding.",
        reference: "Proverbs 3:5-6"
    },
    {
        text: "The Lord is my shepherd, I shall not want.",
        reference: "Psalm 23:1"
    },
    {
        text: "Be still, and know that I am God.",
        reference: "Psalm 46:10"
    },
    {
        text: "For I know the plans I have for you, declares the Lord. Plans to prosper you and not to harm you.",
        reference: "Jeremiah 29:11"
    },
    {
        text: "I can do all things through Christ who strengthens me.",
        reference: "Philippians 4:13"
    },
    {
        text: "The Lord will guide you always and satisfy your needs.",
        reference: "Isaiah 58:11"
    },
    {
        text: "Your word is a lamp to my feet and a light to my path.",
        reference: "Psalm 119:105"
    }
];

const AUTO_ADVANCE_DURATION = 12000;

export default function Signpost() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const nextVerse = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % verses.length);
        setProgress(0);
    }, []);

    const prevVerse = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + verses.length) % verses.length);
        setProgress(0);
    }, []);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    nextVerse();
                    return 0;
                }
                return prev + (100 / (AUTO_ADVANCE_DURATION / 50));
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isPaused, nextVerse]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextVerse();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevVerse();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextVerse, prevVerse]);

    const currentVerse = verses[currentIndex];

    // Split verse into lines for signs
    const words = currentVerse.text.split(' ');
    const midPoint = Math.ceil(words.length / 2);
    const line1 = words.slice(0, midPoint).join(' ');
    const line2 = words.slice(midPoint).join(' ');

    return (
        <div
            className={styles.container}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Signpost */}
            <div className={styles.signpostWrapper}>
                {/* Cross */}
                <div className={styles.crossTop}>
                    <div className={styles.crossVertical} />
                    <div className={styles.crossHorizontal} />
                </div>

                {/* Signs - roll behind the cross on transition */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        className={styles.signsContainer}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 1 }}
                    >
                        {/* First sign - rolls right, behind cross, back from left */}
                        <motion.div
                            className={styles.sign}
                            initial={{ x: 0, scale: 0.7, opacity: 0, zIndex: 1 }}
                            animate={{ x: 0, scale: 1, opacity: 1, zIndex: 20 }}
                            exit={{ x: 0, scale: 0.7, opacity: 0, zIndex: 1 }}
                            transition={{
                                duration: 0.7,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            <span className={styles.signText}>{line1}</span>
                        </motion.div>

                        {/* Second sign - rolls left, behind cross, back from right */}
                        <motion.div
                            className={styles.sign}
                            initial={{ x: 0, scale: 0.7, opacity: 0, zIndex: 1 }}
                            animate={{ x: 0, scale: 1, opacity: 1, zIndex: 20 }}
                            exit={{ x: 0, scale: 0.7, opacity: 0, zIndex: 1 }}
                            transition={{
                                duration: 0.7,
                                ease: [0.22, 1, 0.36, 1],
                                delay: 0.1
                            }}
                        >
                            <span className={styles.signText}>{line2}</span>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Reference badge - below the cross */}
            <AnimatePresence mode="wait">
                <motion.div
                    className={styles.referenceBadge}
                    key={`ref-${currentIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                >
                    {currentVerse.reference}
                </motion.div>
            </AnimatePresence>

            {/* Navigation dots */}
            <div className={styles.navigation}>
                {verses.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                        onClick={() => { setCurrentIndex(index); setProgress(0); }}
                        aria-label={`Verse ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress bar */}
            <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}
