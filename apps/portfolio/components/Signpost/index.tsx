import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Signpost.module.scss';

interface SignpostVerse {
    lines: string[];
    reference: string;
}

const verses: SignpostVerse[] = [
    {
        lines: ["Lead me,", "Oh Lord", "In your righteousness", "Make your way straight", "before my eyes"],
        reference: "Psalm 5:8"
    },
    {
        lines: ["Trust in the Lord", "with all your heart", "and lean not on", "your own understanding", "In all your ways acknowledge Him"],
        reference: "Proverbs 3:5-6"
    },
    {
        lines: ["The Lord is", "my shepherd", "I shall", "not want", "He leads me"],
        reference: "Psalm 23:1-2"
    },
    {
        lines: ["Be still", "and know", "that I", "am God"],
        reference: "Psalm 46:10"
    },
    {
        lines: ["For I know", "the plans", "I have for you", "plans to prosper", "and not to harm"],
        reference: "Jeremiah 29:11"
    },
    {
        lines: ["I can do", "all things", "through Christ", "who strengthens me"],
        reference: "Philippians 4:13"
    },
    {
        lines: ["The Lord", "will guide you", "always", "and satisfy your needs"],
        reference: "Isaiah 58:11"
    },
    {
        lines: ["Your word", "is a lamp", "to my feet", "and a light", "to my path"],
        reference: "Psalm 119:105"
    }
];

// Alternating directions for signs
const signDirections = ['right', 'left', 'right', 'left', 'right'] as const;
const signRotations = ['-8deg', '6deg', '-5deg', '8deg', '-3deg'];

export default function Signpost() {
    const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const currentVerse = verses[currentVerseIndex];

    // Auto-advance verses
    useEffect(() => {
        const timer = setInterval(() => {
            setIsAnimating(false);
            setTimeout(() => {
                setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
                setIsAnimating(true);
            }, 600);
        }, 25000); // 25 seconds to read each verse

        return () => clearInterval(timer);
    }, []);

    const nextVerse = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
            setIsAnimating(true);
        }, 400);
    };

    const prevVerse = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setCurrentVerseIndex((prev) => (prev - 1 + verses.length) % verses.length);
            setIsAnimating(true);
        }, 400);
    };

    return (
        <div className={styles.signpostContainer}>
            <div className={styles.signpostWrapper}>
                {/* Wooden Post */}
                <motion.div
                    className={styles.post}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <div className={styles.postTexture} />
                </motion.div>

                {/* Signs */}
                <AnimatePresence mode="wait">
                    {isAnimating && (
                        <div className={styles.signsContainer}>
                            {currentVerse.lines.map((line, index) => (
                                <motion.div
                                    key={`${currentVerseIndex}-${index}`}
                                    className={`${styles.sign} ${styles[signDirections[index % signDirections.length]]}`}
                                    style={{
                                        '--rotation': signRotations[index % signRotations.length],
                                        top: `${80 + index * 70}px`
                                    } as React.CSSProperties}
                                    initial={{
                                        opacity: 0,
                                        x: signDirections[index % signDirections.length] === 'right' ? -100 : 100,
                                        rotate: 0
                                    }}
                                    animate={{
                                        opacity: 1,
                                        x: 0,
                                        rotate: signRotations[index % signRotations.length]
                                    }}
                                    exit={{
                                        opacity: 0,
                                        x: signDirections[index % signDirections.length] === 'right' ? 100 : -100
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.15,
                                        ease: [0.22, 1, 0.36, 1]
                                    }}
                                >
                                    <div className={styles.signBoard}>
                                        <div className={styles.signPoint} />
                                        <span className={styles.signText}>{line}</span>
                                        <div className={styles.woodGrain} />
                                    </div>
                                </motion.div>
                            ))}

                            {/* Reference Sign */}
                            <motion.div
                                className={`${styles.sign} ${styles.referenceSign}`}
                                style={{
                                    top: `${80 + currentVerse.lines.length * 70 + 20}px`
                                }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{
                                    duration: 0.6,
                                    delay: currentVerse.lines.length * 0.15 + 0.3,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                            >
                                <div className={styles.signBoard}>
                                    <span className={styles.signText}>{currentVerse.reference}</span>
                                    <div className={styles.woodGrain} />
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Ground */}
                <motion.div
                    className={styles.ground}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                />
            </div>

            {/* Navigation */}
            <div className={styles.navigation}>
                <button onClick={prevVerse} className={styles.navButton} aria-label="Previous verse">
                    &larr;
                </button>
                <span className={styles.verseCount}>
                    {currentVerseIndex + 1} / {verses.length}
                </span>
                <button onClick={nextVerse} className={styles.navButton} aria-label="Next verse">
                    &rarr;
                </button>
            </div>

            <p className={styles.instructions}>
                Click arrows or wait for auto-advance
            </p>
        </div>
    );
}
